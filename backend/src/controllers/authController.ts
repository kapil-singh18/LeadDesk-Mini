import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await authService.loginAdmin(req.body);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
