import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, X, Clock } from 'lucide-react';
import adminPhoto from '../../assets/admin-photo.png';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onMenuToggle?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onProfileClick?: () => void;
  onSearchSubmit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  searchQuery,
  onSearchChange,
  onProfileClick,
  onSearchSubmit,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  const recentNotifications = [
    {
      id: 1,
      title: 'Urgent O+ Blood Needed',
      hospital: 'Dhaka Medical College Hospital',
      time: '2 hours ago',
      urgent: true,
      group: 'O+',
    },
    {
      id: 2,
      title: 'A- Request Pending Match',
      hospital: 'Square Hospital',
      time: '5 hours ago',
      urgent: false,
      group: 'A-',
    },
    {
      id: 3,
      title: 'Donation Drive Scheduled',
      hospital: 'National Heart Foundation',
      time: '7 hours ago',
      urgent: false,
      group: 'B+',
    },
  ];

  return (
    <header className="notification-bar h-16 bg-white dark:bg-[#0c1527] border-b border-slate-100 dark:border-slate-800/90 px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: Hamburger menu toggle + Long Search Field */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          title="Toggle Navigation"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="relative w-full max-w-lg search-bar-container">
          <Search className="search-bar-icon w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchSubmit?.();
            }}
            placeholder="Search donors, blood group, or request ID..."
            className="search-bar-input w-full pl-10 pr-4 py-2 bg-[#f1f5f9]/80 dark:bg-[#131d33] hover:bg-[#edf2f7] dark:hover:bg-[#182542] focus:bg-white dark:focus:bg-[#15213b] border border-slate-200/80 dark:border-slate-800/60 rounded-xl text-xs md:text-sm text-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right: Theme Toggle, Notifications & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Theme Selector (Light / Dark / System / Custom) */}
        <ThemeToggle />

        {/* Notification Bell with Dropdown Menu */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="notification-bell-btn relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors border border-transparent"
            aria-label="Notifications"
            title="Notifications (3 new)"
          >
            <Bell className="w-5 h-5" />
            <span className="notification-badge absolute top-1.5 right-1.5 w-4 h-4 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-[#0c1527] shadow-xs">
              3
            </span>
          </button>

          {/* Interactive Notifications Panel */}
          {notificationsOpen && (
            <div className="notification-panel absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 dark:border-slate-800/80 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[13px] text-slate-900 dark:text-white">Notifications</h4>
                  <span className="notification-badge px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
                    3 New
                  </span>
                </div>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#131d33] hover:bg-slate-100 dark:hover:bg-[#182542] transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[10.5px] font-bold text-white shadow-xs ${
                        notif.urgent ? 'bg-[#ef4444]' : 'bg-[#2563eb]'
                      }`}
                    >
                      {notif.group}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {notif.title}
                      </p>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-400 mt-0.5 truncate">
                        {notif.hospital}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[9.5px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-opacity text-left bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded-full"
          title="Open User Profile & Authentication"
          aria-label="User Profile"
        >
          <div className="user-avatar-ring w-10 h-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs">
            <img
              src={adminPhoto}
              alt="Shoufiq Rahman Shifat"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-bold text-[#0f172a] dark:text-white leading-tight">
              Shoufiq Rahman Shifat
            </p>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
};
