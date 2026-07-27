import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createLeadSchema, updateLeadStatusSchema } from '../validators/leadValidator.js';

const router = Router();

// POST /api/leads (public)
router.post('/', validateBody(createLeadSchema), leadController.createLead);

// GET /api/leads (admin)
router.get('/', authMiddleware, leadController.getLeads);

// PATCH /api/leads/:id/status (admin)
router.patch('/:id/status', authMiddleware, validateBody(updateLeadStatusSchema), leadController.updateLeadStatus);

export default router;
