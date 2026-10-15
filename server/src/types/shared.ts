/**
 * Shared Type Definitions & Prisma Converter Helpers
 * Blood Donor Management System Server
 */

import {
  BloodGroup as PrismaBloodGroup,
  Gender as PrismaGender,
  DonorStatus as PrismaDonorStatus,
  RequestUrgency as PrismaRequestUrgency,
  AppointmentStatus as PrismaAppointmentStatus,
  StockStatus as PrismaStockStatus,
  Role as PrismaRole,
  NotificationType as PrismaNotificationType,
} from '@prisma/client';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Gender = 'Male' | 'Female' | 'Other';
export type BloodStockStatus = 'Good' | 'Low' | 'Critical';
export type RequestUrgency = 'Urgent' | 'Pending' | 'Fulfilled' | 'Cancelled';
export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';
export type DonorStatus = 'Eligible' | 'Ineligible' | 'Pending';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  age: number;
  phone: string;
  email?: string | null;
  district: string;
  thana: string;
  lastDonationDate?: string | null;
  totalDonations: number;
  status: DonorStatus;
  isAvailable?: boolean;
  readyForEmergency?: boolean;
  nextEligibleDate?: string | null;
  ineligibilityReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BloodStockItem {
  id: string;
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  status: BloodStockStatus;
  lastUpdated: string;
}

export interface BloodRequestItem {
  id: string;
  patientName: string;
  hospital: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: RequestUrgency;
  timeAgo: string;
  contactPhone: string;
  notes?: string | null;
  createdAt: string;
}

export interface AppointmentItem {
  id: string;
  donorName: string;
  donorPhone: string;
  bloodGroup: BloodGroup;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  comparisonText: string;
}

export interface DonorsByBloodGroupPoint {
  group: BloodGroup;
  count: number;
}

export interface GenderDistributionPoint {
  gender: Gender;
  percentage: number;
  count: number;
  color: string;
}

export interface DonorTrendPoint {
  month: string;
  newDonors: number;
  totalDonors: number;
}

export interface DashboardSummaryData {
  stats: StatMetric[];
  donorsByBloodGroup: DonorsByBloodGroupPoint[];
  genderDistribution: GenderDistributionPoint[];
  totalDonorsCount: string;
  bloodStock: BloodStockItem[];
  donorRegistrationTrends: DonorTrendPoint[];
  recentBloodRequests: BloodRequestItem[];
}

export interface CreateDonorDto {
  name: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  age: number;
  phone: string;
  email?: string;
  district: string;
  thana: string;
  address?: string;
  weightKg?: number;
  lastDonationDate?: string;
  readyForEmergency?: boolean;
}

export interface CreateBloodRequestDto {
  patientName: string;
  hospital: string;
  bloodGroup: BloodGroup;
  units: number;
  urgency: RequestUrgency;
  contactPhone: string;
  notes?: string;
}

export interface CreateAppointmentDto {
  donorName: string;
  donorPhone: string;
  bloodGroup: BloodGroup;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
}

export interface SearchDonorsQuery {
  bloodGroup?: string;
  district?: string;
  thana?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
  };
}

// ==========================================
// Prisma Enum Converters
// ==========================================

export const toPrismaBloodGroup = (bg: string): PrismaBloodGroup => {
  const map: Record<string, PrismaBloodGroup> = {
    'A+': PrismaBloodGroup.A_POS,
    'A-': PrismaBloodGroup.A_NEG,
    'B+': PrismaBloodGroup.B_POS,
    'B-': PrismaBloodGroup.B_NEG,
    'AB+': PrismaBloodGroup.AB_POS,
    'AB-': PrismaBloodGroup.AB_NEG,
    'O+': PrismaBloodGroup.O_POS,
    'O-': PrismaBloodGroup.O_NEG,
  };
  return map[bg] || PrismaBloodGroup.O_POS;
};

