import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './FormInputs';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 sm:p-8 border border-red-100 flex flex-col items-center justify-center text-center shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-3.5 shadow-xs">
        <AlertCircle className="w-6 h-6 stroke-[2.2]" />
      </div>
      <h3 className="text-[15px] font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-[12.5px] text-slate-500 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export const ErrorBanner: React.FC<{
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ message, onRetry, className = '' }) => {
  return (
    <div
      className={`p-3 bg-red-50/90 border border-red-200/80 rounded-xl text-red-800 text-[12px] flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <span className="truncate">{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-red-700 hover:text-red-900 font-semibold underline text-[11px] shrink-0"
        >
          Retry
        </button>
      )}
    </div>
  );
};
