import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GenderDistribution } from '../../types/dashboard';
import { ChartCard } from '../common/ChartCard';

interface GenderDistributionChartProps {
  data: GenderDistribution[];
  totalDonors?: string;
}

export const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({
  data,
  totalDonors = '1,248',
}) => {
  return (
    <ChartCard title="Gender Distribution" className="h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between flex-1 gap-2 min-h-[175px] h-[175px]">
        {/* Doughnut Chart with Centered Value */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={44}
                outerRadius={65}
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
            <span className="text-[9.5px] uppercase tracking-wider font-semibold text-slate-400">Total Donors</span>
            <span className="text-[16px] font-bold text-[#0f172a] leading-tight">{totalDonors}</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full pl-2 sm:pl-3 space-y-2.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[11.5px]">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-[#0f172a]">{item.percentage}%</span>
                <span className="text-slate-400 ml-1 font-normal">({item.count})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
};
