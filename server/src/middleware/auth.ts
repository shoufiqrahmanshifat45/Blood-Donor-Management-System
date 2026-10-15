import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { AuthenticatedUser } from '../types/express.js';

import { AUTH_COOKIE_NAME } from '../utils/cookies.js';

interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Helper to extract token from either Authorization Bearer header or HttpOnly cookie
 */
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.split(' ')[1];
    if (headerToken && headerToken.trim()) return headerToken.trim();
  }

  // Check HttpOnly session cookie (parsed or signed)
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }
  if (req.signedCookies && req.signedCookies[AUTH_COOKIE_NAME]) {
    return req.signedCookies[AUTH_COOKIE_NAME];
  }

  return null;
}

/**
 * Middleware ensuring a valid JWT is present via Authorization Bearer header or HttpOnly cookie
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Authentication required. Missing authorization token or session cookie. Please log in.');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Verify user exists and is still active in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User account associated with this token no longer exists.');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact support.');
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware for endpoints accessible to both guests and logged-in users.
 * Silently attaches req.user if a valid token or cookie exists.
 */
export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (token) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, name: true, role: true, isActive: true },
        });
        if (user && user.isActive) {
          req.user = user;
        }
      } catch {
        // Token invalid or expired: proceed as anonymous guest
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-based authorization middleware
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Insufficient permissions. Requires one of: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
}
