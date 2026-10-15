# 🩸 Blood Donor Management System

A modern, responsive, and feature-rich **Blood Donor Management System Dashboard** built with **React**, **TypeScript**, **Tailwind CSS**, **Vite**, and **Recharts**. Designed for healthcare administrators, blood banks, and donors to streamline blood donation workflows, inventory tracking, appointment bookings, and urgent blood request fulfillment.

---

## 🌟 Key Features

### 📊 Comprehensive Analytics Dashboard
- **Key Metric Stat Cards**:
  - **Total Donors** (1,248) with monthly growth trends (+12%).
  - **Total Donations** (892) with tracking metrics (+8%).
  - **Blood Requests** (156) with change indicators (-5%).
  - **Available Units** (620) across all blood groups (+10%).
- **Interactive Visualizations (Recharts)**:
  - **Donors by Blood Group**: Vertical bar chart comparing distribution across A+, A-, B+, B-, AB+, AB-, O+, and O-.
  - **Gender Distribution**: Donut chart detailing donor breakdown by Male (68%), Female (30%), and Other (2%).
  - **Donor Registration Trends**: Smooth multi-series area and line chart tracking monthly registrations.
- **Real-Time Blood Stock Status**:
  - Live inventory tracking for each blood group with status indicators (`Good`, `Low`).
- **Recent Blood Requests Tracker**:
  - Real-time urgent hospital requests (Dhaka Medical College, Square Hospital, United Hospital, etc.) with badges for `Urgent`, `Pending`, and `Fulfilled`.

### 🧭 Intuitive Sidebar Navigation
- **Navigation Tabs**:
  - Dashboard
  - Donors Management
  - Blood Requests
  - Blood Stock
  - Appointments
  - Reports
  - System Settings
- **Collapsible Tools Section**:
  - Collapsed by default on entry and refresh to keep the sidebar compact.
  - Expandable with an interactive toggle for utility tools:
    - 🔍 **Search Blood Group**
    - ⚖️ **BMI Calculator**
    - 🩺 **Blood Donation Eligibility Checker**
    - 📞 **Emergency Contacts Directory**
- **Brand Identity**:
  - Custom vector brand iconography.
  - Aesthetic *"Give Blood, Save Lives"* widget with heart rate ECG pulse waveforms.

### ⚡ Quick Actions & Interactive Modals
- **Add New Donor**: Form to register donors with blood group, age, gender, and contact details.
- **Register Blood Request**: Rapid hospital blood request submission with urgency levels.
- **Book Appointment**: Schedule donation appointments with date and hospital selection.
- **View Reports**: Downloadable reports and donation summaries.
- **Search Blood Group**: Comprehensive donor lookup filtered by Blood Group, Bangladesh District, and Thana.
- **BMI Calculator**: Interactive height and weight calculator to evaluate donor eligibility.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/) & Tailored SVG Iconography
- **Typography**: Google Fonts (Inter, Dancing Script, Caveat)

---

## 📁 Project Structure

```text
blood-donor-management-system/
├── public/                 # Static assets (favicons, admin images)
├── src/
│   ├── assets/             # Component assets & portraits
│   ├── components/
│   │   ├── common/         # Custom SVG vector icons matching dashboard specs
│   │   │   └── DashboardIcons.tsx
│   │   ├── dashboard/      # Dashboard cards, charts, tables, and search
│   │   │   ├── BloodGroupSearch.tsx
│   │   │   ├── BloodStockTable.tsx
│   │   │   ├── DonorTrendChart.tsx
│   │   │   ├── DonorsByBloodGroupChart.tsx
│   │   │   ├── GenderDistributionChart.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── RecentBloodRequests.tsx
│   │   │   └── StatCards.tsx
│   │   ├── layout/         # Top Navbar and Collapsible Sidebar
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── modals/         # Interactive action modals
│   │       └── ActionModals.tsx
│   ├── data/               # Mock data & Bangladesh location registry
│   │   └── mockData.ts
│   ├── types/              # TypeScript interface definitions
│   │   └── dashboard.ts
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Global Tailwind and font styles
│   └── main.tsx            # React application entry point
├── index.html              # HTML shell & font definitions
├── package.json            # Dependencies and npm scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (version 18 or later) installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd "Blood Donor Management System"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local Vite development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/`.

### Production Build

Compile and bundle the project for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## ⚡ Backend REST API & Services

The backend is built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**, backed by a managed **Neon PostgreSQL** database. It provides centralized error handling, robust request validation using **Zod**, role-based access control (RBAC), and brute-force protection.

### 🛡️ Architecture & Security Features
- **Prisma ORM & PostgreSQL**: High-performance relational database with strict foreign keys, indexes, enums, and timestamps.
- **Role-Based Authorization (RBAC)**: Supports `SUPER_ADMIN`, `ADMIN`, `STAFF`, `HOSPITAL_COORDINATOR`, `VOLUNTEER`, and `DONOR`.
- **Record Ownership Verification**: Regular users can only update their own profiles and requests; clinical statuses and administrative actions require verified staff or administrator roles.
- **Privacy & Security Guarantee**: Password hashes and sensitive internal credentials are **never** returned in API responses.
- **Centralized Error Handling**: Uniform JSON error envelopes for domain exceptions, validation issues (`ZodError`), database constraints (`P2002`, `P2025`), and JWT verification failures.
- **Rate Limiting & Payload Guards**:
  - Global API rate limiter (`RATE_LIMIT_MAX=100` req / 15 min).
  - Strict authentication limiter (`RATE_LIMIT_AUTH_MAX=10` req / 15 min for login/register).
  - 10MB payload size limits for JSON and URL-encoded requests.
