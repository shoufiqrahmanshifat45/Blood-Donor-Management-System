import { Router } from 'express';
import { Role } from '@prisma/client';
import { DonationsController } from '../controllers/donations.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { createDonationSchema, donationQuerySchema } from '../validation/donation.schema.js';
import { idParamSchema } from '../validation/donor.schema.js';

const router = Router();
const controller = new DonationsController();

// List donations (optional query filters)
router.get('/', validate({ query: donationQuerySchema }), controller.getDonations);
router.get('/:id', validate({ params: idParamSchema }), controller.getDonationById);

// Record verified donation (authorized: STAFF, ADMIN, SUPER_ADMIN)
router.post(
  '/',
  authenticate,
  authorize(Role.STAFF, Role.ADMIN, Role.SUPER_ADMIN),
  validate({ body: createDonationSchema }),
  controller.createDonation
);

export default router;
