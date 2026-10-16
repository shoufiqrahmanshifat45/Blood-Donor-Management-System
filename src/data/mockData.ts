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
  'Comilla', 'Gazipur', 'Narayanganj', 'Bogra', 'Jessore', 'Cox\'s Bazar'
];

export const BANGLADESH_THANAS: Record<string, string[]> = {
  'Dhaka': ['Dhanmondi', 'Gulshan', 'Mirpur', 'Uttara', 'Mohakhali', 'Badda', 'Tejgaon', 'Shahbagh', 'Motijheel', 'Banani', 'Khilgaon'],
  'Chattogram': ['Pahartali', 'Panchlaish', 'Kotwali', 'Khulshi', 'Halishahar', 'Agrabad', 'Bakalia'],
  'Sylhet': ['Kotwali', 'Jalalabad', 'South Surma', 'Osmani Nagar'],
  'Rajshahi': ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum'],
  'Khulna': ['Khalishpur', 'Daulatpur', 'Sonadanga', 'Kotwali'],
};

// Complete 8 Blood Group Compatibility Matrix (Universal Donor: O-, Universal Recipient: AB+)
export const BLOOD_COMPATIBILITY: Record<string, { canDonateTo: string[]; canReceiveFrom: string[]; desc: string }> = {
  'O-': {
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
    desc: 'Universal Red Cell Donor: Can give blood to any patient in urgent emergency.',
  },
  'O+': {
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    desc: 'Most common blood group. High demand in hospitals daily.',
  },
  'A-': {
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    desc: 'Rare negative group. Essential for negative Rh blood matches.',
  },
  'A+': {
    canDonateTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    desc: 'Second most common group. High clinical utilization rate.',
  },
  'B-': {
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    desc: 'Rare group. Critical for trauma units and thalassemia patients.',
  },
  'B+': {
    canDonateTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    desc: 'High prevalence in South Asia. Very frequently requested.',
  },
  'AB-': {
    canDonateTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    desc: 'Rarest blood group in Bangladesh (<1% of population).',
  },
  'AB+': {
    canDonateTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    desc: 'Universal Red Cell Recipient: Can receive blood from any blood type.',
  },
};

// Rich Seed Donors Dataset Covering All 8 Blood Groups
export interface DetailedDonor {
  id: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phone: string;
  email: string;
  district: string;
  thana: string;
  lastDonationDate: string | null;
  totalDonations: number;
  status: 'Eligible' | 'Ineligible' | 'Pending';
  weightKg: number;
  readyForEmergency: boolean;
  notes?: string;
}

