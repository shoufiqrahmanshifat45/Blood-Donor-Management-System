/**
 * Database Seeder for Blood Donor Management System
 * Hydrates PostgreSQL database with clearly identified synthetic development data.
 *
 * NOTE: Respects safety guidelines. Never silently wipes databases in production.
 */

import {
  PrismaClient,
  Role,
  BloodGroup,
  Gender,
  DonorStatus,
  RequestUrgency,
  AppointmentStatus,
  StockStatus,
  NotificationType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('🌱 Starting BDMS Database Seeding [SYNTHETIC DATA]');
  console.log('====================================================');

  // Verify connection safety
  const donorCount = await prisma.donor.count();
  if (donorCount > 0 && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Existing records detected in production environment! Skipping destructive seed.');
    return;
  }

  console.log('Cleaning any existing synthetic records in reverse dependency order...');
  await prisma.notification.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.bloodDonation.deleteMany();
  await prisma.bloodRequest.deleteMany();
  await prisma.bloodStock.deleteMany();
  await prisma.donor.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemMetric.deleteMany();

  // 1. Seed System Users & Roles
  console.log('\n[1/8] Seeding User Accounts & Roles...');
  const superAdmin = await prisma.user.create({
    data: {
      name: 'Shoufiq Rahman Shifat',
      email: 'admin@blooddonor.org',
      password: '$2b$10$YourHashedBcryptPasswordSuperAdminSynthetic123',
      role: Role.SUPER_ADMIN,
      phone: '+880 1711-000999',
      avatarUrl: '/admin-photo.png',
      isActive: true,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: 'Dr. Nusrat Parveen',
      email: 'staff@blooddonor.org',
      password: '$2b$10$YourHashedBcryptPasswordStaffSynthetic123',
      role: Role.STAFF,
      phone: '+880 1822-000888',
      isActive: true,
    },
  });

  const hospitalCoordinator = await prisma.user.create({
    data: {
      name: 'Hospital Coordinator (DMCH)',
      email: 'coordinator@dmch.gov.bd',
      password: '$2b$10$YourHashedBcryptPasswordCoordinatorSynthetic123',
      role: Role.HOSPITAL_COORDINATOR,
      phone: '+880 1933-000777',
      isActive: true,
    },
  });

  const volunteer = await prisma.user.create({
    data: {
      name: 'Volunteer Arif',
      email: 'volunteer@redcrescent.org',
      password: '$2b$10$YourHashedBcryptPasswordVolunteerSynthetic123',
      role: Role.VOLUNTEER,
      phone: '+880 1644-000666',
      isActive: true,
    },
  });

  // AdminUser backward-compatibility model
  await prisma.adminUser.create({
    data: {
      name: 'Shoufiq Rahman Shifat',
      email: 'admin@blooddonor.org',
      password: '$2b$10$YourHashedBcryptPasswordSuperAdminSynthetic123',
      role: 'SuperAdmin',
      avatarUrl: '/admin-photo.png',
    },
  });
  console.log(`✓ Created 4 system users (SuperAdmin, Staff, Hospital Coordinator, Volunteer)`);

  // 2. Seed Blood Stock (8 Blood Groups)
  console.log('\n[2/8] Seeding Blood Inventory Stock...');
  const stockData = [
    { bloodGroup: BloodGroup.A_POS, availableUnits: 85, reservedUnits: 12, status: StockStatus.GOOD },
    { bloodGroup: BloodGroup.A_NEG, availableUnits: 18, reservedUnits: 4, status: StockStatus.LOW },
    { bloodGroup: BloodGroup.B_POS, availableUnits: 102, reservedUnits: 15, status: StockStatus.GOOD },
    { bloodGroup: BloodGroup.B_NEG, availableUnits: 22, reservedUnits: 6, status: StockStatus.LOW },
    { bloodGroup: BloodGroup.AB_POS, availableUnits: 45, reservedUnits: 8, status: StockStatus.GOOD },
    { bloodGroup: BloodGroup.AB_NEG, availableUnits: 9, reservedUnits: 2, status: StockStatus.LOW },
    { bloodGroup: BloodGroup.O_POS, availableUnits: 134, reservedUnits: 20, status: StockStatus.GOOD },
    { bloodGroup: BloodGroup.O_NEG, availableUnits: 16, reservedUnits: 5, status: StockStatus.LOW },
  ];

  for (const item of stockData) {
    await prisma.bloodStock.create({ data: item });
  }
  console.log(`✓ Created stock inventory for all 8 blood groups`);

  // 3. Seed Registered Donors (with responsible eligibility and availability modeling)
  console.log('\n[3/8] Seeding Registered Donor Profiles...');
  const donor1 = await prisma.donor.create({
    data: {
      name: 'Tanvir Ahmed',
      bloodGroup: BloodGroup.O_POS,
      gender: Gender.MALE,
      age: 26,
      phone: '+880 1711-000111',
      email: 'tanvir.ahmed@example.com',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      address: 'House 14, Road 5, Dhanmondi',
      totalDonations: 4,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: true,
      weightKg: 68.5,
      lastDonationDate: new Date('2025-06-15'),
      nextEligibleDate: new Date('2025-09-15'),
      ineligibilityReason: null,
    },
  });

  const donor2 = await prisma.donor.create({
    data: {
      name: 'Sabrina Mostafa',
      bloodGroup: BloodGroup.A_POS,
      gender: Gender.FEMALE,
      age: 24,
      phone: '+880 1822-111222',
      email: 'sabrina.mostafa@example.com',
      district: 'Dhaka',
      thana: 'Gulshan',
      address: 'Block C, Road 11, Gulshan-1',
      totalDonations: 2,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: false,
      weightKg: 54.0,
      lastDonationDate: new Date('2025-05-10'),
      nextEligibleDate: new Date('2025-08-10'),
      ineligibilityReason: null,
    },
  });

  const donor3 = await prisma.donor.create({
    data: {
      name: 'Mehedi Hasan',
      bloodGroup: BloodGroup.B_POS,
      gender: Gender.MALE,
      age: 29,
      phone: '+880 1933-222333',
      email: 'mehedi.hasan@example.com',
      district: 'Dhaka',
      thana: 'Mirpur',
      address: 'Section 10, Mirpur',
      totalDonations: 6,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: true,
      weightKg: 72.0,
      lastDonationDate: new Date('2025-07-02'),
      nextEligibleDate: new Date('2025-10-02'),
      ineligibilityReason: null,
    },
  });

  const donor4 = await prisma.donor.create({
    data: {
      name: 'Farhana Kabir',
      bloodGroup: BloodGroup.AB_POS,
      gender: Gender.FEMALE,
      age: 27,
      phone: '+880 1644-333444',
      email: 'farhana.kabir@example.com',
      district: 'Chattogram',
      thana: 'Panchlaish',
      address: 'Probartak Circle, Panchlaish',
      totalDonations: 3,
      status: DonorStatus.ELIGIBLE,
      isAvailable: false,
      readyForEmergency: false,
      weightKg: 58.0,
      lastDonationDate: new Date('2025-09-01'),
      nextEligibleDate: new Date('2025-12-01'),
      ineligibilityReason: 'Temporary deferral: Recent international travel',
    },
  });

  const donor5 = await prisma.donor.create({
    data: {
      name: 'Zubair Hossain',
      bloodGroup: BloodGroup.O_NEG,
      gender: Gender.MALE,
      age: 31,
      phone: '+880 1555-444555',
      email: 'zubair.hossain@example.com',
      district: 'Sylhet',
      thana: 'Kotwali',
      address: 'Zindabazar, Kotwali',
      totalDonations: 5,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: true,
      weightKg: 75.0,
      lastDonationDate: new Date('2025-06-28'),
      nextEligibleDate: new Date('2025-09-28'),
      ineligibilityReason: null,
    },
  });

  const donor6Ineligible = await prisma.donor.create({
    data: {
      name: 'Kazi Naimur Rahman',
      bloodGroup: BloodGroup.B_NEG,
      gender: Gender.MALE,
      age: 21,
      phone: '+880 1766-555666',
      email: 'naimur.rahman@example.com',
      district: 'Dhaka',
      thana: 'Uttara',
      address: 'Sector 4, Uttara',
      totalDonations: 0,
      status: DonorStatus.INELIGIBLE,
      isAvailable: false,
      readyForEmergency: false,
      weightKg: 46.0,
      lastDonationDate: null,
      nextEligibleDate: null,
      ineligibilityReason: 'Medical deferral: Weight under clinical threshold (minimum 50kg required)',
    },
  });

  const donor7 = await prisma.donor.create({
    data: {
      name: 'Nusrat Jahan',
      bloodGroup: BloodGroup.A_NEG,
      gender: Gender.FEMALE,
      age: 23,
      phone: '+880 1823-789012',
      email: 'nusrat.jahan@example.com',
      district: 'Dhaka',
      thana: 'Mirpur',
      address: 'Section 2, Mirpur',
      totalDonations: 3,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: true,
      weightKg: 52.0,
      lastDonationDate: new Date('2025-03-25'),
      nextEligibleDate: new Date('2025-06-25'),
      ineligibilityReason: null,
    },
  });

  const donor8 = await prisma.donor.create({
    data: {
      name: 'Tasnim Rahman',
      bloodGroup: BloodGroup.AB_NEG,
      gender: Gender.FEMALE,
      age: 28,
      phone: '+880 1512-901234',
      email: 'tasnim.rahman@example.com',
      district: 'Dhaka',
      thana: 'Mohakhali',
      address: 'Wireless Gate, Mohakhali',
      totalDonations: 7,
      status: DonorStatus.ELIGIBLE,
      isAvailable: true,
      readyForEmergency: true,
      weightKg: 56.0,
      lastDonationDate: new Date('2025-02-14'),
      nextEligibleDate: new Date('2025-05-14'),
      ineligibilityReason: null,
    },
  });

  console.log(`✓ Created 8 synthetic donors covering all 8 blood groups with realistic eligibility and availability statuses`);

  // 4. Seed Blood Requests
  console.log('\n[4/8] Seeding Blood Requests...');
  const req1 = await prisma.bloodRequest.create({
    data: {
      patientName: 'Rahim Uddin',
      hospital: 'Dhaka Medical College Hospital',
      bloodGroup: BloodGroup.O_POS,
      units: 2,
      urgency: RequestUrgency.URGENT,
      contactPhone: '+880 1711-234567',
      contactName: 'Mohammad Ali (Brother)',
      notes: 'Emergency ICU requirement due to internal hemorrhage',
      requiredDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      requesterId: hospitalCoordinator.id,
      fulfilledUnits: 1,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  const req2 = await prisma.bloodRequest.create({
    data: {
      patientName: 'Nusrat Jahan',
      hospital: 'Square Hospital',
      bloodGroup: BloodGroup.A_NEG,
      units: 1,
      urgency: RequestUrgency.PENDING,
      contactPhone: '+880 1812-345678',
      contactName: 'Selim Reza (Husband)',
      notes: 'Scheduled bypass surgery requirement',
      requiredDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      requesterId: hospitalCoordinator.id,
      fulfilledUnits: 0,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  const req3 = await prisma.bloodRequest.create({
    data: {
      patientName: 'Imran Hossain',
      hospital: 'National Heart Foundation',
      bloodGroup: BloodGroup.B_POS,
      units: 3,
      urgency: RequestUrgency.PENDING,
      contactPhone: '+880 1913-456789',
      contactName: 'Shamim Hossain (Father)',
      notes: 'Open heart valve surgery',
      requiredDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
      requesterId: null,
      fulfilledUnits: 0,
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    },
  });

  const req4 = await prisma.bloodRequest.create({
    data: {
      patientName: 'Tania Akter',
      hospital: 'United Hospital',
      bloodGroup: BloodGroup.AB_POS,
      units: 1,
      urgency: RequestUrgency.FULFILLED,
      contactPhone: '+880 1614-567890',
      contactName: 'Monir Hossain',
      notes: 'Post-delivery obstetric transfusion requirement',
      requiredDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
      requesterId: null,
      fulfilledUnits: 1,
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    },
  });

  const req5 = await prisma.bloodRequest.create({
    data: {
      patientName: 'Kamrul Hasan',
      hospital: 'Dhaka Medical College Hospital',
      bloodGroup: BloodGroup.O_NEG,
      units: 2,
      urgency: RequestUrgency.URGENT,
      contactPhone: '+880 1515-678901',
      contactName: 'Farid Hasan (Uncle)',
      notes: 'Road traffic accident multi-trauma resuscitation',
      requiredDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      requesterId: hospitalCoordinator.id,
      fulfilledUnits: 0,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Created 5 synthetic blood requests across diverse urgency levels`);

  // 5. Seed Donation Records (Linking Donors and Requests)
  console.log('\n[5/8] Seeding Donation Records...');
  await prisma.bloodDonation.create({
    data: {
      donorId: donor1.id,
      bloodRequestId: req1.id,
      bloodGroup: BloodGroup.O_POS,
      units: 1,
      donationDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
      location: 'Dhaka Medical College Hospital Blood Bank',
      verifiedById: staffUser.id,
      notes: 'Direct emergency donation to ICU patient Rahim Uddin. Screening tests negative.',
    },
  });

  await prisma.bloodDonation.create({
    data: {
      donorId: donor2.id,
      bloodRequestId: null,
      bloodGroup: BloodGroup.A_POS,
      units: 1,
      donationDate: new Date('2025-05-10'),
      location: 'Gulshan Red Crescent Blood Center',
      verifiedById: staffUser.id,
      notes: 'Voluntary quarterly mobile camp donation.',
    },
  });

  await prisma.bloodDonation.create({
    data: {
      donorId: donor3.id,
      bloodRequestId: req4.id,
      bloodGroup: BloodGroup.B_POS,
      units: 1,
      donationDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
      location: 'United Hospital Transfusion Center',
      verifiedById: staffUser.id,
      notes: 'Fulfilled obstetric surgery request.',
    },
  });
  console.log(`✓ Created 3 donation verification records with doctor/staff validation`);

  // 6. Seed Appointments
  console.log('\n[6/8] Seeding Scheduled Appointments...');
  await prisma.appointment.create({
    data: {
      donorId: donor1.id,
      donorName: donor1.name,
      donorPhone: donor1.phone,
      bloodGroup: donor1.bloodGroup,
      appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      appointmentTime: '10:30 AM',
      location: 'Dhaka Central Blood Bank, Shahbagh',
      status: AppointmentStatus.SCHEDULED,
      notes: 'Routine voluntary whole blood donation',
    },
  });

  await prisma.appointment.create({
    data: {
      donorId: donor3.id,
      donorName: donor3.name,
      donorPhone: donor3.phone,
      bloodGroup: donor3.bloodGroup,
      appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      appointmentTime: '03:00 PM',
      location: 'Mirpur Thana Health Complex',
      status: AppointmentStatus.SCHEDULED,
      notes: 'Pre-screened platelet apheresis candidate',
    },
  });

  await prisma.appointment.create({
    data: {
      donorId: donor5.id,
      donorName: donor5.name,
      donorPhone: donor5.phone,
      bloodGroup: donor5.bloodGroup,
      appointmentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      appointmentTime: '11:00 AM',
      location: 'Sylhet MAG Osmani Medical College',
      status: AppointmentStatus.COMPLETED,
      notes: 'Completed successfully without adverse reaction',
    },
  });
  console.log(`✓ Created 3 appointment schedules (Scheduled & Completed)`);

  // 7. Seed Notifications
  console.log('\n[7/8] Seeding Notifications...');
  await prisma.notification.create({
    data: {
      userId: superAdmin.id,
      title: 'Urgent O+ Blood Needed',
      message: 'Dhaka Medical College Hospital has an emergency ICU requirement (2 units).',
      type: NotificationType.URGENT_REQUEST,
      isRead: false,
      relatedEntityId: req1.id,
      relatedEntityType: 'BloodRequest',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: superAdmin.id,
      title: 'A- Request Pending Match',
      message: 'Square Hospital scheduled bypass surgery request is awaiting eligible donor response.',
      type: NotificationType.INFO,
      isRead: false,
      relatedEntityId: req2.id,
      relatedEntityType: 'BloodRequest',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: superAdmin.id,
      title: 'Low Stock Alert: AB-',
      message: 'Available inventory for AB- is at 9 units (below safe threshold of 15 units).',
      type: NotificationType.STOCK_ALERT,
      isRead: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: staffUser.id,
      title: 'Upcoming Donation Drive',
      message: 'Community donation camp scheduled at National Heart Foundation on Saturday.',
      type: NotificationType.DONATION_REMINDER,
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  });
  console.log(`✓ Created 4 system and alert notifications`);

  // 8. Seed System Metrics
  console.log('\n[8/8] Seeding Dashboard Metrics...');
  const metrics = [
    { key: 'total_donors', value: '1,248', change: '12%', trend: 'up' },
    { key: 'total_donations', value: '892', change: '8%', trend: 'up' },
    { key: 'blood_requests', value: '156', change: '5%', trend: 'down' },
    { key: 'available_units', value: '620', change: '10%', trend: 'up' },
  ];

  for (const metric of metrics) {
    await prisma.systemMetric.create({ data: metric });
  }
  console.log(`✓ Seeded ${metrics.length} dashboard KPI metrics`);

  console.log('\n====================================================');
  console.log('✅ Synthetic development seeding successfully prepared!');
  console.log('====================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
