import { Role } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  Donor,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaGender,
  fromPrismaGender,
  toPrismaDonorStatus,
  fromPrismaDonorStatus,
} from '../types/shared.js';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
} from '../utils/errors.js';
import { AuthenticatedUser } from '../types/express.js';

import { maskEmail } from '../utils/privacy.js';

export class DonorsService {
  async searchDonors(
    query: {
      bloodGroup?: string;
      district?: string;
      thana?: string;
      search?: string;
      status?: string;
      isAvailable?: boolean;
      page?: number;
      limit?: number;
    },
    currentUser?: AuthenticatedUser
  ) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = {};
    if (query.bloodGroup) {
      where.bloodGroup = toPrismaBloodGroup(query.bloodGroup);
    }
    if (query.district) {
      where.district = { contains: query.district, mode: 'insensitive' };
    }
    if (query.thana) {
      where.thana = { contains: query.thana, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = toPrismaDonorStatus(query.status);
    }
    if (query.isAvailable !== undefined) {
      where.isAvailable = query.isAvailable;
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search } },
        { district: { contains: query.search, mode: 'insensitive' } },
        { thana: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const [donors, total] = await Promise.all([
      prisma.donor.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ isAvailable: 'desc' }, { totalDonations: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          userId: true,
          name: true,
          bloodGroup: true,
          gender: true,
          age: true,
          phone: true,
          email: true,
          district: true,
          thana: true,
          lastDonationDate: true,
          totalDonations: true,
          status: true,
          isAvailable: true,
          readyForEmergency: true,
          weightKg: true,
          nextEligibleDate: true,
          createdAt: true,
        },
      }),
      prisma.donor.count({ where }),
    ]);

    const isPrivileged =
      currentUser &&
      [Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.HOSPITAL_COORDINATOR].includes(currentUser.role);

    return {
      donors: donors.map((d) => ({
        id: d.id,
        userId: isPrivileged ? d.userId : null,
        name: d.name,
        bloodGroup: fromPrismaBloodGroup(d.bloodGroup),
        gender: fromPrismaGender(d.gender),
        age: d.age,
        phone: d.phone,
        email: isPrivileged ? d.email : maskEmail(d.email),
        district: d.district,
        thana: d.thana,
        lastDonationDate: d.lastDonationDate ? d.lastDonationDate.toISOString() : null,
        totalDonations: d.totalDonations,
        status: fromPrismaDonorStatus(d.status),
        isAvailable: d.isAvailable,
        readyForEmergency: d.readyForEmergency,
        weightKg: d.weightKg,
        nextEligibleDate: d.nextEligibleDate ? d.nextEligibleDate.toISOString() : null,
        createdAt: d.createdAt.toISOString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDonorById(id: string, currentUser?: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const d = await prisma.donor.findUnique({
      where: { id },
      include: {
        donations: {
          take: 10,
          orderBy: { donationDate: 'desc' },
          select: {
            id: true,
            units: true,
            donationDate: true,
            location: true,
            bloodGroup: true,
          },
        },
        appointments: {
          take: 5,
          orderBy: { appointmentDate: 'desc' },
          select: {
            id: true,
            appointmentDate: true,
            appointmentTime: true,
            location: true,
            status: true,
          },
        },
      },
    });

    if (!d) {
      throw new NotFoundError(`Donor with ID ${id} not found.`);
    }

    const isPrivileged =
      currentUser &&
      [Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF, Role.HOSPITAL_COORDINATOR].includes(currentUser.role);
    const isOwner = Boolean(currentUser && d.userId && d.userId === currentUser.id);
    const isAuthorized = Boolean(isPrivileged || isOwner);

    return {
      id: d.id,
      userId: isAuthorized ? d.userId : null,
      name: d.name,
      bloodGroup: fromPrismaBloodGroup(d.bloodGroup),
      gender: fromPrismaGender(d.gender),
      age: d.age,
      phone: d.phone,
      email: isAuthorized ? d.email : maskEmail(d.email),
      district: d.district,
      thana: d.thana,
      // PRIVACY PROTECTION: Home address only visible to authorized personnel or owner
      address: isAuthorized ? d.address : null,
      lastDonationDate: d.lastDonationDate ? d.lastDonationDate.toISOString() : null,
      totalDonations: d.totalDonations,
      status: fromPrismaDonorStatus(d.status),
      isAvailable: d.isAvailable,
      readyForEmergency: d.readyForEmergency,
      weightKg: d.weightKg,
      nextEligibleDate: d.nextEligibleDate ? d.nextEligibleDate.toISOString() : null,
      // PRIVACY PROTECTION: Private medical ineligibility details redacted for public view
      ineligibilityReason: isAuthorized ? d.ineligibilityReason : null,
      donations: d.donations.map((dn) => ({
        ...dn,
        bloodGroup: fromPrismaBloodGroup(dn.bloodGroup),
        donationDate: dn.donationDate.toISOString(),
      })),
      // PRIVACY PROTECTION: Appointment schedule history only visible to authorized personnel or owner
      appointments: isAuthorized
        ? d.appointments.map((a) => ({
            ...a,
            appointmentDate: a.appointmentDate.toISOString().split('T')[0],
          }))
        : [],
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };
  }

  async createDonor(data: any, currentUser?: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Cannot persist donor.');
    }

    // Check unique phone number
    const existingPhone = await prisma.donor.findUnique({
      where: { phone: data.phone.trim() },
    });
    if (existingPhone) {
      throw new ConflictError('A donor profile with this phone number already exists.');
    }

    // Check if current user already has a donor profile
    let userIdToLink: string | null = null;
    if (currentUser) {
      const existingProfile = await prisma.donor.findUnique({
        where: { userId: currentUser.id },
      });
      if (existingProfile && currentUser.role === Role.DONOR) {
        throw new ConflictError('You already have an active donor profile linked to your account.');
      }
      if (!existingProfile && currentUser.role === Role.DONOR) {
        userIdToLink = currentUser.id;
      }
    }

    const created = await prisma.donor.create({
      data: {
        userId: userIdToLink,
        name: data.name.trim(),
        bloodGroup: toPrismaBloodGroup(data.bloodGroup),
        gender: toPrismaGender(data.gender),
        age: data.age,
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        district: data.district.trim(),
        thana: data.thana.trim(),
        address: data.address?.trim() || null,
        weightKg: data.weightKg || null,
        lastDonationDate: data.lastDonationDate ? new Date(data.lastDonationDate) : null,
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        readyForEmergency: data.readyForEmergency !== undefined ? data.readyForEmergency : true,
      },
    });

    return {
      id: created.id,
      name: created.name,
      bloodGroup: fromPrismaBloodGroup(created.bloodGroup),
      gender: fromPrismaGender(created.gender),
      age: created.age,
      phone: created.phone,
      email: created.email,
      district: created.district,
      thana: created.thana,
      status: fromPrismaDonorStatus(created.status),
      isAvailable: created.isAvailable,
      readyForEmergency: created.readyForEmergency,
      createdAt: created.createdAt.toISOString(),
    };
  }

  async updateDonor(id: string, data: any, currentUser: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const existing = await prisma.donor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Donor with ID ${id} not found.`);
    }

    // Ownership check: regular user can only modify their own profile
    const isStaffOrAdmin = currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.STAFF;
    const isOwner = existing.userId === currentUser.id;

    if (!isStaffOrAdmin && !isOwner) {
      throw new ForbiddenError("You do not have permission to modify another user's donor profile.");
    }

    // Only staff/admin can change clinical status or clinical deferral reasons
    const updatePayload: any = {};
    if (data.name) updatePayload.name = data.name.trim();
    if (data.bloodGroup) updatePayload.bloodGroup = toPrismaBloodGroup(data.bloodGroup);
    if (data.gender) updatePayload.gender = toPrismaGender(data.gender);
    if (data.age) updatePayload.age = data.age;
    if (data.phone) updatePayload.phone = data.phone.trim();
    if (data.email !== undefined) updatePayload.email = data.email?.trim() || null;
    if (data.district) updatePayload.district = data.district.trim();
    if (data.thana) updatePayload.thana = data.thana.trim();
    if (data.address !== undefined) updatePayload.address = data.address?.trim() || null;
    if (data.weightKg !== undefined) updatePayload.weightKg = data.weightKg;
    if (data.isAvailable !== undefined) updatePayload.isAvailable = data.isAvailable;
    if (data.readyForEmergency !== undefined) updatePayload.readyForEmergency = data.readyForEmergency;

    if (isStaffOrAdmin) {
      if (data.status) updatePayload.status = toPrismaDonorStatus(data.status);
      if (data.ineligibilityReason !== undefined) updatePayload.ineligibilityReason = data.ineligibilityReason;
      if (data.nextEligibleDate !== undefined) {
        updatePayload.nextEligibleDate = data.nextEligibleDate ? new Date(data.nextEligibleDate) : null;
      }
    }

    const updated = await prisma.donor.update({
      where: { id },
      data: updatePayload,
    });

    return {
      id: updated.id,
      name: updated.name,
      bloodGroup: fromPrismaBloodGroup(updated.bloodGroup),
      gender: fromPrismaGender(updated.gender),
      age: updated.age,
      phone: updated.phone,
      email: updated.email,
      district: updated.district,
      thana: updated.thana,
      status: fromPrismaDonorStatus(updated.status),
      isAvailable: updated.isAvailable,
      readyForEmergency: updated.readyForEmergency,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async updateAvailability(id: string, data: { isAvailable?: boolean; readyForEmergency?: boolean }, currentUser: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const existing = await prisma.donor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Donor with ID ${id} not found.`);
    }

    const isStaffOrAdmin = currentUser.role === Role.ADMIN || currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.STAFF;
    const isOwner = existing.userId === currentUser.id;

    if (!isStaffOrAdmin && !isOwner) {
      throw new ForbiddenError('You can only update your own donor availability.');
    }

    const updated = await prisma.donor.update({
      where: { id },
      data: {
        ...(data.isAvailable !== undefined ? { isAvailable: data.isAvailable } : {}),
        ...(data.readyForEmergency !== undefined ? { readyForEmergency: data.readyForEmergency } : {}),
      },
    });

    return {
      id: updated.id,
      isAvailable: updated.isAvailable,
      readyForEmergency: updated.readyForEmergency,
    };
  }

  async deleteDonor(id: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database unavailable.');
    }

    const existing = await prisma.donor.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Donor with ID ${id} not found.`);
    }

    await prisma.donor.delete({ where: { id } });
    return { message: 'Donor profile deleted successfully.' };
  }
}