export const INITIAL_DONORS: DetailedDonor[] = [
  {
    id: 'DNR-1001',
    name: 'Tanvir Ahmed',
    bloodGroup: 'O+',
    gender: 'Male',
    age: 26,
    phone: '+880 1711-234567',
    email: 'tanvir.ahmed@example.com',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    lastDonationDate: '2026-06-15',
    totalDonations: 8,
    status: 'Eligible',
    weightKg: 68,
    readyForEmergency: true,
    notes: 'Regular donor, rapid response in Central Dhaka',
  },
  {
    id: 'DNR-1002',
    name: 'Farzana Haque',
    bloodGroup: 'A+',
    gender: 'Female',
    age: 24,
    phone: '+880 1819-345678',
    email: 'farzana.haque@example.com',
    district: 'Dhaka',
    thana: 'Gulshan',
    lastDonationDate: '2026-07-20',
    totalDonations: 4,
    status: 'Eligible',
    weightKg: 54,
    readyForEmergency: true,
  },
  {
    id: 'DNR-1003',
    name: 'Mahmudul Hasan',
    bloodGroup: 'B+',
    gender: 'Male',
    age: 29,
    phone: '+880 1912-456789',
    email: 'mahmud.hasan@example.com',
    district: 'Chattogram',
    thana: 'Panchlaish',
    lastDonationDate: '2026-09-02',
    totalDonations: 12,
    status: 'Ineligible',
    weightKg: 74,
    readyForEmergency: false,
    notes: 'Donated recently, eligible next month',
  },
  {
    id: 'DNR-1004',
    name: 'Sadia Sultana',
    bloodGroup: 'O-',
    gender: 'Female',
    age: 27,
    phone: '+880 1610-567890',
    email: 'sadia.sultana@example.com',
    district: 'Dhaka',
    thana: 'Uttara',
    lastDonationDate: '2026-05-10',
    totalDonations: 6,
    status: 'Eligible',
    weightKg: 58,
    readyForEmergency: true,
    notes: 'Universal donor verified',
  },
  {
    id: 'DNR-1005',
    name: 'Rafiqul Islam',
    bloodGroup: 'AB+',
    gender: 'Male',
    age: 32,
    phone: '+880 1715-678901',
    email: 'rafiqul.islam@example.com',
    district: 'Sylhet',
    thana: 'Kotwali',
    lastDonationDate: '2026-04-18',
    totalDonations: 9,
    status: 'Eligible',
    weightKg: 78,
    readyForEmergency: true,
  },
  {
    id: 'DNR-1006',
    name: 'Nusrat Jahan',
    bloodGroup: 'A-',
    gender: 'Female',
    age: 23,
    phone: '+880 1823-789012',
    email: 'nusrat.jahan@example.com',
    district: 'Dhaka',
    thana: 'Mirpur',
    lastDonationDate: '2026-03-25',
    totalDonations: 3,
    status: 'Eligible',
    weightKg: 52,
    readyForEmergency: true,
  },
  {
    id: 'DNR-1007',
    name: 'Shahriar Kabir',
    bloodGroup: 'B-',
    gender: 'Male',
    age: 31,
    phone: '+880 1934-890123',
    email: 'shahriar.kabir@example.com',
    district: 'Rajshahi',
    thana: 'Boalia',
    lastDonationDate: '2026-06-30',
    totalDonations: 5,
    status: 'Eligible',
    weightKg: 70,
    readyForEmergency: true,
  },
  {
    id: 'DNR-1008',
    name: 'Tasnim Rahman',
    bloodGroup: 'AB-',
    gender: 'Female',
    age: 28,
    phone: '+880 1512-901234',
    email: 'tasnim.rahman@example.com',
    district: 'Dhaka',
    thana: 'Mohakhali',
    lastDonationDate: '2026-02-14',
    totalDonations: 7,
    status: 'Eligible',
    weightKg: 56,
    readyForEmergency: true,
    notes: 'Very rare AB- registered hero donor',
  },
  {
    id: 'DNR-1009',
    name: 'Anisur Rahman',
    bloodGroup: 'O+',
    gender: 'Male',
    age: 25,
    phone: '+880 1722-012345',
    email: 'anisur.r@example.com',
    district: 'Gazipur',
    thana: 'Central',
    lastDonationDate: '2026-08-01',
    totalDonations: 2,
    status: 'Ineligible',
    weightKg: 65,
    readyForEmergency: false,
  },
  {
    id: 'DNR-1010',
    name: 'Mitu Chowdhury',
    bloodGroup: 'B+',
    gender: 'Female',
    age: 22,
    phone: '+880 1833-123456',
    email: 'mitu.chowdhury@example.com',
    district: 'Chattogram',
    thana: 'Kotwali',
    lastDonationDate: null,
    totalDonations: 0,
    status: 'Pending',
    weightKg: 50,
    readyForEmergency: true,
    notes: 'First time applicant awaiting physical screening',
  },
  {
    id: 'DNR-1011',
    name: 'Kazi Nazmul',
    bloodGroup: 'A+',
    gender: 'Male',
    age: 35,
    phone: '+880 1944-234567',
    email: 'kazi.nazmul@example.com',
    district: 'Khulna',
    thana: 'Sonadanga',
    lastDonationDate: '2026-04-05',
    totalDonations: 15,
    status: 'Eligible',
    weightKg: 82,
    readyForEmergency: true,
  },
  {
    id: 'DNR-1012',
    name: 'Rashedul Karim',
    bloodGroup: 'O-',
    gender: 'Male',
    age: 30,
    phone: '+880 1755-345678',
    email: 'rashed.karim@example.com',
    district: 'Dhaka',
    thana: 'Badda',
    lastDonationDate: '2026-07-12',
    totalDonations: 10,
    status: 'Eligible',
    weightKg: 72,
    readyForEmergency: true,
  },
];

