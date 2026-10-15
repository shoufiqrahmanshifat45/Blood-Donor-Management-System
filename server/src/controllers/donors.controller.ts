import { Request, Response, NextFunction } from 'express';
import { DonorsService } from '../services/donors.service.js';

const donorsService = new DonorsService();

export class DonorsController {
  async searchDonors(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await donorsService.searchDonors(req.query as any);
      res.status(200).json({
        success: true,
        data: result.donors,
        meta: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonorById(req: Request, res: Response, next: NextFunction) {
    try {
      const donor = await donorsService.getDonorById(req.params.id);
      res.status(200).json({
        success: true,
        data: donor,
      });
    } catch (error) {
      next(error);
    }
  }

  async createDonor(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await donorsService.createDonor(req.body, req.user);
      res.status(201).json({
        success: true,
        data: created,
        message: 'Donor profile registered successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDonor(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await donorsService.updateDonor(req.params.id, req.body, req.user!);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Donor profile updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await donorsService.updateAvailability(req.params.id, req.body, req.user!);
      res.status(200).json({
        success: true,
        data: updated,
        message: 'Availability updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDonor(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await donorsService.deleteDonor(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
