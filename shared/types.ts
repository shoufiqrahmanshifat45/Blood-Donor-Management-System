/**
 * Shared Type Definitions & API Contracts
 * Blood Donor Management System
 * Shared across frontend (React/Vite) and backend (Express/Prisma)
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gender = 'Male' | 'Female' | 'Other';

export type BloodStockStatus = 'Good' | 'Low' | 'Critical';

export type RequestUrgency = 'Urgent' | 'Pending' | 'Fulfilled' | 'Cancelled';

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export type DonorStatus = 'Eligible' | 'Ineligible' | 'Pending';

// ==========================================
// Domain Entities
// ==========================================

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
  requiredDate?: string | null;
  fulfilledUnits?: number;
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
  notes?: string | null;
  createdAt?: string;
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

// ==========================================
// Dashboard Aggregation DTO
// ==========================================

export interface DashboardSummaryData {
  stats: StatMetric[];
  donorsByBloodGroup: DonorsByBloodGroupPoint[];
  genderDistribution: GenderDistributionPoint[];
  totalDonorsCount: string;
  bloodStock: BloodStockItem[];
  donorRegistrationTrends: DonorTrendPoint[];
  recentBloodRequests: BloodRequestItem[];
}

// ==========================================
// API Request DTOs
// ==========================================

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
  totalDonations?: number;
  readyForEmergency?: boolean;
  isAvailable?: boolean;
}

export interface UpdateDonorDto {
  name?: string;
  bloodGroup?: BloodGroup;
  gender?: Gender;
  age?: number;
  phone?: string;
  email?: string | null;
  district?: string;
  thana?: string;
  address?: string | null;
  status?: DonorStatus;
  isAvailable?: boolean;
  readyForEmergency?: boolean;
  weightKg?: number | null;
  totalDonations?: number;
  lastDonationDate?: string | null;
  nextEligibleDate?: string | null;
  ineligibilityReason?: string | null;
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
  notes?: string;
}

export interface SearchDonorsQuery {
  bloodGroup?: string;
  district?: string;
  thana?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DonationItem {
  id: string;
  donorId: string;
  donorName?: string;
  bloodRequestId?: string | null;
  bloodGroup: BloodGroup;
  units: number;
  donationDate: string;
  location: string;
  notes?: string | null;
  verifiedById?: string | null;
  verifiedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface CreateDonationDto {
  donorId: string;
  bloodRequestId?: string;
  bloodGroup: BloodGroup;
  units?: number;
  donationDate?: string;
  location: string;
  notes?: string;
}

// ==========================================
// Standard API Envelope
// ==========================================

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
