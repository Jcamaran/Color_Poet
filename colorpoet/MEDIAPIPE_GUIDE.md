# MediaPipe Hand Tracking Guide

## 🎯 What is MediaPipe?

MediaPipe is Google's framework for building perception pipelines. The **Hand Landmarker** detects 21 3D landmarks on each hand in real-time from video or images.

### Key Components

1. **FilesetResolver** - Downloads WASM files and initializes the runtime
2. **HandLandmarker** - The main detector that processes frames
3. **Landmarks** - 21 points representing hand joints (x, y, z coordinates)
4. **Running Modes**:
   - `IMAGE` - Process single images
   - `VIDEO` - Process video files
   - `LIVE_STREAM` - Real-time camera feed with async callbacks

---

## 🖐️ Hand Landmark Structure

MediaPipe detects **21 landmarks per hand**:

```
      8   12  16  20    (fingertips)
      |   |   |   |
      7   11  15  19
      |   |   |   |
      6   10  14  18
      |   |   |   |
  4   5   9   13  17
  |   └───┴───┴───┘
  3        (palm)
  |
  2
  |
  1
  |
  0 (wrist)
```

### Landmark Indices:
- **0**: Wrist
- **1-4**: Thumb (1=base, 4=tip)
- **5-8**: Index finger (5=base, 8=tip)
- **9-12**: Middle finger
- **13-16**: Ring finger
- **17-20**: Pinky

### Coordinate System:
- **x**: Horizontal (0=left, 1=right)
- **y**: Vertical (0=top, 1=bottom)
- **z**: Depth (negative=closer to camera)
- All coordinates are **normalized** (0 to 1)

---

## 🔧 Configuration Options

### In `HandTracker.initialize()`:

```typescript
{
  numHands: 2,                        // How many hands to detect (1-2)
  minHandDetectionConfidence: 0.5,    // Confidence threshold (0-1)
  minHandPresenceConfidence: 0.5,     // Tracking confidence (0-1)
  minTrackingConfidence: 0.5,         // Landmark confidence (0-1)
}
```

#### Tweaking Tips:
- **Lower confidence** (0.3-0.4) = More detections, more false positives
- **Higher confidence** (0.7-0.9) = Fewer false positives, may miss hands
- Start with 0.5 and adjust based on your use case

### Model Options:

```typescript
baseOptions: {
  modelAssetPath: "path/to/model.task",
  delegate: "GPU" // or "CPU"
}
```

- **GPU**: Faster, uses WebGL (recommended)
- **CPU**: Slower, more compatible

---

## 🎨 Common Use Cases & Tweaks

### 1. **Gesture Recognition**

Detect specific hand gestures:

```typescript
// Detect "thumbs up"
function isThumbsUp(results: HandLandmarkerResult, handIndex: number): boolean {
  const thumb = results.landmarks[handIndex];
  // Check if thumb tip (4) is above wrist (0)
  return thumb[4].y < thumb[0].y;
}

// Detect "pointing"
function isPointing(results: HandLandmarkerResult, handIndex: number): boolean {
  const hand = results.landmarks[handIndex];
  // Index finger extended, others curled
  const indexExtended = hand[8].y < hand[6].y;
  const middleCurled = hand[12].y > hand[10].y;
  return indexExtended && middleCurled;
}
```

### 2. **Pinch Detection**

Already implemented in `ColorGrid.tsx`:

```typescript
const distance = tracker.getDistance(results, handIndex, 4, 8);
if (distance < 0.05) {
  // Pinch detected!
}
```

**Tweak the threshold**:
- `< 0.03` = Very tight pinch
- `< 0.08` = Loose pinch

### 3. **Hand Position Tracking**

Track overall hand position using wrist (landmark 0):

```typescript
const wrist = tracker.getLandmark(results, 0, 0);
if (wrist) {
  // wrist.x and wrist.y are normalized (0-1)
  const screenX = wrist.x * window.innerWidth;
  const screenY = wrist.y * window.innerHeight;
}
```

### 4. **Two-Hand Interactions**

Detect when both hands are present:

```typescript
if (results.landmarks.length === 2) {
  const leftHand = results.landmarks[0];
  const rightHand = results.landmarks[1];
  
  // Calculate distance between hands
  const distance = Math.sqrt(
    Math.pow(rightHand[0].x - leftHand[0].x, 2) +
    Math.pow(rightHand[0].y - leftHand[0].y, 2)
  );
}
```

### 5. **Finger Counting**

Detect how many fingers are extended:

