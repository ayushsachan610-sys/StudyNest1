import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Subject,
  Resource,
  Note,
  Task,
  FlashcardDeck,
  SelfQuiz,
  StudentProfile,
  StudyActivityLog,
  CardDifficulty,
} from '../types';
import {
  initialProfile,
  initialSubjects,
  initialResources,
  initialNotes,
  initialTasks,
  initialDecks,
  initialQuizzes,
  initialActivities,
} from '../data/demoData';
import { exportStudyNestData, parseBackupFile } from '../lib/exportImport';

export type NavTab = 'dashboard' | 'subjects' | 'resources' | 'notes' | 'planner' | 'review';
export type ModalType = 'none' | 'upload' | 'new_subject' | 'new_task' | 'new_note' | 'focus_timer' | 'settings' | 'file_preview';

interface StudyNestContextType {
  // Navigation & View State
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  previewResource: Resource | null;
  setPreviewResource: (resource: Resource | null) => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data Collections
  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  subjects: Subject[];
  resources: Resource[];
  notes: Note[];
  tasks: Task[];
  decks: FlashcardDeck[];
  quizzes: SelfQuiz[];
  activities: StudyActivityLog[];

  // Subject Actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'completedHoursThisWeek'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Resource Actions
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt'>) => Resource;
  deleteResource: (id: string) => void;

  // Note Actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  // Revision Actions
  addDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>) => FlashcardDeck;
  updateCardDifficulty: (deckId: string, cardId: string, difficulty: CardDifficulty) => void;
  deleteDeck: (id: string) => void;
  generateDeckFromNote: (noteId: string) => FlashcardDeck | null;
  submitQuizAttempt: (quizId: string, scorePercentage: number) => void;

  // Focus & Activity Actions
  logFocusSession: (subjectId: string, minutes: number) => void;

  // Data Backup & Demo State
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<boolean>;

  // Traceable Computed Metrics
  todayTasks: Task[];
  upcomingDeadlines: Task[];
  recentResources: Resource[];
  completedTasksCount: number;
  totalCardsReviewed: number;
  weeklyStudyHours: number;
}

const STORAGE_KEY = 'studynest_workspace_v1';

const StudyNestContext = createContext<StudyNestContextType | undefined>(undefined);

