import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../db/prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const dbConnected = await checkDatabaseConnection();
  res.status(200).json({
    status: 'ok',
    service: 'Blood Donor Management System Backend',
    database: dbConnected ? 'connected' : 'disconnected/fallback',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
