import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full px-4 py-3 bg-white text-gray-900 border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] focus:border-transparent resize-y ${
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

Textarea.displayName = 'Textarea';
