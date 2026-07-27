import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function createExpressApp() {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API Router
  app.use('/api', apiRouter);

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  return app;
}
