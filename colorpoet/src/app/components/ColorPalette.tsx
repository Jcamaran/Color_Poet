'use client';

import { memo } from 'react';

interface ColorItem {
  color: string;
  row: number;
  col: number;
}

interface ColorPaletteProps {
  colors: ColorItem[];
  paletteRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * ColorPalette Component
 * Displays the color grid - memoized to prevent unnecessary re-renders
 */
const ColorPalette = memo(({ colors, paletteRef }: ColorPaletteProps) => {
  // Calculate grid dimensions from data
  const cols = Math.max(...colors.map(c => c.col)) + 1;
  const rows = Math.max(...colors.map(c => c.row)) + 1;
  
  return (
    <div 
      ref={paletteRef} 
      className="bg-gray-700/40 p-6 rounded-lg flex flex-col items-start justify-center w-full h-full" 
    >
      {/* Color Palette Grid - Responsive using CSS Grid */}
      <div 
        className="grid gap-1 w-2/3 h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`, // Maintains rectangular shape
        }}
      >
        {colors.map((item, index) => (
          <div
            key={index}
            data-color={item.color}
            style={{
              backgroundColor: item.color,
              gridColumn: item.col + 1,
              gridRow: item.row + 1,
            }}
            className="hover:scale-110 transition-transform cursor-pointer rounded-sm"
          />
        ))}
      </div>
    </div>
  );
});

ColorPalette.displayName = 'ColorPalette';

export default ColorPalette;
