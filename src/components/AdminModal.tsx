import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  LogOut,
  PlusCircle,
  Edit3,
  Trash2,
  Sparkles,
  Youtube,
  Paperclip,
  Check,
  Eye,
  Database,
  Lock,
  LogIn,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { Lesson, ResourceLink } from '../types';
import {
  signInAdminWithGoogle,
  signOutAdmin,
  saveLessonToFirestore,
  deleteLessonFromFirestore,
  ADMIN_EMAIL,
} from '../firebase';
import { FormattedContent } from './FormattedContent';
import { INITIAL_SEED_LESSONS } from '../data/seedLessons';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  lessons: Lesson[];
  onLessonSaved?: () => void;
}

const CATEGORIES = [
  'Mentalidad',
  'Marketing',
  'Hábitos',
  'Herramientas',
  'Productividad',
  'Estrategia',
  'Finanzas',
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  lessons,
  onLessonSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'seed'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mentalidad');
  const [customCategory, setCustomCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [isDaily, setIsDaily] = useState(false);
  const [resources, setResources] = useState<ResourceLink[]>([]);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState<ResourceLink['type']>('link');

  if (!isOpen) return null;

  // Determine if user has admin access
  const isEmailAdmin =
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isAdminAuthorized = isEmailAdmin || passcodeUnlocked;

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      await signInAdminWithGoogle();
      setSuccessMessage('Sesión iniciada correctamente.');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'No se pudo abrir la ventana de Google Sign-in. Puedes usar el código de acceso directo como alternativa.'
      );
    }
  };

  const handlePasscodeAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcode.trim().toLowerCase() === 'suma2025' ||
      passcode.trim().toLowerCase() === 'admin' ||
      passcode.trim().toLowerCase() === 'suma+'
    ) {
      setPasscodeUnlocked(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('Código de acceso incorrecto. Intenta nuevamente.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Mentalidad');
    setCustomCategory('');
    setSummary('');
    setContent('');
    setYoutubeUrl('');
    setReadTimeMinutes(5);
    setIsDaily(false);
    setResources([]);
    setShowPreview(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleStartEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setTitle(lesson.title);
    if (CATEGORIES.includes(lesson.category)) {
      setCategory(lesson.category);
      setCustomCategory('');
    } else {
      setCategory('Otro');
      setCustomCategory(lesson.category);
    }
    setSummary(lesson.summary);
    setContent(lesson.content);
    setYoutubeUrl(lesson.youtubeUrl || '');
    setReadTimeMinutes(lesson.readTimeMinutes || 5);
    setIsDaily(lesson.isDaily);
    setResources(lesson.resources ? [...lesson.resources] : []);
    setActiveTab('form');
    setShowPreview(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAddResource = () => {
    if (!newResTitle.trim() || !newResUrl.trim()) return;
    setResources([
      ...resources,
      {
        title: newResTitle.trim(),
        url: newResUrl.trim(),
        type: newResType,
      },
    ]);
    setNewResTitle('');
    setNewResUrl('');
  };

  const handleRemoveResource = (index: number) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  const insertMarkdownSnippet = (snippet: string) => {
    setContent((prev) => prev + snippet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const finalCategory = category === 'Otro' ? customCategory.trim() : category;

    if (!title.trim()) {
      setErrorMessage('El título de la lección es obligatorio.');
      return;
    }
    if (!summary.trim()) {
      setErrorMessage('El resumen inicial es obligatorio.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('El contenido de la lección no puede estar vacío.');
      return;
    }
    if (!finalCategory) {
      setErrorMessage('Debes especificar una categoría para la lección.');
      return;
    }

    setIsSubmitting(true);

    try {
      const lessonId = editingId || `lesson-${Date.now()}`;
      await saveLessonToFirestore({
        id: lessonId,
        title,
        summary,
        content,
        category: finalCategory,
        youtubeUrl: youtubeUrl.trim() || undefined,
        readTimeMinutes: Number(readTimeMinutes) || 5,
        isDaily: Boolean(isDaily),
        resources,
        author: 'SUMA+ ACADEMY',
        authorEmail: currentUser?.email || ADMIN_EMAIL,
        authorId: currentUser?.uid || 'admin_suma_local',
        isNew: !editingId,
      });

      setSuccessMessage(
        editingId
          ? '¡Lección actualizada exitosamente en tiempo real!'
          : '¡Lección publicada exitosamente en tiempo real!'
      );
      resetForm();
      if (onLessonSaved) onLessonSaved();
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'Error al guardar la lección en Firestore. Verifica tu conexión o permisos.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lessonId: string, lessonTitle: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar la lección "${lessonTitle}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await deleteLessonFromFirestore(lessonId);
      setSuccessMessage('Lección eliminada de Firestore.');
      if (editingId === lessonId) resetForm();
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Error al eliminar la lección.');
    }
  };

  const handleMakeDaily = async (lesson: Lesson) => {
    try {
      await saveLessonToFirestore({
        ...lesson,
        isDaily: true,
      });
      setSuccessMessage(`"${lesson.title}" ahora es La Lección del Día.`);
    } catch (err) {
      setErrorMessage('Error al actualizar la lección del día.');
    }
  };

  const handleSeedCurriculum = async () => {
    if (
      !window.confirm(
        '¿Deseas sembrar las lecciones iniciales predeterminadas en Firestore? Esto agregará las lecciones modelo a la base de datos.'
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      for (const lesson of INITIAL_SEED_LESSONS) {
        await saveLessonToFirestore({
          ...lesson,
          authorEmail: currentUser?.email || ADMIN_EMAIL,
          authorId: currentUser?.uid || 'admin_suma_seed',
          isNew: true,
        });
      }
      setSuccessMessage('¡Lecciones iniciales sembradas exitosamente en Firestore!');
    } catch (err) {
      console.error(err);
      setErrorMessage('Error al sembrar lecciones en Firestore.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-2 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Modo Administrador</span>
                <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                  SUMA+ ACADEMY
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Sincronización en tiempo real vía Firebase Firestore
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthorized && currentUser && (
              <button
                onClick={() => signOutAdmin()}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                title="Cerrar sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* If NOT authorized: Login view */}
          {!isAdminAuthorized ? (
            <div className="mx-auto max-w-md py-8 text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">
                  Acceso Restringido para Publicación
                </h3>
                <p className="text-sm text-zinc-400">
                  Para subir, editar y programar las lecciones diarias de SUMA+ ACADEMY,
                  inicia sesión con la cuenta de administrador oficial (
                  <strong className="text-zinc-200">{ADMIN_EMAIL}</strong>).
                </p>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 text-left">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Google Sign-in */}
              <button
                onClick={handleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-zinc-950 shadow-lg hover:bg-zinc-100 active:scale-[0.98] transition-all"
              >
                <LogIn className="h-5 w-5 text-zinc-900" />
                <span>Continuar con Google</span>
              </button>

              {/* Alternative PIN/Passcode Fallback for quick preview */}
              <div className="pt-4 border-t border-zinc-800 text-left space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>¿Prefieres acceso directo por clave rápida?</span>
                </div>
                <form onSubmit={handlePasscodeAuth} className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Clave de acceso (ej. suma2025)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700"
                  >
                    Entrar
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Authorized Admin Workspace */
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === 'form'
                        ? 'bg-amber-400 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{editingId ? 'Editando Lección' : 'Crear Lección'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('list')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === 'list'
                        ? 'bg-amber-400 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Gestionar Lecciones ({lessons.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('seed')}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === 'seed'
                        ? 'bg-amber-400 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    <span>Contenido Base</span>
                  </button>
                </div>

                {editingId && (
                  <button
                    onClick={resetForm}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Cancelar edición / Crear nueva
                  </button>
                )}
              </div>

              {/* Feedback messages */}
              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs sm:text-sm text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-300">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* TAB 1: FORM */}
              {activeTab === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Título de la Lección *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. El Principio del 1% Diario en Finanzas"
                        required
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Categoría / Módulo *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Otro">+ Otra categoría</option>
                      </select>
                      {category === 'Otro' && (
                        <input
                          type="text"
                          placeholder="Nombre de categoría"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs text-white"
                        />
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      Resumen / Gancho Inicial (Aparece en el feed) *
                    </label>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Una o dos frases directas que explican el valor de esta lección..."
                      required
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {/* YouTube URL + Read time + Daily Switch */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                        <Youtube className="h-4 w-4 text-rose-400" />
                        <span>URL de YouTube (Opcional)</span>
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-300">
                        Tiempo de Lectura (minutos)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={readTimeMinutes}
                        onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                        className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Daily Lesson Toggle */}
                  <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      <div>
                        <span className="text-sm font-bold text-white block">
                          Destacar como "La Lección del Día"
                        </span>
                        <span className="text-xs text-zinc-400">
                          Aparecerá en el banner principal en la cima del feed
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDaily}
                        onChange={(e) => setIsDaily(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                    </label>
                  </div>

                  {/* Markdown Content Editor */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-zinc-300">
                        Contenido Completo de la Lección (Soporta Markdown) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{showPreview ? 'Ocultar Vista Previa' : 'Ver Vista Previa'}</span>
                      </button>
                    </div>

                    {/* Quick Markdown Formatting Helper Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 py-1">
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n### Subtítulo\n')}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                      >
                        ### Título
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet(' **texto destacado** ')}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700 font-bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n> Cita inspiradora o principio clave\n')}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                      >
                        " Cita
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n- Punto 1\n- Punto 2\n')}
                        className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                      >
                        • Viñetas
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n### ⚡ Reto del Día\nAcción concreta que debes ejecutar hoy:\n')}
                        className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs text-amber-300 hover:bg-amber-500/20"
                      >
                        ⚡ Reto del Día
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownSnippet('\n### 💡 Idea Clave\nLa conclusión esencial para recordar:\n')}
                        className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs text-emerald-300 hover:bg-emerald-500/20"
                      >
                        💡 Idea Clave
                      </button>
                    </div>

                    <textarea
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escribe el desarrollo de la lección aquí..."
                      required
                      className="w-full font-mono text-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />

                    {/* Live Preview Box */}
                    {showPreview && (
                      <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-inner space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                          Vista Previa de Lectura
                        </span>
                        <FormattedContent content={content || 'Sin contenido aún...'} />
                      </div>
                    )}
                  </div>

                  {/* Resource Links Manager */}
                  <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                      <Paperclip className="h-4 w-4 text-amber-400" />
                      <span>Recursos y Enlaces Descargables ({resources.length})</span>
                    </label>

                    {/* Add Resource row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        placeholder="Título del recurso (ej. Plantilla Notion)"
                        value={newResTitle}
                        onChange={(e) => setNewResTitle(e.target.value)}
                        className="sm:col-span-5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="url"
                        placeholder="URL (ej. https://...)"
                        value={newResUrl}
                        onChange={(e) => setNewResUrl(e.target.value)}
                        className="sm:col-span-4 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-white"
                      />
                      <select
                        value={newResType}
                        onChange={(e) => setNewResType(e.target.value as any)}
                        className="sm:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-white"
                      >
                        <option value="link">Enlace</option>
                        <option value="pdf">PDF</option>
                        <option value="tool">Herramienta</option>
                        <option value="doc">Documento</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddResource}
                        className="sm:col-span-1 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs py-1.5 hover:brightness-110"
                      >
                        +
                      </button>
                    </div>

                    {/* List of currently attached resources */}
                    {resources.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        {resources.map((res, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300"
                          >
                            <span className="truncate">
                              [{res.type}] <strong>{res.title}</strong> — {res.url}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveResource(i)}
                              className="text-rose-400 hover:text-rose-300"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                    >
                      <Check className="h-5 w-5" />
                      <span>
                        {isSubmitting
                          ? 'Guardando en Firestore...'
                          : editingId
                          ? 'Actualizar Lección en Tiempo Real'
                          : 'Publicar Lección en Tiempo Real'}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MANAGE EXISTING LESSONS */}
              {activeTab === 'list' && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    Todas las lecciones sincronizadas en Firebase Firestore. Los cambios se
                    reflejan al instante en las pantallas de todos los estudiantes.
                  </p>

                  <div className="divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                              {lesson.category}
                            </span>
                            {lesson.isDaily && (
                              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                                ★ Lección del Día
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-white text-sm sm:text-base">
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-zinc-400 line-clamp-1">
                            {lesson.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {!lesson.isDaily && (
                            <button
                              onClick={() => handleMakeDaily(lesson)}
                              className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20"
                              title="Convertir en Lección del Día"
                            >
                              Hacer del Día
                            </button>
                          )}
                          <button
                            onClick={() => handleStartEdit(lesson)}
                            className="rounded-xl border border-zinc-700 bg-zinc-800 p-2 text-zinc-300 hover:text-white"
                            title="Editar lección"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id, lesson.title)}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500/20"
                            title="Eliminar lección"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SEED CONTENT */}
              {activeTab === 'seed' && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Database className="h-6 w-6 text-amber-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Sembrador de Lecciones Iniciales
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Carga 6 lecciones completas y probadas sobre Mentalidad, Marketing,
                        Hábitos, Herramientas, Productividad y Estrategia con videos de YouTube y
                        recursos.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                    <p>• Lección 1: El Principio del 1% Diario (Lección del Día)</p>
                    <p>• Lección 2: La Anatomía de una Oferta Irresistible (Marketing)</p>
                    <p>• Lección 3: Anclaje de Hábitos y Enfoque Profundo (Hábitos)</p>
                    <p>• Lección 4: Arquitectura de un Segundo Cerebro (Herramientas)</p>
                    <p>• Lección 5: Validación Ágil de Ideas en 72 Horas (Estrategia)</p>
                    <p>• Lección 6: Gestión de Energía vs. Gestión de Tiempo (Productividad)</p>
                  </div>

                  <button
                    onClick={handleSeedCurriculum}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  >
                    <Database className="h-4 w-4" />
                    <span>
                      {isSubmitting
                        ? 'Sembrando en Firestore...'
                        : 'Sembrar Curriculum Inicial en Firestore'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
