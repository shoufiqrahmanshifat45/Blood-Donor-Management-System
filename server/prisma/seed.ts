/**
 * Database Seeder for Blood Donor Management System
 * Hydrates PostgreSQL database with realistic data matching dashboard metrics.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing records (in reverse dependency order)
  await prisma.systemMetric.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bloodDonation.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.bloodStock.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.adminUser.deleteMany();

  // 2. Seed Default Admin User
  const admin = await prisma.adminUser.create({
    data: {
      name: 'Shoufiq Rahman Shifat',
      email: 'admin@blooddonor.org',
      password: '$2b$10$YourHashedPasswordHereOrBcryptString', // In production, hash with bcrypt
      role: 'SuperAdmin',
      avatarUrl: '/admin-photo.png',
    },
  });
  console.log(`✓ Admin user created: ${admin.email}`);

  // 3. Seed Blood Stock (8 Blood Groups)
  const stockData = [
    { bloodGroup: 'A+', availableUnits: 85, reservedUnits: 12, status: 'Good' },
    { bloodGroup: 'A-', availableUnits: 18, reservedUnits: 4, status: 'Low' },
    { bloodGroup: 'B+', availableUnits: 102, reservedUnits: 15, status: 'Good' },
    { bloodGroup: 'B-', availableUnits: 22, reservedUnits: 6, status: 'Low' },
    { bloodGroup: 'AB+', availableUnits: 45, reservedUnits: 8, status: 'Good' },
    { bloodGroup: 'AB-', availableUnits: 9, reservedUnits: 2, status: 'Low' },
    { bloodGroup: 'O+', availableUnits: 134, reservedUnits: 20, status: 'Good' },
    { bloodGroup: 'O-', availableUnits: 16, reservedUnits: 5, status: 'Low' },
  ];

  for (const item of stockData) {
    await prisma.bloodStock.create({ data: item });
  }
  console.log(`✓ Seeded ${stockData.length} blood stock groups`);

  // 4. Seed Recent Blood Requests
  const requestData = [
    {
      patientName: 'Rahim Uddin',
      hospital: 'Dhaka Medical College Hospital',
      bloodGroup: 'O+',
      units: 2,
      urgency: 'Urgent',
      contactPhone: '+880 1711-234567',
      notes: 'Emergency ICU requirement',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      patientName: 'Nusrat Jahan',
      hospital: 'Square Hospital',
      bloodGroup: 'A-',
      units: 1,
      urgency: 'Pending',
      contactPhone: '+880 1812-345678',
      notes: 'Scheduled surgery requirement',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      patientName: 'Imran Hossain',
      hospital: 'National Heart Foundation',
      bloodGroup: 'B+',
      units: 3,
      urgency: 'Pending',
      contactPhone: '+880 1913-456789',
      notes: 'Bypass operation',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    },
    {
      patientName: 'Tania Akter',
      hospital: 'United Hospital',
      bloodGroup: 'AB+',
      units: 1,
      urgency: 'Fulfilled',
      contactPhone: '+880 1614-567890',
      notes: 'Post-delivery need',
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    },
    {
      patientName: 'Kamrul Hasan',
      hospital: 'Dhaka Medical College Hospital',
      bloodGroup: 'O-',
      units: 2,
      urgency: 'Urgent',
      contactPhone: '+880 1515-678901',
      notes: 'Road traffic accident trauma',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  ];

  for (const item of requestData) {
    await prisma.bloodRequest.create({ data: item });
  }
  console.log(`✓ Seeded ${requestData.length} blood requests`);

  // 5. Seed Realistic Donors
  const sampleDonors = [
    {
      name: 'Tanvir Ahmed',
      bloodGroup: 'O+',
      gender: 'Male',
      age: 26,
      phone: '+880 1711-000111',
      email: 'tanvir@gmail.com',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      totalDonations: 4,
      status: 'Eligible',
      lastDonationDate: new Date('2025-06-15'),
    },
    {
      name: 'Sabrina Mostafa',
      bloodGroup: 'A+',
      gender: 'Female',
      age: 24,
      phone: '+880 1822-111222',
      email: 'sabrina@yahoo.com',
      district: 'Dhaka',
      thana: 'Gulshan',
      totalDonations: 2,
      status: 'Eligible',
      lastDonationDate: new Date('2025-05-10'),
    },
    {
      name: 'Mehedi Hasan',
      bloodGroup: 'B+',
      gender: 'Male',
      age: 29,
      phone: '+880 1933-222333',
      email: 'mehedi@outlook.com',
      district: 'Dhaka',
      thana: 'Mirpur',
      totalDonations: 6,
      status: 'Eligible',
      lastDonationDate: new Date('2025-07-02'),
    },
    {
      name: 'Farhana Kabir',
      bloodGroup: 'AB+',
      gender: 'Female',
      age: 27,
      phone: '+880 1644-333444',
      district: 'Chattogram',
      thana: 'Panchlaish',
      totalDonations: 3,
      status: 'Eligible',
      lastDonationDate: new Date('2025-04-18'),
    },
    {
      name: 'Zubair Hossain',
      bloodGroup: 'O-',
      gender: 'Male',
      age: 31,
      phone: '+880 1555-444555',
      district: 'Sylhet',
      thana: 'Kotwali',
      totalDonations: 5,
      status: 'Eligible',
      lastDonationDate: new Date('2025-06-28'),
    },
  ];

  for (const donor of sampleDonors) {
    await prisma.donor.create({ data: donor });
  }
  console.log(`✓ Seeded ${sampleDonors.length} active registered donors`);

  // 6. Seed System Metrics
  const metrics = [
    { key: 'total_donors', value: '1,248', change: '12%', trend: 'up' },
    { key: 'total_donations', value: '892', change: '8%', trend: 'up' },
    { key: 'blood_requests', value: '156', change: '5%', trend: 'down' },
    { key: 'available_units', value: '620', change: '10%', trend: 'up' },
  ];

  for (const metric of metrics) {
    await prisma.systemMetric.create({ data: metric });
  }
  console.log(`✓ Seeded ${metrics.length} system metrics`);

  console.log('✅ Database seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
