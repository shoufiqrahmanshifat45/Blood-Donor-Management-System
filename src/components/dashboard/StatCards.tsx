import React from 'react';
import { Users, Droplet, FileText, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatMetric } from '../../types/dashboard';

interface StatCardsProps {
  stats: StatMetric[];
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map((stat) => {
        return (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* Left Icon Badge */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                stat.id === 'total-donors'
                  ? 'bg-[#ef4444] text-white shadow-md shadow-red-500/20'
                  : stat.id === 'total-donations'
                  ? 'bg-[#ef4444] text-white shadow-md shadow-red-500/20'
                  : stat.id === 'blood-requests'
                  ? 'bg-[#1e40af] text-white shadow-md shadow-blue-700/20'
                  : 'bg-[#10b981] text-white shadow-md shadow-emerald-500/20'
              }`}
            >
              {stat.id === 'total-donors' && <Users className="w-7 h-7" />}
              {stat.id === 'total-donations' && <Droplet className="w-7 h-7 fill-white" />}
              {stat.id === 'blood-requests' && <FileText className="w-7 h-7" />}
              {stat.id === 'available-units' && <Droplet className="w-7 h-7 fill-white" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 truncate">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{stat.value}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                {stat.trendType === 'up' ? (
                  <span className="inline-flex items-center text-emerald-600 font-semibold">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
                    {stat.trend}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-rose-500 font-semibold">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 stroke-[2.5]" />
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
