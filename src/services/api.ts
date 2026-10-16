import {
  DashboardSummaryData,
  SearchDonorsQuery,
  CreateDonorDto,
  BloodStockItem,
  BloodRequestItem,
  CreateBloodRequestDto,
  CreateAppointmentDto,
  AppointmentItem,
  ApiResponse,
  DonationItem,
  CreateDonationDto,
} from '../types/api';

import { DetailedDonor, DetailedAppointment } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  status?: number;
  details?: Array<{ field: string; message: string }>;

  constructor(message: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('bdms_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Sends and receives HttpOnly session cookies
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        errorBody.error ||
        errorBody.message ||
        `HTTP error ${response.status}: ${response.statusText}`;
      throw new ApiError(message, response.status, errorBody.details);
    }

    const json: ApiResponse<T> = await response.json();
    return json.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // If backend server is unreachable
    const msg = (error as Error).message || '';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      throw new ApiError(
        'Unable to reach backend server. Please verify that the Express backend is running on http://localhost:5000 and PostgreSQL is accessible.',
        503
      );
    }
    throw new ApiError(msg, 500);
  }
}

export const api = {
  /**
   * Check PostgreSQL database connection and server health
   */
  async checkHealth(): Promise<{ status: string; database: string }> {
    try {
      return await request<{ status: string; database: string }>('/health');
    } catch {
      return { status: 'offline', database: 'disconnected' };
    }
  },

  /**
   * Fetch aggregated dashboard summary data from PostgreSQL database
   */
  async getDashboardSummary(): Promise<DashboardSummaryData> {
    const live = await request<DashboardSummaryData>('/dashboard');
    return live;
  },

  /**
   * Search and filter donors in PostgreSQL database
   */
  async searchDonors(query: SearchDonorsQuery): Promise<{ donors: DetailedDonor[]; total: number }> {
    const params = new URLSearchParams();
    if (query.bloodGroup && query.bloodGroup !== 'ALL') params.append('bloodGroup', query.bloodGroup);
    if (query.district && query.district !== 'ALL') params.append('district', query.district);
    if (query.thana && query.thana !== 'ALL') params.append('thana', query.thana);
    if (query.search) params.append('search', query.search);
    if (query.page) params.append('page', String(query.page));
    if (query.limit) params.append('limit', String(query.limit || 50));

    const qs = params.toString();
    try {
      const serverResult = await request<any>(`/donors${qs ? `?${qs}` : ''}`);
      let donorsList: any[] = [];

      if (Array.isArray(serverResult)) {
        donorsList = serverResult;
      } else if (serverResult && Array.isArray(serverResult.donors)) {
        donorsList = serverResult.donors;
      }

      const normalized: DetailedDonor[] = donorsList.map((d: any) => ({
        id: d.id,
        name: d.name,
        bloodGroup: d.bloodGroup,
        gender: d.gender || 'Male',
        age: typeof d.age === 'number' ? d.age : 25,
        phone: d.phone,
        email: d.email || '',
        district: d.district || 'Dhaka',
        thana: d.thana || 'Central',
        lastDonationDate: d.lastDonationDate || null,
        totalDonations: typeof d.totalDonations === 'number' ? d.totalDonations : 0,
        status: d.status || 'Eligible',
        weightKg: typeof d.weightKg === 'number' ? d.weightKg : 65,
        readyForEmergency: d.readyForEmergency !== undefined ? d.readyForEmergency : true,
        notes: d.ineligibilityReason || d.notes,
      }));

      return {
        donors: normalized,
        total: serverResult?.meta?.total ?? serverResult?.total ?? normalized.length,
      };
    } catch (error) {
      console.warn('⚠️ Database query for donors failed:', (error as Error).message);
      return { donors: [], total: 0 };
    }
  },

  /**
   * Get donor by ID from PostgreSQL database
   */
  async getDonorById(id: string): Promise<DetailedDonor | null> {
    try {
      const res = await request<any>(`/donors/${id}`);
      if (res && res.id) {
        return {
          id: res.id,
          name: res.name,
          bloodGroup: res.bloodGroup,
          gender: res.gender || 'Male',
          age: typeof res.age === 'number' ? res.age : 25,
          phone: res.phone,
          email: res.email || '',
          district: res.district || 'Dhaka',
          thana: res.thana || 'Central',
          lastDonationDate: res.lastDonationDate || null,
          totalDonations: typeof res.totalDonations === 'number' ? res.totalDonations : 0,
          status: res.status || 'Eligible',
          weightKg: typeof res.weightKg === 'number' ? res.weightKg : 65,
          readyForEmergency: res.readyForEmergency !== undefined ? res.readyForEmergency : true,
          notes: res.ineligibilityReason || res.notes,
        };
      }
    } catch {}
    return null;
  },

  /**
   * Register a new donor into PostgreSQL database.
   */
  async createDonor(dto: CreateDonorDto): Promise<DetailedDonor> {
    const created = await request<any>('/donors', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    return {
      id: created.id,
      name: created.name,
      bloodGroup: created.bloodGroup,
      gender: created.gender || dto.gender || 'Male',
      age: created.age || dto.age || 25,
      phone: created.phone || dto.phone,
      email: created.email || dto.email || '',
      district: created.district || dto.district,
      thana: created.thana || dto.thana,
      lastDonationDate: created.lastDonationDate || dto.lastDonationDate || null,
      totalDonations: typeof created.totalDonations === 'number' ? created.totalDonations : (dto.totalDonations || 0),
      status: created.status || 'Eligible',
      weightKg: created.weightKg || dto.weightKg || 65,
      readyForEmergency: created.readyForEmergency !== undefined ? created.readyForEmergency : true,
    };
  },

  /**
   * Update existing donor profile in PostgreSQL database
   */
  async updateDonor(id: string, data: Partial<CreateDonorDto & { status?: string; ineligibilityReason?: string }>): Promise<DetailedDonor> {
    const updated = await request<any>(`/donors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    return {
      id: updated.id,
      name: updated.name,
      bloodGroup: updated.bloodGroup,
      gender: updated.gender || 'Male',
      age: typeof updated.age === 'number' ? updated.age : 25,
      phone: updated.phone,
      email: updated.email || '',
      district: updated.district,
      thana: updated.thana,
      lastDonationDate: updated.lastDonationDate || null,
      totalDonations: typeof updated.totalDonations === 'number' ? updated.totalDonations : 0,
      status: updated.status || 'Eligible',
      weightKg: typeof updated.weightKg === 'number' ? updated.weightKg : 65,
      readyForEmergency: updated.readyForEmergency !== undefined ? updated.readyForEmergency : true,
      notes: updated.ineligibilityReason || updated.notes,
    };
  },

  /**
   * Get blood stock levels from PostgreSQL
   */
  async getBloodStock(): Promise<BloodStockItem[]> {
    try {
      const stock = await request<BloodStockItem[]>('/blood-stock');
      if (Array.isArray(stock)) return stock;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Get blood requests from PostgreSQL
   */
  async getRecentRequests(): Promise<BloodRequestItem[]> {
    try {
      const res = await request<BloodRequestItem[]>('/blood-requests');
      if (Array.isArray(res)) return res;
      return [];
    } catch (err) {
      console.warn('⚠️ Could not load blood requests from PostgreSQL:', (err as Error).message);
      return [];
    }
  },

  /**
   * Query blood requests with filters from PostgreSQL
   */
  async getBloodRequests(query?: {
    urgency?: string;
    bloodGroup?: string;
    hospital?: string;
    requesterId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: BloodRequestItem[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (query?.urgency && query.urgency !== 'ALL') params.append('urgency', query.urgency);
      if (query?.bloodGroup && query.bloodGroup !== 'ALL') params.append('bloodGroup', query.bloodGroup);
      if (query?.hospital) params.append('hospital', query.hospital);
      if (query?.requesterId) params.append('requesterId', query.requesterId);
      if (query?.page) params.append('page', String(query.page));
      if (query?.limit) params.append('limit', String(query.limit));
      const qs = params.toString();
      const res = await request<any>(`/blood-requests${qs ? `?${qs}` : ''}`);
      if (Array.isArray(res)) {
        return { requests: res, total: res.length };
      }
      return { requests: res.requests || [], total: res.pagination?.total || (res.requests?.length || 0) };
    } catch {
      return { requests: [], total: 0 };
    }
  },

  /**
   * Submit a new blood request to PostgreSQL.
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
      if (Array.isArray(res)) return res;
      return [];
    } catch (err) {
      console.warn('⚠️ Could not load appointments from PostgreSQL:', (err as Error).message);
      return [];
    }
  },

  /**
   * Book a blood donation appointment in PostgreSQL.
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
   * Schedule appointment alias
   */
  async createAppointment(dto: CreateAppointmentDto): Promise<DetailedAppointment> {
    return this.bookAppointment(dto);
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

  /**
   * Get donation records from PostgreSQL
   */
  async getDonations(query?: { donorId?: string; bloodGroup?: string; page?: number; limit?: number }): Promise<DonationItem[]> {
    try {
      const params = new URLSearchParams();
      if (query?.donorId) params.append('donorId', query.donorId);
      if (query?.bloodGroup && query.bloodGroup !== 'ALL') params.append('bloodGroup', query.bloodGroup);
      if (query?.page) params.append('page', String(query.page));
      if (query?.limit) params.append('limit', String(query.limit));
      const qs = params.toString();
      const res = await request<DonationItem[]>(`/donations${qs ? `?${qs}` : ''}`);
      if (Array.isArray(res)) return res;
      return [];
    } catch (err) {
      console.warn('⚠️ Could not load donations from PostgreSQL:', (err as Error).message);
      return [];
    }
  },

  /**
   * Record a verified blood donation in PostgreSQL
   */
  async recordDonation(dto: CreateDonationDto): Promise<DonationItem> {
    return await request<DonationItem>('/donations', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Register a new user account with secure password hashing and HttpOnly session cookie
   */
  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }): Promise<{ user: any; token: string }> {
    const result = await request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result && result.token && typeof window !== 'undefined') {
      localStorage.setItem('bdms_token', result.token);
    }
    return result;
  },

  /**
   * Login with email and password, establishing HttpOnly session cookie
   */
  async login(data: { email: string; password: string }): Promise<{ user: any; token: string }> {
    const result = await request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result && result.token && typeof window !== 'undefined') {
      localStorage.setItem('bdms_token', result.token);
    }
    return result;
  },

  /**
   * Logout user, clearing server session cookie and local token
   */
  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bdms_token');
      }
    }
  },

  /**
   * Retrieve current authenticated user profile
   */
  async getCurrentUser(): Promise<any | null> {
    try {
      return await request<any>('/auth/me');
    } catch {
      return null;
    }
  },

  /**
   * Update profile fields (name, phone, avatarUrl) and optional linked donor details
   */
  async updateProfile(data: {
    name?: string;
    phone?: string | null;
    avatarUrl?: string | null;
    donor?: {
      bloodGroup?: string;
      gender?: string;
      age?: number;
      district?: string;
      thana?: string;
      totalDonations?: number;
      readyForEmergency?: boolean;
      isAvailable?: boolean;
      weightKg?: number | null;
    };
  }): Promise<any> {
    return await request<any>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Change password securely
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return await request<{ message: string }>('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Step 1 of Organization Admin Sign In: Validates credentials and administrative eligibility,
   * triggering a single-use verification challenge
   */
  async initiateOrganizationLogin(data: { email: string; password: string }): Promise<{
    success: boolean;
    challengeId: string;
    maskedEmail: string;
    expiresInSeconds: number;
    provider: string;
    providerConfigured: boolean;
    message: string;
  }> {
    return await request<any>('/auth/organization/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Step 2 of Organization Admin Sign In: Verifies 6-digit challenge code and establishes admin session
   */
  async verifyOrganizationLogin(data: { challengeId: string; code: string }): Promise<{
    user: any;
    token: string;
  }> {
    const result = await request<{ user: any; token: string }>('/auth/organization/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (result && result.token && typeof window !== 'undefined') {
      localStorage.setItem('bdms_token', result.token);
    }
    return result;
  },

  /**
   * Initiate password recovery
   */
  async forgotPassword(email: string): Promise<{ success: boolean; challengeId?: string; message: string }> {
    return await request<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Complete password recovery with verified code
   */
  async resetPassword(data: { challengeId: string; code: string; newPassword: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    return await request<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
