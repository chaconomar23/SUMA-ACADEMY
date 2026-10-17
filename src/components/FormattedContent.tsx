import React from 'react';
import { Lightbulb, Target, Zap, Quote } from 'lucide-react';

interface FormattedContentProps {
  content: string;
  fontSizeClass?: string;
}

export const FormattedContent: React.FC<FormattedContentProps> = ({
  content,
  fontSizeClass = 'text-base sm:text-lg',
}) => {
  const lines = content.split('\n');

  const renderFormattedLine = (text: string, key: string | number) => {
    // Process bold text **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <span key={key}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-semibold text-amber-200">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Process *italic*
          if (part.startsWith('*') && part.endsWith('*')) {
            return (
              <em key={i} className="italic text-zinc-300">
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        })}
      </span>
    );
  };

  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === 'ul') {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="my-4 space-y-2.5 pl-2 text-zinc-300"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="leading-relaxed">
                  {renderFormattedLine(item, idx)}
                </span>
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="my-4 space-y-2.5 pl-2 text-zinc-300"
          >
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">
                  {renderFormattedLine(item, idx)}
                </span>
              </li>
            ))}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Callout: Reto del día / Acción inmediata / Idea clave
    if (trimmed.startsWith('### ⚡ Reto') || trimmed.startsWith('### 🎯 Acción')) {
      flushList();
      elements.push(
        <div
          key={`action-box-${i}`}
          className="my-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 p-5 shadow-lg shadow-amber-950/20"
        >
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-lg mb-2">
            <Zap className="h-5 w-5" />
            <span>{trimmed.replace(/^###\s*/, '')}</span>
          </div>
        </div>
      );
      continue;
    }

    if (trimmed.startsWith('### 💡 Idea Clave') || trimmed.startsWith('### Idea Clave')) {
      flushList();
      elements.push(
        <div
          key={`idea-box-${i}`}
          className="my-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-950 p-5 shadow-lg"
        >
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-lg mb-2">
            <Lightbulb className="h-5 w-5" />
            <span>{trimmed.replace(/^###\s*/, '')}</span>
          </div>
        </div>
      );
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${i}`}
          className="mt-8 mb-3 text-xl font-bold tracking-tight text-white border-l-2 border-amber-400 pl-3"
        >
          {trimmed.replace(/^###\s*/, '')}
        </h3>
      );
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${i}`}
          className="mt-10 mb-4 text-2xl font-bold tracking-tight text-white"
        >
          {trimmed.replace(/^##\s*/, '')}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-5 relative rounded-xl border-l-4 border-amber-400 bg-zinc-900/80 px-5 py-4 text-zinc-200 shadow-inner"
        >
          <Quote className="absolute top-3 right-3 h-6 w-6 text-zinc-700 pointer-events-none" />
          <p className="italic text-base sm:text-lg leading-relaxed text-zinc-200">
            {renderFormattedLine(trimmed.replace(/^>\s*/, ''), i)}
          </p>
        </div>
      );
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(
        <hr key={`hr-${i}`} className="my-8 border-t border-zinc-800" />
      );
      continue;
    }

    // Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(trimmed.slice(2));
      continue;
    }

    // Numbered list item
    const matchOrdered = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (matchOrdered) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(matchOrdered[2]);
      continue;
    }

    // Standard paragraph
    flushList();
    elements.push(
      <p
        key={`p-${i}`}
        className={`my-3 text-zinc-300 leading-relaxed ${fontSizeClass}`}
      >
        {renderFormattedLine(trimmed, i)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
