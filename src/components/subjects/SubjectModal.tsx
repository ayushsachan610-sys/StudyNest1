import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';

const COLOR_PRESETS = [
  { name: 'Sage Green', value: '#2E7D5B' },
  { name: 'Terracotta', value: '#D35D38' },
  { name: 'Indigo Soft', value: '#4F5BD5' },
  { name: 'Teal Lake', value: '#0D9488' },
  { name: 'Amber Warm', value: '#D97706' },
  { name: 'Rose Clay', value: '#BE185D' },
  { name: 'Slate Calm', value: '#475569' },
];

export const SubjectModal: React.FC = () => {
  const { activeModal, setActiveModal, addSubject, setSelectedSubjectId, setActiveTab } = useStudyNest();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0].value);
  const [targetHours, setTargetHours] = useState<number>(4);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'new_subject') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a subject name.');
      return;
    }
    if (!code.trim()) {
      setError('Please provide a course code (e.g. PM-202 or BIO-101).');
      return;
    }

    const created = addSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      color,
      icon: 'BookOpen',
      targetHoursPerWeek: targetHours,
      description: description.trim() || 'No description provided.',
    });

    // Close and open new subject notebook
    setActiveModal('none');
    setSelectedSubjectId(created.id);
    setActiveTab('subjects');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl shadow-warm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <FolderPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">New Subject Workspace</h3>
              <p className="text-xs text-stone-500">Create a dedicated notebook for your course</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Subject Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Cognitive Psychology"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                placeholder="COG-101"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Subject Workspace Color
            </label>
            <div className="flex items-center space-x-2">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === preset.value ? 'ring-2 ring-offset-2 ring-stone-700 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Study Hours / Week
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={targetHours}
                onChange={e => setTargetHours(parseInt(e.target.value))}
                className="flex-1 accent-emerald-700 h-1.5 bg-stone-200 rounded-lg"
              />
              <span className="text-xs font-semibold text-stone-800 w-12 text-right">
                {targetHours} hrs
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description / Learning Goals
            </label>
            <textarea
              rows={2}
              placeholder="Key concepts, syllabus modules, or exam dates..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-200/80">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
