# LeadDesk Mini 🚀

LeadDesk Mini is an enterprise-grade full-stack Lead Intake & Management Portal designed for fast, seamless customer acquisition and internal lead tracking. Built with React 19, TypeScript, Express, Mongoose, and Tailwind CSS, LeadDesk Mini provides a public lead submission form and a secure, JWT-authenticated admin dashboard with real-time optimistic status updates, server-side regex search, filtering, and pagination.

---

## 🌟 Key Features

### 🏢 Public Lead Intake
- **Hero & Value Proposition**: High-converting, responsive landing section built with Lucide icons and Tailwind styling.
- **Interactive Budget Selector**: Granular project budget tiers.
- **Client-Side & Server-Side Validation**: Powered by Zod and React Hook Form with inline error messaging.
- **Sanitized Submission**: Sanitizes input strings before writing to database.

### 🛡️ Admin Portal & Dashboard
- **Secure Authentication**: JWT-based auth flow (`/api/auth/login`) with seed configuration.
- **Protected Dashboard**: Client-side route guards combined with server-side `Bearer` token verification middleware.
- **Server-Side Search & Filtering**: Multi-field regex search on `name`, `email`, and `message` with special character escaping to prevent ReDoS attacks.
- **Real-Time Status Management**: Optimistic UI state updates for lead status (`New`, `Contacted`, `Closed`) with automatic rollback and error notifications on network failure.
- **Paginated Dataset**: Page-based navigation (`limit` and `page` parameters) with live metric summaries.
- **Detail View Modal**: Inspect complete lead details and full message text.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, React Router v7, Tailwind CSS v4, Lucide React, React Hook Form, Zod, Axios.
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT (`jsonwebtoken`), `bcryptjs`.
- **Testing & Quality Assurance**: Vitest, Supertest, MongoDB Memory Server (`mongodb-memory-server`), TypeScript compiler check (`tsc --noEmit`).
- **Deployment**: Render (Backend Web Service), Vercel (Frontend SPA), MongoDB Atlas (Cloud Database).

---

## 📁 Folder Structure

```
.
├── dist/                      # Compiled production assets & server bundle (dist/server.cjs)
├── public/                    # Static public assets
├── src/
│   ├── app.ts                 # Express app factory (used in production & unit/integration testing)
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # ProtectedRoute guard
│   │   ├── landing/           # Hero, Features, LeadFormSection
│   │   ├── layout/            # Navbar, Footer
│   │   └── ui/                # Button, Input, Textarea, Badge, Card
│   ├── config/                # Environment configuration & MongoDB database connector
│   ├── controllers/           # Auth and Lead Express route controllers
│   ├── middlewares/           # JWT auth middleware, Zod validator middleware, error handler
│   ├── models/                # Mongoose schemas (Admin, Lead)
│   ├── pages/                 # LandingPage, LoginPage, DashboardPage, NotFoundPage
│   ├── routes/                # Express API router definitions (/api/auth, /api/leads)
│   ├── services/              # Auth, Lead service logic & client API wrappers
│   ├── types/                 # Shared TypeScript interfaces & types
│   ├── utils/                 # API envelope response utils & JWT generators
│   └── validators/            # Zod validation schemas (leadValidator, authValidator)
├── tests/                     # Integration and unit test suite (Vitest + Supertest)
│   ├── api.test.ts            # API endpoint integration tests
│   └── validators.test.ts     # Zod schema validation unit tests
├── .env.example               # Environment variables template
├── metadata.json              # Platform metadata
├── package.json               # Dependencies and scripts
├── render.yaml                # Render deployment configuration
├── server.ts                  # Server entrypoint (Express + Vite dev middleware)
├── vercel.json                # Vercel deployment & rewrite configuration
└── vite.config.ts             # Vite build configuration
```

---

