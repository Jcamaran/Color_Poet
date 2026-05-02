'use client';

import { memo } from 'react';
import SelectedColorDisplay from './SelectedColorDisplay';

interface ColorItem {
  color: string;
  row: number;
  col: number;
}

interface ColorPaletteProps {
  colors: ColorItem[];
  paletteRef: React.RefObject<HTMLDivElement | null>;
  colorName: string | null;
  colorValue: string | null;
}

/**
 * ColorPalette Component
 * Displays the color grid - memoized to prevent unnecessary re-renders
 */
const ColorPalette = memo(({ colors, paletteRef, colorName, colorValue }: ColorPaletteProps) => {
  // Calculate grid dimensions from data
  const cols = Math.max(...colors.map(c => c.col)) + 1;
  const rows = Math.max(...colors.map(c => c.row)) + 1;
  
  return (
    <div 
      className="bg-gray-700/40 p-4 rounded-lg flex flex-row items-stretch w-full h-full gap-4" 
    >
      {/* Color Palette Grid */}
      <div
        ref={paletteRef}
        className="grid gap-1 flex-1 min-w-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols} / ${rows}`,
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

      {/* Selected color — always visible, same box */}
      <div className="shrink-0 w-1/2 flex items-center">
        <SelectedColorDisplay colorName={colorName} colorValue={colorValue} />
      </div>
    </div>
  );
});

ColorPalette.displayName = 'ColorPalette';

export default ColorPalette;
