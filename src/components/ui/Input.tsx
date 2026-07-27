import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-4 py-3 bg-white text-gray-900 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent ${
            error ? 'border-[#EF4444] bg-red-50/20' : 'border-gray-300 hover:border-gray-400'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#EF4444] mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
