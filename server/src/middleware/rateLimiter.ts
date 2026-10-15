import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

/**
 * Standard API rate limiter to protect public and user endpoints
 */
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP address. Please try again after 15 minutes.',
    meta: {
      retryAfterMinutes: 15,
    },
  },
  skip: () => env.IS_TEST, // Disable during automated testing
});

/**
 * Stricter rate limiter for sensitive authentication endpoints (login, register)
 */
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
    meta: {
      retryAfterMinutes: 15,
    },
  },
  skip: () => env.IS_TEST, // Disable during automated testing
});
