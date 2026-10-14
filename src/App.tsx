import React, { useState } from 'react';
import { Calendar as CalendarIcon, Info } from 'lucide-react';
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
        ? `Filtered donors matching: ${queryParts} (Found 14 matching donors in preview database)`
        : 'Please select a blood group or location to search donors.'
    );
    setTimeout(() => {
      setSearchResultsNotice(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex flex-row">
      {/* Sidebar Navigation */}
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
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Temporary Preview Notice - Subtle floating chip */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-1.5 flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Development Preview Mode:</strong> Rendering interface matching reference screenshot using identified temporary mock data.
            </span>
          </div>
          <span className="hidden md:inline-block font-mono text-[10px] bg-amber-200/60 px-2 py-0.5 rounded text-amber-900">
            HMR Active • Vite Dev Server
          </span>
        </div>

        {/* Page Body Container */}
        <main className="flex-1 p-5 md:p-7 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Header Row: Title & Date badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h2>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                Welcome back, Shifat! Here's an overview of the blood donor management system.
              </p>
            </div>

            {/* Date Chip matching screenshot */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-medium text-slate-600 self-start sm:self-auto">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>Tuesday, 7 Oct 2025</span>
            </div>
          </div>

          {/* Search notification toast */}
          {searchResultsNotice && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex items-center justify-between animate-fade-in">
              <span>{searchResultsNotice}</span>
              <button
                onClick={() => setSearchResultsNotice(null)}
                className="font-bold ml-2 text-red-800 hover:text-red-950"
              >
                ✕
              </button>
            </div>
          )}

          {/* Top Metric Cards */}
          <StatCards stats={INITIAL_STAT_METRICS} />

          {/* Middle Row: Charts & Recent Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 8 columns: 2 charts */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-full">
                <DonorsByBloodGroupChart data={DONORS_BY_BLOOD_GROUP} />
              </div>
              <div className="h-full">
                <GenderDistributionChart data={GENDER_DISTRIBUTION} totalDonors="1,248" />
              </div>
            </div>

            {/* Right 4 columns: Recent Blood Requests */}
            <div className="lg:col-span-4 h-full">
              <RecentBloodRequests
                requests={RECENT_BLOOD_REQUESTS}
                onViewAll={() => setCurrentTab('blood-requests')}
              />
            </div>
          </div>

          {/* Lower Row: Blood Stock, Registration Trend, and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Blood Stock Table (3 cols) */}
            <div className="lg:col-span-3 h-full">
              <BloodStockTable
                stock={BLOOD_STOCK_DATA}
                onViewAll={() => setCurrentTab('blood-stock')}
              />
            </div>

            {/* Donor Trend Line/Area Chart (6 cols) */}
            <div className="lg:col-span-5 h-full">
              <DonorTrendChart data={DONOR_REGISTRATION_TRENDS} />
            </div>

            {/* Quick Actions (4 cols) */}
            <div className="lg:col-span-4 h-full">
              <QuickActions onActionClick={handleQuickAction} />
            </div>
          </div>

          {/* Bottom Row: Blood Group Search Box */}
          <BloodGroupSearch onSearch={handleSearchBlood} />
        </main>
      </div>

      {/* Interactive Action Modals */}
      <ActionModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};

export default App;
