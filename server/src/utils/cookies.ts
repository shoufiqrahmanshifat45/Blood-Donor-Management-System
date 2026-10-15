import { CookieOptions } from 'express';
import { env } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'bdms_token';

/**
 * Cookie options for setting secure authentication tokens.
 * Configures HttpOnly, Secure in production, appropriate SameSite, and safe expiration.
 */
export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: env.IS_PRODUCTION ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT_EXPIRES_IN)
    path: '/',
  };
}

/**
 * Cookie options for clearing authentication tokens on logout.
 */
export function getClearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: env.IS_PRODUCTION ? 'strict' : 'lax',
    path: '/',
  };
}
