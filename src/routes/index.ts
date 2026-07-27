import { Router } from 'express';
import authRoutes from './authRoutes.js';
import leadRoutes from './leadRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'LeadDesk Mini API Server is Healthy' });
});

export default router;
