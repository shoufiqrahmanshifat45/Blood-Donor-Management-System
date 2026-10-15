import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  CreateBloodRequestDto,
  BloodRequestItem,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaUrgency,
  fromPrismaUrgency,
} from '../types/shared.js';

export class BloodRequestsService {
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      console.warn('⚠️ [BloodRequestsService.getRecentRequests] PostgreSQL disconnected.');
      return [];
    }

    try {
      const records = await prisma.bloodRequest.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
      });

      return records.map((r) => ({
        id: r.id,
        patientName: r.patientName,
        hospital: r.hospital,
        bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
        units: r.units,
        urgency: fromPrismaUrgency(r.urgency),
        timeAgo: this.formatTimeAgo(r.createdAt),
        contactPhone: r.contactPhone,
        notes: r.notes,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('❌ Error fetching blood requests from PostgreSQL:', (error as Error).message);
      throw new Error(`Failed to query blood requests: ${(error as Error).message}`);
    }
  }

  async createRequest(dto: CreateBloodRequestDto): Promise<BloodRequestItem> {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const errorMsg = 'Cannot persist blood request: PostgreSQL database connection is unavailable. Please configure DATABASE_URL in .env.';
      console.error(`❌ [BloodRequestsService.createRequest] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    try {
      const record = await prisma.bloodRequest.create({
        data: {
          patientName: dto.patientName,
          hospital: dto.hospital,
          bloodGroup: toPrismaBloodGroup(dto.bloodGroup),
          units: dto.units,
          urgency: toPrismaUrgency(dto.urgency),
          contactPhone: dto.contactPhone,
          notes: dto.notes,
        },
      });

      return {
        id: record.id,
        patientName: record.patientName,
        hospital: record.hospital,
        bloodGroup: fromPrismaBloodGroup(record.bloodGroup),
        units: record.units,
        urgency: fromPrismaUrgency(record.urgency),
        timeAgo: 'Just now',
        contactPhone: record.contactPhone,
        notes: record.notes,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Error saving blood request to PostgreSQL database:', (error as Error).message);
      throw new Error(`Failed to create blood request in database: ${(error as Error).message}`);
    }
  }

  async updateRequestStatus(id: string, status: string): Promise<BloodRequestItem> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new Error('Database is offline. Unable to update blood request status.');
    }

    const updated = await prisma.bloodRequest.update({
      where: { id },
      data: {
        urgency: toPrismaUrgency(status),
      },
    });

    return {
      id: updated.id,
      patientName: updated.patientName,
      hospital: updated.hospital,
      bloodGroup: fromPrismaBloodGroup(updated.bloodGroup),
      units: updated.units,
      urgency: fromPrismaUrgency(updated.urgency),
      timeAgo: this.formatTimeAgo(updated.createdAt),
      contactPhone: updated.contactPhone,
      notes: updated.notes,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  private formatTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
