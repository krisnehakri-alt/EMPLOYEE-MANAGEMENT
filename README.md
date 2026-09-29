# StaffPulse - Enterprise Employee Management System

A **fully working full-stack** Employee Management System — React.js frontend + Express.js REST API backend — with JWT authentication, complete CRUD, live search & filtering, toast notifications, form validation, and a real JSON-file database.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────┐     ┌──────────────────────────────────┐
│   FRONTEND (React + Tailwind)   │────▶│  BACKEND (Express REST API)      │
│   http://localhost:5173         │     │  http://localhost:5000/api        │
│                                 │     │                                  │
│  ✔ JWT Login Page               │     │  POST  /api/auth/login           │
│  ✔ Protected Dashboard          │     │  GET   /api/employees            │
│  ✔ Employee Table (search+sort) │     │  GET   /api/employees/:id        │
│  ✔ Add / Edit / Delete Forms    │     │  POST  /api/employees            │
│  ✔ Employee Profile Card        │     │  PUT   /api/employees/:id        │
│  ✔ Toast Notifications          │     │  DELETE /api/employees/:id       │
│  ✔ Responsive (mobile sidebar)  │     │  GET   /api/health               │
└─────────────────────────────────┘     └──────────────────────────────────┘
         ▲  Vite proxy /api/* → Express backend
```

---

## 🚀 Quick Start (Full Stack)

### Prerequisites
- **Node.js** v18 or later

### Step 1 — Install All Dependencies
```bash
npm install
```

### Step 2 — Start the Express REST API Backend
```bash
npm run server
```
The backend starts at **http://localhost:5000**

### Step 3 — Start the React Frontend Dev Server
Open a **second terminal** in the same folder:
```bash
npm run dev
```
The frontend starts at **http://localhost:5173**

> The Vite dev server proxies all `/api/*` requests to Express on port 5000 automatically — no extra CORS configuration needed.

### Step 4 — Open in Browser
Navigate to **http://localhost:5173**

### Demo Login Credentials
| Field | Value |
|---|---|
| Email | `admin@staffpulse.com` |
| Password | `admin123` |

> A 1-click **"Autofill"** button is available on the login screen.

---

## 📁 Project Structure

```
EMPLOYEE MANAGEMENT/
├── server/                     ← Express REST API backend
│   ├── index.js                  Main server entrypoint
│   ├── data/
│   │   └── employees.json        JSON file database (persists all CRUD)
│   ├── middleware/
│   │   └── auth.js               JWT authentication middleware
│   └── routes/
│       ├── auth.js               POST /api/auth/login
│       └── employees.js          GET/POST/PUT/DELETE /api/employees
│
├── src/                        ← React frontend
│   ├── components/
│   │   ├── ConfirmationModal.jsx   Delete confirmation dialog
│   │   ├── EmployeeCard.jsx        Employee details card
│   │   ├── EmployeeForm.jsx        Add & Edit form with validation
│   │   ├── EmployeeTable.jsx       Corporate data table with actions
│   │   ├── LoadingSpinner.jsx      Spinners & table skeleton loaders
│   │   ├── Navbar.jsx              Top header bar
│   │   ├── Pagination.jsx          Page navigation controls
│   │   ├── ProtectedRoute.jsx      Route authentication guard
│   │   ├── Sidebar.jsx             Navigation sidebar (mobile-aware)
│   │   └── StatsCard.jsx           Dashboard metric cards
│   ├── context/
│   │   ├── AuthContext.jsx         Authentication state & JWT management
│   │   └── ToastContext.jsx        Toast notification system
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useEmployees.js         Data fetching, search, filter, pagination
│   │   └── useToast.js
│   ├── layouts/
│   │   └── DashboardLayout.jsx     App shell (Sidebar + Navbar + page outlet)
│   ├── pages/
│   │   ├── Login.jsx               JWT login page
│   │   ├── Dashboard.jsx           Admin overview dashboard
│   │   ├── Employees.jsx           Directory with search & filters
│   │   ├── AddEmployee.jsx         Create employee form
│   │   ├── EditEmployee.jsx        Edit employee form (prefilled)
│   │   ├── EmployeeDetails.jsx     Single employee profile
│   │   ├── Profile.jsx             Admin profile & settings
│   │   └── NotFound.jsx            404 page
│   ├── routes/
│   │   └── AppRoutes.jsx           React Router route definitions
│   ├── services/
│   │   ├── api.js                  Axios instance (token interceptors)
│   │   ├── authService.js          Login/logout/token storage
│   │   ├── employeeService.js      REST CRUD service functions
│   │   ├── mockData.js             Seed data for offline mock mode
│   │   └── mockServer.js           Offline mock REST engine (localStorage)
│   └── utils/
│       ├── formatters.js           Currency, date, badge formatting
│       └── validators.js           Form validation functions
│
├── .env                        ← Environment configuration
├── .env.example                ← Example environment configuration
├── vite.config.js              ← Vite + API proxy config
├── tailwind.config.js          ← Tailwind CSS config
├── test-suite.mjs              ← Mock server unit tests (npm test)
├── test-live-api.mjs           ← Live API integration tests (npm run test:live)
└── package.json
```

---

## 🔌 REST API Reference

All endpoints are served at `http://localhost:5000/api`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/login` | Authenticate and get JWT token | ❌ |
| `GET` | `/health` | Server health check | ❌ |
| `GET` | `/employees` | List all employees (supports `?search=`, `?department=`, `?status=`) | ❌ |
| `GET` | `/employees/:id` | Get single employee details | ❌ |
| `POST` | `/employees` | Create a new employee | ❌ |
| `PUT` | `/employees/:id` | Update employee details | ❌ |
| `DELETE` | `/employees/:id` | Delete an employee | ❌ |

### Login Request/Response
```json
// POST /api/auth/login
// Body:
{ "email": "admin@staffpulse.com", "password": "admin123" }

// Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "USR-ADMIN-01", "name": "Sarah Connor", "email": "...", "role": "HR Administrator" },
  "message": "Authentication successful"
}
```

### Employee Object Shape
```json
{
  "id": "EMP-1001",
  "name": "Alexander Mitchell",
  "email": "alex.mitchell@staffpulse.com",
  "mobile": "+1 (555) 234-8901",
  "department": "Engineering",
  "designation": "Principal Systems Architect",
  "joiningDate": "2021-03-15",
  "salary": 145000,
  "status": "Active",
  "avatar": "https://..."
}
```

---

## ⚙️ Environment Configuration (`.env`)

```env
# REST API Base URL (Vite proxies /api → http://localhost:5000)
VITE_API_BASE_URL=/api

# Set to 'false' for LIVE backend (default)
# Set to 'true' for offline mock engine (no backend needed)
VITE_USE_MOCK_API=false
```

---

## 🧪 Testing

### Mock Server Unit Tests (offline, no backend needed)
```bash
npm test
```
**Result**: 24 passed, 0 failed

### Live REST API Integration Tests (requires `npm run server` running)
```bash
npm run test:live
```
**Result**: 41 passed, 0 failed ✅

---

## 🎛️ Dual-Mode Architecture

The project runs in two modes, switchable via `.env`:

| Mode | `.env` Setting | Description |
|---|---|---|
| **Live API** (default) | `VITE_USE_MOCK_API=false` | Full-stack: React → Axios → Express → JSON file |
| **Mock API** | `VITE_USE_MOCK_API=true` | Frontend-only: React → Axios → localStorage engine |

This allows developing the frontend in isolation and then seamlessly switching to the live backend.

---

## 🏭 Production Build

```bash
npm run build
```
Static assets in `dist/` can be served by Nginx, Vercel, Netlify, or any CDN.

The Express API server should be hosted separately (e.g., Heroku, Railway, Render, EC2).
