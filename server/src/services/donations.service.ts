import { Role } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
} from '../types/shared.js';
import {
  BadRequestError,
  NotFoundError,
  ServiceUnavailableError,
} from '../utils/errors.js';
import { AuthenticatedUser } from '../types/express.js';

export class DonationsService {
  async getDonations(query: {
    donorId?: string;
    bloodRequestId?: string;
    bloodGroup?: string;
    page?: number;
    limit?: number;
  }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = {};
    if (query.donorId) where.donorId = query.donorId;
    if (query.bloodRequestId) where.bloodRequestId = query.bloodRequestId;
    if (query.bloodGroup) where.bloodGroup = toPrismaBloodGroup(query.bloodGroup);

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      prisma.bloodDonation.findMany({
        where,
        take: limit,
        skip,
        orderBy: { donationDate: 'desc' },
        include: {
          donor: {
            select: { id: true, name: true, phone: true, bloodGroup: true, district: true },
          },
          bloodRequest: {
            select: { id: true, patientName: true, hospital: true, urgency: true },
          },
          verifiedBy: {
            select: { id: true, name: true, role: true },
          },
        },
      }),
      prisma.bloodDonation.count({ where }),
    ]);

    return {
      donations: donations.map((d) => ({
        id: d.id,
        units: d.units,
        donationDate: d.donationDate.toISOString(),
        location: d.location,
        bloodGroup: fromPrismaBloodGroup(d.bloodGroup),
        notes: d.notes,
        donor: {
          ...d.donor,
          bloodGroup: fromPrismaBloodGroup(d.donor.bloodGroup),
        },
        bloodRequest: d.bloodRequest,
        verifiedBy: d.verifiedBy,
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

  async getDonationById(id: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const donation = await prisma.bloodDonation.findUnique({
      where: { id },
      include: {
        donor: {
          select: { id: true, name: true, phone: true, email: true, bloodGroup: true, district: true, thana: true },
        },
        bloodRequest: true,
        verifiedBy: {
          select: { id: true, name: true, role: true, email: true },
        },
      },
    });

    if (!donation) {
      throw new NotFoundError(`Donation record with ID ${id} not found.`);
    }

    return {
      ...donation,
      bloodGroup: fromPrismaBloodGroup(donation.bloodGroup),
      donationDate: donation.donationDate.toISOString(),
      createdAt: donation.createdAt.toISOString(),
      donor: {
        ...donation.donor,
        bloodGroup: fromPrismaBloodGroup(donation.donor.bloodGroup),
      },
    };
  }

  async createDonation(data: any, currentUser: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    // Verify donor exists
    const donor = await prisma.donor.findUnique({
      where: { id: data.donorId },
    });
    if (!donor) {
      throw new NotFoundError(`Donor with ID ${data.donorId} does not exist.`);
    }

    const bloodGroupEnum = toPrismaBloodGroup(data.bloodGroup || donor.bloodGroup);
    const units = data.units || 1;
    const donationDate = data.donationDate ? new Date(data.donationDate) : new Date();

    // Verify blood request if provided
    let bloodRequest: any = null;
    if (data.bloodRequestId) {
      bloodRequest = await prisma.bloodRequest.findUnique({
        where: { id: data.bloodRequestId },
      });
      if (!bloodRequest) {
        throw new NotFoundError(`Blood request with ID ${data.bloodRequestId} does not exist.`);
      }
    }

    // Execute database operations
    const created = await prisma.$transaction(async (tx) => {
      // 1. Create BloodDonation
      const record = await tx.bloodDonation.create({
        data: {
          donorId: donor.id,
          bloodRequestId: bloodRequest ? bloodRequest.id : null,
          bloodGroup: bloodGroupEnum,
          units,
          donationDate,
          location: data.location.trim(),
          notes: data.notes?.trim() || null,
          verifiedById: currentUser.id,
        },
      });

      // 2. Update donor total donations & calculate 90-day cooldown
      const nextEligible = new Date(donationDate);
      nextEligible.setDate(nextEligible.getDate() + 90);

      await tx.donor.update({
        where: { id: donor.id },
        data: {
          totalDonations: { increment: units },
          lastDonationDate: donationDate,
          nextEligibleDate: nextEligible,
        },
      });

      // 3. Update BloodStock inventory (increment units)
      await tx.bloodStock.upsert({
        where: { bloodGroup: bloodGroupEnum },
        create: {
          bloodGroup: bloodGroupEnum,
          availableUnits: units,
        },
        update: {
          availableUnits: { increment: units },
        },
      });

      // 4. If fulfilling blood request, increment fulfilledUnits
      if (bloodRequest) {
        const newFulfilled = bloodRequest.fulfilledUnits + units;
        const newUrgency = newFulfilled >= bloodRequest.units ? 'Fulfilled' : bloodRequest.urgency;
        await tx.bloodRequest.update({
          where: { id: bloodRequest.id },
          data: {
            fulfilledUnits: newFulfilled,
            urgency: newUrgency,
          },
        });
      }

      // 5. Notify donor if registered user account exists
      if (donor.userId) {
        await tx.notification.create({
          data: {
            userId: donor.userId,
            title: 'Thank You for Your Blood Donation!',
            message: `Your donation of ${units} unit(s) of ${fromPrismaBloodGroup(bloodGroupEnum)} blood at ${data.location} was verified. You saved lives today!`,
            type: 'INFO',
            relatedEntityId: record.id,
            relatedEntityType: 'BloodDonation',
          },
        });
      }

      return record;
    });

    return {
      id: created.id,
      donorId: created.donorId,
      bloodGroup: fromPrismaBloodGroup(created.bloodGroup),
      units: created.units,
      donationDate: created.donationDate.toISOString(),
      location: created.location,
      notes: created.notes,
      createdAt: created.createdAt.toISOString(),
    };
  }
}
