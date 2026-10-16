import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Droplet,
  User,
  ShieldAlert,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const AuthPage: React.FC<{ initialMode?: 'login' | 'signup' }> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const { login, register, isAuthenticated, isStaffOrAdmin } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isStaffOrAdmin) {
        navigate('/management', { replace: true });
      } else {
        navigate('/member/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isStaffOrAdmin, navigate]);

  // General Member Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
        const me = await api.getCurrentUser().catch(() => null);
        const isAdmin = Boolean(
          me && ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'HOSPITAL_COORDINATOR'].includes(me.role?.toUpperCase())
        );

        if (isAdmin) {
          success('Welcome Super Admin!', 'Administrative session established. Entering Management.');
          navigate('/management', { replace: true });
        } else {
          success('Welcome Back!', 'General member sign in successful.');
          navigate('/member/dashboard', { replace: true });
        }
      } else {
        if (!name.trim()) {
          setFormError('Full name is required for registration.');
          setIsSubmitting(false);
          return;
        }
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });
        success('Account Created!', 'Welcome to the BloodLine General Member Portal.');
        navigate('/member/dashboard', { replace: true });
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify your credentials.';
      setFormError(msg);
      error('Authentication Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070d19] transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/25 group-hover:scale-105 transition-all">
              <Droplet className="w-7 h-7 fill-white stroke-white" />
            </div>
          </Link>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            BloodLine Portal Access
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select your account type to proceed
          </p>
        </div>

        {/* Two Distinct Sign-In Options Selector */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#0f172a] text-red-600 dark:text-red-400 shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <User className="w-4 h-4" />
            General Member
          </button>
          <Link
            to="/organization/sign-in"
            className="py-2.5 px-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Organization Staff
          </Link>
        </div>

        {/* General Member Sign-In & Sign-Up Card */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
          {/* Sub-tab: Login vs Register */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setFormError(null);
                }}
                className={`text-sm font-bold pb-2 relative transition-colors ${
                  mode === 'login'
                    ? 'text-red-600 dark:text-red-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setFormError(null);
                }}
                className={`text-sm font-bold pb-2 relative transition-colors ${
                  mode === 'signup'
                    ? 'text-red-600 dark:text-red-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-600'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              Role: <span className="text-red-600 dark:text-red-400">Donor / Member</span>
            </span>
          </div>

          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Your legal name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="01711234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                {mode === 'login' && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 hover:shadow-red-500/35 transition-all flex items-center justify-center gap-2"
            >
              {mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  {isSubmitting ? 'Signing In...' : 'Sign In as General Member'}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  {isSubmitting ? 'Creating Account...' : 'Register as General Member'}
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Public registrations are provisioned as default member/donor accounts.
            </p>
          </div>
        </div>

        {/* Organization Portal Callout */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-center space-y-1">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Hospital Coordinator, Administrator, or Staff Member?
          </p>
          <Link
            to="/organization/sign-in"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Access Organization Staff 2FA Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
