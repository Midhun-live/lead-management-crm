import React from 'react';
import { LeadStatus } from '../../../types';

export const LeadStatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-teal-100 text-teal-800',
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default LeadStatusBadge;
