import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { env } from '../config/env.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ServiceUnavailableError,
  UnauthorizedError,
} from '../utils/errors.js';
import {
  toPrismaBloodGroup,
  toPrismaGender,
  fromPrismaBloodGroup,
  fromPrismaGender,
  fromPrismaDonorStatus,
} from '../types/shared.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user account
   */
  async register(data: RegisterInput) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Registration cannot be processed.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    // Check if email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    // Hash password securely with bcrypt
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        password: passwordHash,
        phone: data.phone?.trim() || null,
        role: Role.DONOR, // Public registrations are strictly assigned Role.DONOR. Admin/staff accounts must be provisioned internally.
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  /**
   * Authenticate user with email and password
   */
  async login(data: LoginInput) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Login cannot be processed.');
    }

    const normalizedEmail = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('This account has been deactivated. Please contact support.');
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(data.password, user.password);
    } catch {
      isMatch = false;
    }
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get current user profile with linked donor profile if any
   */
  async getProfile(userId: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        donorProfile: {
          select: {
            id: true,
            bloodGroup: true,
            gender: true,
            age: true,
            district: true,
            thana: true,
            address: true,
            status: true,
            isAvailable: true,
            readyForEmergency: true,
            totalDonations: true,
            lastDonationDate: true,
            nextEligibleDate: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User profile not found.');
    }

    return {
      ...user,
      donorProfile: user.donorProfile
        ? {
            ...user.donorProfile,
            bloodGroup: fromPrismaBloodGroup(user.donorProfile.bloodGroup),
            gender: fromPrismaGender(user.donorProfile.gender),
            status: fromPrismaDonorStatus(user.donorProfile.status),
            address: user.donorProfile.address || null,
            lastDonationDate: user.donorProfile.lastDonationDate
              ? user.donorProfile.lastDonationDate.toISOString()
              : null,
            nextEligibleDate: user.donorProfile.nextEligibleDate
              ? user.donorProfile.nextEligibleDate.toISOString()
              : null,
          }
        : null,
    };
  }

  /**
   * Update profile fields (name, email, phone, avatarUrl) and optional linked donor profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string | null;
      avatarUrl?: string | null;
      role?: Role;
      donor?: {
        bloodGroup?: string;
        gender?: string;
        age?: number;
        district?: string;
        thana?: string;
        address?: string | null;
        totalDonations?: number;
        readyForEmergency?: boolean;
        isAvailable?: boolean;
        weightKg?: number | null;
      };
    }
  ) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) {
      throw new NotFoundError('User profile not found.');
    }

    let finalEmail = currentUser.email;
    if (data.email) {
      const normalizedEmail = data.email.trim().toLowerCase();
      if (normalizedEmail !== currentUser.email.toLowerCase()) {
        const existingEmailUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });
        if (existingEmailUser && existingEmailUser.id !== userId) {
          const isSamePerson =
            existingEmailUser.name.trim().toLowerCase() === currentUser.name.trim().toLowerCase() ||
            (existingEmailUser.phone && currentUser.phone && existingEmailUser.phone.trim() === currentUser.phone.trim());
          const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';

          if (isAdmin && isSamePerson) {
            // Deduplicate: Clean up orphaned duplicate shell user if it has no active dependencies
            const [hasRequests, hasDonations] = await Promise.all([
              prisma.bloodRequest.count({ where: { requesterId: existingEmailUser.id } }),
              prisma.bloodDonation.count({ where: { verifiedById: existingEmailUser.id } }),
            ]);

            if (hasRequests === 0 && hasDonations === 0) {
              const dupDonor = await prisma.donor.findUnique({ where: { userId: existingEmailUser.id } });
              if (dupDonor) {
                const donorDeps = await prisma.bloodDonation.count({ where: { donorId: dupDonor.id } });
                if (donorDeps === 0) {
                  await prisma.donor.delete({ where: { id: dupDonor.id } });
                } else {
                  await prisma.donor.update({ where: { id: dupDonor.id }, data: { userId: null } });
                }
              }
              await prisma.user.delete({ where: { id: existingEmailUser.id } });
            } else {
              throw new ConflictError('An account with this email address already exists.');
            }
          } else {
            throw new ConflictError('An account with this email address already exists.');
          }
        }
        finalEmail = normalizedEmail;
      }
    }

    const finalPhone = data.phone !== undefined ? (data.phone?.trim() || null) : currentUser.phone;

    // Update User core fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.email ? { email: finalEmail } : {}),
        ...(data.phone !== undefined ? { phone: finalPhone } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        ...(data.role && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') ? { role: data.role as Role } : {}),
      },
    });

    // Keep legacy AdminUser table in sync if this account is present
    try {
      const legacyAdmin = await prisma.adminUser.findUnique({ where: { email: currentUser.email } });
      if (legacyAdmin) {
        if (finalEmail !== currentUser.email) {
          const existingAdminWithFinal = await prisma.adminUser.findUnique({ where: { email: finalEmail } });
          if (existingAdminWithFinal && existingAdminWithFinal.id !== legacyAdmin.id) {
            await prisma.adminUser.delete({ where: { id: existingAdminWithFinal.id } });
          }
        }
        await prisma.adminUser.update({
          where: { id: legacyAdmin.id },
          data: {
            ...(data.name ? { name: data.name.trim() } : {}),
            ...(data.email ? { email: finalEmail } : {}),
            ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
            ...(data.role ? { role: data.role === 'SUPER_ADMIN' ? 'SuperAdmin' : 'Admin' } : {}),
          },
        });
      }
    } catch {}

    // If donor details provided, update or create linked donor profile
    if (data.donor) {
      let existingDonor = await prisma.donor.findUnique({
        where: { userId },
      });

      // If no donor currently linked to this user, check if an unlinked donor profile exists with this phone
      if (!existingDonor && finalPhone) {
        const donorByPhone = await prisma.donor.findUnique({
          where: { phone: finalPhone },
        });
        if (donorByPhone) {
          if (!donorByPhone.userId) {
            // Claim and link this existing donor record to this user account
            existingDonor = await prisma.donor.update({
              where: { id: donorByPhone.id },
              data: { userId },
            });
          } else if (donorByPhone.userId !== userId) {
            throw new ConflictError('This phone number is already registered to another donor profile.');
          }
        }
      }

      if (existingDonor) {
        const donorUpdate: any = {};
        if (data.name) donorUpdate.name = data.name.trim();
        if (data.email) donorUpdate.email = finalEmail;
        if (finalPhone) donorUpdate.phone = finalPhone;
        if (data.donor.bloodGroup) donorUpdate.bloodGroup = toPrismaBloodGroup(data.donor.bloodGroup);
        if (data.donor.gender) donorUpdate.gender = toPrismaGender(data.donor.gender);
        if (data.donor.age) donorUpdate.age = data.donor.age;
        if (data.donor.district) donorUpdate.district = data.donor.district.trim();
        if (data.donor.thana) donorUpdate.thana = data.donor.thana.trim();
        if (data.donor.address !== undefined) donorUpdate.address = data.donor.address?.trim() || null;
        if (data.donor.weightKg !== undefined) donorUpdate.weightKg = data.donor.weightKg;
        if (data.donor.totalDonations !== undefined) {
          donorUpdate.totalDonations = Math.max(0, parseInt(String(data.donor.totalDonations), 10) || 0);
        }
        if (data.donor.readyForEmergency !== undefined) donorUpdate.readyForEmergency = data.donor.readyForEmergency;
        if (data.donor.isAvailable !== undefined) donorUpdate.isAvailable = data.donor.isAvailable;

        try {
          await prisma.donor.update({
            where: { id: existingDonor.id },
            data: donorUpdate,
          });
        } catch (err: any) {
          if (err.code === 'P2002') {
            throw new ConflictError('A donor profile with this phone number already exists.');
          }
          throw err;
        }
      } else {
        // User does not have a linked donor yet -> create a new Donor record linked to this user
        if (!finalPhone) {
          throw new BadRequestError('A contact phone number is required to save your donor registration.');
        }

        const donorName = (data.name?.trim() || currentUser.name).trim();
        const bloodGroup = data.donor.bloodGroup ? toPrismaBloodGroup(data.donor.bloodGroup) : toPrismaBloodGroup('O+');
        const gender = data.donor.gender ? toPrismaGender(data.donor.gender) : toPrismaGender('Male');
        const age = typeof data.donor.age === 'number' && data.donor.age >= 18 ? data.donor.age : 24;
        const district = data.donor.district?.trim() || 'Dhaka';
        const thana = data.donor.thana?.trim() || 'Central';

        try {
          await prisma.donor.create({
            data: {
              userId,
              name: donorName,
              phone: finalPhone,
              email: finalEmail,
              bloodGroup,
              gender,
              age,
              district,
              thana,
              address: data.donor.address?.trim() || null,
              totalDonations: data.donor.totalDonations !== undefined ? Math.max(0, parseInt(String(data.donor.totalDonations), 10) || 0) : 0,
              readyForEmergency: data.donor.readyForEmergency !== undefined ? data.donor.readyForEmergency : true,
              isAvailable: data.donor.isAvailable !== undefined ? data.donor.isAvailable : true,
              weightKg: data.donor.weightKg || null,
            },
          });
        } catch (err: any) {
          if (err.code === 'P2002') {
            throw new ConflictError('A donor profile with this phone number already exists.');
          }
          throw err;
        }
      }
    } else if (data.email && finalEmail !== currentUser.email) {
      // If email changed without donor payload, sync email to linked donor profile if exists
      const userDonor = await prisma.donor.findUnique({ where: { userId } });
      if (userDonor) {
        await prisma.donor.update({
          where: { id: userDonor.id },
          data: { email: finalEmail },
        });
      }
    }

    return this.getProfile(userId);
  }

  /**
   * Change user password securely
   */
  async changePassword(userId: string, currentPass: string, newPass: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      throw new BadRequestError('Current password does not match our records.');
    }

    const newHash = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });

    return { message: 'Password changed successfully.' };
  }

  private generateToken(userId: string, email: string, role: Role): string {
    return jwt.sign(
      { userId, email, role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }
}
