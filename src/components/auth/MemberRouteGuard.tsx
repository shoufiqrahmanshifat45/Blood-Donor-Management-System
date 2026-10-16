import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw } from 'lucide-react';

export const MemberRouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-red-600 animate-spin mb-3" />
        <p className="text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
          Loading member profile...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