// Seed Appointments
export interface DetailedAppointment {
  id: string;
  donorName: string;
  donorPhone: string;
  bloodGroup: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export const INITIAL_APPOINTMENTS: DetailedAppointment[] = [
  {
    id: 'APT-2001',
    donorName: 'Tanvir Ahmed',
    donorPhone: '+880 1711-234567',
    bloodGroup: 'O+',
    appointmentDate: '2026-10-18',
    appointmentTime: '10:30 AM',
    location: 'Dhaka Medical College Hospital',
    status: 'Scheduled',
    notes: 'Voluntary blood drive',
  },
  {
    id: 'APT-2002',
    donorName: 'Farzana Haque',
    donorPhone: '+880 1819-345678',
    bloodGroup: 'A+',
    appointmentDate: '2026-10-19',
    appointmentTime: '02:00 PM',
    location: 'Square Hospital, Panthapath',
    status: 'Scheduled',
    notes: 'Direct hospital replacement',
  },
  {
    id: 'APT-2003',
    donorName: 'Rafiqul Islam',
    donorPhone: '+880 1715-678901',
    bloodGroup: 'AB+',
    appointmentDate: '2026-10-14',
    appointmentTime: '11:00 AM',
    location: 'Sylhet MAG Osmani Medical College',
    status: 'Completed',
    notes: 'Successfully donated 1 unit',
  },
  {
    id: 'APT-2004',
    donorName: 'Tasnim Rahman',
    donorPhone: '+880 1512-901234',
    bloodGroup: 'AB-',
    appointmentDate: '2026-10-21',
    appointmentTime: '09:30 AM',
    location: 'National Heart Foundation, Mirpur',
    status: 'Scheduled',
    notes: 'Rare AB- reservation',
  },
];

// Emergency Contacts
export interface EmergencyContact {
  id: string;
  name: string;
  category: 'National Emergency' | 'Blood Bank' | 'Hospital' | 'Ambulance';
  phone: string;
  availableHours: string;
  location: string;
  badge?: string;
}

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ec-1',
    name: 'National Emergency Service (Police / Ambulance / Fire)',
    category: 'National Emergency',
    phone: '999',
    availableHours: '24/7 Helpline',
    location: 'Nationwide (Toll Free)',
    badge: 'Official SOS',
  },
  {
    id: 'ec-2',
    name: 'Quantum Foundation Blood Lab',
    category: 'Blood Bank',
    phone: '+880 1714-010869',
    availableHours: '24 Hours Open',
    location: '31/V Shilpacharya Zainul Abedin Sarak, Shantinagar, Dhaka',
    badge: 'Verified Lab',
  },
  {
    id: 'ec-3',
    name: 'Sandhani Central Blood Bank (DMCH Unit)',
    category: 'Blood Bank',
    phone: '+880 1819-284851',
    availableHours: '24/7 Active',
    location: 'Dhaka Medical College, Dhaka',
    badge: 'Non-profit',
  },
  {
    id: 'ec-4',
    name: 'Badhan Central Blood Bank',
    category: 'Blood Bank',
    phone: '+880 1534-982674',
    availableHours: '24/7 Active',
    location: 'TSC, University of Dhaka',
    badge: 'Student Driven',
  },
  {
    id: 'ec-5',
    name: 'Bangladesh Red Crescent Society Blood Center',
    category: 'Blood Bank',
    phone: '+880 2-9352226',
    availableHours: '24/7 Available',
    location: '7/5 Aurangzeb Road, Mohammadpur, Dhaka',
    badge: 'International',
  },
  {
    id: 'ec-6',
    name: 'BSMMU (PG Hospital) Transfusion Medicine',
    category: 'Hospital',
    phone: '+880 2-9661051',
    availableHours: '24 Hours',
    location: 'Shahbagh, Dhaka',
    badge: 'Govt Apex',
  },
  {
    id: 'ec-7',
    name: 'Square Hospital Emergency Dispatch',
    category: 'Hospital',
    phone: '10616',
    availableHours: '24/7 Hotline',
    location: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka',
    badge: 'Private Apex',
  },
  {
    id: 'ec-8',
    name: 'Al-Markazul Islami Ambulance Service',
    category: 'Ambulance',
    phone: '+880 1711-429129',
    availableHours: '24 Hours Standby',
    location: 'Shyamoli, Dhaka (Inter-district)',
    badge: 'ICU Ambulance',
  },
];

// Eligibility Criteria and FAQ
export const ELIGIBILITY_GUIDELINES = [
  {
    title: 'Age Requirement',
    desc: 'Donors must be between 18 and 65 years of age. First-time donors should be under 60 years.',
    status: 'mandatory',
  },
  {
    title: 'Minimum Body Weight',
    desc: 'Male donors must weigh at least 48 kg (106 lbs), and female donors at least 45 kg (99 lbs).',
    status: 'mandatory',
  },
  {
    title: 'Donation Interval',
    desc: 'At least 90 days (3 months) for males and 120 days (4 months) for females since your last full blood donation.',
    status: 'mandatory',
  },
  {
    title: 'Hemoglobin Levels',
    desc: 'Hemoglobin level should be at least 12.5 g/dL for women and 13.0 g/dL for men.',
    status: 'clinical',
  },
  {
    title: 'Blood Pressure & Pulse',
    desc: 'Systolic: 100-140 mmHg, Diastolic: 60-90 mmHg. Pulse must be regular between 60-100 bpm.',
    status: 'clinical',
  },
  {
    title: 'General Wellness',
    desc: 'Must feel well and rested on donation day, with no active fever, cold, cough, flu, or recent antibiotic cycle (past 7 days).',
    status: 'lifestyle',
  },
];

export const HELP_FAQS = [
  {
    question: 'How long does a blood donation take?',
    answer: 'The actual blood collection takes only 8–10 minutes. The entire appointment including mini-health screening and refreshments takes about 30–45 minutes.',
  },
  {
    question: 'How does RedPulse help during emergencies?',
    answer: 'Our Emergency Blood Request feature allows verified coordinators to broadcast SOS alerts instantly to registered donors matching the patient’s exact blood group and location radius.',
  },
  {
    question: 'Is it painful or harmful to donate blood?',
    answer: 'Donating blood is completely safe! A sterile, single-use needle is used for each donor. The human body replenishes plasma volume within 24–48 hours and red cells within 4–6 weeks.',
  },
  {
    question: 'What should I do before and after donation?',
    answer: 'Drink plenty of water (16 oz), eat a healthy iron-rich meal, and avoid smoking 2 hours before. Afterwards, relax for 15 minutes, drink juice, and avoid strenuous exercise for the remainder of the day.',
  },
  {
    question: 'Who is the administrator of this system?',
    answer: 'This system is managed and overseen by Admin Shoufiq Rahman Shifat with 24/7 coordination protocols.',
  },
];

