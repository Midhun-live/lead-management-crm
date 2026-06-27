import React from 'react';

interface SourceFilterProps {
  value: string;
  onChange: (val: string) => void;
}

export const SourceFilter: React.FC<SourceFilterProps> = React.memo(({ value, onChange }) => {
  const sources = [
    { value: '', label: 'All Sources' },
    { value: 'WEBSITE', label: 'Website' },
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'PHONE', label: 'Phone' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full md:w-44 pl-3 pr-10 py-2 bg-white text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {sources.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
});

SourceFilter.displayName = 'SourceFilter';

export default SourceFilter;
