import React, { useState } from 'react';
import {
  Home,
  User,
  Package,
  Droplet,
  CalendarCheck2,
  BarChart3,
  Search,
  Calculator,
  PhoneCall,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Exact crossed tools icon matching the dashboard reference screenshot
const CrossedToolsIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M4 20l4-4" />
    <path d="M14 4l6 6" />
  </svg>
);

// Heart with medical cross icon matching the dashboard reference screenshot
const MedicalHeartIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 9v6M9 12h6" strokeWidth="2" />
  </svg>
);

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const [toolsOpen, setToolsOpen] = useState(true);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'donors', label: 'Donors', icon: User },
    { id: 'blood-requests', label: 'Blood Requests', icon: Package },
    { id: 'blood-stock', label: 'Blood Stock', icon: Droplet },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 shrink-0 p-1.5 border border-red-400/30">
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
            {/* White droplet silhouette */}
            <path
              d="M12 2.5 C12 2.5 5.5 10.5 5.5 15 C5.5 18.59 8.41 21.5 12 21.5 C15.59 21.5 18.5 18.59 18.5 15 C18.5 10.5 12 2.5 12 2.5 Z"
              fill="white"
            />
            {/* Red medical cross inside droplet */}
            <path
              d="M12 10.5 V17.5 M8.5 14 H15.5"
              stroke="#dc2626"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
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
              <CrossedToolsIcon className="w-4 h-4 text-slate-400" />
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
      <div className="px-4 py-4 mt-auto border-t border-[#16223d] relative overflow-hidden bg-gradient-to-b from-transparent to-[#080e1c]">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Glowing Red Droplet Badge with Medical Cross & ECG */}
          <div className="relative mb-1.5 flex items-center justify-center">
            <div className="w-[50px] h-[50px] rounded-full border-2 border-red-500/80 bg-gradient-to-b from-red-600/25 to-red-950/50 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.35)] relative">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                {/* Red droplet with soft glow */}
                <path
                  d="M16 4.5 C16 4.5 7.5 14.5 7.5 20 C7.5 24.7 11.3 28.5 16 28.5 C20.7 28.5 24.5 24.7 24.5 20 C24.5 14.5 16 4.5 16 4.5 Z"
                  fill="#ef4444"
                />
                {/* White medical cross */}
                <path
                  d="M16 15.5 V23.5 M12 19.5 H20"
                  stroke="white"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* ECG pulse accent emerging from right */}
            <svg className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-6 text-red-400 stroke-current fill-none pointer-events-none" viewBox="0 0 32 24">
              <path
                d="M0 12 L6 12 L10 4 L14 20 L18 8 L22 14 L26 12 L32 12"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Script typography matching screenshot */}
          <div className="select-none font-script leading-tight">
            <div className="text-white text-[19px] font-semibold tracking-wide drop-shadow-sm">
              Give Blood
            </div>
            <div className="text-white text-[17px] font-semibold tracking-wide drop-shadow-sm -mt-0.5">
              Save Lives
            </div>
          </div>
          
          {/* Red ECG Waveform Line extending across bottom */}
          <div className="w-full mt-1 flex items-center justify-center">
            <svg className="w-full h-7 text-red-500 stroke-current fill-none opacity-90" viewBox="0 0 220 32">
              <path
                d="M0 16 L45 16 L55 16 L62 6 L70 26 L78 10 L86 20 L94 16 L120 16 L128 4 L138 28 L148 16 L220 16"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
};