export const StudyNestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('studynest_dark_mode');
    if (saved !== null) return saved === 'true';
    return false;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studynest_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studynest_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Core Data
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.name === 'Alex Rivera' || !p.name) {
          p.name = 'Ayush';
        }
        return p;
      } catch {
        return initialProfile;
      }
    }
    return initialProfile;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_resources`);
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_decks`);
    return saved ? JSON.parse(saved) : initialDecks;
  });

  const [quizzes, setQuizzes] = useState<SelfQuiz[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quizzes`);
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [activities, setActivities] = useState<StudyActivityLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_resources`, JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_decks`, JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quizzes`, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
  }, [activities]);

  // Activity logger helper
  const logActivity = (type: StudyActivityLog['type'], description: string, subjectId?: string, minutesSpent?: number) => {
    const newAct: StudyActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      subjectId,
      description,
      minutesSpent,
    };
    setActivities(prev => [newAct, ...prev.slice(0, 49)]); // Keep last 50 activities
  };

  // Profile
  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Subject Handlers
  const addSubject = (data: Omit<Subject, 'id' | 'createdAt' | 'completedHoursThisWeek'>): Subject => {
    const newSub: Subject = {
      ...data,
      id: `sub-${Date.now()}`,
      completedHoursThisWeek: 0,
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => [newSub, ...prev]);
    logActivity('task_completed', `Created new subject workspace: ${newSub.name}`, newSub.id);
    return newSub;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteSubject = (id: string) => {
    const sub = subjects.find(s => s.id === id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (selectedSubjectId === id) {
      setSelectedSubjectId(null);
    }
    if (sub) {
      logActivity('task_completed', `Archived subject: ${sub.name}`);
    }
  };

  // Resource Handlers
  const addResource = (data: Omit<Resource, 'id' | 'uploadedAt'>): Resource => {
    const newRes: Resource = {
      ...data,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setResources(prev => [newRes, ...prev]);
    logActivity('file_uploaded', `Uploaded resource: ${newRes.name}`, newRes.subjectId);
    return newRes;
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Note Handlers
  const addNote = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const timestamp = new Date().toISOString();
    const newNote: Note = {
      ...data,
      id: `note-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setNotes(prev => [newNote, ...prev]);
    logActivity('note_created', `Wrote study note: ${newNote.title}`, newNote.subjectId);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const timestamp = new Date().toISOString();
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: timestamp } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  // Task Handlers
  const addTask = (data: Omit<Task, 'id' | 'completed' | 'completedAt'>): Task => {
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const willComplete = !t.completed;
          const updated: Task = {
            ...t,
            completed: willComplete,
            completedAt: willComplete ? new Date().toISOString() : undefined,
          };
          if (willComplete) {
            logActivity('task_completed', `Checked off task: ${t.title}`, t.subjectId, t.estimatedMinutes);
            // Traceable progress: add estimated hours to subject
            const hours = (t.estimatedMinutes || 30) / 60;
            setSubjects(subs =>
              subs.map(s =>
                s.id === t.subjectId
                  ? { ...s, completedHoursThisWeek: parseFloat((s.completedHoursThisWeek + hours).toFixed(1)) }
                  : s
              )
            );
            setProfile(p => ({
              ...p,
              currentWeeklyHours: parseFloat((p.currentWeeklyHours + hours).toFixed(1)),
            }));
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Revision / Flashcards Handlers
  const addDeck = (data: Omit<FlashcardDeck, 'id' | 'createdAt'>): FlashcardDeck => {
    const newDeck: FlashcardDeck = {
      ...data,
      id: `deck-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDecks(prev => [newDeck, ...prev]);
    return newDeck;
  };

  const updateCardDifficulty = (deckId: string, cardId: string, difficulty: CardDifficulty) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id === deckId) {
          return {
            ...d,
            cards: d.cards.map(c =>
              c.id === cardId
                ? {
                    ...c,
                    difficulty,
                    reviewsCount: c.reviewsCount + 1,
                    lastReviewed: new Date().toISOString(),
                  }
                : c
            ),
          };
        }
        return d;
      })
    );
    logActivity('card_reviewed', `Reviewed flashcard in deck`, undefined, 2);
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  // Deterministic Note-to-Deck Generator (Traceable, No Hallucinated AI)
  const generateDeckFromNote = (noteId: string): FlashcardDeck | null => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return null;

    // Parse note lines looking for definition patterns (e.g. "**Term:** Definition" or "Term - Definition" or lines under headings)
    const lines = note.content.split('\n');
    const extractedCards: Array<{ front: string; back: string }> = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      // Match "**Term:** Definition"
      const boldColonMatch = trimmed.match(/^\-?\s*\*\*([^*]+)\*\*:\s*(.+)$/);
      if (boldColonMatch && boldColonMatch[1] && boldColonMatch[2]) {
        extractedCards.push({
          front: boldColonMatch[1].trim(),
          back: boldColonMatch[2].trim(),
        });
        return;
      }

      // Match "Term - Definition"
      const dashMatch = trimmed.match(/^\-?\s*([A-Za-z0-9\s]{3,35})\s+–\s+(.+)$/) || trimmed.match(/^\-?\s*([A-Za-z0-9\s]{3,35})\s+-\s+(.+)$/);
      if (dashMatch && dashMatch[1] && dashMatch[2] && dashMatch[2].length > 15) {
        extractedCards.push({
          front: dashMatch[1].trim(),
          back: dashMatch[2].trim(),
        });
      }
    });

    // If fewer than 2 found, create cards based on note title and key summary
    if (extractedCards.length === 0) {
      extractedCards.push(
        {
          front: `Core Concept from ${note.title}`,
          back: note.content.slice(0, 180) + '...',
        },
        {
          front: `Key Application: ${note.title}`,
          back: `Synthesize main takeaways from note: "${note.title}".`,
        }
      );
    }

    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      subjectId: note.subjectId,
      title: `Deck: ${note.title}`,
      description: `Generated directly from note: "${note.title}". Cites exact definitions.`,
      sourceNoteId: note.id,
      sourceSnippet: note.content.slice(0, 160) + '...',
      createdAt: new Date().toISOString(),
      cards: extractedCards.map((c, idx) => ({
        id: `c-gen-${Date.now()}-${idx}`,
        front: c.front,
        back: c.back,
        difficulty: 'unreviewed',
        reviewsCount: 0,
      })),
    };

    setDecks(prev => [newDeck, ...prev]);
    logActivity('note_created', `Generated ${extractedCards.length} flashcards from note "${note.title}"`, note.subjectId);
    return newDeck;
  };

  const submitQuizAttempt = (quizId: string, scorePercentage: number) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id === quizId) {
          const newBest = Math.max(q.bestScore ?? 0, scorePercentage);
          return {
            ...q,
            bestScore: newBest,
            lastAttemptDate: new Date().toISOString(),
          };
        }
        return q;
      })
    );
    const quiz = quizzes.find(q => q.id === quizId);
    logActivity('quiz_taken', `Completed quiz: ${quiz?.title || 'Quiz'} (${scorePercentage}%)`, quiz?.subjectId, 10);
  };

  // Focus Session Logger
  const logFocusSession = (subjectId: string, minutes: number) => {
    const hours = parseFloat((minutes / 60).toFixed(1));
    setSubjects(prev =>
      prev.map(s =>
        s.id === subjectId
          ? { ...s, completedHoursThisWeek: parseFloat((s.completedHoursThisWeek + hours).toFixed(1)) }
          : s
      )
    );
    setProfile(p => ({
      ...p,
      currentWeeklyHours: parseFloat((p.currentWeeklyHours + hours).toFixed(1)),
    }));
    const sub = subjects.find(s => s.id === subjectId);
    logActivity('focus_session', `Logged ${minutes} min focused study sprint on ${sub?.name || 'General Study'}`, subjectId, minutes);
  };

  // Demo & Backup Handlers
  const resetToDemoData = () => {
    setProfile(initialProfile);
    setSubjects(initialSubjects);
    setResources(initialResources);
    setNotes(initialNotes);
    setTasks(initialTasks);
    setDecks(initialDecks);
    setQuizzes(initialQuizzes);
    setActivities(initialActivities);
    localStorage.clear();
  };

  const clearAllData = () => {
    setSubjects([]);
    setResources([]);
    setNotes([]);
    setTasks([]);
    setDecks([]);
    setQuizzes([]);
    setActivities([]);
    setProfile(p => ({ ...p, isDemoMode: false, currentWeeklyHours: 0 }));
    localStorage.clear();
  };

  const exportBackup = () => {
    exportStudyNestData({
      profile,
      subjects,
      resources,
      notes,
      tasks,
      decks,
      quizzes,
      activities,
    });
  };

  const importBackup = async (file: File): Promise<boolean> => {
    try {
      const backup = await parseBackupFile(file);
      if (backup.profile) setProfile(backup.profile);
      if (backup.subjects) setSubjects(backup.subjects);
      if (backup.resources) setResources(backup.resources);
      if (backup.notes) setNotes(backup.notes);
      if (backup.tasks) setTasks(backup.tasks);
      if (backup.decks) setDecks(backup.decks);
      if (backup.quizzes) setQuizzes(backup.quizzes);
      if (backup.activities) setActivities(backup.activities);
      return true;
    } catch {
      return false;
    }
  };

  // Traceable Computed Metrics
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate === todayStr || (!t.completed && t.dueDate < todayStr));
  }, [tasks, todayStr]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter(t => !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 6);
  }, [tasks]);

  const recentResources = useMemo(() => {
    return [...resources]
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
      .slice(0, 5);
  }, [resources]);

  const completedTasksCount = useMemo(() => {
    return tasks.filter(t => t.completed).length;
  }, [tasks]);

  const totalCardsReviewed = useMemo(() => {
    return decks.reduce((total, deck) => {
      return total + deck.cards.reduce((sum, c) => sum + c.reviewsCount, 0);
    }, 0);
  }, [decks]);

  const weeklyStudyHours = useMemo(() => {
    return parseFloat(subjects.reduce((sum, s) => sum + s.completedHoursThisWeek, 0).toFixed(1));
  }, [subjects]);

  return (
    <StudyNestContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        activeModal,
        setActiveModal,
        previewResource,
        setPreviewResource,
        isDarkMode,
        toggleDarkMode,
        profile,
        updateProfile,
        subjects,
        resources,
        notes,
        tasks,
        decks,
        quizzes,
        activities,
        addSubject,
        updateSubject,
        deleteSubject,
        addResource,
        deleteResource,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addDeck,
        updateCardDifficulty,
        deleteDeck,
        generateDeckFromNote,
        submitQuizAttempt,
        logFocusSession,
        resetToDemoData,
        clearAllData,
        exportBackup,
        importBackup,
        todayTasks,
        upcomingDeadlines,
        recentResources,
        completedTasksCount,
        totalCardsReviewed,
        weeklyStudyHours,
      }}
    >
      {children}
    </StudyNestContext.Provider>
  );
};

export const useStudyNest = () => {
  const context = useContext(StudyNestContext);
  if (!context) {
    throw new Error('useStudyNest must be used within a StudyNestProvider');
  }
  return context;
};
