import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  icon,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`relative flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-slate-400 flex items-center justify-center">
            {icon}
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full appearance-none bg-white dark:bg-[#111c34] border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 focus:border-red-500 rounded-xl py-2.5 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/15 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pl-9 pr-9' : 'pl-3.5 pr-9'
          }`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#111c34] text-slate-700 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute right-3 pointer-events-none stroke-[2]" />
      </div>
    </div>
  );
};
