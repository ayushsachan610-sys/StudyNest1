import React, { useState } from 'react';
import { Info, RotateCcw, Download, ChevronRight, X } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';

export const DemoModeBanner: React.FC = () => {
  const { resetToDemoData, exportBackup, setActiveModal } = useStudyNest();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Demo mode notice" className="bg-[#F6EFE5] border-b border-[#E7DECD] text-stone-800 text-xs px-4 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-full bg-amber-100 text-amber-900 shrink-0">
            <Info className="w-3.5 h-3.5" />
          </span>
          <p className="leading-snug text-stone-700">
            <strong className="font-semibold text-stone-900">PM2 Assignment Demo Mode:</strong> Realistic coursework pre-loaded. Data persists privately in your browser storage.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (window.confirm('Reset all coursework data back to initial PM2 sample state?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center space-x-1 px-2.5 py-1 text-stone-700 bg-white/80 hover:bg-white border border-stone-300/80 rounded font-medium shadow-2xs hover:text-stone-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3 text-stone-500" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={exportBackup}
            className="flex items-center space-x-1 px-2.5 py-1 text-stone-700 bg-white/80 hover:bg-white border border-stone-300/80 rounded font-medium shadow-2xs hover:text-stone-900 transition-colors"
          >
            <Download className="w-3 h-3 text-stone-500" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => setActiveModal('settings')}
            className="hidden md:flex items-center space-x-0.5 text-stone-600 hover:text-stone-900 font-medium ml-1"
          >
            <span>Cloud Config</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-200/50 ml-1"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
