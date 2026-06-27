import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, className = '', id, ...props }, ref) => {
      const selectId = id || `select-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 9)}`;
      return (
        <div className="w-full mb-4">
          {label && (
            <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1">
              {label}
            </label>
          )}
          <select
            ref={ref}
            id={selectId}
            className={`block w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              error ? 'border-red-300' : ''
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      );
    }
  )
);

Select.displayName = 'Select';

export default Select;
