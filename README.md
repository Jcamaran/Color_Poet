# ColorPoet

Generate original AI poetry from colors — using your hand as the brush.

ColorPoet uses your webcam and real-time hand tracking to let you select a color from a palette by pinching. That color is sent to Google Gemini, which writes a poem inspired by its mood and symbolism. A live WebGL aurora background shifts to match the color vibe of each poem.

![ColorPoet](public/quill_purple.png)

## Features

- **Hand Tracking** — MediaPipe detects your hand in the webcam feed; a pinch gesture confirms your color pick
- **AI Poem Generation** — Google Gemini (`gemini-2.5-flash-lite`) writes a poem based on the selected color, including a title, poem type, and color symbolism
- **Dynamic Aurora** — WebGL aurora background (OGL) transitions smoothly to reflect the current color palette
- **Daily Classic Poem** — A curated classic poem cycles each day of the year with its own color vibe
- **Author Bios** — Rich author details (bio, image, Wikipedia & Poetry Foundation links) for all classic poets
- **Poem Tools** — Copy, save as `.txt`, share, and adjust font size

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Google Gemini (`@google/genai`) |
| Hand Tracking | MediaPipe Tasks Vision |
| WebGL | OGL |
| Icons | Lucide React |

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file and add your Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and allow camera access.

## Project Structure

```
src/app/
  api/poem/route.ts     # Gemini API route
  components/
    Aurora.tsx          # WebGL aurora background
    ColorGrid.tsx       # Main layout: camera, palette, poem card
    ColorPalette.tsx    # Color swatches + hand interaction
    PoemCard.tsx        # Poem display with aurora
    PoemDetails.tsx     # Author info / color symbolism panel
    VideoFeed.tsx       # Webcam feed + hand landmark canvas
  utils/
    AuthorBios.ts       # Classic poet bios + image paths
    colorUtils.ts       # HSL/hex color helpers + aurora color mapping
    DailyPoem.ts        # 31 curated poems with daily rotation + color vibes
```

## Deployment

Deploy to [Vercel](https://vercel.com) and set `GEMINI_API_KEY` as an environment variable in the project settings.
