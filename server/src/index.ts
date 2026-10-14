import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/health.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import donorsRoutes from './routes/donors.routes.js';
import bloodStockRoutes from './routes/bloodStock.routes.js';
import bloodRequestsRoutes from './routes/bloodRequests.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';

const app = express();

// Middleware
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// API Route Registration
app.use('/api/health', healthRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/blood-stock', bloodStockRoutes);
app.use('/api/blood-requests', bloodRequestsRoutes);
app.use('/api/appointments', appointmentsRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    name: 'Blood Donor Management System REST API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// Centralized error handling
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`🚀 Blood Donor Backend running on http://localhost:${env.PORT}`);
    console.log(`📡 Environment: ${env.NODE_ENV}`);
  });
}

export default app;
