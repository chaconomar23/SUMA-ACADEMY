export interface ResourceLink {
  title: string;
  url: string;
  type?: 'pdf' | 'link' | 'tool' | 'doc' | 'video';
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  youtubeUrl?: string;
  resources?: ResourceLink[];
  isDaily: boolean;
  publishedAt?: string;
  readTimeMinutes: number;
  author: string;
  authorEmail?: string;
  authorId: string;
  order?: number;
  createdAt?: any;
  updatedAt?: any;
}

export type CategoryFilter =
  | 'Todos'
  | 'Mentalidad'
  | 'Marketing'
  | 'Hábitos'
  | 'Herramientas'
  | 'Productividad'
  | 'Estrategia'
  | 'Finanzas';

export interface UserProgress {
  completedLessonIds: string[];
  favoriteLessonIds: string[];
  streakDays: number;
  lastActiveDate: string;
}
