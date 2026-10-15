import { Request, Response, NextFunction } from 'express';
import { DonationsService } from '../services/donations.service.js';

const donationsService = new DonationsService();

export class DonationsController {
  async getDonations(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await donationsService.getDonations(req.query as any);
      res.status(200).json({
        success: true,
        data: result.donations,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonationById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await donationsService.getDonationById(req.params.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createDonation(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await donationsService.createDonation(req.body, req.user!);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Donation record verified and blood inventory updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}
