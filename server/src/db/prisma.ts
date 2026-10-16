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
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
    log: env.IS_PRODUCTION ? ['error'] : ['error', 'warn'],
  });

if (!env.IS_PRODUCTION) {
  global.__prisma = prisma;
}

let lastCheckTime = 0;
let lastCheckStatus = false;
const CHECK_CACHE_TTL = 20000; // 20 seconds cache

export async function checkDatabaseConnection(force = false): Promise<boolean> {
  const now = Date.now();
  if (!force && lastCheckStatus && now - lastCheckTime < CHECK_CACHE_TTL) {
    return true;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    lastCheckTime = Date.now();
    lastCheckStatus = true;
    return true;
  } catch (error) {
    lastCheckTime = Date.now();
    lastCheckStatus = false;
    console.warn('⚠️ PostgreSQL connection check:', (error as Error).message);
    return false;
  }
}
