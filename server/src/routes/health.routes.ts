import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../db/prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const dbConnected = await checkDatabaseConnection();
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'Blood Donor Management System Backend',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    // Backwards compatibility top-level fields
    status: 'ok',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
