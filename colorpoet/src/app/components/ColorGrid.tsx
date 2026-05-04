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
import Image from 'next/image';
import { HandTracker } from './HandTracker';
import type { HandLandmarkerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';
import ColorPalette from './ColorPalette';
import VideoFeed from './VideoFeed';
import HandCursor from './HandCursor';
import PoemCard from './PoemCard';
import { generateColorPalette, getColorName, checkColorHit } from '../utils/colorUtils';

// Indiqte which hand is being tracked (Left/Right/Unknown)
type HandSide = "Left" | "Right" | "None";

export default function ColorGrid() {
const videoRef = useRef<HTMLVideoElement>(null);
const canvasRef = useRef<HTMLCanvasElement>(null);
const trackerRef = useRef<HandTracker | null>(null);
const palleteContainerRef = useRef<HTMLDivElement>(null);


const [isTracking, setIsTracking] = useState(false);
const [handInfo, setHandInfo] = useState<string>('');
const [selectedColor, setSelectedColor] = useState<string | null>(null);
const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
const [landmarkCount, setLandmarkCount] = useState<number>(0);
const [showHistory, setShowHistory] = useState(false);

// Poem history - store up to 10 recent poems
const [poemHistory, setPoemHistory] = useState<Array<{
  date: string;
  color: string;
  colorName: string;
  poem: string;
}>>(() => {
  // Load from localStorage on initial render
  if (typeof window !== 'undefined') {
    const savedHistory = localStorage.getItem('poemHistory');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (error) {
        console.error('Failed to load poem history:', error);
      }
    }
  }
  return [];
});


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

  // Function to add poem to history (max 10 entries)
  const addToHistory = useCallback((color: string, colorName: string, poem: string) => {
    const newEntry = {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      color,
      colorName,
      poem,
    };
    
    setPoemHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 10); // Keep only last 10
      localStorage.setItem('poemHistory', JSON.stringify(updated));
      return updated;
    });
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
   * Get which hand is being tracked (Left/Right/Unknown)
   */
  const getTrackedHand = (results: HandLandmarkerResult, index = 0): HandSide => {
    const handedness = results.handedness?.[index]?.[0]?.categoryName;
    
    console.log('Handedness raw data:', handedness, results.handedness?.[index]);

    if (handedness === "Left" || handedness === "Right") {
      return handedness;
    }

    return "None";
  };

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
      const handSide = getTrackedHand(results, 0);
      setHandInfo(`${handSide} hand`);

      const landmarks = results.landmarks[0];
      setLandmarkCount(landmarks.length);
      drawHandConnections(ctx, landmarks, canvas.width, canvas.height);
      drawLandmarks(ctx, landmarks, canvas.width, canvas.height);

      const palletePos = mapHandToPalette(results, 0, 8);
      if (palletePos) {
        setHandCursor(palletePos);
      }

      checkPinchGesture(results, 0);
    } else {
      setHandInfo('None');
      setHandCursor(null);
      setLandmarkCount(0);
    }
  }, [drawHandConnections, drawLandmarks, mapHandToPalette, checkPinchGesture]);

  // Auto-start tracking when component mounts
  useEffect(() => {
    const autoStart = async () => {
      // Wait a bit for tracker to initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (trackerRef.current && videoRef.current && canvasRef.current && !isTracking) {
        try {
          await trackerRef.current.startCamera(videoRef.current, handleResults);
          setIsTracking(true);
        } catch (error) {
          console.error('Failed to auto-start tracking:', error);
        }
      }
    };

    autoStart();
  }, [handleResults, isTracking]);

  return (
    <div className="h-screen p-4 overflow-hidden flex flex-col gap-2">

      <div className="flex flex-row items-center justify-between shrink-0 gap-2">
        {/* Left side: Logo and Title */}
        <div className="flex flex-row items-center gap-2">
          <Image className="h-9 w-9" src="/quill_purple.png" alt="ColorPoet Logo" width={36} height={36} />

          <h1 className="text-3xl font-bold  font-blue-400 bg-linear-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent pb-1">
            ColorPoet
          </h1>
          
          <p className=" pl-1 text-xs text-gray-400 ">Color Poetry Generation ● Hand Tracker</p>
        </div>

        {/* Right side: History Widget */}

        

        <div className="relative flex flex-row items-center gap-2">


          <div 
              className="  flex items-center gap-2 bg-black/40 backdrop-blur-lg rounded-lg shadow-xl  border border-white/20 px-3 py-1 text-xs  h-full">
             {/* Glowing indicator - changes based on isTracking */}
              <span className="relative flex h-2.5 w-2.5">
                {isTracking ? (
                  <>
                    {/* Green pulsing ring when live */}
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  </>
                ) : (
                  <>
                    {/* Red static ring when off */}
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  </>
                )}
              </span>

              <div className="flex flex-col text-gray-200 ">
                <p className={`whitespace-nowrap ${isTracking ? 'text-green-400' : 'text-red-400'}`}>
                  {isTracking ? 'LIVE' : 'OFF'} - <span className="text-white">Hand Tracking</span>
                </p> 
              </div>
          </div>

          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 px-4 py-2 hover:bg-black/60 transition-all"
          >
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-white">History</span>
            <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{poemHistory.length}</span>
          </button>

          {/* History Dropdown */}
          {showHistory && (
            <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-zinc-900/95 backdrop-blur-xl rounded-lg shadow-2xl border border-zinc-700 z-50">
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-3">Recent Poems</h3>
                {poemHistory.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No poems generated yet</p>
                ) : (
                  <div className="space-y-3">
                    {poemHistory.map((entry, index) => (
                      <div key={index} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">{entry.date}</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className="text-xs font-medium" style={{ color: entry.color }}>{entry.colorName}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2 italic">{entry.poem}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Layout: Left Column (Video + Palette) | Right Column (Poem) */}
      <div className="flex gap-4 w-full px-0 flex-1 min-h-0">
        
        {/* LEFT COLUMN: Video on top, Color Palette on bottom */}
        <div className="flex flex-col gap-4 w-1/2 h-full">
          
          {/* Video Feed with Hand Tracking */}
          <div className="relative flex-1 min-h-0 rounded-lg overflow-hidden">
            <VideoFeed videoRef={videoRef} canvasRef={canvasRef} />
            
            {/* Live Camera Label */}
            <div className="absolute top-2 left-2 flex items-center gap-2 bg-transparent  rounded-lg   px-3 py-1.5 ">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-white">Live Camera</span>
            </div>
            
            {/* Hand Tracking Status */}
            {isTracking && (
              <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/40 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 px-3 py-1 text-xs w-40">
    
                {/* Pulsing live indicator */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                </span>

                <div className="flex flex-col text-gray-200 ">
                  <p className="whitespace-nowrap">Tracking: {handInfo}</p>
                  <p className="text-gray-300">{landmarkCount} points detected</p>              
                </div>
              </div>
            )}
          </div>

          {/* Color Palette */}
          <div className="flex-1 min-h-0">
            <ColorPalette colors={colorPalette} paletteRef={palleteContainerRef} colorName={selectedColorName} colorValue={selectedColor} />
          </div>
          
        </div>

        {/* RIGHT COLUMN: Poem Card - Full height */}
        <div className="w-1/2 h-full">
          <PoemCard color={selectedColor} colorName={selectedColorName} onPoemGenerated={addToHistory} />
        </div>
        
      </div>


      {/* Hand Cursor Overlay */}
      <HandCursor position={handCursor} />

      
    </div>
  );
}
