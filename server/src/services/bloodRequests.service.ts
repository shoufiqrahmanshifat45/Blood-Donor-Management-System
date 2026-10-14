import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { CreateBloodRequestDto, BloodRequestItem } from '../../../shared/types.js';

const MOCK_REQUESTS_CACHE: BloodRequestItem[] = [
  {
    id: 'req-1',
    patientName: 'Rahim Uddin',
    hospital: 'Dhaka Medical College Hospital',
    bloodGroup: 'O+',
    units: 2,
    urgency: 'Urgent',
    timeAgo: '2 hours ago',
    contactPhone: '+880 1711-234567',
    notes: 'Emergency ICU requirement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    patientName: 'Nusrat Jahan',
    hospital: 'Square Hospital',
    bloodGroup: 'A-',
    units: 1,
    urgency: 'Pending',
    timeAgo: '5 hours ago',
    contactPhone: '+880 1812-345678',
    notes: 'Scheduled surgery requirement',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-3',
    patientName: 'Imran Hossain',
    hospital: 'National Heart Foundation',
    bloodGroup: 'B+',
    units: 3,
    urgency: 'Pending',
    timeAgo: '7 hours ago',
    contactPhone: '+880 1913-456789',
    notes: 'Bypass operation',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-4',
    patientName: 'Tania Akter',
    hospital: 'United Hospital',
    bloodGroup: 'AB+',
    units: 1,
    urgency: 'Fulfilled',
    timeAgo: '10 hours ago',
    contactPhone: '+880 1614-567890',
    notes: 'Post-delivery need',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-5',
    patientName: 'Kamrul Hasan',
    hospital: 'Dhaka Medical College Hospital',
    bloodGroup: 'O-',
    units: 2,
    urgency: 'Urgent',
    timeAgo: '12 hours ago',
    contactPhone: '+880 1515-678901',
    notes: 'Road traffic accident trauma',
    createdAt: new Date().toISOString(),
  },
];

export class BloodRequestsService {
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      return MOCK_REQUESTS_CACHE;
    }

    try {
      const records = await prisma.bloodRequest.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      if (records.length === 0) return MOCK_REQUESTS_CACHE;

      return records.map((r) => ({
        id: r.id,
        patientName: r.patientName,
        hospital: r.hospital,
        bloodGroup: r.bloodGroup as any,
        units: r.units,
        urgency: r.urgency as any,
        timeAgo: 'Recently',
        contactPhone: r.contactPhone,
        notes: r.notes,
        createdAt: r.createdAt.toISOString(),
      }));
    } catch {
      return MOCK_REQUESTS_CACHE;
    }
  }

  async createRequest(dto: CreateBloodRequestDto): Promise<BloodRequestItem> {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const created: BloodRequestItem = {
        id: `req-${Date.now()}`,
        patientName: dto.patientName,
        hospital: dto.hospital,
        bloodGroup: dto.bloodGroup,
        units: dto.units,
        urgency: dto.urgency,
        timeAgo: 'Just now',
        contactPhone: dto.contactPhone,
        notes: dto.notes || null,
        createdAt: new Date().toISOString(),
      };
      MOCK_REQUESTS_CACHE.unshift(created);
      return created;
    }

    const record = await prisma.bloodRequest.create({
      data: {
        patientName: dto.patientName,
        hospital: dto.hospital,
        bloodGroup: dto.bloodGroup,
        units: dto.units,
        urgency: dto.urgency,
        contactPhone: dto.contactPhone,
        notes: dto.notes,
      },
    });

    return {
      id: record.id,
      patientName: record.patientName,
      hospital: record.hospital,
      bloodGroup: record.bloodGroup as any,
      units: record.units,
      urgency: record.urgency as any,
      timeAgo: 'Just now',
      contactPhone: record.contactPhone,
      notes: record.notes,
      createdAt: record.createdAt.toISOString(),
    };
  }
}
