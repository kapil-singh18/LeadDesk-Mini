import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  budget: z.string().trim().min(1, { message: 'Budget range is required' }),
  message: z.string().trim().min(5, { message: 'Message must be at least 5 characters long' }),
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Closed'], {
    message: "Status must be 'New', 'Contacted', or 'Closed'",
  }),
});

export const getLeadsQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['All', 'New', 'Contacted', 'Closed']).optional(),
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
