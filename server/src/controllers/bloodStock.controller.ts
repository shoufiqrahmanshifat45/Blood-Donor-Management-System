import { Request, Response, NextFunction } from 'express';
import { BloodStockService } from '../services/bloodStock.service.js';

const stockService = new BloodStockService();

export async function getAllStock(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await stockService.getAllStock();
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

export async function updateStock(req: Request, res: Response, next: NextFunction) {
  try {
    const { bloodGroup } = req.params;
    const { deltaUnits } = req.body;
    const updated = await stockService.updateStock(bloodGroup, parseInt(deltaUnits, 10));
    res.status(200).json({
      success: true,
      data: updated,
      message: 'Blood stock updated successfully!',
    });
  } catch (error) {
    next(error);
  }
}
