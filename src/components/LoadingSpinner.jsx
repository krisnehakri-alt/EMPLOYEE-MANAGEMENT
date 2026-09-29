import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-indigo-600 animate-spin`} />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full animate-pulse divide-y divide-slate-100">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-4 px-6 gap-4">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="flex items-center space-x-3 w-48">
            <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-28 hidden md:block"></div>
          <div className="h-4 bg-slate-200 rounded w-28 hidden lg:block"></div>
          <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          <div className="h-8 bg-slate-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
