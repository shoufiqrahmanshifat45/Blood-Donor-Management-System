import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Droplet,
  LayoutDashboard,
  Search,
  AlertCircle,
  User,
  History,
  Calendar,
  LogOut,
  Menu,
  X,
  HeartHandshake,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RealTimeClock } from '../common/RealTimeClock';

export const MemberLayout: React.FC = () => {
  const { user, logout, isStaffOrAdmin } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/member/dashboard', icon: LayoutDashboard },
    { label: 'Find Donors', path: '/member/donors', icon: Search },
    { label: 'Blood Requests', path: '/member/requests', icon: AlertCircle },
    { label: 'My Profile & Donor Status', path: '/member/profile', icon: User },
    { label: 'Donation History', path: '/member/donation-history', icon: History },
    { label: 'Appointments', path: '/member/appointments', icon: Calendar },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] dark:bg-[#070d19] flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Portal Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 lg:hidden rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/member/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 p-0.5 flex items-center justify-center shadow-md shadow-red-500/10 border border-slate-200/50 dark:border-slate-800">
                  <img
                    src="/logo.png"
                    alt="RedPulse Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight">
                    RedPulse
                  </span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                    Member Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Theme toggle, Public portal link, User avatar, Sign Out */}
            <div className="flex items-center gap-2.5">
              {/* Real-time system clock in Member topbar */}
              <div className="hidden md:block">
                <RealTimeClock variant="compact" />
              </div>

              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Home className="w-3.5 h-3.5" /> Public Site
              </Link>

              {isStaffOrAdmin && (
                <Link
                  to="/management"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

              {/* User Pill */}
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xs uppercase border border-red-500/20 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.slice(0, 2) || 'MB'
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {user?.name || 'Valued Member'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {user?.donorProfile?.bloodGroup ? `${user.donorProfile.bloodGroup} Donor` : 'General Member'}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Page Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar (260px) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          {/* Member Card */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {user?.donorProfile?.bloodGroup || 'BD'}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                  {user?.name}
                </h4>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Member
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white dark:bg-[#0f172a] rounded-2xl p-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-red-600 dark:text-red-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Help Box */}
          <div className="p-4 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40 text-xs text-red-900 dark:text-red-200 space-y-1">
            <div className="font-bold">Need Immediate Blood?</div>
            <p className="text-[11px] text-red-700 dark:text-red-300">
              Submit a broadcast request from your dashboard or call our emergency hotline directly at 999.
            </p>
          </div>

          {/* Switch to Admin / Staff Portal link */}
          <div className="pt-1 text-center">
            <Link
              to="/organization/sign-in"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-500 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Organization Staff / Admin Sign In &rarr;
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-72 max-w-[80vw] bg-white dark:bg-[#0f172a] h-full p-4 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-slate-900 dark:text-white">Member Menu</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive(item.path)
                          ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  <Home className="w-4 h-4" /> Go to Public Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic Nested Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
