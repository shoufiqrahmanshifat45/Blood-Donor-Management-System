import { Request, Response, NextFunction } from 'express';
import { BloodRequestsService } from '../services/bloodRequests.service.js';

const requestsService = new BloodRequestsService();

export class BloodRequestsController {
  async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await requestsService.getRequests(req.query as any);
      res.status(200).json({
        success: true,
        data: result.requests,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRequestById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await requestsService.getRequestById(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await requestsService.createRequest(req.body, req.user);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Blood request broadcasted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await requestsService.updateRequest(req.params.id, req.body, req.user!);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Blood request updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRequestStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await requestsService.updateRequestStatus(
        req.params.id,
        req.body.status,
        req.user
      );
      res.status(200).json({
        success: true,
        data: updated,
        message: `Blood request status updated to ${req.body.status}.`,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await requestsService.deleteRequest(req.params.id, req.user!);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
