import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedAdminUser } from './services/authService.js';
import { createExpressApp } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createExpressApp();

  // Initialize Database & Seed Admin
  await connectDB();
  await seedAdminUser();

  const frontendDir = path.resolve(__dirname, '../../frontend');
  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

  // Integrated dev mode / static frontend serving if running locally or in AI Studio container
  if (config.nodeEnv !== 'production' && fs.existsSync(frontendDir)) {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        root: frontendDir,
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.log('Vite middleware skipped in backend standalone mode.');
    }
  } else if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    // Pure standalone API response for non-API root requests
    app.get('/', (_req, res) => {
      res.json({
        status: 'ok',
        service: 'LeadDesk Mini API',
        environment: config.nodeEnv,
      });
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`LeadDesk Mini Server running on http://0.0.0.0:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
