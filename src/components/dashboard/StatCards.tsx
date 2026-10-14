import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { StatMetric } from '../../types/dashboard';
import {
  TotalDonorsStatIcon,
  TotalDonationsStatIcon,
  BloodRequestsStatIcon,
  AvailableUnitsStatIcon,
} from '../common/DashboardIcons';

interface StatCardsProps {
  stats: StatMetric[];
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-4.5 p-4 border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:shadow-sm transition-shadow"
          >
            {/* Left Icon Badge matching screenshot */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                stat.id === 'total-donors'
                  ? 'bg-[#ef4444]'
                  : stat.id === 'total-donations'
                  ? 'bg-[#ff2d55]'
                  : stat.id === 'blood-requests'
                  ? 'bg-[#2563eb]'
                  : 'bg-[#10b981]'
              }`}
            >
              {stat.id === 'total-donors' && <TotalDonorsStatIcon className="w-7 h-7" />}
              {stat.id === 'total-donations' && <TotalDonationsStatIcon className="w-7 h-7" />}
              {stat.id === 'blood-requests' && <BloodRequestsStatIcon className="w-7 h-7" />}
              {stat.id === 'available-units' && <AvailableUnitsStatIcon className="w-7 h-7" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-slate-500 truncate leading-tight">{stat.label}</p>
              <h3 className="text-[22px] font-bold text-[#0f172a] mt-0.5 tracking-tight leading-snug">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-0.5 text-[11px]">
                {stat.trendType === 'up' ? (
                  <span className="inline-flex items-center text-[#10b981] font-semibold">
                    <ArrowUp className="w-3 h-3 mr-0.5 stroke-[2.8]" />
                    {stat.trend}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[#ef4444] font-semibold">
                    <ArrowDown className="w-3 h-3 mr-0.5 stroke-[2.8]" />
                    {stat.trend}
                  </span>
                )}
                <span className="text-slate-400 font-normal">{stat.trendContext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
