/**
 * Color utility functions
 * Pure functions for color manipulation - can be tree-shaken if not used
 */

/**
 * Convert HSL to Hex color code
 */
export const hslToHex = (hslString: string): string => {
  // Extract values from "hsl(240, 80%, 50%)"
  const match = hslString.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
  if (!match) return hslString;

  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]);
  const l = parseFloat(match[3]);

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Generate a color palette with rectangular rainbow pattern
 */
export const generateColorPalette = () => {
  const colors = [];
  const cols = 15; 
  const rows = 10; 
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Hue varies across columns (0-360 degrees)
      const hue = (col / cols) * 360;
      
      // Lightness varies down rows (lighter at top, darker at bottom)
      const lightness = 80 - (row / rows) * 50; // 80% to 30%
      
      // Saturation - high in middle rows, lower at extremes
      const saturationFactor = 1 - Math.abs((row / rows) - 0.5) * 0.4;
      const saturation = 90 * saturationFactor;
      
      colors.push({
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        row,
        col,
      });
    }
  }
  
  return colors;
};

/**
 * Get color name from HSL string based on hue value
 */
export const getColorName = (hslString: string): string => {
  // Extract hue from "hsl(240, 80%, 50%)"
  const hueMatch = hslString.match(/hsl\((\d+\.?\d*)/);
  if (!hueMatch) return 'Unknown';
  
  const hue = parseFloat(hueMatch[1]);
  
  // Categorize by hue ranges (color wheel: 0-360 degrees)
  if (hue >= 345 || hue < 15) return 'Red';
  if (hue < 45) return 'Orange';
  if (hue < 75) return 'Yellow';
  if (hue < 165) return 'Green';
  if (hue < 195) return 'Cyan';
  if (hue < 255) return 'Blue';
  if (hue < 285) return 'Indigo';
  if (hue < 345) return 'Purple';
  return 'Unknown';
};

/**
 * Check if a color swatch is hit at the given coordinates
 */
export const checkColorHit = (pinchX: number, pinchY: number): string | null => {
  // Get all color swatch elements
  const swatches = document.querySelectorAll('[data-color]');
  
  for (const swatch of swatches) {
    const rect = swatch.getBoundingClientRect();
    
    // Check if pinch point is inside this swatch
    if (
      pinchX >= rect.left &&
      pinchX <= rect.right &&
      pinchY >= rect.top &&
      pinchY <= rect.bottom
    ) {
      return swatch.getAttribute('data-color');
    }
  }
  
  return null;
};

/**
 * Parse an HSL string into {h, s, l} numbers
 */
const parseHsl = (hslString: string): { h: number; s: number; l: number } | null => {
  const match = hslString.match(/hsl\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%\)/);
  if (!match) return null;
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
};

/**
 * Convert HSL values to a hex string
 */
const hslValuesToHex = (h: number, s: number, l: number): string => {
  return hslToHex(`hsl(${h}, ${s}%, ${l}%)`);
};

/**
 * Given an HSL color string, generate 3 aurora color stops as hex values.
 * The first stop is the exact selected color; the other two are harmonious companions.
 */
export const getAuroraColorsFromHsl = (hslString: string): [string, string, string] => {
  const parsed = parseHsl(hslString);
  if (!parsed) return ['#7a7dfe', '#91e9c8', '#579ba7'];

  const { h, s, l } = parsed;

  // Stop 1: exact selected color as hex — no modification
  const main = hslToHex(hslString);

  // Stop 2: analogous — hue shifted +40°, slightly deeper
  const analogous = hslValuesToHex(
    (h + 40) % 360,
    Math.min(s + 5, 100),
    Math.max(l - 15, 20)
  );

  // Stop 3: split-complement — hue shifted -60°, lightened and softened
  const complement = hslValuesToHex(
    (h - 60 + 360) % 360,
    Math.max(s - 20, 25),
    Math.min(l + 15, 88)
  );

  return [main, analogous, complement];
};
