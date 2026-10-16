import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

// Layouts & Guards
import { PublicLayout } from './components/public/PublicLayout';
import { MemberLayout } from './components/member/MemberLayout';
import { AdminRouteGuard } from './components/auth/AdminRouteGuard';
import { MemberRouteGuard } from './components/auth/MemberRouteGuard';

// Public Experience Pages
import { LandingPage } from './pages/public/LandingPage';
import { PublicFindDonors } from './pages/public/PublicFindDonors';
import { PublicBloodRequests } from './pages/public/PublicBloodRequests';
import { PublicRegisterDonor } from './pages/public/PublicRegisterDonor';
import { PublicTools } from './pages/public/PublicTools';

// Authentication Pages
import { AuthPage } from './pages/auth/AuthPage';
import { OrganizationSignIn } from './pages/auth/OrganizationSignIn';
import { OrganizationVerify } from './pages/auth/OrganizationVerify';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// General Member Portal Pages
import { MemberOverview } from './pages/member/MemberOverview';
import { MemberRequests } from './pages/member/MemberRequests';
import { MemberProfile } from './pages/member/MemberProfile';
import { MemberDonationHistory } from './pages/member/MemberDonationHistory';
import { MemberAppointments } from './pages/member/MemberAppointments';

// Admin Management Dashboard
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. Public Website Portal Experience */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/find-donors" element={<PublicFindDonors />} />
                <Route path="/blood-requests" element={<PublicBloodRequests />} />
                <Route path="/register-donor" element={<PublicRegisterDonor />} />
                <Route path="/tools" element={<PublicTools />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<AuthPage initialMode="login" />} />
                <Route path="/signup" element={<AuthPage initialMode="signup" />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/organization/sign-in" element={<OrganizationSignIn />} />
                <Route path="/organization/verify" element={<OrganizationVerify />} />
              </Route>

              {/* 2. General Member Dashboard Experience (Guarded) */}
              <Route
                path="/member"
                element={
                  <MemberRouteGuard>
                    <MemberLayout />
                  </MemberRouteGuard>
                }
              >
                <Route index element={<Navigate to="/member/dashboard" replace />} />
                <Route path="dashboard" element={<MemberOverview />} />
                <Route path="donors" element={<PublicFindDonors />} />
                <Route path="requests" element={<MemberRequests />} />
                <Route path="profile" element={<MemberProfile />} />
                <Route path="become-donor" element={<MemberProfile />} />
                <Route path="donation-history" element={<MemberDonationHistory />} />
                <Route path="appointments" element={<MemberAppointments />} />
              </Route>

              {/* 3. Protected Admin / Staff Management Dashboard Experience (Guarded) */}
              <Route path="/admin" element={<Navigate to="/management" replace />} />
              <Route path="/admin/*" element={<Navigate to="/management" replace />} />
              <Route
                path="/management"
                element={
                  <AdminRouteGuard>
                    <AdminDashboard />
                  </AdminRouteGuard>
                }
              />
              <Route
                path="/management/*"
                element={
                  <AdminRouteGuard>
                    <AdminDashboard />
                  </AdminRouteGuard>
                }
              />

              {/* Fallback Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
