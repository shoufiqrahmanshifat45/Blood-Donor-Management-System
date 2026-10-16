import { Role } from '@prisma/client';
import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  CreateBloodRequestDto,
  BloodRequestItem,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaUrgency,
  fromPrismaUrgency,
} from '../types/shared.js';
import {
  ForbiddenError,
  NotFoundError,
  ServiceUnavailableError,
} from '../utils/errors.js';
import { AuthenticatedUser } from '../types/express.js';

export class BloodRequestsService {
  async getRequests(query: {
    urgency?: string;
    bloodGroup?: string;
    hospital?: string;
    requesterId?: string;
    page?: number;
    limit?: number;
  }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = {};
    if (query.urgency) {
      where.urgency = toPrismaUrgency(query.urgency);
    }
    if (query.bloodGroup) {
      where.bloodGroup = toPrismaBloodGroup(query.bloodGroup);
    }
    if (query.hospital) {
      where.hospital = { contains: query.hospital, mode: 'insensitive' };
    }
    if (query.requesterId) {
      where.requesterId = query.requesterId;
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ urgency: 'asc' }, { createdAt: 'desc' }],
        include: {
          requester: {
            select: { id: true, name: true, role: true },
          },
        },
      }),
      prisma.bloodRequest.count({ where }),
    ]);

    return {
      requests: records.map((r) => ({
        id: r.id,
        patientName: r.patientName,
        hospital: r.hospital,
        bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
        units: r.units,
        urgency: fromPrismaUrgency(r.urgency),
        timeAgo: this.formatTimeAgo(r.createdAt),
        contactPhone: r.contactPhone,
        contactName: r.contactName,
        requiredDate: r.requiredDate ? r.requiredDate.toISOString() : null,
        fulfilledUnits: r.fulfilledUnits,
        requester: r.requester,
        notes: r.notes,
        createdAt: r.createdAt.toISOString(),
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRequestById(id: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const record = await prisma.bloodRequest.findUnique({
      where: { id },
      include: {
        requester: {
          select: { id: true, name: true, email: true, phone: true, role: true },
        },
        donations: {
          include: {
            donor: {
              select: { id: true, name: true, bloodGroup: true, phone: true },
            },
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundError(`Blood request with ID ${id} not found.`);
    }

    return {
      id: record.id,
      patientName: record.patientName,
      hospital: record.hospital,
      bloodGroup: fromPrismaBloodGroup(record.bloodGroup),
      units: record.units,
      urgency: fromPrismaUrgency(record.urgency),
      timeAgo: this.formatTimeAgo(record.createdAt),
      contactPhone: record.contactPhone,
      contactName: record.contactName,
      requiredDate: record.requiredDate ? record.requiredDate.toISOString() : null,
      fulfilledUnits: record.fulfilledUnits,
      requester: record.requester,
      notes: record.notes,
      donations: record.donations.map((d) => ({
        id: d.id,
        units: d.units,
        donationDate: d.donationDate.toISOString(),
        location: d.location,
        donor: {
          ...d.donor,
          bloodGroup: fromPrismaBloodGroup(d.donor.bloodGroup),
        },
      })),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  async createRequest(dto: CreateBloodRequestDto, currentUser?: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Cannot persist blood request: Database is unavailable.');
    }

    const record = await prisma.bloodRequest.create({
      data: {
        patientName: dto.patientName.trim(),
        hospital: dto.hospital.trim(),
        bloodGroup: toPrismaBloodGroup(dto.bloodGroup),
        units: dto.units || 1,
        urgency: toPrismaUrgency(dto.urgency || 'Urgent'),
        contactPhone: dto.contactPhone.trim(),
        contactName: (dto as any).contactName?.trim() || null,
        requiredDate: (dto as any).requiredDate ? new Date((dto as any).requiredDate) : null,
        notes: dto.notes?.trim() || null,
        requesterId: currentUser?.id || null,
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
      contactName: record.contactName,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async updateRequest(id: string, dto: any, currentUser: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Blood request with ID ${id} not found.`);
    }

    const isStaffOrAdmin =
      currentUser.role === Role.ADMIN ||
      currentUser.role === Role.SUPER_ADMIN ||
      currentUser.role === Role.STAFF ||
      currentUser.role === Role.HOSPITAL_COORDINATOR;
    const isOwner = existing.requesterId === currentUser.id;

    if (!isStaffOrAdmin && !isOwner) {
      throw new ForbiddenError('You do not have permission to modify this blood request.');
    }

    const updated = await prisma.bloodRequest.update({
      where: { id },
      data: {
        ...(dto.patientName ? { patientName: dto.patientName.trim() } : {}),
        ...(dto.hospital ? { hospital: dto.hospital.trim() } : {}),
        ...(dto.bloodGroup ? { bloodGroup: toPrismaBloodGroup(dto.bloodGroup) } : {}),
        ...(dto.units !== undefined ? { units: dto.units } : {}),
        ...(dto.contactPhone ? { contactPhone: dto.contactPhone.trim() } : {}),
        ...(dto.contactName !== undefined ? { contactName: dto.contactName?.trim() || null } : {}),
        ...(dto.requiredDate !== undefined ? { requiredDate: dto.requiredDate ? new Date(dto.requiredDate) : null } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes?.trim() || null } : {}),
        ...(dto.fulfilledUnits !== undefined ? { fulfilledUnits: dto.fulfilledUnits } : {}),
        ...(dto.urgency ? { urgency: toPrismaUrgency(dto.urgency) } : {}),
      },
    });

    return {
      id: updated.id,
      patientName: updated.patientName,
      hospital: updated.hospital,
      bloodGroup: fromPrismaBloodGroup(updated.bloodGroup),
      units: updated.units,
      urgency: fromPrismaUrgency(updated.urgency),
      contactPhone: updated.contactPhone,
      contactName: updated.contactName,
      fulfilledUnits: updated.fulfilledUnits,
      notes: updated.notes,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async updateRequestStatus(id: string, status: string, currentUser?: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database is offline. Unable to update blood request status.');
    }

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Blood request with ID ${id} not found.`);
    }

    // Authorization: if user is logged in, verify permissions
    if (currentUser) {
      const isStaffOrAdmin =
        currentUser.role === Role.ADMIN ||
        currentUser.role === Role.SUPER_ADMIN ||
        currentUser.role === Role.STAFF ||
        currentUser.role === Role.HOSPITAL_COORDINATOR;
      const isOwner = existing.requesterId === currentUser.id;

      if (!isStaffOrAdmin && !isOwner) {
        throw new ForbiddenError('You do not have permission to change the status of this blood request.');
      }
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
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteRequest(id: string, currentUser: AuthenticatedUser) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const existing = await prisma.bloodRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Blood request with ID ${id} not found.`);
    }

    const isStaffOrAdmin =
      currentUser.role === Role.ADMIN ||
      currentUser.role === Role.SUPER_ADMIN ||
      currentUser.role === Role.STAFF;
    const isOwner = existing.requesterId === currentUser.id;

    if (!isStaffOrAdmin && !isOwner) {
      throw new ForbiddenError('You do not have permission to delete this blood request.');
    }

    await prisma.bloodRequest.delete({ where: { id } });
    return { message: 'Blood request deleted successfully.' };
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
