import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Droplet,
  Search,
  HeartHandshake,
  Activity,
  LogIn,
  UserPlus,
  ShieldAlert,
  Menu,
  X,
  User,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const PublicNavbar: React.FC = () => {
  const { user, isAuthenticated, isStaffOrAdmin, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Donors', path: '/find-donors', icon: Search },
    { label: 'Blood Requests', path: '/blood-requests', icon: Droplet },
    { label: 'Become a Donor', path: '/register-donor', icon: HeartHandshake },
    { label: 'Health Tools', path: '/tools', icon: Activity },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition-all">
              <Droplet className="w-6 h-6 fill-white stroke-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                BloodLine
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60">
                BDMS Portal
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Connecting Donors & Saving Lives
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    active
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isStaffOrAdmin ? (
                  <Link
                    to="/management"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold shadow-sm transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/member/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm shadow-red-500/20 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Member Portal
                  </Link>
                )}

                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-semibold shadow-md shadow-red-500/25 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>

                <Link
                  to="/organization/sign-in"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-colors"
                  title="Organization Admin & Staff Portal"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  Admin / Staff
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 rounded-lg"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1324] px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 opacity-75" />}
              {item.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {isAuthenticated ? (
              <>
                {isStaffOrAdmin ? (
                  <Link
                    to="/management"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Management
                  </Link>
                ) : (
                  <Link
                    to="/member/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold"
                  >
                    <User className="w-4 h-4" />
                    Member Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    navigate('/');
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-red-600 bg-red-50 dark:bg-red-950/40 text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
                <Link
                  to="/organization/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Organization Staff Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
