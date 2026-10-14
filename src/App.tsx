import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
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

import {
  INITIAL_STAT_METRICS,
  DONORS_BY_BLOOD_GROUP,
  GENDER_DISTRIBUTION,
  RECENT_BLOOD_REQUESTS,
  BLOOD_STOCK_DATA,
  DONOR_REGISTRATION_TRENDS,
} from './data/mockData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [searchResultsNotice, setSearchResultsNotice] = useState<string | null>(null);

  const handleQuickAction = (actionId: string) => {
    setActiveModal(actionId);
  };

  const handleSearchBlood = (bloodGroup: string, district: string, thana: string) => {
    const queryParts = [bloodGroup, district, thana].filter(Boolean).join(' • ');
    setSearchResultsNotice(
      queryParts
        ? `Filtered donors matching: ${queryParts} (Found 14 matching donors in temporary preview database)`
        : 'Please select a blood group or location to search donors.'
    );
    setTimeout(() => {
      setSearchResultsNotice(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#f3f6fa] flex flex-row font-sans text-slate-800 antialiased selection:bg-red-500 selection:text-white">
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
            if (tab === 'bmi-calculator' || tab === 'search-blood-group') {
              setActiveModal(tab);
            }
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
        />

        {/* Page Container */}
        <main className="flex-1 px-5 py-3.5 space-y-3 max-w-[1536px] w-full">
          {/* Desktop 2-Column Grid Layout matching screenshot:
              - Left Section (~74%): Header -> 4 Stat Cards -> 2 Charts -> Blood Stock & Trend -> Search Blood Group
              - Right Section (~26%): Recent Blood Requests -> Quick Actions (aligned with Stat Cards)
          */}
          <div className="flex flex-col xl:flex-row gap-3.5 items-start">
            {/* Left Main Section */}
            <div className="flex-1 min-w-0 space-y-3 w-full">
              {/* Header Row: Dashboard Title, Subtitle, and Date chip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 h-[44px]">
                <div>
                  <h1 className="text-[23px] font-bold text-[#0f172a] tracking-tight leading-tight">
                    Dashboard
                  </h1>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    Welcome back, Shifat! Here's an overview of the blood donor management system.
                  </p>
                </div>

                {/* Date Chip matching screenshot */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200/70 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] font-medium text-slate-600 self-start sm:self-auto shrink-0">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tuesday, 7 Oct 2025</span>
                </div>
              </div>

              {/* Row 1: 4 Stat Cards */}
              <StatCards stats={INITIAL_STAT_METRICS} />

              {/* Row 2: Donors by Blood Group & Gender Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <DonorsByBloodGroupChart data={DONORS_BY_BLOOD_GROUP} />
                <GenderDistributionChart data={GENDER_DISTRIBUTION} totalDonors="1,248" />
              </div>

              {/* Row 3: Blood Stock Table & Donor Registration Trend */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div className="lg:col-span-5 h-full">
                  <BloodStockTable
                    stock={BLOOD_STOCK_DATA}
                    onViewAll={() => setCurrentTab('blood-stock')}
                  />
                </div>
                <div className="lg:col-span-7 h-full">
                  <DonorTrendChart data={DONOR_REGISTRATION_TRENDS} />
                </div>
              </div>

              {/* Row 4: Search Blood Group Section */}
              <BloodGroupSearch onSearch={handleSearchBlood} />
            </div>

            {/* Right Sidebar Widgets Column (~325px, aligned with 4 Stat Cards) */}
            <div className="w-full xl:w-[325px] shrink-0 space-y-3.5 flex flex-col xl:pt-[48px]">
              {/* Recent Blood Requests */}
              <RecentBloodRequests
                requests={RECENT_BLOOD_REQUESTS}
                onViewAll={() => setCurrentTab('blood-requests')}
              />

              {/* Quick Actions */}
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Action Modals */}
      <ActionModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};

export default App;
