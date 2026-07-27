import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 p-6 md:p-8 transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-lg hover:-translate-y-1' : 'shadow-card'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
