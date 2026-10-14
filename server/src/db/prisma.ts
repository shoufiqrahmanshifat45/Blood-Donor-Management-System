import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Reuse Prisma instance during development to prevent exhausting connection pool
export const prisma =
  global.__prisma ||
  new PrismaClient({
    log: env.IS_PRODUCTION ? ['error'] : ['query', 'error', 'warn'],
  });

if (!env.IS_PRODUCTION) {
  global.__prisma = prisma;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.warn('⚠️ PostgreSQL connection failed or database is not yet ready:', (error as Error).message);
    return false;
  }
}
