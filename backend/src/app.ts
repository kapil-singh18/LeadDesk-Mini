import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { config } from './config/env.js';

export function createExpressApp() {
  const app = express();

  // Trust first proxy (reverse proxy / Cloud Run / Nginx / Render / Vercel)
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(helmet({ contentSecurityPolicy: false }));

  // CORS Configuration: Restrict to CLIENT_ORIGIN in production, allow wildcard in dev/test
  const corsOrigin = config.nodeEnv === 'production' ? config.clientOrigin || false : '*';
  app.use(cors({ origin: corsOrigin }));

  // Request Body Parsers with payload limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Mount API Router
  app.use('/api', apiRouter);

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
}

