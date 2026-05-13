'use client';

import { ExternalLink, BookOpen, Sparkles, Palette, Feather } from 'lucide-react';
import { hslToHex } from '../utils/colorUtils';
import Image from 'next/image';
import type { AuthorInfo } from '../utils/AuthorBios';

interface PoemDetailsProps {
  showGenerated: boolean;
  color: string | null;
  colorName: string | null;
  poemTitle?: string;
  poemAuthor?: string;
  authorInfo?: AuthorInfo;
  colorMeanings?: string[];
  poemType?: string | null;
}

export default function PoemDetails({
  showGenerated,
  color,
  colorName,
  poemTitle,
  poemAuthor,
  authorInfo,
  colorMeanings,
  poemType
}: PoemDetailsProps) {
  const hexColor = color ? hslToHex(color) : null;

  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-white/8 bg-slate-950/30 backdrop-blur-md lg:h-full">

      {/* ── GENERATED POEM VIEW ── */}
      {showGenerated && color && colorName && (
        <>
          {/* Section: Color Swatch */}
          <div className="shrink-0 p-4 border-b border-white/8">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Selected Color</p>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl border border-white/20 shadow-lg shadow-black/40 shrink-0"
                style={{ backgroundColor: color }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-semibold text-base leading-tight">{colorName}</span>
                <span className="text-slate-400 font-mono text-xs mt-0.5">{hexColor}</span>
              </div>
            </div>
          </div>

          {/* Section: Poem Info */}
          <div className="shrink-0 p-4 border-b border-white/8">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-3">Poem Info</p>
            <div className="flex flex-col gap-2">
              {poemTitle && (
                <div className="flex items-start gap-2">
                  <Feather className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-200 italic leading-snug">&ldquo;{poemTitle}&rdquo;</span>
                </div>
              )}
              {poemType && (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-xs text-slate-300 capitalize px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{poemType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Color Meanings — fills remaining height on desktop */}
          <div className="min-h-30 lg:flex-1 lg:min-h-0 flex flex-col p-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Color Symbolism</p>
            </div>

            {colorMeanings && colorMeanings.length > 0 ? (
              <div className="max-h-40 lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto flex flex-col gap-2 pr-1
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {colorMeanings.map((meaning, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/8 hover:bg-white/7 transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-1 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-slate-200 leading-relaxed capitalize">{meaning}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-slate-600 italic">No symbolism data</p>
              </div>
            )}
          </div>

          {/* Footer status */}
          <div className="shrink-0 px-4 py-3 border-t border-white/8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">AI Generated</span>
          </div>
        </>
      )}

      {/* ── ORIGINAL POEM VIEW ── */}
      {!showGenerated && poemAuthor && (
        <>
          {/* Section: Author label */}
          <div className="shrink-0 px-4 pt-4 pb-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-500">About the Author</p>
          </div>

          {/* Section: Author image */}
          {authorInfo?.imagePath && (
            <div className="shrink-0 px-4 pb-3">
              <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/40">
                <Image
                  src={authorInfo.imagePath}
                  alt={poemAuthor}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                {/* Gradient overlay for name */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm leading-tight">{poemAuthor}</p>
                  {authorInfo?.years && (
                    <p className="text-slate-300 text-xs mt-0.5">{authorInfo.years}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* If no image, show name plainly */}
          {!authorInfo?.imagePath && (
            <div className="shrink-0 px-4 pb-3 border-b border-white/8">
              <p className="text-white font-semibold text-base">{poemAuthor}</p>
              {authorInfo?.years && <p className="text-slate-400 text-xs mt-0.5">{authorInfo.years}</p>}
            </div>
          )}

          {/* Section: Bio — fills remaining height on desktop */}
          {authorInfo?.bio && (
            <div className="flex flex-col px-4 pb-3 overflow-hidden lg:flex-1 lg:min-h-0">
              <div className="max-h-32 lg:max-h-none lg:flex-1 lg:min-h-0 overflow-y-auto
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">
                <p className="text-sm text-slate-300 leading-relaxed">{authorInfo.bio}</p>
              </div>
            </div>
          )}

          {/* Section: Links */}
          {authorInfo && (
            <div className="shrink-0 flex flex-col gap-2 px-4 pb-4 border-t border-white/8 pt-3">
              <a
                href={authorInfo.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 text-slate-300 hover:text-white transition-all text-xs font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                Wikipedia
              </a>
              {authorInfo.poetryFoundationUrl && (
                <a
                  href={authorInfo.poetryFoundationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 text-slate-300 hover:text-white transition-all text-xs font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  Poetry Foundation
                </a>
              )}
            </div>
          )}

          {/* Footer status */}
          <div className="shrink-0 px-4 py-3 border-t border-white/8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">Classic Poem</span>
          </div>
        </>
      )}
    </div>
  );
}

