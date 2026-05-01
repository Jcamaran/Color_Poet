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
  return (
    <div 
      ref={paletteRef} 
      className="bg-zinc-800 p-4 rounded-lg flex flex-col items-center justify-center" 
      style={{ width: '440px', height: '370px' }}
    >
      {/* Color Palette Grid - Centered */}
      <div 
        className="relative mb-6 w-full h-full flex items-start justify-center"
        style={{ width: '290px', height: '500px' }}
      >
        {colors.map((item, index) => (
          <div
            key={index}
            data-color={item.color}
            style={{
              backgroundColor: item.color,
              position: 'absolute',
              left: `${item.col * 25}px`,
              top: `${item.row * 25}px`,
              width: '30px',
              height: '30px',
            }}
            className="hover:scale-110 transition-transform cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
});

ColorPalette.displayName = 'ColorPalette';

export default ColorPalette;
