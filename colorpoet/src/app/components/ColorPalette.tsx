'use client';

import { memo } from 'react';
import { Palette, Sparkles } from 'lucide-react';
import SelectedColorDisplay from './SelectedColorDisplay';
import TipsBar from './TipsBar';


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
  hoveredColor: string | null;
  onGeneratePoem?: () => void;
}

/**
 * ColorPalette Component
 * Displays the color grid - memoized to prevent unnecessary re-renders
 */
const ColorPalette = memo(({ colors, paletteRef, colorName, colorValue, hoveredColor, onGeneratePoem }: ColorPaletteProps) => {
  // Calculate grid dimensions from data
  const cols = Math.max(...colors.map(c => c.col)) + 1;
  const rows = Math.max(...colors.map(c => c.row)) + 1;
  
  return (
    <div className="bg-inherit p-0 rounded-xl flex flex-col w-full h-full gap-2">
      {/* Color Palette Grid */}
      <div className="flex flex-row gap-2 flex-1 min-h-0">
        {/* Left: Color Palette Section */}
        <div className="flex flex-col gap-2 flex-1 w-3/5 ">
          <h3 className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-widest font-ui px-1">
            <Palette className="w-4 h-4" />
            Color Palette
          </h3>
          <div
            ref={paletteRef}
            className="grid gap-1 flex-1 min-h-0 bg-slate-950 p-5 rounded-lg overflow-hidden border border-gray-300/30"
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
                  transform: item.color === hoveredColor ? 'scale(1.15)' : 'scale(1)',
                  zIndex: item.color === hoveredColor ? 10 : 1,
                  borderRadius: '5px',
                  border: item.color === hoveredColor ? '2px solid #ffffff' : 'none',
                }}
                className="cursor-pointer transition-transform duration-150 ease-out"
              />
            ))}
          </div>
        </div>

        {/* Right: Selected Color Section */}
        <div className="shrink-0 w-2/5 flex flex-col gap-2">
          <h3 className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-widest font-ui px-1">
            <Sparkles className="w-4 h-4" />
            Selected Color
          </h3>
          <div className="flex-1 flex items-center ">
            <SelectedColorDisplay colorName={colorName} colorValue={colorValue} onGeneratePoem={onGeneratePoem} />
          </div>
        </div>
      </div>

      {/* Tips Bar - Fixed at bottom */}
      <div className="shrink-0">
        <TipsBar />
      </div>
    </div>
    
  );
});

ColorPalette.displayName = 'ColorPalette';

export default ColorPalette;
