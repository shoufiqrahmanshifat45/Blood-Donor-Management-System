import { Router } from 'express';
import { Role } from '@prisma/client';
import { getAllStock, updateStock } from '../controllers/bloodStock.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { bloodGroupParamSchema, updateBloodStockSchema } from '../validation/bloodStock.schema.js';

const router = Router();

// Publicly visible blood stock levels
router.get('/', getAllStock);

// Staff and Admins can adjust blood inventory
router.patch(
  '/:bloodGroup',
  authenticate,
  authorize(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN),
  validate({ params: bloodGroupParamSchema, body: updateBloodStockSchema }),
  updateStock
);

export default router;

