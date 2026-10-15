import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  avatarUrl?: string | null;
  donorProfile?: {
    id: string;
    bloodGroup: string;
    gender: string;
    age: number;
    district: string;
    thana: string;
    status: string;
    isAvailable: boolean;
    readyForEmergency: boolean;
    totalDonations: number;
    lastDonationDate?: string | null;
    nextEligibleDate?: string | null;
  } | null;
  createdAt?: string;
  lastLoginAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const profile = await api.getCurrentUser();
      if (profile && profile.id) {
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (res && res.user) {
      setUser(res.user);
      // Fetch full profile with linked donor details
      await fetchCurrentUser();
    }
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string; role?: string }) => {
    const res = await api.register(data);
    if (res && res.user) {
      setUser(res.user);
      await fetchCurrentUser();
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
