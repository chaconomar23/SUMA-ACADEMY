const STORAGE_COMPLETED_KEY = 'suma_academy_completed_lessons_v1';
const STORAGE_FAVORITES_KEY = 'suma_academy_favorite_lessons_v1';
const STORAGE_STREAK_KEY = 'suma_academy_streak_info_v1';

export interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function loadCompletedLessons(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_COMPLETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadFavoriteLessons(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadStreakData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_STREAK_KEY);
    if (!raw) return { count: 0, lastDate: '' };
    const parsed = JSON.parse(raw);
    const today = getTodayString();
    const yesterday = getYesterdayString();

    if (parsed.lastDate === today) {
      return parsed;
    } else if (parsed.lastDate === yesterday) {
      return parsed;
    } else {
      // Streak broken if more than 1 day skipped
      return { count: parsed.count > 0 ? 0 : 0, lastDate: parsed.lastDate || '' };
    }
  } catch {
    return { count: 0, lastDate: '' };
  }
}

export function toggleCompletedLesson(lessonId: string): {
  isCompleted: boolean;
  completedList: string[];
  streak: number;
} {
  const current = loadCompletedLessons();
  const exists = current.includes(lessonId);
  let updated: string[];
  let isCompleted: boolean;

  if (exists) {
    updated = current.filter((id) => id !== lessonId);
    isCompleted = false;
  } else {
    updated = [...current, lessonId];
    isCompleted = true;
  }

  try {
    localStorage.setItem(STORAGE_COMPLETED_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }

  // Update streak if completing a lesson today
  let streakInfo = loadStreakData();
  const today = getTodayString();
  const yesterday = getYesterdayString();

  if (isCompleted) {
    if (streakInfo.lastDate === today) {
      // already recorded today
    } else if (streakInfo.lastDate === yesterday) {
      streakInfo = { count: streakInfo.count + 1, lastDate: today };
    } else {
      streakInfo = { count: 1, lastDate: today };
    }
    try {
      localStorage.setItem(STORAGE_STREAK_KEY, JSON.stringify(streakInfo));
    } catch (e) {
      console.error(e);
    }
  }

  return {
    isCompleted,
    completedList: updated,
    streak: streakInfo.count,
  };
}

export function toggleFavoriteLesson(lessonId: string): string[] {
  const current = loadFavoriteLessons();
  const exists = current.includes(lessonId);
  const updated = exists
    ? current.filter((id) => id !== lessonId)
    : [...current, lessonId];

  try {
    localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }

  return updated;
}
