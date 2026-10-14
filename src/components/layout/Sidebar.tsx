import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Droplet,
  CalendarCheck2,
  BarChart3,
  Wrench,
  Search,
  Calculator,
  ShieldCheck,
  PhoneCall,
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const [toolsOpen, setToolsOpen] = useState(true);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'blood-requests', label: 'Blood Requests', icon: Package },
    { id: 'blood-stock', label: 'Blood Stock', icon: Droplet },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const toolItems = [
    { id: 'search-blood-group', label: 'Search Blood Group', icon: Search },
    { id: 'bmi-calculator', label: 'BMI Calculator', icon: Calculator },
    { id: 'eligibility', label: 'Blood Donation Eligibility', icon: ShieldCheck },
    { id: 'emergency-contacts', label: 'Emergency Contacts', icon: PhoneCall },
  ];

  return (
    <aside className="w-[240px] bg-[#0c1527] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 select-none border-r border-[#15213b] z-30">
      {/* Brand Header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/25 shrink-0">
          <div className="relative flex items-center justify-center">
            <Droplet className="w-6 h-6 fill-white text-white" />
            <span className="absolute text-[11px] font-black text-red-600 leading-none top-2.5">+</span>
          </div>
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
              <Wrench className="w-4 h-4 text-slate-400" />
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
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all ${
                      isToolActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <ToolIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{tool.label}</span>
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
          <div className="relative mb-2">
            <div className="w-13 h-13 w-[52px] h-[52px] rounded-full border-2 border-red-500/70 bg-gradient-to-b from-red-600/20 to-red-950/40 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <div className="relative flex items-center justify-center">
                <Droplet className="w-7 h-7 text-red-500 fill-red-500 filter drop-shadow" />
                <span className="absolute top-2.5 text-white text-[12px] font-black leading-none">+</span>
              </div>
            </div>
          </div>

          {/* Script typography matching screenshot */}
          <div className="font-serif italic select-none">
            <div className="text-white text-[17px] font-semibold tracking-wide leading-tight drop-shadow-sm font-script">
              Give Blood
            </div>
            <div className="text-white text-[15px] font-semibold tracking-wide leading-tight drop-shadow-sm font-script">
              Save Lives
            </div>
          </div>
          
          {/* Red ECG Waveform Line extending across */}
          <div className="w-full mt-1.5 flex items-center justify-center">
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
