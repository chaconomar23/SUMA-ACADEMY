import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type { Lesson } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const ADMIN_EMAIL = 'chaconomar411@gmail.com';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore as required by SKILL.md
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firebase connection check: client appears offline.');
    }
  }
}
testConnection();

// Check if user is recognized admin
export function isUserAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Real-time listener for lessons
export function subscribeToLessons(
  onUpdate: (lessons: Lesson[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const lessonsPath = 'lessons';
  const lessonsCol = collection(db, lessonsPath);

  return onSnapshot(
    lessonsCol,
    (snapshot) => {
      const list: Lesson[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || 'Sin título',
          summary: data.summary || '',
          content: data.content || '',
          category: data.category || 'Mentalidad',
          youtubeUrl: data.youtubeUrl || '',
          resources: Array.isArray(data.resources) ? data.resources : [],
          isDaily: Boolean(data.isDaily),
          publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
          readTimeMinutes: Number(data.readTimeMinutes) || 5,
          author: data.author || 'SUMA+ Team',
          authorEmail: data.authorEmail || '',
          authorId: data.authorId || '',
          order: typeof data.order === 'number' ? data.order : 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });

      // Sort with isDaily first, then by publishedAt desc, or order
      list.sort((a, b) => {
        if (a.isDaily && !b.isDaily) return -1;
        if (!a.isDaily && b.isDaily) return 1;
        return (b.order || 0) - (a.order || 0);
      });

      onUpdate(list);
    },
    (error) => {
      console.error('Failed to subscribe to lessons:', error);
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, lessonsPath);
      } catch (e) {
        // Logged error conforming to guidelines
      }
    }
  );
}

// Save or update a lesson
export async function saveLessonToFirestore(
  lesson: Omit<Lesson, 'createdAt' | 'updatedAt'> & { isNew?: boolean }
): Promise<void> {
  const path = `lessons/${lesson.id}`;
  try {
    const lessonRef = doc(db, 'lessons', lesson.id);
    const dataToSave: any = {
      title: lesson.title.trim(),
      summary: lesson.summary.trim(),
      content: lesson.content.trim(),
      category: lesson.category,
      isDaily: Boolean(lesson.isDaily),
      authorId: auth.currentUser?.uid || lesson.authorId,
      authorEmail: auth.currentUser?.email || lesson.authorEmail || ADMIN_EMAIL,
      author: lesson.author?.trim() || 'SUMA+ ACADEMY',
      readTimeMinutes: Number(lesson.readTimeMinutes) || 5,
      order: Number(lesson.order) || Date.now(),
      updatedAt: serverTimestamp(),
    };

    if (lesson.youtubeUrl?.trim()) {
      dataToSave.youtubeUrl = lesson.youtubeUrl.trim();
    }
    if (lesson.publishedAt?.trim()) {
      dataToSave.publishedAt = lesson.publishedAt.trim();
    }
    if (lesson.resources && lesson.resources.length > 0) {
      dataToSave.resources = lesson.resources;
    }

    if (lesson.isNew) {
      dataToSave.createdAt = serverTimestamp();
    }

    await setDoc(lessonRef, dataToSave, { merge: true });
  } catch (err) {
    handleFirestoreError(
      err,
      lesson.isNew ? OperationType.CREATE : OperationType.UPDATE,
      path
    );
  }
}

// Delete lesson
export async function deleteLessonFromFirestore(lessonId: string): Promise<void> {
  const path = `lessons/${lessonId}`;
  try {
    await deleteDoc(doc(db, 'lessons', lessonId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// Authentication helpers
export async function signInAdminWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}
