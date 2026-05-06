'use client';

import { memo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { hslToHex } from '../utils/colorUtils';

import { Sparkles } from 'lucide-react';

interface SelectedColorDisplayProps {
  colorName: string | null;
  colorValue: string | null;
  onGeneratePoem?: () => void;
}

/**
 * SelectedColorDisplay Component
 * Shows the selected color hex code - click to copy
 */
const SelectedColorDisplay = memo(({ colorName, colorValue, onGeneratePoem }: SelectedColorDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!colorValue) return;
    
    try {
      const hexValue = hslToHex(colorValue);
      await navigator.clipboard.writeText(hexValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!colorValue || !colorName) {
    return (
      <div className="w-full flex flex-col justify-center items-center text-center">
        <p className="text-xs text-slate-500 leading-snug">Selected color will be displayed here</p>
      </div>
    );
  }

  return (
    <div 
      
      className="p-4 bg-slate-950 rounded-xl w-full h-full flex flex-col justify-center items-center border border-gray-300/30 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 ease-in-out group"
    >
      <div className="flex flex-col items-center gap-3 w-full">
        <div
          className="w-20 h-20 rounded-lg border-2 border-white shadow-lg"
          style={{ backgroundColor: colorValue }}
        />
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-center gap-2">
            <code className="text-xl font-bold text-white font-mono">{hslToHex(colorValue)}</code>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy 
              onClick={handleCopyToClipboard}
              className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
            )}
          </div>
          <code className="text-xs text-slate-400 font-mono">{colorValue}</code>
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">
            {copied ? 'Copied hex to clipboard!' : 'Click to copy hex'}
          </p>
        </div>
        <button onClick={onGeneratePoem} className="px-4 py-2 bg-linear-to-r from-[#4169e1] to-[#89CFF0] hover:from-[#5B7FED] hover:to-[#A0E0FF] text-white rounded-lg transition-color duration-300 flex flex-row items-center gap-2 text-sm mt-2 cursor-pointer">
          <Sparkles className="w-4 h-4" />
          <h1 className="text-md text-white font-semibold">Select Color</h1>
        </button>
      </div>
    </div>
  );
});

SelectedColorDisplay.displayName = 'SelectedColorDisplay';

export default SelectedColorDisplay;
