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
        const issues = error.issues || (error as any).errors || [];
        issues.forEach((err: any) => {
          const path = err.path.join('.');
          formattedErrors[path || 'form'] = err.message;
        });
        sendError(res, { message: 'Validation failed', fields: formattedErrors }, 422);
        return;
      }
      next(error);
    }
  };
}
