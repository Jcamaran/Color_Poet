/**
 * Color utility functions
 * Pure functions for color manipulation - can be tree-shaken if not used
 */

/**
 * Generate a color palette with diamond/circular pattern
 */
export const generateColorPalette = () => {
  const colors = [];
  const size = 11; // 11x11 grid
  const center = Math.floor(size / 2);
  
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      // Calculate distance from center for diamond shape
      const distance = Math.abs(row - center) + Math.abs(col - center);
      
      if (distance <= center) {
        // Calculate hue based on angle around the center
        const angle = Math.atan2(row - center, col - center);
        const hue = ((angle + Math.PI) / (2 * Math.PI)) * 360;
        
        // Calculate lightness based on distance from center
        const lightness = 30 + (distance / center) * 50; // 30% to 80%
        
        // Calculate saturation (more saturated near middle ring)
        const saturation = distance === 0 ? 0 : 90 - Math.abs(distance - center / 1.5) * 20;
        
        colors.push({
          color: `hsl(${hue}, ${Math.max(0, saturation)}%, ${lightness}%)`,
          row,
          col,
        });
      }
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
