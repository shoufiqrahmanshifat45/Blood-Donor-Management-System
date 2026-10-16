import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export interface RealTimeClockProps {
  className?: string;
  variant?: 'default' | 'compact' | 'hero' | 'minimal';
  showSeconds?: boolean;
  showDate?: boolean;
  showTime?: boolean;
  showLiveDot?: boolean;
}

export const RealTimeClock: React.FC<RealTimeClockProps> = ({
  className = '',
  variant = 'default',
  showSeconds = true,
  showDate = true,
  showTime = true,
  showLiveDot = true,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every second for a real, live ticking clock
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Date: e.g. "Thursday, 16 Oct 2026" or "Thu, 16 Oct"
  const formattedDate = currentDate.toLocaleDateString('en-GB', {
    weekday: variant === 'compact' ? 'short' : 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Format Time: e.g. "06:48:12 PM"
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: true,
  });

  if (variant === 'hero') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm select-none ${className}`}
        title={`Live System Clock: ${formattedDate} ${formattedTime}`}
      >
        {showLiveDot && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
        {showDate && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
            <CalendarIcon className="w-3.5 h-3.5 text-red-500" />
            {formattedDate}
          </span>
        )}
        {showDate && showTime && <span className="text-slate-300 dark:text-slate-600 select-none">•</span>}
        {showTime && (
          <span className="inline-flex items-center gap-1.5 font-mono font-bold text-red-600 dark:text-red-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {formattedTime}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors select-none ${className}`}
      title={`Current real-time system clock: ${formattedDate} ${formattedTime}`}
    >
      {showLiveDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
      )}

      {showDate && (
        <div className="inline-flex items-center gap-1.5 shrink-0">
          <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">{formattedDate}</span>
        </div>
      )}

      {showDate && showTime && (
        <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
      )}

      {showTime && (
        <div className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-bold text-red-600 dark:text-red-400 shrink-0">
          <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400" />
          <span>{formattedTime}</span>
        </div>
      )}
    </div>
  );
};
