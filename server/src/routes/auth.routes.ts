import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validation/auth.schema.js';

const router = Router();
const controller = new AuthController();

// Public routes with brute-force rate limiting
router.post('/register', authLimiter, validate({ body: registerSchema }), controller.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);
router.post('/logout', controller.logout);

// Protected routes
router.get('/me', authenticate, controller.getCurrentUser);
router.patch('/profile', authenticate, validate({ body: updateProfileSchema }), controller.updateProfile);
router.patch('/change-password', authenticate, validate({ body: changePasswordSchema }), controller.changePassword);

export default router;
