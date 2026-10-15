import { prisma, checkDatabaseConnection } from '../db/prisma.js';
import {
  BloodStockItem,
  toPrismaBloodGroup,
  fromPrismaBloodGroup,
  toPrismaStockStatus,
  fromPrismaStockStatus,
} from '../types/shared.js';
import { NotFoundError, ServiceUnavailableError } from '../utils/errors.js';

export class BloodStockService {
  async getAllStock(): Promise<BloodStockItem[]> {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Cannot retrieve blood stock.');
    }

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
  }

  async updateStock(bloodGroupStr: string, deltaUnits: number) {
    const isDbConnected = await checkDatabaseConnection();
    if (!isDbConnected) {
      throw new ServiceUnavailableError('Database service unavailable. Unable to update blood stock.');
    }

    const bloodGroup = toPrismaBloodGroup(bloodGroupStr);
    const current = await prisma.bloodStock.findUnique({ where: { bloodGroup } });
    if (!current) {
      throw new NotFoundError(`Blood stock for group ${bloodGroupStr} not found.`);
    }

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
