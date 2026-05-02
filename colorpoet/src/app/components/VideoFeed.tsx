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
    <div className="relative w-auto h-full ">
      <video
        ref={videoRef}
        className="rounded-lg w-full h-full "
        autoPlay
        playsInline
        muted
      />
      
      {/* Canvas overlay for hand landmarks */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 rounded-lg pointer-events-none w-full h-full"
      />
    </div>
  );
});

VideoFeed.displayName = 'VideoFeed';

export default VideoFeed;
