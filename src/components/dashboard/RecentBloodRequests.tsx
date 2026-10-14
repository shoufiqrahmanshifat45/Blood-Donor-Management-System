import React from 'react';
import { BloodRequest } from '../../types/dashboard';
import { getBloodGroupColor } from '../../utils/bloodGroupColors';

interface RecentBloodRequestsProps {
  requests: BloodRequest[];
  onViewAll?: () => void;
}

export const RecentBloodRequests: React.FC<RecentBloodRequestsProps> = ({
  requests,
  onViewAll
}) => {
  return (
    <div className="bg-white dark:bg-[#0c1527] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex flex-col transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#0f172a] dark:text-white text-[15px]">Recent Blood Requests</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-[#ef4444] hover:text-[#dc2626] transition-colors"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-3.5 flex-1">
        {requests.map((req) => {
          const colorDef = getBloodGroupColor(req.bloodGroup);
          return (
            <div
              key={req.id}
              className="flex items-center justify-between gap-3 p-1 rounded-xl hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              {/* Equal Rectangular Shape with Unique Blood Group Color */}
              <div
                style={{ backgroundColor: colorDef.hex }}
                className="w-[38px] h-[30px] rounded-lg inline-flex items-center justify-center font-bold text-[11.5px] text-white shrink-0 shadow-xs tracking-tight"
              >
                {req.bloodGroup}
              </div>

              {/* Patient/Requester Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-[#0f172a] dark:text-white truncate leading-tight">
                  {req.donorName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {req.hospital}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                  {req.timeAgo}
                </p>
              </div>

              {/* Status Pill Badge */}
              <div className="shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide ${
                    req.status === 'Urgent'
                      ? 'bg-[#fee2e2] text-[#ef4444] dark:bg-red-950/70 dark:text-red-400'
                      : req.status === 'Pending'
                      ? 'bg-[#fef3c7] text-[#d97706] dark:bg-amber-950/70 dark:text-amber-400'
                      : 'bg-[#dcfce7] text-[#16a34a] dark:bg-emerald-950/70 dark:text-emerald-400'
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
