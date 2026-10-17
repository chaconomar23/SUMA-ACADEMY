import React from 'react';
import { Lock, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  return (
    <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950 py-10 text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Manifesto */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-extrabold text-zinc-200 tracking-tight text-base">
                SUMA<span className="text-amber-400">+</span> ACADEMY
              </span>
              <span className="text-xs text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">
                Plataforma de Aprendizaje Continuo
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md">
              El conocimiento práctico y diario es el único activo que genera interés
              compuesto sin límites. Sube de nivel 1% cada día.
            </p>
          </div>

          {/* Center philosophy */}
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>(1.01)³⁶⁵ = 37.78 veces mejor en un año</span>
          </div>

          {/* Discreet Admin Access Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="group flex items-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-800 hover:bg-zinc-900 hover:text-zinc-300 transition-all"
              title="Panel de administración de contenidos"
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400/90 font-medium">
                    Admin Activo
                  </span>
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                  <span>Acceso Administrador</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-2">
          <p>© {new Date().getFullYear()} SUMA+ ACADEMY. Todos los derechos reservados.</p>
          <p>Tu progreso de estudio se almacena de forma privada en tu dispositivo.</p>
        </div>
      </div>
    </footer>
  );
};
