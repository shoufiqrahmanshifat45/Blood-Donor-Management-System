import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export const RealTimeClock: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every second for a real, live ticking clock
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Date: e.g. "Thursday, 15 Oct 2026"
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Format Time: e.g. "03:58:12 AM"
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200/70 dark:border-slate-800 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors select-none ${className}`}
      title={`Current real-time system clock: ${formattedDate} ${formattedTime}`}
    >
      {/* Date Section */}
      <div className="inline-flex items-center gap-1.5">
        <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
        <span className="font-semibold text-slate-700 dark:text-slate-200">{formattedDate}</span>
      </div>

      {/* Divider */}
      <span className="text-slate-300 dark:text-slate-700 select-none">•</span>

      {/* Time Section with pulsing second indicator */}
      <div className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-semibold text-[#ef4444] dark:text-red-400">
        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
        <span>{formattedTime}</span>
      </div>
    </div>
  );
};
