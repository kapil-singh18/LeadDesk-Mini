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
    const { search, status, page, limit } = req.query;
    const result = await leadService.getLeads({
      search: search ? String(search) : undefined,
      status: status ? String(status) : undefined,
      page: page ? parseInt(String(page), 10) : 1,
      limit: limit ? parseInt(String(limit), 10) : 10,
    });
    sendSuccess(res, result, 200);
  } catch (error) {
    next(error);
  }
}

export async function updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const lead = await leadService.updateLeadStatus(id, status as LeadStatus);
    sendSuccess(res, lead, 200);
  } catch (error) {
    next(error);
  }
}
