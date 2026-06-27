import React from 'react';

interface StatusFilterProps {
  value: string;
  onChange: (val: string) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = React.memo(({ value, onChange }) => {
  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'WON', label: 'Won' },
    { value: 'LOST', label: 'Lost' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full md:w-44 pl-3 pr-10 py-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
});

StatusFilter.displayName = 'StatusFilter';

export default StatusFilter;
