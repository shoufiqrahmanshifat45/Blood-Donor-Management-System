import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  comparisonText?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  comparisonText = 'vs. last month',
  icon,
  iconBgColor = 'bg-slate-100',
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200 flex items-center gap-4 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {/* Icon Badge */}
      <div
        className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0 shadow-xs`}
      >
        {icon}
      </div>

      {/* Metric Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-slate-500 truncate leading-tight">
          {title}
        </p>
        <p className="text-[23px] sm:text-[25px] font-bold text-[#0f172a] tracking-tight leading-tight mt-0.5">
          {value}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium leading-none">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isPositive ? 'text-[#10b981]' : 'text-[#ef4444]'
            }`}
          >
            {isPositive ? (
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            )}
            {change}
          </span>
          <span className="text-slate-400 font-normal truncate">
            {comparisonText}
          </span>
        </div>
      </div>
    </div>
  );
};
