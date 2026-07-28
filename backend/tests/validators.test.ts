import { describe, it, expect } from 'vitest';
import { createLeadSchema, updateLeadStatusSchema } from '../src/validators/leadValidator.js';
import { loginSchema } from '../src/validators/authValidator.js';

describe('Validation Schemas', () => {
  it('should validate valid lead input', () => {
    const result = createLeadSchema.safeParse({
      name: 'Jane Doe',
      email: 'jane@example.com',
      budget: '$5,000 - $10,000',
      message: 'Hello, we would like a custom quote.',
    });
    expect(result.success).toBe(true);
  });

  it('should fail lead input with invalid email', () => {
    const result = createLeadSchema.safeParse({
      name: 'Jane Doe',
      email: 'invalid-email',
      budget: '$5,000',
      message: 'Hello world',
    });
    expect(result.success).toBe(false);
  });

  it('should validate valid login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'admin@leaddesk.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('should fail login credentials with missing password', () => {
    const result = loginSchema.safeParse({
      email: 'admin@leaddesk.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('should validate valid status transition', () => {
    const result = updateLeadStatusSchema.safeParse({ status: 'Contacted' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid status value', () => {
    const result = updateLeadStatusSchema.safeParse({ status: 'Approved' });
    expect(result.success).toBe(false);
  });
});
