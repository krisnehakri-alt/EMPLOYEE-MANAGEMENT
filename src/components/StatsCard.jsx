import React from 'react';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  colorScheme = 'indigo',
  subtitle,
}) => {
  const schemeStyles = {
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'bg-indigo-50 text-indigo-700',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-50 text-amber-700',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'bg-blue-50 text-blue-700',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      badge: 'bg-purple-50 text-purple-700',
    },
  };

  const currentScheme = schemeStyles[colorScheme] || schemeStyles.indigo;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-13 h-13 p-3.5 rounded-2xl flex items-center justify-center border ${currentScheme.bg} transition-transform group-hover:scale-105 duration-200`}
        >
          {Icon && <Icon className="w-6 h-6 stroke-[2]" />}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs">
          <span className="font-semibold text-emerald-600 mr-1.5">{trend}</span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
