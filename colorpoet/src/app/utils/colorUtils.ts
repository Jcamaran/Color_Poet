/**
 * Color utility functions
 * Pure functions for color manipulation - can be tree-shaken if not used
 */

/**
 * Generate a color palette with rectangular rainbow pattern
 */
// ROYGBIV hue stops: Red, Orange, Yellow, Green, Blue, Indigo, Violet
const ROYGBIV_HUES = [0, 30, 60, 120, 240, 270, 300];

export const generateColorPalette = () => {
  const colors = [];
  const cols = ROYGBIV_HUES.length;
  const rows = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const hue = ROYGBIV_HUES[col];
      
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
  if (hue < 50) return 'Orange';
  if (hue < 90) return 'Yellow';
  if (hue < 210) return 'Green';
  if (hue < 255) return 'Blue';
  if (hue < 285) return 'Indigo';
  if (hue < 345) return 'Violet';
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
