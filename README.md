# EcoSort — Smart Waste Segregation and Recycling Platform

> **"Sort Smart. Waste Less. Live Greener."**
> A full-stack student entrepreneurship web application addressing waste segregation confusion, recycling education, and coordinated recyclable-waste collection for campuses, dormitories, and households.

---

## 1. Project Overview & Architecture

EcoSort is engineered as a modern, decoupled full-stack application designed specifically for seamless, independent deployment on **Vercel** with a hosted **PostgreSQL** database (such as Neon or Supabase).

```
                             ┌─────────────────────────────────┐
                             │    EcoSort React / Vite SPA     │
                             │  (Vercel Frontend Deployment)   │
                             └───────────────┬─────────────────┘
                                             │
                       HTTPS / REST          │  VITE_API_BASE_URL
                       CORS Protected        │
                                             ▼
                             ┌─────────────────────────────────┐
                             │       FastAPI Python API        │
                             │   (Vercel Python Serverless)    │
                             └───────────────┬─────────────────┘
                                             │
                        SQLAlchemy 2.0       │  DATABASE_URL (SSL)
                        Connection Pool      │
                                             ▼
                             ┌─────────────────────────────────┐
                             │      Hosted PostgreSQL DB       │
                             │      (Neon / Supabase)          │
                             └─────────────────────────────────┘
```

### Key Architectural Standards
1. **Independently Deployable**: The frontend and backend live in separate directories (`frontend/` and `backend/`) within the same repository and deploy as two independent Vercel projects.
2. **Serverless Compatible**: The backend exports `app = FastAPI(...)` from `backend/main.py`. It requires no permanent Uvicorn daemon, executes within serverless memory/time limits, and does not store uploaded images on local disk.
3. **Database Integrity**: All collection requests, waste guide entries, and status changes persist in PostgreSQL in production (with a safe local SQLite fallback for offline local development).
4. **Honest Metrics**: Analytics and completion rates are calculated directly from SQL queries against real database records—never fabricated.
5. **Privacy First**: Sensitive requester phone numbers and email addresses are restricted to authorized admins/partners and are strictly omitted from public tracking endpoints.

---

## 2. Technology Stack

### Frontend (`frontend/`)
- **Framework**: React 19 + Vite (TypeScript)
- **Styling**: Tailwind CSS (custom forest green, warm ivory, soft sage palette)
- **Routing**: React Router v7 with SPA rewrites (`vercel.json`)
- **Icons**: Lucide React
- **QR Codes**: `qrcode.react` (SVG generator for printable bin labels)
- **API Client**: Modular typed Fetch service with graceful error handling

### Backend (`backend/`)
- **Language**: Python 3.11+ (tested on Python 3.13)
- **Framework**: FastAPI + Starlette
- **Data Validation**: Pydantic v2 + Pydantic-Settings
- **ORM**: SQLAlchemy 2.0
- **Database Driver**: `psycopg2-binary` (PostgreSQL) + SQLite (dev only)
- **Testing**: Pytest + HTTPX TestClient

---

## 3. Directory Structure

