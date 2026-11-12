import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Sparkles,
  BookOpen,
  Check,
  FileText,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { Note } from '../../types';

const TEMPLATES = [
  {
    id: 'cornell',
    name: 'Cornell Notes',
    content: `# Cornell Notes: [Topic Title]

## CUES & QUESTIONS
- Key Question 1?
- Key Vocabulary Term:
- Exam Concept:

## NOTES
- Main idea from lecture or reading
- Detailed bullet points and explanations
- Formulas, frameworks, or case studies

## SUMMARY
Synthesize the core takeaway in 2 to 3 concise sentences.`,
  },
  {
    id: 'lecture',
    name: 'Lecture Notes',
    content: `# Lecture: [Course & Topic]
**Date:** ${new Date().toLocaleDateString()}
**Speaker / Professor:** 

## Key Announcements & Exam Dates
- 

## Core Lecture Content
- 
- 

## Action Items & Readings to Complete
- [ ] Read Chapter 
- [ ] Schedule revision task`,
  },
  {
    id: 'summary',
    name: 'Topic Summary',
    content: `# Topic Summary: [Concept Name]

## 1. Definition
Clear, high-signal definition of the core concept.

## 2. Key Frameworks & Proofs
- Framework Step 1:
- Framework Step 2:

## 3. Real-World Application
How does this apply in practice?`,
  },
  {
    id: 'questions',
    name: 'Questions to Revisit',
    content: `# Questions to Revisit Before Exams

## Unresolved Questions from Class
- [ ] Question 1: What is the underlying mechanism?
- [ ] Question 2: How does this differ from the previous theory?

## Office Hours Follow-Up
- Professor / TA meeting notes:`,
  },
];

