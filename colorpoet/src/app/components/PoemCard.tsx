'use client';

import { useState, useEffect } from 'react';
import { memo } from 'react';

import { getTodaysPoem} from '../utils/DailyPoem';

interface PoemCardProps {
  color: string | null;
  colorName: string | null;
  onPoemGenerated?: (color: string, colorName: string, poem: string) => void;
}


const today = new Date();

const formmattedDate = today.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const todaysPoem = getTodaysPoem();

const PoemCard = memo(function PoemCard({ color, colorName, onPoemGenerated }: PoemCardProps) {
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic font size based on poem length
  const getPoemFontSize = (text: string | null) => {
    if (!text) return 'text-xl';
    const length = text.length;
    if (length < 150) return 'text-xl';
    if (length < 250) return 'text-lg';
    if (length < 400) return 'text-lg';
    return 'text-lg';
  };

  // Dynamic font size for daily poem
  const getDailyPoemFontSize = () => {
    const totalLength = todaysPoem.lines.join('').length;
    if (totalLength < 200) return 'text-lg';
    if (totalLength < 400) return 'text-base';
    return 'text-sm';
  };

  useEffect(() => {
    if (!color || !colorName) {
      setPoem(null);
      setError(null);
      return;
    }

    const generatePoem = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/poem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ color, colorName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
          throw new Error(errorData.details || errorData.error || 'Failed to generate poem');
        }

        const data = await response.json();
        setPoem(data.poem);
        
        // Add to history
        if (onPoemGenerated) {
          onPoemGenerated(color, colorName, data.poem);
        }
      } catch (err) {
        console.error('Error generating poem:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate poem. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generatePoem();
  }, [color, colorName, onPoemGenerated]);



  return (
    <div className="w-full h-full flex flex-col gap-6 p-0">
      {/* Today's Source Poem */}
      <div className="rounded-2xl bg-linear-to-br from-slate-950/90 to-slate-900/90 backdrop-blur-sm border border-gray-300/30 shadow-2xl p-4 flex-1 min-h-0 flex flex-col w-full ">
        {/* Date Header */}
        <div className="text-center mb-6 border-b border-slate-700/50 pb-4 shrink-0">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Today&apos;s Poem</p>
          <h2 className="text-2xl font-ui font-light text-white mb-1">{formmattedDate}</h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="h-px w-12 bg-linear-to-r from-transparent to-slate-600"></div>
            <span className="text-slate-500 text-xs">✦</span>
            <div className="h-px w-12 bg-linear-to-l from-transparent to-slate-600"></div>
          </div>
        </div>

        {/* Poem Title & Author */}
        <div className="text-center mb-4 shrink-0">
          <h3 className="text-xl font-poem font-semibold text-slate-100 mb-2 italic">
            &ldquo;{todaysPoem.title}&rdquo;
          </h3>
          <p className="text-slate-400 text-sm font-ui">by {todaysPoem.author}</p>
        </div>
    
        {/* Poem Lines with dynamic sizing and overflow */}
        <div className={`flex flex-col items-center justify-center w-full min-h-0 overflow-y-auto font-poem ${getDailyPoemFontSize()} leading-relaxed text-slate-200 text-center space-y-1 max-w-xl mx-auto px-5`}>
          {todaysPoem.lines.map((line, index) => (
            <p key={index} className="transition-all hover:text-white">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Generated Color Poem */}
      
    </div>
  );
});

export default PoemCard;
