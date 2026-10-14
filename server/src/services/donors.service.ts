import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { CreateDonorDto, SearchDonorsQuery, Donor } from '../../../shared/types.js';

const MOCK_DONORS_CACHE: Donor[] = [
  {
    id: 'd-1',
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
    lastDonationDate: '2025-06-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd-2',
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
    lastDonationDate: '2025-05-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd-3',
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
    lastDonationDate: '2025-07-02',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd-4',
    name: 'Farhana Kabir',
    bloodGroup: 'AB+',
    gender: 'Female',
    age: 27,
    phone: '+880 1644-333444',
    district: 'Chattogram',
    thana: 'Panchlaish',
    totalDonations: 3,
    status: 'Eligible',
    lastDonationDate: '2025-04-18',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'd-5',
    name: 'Zubair Hossain',
    bloodGroup: 'O-',
    gender: 'Male',
    age: 31,
    phone: '+880 1555-444555',
    district: 'Sylhet',
    thana: 'Kotwali',
    totalDonations: 5,
    status: 'Eligible',
    lastDonationDate: '2025-06-28',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class DonorsService {
  async searchDonors(query: SearchDonorsQuery) {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      // In-memory filter for local development or disconnected state
      let results = [...MOCK_DONORS_CACHE];
      if (query.bloodGroup) {
        results = results.filter((d) => d.bloodGroup.toLowerCase() === query.bloodGroup?.toLowerCase());
      }
      if (query.district) {
        results = results.filter((d) => d.district.toLowerCase() === query.district?.toLowerCase());
      }
      if (query.thana) {
        results = results.filter((d) => d.thana.toLowerCase() === query.thana?.toLowerCase());
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        results = results.filter((d) => d.name.toLowerCase().includes(s) || d.phone.includes(s));
      }
      return {
        donors: results,
        total: results.length,
      };
    }

    try {
      const where: any = {};
      if (query.bloodGroup) where.bloodGroup = query.bloodGroup;
      if (query.district) where.district = query.district;
      if (query.thana) where.thana = query.thana;
      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { phone: { contains: query.search } },
        ];
      }

      const [donors, total] = await Promise.all([
        prisma.donor.findMany({
          where,
          take: query.limit || 50,
          skip: query.page ? (query.page - 1) * (query.limit || 50) : 0,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.donor.count({ where }),
      ]);

      return {
        donors: donors.map((d) => ({
          ...d,
          bloodGroup: d.bloodGroup as any,
          gender: d.gender as any,
          status: d.status as any,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
          lastDonationDate: d.lastDonationDate ? d.lastDonationDate.toISOString() : null,
        })),
        total,
      };
    } catch (error) {
      console.warn('Donor search DB error, using in-memory list:', (error as Error).message);
      return { donors: MOCK_DONORS_CACHE, total: MOCK_DONORS_CACHE.length };
    }
  }

  async createDonor(data: CreateDonorDto) {
    const isDbConnected = await checkDatabaseConnection();

    if (!isDbConnected) {
      const newDonor: Donor = {
        id: `d-${Date.now()}`,
        name: data.name,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        age: data.age,
        phone: data.phone,
        email: data.email || null,
        district: data.district,
        thana: data.thana,
        totalDonations: 0,
        status: 'Eligible',
        lastDonationDate: data.lastDonationDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_DONORS_CACHE.unshift(newDonor);
      return newDonor;
    }

    const created = await prisma.donor.create({
      data: {
        name: data.name,
        bloodGroup: data.bloodGroup,
        gender: data.gender,
        age: data.age,
        phone: data.phone,
        email: data.email,
        district: data.district,
        thana: data.thana,
        lastDonationDate: data.lastDonationDate ? new Date(data.lastDonationDate) : null,
      },
    });

    return {
      ...created,
      bloodGroup: created.bloodGroup as any,
      gender: created.gender as any,
      status: created.status as any,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      lastDonationDate: created.lastDonationDate ? created.lastDonationDate.toISOString() : null,
    };
  }
}
