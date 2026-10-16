import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BloodRequestsView } from '../BloodRequestsView';

export const PublicBloodRequests: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Blood Requests Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View current emergency blood requests from hospitals across Bangladesh or broadcast a new requirement.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <BloodRequestsView
          onFindDonor={(bloodGroup) => navigate(`/find-donors?group=${encodeURIComponent(bloodGroup)}`)}
        />
      </div>
    </div>
  );
};
