import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  CreateAppointmentDto,
  AppointmentItem,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaAppointmentStatus,
  fromPrismaAppointmentStatus,
} from '../types/shared.js';

export class AppointmentsService {
  async getAppointments(): Promise<AppointmentItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      console.warn('⚠️ [AppointmentsService.getAppointments] PostgreSQL disconnected.');
      return [];
    }

    try {
      const records = await prisma.appointment.findMany({
        take: 30,
        orderBy: { appointmentDate: 'asc' },
      });

      return records.map((r) => ({
        id: r.id,
        donorName: r.donorName,
        donorPhone: r.donorPhone,
        bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
        appointmentDate: r.appointmentDate.toISOString().split('T')[0],
        appointmentTime: r.appointmentTime,
        location: r.location,
        status: fromPrismaAppointmentStatus(r.status),
        createdAt: r.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('❌ Error fetching appointments from PostgreSQL:', (error as Error).message);
      throw new Error(`Failed to query appointments: ${(error as Error).message}`);
    }
  }

  async createAppointment(dto: CreateAppointmentDto): Promise<AppointmentItem> {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const errorMsg = 'Cannot schedule appointment: PostgreSQL database connection is unavailable. Please configure DATABASE_URL in .env.';
      console.error(`❌ [AppointmentsService.createAppointment] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    try {
      // Find matching donor by phone if available
      const matchingDonor = await prisma.donor.findFirst({
        where: { phone: dto.donorPhone },
      });

      const record = await prisma.appointment.create({
        data: {
          donorId: matchingDonor ? matchingDonor.id : null,
          donorName: dto.donorName,
          donorPhone: dto.donorPhone,
          bloodGroup: toPrismaBloodGroup(dto.bloodGroup),
          appointmentDate: new Date(dto.appointmentDate),
          appointmentTime: dto.appointmentTime,
          location: dto.location,
          status: toPrismaAppointmentStatus('Scheduled'),
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
        createdAt: record.createdAt.toISOString(),
      };
    } catch (error) {
      console.error('❌ Error booking appointment in PostgreSQL database:', (error as Error).message);
      throw new Error(`Failed to book appointment in database: ${(error as Error).message}`);
    }
  }

  async updateAppointmentStatus(id: string, status: string): Promise<AppointmentItem> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new Error('Database is offline. Unable to update appointment status.');
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
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
