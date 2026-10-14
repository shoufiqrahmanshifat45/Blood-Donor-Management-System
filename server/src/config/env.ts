import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/blood_donor_db?schema=public',
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://127.0.0.1:5173,http://localhost:5173').split(','),
  JWT_SECRET: process.env.JWT_SECRET || 'dev_blood_donor_secret_key',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};
