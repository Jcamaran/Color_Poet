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
    return (
      <div className="w-full flex flex-col justify-center items-center text-center">
        <p className="text-xs text-gray-500 leading-snug">Selected color will be displayed here</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-700/40 rounded-b-lg w-full h-24 flex flex-col justify-center items-start">
      <p className="text-white text-lg font-bold mb-0">{colorName}</p>
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
