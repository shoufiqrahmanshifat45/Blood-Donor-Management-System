import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { RegistrationTrendPoint } from '../../types/dashboard';

interface DonorTrendChartProps {
  data: RegistrationTrendPoint[];
}

export const DonorTrendChart: React.FC<DonorTrendChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
        <h3 className="font-bold text-slate-900 text-base">Donor Registration Trend</h3>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-slate-600 font-medium">New Donors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6]" />
            <span className="text-slate-600 font-medium">Total Donors</span>
          </div>
        </div>
      </div>

      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 10 }}
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
                padding: '6px 10px'
              }}
            />
            {/* Total Donors top line */}
            <Line
              type="monotone"
              dataKey="totalDonors"
              stroke="#f472b6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f472b6', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
            {/* New Donors curve with area fill */}
            <Area
              type="monotone"
              dataKey="newDonors"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#trendGradient)"
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
