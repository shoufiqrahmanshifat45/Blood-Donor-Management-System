import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import donorsRoutes from './routes/donors.routes.js';
import bloodRequestsRoutes from './routes/bloodRequests.routes.js';
import donationsRoutes from './routes/donations.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import bloodStockRoutes from './routes/bloodStock.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';

export const app = express();

// Trust proxy for rate limiting behind reverse proxies / cloud platforms
app.set('trust proxy', 1);

// Security & Body parsing middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGINS.includes(origin) || !env.IS_PRODUCTION) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Sensible request-size limit (10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Global API Rate limiter (bypassed in automated test environment)
app.use('/api', generalLimiter);

// API Route Registration
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/blood-requests', bloodRequestsRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/blood-stock', bloodStockRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationsRoutes);

// Root informational endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    name: 'Blood Donor Management System REST API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/donors',
      '/api/blood-requests',
      '/api/donations',
      '/api/appointments',
      '/api/blood-stock',
      '/api/dashboard',
      '/api/notifications',
    ],
  });
});

// 404 Handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

// Centralized structured error handler
app.use(errorHandler);

export default app;
