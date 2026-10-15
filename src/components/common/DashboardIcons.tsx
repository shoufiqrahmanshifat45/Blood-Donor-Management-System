import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import giveBloodSaveLivesDark from '../../assets/give-blood-save-lives-dark.png';
import giveBloodSaveLivesLight from '../../assets/give-blood-save-lives-light.png';

/**
 * Pixel-perfect SVG Icons matching the reference dashboard mockup.
 */

// 1. Blood Donor Management System Brand Logo (Heart with 2 drops and medical cross)
export const BloodDonorBrandLogo: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    {/* Vibrant Red Heart */}
    <path
      className="brand-heart-fill transition-colors duration-200"
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

// 13. Give Blood Save Lives Section Component (Bottom of Sidebar - Multi-Theme Vector & PNG Hybrid)
export const GiveBloodSaveLivesWidget: React.FC<{ className?: string; imgClassName?: string }> = ({
  className = "give-blood-save-lives-widget px-3 py-2.5 mt-auto border-t border-slate-100 dark:border-slate-800/80 relative overflow-hidden select-none flex flex-col items-center justify-center transition-colors",
}) => {
  const { mode, resolvedTheme, customAccent } = useTheme();

  const isCustom = mode === 'custom';
  const isLight = resolvedTheme === 'light';

  const accentColorMap: Record<string, string> = {
    crimson: '#ef4444',
    sapphire: '#2563eb',
    emerald: '#10b981',
    amethyst: '#8b5cf6',
  };

  const dropletColor = isCustom ? (accentColorMap[customAccent] || '#ef4444') : '#ef4444';
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const backLineColor = isLight
    ? '#64748b'
    : isCustom
    ? customAccent === 'sapphire'
      ? '#93c5fd'
      : customAccent === 'emerald'
      ? '#6ee7b7'
      : customAccent === 'amethyst'
      ? '#c4b5fd'
      : '#fca5a5'
    : '#94a3b8';
  const bottomPulseColor = isCustom ? (accentColorMap[customAccent] || '#ef4444') : '#ef4444';

  return (
    <div className={className}>
      <svg
        viewBox="0 0 240 160"
        className="w-full max-w-[130px] h-auto select-none pointer-events-none transition-all duration-300"
        style={isCustom ? { filter: `drop-shadow(0 0 10px var(--accent-glow))` } : undefined}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back ECG wave beside/behind droplet */}
        <path
          d="M132 62 L140 62 L144 50 L149 74 L153 58 L157 66 L161 62 L175 62"
          stroke={backLineColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />

        {/* Blood Droplet (Responsive to custom accent in custom mode, classic red in light/dark) */}
        <path
          d="M 120 18 C 120 18 97 50 97 68 A 23 23 0 0 0 143 68 C 143 50 120 18 120 18 Z"
          fill={dropletColor}
          className="transition-colors duration-300"
        />

        {/* Medical Plus Cross inside Droplet */}
        <rect x="116.5" y="55" width="7" height="22" rx="2" fill="white" />
        <rect x="109" y="62.5" width="22" height="7" rx="2" fill="white" />

        {/* Cursive Script Text "Give Blood" and "Save Lives" */}
        <text
          x="120"
          y="103"
          fill={textColor}
          fontSize="24"
          fontWeight="700"
          textAnchor="middle"
          style={{ fontFamily: "'Dancing Script', 'Satisfy', 'Caveat', cursive" }}
          className="transition-colors duration-300"
        >
          Give Blood
        </text>
        <text
          x="120"
          y="127"
          fill={textColor}
          fontSize="24"
          fontWeight="700"
          textAnchor="middle"
          style={{ fontFamily: "'Dancing Script', 'Satisfy', 'Caveat', cursive" }}
          className="transition-colors duration-300"
        >
          Save Lives
        </text>

        {/* Bottom ECG Pulse Line with QRS Complex & Waveform */}
        <path
          d="M 30 142 L 56 142 L 62 142 L 67 124 L 74 160 L 80 133 L 85 146 L 90 142 L 115 142 Q 125 138 135 142 T 155 142 T 175 142 T 195 142 L 210 142"
          stroke={bottomPulseColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
      </svg>
    </div>
  );
};

// 14. Search Blood Group Section Header Logo (Standalone red drop with white circle & red cross)
export const SearchBloodGroupHeaderLogo: React.FC<{ className?: string }> = ({ className = "w-7 h-7" }) => (
  <svg viewBox="0 0 24 28" fill="none" className={className}>
    <path
      className="search-header-drop transition-colors duration-200"
      d="M12 2 C12 2 3.5 11.5 3.5 17.5 C3.5 22.2 7.3 26 12 26 C16.7 26 20.5 22.2 20.5 17.5 C20.5 11.5 12 2 12 2 Z"
      fill="#ef4444"
    />
    <circle cx="12" cy="18" r="4.8" fill="white" />
    <path
      className="search-header-cross transition-colors duration-200"
      d="M12 15.5 V20.5 M9.5 18 H14.5"
      stroke="#ef4444"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
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
