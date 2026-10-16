import React from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, RefreshCw, LogOut, ArrowRight, UserCheck } from 'lucide-react';

export const AdminRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, isStaffOrAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Verifying organization security credentials...
        </p>
      </div>
    );
  }

  // Not authenticated at all -> redirect to Organization 2FA Sign In
  if (!isAuthenticated) {
    return <Navigate to="/organization/sign-in" state={{ from: location }} replace />;
  }

  // Authenticated as General Member/Donor but lacking administrative role
  if (!isStaffOrAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-7 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Administrative Access Required
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              The Admin & Staff Management Portal requires administrative privileges (<span className="text-amber-400 font-mono">SUPER_ADMIN</span>, <span className="text-amber-400 font-mono">ADMIN</span>, or <span className="text-amber-400 font-mono">STAFF</span>).
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-left text-xs space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Currently signed in as:</span>
            </div>
            <div className="font-mono text-slate-200 pl-6 text-[11px] truncate">{user?.email}</div>
            <div className="text-slate-400 pl-6 text-[11px]">
              Assigned Role: <span className="text-amber-300 font-bold uppercase">{user?.role || 'DONOR'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={async () => {
                await logout();
                navigate('/organization/sign-in', { replace: true });
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign In with an Admin Account
            </button>

            <Link
              to="/member/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              Return to Member Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
