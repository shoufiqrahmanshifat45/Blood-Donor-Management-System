import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Droplet,
  CalendarCheck2,
  BarChart3,
  Search,
  Calculator,
  ShieldCheck,
  PhoneCall,
  Settings,
  ChevronDown,
  ChevronUp,
  Activity
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
    <aside className="w-64 bg-[#0d1527] text-slate-300 flex flex-col min-h-screen shrink-0 select-none border-r border-[#1e293b]">
      {/* Brand Header */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 shrink-0">
          <div className="relative flex items-center justify-center">
            <Droplet className="w-6 h-6 fill-white text-white" />
            <span className="absolute text-[10px] font-black text-red-600 leading-none top-2.5">+</span>
          </div>
        </div>
        <div>
          <h1 className="text-white font-bold text-base leading-tight tracking-tight">Blood Donor</h1>
          <p className="text-slate-400 text-xs font-normal">Management System</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#ef4444] text-white shadow-md shadow-red-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Tools Section */}
        <div className="pt-3">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Tools</span>
            </div>
            {toolsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {toolsOpen && (
            <div className="mt-1 space-y-1 pl-2 border-l border-slate-800 ml-4">
              {toolItems.map((tool) => {
                const ToolIcon = tool.icon;
                const isToolActive = currentTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => onTabChange(tool.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isToolActive
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <ToolIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="pt-2">
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
              currentTab === 'settings'
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Give Blood Save Lives Bottom Branding */}
      <div className="p-5 mt-auto border-t border-[#1a233a] relative overflow-hidden">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full border-2 border-red-500/80 bg-red-600/10 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            <div className="relative">
              <Droplet className="w-7 h-7 text-red-500 fill-red-500" />
              <span className="absolute top-2 left-2 text-white text-[12px] font-black">+</span>
            </div>
          </div>
          <h4 className="text-white font-serif italic text-lg leading-tight font-semibold tracking-wide">
            Give Blood
          </h4>
          <p className="text-red-400 font-serif italic text-sm tracking-wider font-semibold">
            Save Lives
          </p>
          
          {/* ECG waveform line */}
          <svg className="w-full h-8 text-red-500 stroke-current fill-none mt-1 opacity-80" viewBox="0 0 200 40">
            <path
              d="M0 20 L40 20 L50 20 L58 8 L66 32 L74 12 L82 24 L90 20 L150 20 L160 8 L170 32 L180 20 L200 20"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </aside>
  );
};
