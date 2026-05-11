'use client';

import { Palette, FileText, ExternalLink, BookOpen } from 'lucide-react';
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
  return (
    <div className="flex flex-col gap-1 p-6 bg-slate-950/20 rounded-xl border border-slate-700/30 backdrop-blur-sm h-full">
   

      {/* Original Poem Info */}
      {!showGenerated && poemTitle && poemAuthor && (
        <>
          
          
          {/* Author with Image */}
          <div className="flex items-start gap-3">
           
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wide">About The Author</span>
              </div>
              
              {authorInfo?.imagePath && (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-700/50">
                  <Image
                    src={authorInfo.imagePath}
                    alt={poemAuthor}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />

                </div>
              )}
              <div className="flex flex-col">
                <span className="text-lg text-white font-medium">{poemAuthor}</span>
                {authorInfo?.years && (
                  <span className="text-sm text-slate-400">({authorInfo.years})</span>
                )}
              </div>
            </div>
          </div>
          
          {authorInfo?.bio && (
            <div className="flex items-start gap-3">
            
              <div className="flex flex-col gap-3 w-full">
                <p className="text-xs text-slate-300 leading-relaxed mt-0">{authorInfo.bio}</p>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  <a
                    href={authorInfo.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-start gap-2 px-4 py-2 bg-inherit hover:bg-slate-700/50 text-slate-200 rounded-lg text-xs font-medium transition-all border border-slate-700/50 hover:border-slate-600"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Learn More
                  </a>
                  
                  {authorInfo.poetryFoundationUrl && (
                    <a
                      href={authorInfo.poetryFoundationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-start gap-2 px-4 py-2 bg-inherit hover:bg-slate-700/50 text-slate-200 rounded-lg text-xs font-medium transition-all border border-slate-700/50 hover:border-slate-600"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read More Poems
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Color Info for Generated Poem */}
      {showGenerated && color && colorName && (
        <>
          <div className="flex items-start gap-3">
            <Palette className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Color</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border-2 border-white/50 shadow-lg"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col">
                  <span className="text-sm text-white font-mono">{hslToHex(color)}</span>
                  <span className="text-xs text-slate-400">{colorName}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Title</span>
              <span className="text-sm text-white italic">&ldquo;{poemTitle}&rdquo;</span>
              <span className="text-xs text-slate-400 mt-0.5">{poemAuthor}</span>
            </div>
          </div>

          {/* Poem Type */}
          {poemType && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wide">Style</span>
                <span className="text-sm text-white capitalize">{poemType}</span>
              </div>
            </div>
          )}

          {/* Color Meanings */}
          {colorMeanings && colorMeanings.length > 0 && (
            <div className="flex items-start gap-3">
              <Palette className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-2">
                <span className="text-xs text-slate-400 uppercase tracking-wide">Symbolism</span>
                <div className="flex flex-wrap gap-2">
                  {colorMeanings.map((meaning, i) => (
                    <span 
                      key={i} 
                      className="text-xs text-slate-300 px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 capitalize"
                    >
                      {meaning}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Status */}
      <div className="mt-0 pt-4 ">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${showGenerated ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`} />
          <span className="text-xs text-slate-400">
            {showGenerated ? 'AI Generated Poem' : 'Original Classic Poem'}
          </span>
        </div>
      </div>
    </div>
  );
}
