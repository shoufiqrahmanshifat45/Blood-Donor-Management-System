import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  BloodStockItem,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaStockStatus,
  fromPrismaStockStatus,
} from '../types/shared.js';

export class BloodStockService {
  async getAllStock(): Promise<BloodStockItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      console.warn('⚠️ [BloodStockService.getAllStock] PostgreSQL disconnected.');
      return [];
    }

    try {
      const records = await prisma.bloodStock.findMany({
        orderBy: { bloodGroup: 'asc' },
      });

      return records.map((r) => ({
        id: r.id,
        bloodGroup: fromPrismaBloodGroup(r.bloodGroup),
        availableUnits: r.availableUnits,
        reservedUnits: r.reservedUnits,
        status: fromPrismaStockStatus(r.status),
        lastUpdated: r.updatedAt.toLocaleDateString(),
      }));
    } catch (error) {
      console.error('❌ Error fetching blood stock from PostgreSQL:', (error as Error).message);
      throw new Error(`Failed to query blood stock: ${(error as Error).message}`);
    }
  }

  async updateStock(bloodGroupStr: string, deltaUnits: number) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new Error('Database is offline. Unable to update blood stock.');
    }

    const bloodGroup = toPrismaBloodGroup(bloodGroupStr);
    const current = await prisma.bloodStock.findUnique({ where: { bloodGroup } });
    if (!current) throw new Error(`Blood stock for group ${bloodGroupStr} not found`);

    const newUnits = Math.max(0, current.availableUnits + deltaUnits);
    const newStatusStr = newUnits < 5 ? 'Critical' : newUnits < 20 ? 'Low' : 'Good';
    const newStatus = toPrismaStockStatus(newStatusStr);

    return prisma.bloodStock.update({
      where: { bloodGroup },
      data: {
        availableUnits: newUnits,
        status: newStatus,
      },
    });
  }
}