```
EcoSort/
├── .gitignore                      # Git ignore rules for Node, Python, SQLite, environment files
├── README.md                       # Comprehensive project & deployment documentation
├── frontend/                       # Vercel Project 1 (Root Directory: frontend)
│   ├── .env.example                # Example frontend environment variables
│   ├── index.html                  # HTML entrypoint with Plus Jakarta Sans typography
│   ├── package.json                # Frontend dependencies & build scripts
│   ├── postcss.config.js           # PostCSS configuration for Tailwind
│   ├── tailwind.config.js          # Custom EcoSort color palette & font configuration
│   ├── tsconfig.json               # TypeScript base configuration
│   ├── tsconfig.app.json           # TypeScript app compiler settings
│   ├── vercel.json                 # SPA URL rewrite to index.html
│   ├── vite.config.ts              # Vite build configuration
│   └── src/
│       ├── App.tsx                 # Route declarations & app wrapper
│       ├── main.tsx                # React DOM mount point
│       ├── index.css               # Tailwind directives & print media rules
│       ├── types/
│       │   └── index.ts            # Shared TypeScript interfaces (WasteItem, CollectionRequest, etc.)
│       ├── services/
│       │   └── api.ts              # Unified API client reading VITE_API_BASE_URL
│       ├── components/
│       │   ├── Navbar.tsx          # Responsive navigation bar with mobile drawer & API health dot
│       │   ├── Footer.tsx          # Footer with Project info & Privacy Notice modals
│       │   ├── StatusBadge.tsx     # Color-coded status badge (Pending, Accepted, Scheduled, Collected)
│       │   ├── CategoryBadge.tsx   # Category badge for 6 waste classifications
│       │   ├── LoadingSpinner.tsx  # Accessible loading state
│       │   └── EmptyState.tsx      # Clean empty state with action callbacks
│       └── pages/
│           ├── LandingPage.tsx     # Hero, How It Works, Features, Benefits, CTA
│           ├── DashboardPage.tsx   # User activity dashboard with live metrics & daily tips
│           ├── WasteGuidePage.tsx  # Searchable & category-filtered waste directory
│           ├── IdentificationPage.tsx # Image upload & manual catalog identification
│           ├── RecyclingInfoPage.tsx  # Educational guide for 8 material streams
│           ├── CollectionRequestPage.tsx # Pickup request form with client/server validation
│           ├── RequestTrackingPage.tsx   # Non-guessable tracking code status view
│           ├── QRCodeGeneratorPage.tsx   # Campus bin QR code generator & printable labels
│           ├── AdminDashboardPage.tsx    # Administrative request & catalog management
│           └── PartnerDashboardPage.tsx  # Collection aggregator queue & status updater
└── backend/                        # Vercel Project 2 (Root Directory: backend)
    ├── .env.example                # Example backend environment variables
    ├── main.py                     # Root FastAPI entrypoint exporting `app`
    ├── requirements.txt            # Lightweight Python dependencies
    ├── seed.py                     # Standalone CLI database initialization & seed script
    ├── vercel.json                 # Serverless function rewrite to main.py
    ├── app/
    │   ├── __init__.py
    │   ├── config.py               # Settings, environment parser, DATABASE_URL normalizer
    │   ├── database.py             # SQLAlchemy engine & session dependency
    │   ├── models.py               # WasteItem, CollectionRequest, WasteIdentificationLog models
    │   ├── schemas.py              # Pydantic request/response schemas (public vs admin views)
    │   ├── security.py             # Tracking code generator & admin/partner token verification
    │   ├── seed_data.py            # Idempotent seed catalog with 15 verified waste items
    │   ├── routers/
    │   │   ├── health.py           # GET /api/health
    │   │   ├── waste_items.py      # CRUD & search for waste catalog
    │   │   ├── identification.py   # POST /api/identify
    │   │   ├── collection_requests.py # POST, GET, PATCH, cancel for requests
    │   │   ├── dashboard.py        # Live statistics & daily segregation tips
    │   │   ├── admin.py            # Admin overview & privileged request listing
    │   │   └── partners.py         # Partner queue, accept, schedule, complete actions
    │   └── services/
    │       ├── analytics_service.py # Real-time SQL aggregation service
    │       ├── qr_service.py        # Bin target URL generator
    │       └── waste_classifier.py  # Modular classifier & file validator
    └── tests/
        ├── __init__.py
        ├── test_health.py          # Pytest health & root route assertions
        ├── test_waste_items.py     # Pytest catalog query & search assertions
        └── test_collection_requests.py # Pytest validation, lifecycle & cancellation tests
```

---

## 4. Local Development on Windows

### Prerequisites
- Node.js v18+ (tested on v24)
- Python 3.10+ (tested on Python 3.13)
- PowerShell (standard on Windows 10/11)

---

### Step 1: Backend Setup

Open a PowerShell terminal and navigate to `backend`:

```powershell
# 1. Change to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv .venv

# 3. Activate virtual environment
.\.venv\Scripts\Activate.ps1

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create local environment file
Copy-Item .env.example .env

# 6. Initialize database and seed initial waste items
python seed.py

# 7. Start development server
uvicorn main:app --reload --port 8000
```

> **Note**: If `DATABASE_URL` is omitted from `.env` in development, the application automatically uses a local SQLite database (`sqlite:///./ecosort_dev.db`) with an explicit development warning.

- **Backend API**: `http://localhost:8000`
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`
- **Health Endpoint**: `http://localhost:8000/api/health`

---

### Step 2: Frontend Setup

Open a **separate** PowerShell terminal and navigate to `frontend`:

```powershell
# 1. Change to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create local environment file
Copy-Item .env.example .env

# 4. Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`

---

### Step 3: Run Backend Automated Tests

In your backend terminal with the virtual environment activated:

```powershell
pytest -v
```

All 10 tests will execute against FastAPI endpoints (health check, search, input validation, request code generation, status lifecycle, and cancellation restrictions).

---

## 5. Hosted PostgreSQL Database Setup

For production on Vercel, a hosted PostgreSQL database is required. **Neon** or **Supabase** are recommended.

### Setting up with Neon (Free & Serverless)
1. Visit [neon.tech](https://neon.tech) and create a free account.
2. Create a new project named `ecosort`.
3. In the Neon Console dashboard, copy the connection string. Select **Connection pooling** for optimal serverless performance.
4. Format:
   ```
   postgresql://[user]:[password]@[endpoint]-pooler.[region].neon.tech/ecosort?sslmode=require
   ```

### Initializing Tables on Neon / Supabase
Run the seed script from your local machine with the remote connection string:

```powershell
$env:DATABASE_URL="your-neon-postgresql-connection-string"
python seed.py
```
This idempotently creates the `waste_items`, `collection_requests`, and `waste_identification_logs` tables and seeds 15 verified items.

---

## 6. GitHub & Vercel Deployment Guide

Deploying EcoSort involves importing the **same GitHub repository** into **two separate Vercel projects**.

---

### Part A: Deploy the Backend API Project

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/dashboard), click **Add New...** → **Project**.
3. Select your repository and click **Import**.
4. Configure the project:
   - **Project Name**: `ecosort-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: Click `Edit` and select `backend`.
5. Under **Environment Variables**, add:
   - `APP_ENV`: `production`
   - `DATABASE_URL`: Your hosted PostgreSQL connection string (from Neon or Supabase).
   - `FRONTEND_ORIGIN`: `https://ecosort-frontend.vercel.app` (or temporary `*`, update after deploying frontend).
   - `ADMIN_SECRET_KEY`: A secure random string (e.g. `prod-admin-key-7f9a2e8c`).
   - `ALLOW_DEMO_ADMIN`: `False` (for strict token enforcement in production).
