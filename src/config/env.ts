import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'leaddesk-mini-jwt-secret-key-change-in-production',
  jwtExpiresIn: '24h',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@leaddesk.com',
  adminPassword: process.env.ADMIN_SEED_PASSWORD || process.env.ADMIN_PASSWORD || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};
