import React from 'react';
import {
  Clock,
  Youtube,
  CheckCircle,
  Bookmark,
  Share2,
  Paperclip,
  ArrowUpRight,
} from 'lucide-react';
import type { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isFavorite: boolean;
  onOpen: (lesson: Lesson) => void;
  onToggleComplete: (e: React.MouseEvent, id: string) => void;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onShare: (e: React.MouseEvent, lesson: Lesson) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Mentalidad: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  Marketing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  Hábitos: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  Herramientas: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  Productividad: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  Estrategia: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  Finanzas: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
};

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  isCompleted,
  isFavorite,
  onOpen,
  onToggleComplete,
  onToggleFavorite,
  onShare,
}) => {
  const catStyle = CATEGORY_COLORS[lesson.category] || {
    bg: 'bg-zinc-800',
    text: 'text-zinc-300',
    border: 'border-zinc-700',
  };

  return (
    <article
      onClick={() => onOpen(lesson)}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${
        isCompleted
          ? 'border-zinc-800/80 bg-zinc-950/70 opacity-90 hover:opacity-100 hover:border-zinc-700'
          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/90 shadow-md hover:shadow-xl hover:shadow-black/40'
      }`}
    >
      <div>
        {/* Top bar: Category + Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {lesson.category}
            </span>
            {lesson.isDaily && (
              <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[11px] font-bold text-amber-400">
                ★ Lección del Día
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => onToggleFavorite(e, lesson.id)}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
            >
              <Bookmark
                className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>
            <button
              onClick={(e) => onShare(e, lesson)}
              title="Compartir enlace"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2">
          {lesson.title}
        </h3>

        {/* Teaser Summary */}
        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
          {lesson.summary}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-zinc-500" />
            {lesson.readTimeMinutes} min
          </span>

          {lesson.youtubeUrl && (
            <span className="flex items-center gap-1 text-rose-400" title="Incluye video explicativo">
              <Youtube className="h-3.5 w-3.5" />
              Video
            </span>
          )}

          {lesson.resources && lesson.resources.length > 0 && (
            <span className="flex items-center gap-1 text-blue-400" title="Incluye recursos adicionales">
              <Paperclip className="h-3.5 w-3.5" />
              {lesson.resources.length}
            </span>
          )}
        </div>

        {/* Completion status button */}
        <button
          onClick={(e) => onToggleComplete(e, lesson.id)}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors ${
            isCompleted
              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
              : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          }`}
        >
          <CheckCircle className={`h-3.5 w-3.5 ${isCompleted ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <span>{isCompleted ? 'Completada' : 'Pendiente'}</span>
        </button>
      </div>
    </article>
  );
};
