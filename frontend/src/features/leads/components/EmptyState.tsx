import React from 'react';
import { Database, Plus } from 'lucide-react';
import Button from '../../../components/ui/Button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-dashed border-slate-300 p-8 shadow-sm">
      <Database className="mx-auto h-12 w-12 text-slate-400" />
      <h3 className="mt-4 text-base font-semibold text-slate-900">No leads yet</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
        Start building your sales pipeline by creating your first lead.
      </p>
      <div className="mt-6">
        <Button onClick={onCreateClick} className="inline-flex items-center cursor-pointer">
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Create Lead
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
