import { Request, Response, NextFunction } from 'express';
import { BloodRequestsService } from '../services/bloodRequests.service.js';

const requestsService = new BloodRequestsService();

export async function getRecentRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await requestsService.getRecentRequests();
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

export async function createRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const created = await requestsService.createRequest(req.body);
    res.status(201).json({
      success: true,
      data: created,
      message: 'Blood request registered successfully!',
    });
  } catch (error) {
    next(error);
  }
}
