import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/apiResponse.js';

export function validateBody(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        const issues = error.issues || [];
        issues.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path || 'form'] = err.message;
        });
        sendError(res, { message: 'Validation failed', fields: formattedErrors }, 400);
        return;
      }
      next(error);
    }
  };
}
