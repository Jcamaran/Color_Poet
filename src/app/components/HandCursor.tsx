'use client';

import { memo } from 'react';

interface HandCursorProps {
  position: { x: number; y: number } | null;
}

/**
 * HandCursor Component
 * Floating cursor that follows hand position - only re-renders when position changes
 */
const HandCursor = memo(({ position }: HandCursorProps) => {
  if (!position) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      className="w-6 h-6 border-4 border-blue-400 rounded-full bg-blue-400 bg-opacity-30 shadow-lg"
    />
  );
});

HandCursor.displayName = 'HandCursor';

export default HandCursor;
