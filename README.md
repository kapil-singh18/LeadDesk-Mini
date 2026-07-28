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
│   ├── public/                # Favicons (favicon.svg, favicon.ico) and static public assets
│   ├── .env.example           # Frontend environment variable reference
│   ├── vercel.json            # Vercel SPA rewrite fallback configuration
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
│   │   └── server.ts          # Server entrypoint (serves API & static frontend)
│   ├── tests/                 # Vitest + Supertest integration & unit test suite
│   ├── .env.example           # Backend environment variable reference
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
- **Primary Deployment**: AI Studio / Single Container Cloud Run (Single Express server serving both `/api/*` and static SPA build from `frontend/dist`).
- **Legacy Deployment Fallbacks**: Vercel (`frontend/vercel.json` rewrite fallback) and Render.

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
Copy `.env.example` to `.env` in workspace root.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Build & Test Commands
```bash
# Run backend test suite
npm test

# Build both frontend and backend
npm run build

# Run TypeScript lint check
npm run lint

# Start production server
npm start
```

---

## 🚀 Deployment via AI Studio (Single Cloud Run Service)

AI Studio publishes the unified container running the Express backend, which serves both the `/api/*` endpoints and static frontend assets (`frontend/dist`) with SPA fallback.

### Environment Variables required before publishing:
- `MONGODB_URI`: MongoDB Atlas connection string (or omit to fall back to in-memory database for preview/testing).
- `JWT_SECRET`: Secret key used for signing JWT tokens.
- `ADMIN_EMAIL`: Admin login email address (`admin@leaddesk.com`).
- `ADMIN_SEED_PASSWORD`: Admin login password (`LeadDesk@Admin`).
- `NODE_ENV`: `production`.
