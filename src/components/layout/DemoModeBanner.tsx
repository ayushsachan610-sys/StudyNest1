import React, { useState } from 'react';
import { Layers, RotateCcw, Download, Sparkles, X, Settings } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';

export const DemoModeBanner: React.FC = () => {
  const { resetToDemoData, exportBackup, setActiveModal, resources, openStudyView } = useStudyNest();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const pptResource = resources.find(r => r.type === 'pptx');

  return (
    <aside
      aria-label="PowerPoint Resource Notice"
      className="bg-rose-50/90 dark:bg-[#1A1517] border-b border-rose-200 dark:border-rose-900/60 text-stone-800 dark:text-stone-200 text-xs px-4 py-2 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <p className="leading-snug text-stone-700 dark:text-stone-300">
            <strong className="font-bold text-rose-700 dark:text-rose-300">
              Primary PowerPoint Loaded:
            </strong>{' '}
            {pptResource ? (
              <span>
                "{pptResource.name}" (10 Slides Extracted) organized under{' '}
                <strong className="font-semibold">Design Thinking & Innovation</strong>.
              </span>
            ) : (
              <span>Presentation materials pre-loaded.</span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {pptResource && (
            <button
              onClick={() => openStudyView(pptResource)}
              className="flex items-center space-x-1 px-2.5 py-1 text-white bg-rose-500 hover:bg-rose-600 rounded-lg font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Study Slides</span>
            </button>
          )}

          <button
            onClick={() => setActiveModal('settings')}
            className="flex items-center space-x-1 px-2.5 py-1 text-stone-700 dark:text-stone-200 bg-white/80 dark:bg-stone-800 hover:bg-white dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg font-semibold transition-colors"
          >
            <Settings className="w-3 h-3 text-stone-500" />
            <span>Themes & Settings</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded hover:bg-stone-200/50 dark:hover:bg-stone-700/50 ml-1"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
