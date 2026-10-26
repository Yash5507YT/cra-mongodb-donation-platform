# Sahyog — Donation & NGO Support Platform

**Sahyog** is a professional public donation platform built with **Create React App**, **React.js**, **Node.js/Express**, and **MongoDB/Mongoose**. It provides an animated, responsive public experience together with protected donor, NGO, and administrator workspaces.

> This source package is structured for local development. It does not process real payments; a donation is recorded as a platform pledge. Connect a certified payment provider before using it for public financial transactions.

## Project capabilities

| Area | Included functionality |
|---|---|
| Public experience | Responsive master landing page with project overview, donor/NGO/admin role details, certificate explanation, campaign discovery, campaign details, goals, progress indicators, and clear Login/Register calls to action. |
| Donor workflow | Secure sign-up/sign-in, protected dashboard, donation history, receipt number, status tracking, printable donation certificate with a Sahyog verification seal, and profile settings. |
| NGO workflow | NGO registration, protected campaign workspace, create campaign flow, campaign goal/progress view, draft/publish/pause controls, and organization profile settings. |
| Admin workflow | Protected overview, user list, role management, donation totals, and activity audit entries. |
| Backend security | JWT authentication, bcrypt password hashing, role middleware, input validation, Helmet security headers, CORS allow-list, and authentication rate limiting. |
| Database | Mongoose models for users, campaigns, donations, and activity logs, plus a development-only seed script. |

## Technology structure

```text
cra-mongodb-donation-platform/
├── frontend/                 # Create React App / React.js client
│   ├── src/
│   │   ├── api/              # Axios API client with JWT interceptor
│   │   ├── components/       # Public, protected, and workspace UI
│   │   ├── context/          # Authentication state
│   │   └── pages/            # Public, donor, NGO, and admin pages
│   └── package.json
├── backend/                  # Node.js + Express REST API
│   ├── config/               # MongoDB connection
│   ├── controllers/          # Auth, campaign, donation, and admin logic
│   ├── data/                 # Development-only seed script
│   ├── middlewares/          # JWT, roles, errors
│   ├── models/               # Mongoose schemas
│   ├── routes/               # REST endpoints
│   └── tests/                # Authorization test coverage
└── CONFIGURATION.md          # Environment values and database setup
```

## Local setup

Install **Node.js 18+** and run a local MongoDB instance or create a MongoDB Atlas database. Then configure and start the backend and frontend in two separate terminals.

| Terminal | Command | Purpose |
|---|---|---|
| Backend setup | `cd backend && npm install` | Installs Express, Mongoose, JWT, security, and validation packages. |
| Backend configuration | Copy `backend/environment.template.txt` to a new file named `backend/.env`, then replace its placeholders using `CONFIGURATION.md`. | Adds the private MongoDB connection and JWT secret. |
| Seed database | `npm run seed` | Clears the chosen development database and adds sample development records. |
| Start backend | `npm run dev` | Starts the API at `http://localhost:5000`. |
| Frontend setup | `cd frontend && npm install` | Installs the Create React App dependencies. |
| Start frontend | `npm start` | Starts the app at `http://localhost:3000`. |

After the seed command completes, open `http://localhost:3000` and sign in with one of the **development-only** accounts below. Change or delete these accounts before any non-development use.

| Workspace | Email | Temporary seeded password |
|---|---|---|
| Donor | `donor@sahyog.local` | `Donor123!` |
| NGO | `ngo@sahyog.local` | `Ngo12345!` |
| Admin | `admin@sahyog.local` | `Admin123!` |

## API overview

All protected requests must include `Authorization: Bearer <JWT>`.

| Endpoint group | Example routes | Access |
|---|---|---|
| Authentication | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` | Public / authenticated user |
| Campaigns | `GET /api/campaigns`, `GET /api/campaigns/:id`, `POST /api/campaigns` | Public read; NGO/admin write |
| Donations | `POST /api/donations`, `GET /api/donations/mine`, `PUT /api/donations/:id/status` | Donor create/read own; NGO/admin status management |
| Admin | `GET /api/admin/dashboard`, `GET /api/admin/users`, `PUT /api/admin/users/:id` | Admin only |

## Printable donation certificate

Every donor history entry includes a **Certificate** action. It opens a protected, print-optimized certificate page that displays the donor name, donation receipt number, recorded date, campaign or donated item/amount, donation status, and the Sahyog verification seal. Select **Print certificate** on that page to use the browser's standard print dialog. The print stylesheet hides navigation controls and formats the certificate for A4 landscape output.

## Quality checks

The package includes focused tests for role routing and backend authorization logic. Run the following commands after dependency installation.

```bash
cd backend && npm test
cd ../frontend && CI=true npm test -- --watchAll=false
cd ../frontend && npm run build
```

## Pre-publication checklist

Before publishing or accepting public contributions, replace the local database URI with a production MongoDB connection string, set a strong unique `JWT_SECRET`, remove the seeded demo accounts, add verified organization review processes, integrate a compliant payment processor, and configure `FRONTEND_URL` to the deployed frontend domain.

## Design notes

The interface uses a deep-pine, jade, and warm-gold visual system. Motion is limited to small hover, button, progress, and entrance transitions; it also respects the system reduced-motion setting. The design deliberately keeps campaign goals, status, and contribution records visible rather than presenting unsupported impact claims.
