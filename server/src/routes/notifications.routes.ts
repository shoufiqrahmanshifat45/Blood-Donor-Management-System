import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller.js';
import { validate } from '../middleware/validate.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import { idParamSchema } from '../validation/donor.schema.js';

const router = Router();
const controller = new NotificationsController();

router.get('/', optionalAuthenticate, controller.getNotifications);
router.patch('/:id/read', optionalAuthenticate, validate({ params: idParamSchema }), controller.markAsRead);
router.post('/mark-all-read', optionalAuthenticate, controller.markAllAsRead);

export default router;
