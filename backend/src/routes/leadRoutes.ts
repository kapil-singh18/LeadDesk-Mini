import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as leadController from '../controllers/leadController.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createLeadSchema, updateLeadStatusSchema } from '../validators/leadValidator.js';

const router = Router();

const submitLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many lead submission requests from this IP, please try again after 15 minutes.',
  },
});

router.post('/', submitLeadLimiter, validateBody(createLeadSchema), leadController.createLead);
router.get('/', authMiddleware, leadController.getLeads);
router.patch('/:id/status', authMiddleware, validateBody(updateLeadStatusSchema), leadController.updateLeadStatus);

export default router;
