import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import { BloodStockItem } from '../../../shared/types.js';

const FALLBACK_STOCK: BloodStockItem[] = [
  { id: '1', bloodGroup: 'A+', availableUnits: 85, reservedUnits: 12, status: 'Good', lastUpdated: 'Just now' },
  { id: '2', bloodGroup: 'A-', availableUnits: 18, reservedUnits: 4, status: 'Low', lastUpdated: '10m ago' },
  { id: '3', bloodGroup: 'B+', availableUnits: 102, reservedUnits: 15, status: 'Good', lastUpdated: '5m ago' },
  { id: '4', bloodGroup: 'B-', availableUnits: 22, reservedUnits: 6, status: 'Low', lastUpdated: '1h ago' },
  { id: '5', bloodGroup: 'AB+', availableUnits: 45, reservedUnits: 8, status: 'Good', lastUpdated: 'Just now' },
  { id: '6', bloodGroup: 'AB-', availableUnits: 9, reservedUnits: 2, status: 'Low', lastUpdated: '2h ago' },
  { id: '7', bloodGroup: 'O+', availableUnits: 134, reservedUnits: 20, status: 'Good', lastUpdated: 'Just now' },
  { id: '8', bloodGroup: 'O-', availableUnits: 16, reservedUnits: 5, status: 'Low', lastUpdated: '30m ago' },
];

export class BloodStockService {
  async getAllStock(): Promise<BloodStockItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      return FALLBACK_STOCK;
    }

    try {
      const records = await prisma.bloodStock.findMany({
        orderBy: { bloodGroup: 'asc' },
      });

      if (records.length === 0) return FALLBACK_STOCK;

      return records.map((r) => ({
        id: r.id,
        bloodGroup: r.bloodGroup as any,
        availableUnits: r.availableUnits,
        reservedUnits: r.reservedUnits,
        status: r.status as any,
        lastUpdated: r.updatedAt.toLocaleDateString(),
      }));
    } catch {
      return FALLBACK_STOCK;
    }
  }

  async updateStock(bloodGroup: string, deltaUnits: number) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      const item = FALLBACK_STOCK.find((s) => s.bloodGroup === bloodGroup);
      if (item) {
        item.availableUnits = Math.max(0, item.availableUnits + deltaUnits);
        item.status = item.availableUnits < 20 ? 'Low' : item.availableUnits < 5 ? 'Critical' : 'Good';
      }
      return item;
    }

    const current = await prisma.bloodStock.findUnique({ where: { bloodGroup } });
    if (!current) throw new Error(`Blood stock for group ${bloodGroup} not found`);

    const newUnits = Math.max(0, current.availableUnits + deltaUnits);
    const newStatus = newUnits < 20 ? 'Low' : newUnits < 5 ? 'Critical' : 'Good';

    return prisma.bloodStock.update({
      where: { bloodGroup },
      data: {
        availableUnits: newUnits,
        status: newStatus,
      },
    });
  }
}
