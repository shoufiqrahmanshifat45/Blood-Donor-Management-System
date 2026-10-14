import React from 'react';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-[13.5px] font-bold text-[#0f172a] leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Chart Body */}
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
};
