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
import { toPrismaBloodGroup, toPrismaGender } from '../types/shared.js';

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

    const isMatch = await bcrypt.compare(data.password, user.password);
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

    return user;
  }

  /**
   * Update profile fields (name, phone, avatarUrl) and optional linked donor profile
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      phone?: string | null;
      avatarUrl?: string | null;
      donor?: {
        bloodGroup?: string;
        gender?: string;
        age?: number;
        district?: string;
        thana?: string;
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

    // Update User core fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.phone !== undefined ? { phone: data.phone?.trim() || null } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
      },
    });

    // If donor details provided, update linked donor profile
    if (data.donor) {
      const existingDonor = await prisma.donor.findUnique({
        where: { userId },
      });

      if (existingDonor) {
        const donorUpdate: any = {};
        if (data.name) donorUpdate.name = data.name.trim();
        if (data.phone !== undefined) donorUpdate.phone = data.phone?.trim() || existingDonor.phone;
        if (data.donor.bloodGroup) donorUpdate.bloodGroup = toPrismaBloodGroup(data.donor.bloodGroup);
        if (data.donor.gender) donorUpdate.gender = toPrismaGender(data.donor.gender);
        if (data.donor.age) donorUpdate.age = data.donor.age;
        if (data.donor.district) donorUpdate.district = data.donor.district.trim();
        if (data.donor.thana) donorUpdate.thana = data.donor.thana.trim();
        if (data.donor.weightKg !== undefined) donorUpdate.weightKg = data.donor.weightKg;
        if (data.donor.totalDonations !== undefined) {
          donorUpdate.totalDonations = Math.max(0, parseInt(String(data.donor.totalDonations), 10) || 0);
        }
        if (data.donor.readyForEmergency !== undefined) donorUpdate.readyForEmergency = data.donor.readyForEmergency;
        if (data.donor.isAvailable !== undefined) donorUpdate.isAvailable = data.donor.isAvailable;

        await prisma.donor.update({
          where: { id: existingDonor.id },
          data: donorUpdate,
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
