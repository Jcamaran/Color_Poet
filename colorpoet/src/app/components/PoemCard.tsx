'use client';

import { useState, useEffect } from 'react';
import { memo } from 'react';

interface PoemCardProps {
  color: string | null;
  colorName: string | null;
}

const PoemCard = memo(function PoemCard({ color, colorName }: PoemCardProps) {
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error('Error generating poem:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate poem. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generatePoem();
  }, [color, colorName]);

  if (!color) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/50">
        <p className="text-center text-zinc-500 text-lg">
          👆 Pinch a color to generate a poem
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div 
        className="p-8 rounded-lg shadow-2xl border-2 transition-all duration-300"
        style={{
          backgroundColor: `${color}22`,
          borderColor: color,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Poem for <span style={{ color }}>{colorName}</span>
          </h2>
          <div 
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Poem Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="ml-4 text-zinc-300 text-lg">Composing your poem...</p>
          </div>
        )}

        {error && (
          <div className="py-8 text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {poem && !isLoading && (
          <div className="prose prose-invert max-w-none">
            <div className="text-white text-lg leading-relaxed whitespace-pre-line font-serif italic">
              {poem}
            </div>
          </div>
        )}

        {/* Color Info */}
        <div className="mt-6 pt-4 border-t border-zinc-700">
          <p className="text-sm text-zinc-400">
            Color: <span className="font-mono">{color}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default PoemCard;
