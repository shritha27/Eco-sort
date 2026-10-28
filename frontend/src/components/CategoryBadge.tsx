import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  if (category.includes('Wet') || category.includes('Biodegradable')) {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (category.includes('Dry') || category.includes('Recyclable')) {
    badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (category.includes('Residual') || category.includes('Non-Recyclable')) {
    badgeStyle = 'bg-zinc-100 text-zinc-800 border-zinc-300';
  } else if (category.includes('Hazardous')) {
    badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
  } else if (category.includes('Electronic')) {
    badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200';
  } else if (category.includes('Special')) {
    badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      {category}
    </span>
  );
};
