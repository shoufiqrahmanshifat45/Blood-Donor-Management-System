import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolsView } from '../ToolsView';

export const PublicTools: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Health Tools & Eligibility Assessment
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate your BMI, check medical deferral criteria, and find nationwide emergency blood bank hotlines.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <ToolsView
          defaultTab="eligibility"
          onNavigateTab={(tab) => {
            if (tab === 'appointments') navigate('/login');
            if (tab === 'blood-requests') navigate('/blood-requests');
          }}
        />
      </div>
    </div>
  );
};
