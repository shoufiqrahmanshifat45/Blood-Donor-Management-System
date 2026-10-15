import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  CreateDonorDto,
  SearchDonorsQuery,
  Donor,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaGender,
  fromPrismaGender,
  fromPrismaDonorStatus,
} from '../types/shared.js';

export class DonorsService {
  async searchDonors(query: SearchDonorsQuery) {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const errorMsg = 'PostgreSQL database is currently disconnected or DATABASE_URL is not configured. Real database records cannot be queried.';
      console.warn(`⚠️ [DonorsService.searchDonors] ${errorMsg}`);
      return {
        donors: [],
        total: 0,
        warning: errorMsg,
      };
    }

    try {
      const where: any = {};
      if (query.bloodGroup) {
        where.bloodGroup = toPrismaBloodGroup(query.bloodGroup);
      }
      if (query.district) where.district = query.district;
      if (query.thana) where.thana = query.thana;
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search } },
        ];
      }

      const [donors, total] = await Promise.all([
        prisma.donor.findMany({
          where,
          take: query.limit || 50,
          skip: query.page ? (query.page - 1) * (query.limit || 50) : 0,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.donor.count({ where }),
      ]);

      return {
        donors: donors.map((d) => ({
          id: d.id,
          name: d.name,
          bloodGroup: fromPrismaBloodGroup(d.bloodGroup),
          gender: fromPrismaGender(d.gender),
          age: d.age,
          phone: d.phone,
          email: d.email,
          district: d.district,
          thana: d.thana,
          lastDonationDate: d.lastDonationDate ? d.lastDonationDate.toISOString() : null,
          totalDonations: d.totalDonations,
          status: fromPrismaDonorStatus(d.status),
          isAvailable: d.isAvailable,
          readyForEmergency: d.readyForEmergency,
          nextEligibleDate: d.nextEligibleDate ? d.nextEligibleDate.toISOString() : null,
          ineligibilityReason: d.ineligibilityReason,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        })),
        total,
      };
    } catch (error) {
      console.error('❌ PostgreSQL query failed in DonorsService.searchDonors:', (error as Error).message);
      throw new Error(`Database error querying donors: ${(error as Error).message}`);
    }
  }

  async getDonorById(id: string): Promise<Donor | null> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new Error('Database is offline. Unable to retrieve donor record.');
    }

    const d = await prisma.donor.findUnique({ where: { id } });
    if (!d) return null;

    return {
      id: d.id,
      name: d.name,
      bloodGroup: fromPrismaBloodGroup(d.bloodGroup),
      gender: fromPrismaGender(d.gender),
      age: d.age,
      phone: d.phone,
      email: d.email,
      district: d.district,
      thana: d.thana,
      lastDonationDate: d.lastDonationDate ? d.lastDonationDate.toISOString() : null,
      totalDonations: d.totalDonations,
      status: fromPrismaDonorStatus(d.status),
      isAvailable: d.isAvailable,
      readyForEmergency: d.readyForEmergency,
      nextEligibleDate: d.nextEligibleDate ? d.nextEligibleDate.toISOString() : null,
      ineligibilityReason: d.ineligibilityReason,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };
  }

  async createDonor(data: CreateDonorDto): Promise<Donor> {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const errorMsg = 'Cannot persist donor record: PostgreSQL database connection is unavailable. Please configure DATABASE_URL in .env.';
      console.error(`❌ [DonorsService.createDonor] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    try {
      const created = await prisma.donor.create({
        data: {
          name: data.name,
          bloodGroup: toPrismaBloodGroup(data.bloodGroup),
          gender: toPrismaGender(data.gender),
          age: data.age,
          phone: data.phone,
          email: data.email,
          district: data.district,
          thana: data.thana,
          lastDonationDate: data.lastDonationDate ? new Date(data.lastDonationDate) : null,
          isAvailable: true,
          readyForEmergency: true,
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
        lastDonationDate: created.lastDonationDate ? created.lastDonationDate.toISOString() : null,
        totalDonations: created.totalDonations,
        status: fromPrismaDonorStatus(created.status),
        isAvailable: created.isAvailable,
        readyForEmergency: created.readyForEmergency,
        nextEligibleDate: created.nextEligibleDate ? created.nextEligibleDate.toISOString() : null,
        ineligibilityReason: created.ineligibilityReason,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Error saving donor to PostgreSQL database:', (error as Error).message);
      throw new Error(`Failed to create donor in database: ${(error as Error).message}`);
    }
  }
}
