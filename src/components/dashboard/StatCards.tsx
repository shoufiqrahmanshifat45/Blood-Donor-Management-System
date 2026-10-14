import React from 'react';
import { Users, Droplet, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { StatMetric } from '../../types/dashboard';

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
            {/* Left Icon Badge */}
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                stat.id === 'total-donors'
                  ? 'bg-[#ef4444] text-white'
                  : stat.id === 'total-donations'
                  ? 'bg-[#ef4444] text-white'
                  : stat.id === 'blood-requests'
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#10b981] text-white'
              }`}
            >
              {stat.id === 'total-donors' && <Users className="w-6 h-6 stroke-[2.2]" />}
              {stat.id === 'total-donations' && <Droplet className="w-6 h-6 fill-white stroke-none" />}
              {stat.id === 'blood-requests' && <FileText className="w-6 h-6 stroke-[2.2]" />}
              {stat.id === 'available-units' && <Droplet className="w-6 h-6 fill-white stroke-none" />}
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
