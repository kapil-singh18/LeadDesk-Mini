import React from 'react';

export type BadgeStatus = 'New' | 'Contacted' | 'Closed' | string;

export interface BadgeProps {
  status: BadgeStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const styles: Record<string, string> = {
    New: 'bg-[#F2F3FF] text-[#5F6FFF] border border-[#5F6FFF]/30 font-semibold',
    Contacted: 'bg-amber-50 text-amber-700 border border-amber-200 font-semibold',
    Closed: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
  };

  const currentStyle = styles[status] || 'bg-gray-100 text-gray-700 border border-gray-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full transition-colors ${currentStyle} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'New'
            ? 'bg-[#5F6FFF]'
            : status === 'Contacted'
            ? 'bg-amber-500'
            : status === 'Closed'
            ? 'bg-emerald-500'
            : 'bg-gray-400'
        }`}
      />
      {status}
    </span>
  );
};
