import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  KeyRound,
  Info,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const OrganizationSignIn: React.FC = () => {
  const { error, info } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your organizational email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.initiateOrganizationLogin({
        email: email.trim(),
        password,
      });

      info(
        'Verification Initiated',
        res.message || 'Verification challenge generated. Please enter your 6-digit code.'
      );

      // Redirect to Step 2 Verification with state
      navigate(`/organization/verify?challengeId=${encodeURIComponent(res.challengeId)}&email=${encodeURIComponent(res.maskedEmail)}`);
    } catch (err: any) {
      const msg = err.message || 'Organization authentication failed.';
      setErrorMessage(msg);
      error('Access Denied', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md shadow-red-500/10 border border-slate-200 dark:border-slate-800">
              <img
                src="/logo.png"
                alt="RedPulse Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Organization Staff Portal
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Authorized administrative & clinical staff management sign-in
          </p>
        </div>

        {/* Security Policy Alert Banner */}
        <div className="rounded-2xl p-4 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
            <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Two-Step Verification Enforced
          </div>
          <p className="leading-relaxed text-amber-700 dark:text-amber-300/90">
            Organization administrators and hospital coordinators must complete an organization-issued 2FA verification challenge before management access is granted.
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Staff / Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@redpulse.org or staff@hospital.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>

            {/* Developer Super Admin Quick-Fill Helper */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Developer Super Admin
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('shoufiqrahmanshifat2021@gmail.com');
                    setPassword('Admin123!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors"
                >
                  Auto-Fill
                </button>
              </div>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
                Shoufiq Rahman Shifat (shoufiqrahmanshifat2021@gmail.com)
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Authenticating & Generating Code...' : 'Proceed to Step 2 Verification'}
            </button>
          </form>

          {/* Quick link back to general member sign in */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Not an organization staff member?{' '}
              <Link to="/login" className="font-semibold text-red-600 dark:text-red-400 hover:underline">
                Sign in to General Member Portal &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
