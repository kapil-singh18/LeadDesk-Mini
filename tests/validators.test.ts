import { describe, it, expect } from 'vitest';
import { createLeadSchema } from '../src/validators/leadValidator.js';
import { loginSchema } from '../src/validators/authValidator.js';

describe('Validation Schemas', () => {
  describe('createLeadSchema', () => {
    it('should pass validation for valid lead data', () => {
      const validPayload = {
        name: 'Sarah Connor',
        email: 'sarah@cyberdyne.com',
        budget: '$10k - $25k',
        message: 'We need urgent security consulting for our automated defense network.',
      };

      const result = createLeadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('sarah@cyberdyne.com');
      }
    });

    it('should fail validation when name is too short', () => {
      const invalidPayload = {
        name: 'A',
        email: 'valid@example.com',
        budget: '< $5k',
        message: 'This is a valid message length.',
      };

      const result = createLeadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters');
      }
    });

    it('should fail validation when email is malformed', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'invalid-email-address',
        budget: '< $5k',
        message: 'This is a valid message length.',
      };

      const result = createLeadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email');
      }
    });

    it('should fail validation when message is under 5 characters', () => {
      const invalidPayload = {
        name: 'John Doe',
        email: 'john@example.com',
        budget: '< $5k',
        message: 'Hi',
      };

      const result = createLeadSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 5 characters');
      }
    });
  });

  describe('loginSchema', () => {
    it('should pass validation for valid login input', () => {
      const validPayload = {
        email: 'admin@leaddesk.com',
        password: 'SecurePassword123',
      };

      const result = loginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail validation when email or password is missing', () => {
      const invalidPayload = {
        email: 'not-an-email',
        password: '',
      };

      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });
});
