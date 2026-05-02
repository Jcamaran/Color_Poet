'use client';

import { memo } from 'react';

interface SelectedColorDisplayProps {
  colorName: string | null;
  colorValue: string | null;
}

/**
 * SelectedColorDisplay Component
 * Shows the selected color name and value - only re-renders when color changes
 */
const SelectedColorDisplay = memo(({ colorName, colorValue }: SelectedColorDisplayProps) => {
  if (!colorValue || !colorName) {
    // Reserve space even when no color is selected to prevent layout shift
    return <div className="h-24 w-full" />;
  }

  return (
    <div className="p-3 bg-zinc-700 rounded-lg w-full h-24">
      <p className="text-white text-lg font-bold mb-2">{colorName}</p>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-white"
          style={{ backgroundColor: colorValue }}
        />
        <code className="text-xs text-zinc-300">{colorValue}</code>
      </div>
    </div>
  );
});

SelectedColorDisplay.displayName = 'SelectedColorDisplay';

export default SelectedColorDisplay;
