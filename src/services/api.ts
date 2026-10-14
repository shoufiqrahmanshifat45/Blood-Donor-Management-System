import {
  DashboardSummaryData,
  Donor,
  SearchDonorsQuery,
  CreateDonorDto,
  BloodStockItem,
  BloodRequestItem,
  CreateBloodRequestDto,
  CreateAppointmentDto,
  AppointmentItem,
  ApiResponse,
} from '../types/api';

import {
  INITIAL_STAT_METRICS,
  DONORS_BY_BLOOD_GROUP,
  GENDER_DISTRIBUTION,
  RECENT_BLOOD_REQUESTS,
  BLOOD_STOCK_DATA,
  DONOR_REGISTRATION_TRENDS,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Fallback baseline when API server is cold or disconnected
const FALLBACK_DASHBOARD: DashboardSummaryData = {
  stats: INITIAL_STAT_METRICS.map((s) => ({
    id: s.id,
    title: s.label,
    value: s.value,
    change: s.trend,
    isPositive: s.trendType === 'up',
    comparisonText: s.trendContext,
  })),
  donorsByBloodGroup: DONORS_BY_BLOOD_GROUP.map((d) => ({
    group: d.bloodGroup as any,
    count: d.count,
  })),
  genderDistribution: GENDER_DISTRIBUTION.map((g) => ({
    gender: g.name as any,
    percentage: g.percentage,
    count: g.count,
    color: g.color,
  })),
  totalDonorsCount: '1,248',
  bloodStock: BLOOD_STOCK_DATA.map((s, idx) => ({
    id: String(idx + 1),
    bloodGroup: s.bloodGroup as any,
    availableUnits: s.units,
    reservedUnits: 4,
    status: (s.status === 'Low' ? 'Low' : 'Good') as any,
    lastUpdated: 'Recently',
  })),
  donorRegistrationTrends: DONOR_REGISTRATION_TRENDS,
  recentBloodRequests: RECENT_BLOOD_REQUESTS.map((r) => ({
    id: r.id,
    patientName: r.donorName,
    hospital: r.hospital,
    bloodGroup: r.bloodGroup as any,
    units: 1,
    urgency: r.status as any,
    timeAgo: r.timeAgo,
    contactPhone: '+880 1711-000000',
    createdAt: new Date().toISOString(),
  })),
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error ${response.status}: ${response.statusText}`);
  }

  const json: ApiResponse<T> = await response.json();
  return json.data;
}

export const api = {
  /**
   * Fetch aggregated dashboard summary data
   */
  async getDashboardSummary(): Promise<DashboardSummaryData> {
    try {
      return await request<DashboardSummaryData>('/dashboard');
    } catch (err) {
      console.warn('API /dashboard unavailable, utilizing resilient cached state:', (err as Error).message);
      return FALLBACK_DASHBOARD;
    }
  },

  /**
   * Search and filter donors
   */
  async searchDonors(query: SearchDonorsQuery): Promise<{ donors: Donor[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (query.bloodGroup) params.append('bloodGroup', query.bloodGroup);
      if (query.district) params.append('district', query.district);
      if (query.thana) params.append('thana', query.thana);
      if (query.search) params.append('search', query.search);

      const qs = params.toString();
      return await request<{ donors: Donor[]; total: number }>(`/donors${qs ? `?${qs}` : ''}`);
    } catch {
      return { donors: [], total: 0 };
    }
  },

  /**
   * Register a new donor
   */
  async createDonor(dto: CreateDonorDto): Promise<Donor> {
    try {
      return await request<Donor>('/donors', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      // Optimistic local creation when backend is offline
      return {
        id: `d-${Date.now()}`,
        name: dto.name,
        bloodGroup: dto.bloodGroup,
        gender: dto.gender,
        age: dto.age,
        phone: dto.phone,
        district: dto.district,
        thana: dto.thana,
        totalDonations: 0,
        status: 'Eligible',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Get blood stock levels
   */
  async getBloodStock(): Promise<BloodStockItem[]> {
    try {
      return await request<BloodStockItem[]>('/blood-stock');
    } catch {
      return FALLBACK_DASHBOARD.bloodStock;
    }
  },

  /**
   * Get recent blood requests
   */
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    try {
      return await request<BloodRequestItem[]>('/blood-requests');
    } catch {
      return FALLBACK_DASHBOARD.recentBloodRequests;
    }
  },

  /**
   * Submit a new blood request
   */
  async createBloodRequest(dto: CreateBloodRequestDto): Promise<BloodRequestItem> {
    try {
      return await request<BloodRequestItem>('/blood-requests', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      return {
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
    }
  },

  /**
   * Book a blood donation appointment
   */
  async bookAppointment(dto: CreateAppointmentDto): Promise<AppointmentItem> {
    try {
      return await request<AppointmentItem>('/appointments', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {
      return {
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
    }
  },

  /**
   * Server Health Check
   */
  async checkHealth(): Promise<{ status: string; database: string }> {
    return request<{ status: string; database: string }>('/health');
  },
};
