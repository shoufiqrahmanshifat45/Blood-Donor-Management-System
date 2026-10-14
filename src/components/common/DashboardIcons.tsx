import React from 'react';

/**
 * Pixel-perfect SVG Icons matching the reference dashboard mockup.
 */

// 1. Blood Donor Management System Brand Logo (Heart with 2 drops and medical cross)
export const BloodDonorBrandLogo: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    {/* Vibrant Red Heart */}
    <path
      d="M18 31.2 C17.3 30.7 4.5 22.8 2.3 15.5 C0.2 8.7 4.8 3.5 11.2 3.5 C15 3.5 17 5.5 18 7 C19 5.5 21 3.5 24.8 3.5 C31.2 3.5 35.8 8.7 33.7 15.5 C31.5 22.8 18.7 30.7 18 31.2 Z"
      fill="#ef4444"
    />
    {/* Right white droplet accent */}
    <path
      d="M20.5 9.5 C20.5 9.5 25.5 13.5 25.5 18 C25.5 21.5 23 24 20 24.5 C22.5 23 24 20.5 24 18 C24 14.5 20.5 11 20.5 9.5 Z"
      fill="white"
      opacity="0.95"
    />
    {/* Left white droplet */}
    <path
      d="M15 8 C15 8 9 14.5 9 19 C9 22.5 11.7 25 15 25 C18.3 25 21 22.5 21 19 C21 14.5 15 8 15 8 Z"
      fill="white"
    />
    {/* Red medical cross inside left droplet */}
    <path
      d="M15 14 V21 M11.5 17.5 H18.5"
      stroke="#ef4444"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

// 2. Dashboard Nav Icon (Solid house with outer triangular roof overhang line & arched doorway)
export const DashboardNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Overhang roofline */}
    <path
      d="M3 10.5 L12 3 L21 10.5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Solid house body with arched door */}
    <path
      d="M5.5 9.8 L12 4.2 L18.5 9.8 V19 C18.5 19.8 17.8 20.5 17 20.5 H14 V14.5 C14 13.4 13.1 12.5 12 12.5 C10.9 12.5 10 13.4 10 14.5 V20.5 H7 C6.2 20.5 5.5 19.8 5.5 19 V9.8 Z"
      fill="currentColor"
    />
  </svg>
);

// 3. Donors Nav Icon (Solid user silhouette)
export const DonorsNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="7" r="3.8" fill="currentColor" />
    <path
      d="M4.5 19.5 C4.5 15.5 8 13 12 13 C16 13 19.5 15.5 19.5 19.5 C19.5 20.3 18.8 21 18 21 H6 C5.2 21 4.5 20.3 4.5 19.5 Z"
      fill="currentColor"
    />
  </svg>
);

// 4. Blood Requests Nav Icon (3D Isometric Box/Package)
export const BloodRequestsNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    {/* Top face */}
    <path d="M12 2.5 L20.5 7 L12 11.5 L3.5 7 Z" fill="currentColor" opacity="0.95" />
    {/* Left face */}
    <path d="M3.5 7.5 L11.5 11.8 V21 L3.5 16.5 Z" fill="currentColor" opacity="0.8" />
    {/* Right face */}
    <path d="M20.5 7.5 L12.5 11.8 V21 L20.5 16.5 Z" fill="currentColor" opacity="0.65" />
    {/* Seam lines */}
    <path d="M12 2.5 L12 11.5 M3.5 7 L12 11.5 L20.5 7" stroke="#0c1527" strokeWidth="0.8" />
  </svg>
);

// 5. Blood Stock Nav Icon (Solid Droplet)
export const BloodStockNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2.5 C12 2.5 5 10.5 5 15.5 C5 19.64 8.13 23 12 23 C15.87 23 19 19.64 19 15.5 C19 10.5 12 2.5 12 2.5 Z"
      fill="currentColor"
    />
    <path
      d="M9 14 C8.6 15.5 9.2 17.2 10.2 18"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// 6. Appointments Nav Icon (Calendar with top spiral rings and checkmark)
export const AppointmentsNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3.5" y="5.5" width="17" height="15.5" rx="2.5" fill="currentColor" />
    <line x1="3.5" y1="10" x2="20.5" y2="10" stroke="#0c1527" strokeWidth="1.5" />
    <rect x="7" y="2" width="2" height="5" rx="1" fill="currentColor" stroke="#0c1527" strokeWidth="0.75" />
    <rect x="15" y="2" width="2" height="5" rx="1" fill="currentColor" stroke="#0c1527" strokeWidth="0.75" />
    <path d="M8 14.5 L10.5 17 L16 12" stroke="#0c1527" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 7. Reports Nav Icon (3 Vertical Bars)
export const ReportsNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="13" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="10" y="6" width="4" height="15" rx="1" fill="currentColor" />
    <rect x="16" y="9" width="4" height="12" rx="1" fill="currentColor" />
  </svg>
);

// 8. Tools Nav Icon (Crossed Wrench and Screwdriver)
export const ToolsNavIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M4 20l4-4" />
    <path d="M14 4l6 6" />
  </svg>
);

