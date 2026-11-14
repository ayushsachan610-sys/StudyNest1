import React from 'react';
import {
  X,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Archive,
  FileQuestion,
  Laptop,
  FolderTree,
  Calendar,
  HardDrive,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';
import { downloadOriginalFile } from '../../lib/downloadHelper';
import { ACADEMIC_TERMS } from '../../types';

export const UnsupportedPreviewModal: React.FC = () => {
  const {
    unsupportedPreviewResource,
    setUnsupportedPreviewResource,
    setActiveMoveResource,
    folders,
  } = useStudyNest();

  if (!unsupportedPreviewResource) return null;

  const resource = unsupportedPreviewResource;
  const extension = resource.name.split('.').pop()?.toUpperCase() || 'FILE';
  const term = ACADEMIC_TERMS.find(t => t.id === resource.termId);
  const folder = folders.find(f => f.id === resource.folderId);
  const locationPath = `${term?.name || 'Second Term'} ${
    folder ? `› ${folder.name}` : '› (Root)'
  }`;

  const getFormatIcon = () => {
    if (['XLSX', 'XLS', 'CSV'].includes(extension)) {
      return <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />;
    }
    if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(extension)) {
      return <Archive className="w-8 h-8 text-amber-600 dark:text-amber-400" />;
    }
    return <FileQuestion className="w-8 h-8 text-rose-600 dark:text-rose-400" />;
  };

  const handleDownload = () => {
    downloadOriginalFile(resource);
  };

  const handleOpenMove = () => {
    setUnsupportedPreviewResource(null);
    setActiveMoveResource(resource);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/60 dark:border-amber-900/60">
              {getFormatIcon()}
            </span>
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-0.5">
                Download Only • Preview Unavailable
              </span>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate max-w-xs">
                {resource.name}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setUnsupportedPreviewResource(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* File Meta Pill */}
          <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-wrap items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-2">
            <div className="flex items-center space-x-1.5">
              <FolderTree className="w-3.5 h-3.5 text-stone-400" />
              <span>Location: <strong className="text-stone-800 dark:text-stone-200">{locationPath}</strong></span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <HardDrive className="w-3.5 h-3.5 text-stone-400" />
                <span>{formatBytes(resource.size)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{new Date(resource.uploadedAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          {/* Explanation Alert Box */}
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Why can’t this file be previewed in the browser?</span>
            </div>
            <p className="text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              {resource.previewUnavailableReason ||
                `Files with the .${extension.toLowerCase()} format require specialized desktop software (such as spreadsheet calculators, decompression utilities, or native executables) to render accurately.`}
            </p>
          </div>

          {/* Laptop Assurance Card */}
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-xs flex items-start space-x-3">
            <Laptop className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                Your original file is 100% safe and available
              </span>
              <p className="text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">
                The full original file is stored in your StudyNest LMS library. You can download it directly to your laptop at any time to open, edit, or compute using your desktop applications.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
          <button
            type="button"
            onClick={handleOpenMove}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Move to another folder</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setUnsupportedPreviewResource(null)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download Original ({formatBytes(resource.size)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
