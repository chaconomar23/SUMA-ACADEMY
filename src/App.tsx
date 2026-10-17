import React, { useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  BookOpen,
  Search,
  Sparkles,
  Flame,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowRight,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import type { Lesson, CategoryFilter } from './types';
import {
  auth,
  subscribeToLessons,
  isUserAdmin,
  ADMIN_EMAIL,
} from './firebase';
import { INITIAL_SEED_LESSONS } from './data/seedLessons';
import {
  loadCompletedLessons,
  loadFavoriteLessons,
  loadStreakData,
  toggleCompletedLesson,
  toggleFavoriteLesson,
} from './utils/progressStorage';
import { Header } from './components/Header';
import { DailyFeatured } from './components/DailyFeatured';
import { LessonCard } from './components/LessonCard';
import { LessonReader } from './components/LessonReader';
import { StudentProgressCard } from './components/StudentProgressCard';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  const [firestoreLessons, setFirestoreLessons] = useState<Lesson[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Student Local Storage Progress State
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [favoriteLessonIds, setFavoriteLessonIds] = useState<string[]>([]);
  const [streakDays, setStreakDays] = useState<number>(0);

  // UI state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('Todos');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize progress from localStorage
  useEffect(() => {
    setCompletedLessonIds(loadCompletedLessons());
    setFavoriteLessonIds(loadFavoriteLessons());
    const streakInfo = loadStreakData();
    setStreakDays(streakInfo.count);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToLessons(
      (lessonsList) => {
        setFirestoreLessons(lessonsList);
        setIsLoadingLessons(false);
      },
      (error) => {
        console.warn('Real-time subscription notice:', error);
        setIsLoadingLessons(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Active lessons: use Firestore lessons if present, otherwise default to seed lessons
  const allLessons: Lesson[] = useMemo(() => {
    if (firestoreLessons.length > 0) {
      return firestoreLessons;
    }
    return INITIAL_SEED_LESSONS;
  }, [firestoreLessons]);

  // Featured Daily Lesson
  const dailyLesson = useMemo(() => {
    const featured = allLessons.find((l) => l.isDaily);
    return featured || allLessons[0] || null;
  }, [allLessons]);

  // Filtered lessons for the grid
  const filteredLessons = useMemo(() => {
    return allLessons.filter((lesson) => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = lesson.title.toLowerCase().includes(query);
        const matchesSummary = lesson.summary.toLowerCase().includes(query);
        const matchesCategory = lesson.category.toLowerCase().includes(query);
        const matchesContent = lesson.content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary && !matchesCategory && !matchesContent) {
          return false;
        }
      }

      // Category filter
      if (activeCategory !== 'Todos' && lesson.category !== activeCategory) {
        return false;
      }

      // Status filter
      const isCompleted = completedLessonIds.includes(lesson.id);
      if (filterStatus === 'pending' && isCompleted) return false;
      if (filterStatus === 'completed' && !isCompleted) return false;

      // Favorites filter
      if (showFavoritesOnly && !favoriteLessonIds.includes(lesson.id)) {
        return false;
      }

      return true;
    });
  }, [
    allLessons,
    searchTerm,
    activeCategory,
    filterStatus,
    showFavoritesOnly,
    completedLessonIds,
    favoriteLessonIds,
  ]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Student progress toggles
  const handleToggleComplete = (e?: React.MouseEvent, lessonId?: string) => {
    if (e) e.stopPropagation();
    const id = lessonId || activeLesson?.id;
    if (!id) return;

    const result = toggleCompletedLesson(id);
    setCompletedLessonIds(result.completedList);
    setStreakDays(result.streak);

    if (result.isCompleted) {
      showToast('¡Lección completada! Tu racha está activa 🔥');
    } else {
      showToast('Lección marcada como pendiente.');
    }
  };

  const handleToggleFavorite = (e?: React.MouseEvent, lessonId?: string) => {
    if (e) e.stopPropagation();
    const id = lessonId || activeLesson?.id;
    if (!id) return;

    const updated = toggleFavoriteLesson(id);
    const isNowFav = updated.includes(id);
    setFavoriteLessonIds(updated);

    showToast(isNowFav ? 'Guardada en tus favoritas ⭐️' : 'Quitada de tus favoritas');
  };

  const handleShare = (e?: React.MouseEvent, lesson?: Lesson) => {
    if (e) e.stopPropagation();
    const target = lesson || activeLesson;
    if (!target) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `SUMA+ ACADEMY: "${target.title}"\n${window.location.origin}`
      );
      showToast('¡Enlace de la lección copiado al portapapeles!');
    } else {
      showToast('Copia la URL de tu navegador para compartir.');
    }
  };

  // Keyboard shortcut: Shift + A for hidden Admin Mode, Esc for close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLesson(null);
        setIsAdminOpen(false);
      }
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Next / Previous navigation within reader
  const currentReaderIndex = useMemo(() => {
    if (!activeLesson) return -1;
    return allLessons.findIndex((l) => l.id === activeLesson.id);
  }, [activeLesson, allLessons]);

  const hasNextLesson = currentReaderIndex >= 0 && currentReaderIndex < allLessons.length - 1;
  const hasPrevLesson = currentReaderIndex > 0;

  const handleNextLesson = () => {
    if (hasNextLesson) {
      setActiveLesson(allLessons[currentReaderIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      setActiveLesson(allLessons[currentReaderIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-amber-400 selection:text-zinc-950 font-sans">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-zinc-900/95 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        completedCount={completedLessonIds.length}
        totalLessons={allLessons.length}
        streakDays={streakDays}
        favoritesCount={favoriteLessonIds.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilter={activeCategory}
        onSelectFilter={(cat) => setActiveCategory(cat as CategoryFilter)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        showUncompletedOnly={filterStatus === 'pending'}
        onToggleUncompletedOnly={() =>
          setFilterStatus((prev) => (prev === 'pending' ? 'all' : 'pending'))
        }
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Daily Featured Lesson (La Lección del Día) */}
        {dailyLesson && !searchTerm && activeCategory === 'Todos' && !showFavoritesOnly && (
          <DailyFeatured
            lesson={dailyLesson}
            isCompleted={completedLessonIds.includes(dailyLesson.id)}
            isFavorite={favoriteLessonIds.includes(dailyLesson.id)}
            onOpenLesson={setActiveLesson}
            onToggleComplete={handleToggleComplete}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
          />
        )}

        {/* Student Progress & Category Filtering Bar */}
        <StudentProgressCard
          completedCount={completedLessonIds.length}
          totalLessons={allLessons.length}
          streakDays={streakDays}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat as CategoryFilter)}
          filterStatus={filterStatus}
          onSelectFilterStatus={setFilterStatus}
        />

        {/* Lessons Feed Section */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>
                  {showFavoritesOnly
                    ? 'Lecciones Guardadas'
                    : activeCategory !== 'Todos'
                    ? `Módulo: ${activeCategory}`
                    : 'Todas las Lecciones'}
                </span>
                <span className="text-xs font-normal text-zinc-500">
                  ({filteredLessons.length})
                </span>
              </h2>
              {searchTerm && (
                <p className="text-xs text-zinc-400 mt-1">
                  Resultados para: "{searchTerm}"
                </p>
              )}
            </div>

            {/* Clear filters shortcut */}
            {(searchTerm || activeCategory !== 'Todos' || filterStatus !== 'all' || showFavoritesOnly) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('Todos');
                  setFilterStatus('all');
                  setShowFavoritesOnly(false);
                }}
                className="text-xs text-amber-400 hover:underline font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Lessons Grid */}
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={completedLessonIds.includes(lesson.id)}
                  isFavorite={favoriteLessonIds.includes(lesson.id)}
                  onOpen={setActiveLesson}
                  onToggleComplete={handleToggleComplete}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                <Compass className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">
                  No se encontraron lecciones
                </h3>
                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                  Prueba cambiando los términos de búsqueda o eliminando los filtros activos.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('Todos');
                  setFilterStatus('all');
                  setShowFavoritesOnly(false);
                }}
                className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700"
              >
                Mostrar todas las lecciones
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Reading View Modal */}
      {activeLesson && (
        <LessonReader
          lesson={activeLesson}
          isCompleted={completedLessonIds.includes(activeLesson.id)}
          isFavorite={favoriteLessonIds.includes(activeLesson.id)}
          onClose={() => setActiveLesson(null)}
          onToggleComplete={(id) => handleToggleComplete(undefined, id)}
          onToggleFavorite={(id) => handleToggleFavorite(undefined, id)}
          onNext={handleNextLesson}
          onPrev={handlePrevLesson}
          hasNext={hasNextLesson}
          hasPrev={hasPrevLesson}
          onShare={(l) => handleShare(undefined, l)}
        />
      )}

      {/* Admin Mode Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        lessons={allLessons}
        onLessonSaved={() => {
          // Handled via onSnapshot
        }}
      />

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isUserAdmin(currentUser)}
      />
    </div>
  );
}
