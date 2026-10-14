import React from 'react';

export const Skeleton: React.FC<{
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}> = ({ className = '', width, height, rounded = 'rounded-xl' }) => (
  <div
    style={{ width, height }}
    className={`bg-slate-200/80 animate-pulse ${rounded} ${className}`}
  />
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 flex items-center gap-4">
    <Skeleton className="w-12 h-12 shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2">
      <Skeleton className="w-20 h-3" />
      <Skeleton className="w-28 h-6" />
      <Skeleton className="w-32 h-3" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-1.5">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-48 h-3" />
      </div>
      <Skeleton className="w-16 h-6 rounded-lg" />
    </div>
    <div className={`w-full ${height} flex items-end gap-3 pt-6`}>
      <Skeleton className="flex-1 h-3/5 rounded-t-lg" />
      <Skeleton className="flex-1 h-4/5 rounded-t-lg" />
      <Skeleton className="flex-1 h-2/5 rounded-t-lg" />
      <Skeleton className="flex-1 h-5/6 rounded-t-lg" />
      <Skeleton className="flex-1 h-1/2 rounded-t-lg" />
      <Skeleton className="flex-1 h-4/6 rounded-t-lg" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="space-y-2.5">
    <div className="flex gap-4 pb-2 border-b border-slate-100">
      <Skeleton className="w-1/4 h-3.5" />
      <Skeleton className="w-1/2 h-3.5" />
      <Skeleton className="w-1/4 h-3.5" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-2 items-center">
        <Skeleton className="w-12 h-6 rounded-lg" />
        <Skeleton className="flex-1 h-4" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
    ))}
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/60 rounded-xl">
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="w-32 h-3.5" />
          <Skeleton className="w-44 h-3" />
        </div>
        <Skeleton className="w-14 h-5 rounded-md" />
      </div>
    ))}
  </div>
);