## ⚡ Local Setup & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- MongoDB instance (local or MongoDB Atlas cluster URL)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/leaddesk-mini.git
cd leaddesk-mini
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Set required variables inside `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/leaddesk-mini
JWT_SECRET=your-super-secret-jwt-key
ADMIN_EMAIL=admin@leaddesk.com
ADMIN_SEED_PASSWORD=SuperSecureAdminPassword2026!
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Test Suite
```bash
npm test
```

---

## 🔑 Environment Variables Reference

| Variable | Description | Required | Default / Example |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP server port | Yes | `3000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/leaddesk` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | Yes | `a-long-random-secret-key` |
| `ADMIN_EMAIL` | Initial seeded admin account email | Yes | `admin@leaddesk.com` |
| `ADMIN_SEED_PASSWORD` | Password used to seed initial admin account | Yes (No fallback) | `StrongAdminPassword2026!` |
| `NODE_ENV` | Application environment (`development` / `production`) | No | `development` |

---

## 📡 API Endpoints Reference

### Public Endpoints

#### 1. Submit Lead
- **Method**: `POST`
- **Path**: `/api/leads`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@cyberdyne.com",
    "budget": "$10k - $25k",
    "message": "We need urgent security consulting for our automated defense network."
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Sarah Connor",
      "email": "sarah@cyberdyne.com",
      "budget": "$10k - $25k",
      "message": "We need urgent security consulting for our automated defense network.",
      "status": "New",
      "createdAt": "2026-07-26T22:00:00.000Z"
    }
  }
  ```

#### 2. Admin Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: None
- **Request Body**:
  ```json
  {
    "email": "admin@leaddesk.com",
    "password": "StrongAdminPassword2026!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "64f1a2b3c4d5e6f7a8b9c0d0",
        "email": "admin@leaddesk.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### Protected Admin Endpoints (`Authorization: Bearer <token>`)

#### 3. Get Paginated & Filtered Leads
- **Method**: `GET`
- **Path**: `/api/leads?search=security&status=New&page=1&limit=10`
- **Auth**: Required (`Bearer <token>`)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "leads": [ ... ],
      "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
      },
      "summary": {
        "all": 10,
        "new": 3,
        "contacted": 5,
        "closed": 2
      }
    }
  }
  ```

#### 4. Update Lead Status
- **Method**: `PATCH`
- **Path**: `/api/leads/:id/status`
- **Auth**: Required (`Bearer <token>`)
- **Request Body**:
  ```json
  {
    "status": "Contacted"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "status": "Contacted",
      "updatedAt": "2026-07-26T22:05:00.000Z"
    }
  }
  ```

---

## 🚀 Deployment Guide

### 1. Database Setup (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write permissions.
3. Whitelist `0.0.0.0/0` (or Render outbound IPs) under Network Access.
4. Copy connection string URI (`mongodb+srv://<user>:<password>@cluster.mongodb.net/leaddesk`).

### 2. Backend Deployment (Render)
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service** using `render.yaml` or manually configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Set Environment Variables in Render Dashboard:
   - `MONGODB_URI`: `<your_atlas_connection_string>`
   - `JWT_SECRET`: `<random_64_character_string>`
   - `ADMIN_EMAIL`: `admin@leaddesk.com`
   - `ADMIN_SEED_PASSWORD`: `<your_secure_admin_password>`
   - `NODE_ENV`: `production`

### 3. Frontend Deployment (Vercel)
1. Connect repository to [Vercel](https://vercel.com).
2. Deploy using `vercel.json` rewrite configuration pointing `/api/*` requests to your Render backend API domain (`https://leaddesk-mini-api.onrender.com`).

---

## 🔮 Future Improvements & Production Hardening

The following items are explicitly outside MVP scope but recommended for production readiness:

1. **Rate Limiting on Public Lead Intake**:
   - Implement `express-rate-limit` on `POST /api/leads` (e.g., max 5 submissions per IP per 15 minutes) to protect against spam bots and Denial of Service.
2. **httpOnly Cookie Migration & Refresh Tokens**:
   - Migrate JWT storage from `localStorage` to `httpOnly`, `SameSite=Strict`, `Secure` cookies to eliminate XSS token theft risks. Introduce short-lived access tokens (15 mins) paired with rotating refresh tokens stored in database.
3. **Structured Logging & APM**:
   - Integrate `winston` or `pino` for JSON-formatted structured logging, paired with Sentry for automatic exception tracking.
4. **Input Size Limits & Request Payload Sanitization**:
   - Enforce explicit byte limits on `express.json({ limit: '10kb' })` to prevent memory exhaustion attacks from massive payload injections.
5. **Multi-Admin Role-Based Access Control (RBAC)**:
   - Expand permissions model beyond single admin account to support team roles (`Viewer`, `Manager`, `SuperAdmin`) with audit logging.
