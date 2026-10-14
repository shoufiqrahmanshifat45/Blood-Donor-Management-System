// TEMPORARY DEVELOPMENT DATA - USED FOR PREVIEW ONLY
// This data will be replaced by live REST API / database calls in subsequent stages.

import {
  StatMetric,
  BloodGroupCount,
  GenderDistribution,
  BloodRequest,
  BloodStockItem,
  RegistrationTrendPoint
} from '../types/dashboard';

export const INITIAL_STAT_METRICS: StatMetric[] = [
  {
    id: 'total-donors',
    label: 'Total Donors',
    value: '1,248',
    trend: '12%',
    trendType: 'up',
    trendContext: 'vs. last month',
    icon: 'users',
    iconBg: 'bg-[#ef4444]',
  },
  {
    id: 'total-donations',
    label: 'Total Donations',
    value: '892',
    trend: '8%',
    trendType: 'up',
    trendContext: 'vs. last month',
    icon: 'droplet',
    iconBg: 'bg-[#ef4444]',
  },
  {
    id: 'blood-requests',
    label: 'Blood Requests',
    value: '156',
    trend: '5%',
    trendType: 'down',
    trendContext: 'vs. last month',
    icon: 'file-text',
    iconBg: 'bg-[#1d4ed8]',
  },
  {
    id: 'available-units',
    label: 'Available Units',
    value: '620',
    trend: '10%',
    trendType: 'up',
    trendContext: 'vs. last month',
    icon: 'shield-check',
    iconBg: 'bg-[#10b981]',
  },
];

export const DONORS_BY_BLOOD_GROUP: BloodGroupCount[] = [
  { bloodGroup: 'A+', count: 128 },
  { bloodGroup: 'A-', count: 24 },
  { bloodGroup: 'B+', count: 156 },
  { bloodGroup: 'B-', count: 31 },
  { bloodGroup: 'AB+', count: 67 },
  { bloodGroup: 'AB-', count: 12 },
  { bloodGroup: 'O+', count: 194 },
  { bloodGroup: 'O-', count: 38 },
];

export const GENDER_DISTRIBUTION: GenderDistribution[] = [
  { name: 'Male', percentage: 68, count: 848, color: '#2563eb' },
  { name: 'Female', percentage: 30, count: 374, color: '#ec4899' },
  { name: 'Other', percentage: 2, count: 26, color: '#8b5cf6' },
];

export const RECENT_BLOOD_REQUESTS: BloodRequest[] = [
  {
    id: 'req-1',
    donorName: 'Rahim Uddin',
    bloodGroup: 'O+',
    bloodGroupColor: 'red',
    hospital: 'Dhaka Medical College Hospital',
    timeAgo: '2 hours ago',
    status: 'Urgent',
  },
  {
    id: 'req-2',
    donorName: 'Nusrat Jahan',
    bloodGroup: 'A-',
    bloodGroupColor: 'blue',
    hospital: 'Square Hospital',
    timeAgo: '5 hours ago',
    status: 'Pending',
  },
  {
    id: 'req-3',
    donorName: 'Imran Hossain',
    bloodGroup: 'B+',
    bloodGroupColor: 'red',
    hospital: 'National Heart Foundation',
    timeAgo: '7 hours ago',
    status: 'Pending',
  },
  {
    id: 'req-4',
    donorName: 'Tania Akter',
    bloodGroup: 'AB+',
    bloodGroupColor: 'red',
    hospital: 'United Hospital',
    timeAgo: '10 hours ago',
    status: 'Fulfilled',
  },
  {
    id: 'req-5',
    donorName: 'Kamrul Hasan',
    bloodGroup: 'O-',
    bloodGroupColor: 'blue',
    hospital: 'Dhaka Medical College Hospital',
    timeAgo: '12 hours ago',
    status: 'Urgent',
  },
];

export const BLOOD_STOCK_DATA: BloodStockItem[] = [
  { bloodGroup: 'A+', units: 85, status: 'Good' },
  { bloodGroup: 'A-', units: 18, status: 'Low' },
  { bloodGroup: 'B+', units: 102, status: 'Good' },
  { bloodGroup: 'B-', units: 22, status: 'Low' },
  { bloodGroup: 'AB+', units: 45, status: 'Good' },
  { bloodGroup: 'AB-', units: 9, status: 'Low' },
  { bloodGroup: 'O+', units: 134, status: 'Good' },
  { bloodGroup: 'O-', units: 16, status: 'Low' },
];

export const DONOR_REGISTRATION_TRENDS: RegistrationTrendPoint[] = [
  { month: 'Jan', newDonors: 25, totalDonors: 45 },
  { month: 'Feb', newDonors: 38, totalDonors: 62 },
  { month: 'Mar', newDonors: 48, totalDonors: 80 },
  { month: 'Apr', newDonors: 58, totalDonors: 98 },
  { month: 'May', newDonors: 72, totalDonors: 118 },
  { month: 'Jun', newDonors: 65, totalDonors: 130 },
  { month: 'Jul', newDonors: 78, totalDonors: 145 },
  { month: 'Aug', newDonors: 86, totalDonors: 158 },
  { month: 'Sep', newDonors: 102, totalDonors: 172 },
  { month: 'Oct', newDonors: 138, totalDonors: 204 },
];

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh',
  'Comilla', 'Gazipur', 'Narayanganj', 'Bogra'
];

export const BANGLADESH_THANAS: Record<string, string[]> = {
  'Dhaka': ['Dhanmondi', 'Gulshan', 'Mirpur', 'Uttara', 'Mohakhali', 'Badda', 'Tejgaon', 'Shahbagh', 'Motijheel'],
  'Chattogram': ['Pahartali', 'Panchlaish', 'Kotwali', 'Khulshi', 'Halishahar'],
  'Sylhet': ['Kotwali', 'Jalalabad', 'South Surma', 'Osmani Nagar'],
};
