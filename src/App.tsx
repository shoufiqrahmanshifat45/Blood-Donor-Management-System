import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { StatCards } from './components/dashboard/StatCards';
import { DonorsByBloodGroupChart } from './components/dashboard/DonorsByBloodGroupChart';
import { GenderDistributionChart } from './components/dashboard/GenderDistributionChart';
import { RecentBloodRequests } from './components/dashboard/RecentBloodRequests';
import { BloodStockTable } from './components/dashboard/BloodStockTable';
import { DonorTrendChart } from './components/dashboard/DonorTrendChart';
import { QuickActions } from './components/dashboard/QuickActions';
import { BloodGroupSearch } from './components/dashboard/BloodGroupSearch';
import { ActionModals } from './components/modals/ActionModals';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { RealTimeClock } from './components/common/RealTimeClock';
import { useDashboardData } from './hooks/useDashboardData';
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ListSkeleton,
} from './components/common/LoadingSkeleton';
import { ErrorBanner } from './components/common/ErrorState';
import { api } from './services/api';

// Full Page Views
import { DonorsView } from './pages/DonorsView';
import { FindDonorsView } from './pages/FindDonorsView';
import { BloodRequestsView } from './pages/BloodRequestsView';
import { AppointmentsView } from './pages/AppointmentsView';
import { ReportsView } from './pages/ReportsView';
import { ToolsView } from './pages/ToolsView';
import { SettingsView } from './pages/SettingsView';
import { AuthModal } from './components/modals/AuthModal';
import { DonorRegistrationModal } from './pages/DonorRegistrationModal';

import {
  INITIAL_STAT_METRICS,
  DONORS_BY_BLOOD_GROUP,
  GENDER_DISTRIBUTION,
  RECENT_BLOOD_REQUESTS,
  BLOOD_STOCK_DATA,
  DONOR_REGISTRATION_TRENDS,
} from './data/mockData';

const DashboardContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isRegisterDonorOpen, setIsRegisterDonorOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchBloodParams, setSearchBloodParams] = useState<{
    bloodGroup: string;
    district: string;
    thana: string;
  }>({ bloodGroup: 'O+', district: 'Dhaka', thana: '' });

  const { data, loading, error, refresh } = useDashboardData();
  const { info, success } = useNotification();

  const handleQuickAction = (actionId: string) => {
    if (actionId === 'add-donor') {
      setIsRegisterDonorOpen(true);
    } else if (actionId === 'book-appointment') {
      setCurrentTab('appointments');
    } else if (actionId === 'view-reports') {
      setCurrentTab('reports');
    } else if (actionId === 'search-blood-group') {
      setCurrentTab('search-blood-group');
    } else if (actionId === 'bmi-calculator') {
      setCurrentTab('bmi-calculator');
    } else if (actionId === 'register-request') {
      setActiveModal('register-request');
    } else {
      setActiveModal(actionId);
    }
  };

  const handleSearchBlood = async (bloodGroup: string, district: string, thana: string) => {
    setIsSearching(true);
    setSearchBloodParams({ bloodGroup, district, thana });
    try {
      const result = await api.searchDonors({ bloodGroup, district, thana });
      const queryParts = [bloodGroup, district, thana].filter(Boolean).join(' • ');
      if (result.donors.length > 0) {
        success(
          'Donors Located',
          `Found ${result.donors.length} matching donors for ${queryParts || 'all areas'}. Navigating to directory...`
        );
      } else {
        info(
          'Search Completed',
          queryParts
            ? `No exact matches for ${queryParts}. Broadcast request recommended.`
            : 'Please specify criteria to filter donors.'
        );
      }
      setCurrentTab('search-blood-group');
    } finally {
      setIsSearching(false);
    }
  };

  // Safe fallback metrics if API returns null during cold starts
  const statMetrics = data?.stats
    ? data.stats.map((s, idx) => ({
        id: s.id,
        label: s.title,
        value: String(s.value),
        trend: s.change,
        trendType: (s.isPositive ? 'up' : 'down') as 'up' | 'down',
        trendContext: s.comparisonText,
        icon: (['users', 'droplet', 'file-text', 'shield-check'][idx] || 'users') as any,
        iconBg: '',
      }))
    : INITIAL_STAT_METRICS;

  const bloodGroupChartData = data?.donorsByBloodGroup
    ? data.donorsByBloodGroup.map((d) => ({ bloodGroup: d.group, count: d.count }))
    : DONORS_BY_BLOOD_GROUP;

  const genderData = data?.genderDistribution
    ? data.genderDistribution.map((g) => ({
        name: g.gender,
        percentage: g.percentage,
        count: g.count,
        color: g.color,
      }))
    : GENDER_DISTRIBUTION;

  const stockData = data?.bloodStock
    ? data.bloodStock.map((s) => ({
        bloodGroup: s.bloodGroup,
        units: s.availableUnits,
        status: (s.status === 'Critical' ? 'Low' : s.status) as 'Good' | 'Low',
      }))
    : BLOOD_STOCK_DATA;

  const trendData = data?.donorRegistrationTrends || DONOR_REGISTRATION_TRENDS;

  const recentRequestsData = data?.recentBloodRequests
    ? data.recentBloodRequests.map((r) => ({
        id: r.id,
        donorName: r.patientName,
        bloodGroup: r.bloodGroup,
        bloodGroupColor: (['A+', 'B+', 'O+', 'AB+'].includes(r.bloodGroup) ? 'red' : 'blue') as 'red' | 'blue',
        hospital: r.hospital,
        timeAgo: r.timeAgo,
        status: (r.urgency === 'Cancelled' ? 'Pending' : r.urgency) as 'Urgent' | 'Pending' | 'Fulfilled',
      }))
    : RECENT_BLOOD_REQUESTS;

  const renderDashboardView = () => (
    <div className="flex flex-col xl:flex-row gap-3.5 items-start">
      {/* Left Main Section */}
      <div className="flex-1 min-w-0 space-y-3 w-full">
        {/* Header Row: Dashboard Title, Subtitle, and Real-Time Clock */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 h-[44px]">
          <div>
            <h1 className="text-[23px] font-bold text-[#0f172a] dark:text-white tracking-tight leading-tight">
              Dashboard
            </h1>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              Welcome back, Shoufiq Rahman Shifat! Here's an overview of the blood donor management system.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Refresh Button */}
            <button
              onClick={refresh}
              className="p-1.5 bg-white dark:bg-[#0f172a] border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Real Date and Time Feature */}
            <RealTimeClock />
          </div>
        </div>

        {/* Row 1: 4 Stat Cards */}
        {loading && !data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : (
          <StatCards stats={statMetrics} />
        )}

        {/* Row 2: Donors by Blood Group & Gender Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {loading && !data ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <DonorsByBloodGroupChart data={bloodGroupChartData} />
              <GenderDistributionChart
                data={genderData}
                totalDonors={data?.totalDonorsCount || '1,248'}
              />
            </>
          )}
        </div>

        {/* Row 3: Blood Stock Table & Donor Registration Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          <div className="lg:col-span-5 h-full">
            {loading && !data ? (
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <TableSkeleton rows={8} />
              </div>
            ) : (
              <BloodStockTable
                stock={stockData}
                onViewAll={() => setCurrentTab('reports')}
              />
            )}
          </div>
          <div className="lg:col-span-7 h-full">
            {loading && !data ? (
              <ChartSkeleton />
            ) : (
              <DonorTrendChart data={trendData} />
            )}
          </div>
        </div>

        {/* Row 4: Search Blood Group Section */}
        <BloodGroupSearch onSearch={handleSearchBlood} isLoading={isSearching} />
      </div>

      {/* Right Sidebar Widgets Column (~325px, aligned with 4 Stat Cards) */}
      <div className="w-full xl:w-[325px] shrink-0 space-y-3.5 flex flex-col xl:pt-[48px]">
        {/* Recent Blood Requests */}
        {loading && !data ? (
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <ListSkeleton count={5} />
          </div>
        ) : (
          <RecentBloodRequests
            requests={recentRequestsData}
            onViewAll={() => setCurrentTab('blood-requests')}
          />
        )}

        {/* Quick Actions */}
        <QuickActions onActionClick={handleQuickAction} />
      </div>
    </div>
  );

  const renderActiveView = () => {
    switch (currentTab) {
      case 'donors':
        return (
          <DonorsView
            initialSearchQuery={searchQuery}
            onRequestBlood={() => setCurrentTab('blood-requests')}
            onBookAppointment={() => setCurrentTab('appointments')}
          />
        );
      case 'blood-requests':
        return <BloodRequestsView />;
      case 'blood-stock':
        return <ReportsView />;
      case 'appointments':
        return <AppointmentsView onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'reports':
        return <ReportsView />;
      case 'search-blood-group':
        return (
          <FindDonorsView
            initialBloodGroup={searchBloodParams.bloodGroup}
            initialDistrict={searchBloodParams.district}
            initialThana={searchBloodParams.thana}
            onBookAppointment={() => setCurrentTab('appointments')}
            onRequestBlood={() => setCurrentTab('blood-requests')}
          />
        );
      case 'bmi-calculator':
        return <ToolsView defaultTab="bmi" onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'eligibility':
        return <ToolsView defaultTab="eligibility" onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'emergency-contacts':
        return <ToolsView defaultTab="emergency" onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'tools':
        return <ToolsView defaultTab="search" onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return renderDashboardView();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] dark:bg-[#070d19] flex flex-row font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-red-500 selection:text-white transition-colors">
      {/* Sidebar Navigation (240px wide on desktop) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => {
            if (searchQuery.trim()) {
              setCurrentTab('donors');
            }
          }}
          onProfileClick={() => setIsAuthModalOpen(true)}
        />

        {/* Page Container */}
        <main className="flex-1 px-5 py-3.5 space-y-3 max-w-[1536px] w-full">
          {/* Optional error banner if API had an error but fallback succeeded */}
          {error && (
            <ErrorBanner
              message={`Backend service offline (${error}). Displaying local cached data.`}
              onRetry={refresh}
            />
          )}

          {renderActiveView()}
        </main>
      </div>

      {/* Interactive Action Modals (for quick actions) */}
      <ActionModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSuccess={refresh}
      />

      {/* Dedicated Donor Registration Modal */}
      <DonorRegistrationModal
        isOpen={isRegisterDonorOpen}
        onClose={() => setIsRegisterDonorOpen(false)}
        onSuccess={() => {
          setIsRegisterDonorOpen(false);
          refresh();
        }}
      />

      {/* User Account / Profile / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="profile"
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <DashboardContent />
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
