import React, { useState } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { Priority } from '../../types';

export const TaskModal: React.FC = () => {
  const { activeModal, setActiveModal, subjects, selectedSubjectId, addTask } = useStudyNest();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState<string>(selectedSubjectId || subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [priority, setPriority] = useState<Priority>('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (activeModal !== 'new_task') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    addTask({
      title: title.trim(),
      subjectId,
      dueDate,
      estimatedMinutes,
      priority,
      notes: notes.trim(),
    });

    setActiveModal('none');
    setTitle('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl shadow-warm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <CalendarPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Add Study Task</h3>
              <p className="text-xs text-stone-500">Plan an actionable study step or revision task</p>
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Complete PRD Section 3 or Review Flashcards"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Subject *
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Estimated Time
              </label>
              <select
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(parseInt(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={15}>15 mins (Quick review)</option>
                <option value={30}>30 mins (Standard sprint)</option>
                <option value={45}>45 mins (Deep exercise)</option>
                <option value={60}>60 mins (Full lecture block)</option>
                <option value={90}>90 mins (Capstone draft)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Priority
              </label>
              <div className="flex items-center space-x-1.5 pt-0.5">
                {(['low', 'medium', 'high'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize border transition-all ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-50 border-rose-300 text-rose-800 font-bold'
                          : p === 'medium'
                          ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold'
                          : 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Checklist Notes / Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Read chapters 3 and 4, prepare 5 flashcard questions..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
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
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
