
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card-bg p-4 sm:p-6 rounded-xl shadow-lg border border-secondary ${className}`}>
      {children}
    </div>
  );
};
