import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="w-full space-y-4">
      <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
      <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
      <div className="animate-pulse bg-white border border-gray-200 rounded-lg p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
