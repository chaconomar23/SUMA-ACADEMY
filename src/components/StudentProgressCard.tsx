import React from 'react';
import { Award, CheckCircle2, Flame, Sparkles, Filter } from 'lucide-react';
import type { CategoryFilter } from '../types';

interface StudentProgressCardProps {
  completedCount: number;
  totalLessons: number;
  streakDays: number;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  filterStatus: 'all' | 'pending' | 'completed';
  onSelectFilterStatus: (status: 'all' | 'pending' | 'completed') => void;
}

const CATEGORIES: CategoryFilter[] = [
  'Todos',
  'Mentalidad',
  'Marketing',
  'Hábitos',
  'Herramientas',
  'Productividad',
  'Estrategia',
  'Finanzas',
];

export const StudentProgressCard: React.FC<StudentProgressCardProps> = ({
  completedCount,
  totalLessons,
  streakDays,
  activeCategory,
  onSelectCategory,
  filterStatus,
  onSelectFilterStatus,
}) => {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getRankBadge = (pct: number) => {
    if (pct === 100) return { label: '👑 Maestría SUMA+', color: 'text-amber-300' };
    if (pct >= 60) return { label: '🔥 Mente Imparable', color: 'text-orange-400' };
    if (pct >= 30) return { label: '⚡ En Crecimiento Activo', color: 'text-blue-400' };
    return { label: '🌱 Iniciando el 1% Diario', color: 'text-emerald-400' };
  };

  const rank = getRankBadge(percent);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-5">
      {/* Top row: Progress bar + Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tu Progreso de Aprendizaje
            </h3>
            <span className={`text-xs font-semibold ${rank.color}`}>
              • {rank.label}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Has completado <strong className="text-zinc-200">{completedCount}</strong> de{' '}
            <strong className="text-zinc-200">{totalLessons}</strong> lecciones ({percent}%)
          </p>
        </div>

        {/* Streak summary */}
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 self-start sm:self-center">
          <Flame className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
          <div className="text-left">
            <div className="text-xs font-bold text-amber-300">
              {streakDays} {streakDays === 1 ? 'Día de Racha' : 'Días de Racha'}
            </div>
            <div className="text-[10px] text-zinc-400">¡Sigue el ritmo diario!</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Category Pills & Status Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
        {/* Categories scrollable list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`rounded-xl px-3 py-1.5 font-medium transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Completion status selector */}
        <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/80 p-0.5 text-xs text-zinc-400 self-start sm:self-end">
          <button
            onClick={() => onSelectFilterStatus('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-zinc-800 text-white font-bold'
                : 'hover:text-zinc-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => onSelectFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-zinc-800 text-amber-300 font-bold'
                : 'hover:text-zinc-200'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => onSelectFilterStatus('completed')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-zinc-800 text-emerald-400 font-bold'
                : 'hover:text-zinc-200'
            }`}
          >
            Completadas
          </button>
        </div>
      </div>
    </div>
  );
};
