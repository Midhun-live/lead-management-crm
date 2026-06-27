import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.memo(
  forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
      const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9)}`;
      return (
        <div className="w-full mb-4">
          {label && (
            <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full px-3 py-2 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white sm:text-sm ${
              error ? 'border-red-300 text-red-900 placeholder-red-300' : ''
            } ${className}`}
            {...props}
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      );
    }
  )
);

Input.displayName = 'Input';

export default Input;
