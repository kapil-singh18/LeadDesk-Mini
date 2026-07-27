import { Response } from 'express';

export interface ApiResponseEnvelope<T = any> {
  success: boolean;
  data?: T;
  error?: string | object;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const payload: ApiResponseEnvelope<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  error: string | object,
  statusCode = 400
): Response {
  const payload: ApiResponseEnvelope = {
    success: false,
    error,
  };
  return res.status(statusCode).json(payload);
}
