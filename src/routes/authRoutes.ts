import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateRequest.js';
import { loginSchema } from '../validators/authValidator.js';

const router = Router();

// POST /api/auth/login (public)
router.post('/login', validateBody(loginSchema), authController.login);

export default router;
