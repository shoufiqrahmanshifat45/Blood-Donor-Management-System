import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  CreateAppointmentDto,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaAppointmentStatus,
  fromPrismaAppointmentStatus,
} from '../types/shared.js';
import { NotFoundError, ServiceUnavailableError } from '../utils/errors.js';

export class AppointmentsService {
  async getAppointments(query: { status?: string; date?: string; page?: number; limit?: number }) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const where: any = {};
    if (query.status) {
      where.status = toPrismaAppointmentStatus(query.status);
    }
    if (query.date) {
      where.appointmentDate = new Date(query.date);
    }

    const page = query.page || 1;
    const limit = query.limit || 30;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ appointmentDate: 'asc' }],
        include: {
          donor: {
            select: { id: true, name: true, phone: true, email: true },
          },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      appointments: records.map((r) => ({
        id: r.id,
        donorId: r.donorId,
        donorName: r.donorName,
        donorPhone: r.donorPhone,
        bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
        appointmentDate: r.appointmentDate.toISOString().split('T')[0],
        appointmentTime: r.appointmentTime,
        location: r.location,
        status: fromPrismaAppointmentStatus(r.status),
        notes: r.notes,
        donor: r.donor,
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

  async getAppointmentById(id: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const record = await prisma.appointment.findUnique({
      where: { id },
      include: {
        donor: {
          select: { id: true, name: true, phone: true, bloodGroup: true, district: true },
        },
      },
    });

    if (!record) {
      throw new NotFoundError(`Appointment with ID ${id} not found.`);
    }

    return {
      id: record.id,
      donorId: record.donorId,
      donorName: record.donorName,
      donorPhone: record.donorPhone,
      bloodGroup: fromPrismaBloodGroup(record.bloodGroup),
      appointmentDate: record.appointmentDate.toISOString().split('T')[0],
      appointmentTime: record.appointmentTime,
      location: record.location,
      status: fromPrismaAppointmentStatus(record.status),
      notes: record.notes,
      donor: record.donor,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  async createAppointment(dto: CreateAppointmentDto) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Cannot schedule appointment: Database service is offline.');
    }

    // Attempt to match registered donor profile by phone
    const matchingDonor = await prisma.donor.findFirst({
      where: { phone: dto.donorPhone.trim() },
    });

    const record = await prisma.appointment.create({
      data: {
        donorId: matchingDonor ? matchingDonor.id : null,
        donorName: dto.donorName.trim(),
        donorPhone: dto.donorPhone.trim(),
        bloodGroup: toPrismaBloodGroup(dto.bloodGroup),
        appointmentDate: new Date(dto.appointmentDate),
        appointmentTime: dto.appointmentTime.trim(),
        location: dto.location.trim(),
        status: toPrismaAppointmentStatus('Scheduled'),
        notes: (dto as any).notes?.trim() || null,
      },
    });

    return {
      id: record.id,
      donorName: record.donorName,
      donorPhone: record.donorPhone,
      bloodGroup: fromPrismaBloodGroup(record.bloodGroup),
      appointmentDate: record.appointmentDate.toISOString().split('T')[0],
      appointmentTime: record.appointmentTime,
      location: record.location,
      status: fromPrismaAppointmentStatus(record.status),
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    };
  }

  async updateAppointmentStatus(id: string, status: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database is offline. Unable to update appointment status.');
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Appointment with ID ${id} not found.`);
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: toPrismaAppointmentStatus(status),
      },
    });

    return {
      id: updated.id,
      donorName: updated.donorName,
      donorPhone: updated.donorPhone,
      bloodGroup: fromPrismaBloodGroup(updated.bloodGroup),
      appointmentDate: updated.appointmentDate.toISOString().split('T')[0],
      appointmentTime: updated.appointmentTime,
      location: updated.location,
      status: fromPrismaAppointmentStatus(updated.status),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteAppointment(id: string) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable.');
    }

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError(`Appointment with ID ${id} not found.`);
    }

    await prisma.appointment.delete({ where: { id } });
    return { message: 'Appointment deleted successfully.' };
  }
}
