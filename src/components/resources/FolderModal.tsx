import React, { useState, useEffect } from 'react';
import { X, Folder, FolderPlus, Palette, Tag, Check, Layers } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { AcademicTermId, ACADEMIC_TERMS, Folder as FolderType } from '../../types';

const FOLDER_COLORS = [
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Rose', hex: '#E11D48' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Slate', hex: '#64748B' },
];

export const FolderModal: React.FC = () => {
  const {
    isFolderModalOpen,
    setIsFolderModalOpen,
    folderModalMode,
    editingFolder,
    parentFolderForNew,
    selectedTermId,
    folders,
    addFolder,
    updateFolder,
  } = useStudyNest();

  const [name, setName] = useState('');
  const [termId, setTermId] = useState<AcademicTermId>(selectedTermId || 'term-2');
  const [parentId, setParentId] = useState<string | null>(null);
  const [color, setColor] = useState('#10B981');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (folderModalMode === 'rename' && editingFolder) {
      setName(editingFolder.name);
      setTermId(editingFolder.termId);
      setParentId(editingFolder.parentId || null);
      setColor(editingFolder.color || '#10B981');
      setDescription(editingFolder.description || '');
      setError(null);
    } else {
      setName('');
      setTermId(parentFolderForNew ? parentFolderForNew.termId : selectedTermId || 'term-2');
      setParentId(parentFolderForNew ? parentFolderForNew.id : null);
      setColor(parentFolderForNew ? parentFolderForNew.color || '#10B981' : '#10B981');
      setDescription('');
      setError(null);
    }
  }, [folderModalMode, editingFolder, parentFolderForNew, selectedTermId, isFolderModalOpen]);

  if (!isFolderModalOpen) return null;

  const currentTermFolders = folders.filter(
    f => f.termId === termId && (folderModalMode === 'rename' ? f.id !== editingFolder?.id : true)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a folder name.');
      return;
    }

    if (folderModalMode === 'rename' && editingFolder) {
      updateFolder(editingFolder.id, {
        name: name.trim(),
        color,
        description: description.trim() || undefined,
      });
    } else {
      addFolder({
        name: name.trim(),
        termId,
        parentId,
        color,
        description: description.trim() || undefined,
      });
    }

    setIsFolderModalOpen(false);
  };

  const isSubfolderCreation = Boolean(parentId);
  const parentFolder = folders.find(f => f.id === parentId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-3">
            <span
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ backgroundColor: color }}
            >
              <FolderPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {folderModalMode === 'rename'
                  ? 'Rename Folder'
                  : isSubfolderCreation
                  ? `New Subfolder inside "${parentFolder?.name}"`
                  : 'Create New Folder'}
              </h3>
              <p className="text-xs text-stone-500">
                {ACADEMIC_TERMS.find(t => t.id === termId)?.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFolderModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900">
              {error}
            </div>
          )}

          {/* Folder Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Folder Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sprint Presentations, Lecture Slides..."
              autoFocus
              className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Academic Term (Only for new top-level folders) */}
          {folderModalMode === 'create' && !parentFolderForNew && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Academic Term
              </label>
              <select
                value={termId}
                onChange={e => {
                  setTermId(e.target.value as AcademicTermId);
                  setParentId(null);
                }}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                {ACADEMIC_TERMS.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.name} ({term.shortName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color Tag */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Color Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map(c => {
                const isSelected = color === c.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setColor(c.hex)}
                    className="relative w-8 h-8 rounded-full border-2 border-white dark:border-stone-900 shadow-xs flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief summary of materials in this folder"
              className="w-full px-3.5 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsFolderModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {folderModalMode === 'rename' ? 'Update Folder' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
