'use client';

import { Calendar, Palette, FileText } from 'lucide-react';
import { hslToHex } from '../utils/colorUtils';

interface PoemDetailsProps {
  showGenerated: boolean;
  color: string | null;
  colorName: string | null;
  poemTitle?: string;
  poemAuthor?: string;
  date: string;
}

export default function PoemDetails({
  showGenerated,
  color,
  colorName,
  poemTitle,
  poemAuthor,
  date
}: PoemDetailsProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-950/20 rounded-lg border border-slate-700/30 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Details
      </h3>

      {/* Date */}
      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase tracking-wide">Date</span>
          <span className="text-sm text-white">{date}</span>
        </div>
      </div>

      {/* Original Poem Info */}
      {!showGenerated && poemTitle && poemAuthor && (
        <>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Title</span>
              <span className="text-sm text-white italic">&ldquo;{poemTitle}&rdquo;</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wide">Author</span>
              <span className="text-sm text-white">{poemAuthor}</span>
            </div>
          </div>
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
              <span className="text-xs text-slate-400 uppercase tracking-wide">Source</span>
              <span className="text-sm text-white italic">&ldquo;{poemTitle}&rdquo;</span>
              <span className="text-xs text-slate-400 mt-0.5">by {poemAuthor}</span>
            </div>
          </div>
        </>
      )}

      {/* Status */}
      <div className="mt-2 pt-4 border-t border-slate-700/30">
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
