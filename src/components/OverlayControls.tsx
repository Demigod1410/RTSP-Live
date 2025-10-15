'use client';

import { useState } from 'react';
import { useOverlays } from '@/hooks/useOverlays';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function OverlayControls() {
  const {
    createTextOverlay,
    createImageOverlay,
    isLoading,
    error,
  } = useOverlays();
  
  const [isBusy, setIsBusy] = useState(false);
  
  const handleCreateTextOverlay = async () => {
    if (isBusy) return;
    
    setIsBusy(true);
    await createTextOverlay();
    setIsBusy(false);
  };
  
  const handleCreateImageOverlay = async () => {
    if (isBusy) return;
    
    setIsBusy(true);
    await createImageOverlay();
    setIsBusy(false);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handleCreateTextOverlay}
          disabled={isBusy || isLoading}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-60 text-white rounded-md transition"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Text</span>
        </button>
        
        <button
          onClick={handleCreateImageOverlay}
          disabled={isBusy || isLoading}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-60 text-white rounded-md transition"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Image</span>
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}