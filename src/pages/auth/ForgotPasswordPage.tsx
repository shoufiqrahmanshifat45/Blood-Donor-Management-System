import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

export const ForgotPasswordPage: React.FC = () => {
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.forgotPassword(email.trim());
      if (res.challengeId) {
        setChallengeId(res.challengeId);
      }
      success('Reset Code Dispatched', res.message);
      setStep('reset');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code.trim() || code.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.resetPassword({
        challengeId,
        code: code.trim(),
        newPassword,
      });
      success('Password Reset Successful', res.message || 'You may now log in with your new password.');
      navigate('/login');
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account Recovery
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {step === 'request'
              ? 'Enter your registered email address to receive a secure recovery code.'
              : 'Enter your 6-digit reset challenge code and choose a new password.'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Account Email Address
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all"
              >
                {isSubmitting ? 'Sending Reset Code...' : 'Request Recovery Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  6-Digit Recovery Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono font-bold px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-red-500/25 transition-all"
              >
                {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              &larr; Back to Member Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
