import { Lead, LeadStatus } from '../models/Lead.js';
import { CreateLeadInput } from '../validators/leadValidator.js';

export interface GetLeadsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function createLead(input: CreateLeadInput) {
  const newLead = await Lead.create({
    ...input,
    status: 'New',
  });
  return newLead.toJSON();
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function getLeads(params: GetLeadsParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(100, params.limit || 10));
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};

  if (params.search && params.search.trim()) {
    const escapedSearch = escapeRegex(params.search.trim());
    const searchRegex = new RegExp(escapedSearch, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }, { message: searchRegex }];
  }

  if (params.status && params.status !== 'All') {
    query.status = params.status;
  }

  const [leads, total] = await Promise.all([
    Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(query),
  ]);

  const [totalAll, totalNew, totalContacted, totalClosed] = await Promise.all([
    Lead.countDocuments({}),
    Lead.countDocuments({ status: 'New' }),
    Lead.countDocuments({ status: 'Contacted' }),
    Lead.countDocuments({ status: 'Closed' }),
  ]);

  return {
    leads: leads.map((lead) => lead.toJSON()),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    summary: {
      all: totalAll,
      new: totalNew,
      contacted: totalContacted,
      closed: totalClosed,
    },
  };
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  const updatedLead = await Lead.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedLead) {
    throw { statusCode: 404, message: 'Lead not found' };
  }

  return updatedLead.toJSON();
}
