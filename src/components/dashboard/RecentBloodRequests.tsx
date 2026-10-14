import React from 'react';
import { BloodRequest } from '../../types/dashboard';

interface RecentBloodRequestsProps {
  requests: BloodRequest[];
  onViewAll?: () => void;
}

export const RecentBloodRequests: React.FC<RecentBloodRequestsProps> = ({
  requests,
  onViewAll
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base">Recent Blood Requests</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-3.5 flex-1 overflow-y-auto">
        {requests.map((req) => {
          return (
            <div
              key={req.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {/* Blood Group Badge */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm ${
                  req.bloodGroupColor === 'blue'
                    ? 'bg-[#2563eb]'
                    : 'bg-[#ef4444]'
                }`}
              >
                {req.bloodGroup}
              </div>

              {/* Patient/Requester Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {req.donorName}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {req.hospital}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {req.timeAgo}
                </p>
              </div>

              {/* Status Pill Badge */}
              <div className="shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                    req.status === 'Urgent'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : req.status === 'Pending'
                      ? 'bg-amber-50 text-amber-600 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
