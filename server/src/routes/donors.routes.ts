import { Router } from 'express';
import { Role } from '@prisma/client';
import { DonorsController } from '../controllers/donors.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate, authorize } from '../middleware/auth.js';
import {
  createDonorSchema,
  updateDonorSchema,
  updateAvailabilitySchema,
  searchDonorsQuerySchema,
  idParamSchema,
} from '../validation/donor.schema.js';

const router = Router();
const controller = new DonorsController();

// Public donor search and directory
router.get('/', validate({ query: searchDonorsQuerySchema }), controller.searchDonors);
router.get('/:id', validate({ params: idParamSchema }), controller.getDonorById);

// Donor creation (accessible to guests, or linked to authenticated user)
router.post('/', optionalAuthenticate, validate({ body: createDonorSchema }), controller.createDonor);

// Authenticated donor updates (ownership enforced in service)
router.patch(
  '/:id',
  authenticate,
  validate({ params: idParamSchema, body: updateDonorSchema }),
  controller.updateDonor
);

router.patch(
  '/:id/availability',
  authenticate,
  validate({ params: idParamSchema, body: updateAvailabilitySchema }),
  controller.updateAvailability
);

// Admin-only deletion
router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.SUPER_ADMIN),
  validate({ params: idParamSchema }),
  controller.deleteDonor
);

export default router;
