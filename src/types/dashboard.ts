export interface StatMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  trendContext: string;
  icon: 'users' | 'droplet' | 'file-text' | 'shield-check';
  iconBg: string;
}

export interface BloodGroupCount {
  bloodGroup: string;
  count: number;
}

export interface GenderDistribution {
  name: string;
  percentage: number;
  count: number;
  color: string;
}

export interface BloodRequest {
  id: string;
  donorName: string;
  bloodGroup: string;
  bloodGroupColor: 'red' | 'blue';
  hospital: string;
  timeAgo: string;
  status: 'Urgent' | 'Pending' | 'Fulfilled';
}

export interface BloodStockItem {
  bloodGroup: string;
  units: number;
  status: 'Good' | 'Low';
}

export interface RegistrationTrendPoint {
  month: string;
  newDonors: number;
  totalDonors: number;
}

export interface QuickActionItem {
  id: string;
  title: string;
  icon: 'user-plus' | 'droplet-plus' | 'calendar' | 'line-chart' | 'search' | 'calculator';
  iconColor: string;
  borderColor: string;
}
