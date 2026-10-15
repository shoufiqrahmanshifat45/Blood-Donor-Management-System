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
  INITIAL_DONORS,
  INITIAL_APPOINTMENTS,
  DetailedDonor,
  DetailedAppointment,
} from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Storage keys for persistent client-side data
const STORAGE_DONORS_KEY = 'bdms-persistent-donors';
const STORAGE_REQUESTS_KEY = 'bdms-persistent-requests';
const STORAGE_APPOINTMENTS_KEY = 'bdms-persistent-appointments';

// Helper to get cached/stored data or seed with initial
function getLocalDonors(): DetailedDonor[] {
  try {
    const raw = localStorage.getItem(STORAGE_DONORS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_DONORS;
}

function saveLocalDonors(donors: DetailedDonor[]) {
  try {
    localStorage.setItem(STORAGE_DONORS_KEY, JSON.stringify(donors));
  } catch {}
}

function getLocalRequests(): BloodRequestItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return RECENT_BLOOD_REQUESTS.map((r) => ({
    id: r.id,
    patientName: r.donorName,
    hospital: r.hospital,
    bloodGroup: r.bloodGroup as any,
    units: 1,
    urgency: r.status as any,
    timeAgo: r.timeAgo,
    contactPhone: '+880 1711-000000',
    createdAt: new Date().toISOString(),
  }));
}

function saveLocalRequests(reqs: BloodRequestItem[]) {
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(reqs));
  } catch {}
}

function getLocalAppointments(): DetailedAppointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_APPOINTMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_APPOINTMENTS;
}

function saveLocalAppointments(apts: DetailedAppointment[]) {
  try {
    localStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(apts));
  } catch {}
}

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
  recentBloodRequests: getLocalRequests(),
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
      const live = await request<DashboardSummaryData>('/dashboard');
      if (live && live.stats) return live;
      return FALLBACK_DASHBOARD;
    } catch {
      return FALLBACK_DASHBOARD;
    }
  },

  /**
   * Search and filter donors
   */
  async searchDonors(query: SearchDonorsQuery): Promise<{ donors: DetailedDonor[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (query.bloodGroup) params.append('bloodGroup', query.bloodGroup);
      if (query.district) params.append('district', query.district);
      if (query.thana) params.append('thana', query.thana);
      if (query.search) params.append('search', query.search);

      const qs = params.toString();
      const serverResult = await request<{ donors: DetailedDonor[]; total: number }>(`/donors${qs ? `?${qs}` : ''}`);
      if (serverResult && serverResult.donors && serverResult.donors.length > 0) {
        return serverResult;
      }
    } catch {}

    // Resilient client filtering
    let donors = getLocalDonors();
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
  },

  /**
   * Get donor by ID
   */
  async getDonorById(id: string): Promise<DetailedDonor | null> {
    try {
      const res = await request<DetailedDonor>(`/donors/${id}`);
      if (res) return res;
    } catch {}
    const donors = getLocalDonors();
    return donors.find((d) => d.id === id) || null;
  },

  /**
   * Register a new donor
   */
  async createDonor(dto: CreateDonorDto): Promise<DetailedDonor> {
    const newDonor: DetailedDonor = {
      id: `DNR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: dto.name,
      bloodGroup: dto.bloodGroup,
      gender: dto.gender,
      age: dto.age,
      phone: dto.phone,
      email: dto.email || `${dto.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      district: dto.district,
      thana: dto.thana,
      lastDonationDate: dto.lastDonationDate || null,
      totalDonations: 0,
      status: 'Eligible',
      weightKg: 62,
      readyForEmergency: true,
    };

    try {
      await request<Donor>('/donors', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {}

    // Always persist to local store
    const donors = getLocalDonors();
    donors.unshift(newDonor);
    saveLocalDonors(donors);
    return newDonor;
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
   * Get blood requests
   */
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    try {
      const res = await request<BloodRequestItem[]>('/blood-requests');
      if (res && res.length > 0) return res;
    } catch {}
    return getLocalRequests();
  },

  /**
   * Submit a new blood request
   */
  async createBloodRequest(dto: CreateBloodRequestDto): Promise<BloodRequestItem> {
    const newReq: BloodRequestItem = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
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

    try {
      await request<BloodRequestItem>('/blood-requests', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {}

    const reqs = getLocalRequests();
    reqs.unshift(newReq);
    saveLocalRequests(reqs);
    return newReq;
  },

  /**
   * Update blood request urgency/status
   */
  async updateBloodRequestStatus(id: string, status: 'Urgent' | 'Pending' | 'Fulfilled' | 'Cancelled'): Promise<void> {
    try {
      await request(`/blood-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {}

    const reqs = getLocalRequests();
    const item = reqs.find((r) => r.id === id);
    if (item) {
      item.urgency = status;
      saveLocalRequests(reqs);
    }
  },

  /**
   * Get appointments
   */
  async getAppointments(): Promise<DetailedAppointment[]> {
    try {
      const res = await request<DetailedAppointment[]>('/appointments');
      if (res && res.length > 0) return res;
    } catch {}
    return getLocalAppointments();
  },

  /**
   * Book a blood donation appointment
   */
  async bookAppointment(dto: CreateAppointmentDto): Promise<DetailedAppointment> {
    const newApt: DetailedAppointment = {
      id: `APT-${Math.floor(2000 + Math.random() * 8000)}`,
      donorName: dto.donorName,
      donorPhone: dto.donorPhone,
      bloodGroup: dto.bloodGroup,
      appointmentDate: dto.appointmentDate,
      appointmentTime: dto.appointmentTime,
      location: dto.location,
      status: 'Scheduled',
    };

    try {
      await request<AppointmentItem>('/appointments', {
        method: 'POST',
        body: JSON.stringify(dto),
      });
    } catch {}

    const apts = getLocalAppointments();
    apts.unshift(newApt);
    saveLocalAppointments(apts);
    return newApt;
  },

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(id: string, status: 'Scheduled' | 'Completed' | 'Cancelled'): Promise<void> {
    try {
      await request(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {}

    const apts = getLocalAppointments();
    const item = apts.find((a) => a.id === id);
    if (item) {
      item.status = status;
      saveLocalAppointments(apts);
    }
  },

  /**
   * Server Health Check
   */
  async checkHealth(): Promise<{ status: string; database: string }> {
    return request<{ status: string; database: string }>('/health');
  },
};

