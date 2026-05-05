'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TipsBar Component
 * Displays helpful tips for navigating the ColorPoet system with animated cycling
 */
const TipsBar = memo(function TipsBar() {
  const tips = [
    { icon: '👋', text: 'Show your hand to the camera to start tracking' },
    { icon: '👆', text: 'Point at a color to hover over it' },
    { icon: '🤏', text: 'Pinch (thumb + index finger) to select a color' },
    { icon: '✨', text: 'AI will generate a unique poem for your selected color' },
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 4000); // Change tip every 4 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTip = tips[currentTipIndex];

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-sm border border-blue-700/30 rounded-lg p-3 shadow-lg border border-gray-300/30">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="shrink-0">
          <Image 
            className="h-9 w-9 drop-shadow-lg" 
            src="/quill_purple.png" 
            alt="ColorPoet Logo" 
            width={30} 
            height={30} 
          />
        </div>

        {/* Animated Tip */}
        <div className="flex-1 min-w-0 relative max-h-8 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center gap-3"
            >
             
              <span className="text-white text-sm font-ui leading-snug">
                {currentTip.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-1.5 shrink-0">
          {tips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTipIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentTipIndex 
                  ? 'w-8 bg-blue-500' 
                  : 'w-1.5 bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to tip ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

TipsBar.displayName = 'TipsBar';

export default TipsBar;
