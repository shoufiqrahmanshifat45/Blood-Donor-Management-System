import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { CreateAppointmentDto, AppointmentItem } from '../../../shared/types.js';

const MOCK_APPOINTMENTS_CACHE: AppointmentItem[] = [
  {
    id: 'apt-1',
    donorName: 'Tanvir Ahmed',
    donorPhone: '+880 1711-000111',
    bloodGroup: 'O+',
    appointmentDate: '2025-10-20',
    appointmentTime: '10:30 AM',
    location: 'Dhaka Central Blood Bank',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
];

export class AppointmentsService {
  async getAppointments(): Promise<AppointmentItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) return MOCK_APPOINTMENTS_CACHE;

    try {
      const records = await prisma.appointment.findMany({
        take: 20,
        orderBy: { appointmentDate: 'asc' },
      });

      if (records.length === 0) return MOCK_APPOINTMENTS_CACHE;

      return records.map((r) => ({
        id: r.id,
        donorName: r.donorName,
        donorPhone: r.donorPhone,
        bloodGroup: r.bloodGroup as any,
        appointmentDate: r.appointmentDate.toISOString().split('T')[0],
        appointmentTime: r.appointmentTime,
        location: r.location,
        status: r.status as any,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      return MOCK_APPOINTMENTS_CACHE;
    }
  }

  async createAppointment(dto: CreateAppointmentDto): Promise<AppointmentItem> {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const created: AppointmentItem = {
        id: `apt-${Date.now()}`,
        donorName: dto.donorName,
        donorPhone: dto.donorPhone,
        bloodGroup: dto.bloodGroup,
        appointmentDate: dto.appointmentDate,
        appointmentTime: dto.appointmentTime,
        location: dto.location,
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
      };
      MOCK_APPOINTMENTS_CACHE.push(created);
      return created;
    }

    const record = await prisma.appointment.create({
      data: {
        donorName: dto.donorName,
        donorPhone: dto.donorPhone,
        bloodGroup: dto.bloodGroup,
        appointmentDate: new Date(dto.appointmentDate),
        appointmentTime: dto.appointmentTime,
        location: dto.location,
        status: 'Scheduled',
      },
    });

    return {
      id: record.id,
      donorName: record.donorName,
      donorPhone: record.donorPhone,
      bloodGroup: record.bloodGroup as any,
      appointmentDate: record.appointmentDate.toISOString().split('T')[0],
      appointmentTime: record.appointmentTime,
      location: record.location,
      status: record.status as any,
      createdAt: record.createdAt.toISOString(),
    };
  }
}
