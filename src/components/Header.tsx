import React from 'react';
import { Flame, CheckCircle2, Bookmark, Search, BookOpen } from 'lucide-react';

interface HeaderProps {
  completedCount: number;
  totalLessons: number;
  streakDays: number;
  favoritesCount: number;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  showUncompletedOnly: boolean;
  onToggleUncompletedOnly: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalLessons,
  streakDays,
  favoritesCount,
  searchTerm,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  showUncompletedOnly,
  onToggleUncompletedOnly,
}) => {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Logo & Brand Ethos */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 font-black text-xl shadow-lg shadow-amber-500/20">
                +
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold tracking-tight text-white text-lg sm:text-xl">
                    SUMA<span className="text-amber-400">+</span>
                  </span>
                  <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-zinc-300 uppercase">
                    ACADEMY
                  </span>
                </div>
                <p className="text-xs text-zinc-400 hidden sm:block">
                  Aprende 1% cada día • Conocimiento accionable
                </p>
              </div>
            </div>

            {/* Mobile streak badge */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{streakDays} {streakDays === 1 ? 'día' : 'días'}</span>
              </div>
            </div>
          </div>

          {/* Search bar & Live student progress indicators */}
          <div className="flex flex-1 items-center justify-end gap-2.5 sm:gap-4 md:max-w-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar lecciones, conceptos o temas..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-1.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter buttons */}
            <button
              onClick={onToggleFavoritesOnly}
              title="Ver favoritas guardadas"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                showFavoritesOnly
                  ? 'border-amber-400 bg-amber-400/15 text-amber-300'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Favoritas</span>
              {favoritesCount > 0 && (
                <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-300">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Streak & Progress */}
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-zinc-800">
              <div
                className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400"
                title="Racha de días completando lecciones"
              >
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
                <span>{streakDays} {streakDays === 1 ? 'día' : 'días'}</span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300"
                title={`${completedCount} de ${totalLessons} lecciones completadas (${percent}%)`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{completedCount}/{totalLessons}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
