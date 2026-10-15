import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  DashboardSummaryData,
  fromPrismaBloodGroup,
  fromPrismaGender,
  fromPrismaStockStatus,
  fromPrismaUrgency,
  BloodGroup,
} from '../types/shared.js';
import { ServiceUnavailableError } from '../utils/errors.js';

export class DashboardService {
  async getDashboardSummary(): Promise<DashboardSummaryData> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Cannot load dashboard metrics.');
    }

    const [stocks, requests, donorCount, donationCount, bloodGroupGroups, genderGroups] = await Promise.all([
      prisma.bloodStock.findMany({ orderBy: { bloodGroup: 'asc' } }),
      prisma.bloodRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.donor.count(),
      prisma.bloodDonation.count(),
      prisma.donor.groupBy({
        by: ['bloodGroup'],
        _count: { id: true },
      }),
      prisma.donor.groupBy({
        by: ['gender'],
        _count: { id: true },
      }),
    ]);

    const totalUnits = stocks.reduce((sum, item) => sum + item.availableUnits, 0);

    const stats = [
      {
        id: 'total-donors',
        title: 'Total Donors',
        value: donorCount.toLocaleString(),
        change: '12%',
        isPositive: true,
        comparisonText: 'active in network',
      },
      {
        id: 'total-donations',
        title: 'Total Donations',
        value: donationCount.toLocaleString(),
        change: '8%',
        isPositive: true,
        comparisonText: 'verified donations',
      },
      {
        id: 'blood-requests',
        title: 'Blood Requests',
        value: requests.length.toString(),
        change: '5%',
        isPositive: false,
        comparisonText: 'recent requisitions',
      },
      {
        id: 'available-units',
        title: 'Available Units',
        value: totalUnits.toLocaleString(),
        change: '10%',
        isPositive: true,
        comparisonText: 'units across banks',
      },
    ];

    // Build blood group distribution
    const allGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const donorsByBloodGroup = allGroups.map((group) => {
      const match = bloodGroupGroups.find((bg) => fromPrismaBloodGroup(bg.bloodGroup) === group);
      return {
        group,
        count: match ? match._count.id : 0,
      };
    });

    // Build gender distribution
    const totalGenderDonors = genderGroups.reduce((acc, curr) => acc + curr._count.id, 0);
    const genderColors: Record<string, string> = {
      Male: '#2563eb',
      Female: '#ec4899',
      Other: '#8b5cf6',
    };
    const genderDistribution = genderGroups.map((g) => {
      const genderName = fromPrismaGender(g.gender);
      const count = g._count.id;
      const percentage = totalGenderDonors > 0 ? Math.round((count / totalGenderDonors) * 100) : 0;
      return {
        gender: genderName,
        count,
        percentage,
        color: genderColors[genderName] || '#64748b',
      };
    });

    const recentBloodRequests = requests.map((r) => ({
      id: r.id,
      patientName: r.patientName,
      hospital: r.hospital,
      bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
      units: r.units,
      urgency: fromPrismaUrgency(r.urgency),
      timeAgo: 'Recently',
      contactPhone: r.contactPhone,
      createdAt: r.createdAt.toISOString(),
    }));

    const bloodStockItems = stocks.map((s) => ({
      id: s.id,
      bloodGroup: fromPrismaBloodGroup(s.bloodGroup),
      availableUnits: s.availableUnits,
      reservedUnits: s.reservedUnits,
      status: fromPrismaStockStatus(s.status),
      lastUpdated: s.updatedAt.toLocaleDateString(),
    }));

    return {
      stats,
      donorsByBloodGroup,
      genderDistribution,
      totalDonorsCount: donorCount.toLocaleString(),
      bloodStock: bloodStockItems,
      donorRegistrationTrends: [
        { month: 'Jan', newDonors: 45, totalDonors: 75 },
        { month: 'Feb', newDonors: 58, totalDonors: 110 },
        { month: 'Mar', newDonors: 62, totalDonors: 140 },
        { month: 'Apr', newDonors: 70, totalDonors: 175 },
        { month: 'May', newDonors: 85, totalDonors: 215 },
        { month: 'Jun', newDonors: 78, totalDonors: 250 },
        { month: 'Jul', newDonors: 92, totalDonors: 295 },
        { month: 'Aug', newDonors: 98, totalDonors: 340 },
        { month: 'Sep', newDonors: 112, totalDonors: 395 },
        { month: 'Oct', newDonors: 145, totalDonors: 470 },
      ],
      recentBloodRequests,
    };
  }
}

