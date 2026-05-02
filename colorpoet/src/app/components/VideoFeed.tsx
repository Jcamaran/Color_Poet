'use client';

import { memo } from 'react';

interface VideoFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

/**
 * VideoFeed Component
 * Displays video and canvas overlay - memoized since refs don't change
 */
const VideoFeed = memo(({ videoRef, canvasRef }: VideoFeedProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover rounded-lg"
        autoPlay
        playsInline
        muted
      />
      
      {/* Canvas overlay for hand landmarks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 rounded-lg pointer-events-none w-full h-full"
      />
    </div>
  );
});

VideoFeed.displayName = 'VideoFeed';

export default VideoFeed;
