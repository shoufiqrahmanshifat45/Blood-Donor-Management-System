import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

const dashboardService = new DashboardService();

export async function getDashboardSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getDashboardSummary();
    res.status(200).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}
