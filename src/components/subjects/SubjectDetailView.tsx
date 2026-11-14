import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Calendar,
  Sparkles,
  Plus,
  Upload,
  Clock,
  CheckCircle2,
  Circle,
  FileCode,
  Play,
  Edit2,
  Trash2,
  Save,
  X,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';

type SubjectTab = 'overview' | 'notes' | 'resources' | 'tasks' | 'revision';

export const SubjectDetailView: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    subjects,
    updateSubject,
    deleteSubject,
    notes,
    resources,
    tasks,
    decks,
    quizzes,
    toggleTaskComplete,
    setActiveModal,
    openStudyView,
    setActiveTab,
    generateDeckFromNote,
  } = useStudyNest();

  const [activeTab, setNotebookTab] = useState<SubjectTab>('overview');
  const [isEditingSubject, setIsEditingSubject] = useState(false);

  const subject = subjects.find(s => s.id === selectedSubjectId);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTargetHours, setEditTargetHours] = useState(4);
  const [editColor, setEditColor] = useState('#E11D48');

  React.useEffect(() => {
    if (subject) {
      setEditName(subject.name);
      setEditCode(subject.code);
      setEditDesc(subject.description);
      setEditTargetHours(subject.targetHoursPerWeek);
      setEditColor(subject.color);
      setIsEditingSubject(false);
    }
  }, [subject]);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">Subject not found.</p>
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="mt-3 text-xs text-rose-600 underline font-medium"
        >
          Return to All Subjects
        </button>
      </div>
    );
  }

  const subjectNotes = notes.filter(n => n.subjectId === subject.id);
  const subjectResources = resources.filter(r => r.subjectId === subject.id);
  const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
  const subjectDecks = decks.filter(d => d.subjectId === subject.id);
  const subjectQuizzes = quizzes.filter(q => q.subjectId === subject.id);
  const completedTasks = subjectTasks.filter(t => t.completed);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editCode.trim()) return;

    updateSubject(subject.id, {
      name: editName.trim(),
      code: editCode.trim().toUpperCase(),
      description: editDesc.trim(),
      targetHoursPerWeek: editTargetHours,
      color: editColor,
    });
    setIsEditingSubject(false);
  };

  const handleDeleteSubject = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${subject.name}"? Contained files and quizzes will be unlinked.`
      )
    ) {
      deleteSubject(subject.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Subjects</span>
        </button>
      </div>

      {/* Subject Header & Rename Form */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs">
        {isEditingSubject ? (
          /* Inline Rename & Edit Subject Form */
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Rename & Edit Subject
              </h2>
              <button
                type="button"
                onClick={() => setIsEditingSubject(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={editCode}
                  onChange={e => setEditCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingSubject(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* Normal Header Display */
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span
                  className="px-2.5 py-0.5 rounded-full font-black text-xs tracking-wider"
                  style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                >
                  {subject.code}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-semibold">
                  {subject.completedHoursThisWeek.toFixed(1)} / {subject.targetHoursPerWeek} hrs logged this week
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
                  {subject.name}
                </h1>
                <button
                  onClick={() => setIsEditingSubject(true)}
                  className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                  title="Rename or edit subject"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveModal('upload')}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>

              <button
                onClick={handleDeleteSubject}
                className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Delete this subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Notebook Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Overview', count: null },
            { id: 'resources', label: 'Files & Slides', count: subjectResources.length },
            { id: 'revision', label: 'Quizzes & Decks', count: subjectDecks.length + subjectQuizzes.length },
            { id: 'notes', label: 'Notes', count: subjectNotes.length },
            { id: 'tasks', label: 'Tasks', count: subjectTasks.length },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setNotebookTab(tab.id as SubjectTab)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Subject Files Card */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Subject Files & Slides
                </h3>
                <button
                  onClick={() => setNotebookTab('resources')}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  All Files ({subjectResources.length})
                </button>
              </div>

              {subjectResources.length === 0 ? (
                <p className="text-xs text-stone-400 py-3">No files uploaded for this course yet.</p>
              ) : (
                <div className="space-y-2">
                  {subjectResources.map(res => (
                    <div
                      key={res.id}
                      onClick={() => openStudyView(res)}
                      className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-rose-400 hover:bg-rose-50/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <FileCode className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {res.name}
                        </span>
                        {res.slides && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold shrink-0">
                            {res.slides.length} SLIDES
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-rose-500 shrink-0 ml-2">
                        Study in App →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Revision */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-rose-500">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Active Recall Suite
                </h3>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                You have {subjectDecks.length} flashcard decks and {subjectQuizzes.length} timed tests ready for review in this subject.
              </p>
              <button
                onClick={() => setNotebookTab('revision')}
                className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Open Review Tools
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resources / Files */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Files & Presentations
            </h3>
            <button
              onClick={() => setActiveModal('upload')}
              className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Upload Document
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectResources.map(res => (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {res.type.toUpperCase()}
                    </span>
                    {res.slides && (
                      <span className="text-[10px] font-bold text-rose-500">
                        {res.slides.length} Slides
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {res.name}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">{formatBytes(res.size)}</p>
                </div>

                <button
                  onClick={() => openStudyView(res)}
                  className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
                >
                  Study in App
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Revision */}
      {activeTab === 'revision' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Quizzes & Flashcard Decks in {subject.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectQuizzes.map(q => (
              <div
                key={q.id}
                className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-500">
                    {q.questions.length} Questions
                  </span>
                  {q.bestScore !== undefined && (
                    <span className="text-xs font-bold text-emerald-600">
                      Best: {q.bestScore}%
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">{q.title}</h4>
                <p className="text-xs text-stone-500 line-clamp-2">{q.description}</p>
                <button
                  onClick={() => setActiveTab('review')}
                  className="w-full py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
                >
                  Take Timed Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
