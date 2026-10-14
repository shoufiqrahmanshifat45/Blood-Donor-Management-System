import { Request, Response, NextFunction } from 'express';
import { DonorsService } from '../services/donors.service.js';

const donorsService = new DonorsService();

export async function searchDonors(req: Request, res: Response, next: NextFunction) {
  try {
    const { bloodGroup, district, thana, search, page, limit } = req.query;
    const result = await donorsService.searchDonors({
      bloodGroup: bloodGroup as string,
      district: district as string,
      thana: thana as string,
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    });

    res.status(200).json({
      success: true,
      data: result.donors,
      meta: {
        total: result.total,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createDonor(req: Request, res: Response, next: NextFunction) {
  try {
    const donor = await donorsService.createDonor(req.body);
    res.status(201).json({
      success: true,
      data: donor,
      message: 'Donor registered successfully!',
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
}
