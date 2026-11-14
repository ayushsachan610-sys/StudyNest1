import React, { useState, useMemo } from 'react';
import {
  X,
  Folder,
  FolderPlus,
  FolderTree,
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  HardDrive,
  Layers,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { AcademicTermId, ACADEMIC_TERMS, Folder as FolderType } from '../../types';

export const MoveFileModal: React.FC = () => {
  const {
    activeMoveResource,
    setActiveMoveResource,
    folders,
    moveResource,
    selectedTermId,
  } = useStudyNest();

  const [targetTermId, setTargetTermId] = useState<AcademicTermId>(
    activeMoveResource?.termId || selectedTermId || 'term-2'
  );
  const [targetFolderId, setTargetFolderId] = useState<string | null>(
    activeMoveResource?.folderId || null
  );

  // Sync when modal opens for a new resource
  React.useEffect(() => {
    if (activeMoveResource) {
      setTargetTermId(activeMoveResource.termId || selectedTermId || 'term-2');
      setTargetFolderId(activeMoveResource.folderId || null);
    }
  }, [activeMoveResource, selectedTermId]);

  if (!activeMoveResource) return null;

  const currentTerm = ACADEMIC_TERMS.find(t => t.id === activeMoveResource.termId);
  const currentFolder = folders.find(f => f.id === activeMoveResource.folderId);

  // Folders in the selected target term
  const termFolders = folders.filter(f => f.termId === targetTermId);

  // Build hierarchical folder tree for this term
  const rootFolders = termFolders.filter(f => !f.parentId);
  const getSubfolders = (parentId: string) => termFolders.filter(f => f.parentId === parentId);

  const handleConfirmMove = () => {
    moveResource(activeMoveResource.id, targetTermId, targetFolderId);
    setActiveMoveResource(null);
  };

  const currentPathString = `${currentTerm?.name || 'Second Term'} ${
    currentFolder ? `› ${currentFolder.name}` : '› (Root)'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-3 truncate">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <FolderTree className="w-5 h-5" />
            </span>
            <div className="truncate">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                Move File: {activeMoveResource.name}
              </h3>
              <p className="text-xs text-stone-500 truncate">
                Current Location: <span className="font-semibold text-stone-700 dark:text-stone-300">{currentPathString}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveMoveResource(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Step 1: Select Term */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              1. Choose Destination Academic Term (6 Terms)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACADEMIC_TERMS.map(term => {
                const isSelected = targetTermId === term.id;
                const fileCountInTerm = termFolders.length; // placeholder
                return (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => {
                      setTargetTermId(term.id);
                      setTargetFolderId(null);
                    }}
                    className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">{term.name}</span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                      {term.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Folder / Subfolder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              2. Select Folder or Subfolder (Like on your Laptop)
            </label>

            <div className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800/60 max-h-64 overflow-y-auto p-1">
              {/* Option: Root of Term */}
              <button
                type="button"
                onClick={() => setTargetFolderId(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                  targetFolderId === null
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-4 h-4 text-stone-400" />
                  <span>
                    Top level of {ACADEMIC_TERMS.find(t => t.id === targetTermId)?.name} (No subfolder)
                  </span>
                </div>
                {targetFolderId === null && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
              </button>

              {/* Render Root Folders and Nested Subfolders */}
              {rootFolders.map(folder => {
                const subfolders = getSubfolders(folder.id);
                const isSelected = targetFolderId === folder.id;

                return (
                  <div key={folder.id} className="space-y-1 py-1">
                    {/* Parent Folder */}
                    <button
                      type="button"
                      onClick={() => setTargetFolderId(folder.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: folder.color || '#10B981' }}
                        />
                        <Folder className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
                        <span className="font-semibold">{folder.name}</span>
                        {subfolders.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500">
                            {subfolders.length} subfolders
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>

                    {/* Subfolders with laptop tree indentation */}
                    {subfolders.map(sub => {
                      const isSubSelected = targetFolderId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setTargetFolderId(sub.id)}
                          className={`w-full flex items-center justify-between pl-8 pr-3 py-1.5 rounded-lg text-left text-xs transition-colors ${
                            isSubSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-stone-300 dark:text-stone-600">↳</span>
                            <Folder className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
                            <span>{sub.name}</span>
                          </div>
                          {isSubSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {termFolders.length === 0 && (
                <div className="p-4 text-center text-xs text-stone-500">
                  No folders created in this term yet. Moving here will place the file at the top level.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveMoveResource(null)}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmMove}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Move File Here</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
