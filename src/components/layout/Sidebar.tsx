import React, { useState } from 'react';
import {
  Search,
  Calculator,
  PhoneCall,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BloodDonorBrandLogo,
  DashboardNavIcon,
  DonorsNavIcon,
  BloodRequestsNavIcon,
  BloodStockNavIcon,
  AppointmentsNavIcon,
  ReportsNavIcon,
  ToolsNavIcon,
  GiveBloodSaveLivesWidget
} from '../common/DashboardIcons';

// Heart with medical cross icon matching the dashboard reference screenshot for eligibility
const MedicalHeartIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    <path d="M12 7.5v6M9 10.5h6" stroke="#0c1527" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  // toolsOpen is false by default so hidden items do NOT show on refresh/initial enter
  const [toolsOpen, setToolsOpen] = useState(false);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardNavIcon },
    { id: 'donors', label: 'Donors', icon: DonorsNavIcon },
    { id: 'blood-requests', label: 'Blood Requests', icon: BloodRequestsNavIcon },
    { id: 'blood-stock', label: 'Blood Stock', icon: BloodStockNavIcon },
    { id: 'appointments', label: 'Appointments', icon: AppointmentsNavIcon },
    { id: 'reports', label: 'Reports', icon: ReportsNavIcon },
  ];

  const toolItems = [
    { id: 'search-blood-group', label: 'Search Blood Group', icon: Search },
    { id: 'bmi-calculator', label: 'BMI Calculator', icon: Calculator },
    { id: 'eligibility', label: 'Blood Donation Eligibility', icon: MedicalHeartIcon },
    { id: 'emergency-contacts', label: 'Emergency Contacts', icon: PhoneCall },
  ];

  return (
    <aside className="w-[240px] bg-[#0c1527] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 select-none border-r border-[#15213b] z-30">
      {/* Brand Header with Exact Screenshot Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="shrink-0 flex items-center justify-center">
          <BloodDonorBrandLogo className="w-9 h-9" />
        </div>
        <div className="min-w-0">
          <h1 className="text-white font-bold text-[15px] leading-tight tracking-tight truncate">
            Blood Donor
          </h1>
          <p className="text-slate-400 text-[11px] font-normal truncate mt-0.5">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation List - Custom Scrollbar */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-150 ${
                isActive
                  ? 'bg-[#ef4444] text-white shadow-md shadow-red-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        {/* Tools Section */}
        <div className="pt-2">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[12px] font-medium text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <ToolsNavIcon className="w-4 h-4 text-slate-400" />
              <span>Tools</span>
            </div>
            {toolsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {toolsOpen && (
            <div className="mt-0.5 space-y-0.5 pl-3 border-l border-slate-800 ml-4">
              {toolItems.map((tool) => {
                const ToolIcon = tool.icon;
                const isToolActive = currentTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onTabChange(tool.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11.5px] transition-all ${
                      isToolActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <ToolIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="tracking-tight leading-tight text-left">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="pt-1">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13px] transition-all duration-150 ${
              currentTab === 'settings'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Decorative Blood Donation Graphic at the bottom */}
      <GiveBloodSaveLivesWidget />
    </aside>
  );
};
