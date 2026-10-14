import React from 'react';
import { StatMetric } from '../../types/dashboard';
import { StatCard } from '../common/StatCard';
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
  const getIcon = (id: string) => {
    switch (id) {
      case 'total-donors':
        return <TotalDonorsStatIcon className="w-7 h-7" />;
      case 'total-donations':
        return <TotalDonationsStatIcon className="w-7 h-7" />;
      case 'blood-requests':
        return <BloodRequestsStatIcon className="w-7 h-7" />;
      case 'available-units':
      default:
        return <AvailableUnitsStatIcon className="w-7 h-7" />;
    }
  };

  const getBgColor = (id: string) => {
    switch (id) {
      case 'total-donors':
        return 'bg-[#ef4444]';
      case 'total-donations':
        return 'bg-[#ff2d55]';
      case 'blood-requests':
        return 'bg-[#2563eb]';
      case 'available-units':
      default:
        return 'bg-[#10b981]';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          id={stat.id}
          title={stat.label}
          value={stat.value}
          change={stat.trend}
          isPositive={stat.trendType === 'up'}
          comparisonText={stat.trendContext}
          icon={getIcon(stat.id)}
          iconBgColor={getBgColor(stat.id)}
        />
      ))}
    </div>
  );
};
