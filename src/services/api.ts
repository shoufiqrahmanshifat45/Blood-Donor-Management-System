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
  BLOOD_STOCK_DATA,
  DONOR_REGISTRATION_TRENDS,
  INITIAL_DONORS,
  DetailedDonor,
  DetailedAppointment,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Safe in-memory read fallback baseline when PostgreSQL database is offline or not yet configured
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
  recentBloodRequests: [],
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(
        errorBody.error ||
        errorBody.message ||
        `HTTP error ${response.status}: ${response.statusText}`
      );
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    // If backend server is unreachable
    if ((error as Error).message.includes('Failed to fetch') || (error as Error).message.includes('NetworkError')) {
      throw new Error(
        'Unable to reach backend server. Please verify that the Express backend is running on http://localhost:5000 and PostgreSQL is accessible.'
      );
    }
    throw error;
  }
}

export const api = {
  /**
   * Check PostgreSQL database connection and server health
   */
  async checkHealth(): Promise<{ status: string; database: string }> {
    try {
      return await request<{ status: string; database: string }>('/health');
    } catch (err) {
      return { status: 'offline', database: 'disconnected' };
    }
  },

  /**
   * Fetch aggregated dashboard summary data from PostgreSQL database
   */
  async getDashboardSummary(): Promise<DashboardSummaryData> {
    try {
      const live = await request<DashboardSummaryData>('/dashboard');
      if (live && live.stats) return live;
      return FALLBACK_DASHBOARD;
    } catch (err) {
      console.warn('⚠️ Dashboard live query failed, showing baseline:', (err as Error).message);
      return FALLBACK_DASHBOARD;
    }
  },

  /**
   * Search and filter donors in PostgreSQL database
   */
  async searchDonors(query: SearchDonorsQuery): Promise<{ donors: DetailedDonor[]; total: number }> {
    const params = new URLSearchParams();
    if (query.bloodGroup) params.append('bloodGroup', query.bloodGroup);
    if (query.district) params.append('district', query.district);
    if (query.thana) params.append('thana', query.thana);
    if (query.search) params.append('search', query.search);
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit));

    const qs = params.toString();
    try {
      const serverResult = await request<{ donors: DetailedDonor[]; total: number }>(`/donors${qs ? `?${qs}` : ''}`);
      if (serverResult && Array.isArray(serverResult.donors)) {
        return serverResult;
      }
      return { donors: [], total: 0 };
    } catch (error) {
      console.warn('⚠️ Database query for donors failed:', (error as Error).message);
      // Fallback to seeded demo donor list for initial preview if DB not yet connected
      let donors = [...INITIAL_DONORS];
      if (query.bloodGroup) {
        donors = donors.filter((d) => d.bloodGroup.toUpperCase() === query.bloodGroup?.toUpperCase());
      }
      if (query.district) {
        donors = donors.filter((d) => d.district.toLowerCase() === query.district?.toLowerCase());
      }
      if (query.thana) {
        donors = donors.filter((d) => d.thana.toLowerCase().includes(query.thana?.toLowerCase() || ''));
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        donors = donors.filter(
          (d) =>
            d.name.toLowerCase().includes(s) ||
            d.phone.includes(s) ||
            d.district.toLowerCase().includes(s) ||
            d.thana.toLowerCase().includes(s) ||
            d.bloodGroup.toLowerCase().includes(s)
        );
      }
      return { donors, total: donors.length };
    }
  },

  /**
   * Get donor by ID from PostgreSQL database
   */
  async getDonorById(id: string): Promise<DetailedDonor | null> {
    try {
      const res = await request<DetailedDonor>(`/donors/${id}`);
      if (res) return res;
    } catch {}
    return INITIAL_DONORS.find((d) => d.id === id) || null;
  },

  /**
   * Register a new donor into PostgreSQL database.
   * Throws error if PostgreSQL is offline to prevent false assumption of persistence.
   */
  async createDonor(dto: CreateDonorDto): Promise<DetailedDonor> {
    const created = await request<Donor>('/donors', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    return {
      id: created.id,
      name: created.name,
      bloodGroup: created.bloodGroup,
      gender: created.gender,
      age: created.age,
      phone: created.phone,
      email: created.email || '',
      district: created.district,
      thana: created.thana,
      lastDonationDate: created.lastDonationDate || null,
      totalDonations: created.totalDonations,
      status: created.status,
      weightKg: 62,
      readyForEmergency: true,
    };
  },

  /**
   * Get blood stock levels from PostgreSQL
   */
  async getBloodStock(): Promise<BloodStockItem[]> {
    try {
      const stock = await request<BloodStockItem[]>('/blood-stock');
      if (stock && stock.length > 0) return stock;
      return FALLBACK_DASHBOARD.bloodStock;
    } catch {
      return FALLBACK_DASHBOARD.bloodStock;
    }
  },

  /**
   * Get blood requests from PostgreSQL
   */
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    try {
      const res = await request<BloodRequestItem[]>('/blood-requests');
      if (res && res.length > 0) return res;
      return [];
    } catch (err) {
      console.warn('⚠️ Could not load blood requests from PostgreSQL:', (err as Error).message);
      return [];
    }
  },

  /**
   * Submit a new blood request to PostgreSQL.
   * Throws error if PostgreSQL is offline.
   */
  async createBloodRequest(dto: CreateBloodRequestDto): Promise<BloodRequestItem> {
    return await request<BloodRequestItem>('/blood-requests', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Update blood request urgency/status in PostgreSQL
   */
  async updateBloodRequestStatus(id: string, status: 'Urgent' | 'Pending' | 'Fulfilled' | 'Cancelled'): Promise<void> {
    await request(`/blood-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Get appointments from PostgreSQL
   */
  async getAppointments(): Promise<DetailedAppointment[]> {
    try {
      const res = await request<DetailedAppointment[]>('/appointments');
      if (res && res.length > 0) return res;
      return [];
    } catch (err) {
      console.warn('⚠️ Could not load appointments from PostgreSQL:', (err as Error).message);
      return [];
    }
  },

  /**
   * Book a blood donation appointment in PostgreSQL.
   * Throws error if PostgreSQL is offline.
   */
  async bookAppointment(dto: CreateAppointmentDto): Promise<DetailedAppointment> {
    const created = await request<AppointmentItem>('/appointments', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    return {
      id: created.id,
      donorName: created.donorName,
      donorPhone: created.donorPhone,
      bloodGroup: created.bloodGroup,
      appointmentDate: created.appointmentDate,
      appointmentTime: created.appointmentTime,
      location: created.location,
      status: created.status,
    };
  },

  /**
   * Update appointment status in PostgreSQL
   */
  async updateAppointmentStatus(id: string, status: 'Scheduled' | 'Completed' | 'Cancelled'): Promise<void> {
    await request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
