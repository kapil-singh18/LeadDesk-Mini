import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { seedAdminUser } from './src/services/authService.js';
import apiRouter from './src/routes/index.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Database & Seed Admin
  await connectDB();
  await seedAdminUser();

  // Mount API Router
  app.use('/api', apiRouter);

  // Vite Middleware for Development / Static serving for Production
  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handler Middleware
  app.use(errorHandler);

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`LeadDesk Mini Server running on http://0.0.0.0:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
