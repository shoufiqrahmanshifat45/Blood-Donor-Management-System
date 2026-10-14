import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { RegistrationTrendPoint } from '../../types/dashboard';
import { ChartCard } from '../common/ChartCard';

interface DonorTrendChartProps {
  data: RegistrationTrendPoint[];
}

export const DonorTrendChart: React.FC<DonorTrendChartProps> = ({ data }) => {
  const legend = (
    <div className="flex items-center gap-3.5 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
        <span className="text-slate-600 font-medium text-[11px]">New Donors</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#f472b6]" />
        <span className="text-slate-600 font-medium text-[11px]">Total Donors</span>
      </div>
    </div>
  );

  return (
    <ChartCard
      title="Donor Registration Trend"
      headerAction={legend}
      className="h-full"
    >
      <div className="w-full flex-1 min-h-[190px] h-[190px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 10, left: -26, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                padding: '5px 9px',
              }}
            />
            {/* Total Donors top line (pink) */}
            <Line
              type="monotone"
              dataKey="totalDonors"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ r: 2.5, fill: '#f472b6', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 4.5 }}
            />
            {/* New Donors curve with area fill (red) */}
            <Area
              type="monotone"
              dataKey="newDonors"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#trendGradient)"
              dot={{ r: 2.5, fill: '#ef4444', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 4.5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