export const fromPrismaBloodGroup = (bg: PrismaBloodGroup): BloodGroup => {
  const map: Record<PrismaBloodGroup, BloodGroup> = {
    [PrismaBloodGroup.A_POS]: 'A+',
    [PrismaBloodGroup.A_NEG]: 'A-',
    [PrismaBloodGroup.B_POS]: 'B+',
    [PrismaBloodGroup.B_NEG]: 'B-',
    [PrismaBloodGroup.AB_POS]: 'AB+',
    [PrismaBloodGroup.AB_NEG]: 'AB-',
    [PrismaBloodGroup.O_POS]: 'O+',
    [PrismaBloodGroup.O_NEG]: 'O-',
  };
  return map[bg] || 'O+';
};

export const toPrismaGender = (g: string): PrismaGender => {
  if (g.toLowerCase() === 'female') return PrismaGender.FEMALE;
  if (g.toLowerCase() === 'other') return PrismaGender.OTHER;
  return PrismaGender.MALE;
};

export const fromPrismaGender = (g: PrismaGender): Gender => {
  if (g === PrismaGender.FEMALE) return 'Female';
  if (g === PrismaGender.OTHER) return 'Other';
  return 'Male';
};

export const toPrismaDonorStatus = (s: string): PrismaDonorStatus => {
  if (s.toLowerCase() === 'ineligible') return PrismaDonorStatus.INELIGIBLE;
  if (s.toLowerCase() === 'pending') return PrismaDonorStatus.PENDING;
  return PrismaDonorStatus.ELIGIBLE;
};

export const fromPrismaDonorStatus = (s: PrismaDonorStatus): DonorStatus => {
  if (s === PrismaDonorStatus.INELIGIBLE) return 'Ineligible';
  if (s === PrismaDonorStatus.PENDING) return 'Pending';
  return 'Eligible';
};

export const toPrismaUrgency = (u: string): PrismaRequestUrgency => {
  const map: Record<string, PrismaRequestUrgency> = {
    Urgent: PrismaRequestUrgency.URGENT,
    Pending: PrismaRequestUrgency.PENDING,
    Fulfilled: PrismaRequestUrgency.FULFILLED,
    Cancelled: PrismaRequestUrgency.CANCELLED,
  };
  return map[u] || PrismaRequestUrgency.PENDING;
};

export const fromPrismaUrgency = (u: PrismaRequestUrgency): RequestUrgency => {
  const map: Record<PrismaRequestUrgency, RequestUrgency> = {
    [PrismaRequestUrgency.URGENT]: 'Urgent',
    [PrismaRequestUrgency.PENDING]: 'Pending',
    [PrismaRequestUrgency.FULFILLED]: 'Fulfilled',
    [PrismaRequestUrgency.CANCELLED]: 'Cancelled',
  };
  return map[u] || 'Pending';
};

export const toPrismaAppointmentStatus = (s: string): PrismaAppointmentStatus => {
  const map: Record<string, PrismaAppointmentStatus> = {
    Scheduled: PrismaAppointmentStatus.SCHEDULED,
    Completed: PrismaAppointmentStatus.COMPLETED,
    Cancelled: PrismaAppointmentStatus.CANCELLED,
    NoShow: PrismaAppointmentStatus.NO_SHOW,
  };
  return map[s] || PrismaAppointmentStatus.SCHEDULED;
};

export const fromPrismaAppointmentStatus = (s: PrismaAppointmentStatus): AppointmentStatus => {
  if (s === PrismaAppointmentStatus.COMPLETED) return 'Completed';
  if (s === PrismaAppointmentStatus.CANCELLED) return 'Cancelled';
  return 'Scheduled';
};

export const toPrismaStockStatus = (s: string): PrismaStockStatus => {
  if (s.toLowerCase() === 'low') return PrismaStockStatus.LOW;
  if (s.toLowerCase() === 'critical') return PrismaStockStatus.CRITICAL;
  return PrismaStockStatus.GOOD;
};

export const fromPrismaStockStatus = (s: PrismaStockStatus): BloodStockStatus => {
  if (s === PrismaStockStatus.LOW) return 'Low';
  if (s === PrismaStockStatus.CRITICAL) return 'Critical';
  return 'Good';
};
