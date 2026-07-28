import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createExpressApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedAdminUser } from '../src/services/authService.js';
import { Lead } from '../src/models/Lead.js';
import { Admin } from '../src/models/Admin.js';
import { config } from '../src/config/env.js';

const app = createExpressApp();

describe('LeadDesk Mini API Endpoints', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await Lead.deleteMany({});
    await Admin.deleteMany({});
    await seedAdminUser();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully authenticate admin with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: config.adminEmail,
          password: config.adminPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(config.adminEmail);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: config.adminEmail,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/leads (Public Lead Submission)', () => {
    it('should create a new lead when valid data is provided', async () => {
      const payload = {
        name: 'John Doe',
        email: 'john@example.com',
        budget: '$10k - $25k',
        message: 'We need help scaling our lead generation campaign.',
      };

      const response = await request(app).post('/api/leads').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(payload.name);
      expect(response.body.data.status).toBe('New');
    });

    it('should return 400 validation error when lead payload is invalid', async () => {
      const response = await request(app).post('/api/leads').send({
        name: 'J',
        email: 'invalid-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/leads & PATCH /api/leads/:id/status (Protected Routes)', () => {
    let token: string;

    beforeEach(async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: config.adminEmail, password: config.adminPassword });
      token = loginRes.body.data.token;
    });

    it('should allow authorized admin to fetch lead list', async () => {
      await Lead.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        budget: '$25k+',
        message: 'Interested in enterprise custom integration.',
      });

      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.leads).toHaveLength(1);
    });

    it('should allow authorized admin to update lead status', async () => {
      const lead = await Lead.create({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        budget: '$5k - $10k',
        message: 'Requesting product demo and pricing.',
      });

      const response = await request(app)
        .patch(`/api/leads/${lead._id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Contacted' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('Contacted');
    });

    it('should reject GET /api/leads without Authorization header (401)', async () => {
      const response = await request(app).get('/api/leads');
      expect(response.status).toBe(401);
    });

    it('should reject GET /api/leads with invalid/expired token (401)', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', 'Bearer invalid.jwt.token');
      expect(response.status).toBe(401);
    });

    it('should reject PATCH /api/leads/:id/status without token (401)', async () => {
      const response = await request(app).patch('/api/leads/123/status').send({ status: 'Closed' });
      expect(response.status).toBe(401);
    });

    it('should reject PATCH /api/leads/:id/status with invalid token (401)', async () => {
      const response = await request(app)
        .patch('/api/leads/123/status')
        .set('Authorization', 'Bearer invalid.token')
        .send({ status: 'Closed' });
      expect(response.status).toBe(401);
    });
  });
});
