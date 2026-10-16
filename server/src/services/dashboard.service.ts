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

    const [stocks, requests, requestCount, donorCount, donationCount, bloodGroupGroups, genderGroups, donorRecords] =
      await Promise.all([
        prisma.bloodStock.findMany({ orderBy: { bloodGroup: 'asc' } }),
        prisma.bloodRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
        prisma.bloodRequest.count(),
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
        prisma.donor.findMany({
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
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
        value: requestCount.toString(),
        change: '5%',
        isPositive: false,
        comparisonText: 'requisitions logged',
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

    // Build registration trend from real donor timestamps (last 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months: { name: string; year: number; monthIdx: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        name: monthNames[d.getMonth()],
        year: d.getFullYear(),
        monthIdx: d.getMonth(),
      });
    }

    const donorRegistrationTrends = last6Months.map((mObj) => {
      const newDonors = donorRecords.filter((d) => {
        const dDate = new Date(d.createdAt);
        return dDate.getFullYear() === mObj.year && dDate.getMonth() === mObj.monthIdx;
      }).length;
      const totalDonors = donorRecords.filter((d) => {
        const dDate = new Date(d.createdAt);
        return (
          dDate.getFullYear() < mObj.year ||
          (dDate.getFullYear() === mObj.year && dDate.getMonth() <= mObj.monthIdx)
        );
      }).length;

      return {
        month: mObj.name,
        newDonors,
        totalDonors,
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
      donorRegistrationTrends,
      recentBloodRequests,
    };
  }
}

