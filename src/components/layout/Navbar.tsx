import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import adminPhoto from '../../assets/admin-photo.png';

interface NavbarProps {
  onMenuToggle?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, searchQuery, onSearchChange }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Hamburger menu toggle + Long Search Field */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="relative w-full max-w-lg">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search donors, blood group, or request ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#f1f5f9]/80 hover:bg-[#edf2f7] focus:bg-white border-none rounded-xl text-xs md:text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity">
          <div className="w-10 h-10 rounded-full ring-2 ring-slate-200 overflow-hidden bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
            <img
              src={adminPhoto}
              alt="Shifat Rahman"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-bold text-[#0f172a] leading-tight">
              Shifat Rahman
            </p>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
