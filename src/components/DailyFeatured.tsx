import React from 'react';
import {
  Sparkles,
  Clock,
  Youtube,
  ArrowRight,
  CheckCircle,
  Bookmark,
  Share2,
  Paperclip,
} from 'lucide-react';
import type { Lesson } from '../types';

interface DailyFeaturedProps {
  lesson: Lesson;
  isCompleted: boolean;
  isFavorite: boolean;
  onOpenLesson: (lesson: Lesson) => void;
  onToggleComplete: (e: React.MouseEvent, lessonId: string) => void;
  onToggleFavorite: (e: React.MouseEvent, lessonId: string) => void;
  onShare: (e: React.MouseEvent, lesson: Lesson) => void;
}

export const DailyFeatured: React.FC<DailyFeaturedProps> = ({
  lesson,
  isCompleted,
  isFavorite,
  onOpenLesson,
  onToggleComplete,
  onToggleFavorite,
  onShare,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl shadow-amber-950/20">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Top Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-amber-400" />
              La Lección del Día
            </span>

            <span className="rounded-full bg-zinc-800/90 px-3 py-1 text-xs font-medium text-zinc-300 border border-zinc-700/60">
              {lesson.category}
            </span>

            {lesson.publishedAt && (
              <span className="text-xs text-zinc-400">
                {lesson.publishedAt}
              </span>
            )}
          </div>

          {/* Quick interactive actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(e, lesson.id)}
              title={isFavorite ? 'Quitar de guardadas' : 'Guardar lección'}
              className={`rounded-xl border p-2 transition-colors ${
                isFavorite
                  ? 'border-amber-400/50 bg-amber-400/10 text-amber-400'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={(e) => onShare(e, lesson)}
              title="Compartir lección"
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-3 cursor-pointer" onClick={() => onOpenLesson(lesson)}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white transition-colors hover:text-amber-200">
            {lesson.title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl">
            {lesson.summary}
          </p>
        </div>

        {/* Footer info & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" />
              {lesson.readTimeMinutes} min de lectura
            </span>

            {lesson.youtubeUrl && (
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <Youtube className="h-4 w-4" />
                Video explicativo
              </span>
            )}

            {lesson.resources && lesson.resources.length > 0 && (
              <span className="flex items-center gap-1.5 text-blue-400">
                <Paperclip className="h-3.5 w-3.5" />
                {lesson.resources.length} {lesson.resources.length === 1 ? 'recurso' : 'recursos'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Completion toggle button */}
            <button
              onClick={(e) => onToggleComplete(e, lesson.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                isCompleted
                  ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-white'
              }`}
            >
              <CheckCircle className={`h-4 w-4 ${isCompleted ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{isCompleted ? 'Completada' : 'Marcar completada'}</span>
            </button>

            {/* Read CTA */}
            <button
              onClick={() => onOpenLesson(lesson)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <span>{isCompleted ? 'Repasar Lección' : 'Empezar Lección'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