- **Zero Fake Success Responses**: Database connectivity is actively verified; operations fail transparently with appropriate 503 or 400 codes when database access is interrupted.

---

### 📡 API Endpoints Reference

All API routes are prefixed with `/api`. Authentication is passed via standard HTTP Bearer header: `Authorization: Bearer <TOKEN>`.

| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| **Health & Meta** | | | |
| `GET` | `/` | No | API service identity and available endpoint directory |
| `GET` | `/api/health` | No | System health check and PostgreSQL connectivity status |
| **Authentication & Profile** | | | |
| `POST` | `/api/auth/register` | No (Rate-limited) | Register a new user account with hashed password |
| `POST` | `/api/auth/login` | No (Rate-limited) | Authenticate user credentials and return JWT token |
| `POST` | `/api/auth/logout` | No | Terminate user session |
| `GET` | `/api/auth/me` | Yes | Get current authenticated user profile & linked donor info |
| `PATCH` | `/api/auth/profile` | Yes | Update profile name, phone, or avatar |
| `PATCH` | `/api/auth/change-password` | Yes | Update account password securely |
| **Donors Directory** | | | |
| `GET` | `/api/donors` | No | Search donors with filters (`bloodGroup`, `district`, `thana`, `search`, `page`, `limit`) |
| `GET` | `/api/donors/:id` | No | Get single donor profile with donation & appointment history |
| `POST` | `/api/donors` | Optional | Register a new blood donor (links to logged-in user if present) |
| `PATCH` | `/api/donors/:id` | Yes (Owner / Admin) | Update donor profile (clinical status restricted to Staff/Admin) |
| `PATCH` | `/api/donors/:id/availability` | Yes (Owner / Admin) | Toggle availability and emergency readiness |
| `DELETE` | `/api/donors/:id` | Yes (Admin only) | Delete donor record from database |
| **Blood Requests** | | | |
| `GET` | `/api/blood-requests` | No | List blood requisitions with urgency, hospital, and group filters |
| `GET` | `/api/blood-requests/:id` | No | Get detailed blood request information |
| `POST` | `/api/blood-requests` | Optional | Create new blood request requisition |
| `PATCH` | `/api/blood-requests/:id` | Yes (Owner / Admin) | Update blood requisition fields |
| `PATCH` | `/api/blood-requests/:id/status` | Optional / Role-aware | Update status (`Urgent`, `Pending`, `Fulfilled`, `Cancelled`) |
| `DELETE` | `/api/blood-requests/:id` | Yes (Owner / Admin) | Delete blood request record |
| **Verified Donations** | | | |
| `GET` | `/api/donations` | No | List donation verification log records |
| `GET` | `/api/donations/:id` | No | Get donation verification details |
| `POST` | `/api/donations` | Yes (Staff / Admin) | Record verified donation, auto-update blood stock & donor cooldown |
| **Appointments** | | | |
| `GET` | `/api/appointments` | No | List appointments with date and status filters |
| `GET` | `/api/appointments/:id` | No | Get appointment details |
| `POST` | `/api/appointments` | No | Schedule a blood donation appointment |
| `PATCH` | `/api/appointments/:id/status` | No | Update appointment status (`Scheduled`, `Completed`, `Cancelled`, `NoShow`) |
| `DELETE` | `/api/appointments/:id` | Yes (Admin) | Cancel and remove appointment record |
| **Blood Inventory & Dashboard** | | | |
| `GET` | `/api/blood-stock` | No | Get real-time available & reserved units for all 8 blood groups |
| `PATCH` | `/api/blood-stock/:bloodGroup` | Yes (Staff / Admin) | Adjust inventory units (+/- deltaUnits) and stock status |
| `GET` | `/api/dashboard` | No | Real-time KPI statistics, charts, and blood group distribution |
| **Notifications** | | | |
| `GET` | `/api/notifications` | Optional | Fetch system alerts and requisition notifications |
| `PATCH` | `/api/notifications/:id/read` | Optional | Mark specific notification as read |
| `POST` | `/api/notifications/mark-all-read` | Optional | Mark all user notifications as read |

---

### 🧪 Automated Testing

The backend includes a comprehensive test suite covering all essential API routes, request validation, authentication, authorization, and error envelopes.

Run backend tests:
```bash
npm --prefix server run test
```

Build backend TypeScript:
```bash
npm --prefix server run build
```

Start backend development server:
```bash
npm --prefix server run dev
```

---

## 👨‍💻 Author

**Shoufiq Rahman Shifat**
- Admin & Lead Developer

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for your healthcare and donation management initiatives.