// 9. Total Donors Stat Card Icon (Red squircle with solid white donor silhouette & megaphone)
export const TotalDonorsStatIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className}>
    {/* Head */}
    <circle cx="12.5" cy="7.8" r="3.8" fill="white" />
    {/* Torso */}
    <path d="M5 21.2 C5 16.5 8.2 13.5 12.5 13.5 C16.8 13.5 20 16.5 20 21.2 H5 Z" fill="white" />
    {/* Center chest dot cutout */}
    <circle cx="12.5" cy="17.8" r="1.35" fill="#ef4444" />
    {/* Megaphone on right */}
    <path d="M16 11.5 L21 9 V14.5 L16 12 Z" fill="white" />
    <path d="M21 9 C22 9 22.8 10.2 22.8 11.75 C22.8 13.3 22 14.5 21 14.5" fill="white" stroke="white" strokeWidth="0.8" />
  </svg>
);

// 10. Total Donations Stat Card Icon (Solid white blood droplet with specular crescent cutout)
export const TotalDonationsStatIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className}>
    <path
      d="M14 3 C14 3 6.5 12 6.5 17.5 C6.5 22.2 10 25.5 14 25.5 C18 25.5 21.5 22.2 21.5 17.5 C21.5 12 14 3 14 3 Z"
      fill="white"
    />
    <path
      d="M10 16.5 C10.2 18.8 11.8 20.5 13.8 21.2"
      stroke="#ef4444"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// 11. Blood Requests Stat Card Icon (White document with fold & 3 horizontal lines)
export const BloodRequestsStatIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className}>
    <path
      d="M7 4.5 C7 3.7 7.7 3 8.5 3 H16.5 L21 7.5 V23.5 C21 24.3 20.3 25 19.5 25 H8.5 C7.7 25 7 24.3 7 23.5 V4.5 Z"
      stroke="white"
      strokeWidth="2.4"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M16 3 V8 H21" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
    <line x1="10.5" y1="12.5" x2="13.5" y2="12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="10.5" y1="16.5" x2="17.5" y2="16.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    <line x1="10.5" y1="20.5" x2="17.5" y2="20.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 12. Available Units Stat Card Icon (Solid white droplet with two leaf/seed cutouts)
export const AvailableUnitsStatIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className}>
    <path
      d="M14 3 C14 3 6.5 12 6.5 17.5 C6.5 22.2 10 25.5 14 25.5 C18 25.5 21.5 22.2 21.5 17.5 C21.5 12 14 3 14 3 Z"
      fill="white"
    />
    <path
      d="M11.5 17 C11.5 19 13 20.5 14 21 C13.5 19.5 13 18 11.5 17 Z"
      fill="#10b981"
    />
    <path
      d="M16.5 17 C16.5 19 15 20.5 14 21 C14.5 19.5 15 18 16.5 17 Z"
      fill="#10b981"
    />
  </svg>
);

// 13. Give Blood Save Lives Section Component (Bottom of Sidebar)
export const GiveBloodSaveLivesWidget: React.FC = () => (
  <div className="px-3 py-4 mt-auto border-t border-[#16223d] relative overflow-hidden bg-gradient-to-b from-transparent to-[#080e1c] select-none">
    <div className="flex flex-col items-center justify-center text-center">
      {/* Glossy Red Droplet with Center Medical Cross + White ECG Wave behind it */}
      <div className="relative mb-1 flex items-center justify-center w-[100px] h-[75px]">
        {/* White ECG trace coming out from behind the right side of the drop */}
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-8 text-slate-200 stroke-current fill-none pointer-events-none opacity-90"
          viewBox="0 0 44 34"
        >
          <path
            d="M0 17 L5 17 L8 21 L12 3 L16 31 L20 11 L23 19 L26 17 L40 17"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Glossy Red Droplet */}
        <div className="relative z-10 w-11 h-14 flex items-center justify-center filter drop-shadow-[0_2px_10px_rgba(239,68,68,0.45)]">
          <svg viewBox="0 0 36 46" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="giveBloodDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="35%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            {/* Main Drop */}
            <path
              d="M18 2 C18 2 4 18 4 29 C4 38 10.3 44 18 44 C25.7 44 32 38 32 29 C32 18 18 2 18 2 Z"
              fill="url(#giveBloodDropGrad)"
            />
            {/* White crescent shine along bottom-left curve */}
            <path
              d="M7.8 24 C6.8 28 8.8 34.5 12.8 38 C14.5 39.5 16 40.5 18 41 C15.5 40 13.5 38 11.5 35 C9.5 31.5 8.5 27 8.8 24 Z"
              fill="white"
              opacity="0.85"
            />
            {/* Bold White Medical Cross in Center */}
            <path
              d="M18 18 V34 M10 26 H26"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Script typography matching screenshot: Give Blood / Save lives (lowercase l) */}
      <div className="font-script leading-tight select-none mb-1">
        <div
          className="text-white text-[22px] font-normal tracking-wide drop-shadow-sm"
          style={{ fontFamily: "'Satisfy', cursive" }}
        >
          Give Blood
        </div>
        <div
          className="text-white text-[21px] font-normal tracking-wide drop-shadow-sm -mt-0.5"
          style={{ fontFamily: "'Satisfy', cursive" }}
        >
          Save lives
        </div>
      </div>

      {/* Red ECG Waveform Line extending across the bottom */}
      <div className="w-full mt-0.5 flex items-center justify-center">
        <svg className="w-full h-8 text-red-500 stroke-current fill-none" viewBox="0 0 200 36">
          <path
            d="M5 18 L24 18 L27 22 L32 4 L37 34 L42 12 L46 20 L50 18 L65 18 C85 16, 105 20, 125 18 C145 16, 165 20, 185 18 L200 18"
            stroke="#ef4444"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
);

