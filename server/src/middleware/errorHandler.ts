import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'An unexpected internal server error occurred.';
  let details: any = undefined;

  // 1. Handled AppError instances
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }
  // 2. Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Request validation failed.';
    const issues = (err as any).issues || (err as any).errors || [];
    details = issues.map((e: any) => ({
      field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
      message: e.message,
    }));
  }
  // 3. Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
      message = `A record with this ${target} already exists.`;
      details = { target: err.meta?.target };
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'The requested record does not exist or has been deleted.';
    } else if (err.code === 'P2003') {
      statusCode = 400;
      message = 'Foreign key constraint failed. Related record does not exist.';
    }
  }
  // 4. Prisma Connection Errors
  else if (err instanceof Prisma.PrismaClientInitializationError || err?.code === 'P1001') {
    statusCode = 503;
    message = 'Database service is currently unreachable. Please check connection configuration.';
  }
  // 5. JWT Authentication Errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token provided.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }
  // 6. Generic errors with standard status code or message
  else if (err.statusCode && typeof err.statusCode === 'number') {
    statusCode = err.statusCode;
    message = err.message || message;
  } else if (err.message && !env.IS_PRODUCTION) {
    message = err.message;
  }

  // Structured logging
  if (statusCode >= 500) {
    console.error(`❌ [SERVER ERROR ${statusCode}] ${req.method} ${req.originalUrl}:`, err);
  } else if (!env.IS_TEST) {
    console.warn(`⚠️ [CLIENT ERROR ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details ? { details } : {}),
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      ...(env.IS_PRODUCTION ? {} : { stack: err.stack }),
    },
  });
}
