import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as leadController from '../controllers/leadController.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createLeadSchema, updateLeadStatusSchema } from '../validators/leadValidator.js';
import { config } from '../config/env.js';

const router = Router();

// Rate limiter for public lead submission (5 requests / 15 min / IP)
const leadSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  skip: () => process.env.NODE_ENV === 'test' || config.nodeEnv === 'test',
  message: {
    success: false,
    error: 'Too many lead submission requests from this IP, please try again after 15 minutes.',
  },
});

// POST /api/leads (public)
router.post('/', leadSubmissionLimiter, validateBody(createLeadSchema), leadController.createLead);

// GET /api/leads (admin)
router.get('/', authMiddleware, leadController.getLeads);

// PATCH /api/leads/:id/status (admin)
router.patch('/:id/status', authMiddleware, validateBody(updateLeadStatusSchema), leadController.updateLeadStatus);

export default router;
