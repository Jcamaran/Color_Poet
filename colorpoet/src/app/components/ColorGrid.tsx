'use client';

/**
 * ColorGrid.tsx - Main Orchestrator Component
 * 
 * Optimized for Next.js/Vercel:
 * - Split into smaller memoized components
 * - useCallback for stable function references
 * - useMemo for expensive computations
 * - Utility functions extracted to separate file
 */

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { HandTracker } from './HandTracker';
import type { HandLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import ColorPalette from './ColorPalette';
import VideoFeed from './VideoFeed';
import ControlButtons from './ControlButtons';
import SelectedColorDisplay from './SelectedColorDisplay';
import HandCursor from './HandCursor';
import PoemCard from './PoemCard';
import { generateColorPalette, getColorName, checkColorHit } from '../utils/colorUtils';

export default function ColorGrid() {
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const trackerRef = useRef<HandTracker | null>(null);
const palleteContainerRef = useRef<HTMLDivElement>(null);


const [isTracking, setIsTracking] = useState(false);
const [handInfo, setHandInfo] = useState<string>('');
const [selectedColor, setSelectedColor] = useState<string | null>(null);
const [selectedColorName, setSelectedColorName] = useState<string | null>(null);

// Hand cursor position in SCREEN coordinates (pixels)
const [handCursor, setHandCursor] = useState<{ x: number; y: number } | null>(null);

// Generate color palette once using useMemo
const colorPalette = useMemo(() => generateColorPalette(), []);




useEffect(() => {
const initTracker = async () => {
    trackerRef.current = new HandTracker();
    const success = await trackerRef.current.initialize({
    numHands: 1, // Track one hand for simplicity
    minHandDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    });
    
    if (!success) {
    console.error('Failed to initialize hand tracker');
    }
};

initTracker();

return () => {
    trackerRef.current?.dispose();
};
}, []);

  /**
   * Map hand position from video space to color palette space
   */
  const mapHandToPalette = useCallback((
    results: HandLandmarkerResult,
    handIndex: number,
    landmarkIndex: number
  ): { x: number; y: number } | null => {
    const landmark = trackerRef.current?.getLandmark(results, handIndex, landmarkIndex);
    const paletteRect = palleteContainerRef.current?.getBoundingClientRect();
    
    if (!landmark || !paletteRect) return null;
    
    // Map normalized coords (0-1) to palette screen position
    // Flip X because video is mirrored
    const x = paletteRect.left + ((1 - landmark.x) * paletteRect.width);
    const y = paletteRect.top + (landmark.y * paletteRect.height);
    
    return { x, y };
  }, []);

  /**
   * Draw hand skeleton connections
   */
  const drawHandConnections = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    width: number,
    height: number
  ) => {
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17], // Palm
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      ctx.beginPath();
      ctx.moveTo(startPoint.x * width, startPoint.y * height);
      ctx.lineTo(endPoint.x * width, endPoint.y * height);
      ctx.stroke();
    });
  }, []);

  /**
   * Draw landmark points
   */
  const drawLandmarks = useCallback((
    ctx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmark[],
    width: number,
    height: number
  ) => {
    landmarks.forEach((landmark, index) => {
      const x = landmark.x * width;
      const y = landmark.y * height;

      if (index === 0) {
        ctx.fillStyle = '#ff0000'; // Wrist
      } else if ([4, 8, 12, 16, 20].includes(index)) {
        ctx.fillStyle = '#ffff00'; // Fingertips
      } else {
        ctx.fillStyle = '#00ff00'; // Other joints
      }

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, []);

  /**
   * Check pinch gesture and select color
   */
  const checkPinchGesture = useCallback((results: HandLandmarkerResult, handIndex: number) => {
    if (!trackerRef.current) return;
    
    const distance = trackerRef.current.getDistance(results, handIndex, 4, 8);
    
    if (distance && distance < 0.05) {
      const thumb = mapHandToPalette(results, handIndex, 4);
      const index = mapHandToPalette(results, handIndex, 8);
      
      if (thumb && index) {
        const pinchX = (thumb.x + index.x) / 2;
        const pinchY = (thumb.y + index.y) / 2;
        
        const color = checkColorHit(pinchX, pinchY);
        if (color) {
          setSelectedColor(color);
          setSelectedColorName(getColorName(color));
        }
      }
    }
  }, [mapHandToPalette]);

  /**
   * Handle detection results from MediaPipe (called every frame)
   */
  const handleResults = useCallback((results: HandLandmarkerResult) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      setHandInfo('Hand detected');

      const landmarks = results.landmarks[0];
      drawHandConnections(ctx, landmarks, canvas.width, canvas.height);
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);

      const palletePos = mapHandToPalette(results, 0, 8);
      if (palletePos) {
        setHandCursor(palletePos);
      }

      checkPinchGesture(results, 0);
    } else {
      setHandInfo('No hand detected');
      setHandCursor(null);
    }
  }, [drawHandConnections, drawLandmarks, mapHandToPalette, checkPinchGesture]);

  const startTracking = useCallback(async () => {
    if (!trackerRef.current || !videoRef.current || !canvasRef.current) return;

    try {
      await trackerRef.current.startCamera(videoRef.current, handleResults);
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start tracking:', error);
      alert('Could not access camera. Please check permissions.');
    }
  }, [handleResults]);

  const stopTracking = useCallback(() => {
    trackerRef.current?.stop();
    setIsTracking(false);
    setHandInfo('');
    setHandCursor(null);
    setSelectedColor(null);
    setSelectedColorName(null);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <div className="min-h-screen p-8">
      {/* Title at Top Left */}
      <h1 className="text-4xl font-bold mb-8">
        <span className="text-blue-400">Color</span>
        <span className="text-pink-400">Poet</span>
      </h1>

      {/* Camera and Color Palette Side by Side */}
      <div className="flex gap-8 justify-center items-start max-w-7xl mx-auto">
        
        {/* LEFT: Video Feed with Hand Tracking */}
        <div className="flex flex-col items-center" style={{ width: '440px', height: '250px' }}>
          <VideoFeed videoRef={videoRef} canvasRef={canvasRef} />

          <ControlButtons 
            isTracking={isTracking}
            onStart={startTracking}
            onStop={stopTracking}
          />

          {/* Status */}
          <p className="mt-4 text-zinc-400">
            {handInfo || 'Click "Start Hand Tracking" to begin'}
          </p>
        </div>

        {/* RIGHT: Fixed Color Palette */}
        <div className="flex flex-col items-center" style={{ width: '440px' }}>
          <ColorPalette colors={colorPalette} paletteRef={palleteContainerRef} />
          <SelectedColorDisplay colorName={selectedColorName} colorValue={selectedColor} />
        </div>
      </div>

      {/* Hand Cursor Overlay */}
      <HandCursor position={handCursor} />

      {/* Poem Card - Displays Generated Poem */}
      <PoemCard color={selectedColor} colorName={selectedColorName} />
    </div>
  );
}
