/**
 * HandTracker.ts
 * 
 * This class wraps MediaPipe's Hand Landmark Detection functionality.
 * MediaPipe Hands detects 21 landmarks per hand in real-time from video/camera feed.
 * 
 * Key MediaPipe Concepts:
 * 1. FilesetResolver - Downloads and loads the necessary WASM files
 * 2. HandLandmarker - The main detector that processes video frames
 * 3. Landmarks - 21 3D points representing hand joints (palm, fingers, etc.)
 * 4. Running Mode - Can be IMAGE, VIDEO, or LIVE_STREAM
 */

import { 
  HandLandmarker, 
  FilesetResolver, 
  HandLandmarkerResult 
} from "@mediapipe/tasks-vision";

export interface HandTrackerConfig {
  // Number of hands to detect (1 or 2)
  numHands?: number;
  // Minimum confidence for hand detection (0-1)
  minHandDetectionConfidence?: number;
  // Minimum confidence for hand tracking (0-1)
  minHandPresenceConfidence?: number;
  // Minimum confidence for landmark detection (0-1)
  minTrackingConfidence?: number;
}

export class HandTracker {
  private handLandmarker: HandLandmarker | null = null;
  private isInitialized = false;
  private videoElement: HTMLVideoElement | null = null;
  private animationFrameId: number | null = null;

  /**
   * Initialize MediaPipe Hand Landmarker
   * This downloads the necessary model files (about 3MB) from CDN
   */
  async initialize(config: HandTrackerConfig = {}) {
    try {
      // Step 1: Load the MediaPipe vision task files
      // FilesetResolver fetches WASM binaries and model files
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Step 2: Create the HandLandmarker instance
      // This is the main object that processes video frames
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          // The pre-trained model file for hand detection
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU" // Use GPU acceleration if available
        },
        runningMode: "VIDEO", // VIDEO mode for continuous camera feed
        numHands: config.numHands || 2, // Detect up to 2 hands
        minHandDetectionConfidence: config.minHandDetectionConfidence || 0.5,
        minHandPresenceConfidence: config.minHandPresenceConfidence || 0.5,
        minTrackingConfidence: config.minTrackingConfidence || 0.5,
      });

      this.isInitialized = true;
      console.log("✅ MediaPipe Hand Tracker initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Hand Tracker:", error);
      return false;
    }
  }

  /**
   * Start camera and begin hand tracking
   * @param onResults - Callback function that receives detection results each frame
   */
  async startCamera(
    videoElement: HTMLVideoElement,
    onResults: (results: HandLandmarkerResult) => void
  ) {
    if (!this.isInitialized || !this.handLandmarker) {
      throw new Error("HandTracker not initialized. Call initialize() first.");
    }

    this.videoElement = videoElement;

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 1280, 
          height: 720,
          facingMode: "user" // Front camera
        }
      });

      videoElement.srcObject = stream;
      videoElement.addEventListener("loadeddata", () => {
        this.processVideoFrame(onResults);
      });

      console.log("📹 Camera started");
    } catch (error) {
      console.error("❌ Failed to access camera:", error);
      throw error;
    }
  }

  /**
   * Process each video frame for hand detection
   * This runs continuously in a loop using requestAnimationFrame
   */
  private processVideoFrame(onResults: (results: HandLandmarkerResult) => void) {
    if (!this.videoElement || !this.handLandmarker) return;

    const detectFrame = () => {
      if (!this.videoElement || !this.handLandmarker) return;

      // Detect hands in the current video frame
      // performance.now() provides timestamp for motion tracking
      const results = this.handLandmarker.detectForVideo(
        this.videoElement,
        performance.now()
      );

      // Call the callback with detection results
      onResults(results);

      // Continue processing next frame
      this.animationFrameId = requestAnimationFrame(detectFrame);
    };

    detectFrame();
  }

  /**
   * Stop camera and hand tracking
   */
  stop() {
    // Stop the animation loop
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop camera stream
    if (this.videoElement?.srcObject) {
      const stream = this.videoElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }

    console.log("⏹️ Hand tracking stopped");
  }

  /**
   * Clean up resources
   */
  dispose() {
    this.stop();
    this.handLandmarker?.close();
    this.handLandmarker = null;
    this.isInitialized = false;
  }

  /**
   * Utility: Get normalized position of a specific landmark
   * @param results - Detection results
   * @param handIndex - Which hand (0 or 1)
   * @param landmarkIndex - Which landmark (0-20)
   * @returns {x, y, z} coordinates normalized to 0-1
   * 
   * Key Landmark Indices:
   * 0: Wrist
   * 4: Thumb tip
   * 8: Index finger tip
   * 12: Middle finger tip
   * 16: Ring finger tip
   * 20: Pinky tip
   */
  getLandmark(results: HandLandmarkerResult, handIndex: number, landmarkIndex: number) {
    if (!results.landmarks[handIndex]) return null;
    return results.landmarks[handIndex][landmarkIndex];
  }

  /**
   * Utility: Calculate distance between two landmarks
   */
  getDistance(
    results: HandLandmarkerResult,
    handIndex: number,
    landmark1: number,
    landmark2: number
  ): number | null {
    const p1 = this.getLandmark(results, handIndex, landmark1);
    const p2 = this.getLandmark(results, handIndex, landmark2);
    
    if (!p1 || !p2) return null;

    return Math.sqrt(
      Math.pow(p2.x - p1.x, 2) +
      Math.pow(p2.y - p1.y, 2) +
      Math.pow(p2.z - p1.z, 2)
    );
  }
}
