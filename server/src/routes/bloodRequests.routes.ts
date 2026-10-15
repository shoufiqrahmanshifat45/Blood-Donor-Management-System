import { Router } from 'express';
import { BloodRequestsController } from '../controllers/bloodRequests.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.js';
import {
  createBloodRequestSchema,
  updateBloodRequestSchema,
  updateRequestStatusSchema,
  bloodRequestQuerySchema,
} from '../validation/bloodRequest.schema.js';
import { idParamSchema } from '../validation/donor.schema.js';

const router = Router();
const controller = new BloodRequestsController();

// Public listing and details
router.get('/', validate({ query: bloodRequestQuerySchema }), controller.getRequests);
router.get('/:id', validate({ params: idParamSchema }), controller.getRequestById);

// Creation (guests can broadcast or logged-in users linked to requesterId)
router.post(
  '/',
  optionalAuthenticate,
  validate({ body: createBloodRequestSchema }),
  controller.createRequest
);

// Updates and status changes (authenticated with ownership / role checks)
router.patch(
  '/:id',
  authenticate,
  validate({ params: idParamSchema, body: updateBloodRequestSchema }),
  controller.updateRequest
);

router.patch(
  '/:id/status',
  optionalAuthenticate,
  validate({ params: idParamSchema, body: updateRequestStatusSchema }),
  controller.updateRequestStatus
);

router.delete(
  '/:id',
  authenticate,
  validate({ params: idParamSchema }),
  controller.deleteRequest
);

export default router;
