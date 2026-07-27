import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse.js';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  sendError(res, message, statusCode);
}
