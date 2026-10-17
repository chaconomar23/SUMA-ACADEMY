import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  Calendar,
  CheckCircle2,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Video,
  Wrench,
  Link as LinkIcon,
  Sparkles,
  Type,
} from 'lucide-react';
import type { Lesson, ResourceLink } from '../types';
import { FormattedContent } from './FormattedContent';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface LessonReaderProps {
  lesson: Lesson;
  isCompleted: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleComplete: (lessonId: string) => void;
  onToggleFavorite: (lessonId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onShare: (lesson: Lesson) => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  lesson,
  isCompleted,
  isFavorite,
  onClose,
  onToggleComplete,
  onToggleFavorite,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onShare,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  const embedUrl = getYouTubeEmbedUrl(lesson.youtubeUrl);

  const handleCompleteClick = () => {
    onToggleComplete(lesson.id);
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#fbbf24'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }
  };

  const getResourceIcon = (type?: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="h-4 w-4 text-emerald-400" />;
      case 'tool':
        return <Wrench className="h-4 w-4 text-amber-400" />;
      case 'video':
        return <Video className="h-4 w-4 text-rose-400" />;
      default:
        return <LinkIcon className="h-4 w-4 text-blue-400" />;
    }
  };

  const fontSizeClass =
    fontSize === 'normal'
      ? 'text-base sm:text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-relaxed'
      : 'text-xl sm:text-2xl leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[95vh] rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Top Sticky Navigation Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800/90 bg-zinc-950/95 px-4 sm:px-6 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-semibold text-amber-300">
              {lesson.category}
            </span>
            {lesson.isDaily && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3 w-3" />
                Lección del Día
              </span>
            )}
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font size toggle */}
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs text-zinc-400">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'normal' ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'}`}
                title="Tamaño de texto normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'large' ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'}`}
                title="Tamaño de texto mediano"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded-lg ${fontSize === 'xlarge' ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'}`}
                title="Tamaño de texto grande"
              >
                A++
              </button>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(lesson.id)}
              className={`rounded-xl border p-2 transition-colors ${
                isFavorite
                  ? 'border-amber-400/40 bg-amber-400/10 text-amber-400'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white'
              }`}
              title={isFavorite ? 'Quitar de guardadas' : 'Guardar lección'}
            >
              <Bookmark className={`h-4 w-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share button */}
            <button
              onClick={() => onShare(lesson)}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-2 text-zinc-400 hover:text-white transition-colors"
              title="Compartir lección"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors ml-1"
              title="Cerrar lectura (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Content */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-8 space-y-8">
          {/* Header Title & Meta */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {lesson.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-400 pb-4 border-b border-zinc-800">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-400" />
                {lesson.readTimeMinutes} minutos estimados
              </span>

              {lesson.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  {lesson.publishedAt}
                </span>
              )}

              <span>
                Por: <strong className="text-zinc-200">{lesson.author}</strong>
              </span>
            </div>

            {/* Summary highlight */}
            <div className="rounded-2xl border-l-4 border-amber-400 bg-zinc-900/90 p-4 sm:p-5 text-zinc-200">
              <p className="text-base sm:text-lg italic font-medium leading-relaxed">
                "{lesson.summary}"
              </p>
            </div>
          </div>

          {/* Embedded YouTube Video (if provided) */}
          {embedUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                <Video className="h-4 w-4" />
                <span>Video Explicativo de Apoyo</span>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-xl">
                <iframe
                  src={embedUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          )}

          {/* Main Lesson Body Text */}
          <div className="pt-2">
            <FormattedContent content={lesson.content} fontSizeClass={fontSizeClass} />
          </div>

          {/* Resources & Attachments */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-amber-400" />
                <span>Recursos y Materiales de Apoyo</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.resources.map((res: ResourceLink, index: number) => (
                  <a
                    key={index}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 text-sm text-zinc-200 transition-all hover:border-amber-400/40 hover:bg-zinc-800 hover:text-white group"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {getResourceIcon(res.type)}
                      <span className="truncate font-medium">{res.title}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Completion Callout */}
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">
                {isCompleted ? '¡Lección completada con éxito!' : '¿Terminaste de estudiar esta lección?'}
              </h4>
              <p className="text-sm text-zinc-400 max-w-md mx-auto">
                {isCompleted
                  ? 'Tu progreso está registrado en tu navegador y suma a tu racha de aprendizaje.'
                  : 'Márcala como completada para guardar tu progreso personal y mantener viva tu racha.'}
              </p>
            </div>
            <button
              onClick={handleCompleteClick}
              className={`inline-flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm sm:text-base font-bold transition-all shadow-lg ${
                isCompleted
                  ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:brightness-110 active:scale-[0.98] shadow-amber-500/20'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-zinc-800 bg-zinc-950 px-4 sm:px-6 py-3">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              hasPrev
                ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                : 'opacity-40 cursor-not-allowed text-zinc-600'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          <span className="text-xs text-zinc-500 hidden sm:inline">
            Presiona Esc para volver al feed
          </span>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              hasNext
                ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                : 'opacity-40 cursor-not-allowed text-zinc-600'
            }`}
          >
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
