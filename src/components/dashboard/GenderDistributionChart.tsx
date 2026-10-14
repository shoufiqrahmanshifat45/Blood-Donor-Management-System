import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GenderDistribution } from '../../types/dashboard';

interface GenderDistributionChartProps {
  data: GenderDistribution[];
  totalDonors?: string;
}

export const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  data,
  totalDonors = '1,248'
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-900 text-base">Gender Distribution</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between flex-1 gap-2">
        {/* Pie/Donut Chart with Center Text */}
        <div className="relative w-44 h-48 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={52}
                outerRadius={75}
                paddingAngle={2}
                dataKey="percentage"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400">Total Donors</span>
            <span className="text-base font-bold text-slate-900">{totalDonors}</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full pl-2 sm:pl-4 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{item.percentage}%</span>
                <span className="text-slate-400 ml-1">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
