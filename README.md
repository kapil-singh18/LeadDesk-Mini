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

## 📁 Standard Monorepo Folder Structure

```
LeadDesk-Mini/
├── frontend/                  # React 19 + Vite SPA Frontend
│   ├── src/
│   │   ├── components/        # UI, Auth, Layout, and Landing components
│   │   ├── pages/             # Landing, Login, Dashboard, NotFound pages
│   │   ├── services/          # Axios API clients (api.ts, authApiClient.ts, leadApiClient.ts)
│   │   ├── types/             # Frontend TypeScript definitions
│   │   └── utils/             # Frontend utility functions
│   ├── public/                # Static public assets
│   ├── .env.example           # Frontend environment variable reference
│   ├── vercel.json            # Vercel SPA rewrite configuration
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # Frontend TypeScript configuration
│   └── vite.config.ts         # Vite build configuration
│
├── backend/                   # Express + Mongoose Node.js API Backend
│   ├── src/
│   │   ├── config/            # Environment config (env.ts) and DB connector (db.ts)
│   │   ├── controllers/       # Auth and Lead Express route controllers
│   │   ├── models/            # Mongoose schemas (Admin, Lead)
│   │   ├── middlewares/       # JWT auth middleware, Zod validation, rate-limiter, error handling
│   │   ├── routes/            # Express router definitions (/api/auth, /api/leads)
│   │   ├── services/          # Auth and Lead database services
│   │   ├── utils/             # API envelope response utils & JWT generators
│   │   ├── validators/        # Zod validation schemas
│   │   └── server.ts          # Server entrypoint
│   ├── tests/                 # Vitest + Supertest integration & unit test suite
│   ├── .env.example           # Backend environment variable reference
│   ├── render.yaml            # Render deployment configuration
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # Backend TypeScript configuration
│
├── README.md                  # Project overview and deployment guide
├── .gitignore                 # Root gitignore for both frontend and backend
├── LICENSE                    # MIT License
└── package.json               # Root monorepo orchestrator
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, React Router v7, Tailwind CSS v4, Lucide React, React Hook Form, Zod, Axios.
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`.
- **Testing & Quality Assurance**: Vitest, Supertest, MongoDB Memory Server (`mongodb-memory-server`), TypeScript check (`tsc --noEmit`).
- **Deployment**: Render (Backend Web Service), Vercel (Frontend SPA), MongoDB Atlas (Cloud Database).

---

## ⚡ Local Setup & Commands

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
- **Backend**: Copy `backend/.env.example` to `.env` in backend or workspace root.
- **Frontend**: Copy `frontend/.env.example` to `frontend/.env`.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Build & Test Commands
```bash
# Run tests (backend test suite)
npm test

# Build both frontend and backend
npm run build

# Run TypeScript lint check
npm run lint
```

---

## 🚀 Deployment Steps & Order

1. **MongoDB Atlas**:
   - Create cluster, database user, and whitelist IP access (`0.0.0.0/0`).
   - Copy connection URI (`mongodb+srv://user:pass@cluster.mongodb.net/leaddesk`).

2. **Render Backend Deployment**:
   - Create Web Service pointing to `backend/` directory (`rootDir: backend`).
   - Set env vars in Render Dashboard:
     - `MONGODB_URI`: `<Atlas Connection String>`
     - `JWT_SECRET`: `<Secure Random 64-char String>`
     - `ADMIN_EMAIL`: `admin@leaddesk.com`
     - `ADMIN_SEED_PASSWORD`: `LeadDesk@Admin`
     - `NODE_ENV`: `production`
     - `CLIENT_ORIGIN`: `https://leaddesk-mini.vercel.app`
   - Copy live backend URL (e.g. `https://leaddesk-mini-backend.onrender.com`).

3. **Vercel Frontend Deployment**:
   - Connect repo to Vercel and set **Root Directory** to `frontend/`.
   - Set environment variable in Vercel Dashboard:
     - `VITE_API_BASE_URL`: `https://leaddesk-mini-backend.onrender.com/api`
   - Deploy and copy live frontend URL (e.g. `https://leaddesk-mini.vercel.app`).

4. **Final Sync**:
   - Verify `CLIENT_ORIGIN` in Render dashboard matches the live Vercel URL.
