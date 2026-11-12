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
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';

type SubjectTab = 'overview' | 'notes' | 'resources' | 'tasks' | 'revision';

export const SubjectDetailView: React.FC = () => {
  const {
    selectedSubjectId,
    setSelectedSubjectId,
    subjects,
    notes,
    resources,
    tasks,
    decks,
    quizzes,
    toggleTaskComplete,
    setActiveModal,
    setPreviewResource,
    setActiveTab,
    generateDeckFromNote,
  } = useStudyNest();

  const [activeTab, setNotebookTab] = useState<SubjectTab>('overview');

  const subject = subjects.find(s => s.id === selectedSubjectId);

  if (!subject) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">Subject not found.</p>
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="mt-3 text-xs text-emerald-800 underline font-medium"
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="inline-flex items-center space-x-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Subjects</span>
        </button>
      </div>

      {/* Subject Notebook Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-md font-bold text-xs tracking-wider"
                style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
              >
                {subject.code}
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-medium">
                {subject.completedHoursThisWeek} / {subject.targetHoursPerWeek} hrs logged this week
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {subject.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveModal('upload')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>

            <button
              onClick={() => setActiveModal('new_task')}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Notebook Sub-Navigation Tabs */}
        <div className="flex items-center space-x-2 mt-8 pt-4 border-t border-stone-100 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', count: null },
            { id: 'notes', label: 'Notes', count: subjectNotes.length },
            { id: 'resources', label: 'Files & Slides', count: subjectResources.length },
            { id: 'tasks', label: 'Tasks', count: subjectTasks.length },
            { id: 'revision', label: 'Revision Decks', count: subjectDecks.length + subjectQuizzes.length },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setNotebookTab(tab.id as SubjectTab)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-200 text-stone-600'
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
            {/* Notes Section in Overview */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-stone-900">Recent Notes</h3>
                <button
                  onClick={() => setNotebookTab('notes')}
                  className="text-xs font-medium text-emerald-800 hover:underline"
                >
                  View All ({subjectNotes.length})
                </button>
              </div>

              {subjectNotes.length === 0 ? (
                <p className="text-xs text-stone-500 py-3">No notes created in this subject yet.</p>
              ) : (
                <div className="space-y-3">
                  {subjectNotes.slice(0, 3).map(note => (
                    <div
                      key={note.id}
                      onClick={() => setActiveTab('notes')}
                      className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 hover:border-emerald-300 cursor-pointer transition-all"
                    >
                      <h4 className="text-xs font-semibold text-stone-900">{note.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {note.content}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-[10px] text-stone-400">
                        <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{note.templateUsed || 'standard'} format</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Section in Overview */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-stone-900">Subject Files</h3>
                <button
                  onClick={() => setNotebookTab('resources')}
                  className="text-xs font-medium text-emerald-800 hover:underline"
                >
                  All Files ({subjectResources.length})
                </button>
              </div>

              {subjectResources.length === 0 ? (
                <p className="text-xs text-stone-500 py-3">No files uploaded for this course yet.</p>
              ) : (
                <div className="space-y-2">
                  {subjectResources.slice(0, 3).map(res => (
                    <div
                      key={res.id}
                      onClick={() => setPreviewResource(res)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/70 hover:border-emerald-300 hover:bg-stone-50/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-xs font-medium text-stone-900 truncate">
                          {res.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                        {formatBytes(res.size)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side: Tasks & Revision */}
          <div className="lg:col-span-5 space-y-6">
            {/* Subject Tasks */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-base font-bold text-stone-900">Subject Tasks</h3>
                <span className="text-xs text-stone-500">
                  {completedTasks.length}/{subjectTasks.length} done
                </span>
              </div>

              {subjectTasks.length === 0 ? (
                <p className="text-xs text-stone-500 py-3">No tasks scheduled for this course.</p>
              ) : (
                <div className="space-y-2.5">
                  {subjectTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-start space-x-2.5 p-3 rounded-2xl border transition-all ${
                        task.completed ? 'bg-stone-50/60 opacity-60' : 'bg-white border-stone-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-stone-400 hover:text-emerald-700"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 fill-emerald-100" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-400" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-xs font-medium leading-snug truncate ${
                            task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Due {task.dueDate} • {task.estimatedMinutes}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision Callout */}
            <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-stone-200/80 text-center">
              <Sparkles className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <h4 className="font-serif text-sm font-bold text-stone-900">Active Recall Suite</h4>
              <p className="text-xs text-stone-600 mt-1">
                You have {subjectDecks.length} flashcard decks and {subjectQuizzes.length} knowledge check quizzes ready for review.
              </p>
              <button
                onClick={() => setNotebookTab('revision')}
                className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
              >
                Open Review Tools
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">Course Notes</h3>
            <button
              onClick={() => setActiveTab('notes')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note in Editor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectNotes.map(note => (
              <div
                key={note.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="capitalize">{note.templateUsed || 'Standard'} Template</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900">{note.title}</h4>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-4 leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      const deck = generateDeckFromNote(note.id);
                      if (deck) {
                        alert(`Generated flashcard deck "${deck.title}" with ${deck.cards.length} cards from note definitions!`);
                        setNotebookTab('revision');
                      }
                    }}
                    className="flex items-center space-x-1 text-xs text-emerald-800 hover:text-emerald-900 font-medium"
                    title="Extract definitions into flashcards"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Flashcards</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('notes')}
                    className="text-xs font-medium text-stone-700 hover:text-stone-900"
                  >
                    Edit Note &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">Subject Files & Slides</h3>
            <button
              onClick={() => setActiveModal('upload')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs divide-y divide-stone-100">
            {subjectResources.map(res => (
              <div
                key={res.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-stone-900 truncate">{res.name}</p>
                    <p className="text-[11px] text-stone-500">
                      {formatBytes(res.size)} • Uploaded {new Date(res.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-900">Course Task Plan</h3>
            <button
              onClick={() => setActiveModal('new_task')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs space-y-3">
            {subjectTasks.map(task => (
              <div
                key={task.id}
                className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                  task.completed ? 'bg-stone-50 opacity-60 border-stone-200' : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-0.5 text-stone-400 hover:text-emerald-700"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Due: {task.dueDate} • {task.estimatedMinutes} mins • {task.priority} priority
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Revision */}
      {activeTab === 'revision' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Flashcard Decks & Quizzes
              </h3>
              <p className="text-xs text-stone-500">Active recall materials for this subject</p>
            </div>
            <button
              onClick={() => setActiveTab('review')}
              className="px-3.5 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
            >
              Open Full Review Suite
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjectDecks.map(deck => (
              <div
                key={deck.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {deck.cards.length} Flashcards
                    </span>
                    <span>Created {new Date(deck.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-stone-900">{deck.title}</h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {deck.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Source: {deck.sourceSnippet ? 'Verified note excerpt' : 'Manual deck'}
                  </span>
                  <button
                    onClick={() => setActiveTab('review')}
                    className="flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice Deck</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
