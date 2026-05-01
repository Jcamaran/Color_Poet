'use client';

import { memo } from 'react';

interface ControlButtonsProps {
  isTracking: boolean;
  onStart: () => void;
  onStop: () => void;
}

/**
 * ControlButtons Component
 * Start/Stop tracking buttons - memoized to prevent re-renders
 */
const ControlButtons = memo(({ isTracking, onStart, onStop }: ControlButtonsProps) => {
  return (
    <div className="flex gap-4 mt-6">
      {!isTracking ? (
        <button
          onClick={onStart}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Hand Tracking
        </button>
      ) : (
        <button
          onClick={onStop}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Stop Tracking
        </button>
      )}
    </div>
  );
});

ControlButtons.displayName = 'ControlButtons';

export default ControlButtons;
