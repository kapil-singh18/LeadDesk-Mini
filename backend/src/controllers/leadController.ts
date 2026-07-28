import { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { LeadStatus } from '../models/Lead.js';

export async function createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const lead = await leadService.createLead(req.body);
    sendSuccess(res, lead, 201);
  } catch (error) {
    next(error);
  }
}

export async function getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, search, page, limit } = req.query;
    const result = await leadService.getLeads({
      status: status as LeadStatus | undefined,
      search: search as string | undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const updatedLead = await leadService.updateLeadStatus(id, status);
    sendSuccess(res, updatedLead);
  } catch (error) {
    next(error);
  }
}