// 14. Search Blood Group Section Header Logo (Standalone red drop with white circle & red cross)
export const SearchBloodGroupHeaderLogo: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 28" fill="none" className={className}>
    <path
      d="M12 2 C12 2 3.5 11.5 3.5 17.5 C3.5 22.2 7.3 26 12 26 C16.7 26 20.5 22.2 20.5 17.5 C20.5 11.5 12 2 12 2 Z"
      fill="#ef4444"
    />
    <circle cx="12" cy="18" r="4.8" fill="white" />
    <path d="M12 15.5 V20.5 M9.5 18 H14.5" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 15. Add New Donor Action Icon (Quick Actions - Thicker, Bolder Solid Red Person with Solid Red Plus)
export const AddNewDonorActionIcon: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className}>
    {/* Thick solid head circle */}
    <circle cx="12" cy="7.2" r="5" fill="#ef4444" />
    {/* Short thick neck */}
    <rect x="10.2" y="11.5" width="3.6" height="2.2" rx="0.5" fill="#ef4444" />
    {/* Broad, thick rounded shoulders / torso */}
    <path
      d="M3 23 C3 17.5 7 13.5 12 13.5 C17 13.5 21 17.5 21 23 Z"
      fill="#ef4444"
    />
    {/* Thick, bold red plus sign beside head */}
    <path
      d="M22.5 8 V14.5 M19.2 11.25 H25.8"
      stroke="#ef4444"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// 16. Register Blood Request Action Icon (Quick Actions - Solid Vibrant Blue Droplet with Highlight)
export const RegisterBloodRequestActionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2 C12 2 4.5 10.5 4.5 16 C4.5 20.1 7.9 23.5 12 23.5 C16.1 23.5 19.5 20.1 19.5 16 C19.5 10.5 12 2 12 2 Z"
      fill="#2563eb"
    />
    <path
      d="M8 15.5 C8.2 17.5 9.5 19 11.2 19.8"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.95"
    />
  </svg>
);

// 17. Book Appointment Action Icon (Quick Actions - Emerald Green Calendar with Wire Rings & 6 Dots)
export const BookAppointmentActionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="7" y="2" width="2" height="4" rx="1" fill="#10b981" />
    <rect x="15" y="2" width="2" height="4" rx="1" fill="#10b981" />
    <rect x="4" y="5" width="16" height="16" rx="3" stroke="#10b981" strokeWidth="2.2" fill="none" />
    <line x1="4" y1="10" x2="20" y2="10" stroke="#10b981" strokeWidth="2.2" />
    <circle cx="8" cy="13.5" r="1.2" fill="#10b981" />
    <circle cx="12" cy="13.5" r="1.2" fill="#10b981" />
    <circle cx="16" cy="13.5" r="1.2" fill="#10b981" />
    <circle cx="8" cy="17.5" r="1.2" fill="#10b981" />
    <circle cx="12" cy="17.5" r="1.2" fill="#10b981" />
    <circle cx="16" cy="17.5" r="1.2" fill="#10b981" />
  </svg>
);

// 18. View Reports Action Icon (Quick Actions - Purple Trending Line Chart with Axes & Peak Arrow)
export const ViewReportsActionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 4 V20 H20" stroke="#a855f7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M7 16 L11 12 L14 15 L19 8"
      stroke="#a855f7"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15.5 8 H19 V11.5" stroke="#a855f7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Search Blood Group Action Icon (Quick Actions - Blue Magnifying Glass)
export const SearchBloodGroupActionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="6.5" stroke="#2563eb" strokeWidth="2.6" />
    <path d="M16 16 L21 21" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// BMI Calculator Action Icon (Quick Actions - Slate Calculator)
export const BmiCalculatorActionIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="5" y="3" width="14" height="18" rx="2.5" stroke="#475569" strokeWidth="2.2" />
    <rect x="8" y="6" width="8" height="3" rx="0.8" fill="#475569" />
    <circle cx="8.5" cy="12.5" r="1" fill="#475569" />
    <circle cx="12" cy="12.5" r="1" fill="#475569" />
    <circle cx="15.5" cy="12.5" r="1" fill="#475569" />
    <circle cx="8.5" cy="16" r="1" fill="#475569" />
    <circle cx="12" cy="16" r="1" fill="#475569" />
    <circle cx="15.5" cy="16" r="1" fill="#475569" />
  </svg>
);