export const NotesView: React.FC = () => {
  const {
    notes,
    subjects,
    resources,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    generateDeckFromNote,
    setActiveTab,
  } = useStudyNest();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [saveStatus, setSaveStatus] = useState<string>('Saved just now');

  const currentNote = notes.find(n => n.id === selectedNoteId);

  // Sync save status on content update
  useEffect(() => {
    setSaveStatus('Saved just now');
  }, [currentNote?.updatedAt]);

  const handleCreateNewNote = () => {
    const newNote = addNote({
      title: 'Untitled Study Note',
      subjectId: subjects[0]?.id || 'sub-pm202',
      content: '# Untitled Note\n\nStart typing lecture notes or pick a template above...',
      tags: ['draft'],
      isPinned: false,
    });
    setSelectedNoteId(newNote.id);
  };

  const handleApplyTemplate = (tplContent: string, templateKey: Note['templateUsed']) => {
    if (!currentNote) return;
    if (
      currentNote.content.length > 50 &&
      !window.confirm('Apply template? This will append the template scaffolding to your current note.')
    ) {
      return;
    }
    updateNote(currentNote.id, {
      content: currentNote.content ? `${currentNote.content}\n\n${tplContent}` : tplContent,
      templateUsed: templateKey,
    });
  };

  const handleGenerateDeck = () => {
    if (!currentNote) return;
    const deck = generateDeckFromNote(currentNote.id);
    if (deck) {
      alert(`Flashcard deck "${deck.title}" created with ${deck.cards.length} cards based on "${currentNote.title}".`);
      setActiveTab('review');
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesQuery =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubjectFilter === 'all' || n.subjectId === selectedSubjectFilter;
    return matchesQuery && matchesSubject;
  });

  // Sort pinned to the top, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Study Notes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Structured lecture notes, Cornell method summaries, and revision syntheses
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Dual Workspace: Master List (4 cols) & Editor (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left: Notes Sidebar List */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 shadow-2xs p-4 flex flex-col space-y-3">
          {/* Search & Subject Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedSubjectFilter}
              onChange={e => setSelectedSubjectFilter(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden"
            >
              <option value="all">All Subjects ({notes.length})</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes items */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {sortedNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No notes match criteria.
              </div>
            ) : (
              sortedNotes.map(note => {
                const isSelected = note.id === selectedNoteId;
                const subject = subjects.find(s => s.id === note.subjectId);
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all text-left relative ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                        : 'bg-stone-50/60 border-stone-200/60 hover:bg-stone-100/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-1.5 truncate">
                        {note.isPinned && (
                          <Pin className="w-3 h-3 text-amber-600 fill-amber-500 shrink-0" />
                        )}
                        <h4
                          className={`text-xs font-semibold truncate ${
                            isSelected ? 'text-emerald-950' : 'text-stone-900'
                          }`}
                        >
                          {note.title}
                        </h4>
                      </div>

                      {subject && (
                        <span
                          className="font-medium px-1 rounded text-[9px] shrink-0 ml-1"
                          style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                        >
                          {subject.code}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {note.content.replace(/^#+\s+/gm, '')}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/50 text-[10px] text-stone-400">
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      <span className="capitalize">{note.templateUsed || 'standard'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Note Editor Workspace */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 shadow-card flex flex-col overflow-hidden">
          {currentNote ? (
            <>
              {/* Editor Top Bar */}
              <div className="p-4 sm:p-5 border-b border-stone-100 space-y-3 bg-stone-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Subject and Resource Link */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={currentNote.subjectId}
                      onChange={e => updateNote(currentNote.id, { subjectId: e.target.value })}
                      className="text-xs px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-800 font-medium focus:outline-hidden"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code} — {s.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={currentNote.resourceId || ''}
                      onChange={e => updateNote(currentNote.id, { resourceId: e.target.value || undefined })}
                      className="text-xs px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-600 focus:outline-hidden max-w-[200px] truncate"
                    >
                      <option value="">No linked resource</option>
                      {resources
                        .filter(r => r.subjectId === currentNote.subjectId)
                        .map(r => (
                          <option key={r.id} value={r.id}>
                            File: {r.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Actions: Pin, Save Status, Flashcards, Delete */}
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1 text-[11px] text-emerald-700 font-medium px-2 py-0.5 rounded bg-emerald-50">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>{saveStatus}</span>
                    </span>

                    <button
                      onClick={() => togglePinNote(currentNote.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        currentNote.isPinned
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'border-stone-200 text-stone-400 hover:text-stone-700'
                      }`}
                      title={currentNote.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleGenerateDeck}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      title="Extract definitions from this note into active flashcards"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Generate Cards</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete note "${currentNote.title}"?`)) {
                          deleteNote(currentNote.id);
                          const remaining = notes.filter(n => n.id !== currentNote.id);
                          if (remaining.length > 0) setSelectedNoteId(remaining[0].id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editable Title */}
                <input
                  type="text"
                  value={currentNote.title}
                  onChange={e => updateNote(currentNote.id, { title: e.target.value })}
                  placeholder="Note Title..."
                  className="w-full text-lg sm:text-xl font-serif font-bold text-stone-900 bg-transparent border-none focus:outline-hidden placeholder:text-stone-300"
                />

                {/* Note Templates Toolbar */}
                <div className="flex items-center space-x-1.5 pt-1 overflow-x-auto">
                  <span className="text-[11px] text-stone-400 font-medium shrink-0">Templates:</span>
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      onClick={() => handleApplyTemplate(tpl.content, tpl.id as Note['templateUsed'])}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 shrink-0 transition-colors"
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area Body */}
              <div className="flex-1 p-5 flex flex-col bg-white">
                <textarea
                  value={currentNote.content}
                  onChange={e => updateNote(currentNote.id, { content: e.target.value })}
                  placeholder="Write your study notes here using Markdown..."
                  className="w-full flex-1 resize-none font-sans text-sm text-stone-800 leading-relaxed border-none focus:outline-hidden placeholder:text-stone-300"
                  rows={20}
                />
              </div>

              {/* Footer bar */}
              <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <div className="flex items-center space-x-3">
                  <span>
                    Word count: <strong>{currentNote.content.trim().split(/\s+/).filter(Boolean).length}</strong> words
                  </span>
                  <span>•</span>
                  <span>
                    Lines: <strong>{currentNote.content.split('\n').length}</strong>
                  </span>
                </div>
                <span>Markdown enabled. Local persistence active.</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <FileText className="w-12 h-12 text-stone-300 mb-3" />
              <h3 className="font-serif text-base font-bold text-stone-800">No Note Selected</h3>
              <p className="text-xs text-stone-500 mt-1">
                Select an existing note from the list or create a new one.
              </p>
              <button
                onClick={handleCreateNewNote}
                className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-medium shadow-xs"
              >
                Create New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
