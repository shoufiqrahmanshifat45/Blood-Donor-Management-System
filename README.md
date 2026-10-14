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

## 👨‍💻 Author

**Shoufiq Rahman Shifat**
- Admin & Lead Developer

---

## 📄 License

This project is licensed under the MIT License - feel free to use and adapt it for your healthcare and donation management initiatives.