```typescript
function countFingers(results: HandLandmarkerResult, handIndex: number): number {
  const hand = results.landmarks[handIndex];
  let count = 0;
  
  // Check each fingertip vs base
  const fingerTips = [8, 12, 16, 20]; // Index, middle, ring, pinky
  const fingerBases = [6, 10, 14, 18];
  
  for (let i = 0; i < fingerTips.length; i++) {
    if (hand[fingerTips[i]].y < hand[fingerBases[i]].y) {
      count++;
    }
  }
  
  // Special check for thumb (sideways)
  if (hand[4].x < hand[3].x) count++;
  
  return count;
}
```

---

## 🚀 Performance Optimization

### 1. **Reduce Processing Rate**

Don't process every frame:

```typescript
let frameCount = 0;
const processFrame = () => {
  frameCount++;
  if (frameCount % 2 === 0) { // Process every 2nd frame
    const results = handLandmarker.detectForVideo(video, performance.now());
    onResults(results);
  }
  requestAnimationFrame(processFrame);
};
```

### 2. **Lower Video Resolution**

```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { 
    width: 640,  // Lower from 1280
    height: 480  // Lower from 720
  }
});
```

### 3. **Use CPU Mode for Compatibility**

Some devices don't have GPU acceleration:

```typescript
baseOptions: {
  delegate: "CPU"
}
```

---

## 🎓 Learning Resources

### Official Documentation
- [MediaPipe Hands Guide](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker)
- [Web Demo](https://mediapipe-studio.webapps.google.com/demo/hand_landmarker)
- [API Reference](https://developers.google.com/mediapipe/api/solutions/js/tasks-vision.handlandmarker)

### Interactive Examples
- Try the [MediaPipe Studio](https://mediapipe-studio.webapps.google.com/) to experiment with settings
- Check the [GitHub Samples](https://github.com/google/mediapipe/tree/master/docs/solutions)

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to initialize Hand Tracker"
**Solutions:**
- Check internet connection (models download from CDN)
- Try using `delegate: "CPU"` instead of GPU
- Verify CORS if self-hosting models

### Issue: "Camera access denied"
**Solutions:**
- Check browser permissions
- Use HTTPS (required for camera access)
- Try `npm run dev` instead of opening file directly

### Issue: Hand not detected
**Solutions:**
- Lower `minHandDetectionConfidence` to 0.3
- Ensure good lighting
- Keep hand fully visible in frame
- Try different hand orientation

### Issue: Laggy/slow performance
**Solutions:**
- Reduce video resolution
- Process every 2nd or 3rd frame
- Use `delegate: "GPU"`
- Close other browser tabs

---

## 🎨 Next Steps for ColorPoet

Here are some ideas to extend your project:

1. **Color Palette Extraction**
   - Create a grid of colors on screen
   - Use pinch gesture to select colors
   - Store selected colors in state

2. **Drawing with Hands**
   - Track index fingertip position
   - Draw trails on canvas
   - Use pinch to change colors

3. **Gesture-Based Poetry**
   - Assign words/phrases to different gestures
   - Build poems by performing gesture sequences
   - Use hand position to affect text styling

4. **Two-Hand Color Mixing**
   - Assign colors to each hand
   - Mix colors when hands come together
   - Create gradients based on hand distance

5. **3D Depth Interaction**
   - Use `z` coordinate for depth
   - Change color intensity based on distance from camera
   - Create parallax effects

---

## 📝 Code Snippets to Try

### Change Detection Colors

In `ColorGrid.tsx`, modify `drawLandmarks`:

```typescript
// Rainbow fingertips
const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff'];
if ([4, 8, 12, 16, 20].includes(index)) {
  ctx.fillStyle = colors[Math.floor(index / 4)];
}
```

### Add Gesture Callbacks

In `HandTracker.ts`, add:

```typescript
export interface GestureCallbacks {
  onPinch?: (handIndex: number, position: {x: number, y: number}) => void;
  onPoint?: (handIndex: number, position: {x: number, y: number}) => void;
  onWave?: (handIndex: number) => void;
}
```

### Smooth Tracking

Add smoothing to reduce jitter:

```typescript
class SmoothTracker {
  private history: {x: number, y: number}[] = [];
  private maxHistory = 5;
  
  smooth(point: {x: number, y: number}) {
    this.history.push(point);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    return {
      x: this.history.reduce((sum, p) => sum + p.x, 0) / this.history.length,
      y: this.history.reduce((sum, p) => sum + p.y, 0) / this.history.length,
    };
  }
}
```

---

## 🎉 Have Fun Experimenting!

Start by running the development server:

```bash
npm run dev
```

Then open http://localhost:3000 and click "Start Hand Tracking"!

Try modifying the confidence thresholds, drawing styles, and adding your own gesture detection logic. MediaPipe is powerful and flexible - experiment and see what you can create! 🚀
