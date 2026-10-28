import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status.toLowerCase()) {
    case 'pending':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      break;
    case 'accepted':
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
      break;
    case 'scheduled':
      colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      break;
    case 'collected':
      colorClasses = 'bg-forest-50 text-forest-700 border-forest-200';
      break;
    case 'cancelled':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-70"></span>
      {status}
    </span>
  );
};
