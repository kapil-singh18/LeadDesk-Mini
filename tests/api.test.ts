import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createExpressApp } from '../src/app.js';
import { seedAdminUser } from '../src/services/authService.js';
import { Lead } from '../src/models/Lead.js';
import { Admin } from '../src/models/Admin.js';
import { config } from '../src/config/env.js';

let mongoServer: MongoMemoryServer;
const app = createExpressApp();

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  config.nodeEnv = 'test';
  config.adminPassword = 'testAdminPassword123!';
  config.jwtSecret = 'test-jwt-secret-key-12345';

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Lead.deleteMany({});
  await Admin.deleteMany({});
  await seedAdminUser();
});

describe('LeadDesk Mini API Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should successfully authenticate admin with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@leaddesk.com',
          password: 'testAdminPassword123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('admin@leaddesk.com');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@leaddesk.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('POST /api/leads (Public Lead Submission)', () => {
    it('should create a new lead when valid data is provided', async () => {
      const leadPayload = {
        name: 'Alex Mercer',
        email: 'alex@gentek.com',
        budget: '$25k - $50k',
        message: 'Looking for full-stack AI development services for enterprise data pipeline.',
      };

      const res = await request(app).post('/api/leads').send(leadPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Alex Mercer');
      expect(res.body.data.status).toBe('New');
    });

    it('should return 400 validation error when lead payload is invalid', async () => {
      const invalidPayload = {
        name: 'A', // Too short
        email: 'not-an-email',
        budget: '$5k - $10k',
        message: 'Short',
      };

      const res = await request(app).post('/api/leads').send(invalidPayload);

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/leads & PATCH /api/leads/:id/status (Protected Routes)', () => {
    let authToken: string;
    let createdLeadId: string;

    beforeEach(async () => {
      // Obtain valid admin JWT
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@leaddesk.com',
          password: 'testAdminPassword123!',
        });
      authToken = loginRes.body.data.token;

      // Create a test lead
      const leadRes = await request(app)
        .post('/api/leads')
        .send({
          name: 'Jane Doe',
          email: 'jane@acme.com',
          budget: '$5k - $10k',
          message: 'Interested in software architecture review and cloud optimization.',
        });
      createdLeadId = leadRes.body.data.id;
    });

    it('should allow authorized admin to fetch lead list', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.leads).toHaveLength(1);
      expect(res.body.data.leads[0].name).toBe('Jane Doe');
    });

    it('should allow authorized admin to update lead status', async () => {
      const res = await request(app)
        .patch(`/api/leads/${createdLeadId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'Contacted' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Contacted');
    });

    it('should reject GET /api/leads without Authorization header (401)', async () => {
      const res = await request(app).get('/api/leads');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Authentication required');
    });

    it('should reject GET /api/leads with invalid/expired token (401)', async () => {
      const res = await request(app)
        .get('/api/leads')
        .set('Authorization', 'Bearer invalid.jwt.token.string');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Invalid or expired');
    });

    it('should reject PATCH /api/leads/:id/status without token (401)', async () => {
      const res = await request(app)
        .patch(`/api/leads/${createdLeadId}/status`)
        .send({ status: 'Closed' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject PATCH /api/leads/:id/status with invalid token (401)', async () => {
      const res = await request(app)
        .patch(`/api/leads/${createdLeadId}/status`)
        .set('Authorization', 'Bearer badtoken123')
        .send({ status: 'Closed' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