6. Click **Deploy**.
7. Once deployed, test your API:
   - `https://ecosort-backend.vercel.app/api/health` → Returns `{"status": "ok", ...}`
   - `https://ecosort-backend.vercel.app/api/waste-items` → Returns JSON catalog.
8. Copy your backend domain: `https://ecosort-backend.vercel.app`.

---

### Part B: Deploy the Frontend Application Project

1. In the Vercel Dashboard, click **Add New...** → **Project**.
2. Select the **same** GitHub repository and click **Import**.
3. Configure the project:
   - **Project Name**: `ecosort-frontend`
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: Click `Edit` and select `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://ecosort-backend.vercel.app` (the URL from Part A).
   - `VITE_APP_URL`: `https://ecosort-frontend.vercel.app` (used for generating valid production QR codes).
5. Click **Deploy**.
6. Once deployed, open `https://ecosort-frontend.vercel.app`.

---

### Part C: Connect CORS & Finalize

1. Go back to your `ecosort-backend` project in Vercel.
2. Go to **Settings** → **Environment Variables**.
3. Update `FRONTEND_ORIGIN` to your exact frontend Vercel URL: `https://ecosort-frontend.vercel.app`.
4. Trigger a redeployment of `ecosort-backend` (**Deployments** → **Redeploy**) so the new environment variable takes effect.
5. Your full-stack EcoSort platform is now live!

---

## 7. Environment Variables Reference

### Frontend Variables (`frontend/.env`)
| Variable | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend | `http://localhost:8000` | `https://ecosort-backend.vercel.app` |
| `VITE_APP_URL` | Public frontend URL for QR codes | `http://localhost:5173` | `https://ecosort-frontend.vercel.app` |

### Backend Variables (`backend/.env`)
| Variable | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `APP_ENV` | Application environment mode | `development` | `production` |
| `DATABASE_URL` | PostgreSQL connection string | *(empty for local SQLite)* | `postgresql://user:pass@ep-xyz.neon.tech/ecosort?sslmode=require` |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:5173` | `https://ecosort-frontend.vercel.app` |
| `ADMIN_SECRET_KEY`| Secret key for admin APIs | `dev-admin-secret` | `secure-random-token-here` |
| `ALLOW_DEMO_ADMIN`| Allow prototype access in dev | `True` | `False` |

---

## 8. Real Functionality vs. Prototype Scope

To uphold academic integrity and transparency, EcoSort clearly delineates real capabilities from simulated services:

| Feature | Implementation Reality | Notes |
|---|---|---|
| **Waste Guide Search** | **Real & Persistent** | Backed by PostgreSQL full database queries with category filters and pagination. |
| **Collection Requests** | **Real & Persistent** | Saves to PostgreSQL, validates dates & quantities, and generates unique non-guessable codes (`ECO-YYYY-XXXXXX`). |
| **Request Tracking** | **Real & Secure** | Real-time status lookup by tracking code. Private contact information is stripped from public responses. |
| **QR Code Bin Generator** | **Real & Printable** | Generates SVG QR codes resolving to the public application domain with print-ready CSS styles. |
| **Admin & Partner Portals** | **Real State Machine** | Real database updates (Pending → Accepted → Scheduled → Collected). Notes are recorded and visible on tracking pages. |
| **Analytics & Metrics** | **Real Data Only** | Aggregate counts and percentages computed from database records. No fabricated carbon or landfill diversion numbers. |
| **Image Waste Classifier** | **Demo / Catalog Mode** | Clearly labeled as Demo Mode. Processes images in-memory without saving to disk. Does not fabricate artificial AI confidence scores. |
| **Commercial Haulers** | **Simulated Prototype** | Clearly disclaims that submission does not guarantee immediate municipal pickup unless a partner is assigned. |

---

## 9. Verification & Quality Assurance Results

- **Frontend TypeScript Build**: Built successfully via `tsc -b && vite build` (zero errors, output in `frontend/dist`).
- **Backend Automated Tests**: 10 tests passed via `pytest` (health, search, validation, lifecycle, and cancellation).
- **Serverless Compatibility**: Verified entrypoint `backend/main.py` exporting `app = FastAPI(...)`.
- **CORS Handling**: Dynamic origin resolution for deployed Vercel domains.
- **SPA Routing**: Verified `vercel.json` rewrites for deep route refreshes (`/guide`, `/track`, `/dashboard`).

---

## 10. License

Developed as an academic entrepreneurship project. Free to use for educational and research purposes.
