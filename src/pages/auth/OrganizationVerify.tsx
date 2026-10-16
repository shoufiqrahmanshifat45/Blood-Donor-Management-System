import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const OrganizationVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyOrganization } = useAuth();
  const { success, error } = useNotification();

  const challengeId = searchParams.get('challengeId') || '';
  const maskedEmail = searchParams.get('email') || 'your organizational email';

  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes

  // In development mode, auto-fetch code from dev challenge reader
  useEffect(() => {
    if (challengeId) {
      fetch(`/api/auth/dev-code/${encodeURIComponent(challengeId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.code) {
            setDevCode(data.code);
          }
        })
        .catch(() => {});
    }
  }, [challengeId]);

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = code.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (!challengeId) {
      setErrorMessage('Missing verification challenge session. Please return to step 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOrganization(challengeId, cleanCode);
      success('Verification Successful', 'Administrative credentials verified. Welcome to Management.');
      navigate('/management', { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Verification code validation failed.';
      setErrorMessage(msg);
      error('Verification Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security Verification Code
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A single-use 6-digit challenge code was issued to:
          </p>
          <div className="mt-1 inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            {maskedEmail}
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Expiry Timer */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Code Expiry:
            </span>
            <span className={`font-mono font-bold ${secondsRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
              {formattedTime}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength={8}
                autoFocus
                placeholder="0 0 0 0 0 0"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl font-black px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-amber-500 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/20"
              />
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Codes are single-use and expire in 10 minutes. Max 5 verification attempts allowed.
              </p>
            </div>

            {/* Local Development Auto-Fill Banner */}
            {devCode && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Dev Mode Challenge Code:
                  </span>
                  <span className="font-mono text-base font-black tracking-widest text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    {devCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCode(devCode)}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Click to Auto-Fill [{devCode}]
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || secondsRemaining <= 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'Validating Challenge...' : 'Verify & Enter Management'}
            </button>
          </form>

          {/* Provider Status / Development Environment Note */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <Info className="w-3.5 h-3.5 text-blue-500" /> Messaging Provider Status
              </div>
              <p className="text-[11px] leading-relaxed">
                External email delivery is unconfigured in this environment. To enable live delivery, configure <code className="text-amber-600 dark:text-amber-400">SMTP_HOST</code>, <code className="text-amber-600 dark:text-amber-400">SMTP_USER</code>, and <code className="text-amber-600 dark:text-amber-400">SMTP_PASS</code> in <code className="text-slate-500">server/.env</code>.
              </p>
            </div>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/organization/sign-in"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              &larr; Back to Step 1 Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
