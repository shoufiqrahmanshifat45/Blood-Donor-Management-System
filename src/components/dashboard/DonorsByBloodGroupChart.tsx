import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import { BloodGroupCount } from '../../types/dashboard';
import { ChartCard } from '../common/ChartCard';
import { useTheme } from '../../context/ThemeContext';

interface DonorsByBloodGroupChartProps {
  data: BloodGroupCount[];
}

export const DonorsByBloodGroupChart: React.FC<DonorsByBloodGroupChartProps> = ({ data }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ChartCard title="Donors by Blood Group" className="h-full">
      <div className="w-full flex-1 min-h-[175px] h-[175px] mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 8, left: -24, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
            <XAxis
              dataKey="bloodGroup"
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
              tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 10.5, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
              tick={{ fill: isDark ? '#64748b' : '#64748b', fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: isDark ? '#1e293b' : '#f8fafc' }}
              contentStyle={{
                backgroundColor: isDark ? '#020617' : '#0f172a',
                border: isDark ? '1px solid #334155' : 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                padding: '4px 8px',
              }}
              formatter={(value: any) => [`${value} Donors`, 'Count']}
            />
            <Bar
              dataKey="count"
              fill="#ef4444"
              radius={[3, 3, 0, 0]}
              maxBarSize={26}
            >
              <LabelList
                dataKey="count"
                position="top"
                fill={isDark ? '#e2e8f0' : '#1e293b'}
                fontSize={9.5}
                fontWeight={600}
                offset={4}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
