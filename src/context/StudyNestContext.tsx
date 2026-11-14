import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Subject,
  Resource,
  ResourceType,
  Note,
  Task,
  FlashcardDeck,
  SelfQuiz,
  StudentProfile,
  StudyActivityLog,
  CardDifficulty,
  TestAttempt,
  WeakTopicReview,
  QuizQuestion,
  AccentColor,
  VisualTheme,
  MascotMood,
  VideoResource,
  Folder,
  AcademicTermId,
} from '../types';
import {
  initialProfile,
  initialSubjects,
  initialFolders,
  initialResources,
  initialNotes,
  initialTasks,
  initialDecks,
  initialQuizzes,
  initialActivities,
  initialVideos,
  microeconomicsSlides,
  microeconomicsStudyContent,
} from '../data/demoData';
import { exportStudyNestData, parseBackupFile } from '../lib/exportImport';
import { extractYouTubeId } from '../lib/youtube';

export type NavTab = 'dashboard' | 'subjects' | 'resources' | 'notes' | 'planner' | 'review';
export type ModalType =
  | 'none'
  | 'upload'
  | 'new_subject'
  | 'new_task'
  | 'new_note'
  | 'focus_timer'
  | 'settings'
  | 'study_view'
  | 'timed_test'
  | 'quiz_draft';

interface StudyNestContextType {
  // Navigation & View State
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  studyResource: Resource | null;
  setStudyResource: (resource: Resource | null) => void;
  openStudyView: (resource: Resource) => void;
  previewResource: Resource | null;
  setPreviewResource: (resource: Resource | null) => void;

  // Timed Test & Quiz Draft State
  activeTimedTestQuiz: SelfQuiz | null;
  startTimedTest: (quiz: SelfQuiz) => void;
  activeDraftQuiz: SelfQuiz | null;
  openDraftQuizReview: (quiz: SelfQuiz) => void;
  saveDraftQuiz: (quiz: SelfQuiz) => void;

  // Theme & Appearance
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  visualTheme: VisualTheme;
  setVisualTheme: (theme: VisualTheme) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  defaultQuizTimerMinutes: number;
  setDefaultQuizTimerMinutes: (min: number) => void;

  // Mascot State
  mascotEnabled: boolean;
  setMascotEnabled: (enabled: boolean) => void;
  mascotMood: MascotMood;
  mascotMessage: string | undefined;
  triggerMascotReaction: (mood: MascotMood, message?: string, durationMs?: number) => void;

  // Data Collections
  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  subjects: Subject[];
  folders: Folder[];
  resources: Resource[];
  videos: VideoResource[];
  notes: Note[];
  tasks: Task[];
  decks: FlashcardDeck[];
  quizzes: SelfQuiz[];
  activities: StudyActivityLog[];
  testAttempts: TestAttempt[];

  // Academic Terms & Folders
  selectedTermId: AcademicTermId;
  setSelectedTermId: (termId: AcademicTermId) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (folderId: string | null) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  moveFolder: (folderId: string, targetTermId: AcademicTermId, targetParentId: string | null) => void;
  moveResource: (resourceId: string, targetTermId: AcademicTermId, targetFolderId: string | null) => void;

  // Move Modal State
  activeMoveResource: Resource | null;
  setActiveMoveResource: (res: Resource | null) => void;

  // Folder Modal State
  isFolderModalOpen: boolean;
  setIsFolderModalOpen: (open: boolean) => void;
  folderModalMode: 'create' | 'rename';
  setFolderModalMode: (mode: 'create' | 'rename') => void;
  editingFolder: Folder | null;
  setEditingFolder: (folder: Folder | null) => void;
  parentFolderForNew: Folder | null;
  setParentFolderForNew: (folder: Folder | null) => void;

  // Unsupported Preview State
  unsupportedPreviewResource: Resource | null;
  setUnsupportedPreviewResource: (res: Resource | null) => void;

  // Video Actions
  activeVideo: VideoResource | null;
  setActiveVideo: (v: VideoResource | null) => void;
  isAddVideoModalOpen: boolean;
  setIsAddVideoModalOpen: (open: boolean) => void;
  addVideo: (video: Omit<VideoResource, 'id' | 'addedAt' | 'youtubeId'> & { url: string }) => VideoResource | null;
  deleteVideo: (id: string) => void;

  // Subject Actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt' | 'completedHoursThisWeek'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string, reassignSubjectId?: string) => void;

  // Resource Actions
  addResource: (resource: Omit<Resource, 'id' | 'uploadedAt' | 'termId'> & { termId?: AcademicTermId }) => Resource;
  updateResource: (id: string, updates: Partial<Resource>) => void;
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

  // Flashcards & Review Actions
  addDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>) => FlashcardDeck;
  updateCardDifficulty: (deckId: string, cardId: string, difficulty: CardDifficulty) => void;
  deleteDeck: (id: string) => void;
  createFlashcardsFromMissedQuestions: (questions: QuizQuestion[], title?: string) => FlashcardDeck;
  generateDeckFromNote: (noteId: string) => FlashcardDeck | null;
  weakTopics: WeakTopicReview[];

  // Quiz & Test Actions
  addQuiz: (quiz: Omit<SelfQuiz, 'id' | 'createdAt'>) => SelfQuiz;
  updateQuiz: (id: string, updates: Partial<SelfQuiz>) => void;
  deleteQuiz: (id: string) => void;
  recordTestAttempt: (attempt: Omit<TestAttempt, 'id' | 'timestamp'>) => TestAttempt;

  // Focus & Activity Actions
  logFocusSession: (subjectId: string, minutes: number) => void;

  // Persistence & Data Backup
  resetToDemoData: () => void;
  clearAllData: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<boolean>;

  // Computed Metrics
  todayTasks: Task[];
  upcomingDeadlines: Task[];
  recentResources: Resource[];
  completedTasksCount: number;
  totalCardsReviewed: number;
  weeklyStudyHours: number;
  averageQuizScore: number;
}

const STORAGE_KEY = 'studynest_lms_v2';

const StudyNestContext = createContext<StudyNestContextType | undefined>(undefined);

export const StudyNestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial persistent state
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Could not load localStorage key ${key}:`, e);
      return fallback;
    }
  };

  const [profile, setProfile] = useState<StudentProfile>(() => loadStored('profile', initialProfile));
  const [subjects, setSubjects] = useState<Subject[]>(() => loadStored('subjects', initialSubjects));
  const [folders, setFolders] = useState<Folder[]>(() => loadStored('folders', initialFolders));
  const [resources, setResources] = useState<Resource[]>(() => loadStored('resources', initialResources));
  const [videos, setVideos] = useState<VideoResource[]>(() => loadStored('videos', initialVideos));
  const [notes, setNotes] = useState<Note[]>(() => loadStored('notes', initialNotes));
  const [tasks, setTasks] = useState<Task[]>(() => loadStored('tasks', initialTasks));
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => loadStored('decks', initialDecks));
  const [quizzes, setQuizzes] = useState<SelfQuiz[]>(() => loadStored('quizzes', initialQuizzes));
  const [activities, setActivities] = useState<StudyActivityLog[]>(() => loadStored('activities', initialActivities));

  // Terms and Folder navigation
  const [selectedTermId, setSelectedTermIdState] = useState<AcademicTermId>(() => loadStored('selected_term', 'term-2'));
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Move Modal and Folder Modal state
  const [activeMoveResource, setActiveMoveResource] = useState<Resource | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'rename'>('create');
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [parentFolderForNew, setParentFolderForNew] = useState<Folder | null>(null);
  const [unsupportedPreviewResource, setUnsupportedPreviewResource] = useState<Resource | null>(null);

  const setSelectedTermId = (termId: AcademicTermId) => {
    setSelectedTermIdState(termId);
    setSelectedFolderId(null); // Reset folder when switching terms
  };

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(() =>
    loadStored('test_attempts', [
      {
        id: 'attempt-sample-1',
        quizId: 'quiz-dt-presentation',
        quizTitle: 'Design Thinking: HSB Campus Services Assessment',
        subjectId: 'sub-dt101',
        timestamp: '2026-11-14T14:35:00Z',
        durationSeconds: 600,
        timeSpentSeconds: 480,
        totalQuestions: 8,
        correctCount: 7,
        scorePercentage: 88,
        userAnswers: [
          { questionId: 'q1', selectedIndex: 0, isCorrect: true },
          { questionId: 'q2', selectedIndex: 0, isCorrect: true },
          { questionId: 'q3', selectedIndex: 0, isCorrect: true },
          { questionId: 'q4', selectedIndex: 0, isCorrect: true },
          { questionId: 'q5', selectedIndex: 1, isCorrect: true },
          { questionId: 'q6', selectedIndex: 0, isCorrect: true },
          { questionId: 'q7', selectedIndex: 0, isCorrect: true },
          { questionId: 'q8', selectedIndex: 1, isCorrect: false },
        ],
        missedQuestionIds: ['q8'],
      },
    ])
  );

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [studyResource, setStudyResource] = useState<Resource | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoResource | null>(null);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  // Active Timed Test & Draft Quiz Review
  const [activeTimedTestQuiz, setActiveTimedTestQuiz] = useState<SelfQuiz | null>(null);
  const [activeDraftQuiz, setActiveDraftQuiz] = useState<SelfQuiz | null>(null);

  // Mascot Companion State
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotMessage, setMascotMessage] = useState<string | undefined>(undefined);

  // Theme & Appearance
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => profile.themeMode === 'dark');
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => profile.accentColor || 'rose');
  const [visualTheme, setVisualThemeState] = useState<VisualTheme>(() => profile.visualTheme || 'anime');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => profile.reducedMotion || false);
  const [defaultQuizTimerMinutes, setDefaultQuizTimerMinutesState] = useState<number>(() => profile.defaultQuizTimerMinutes || 10);
  const [mascotEnabled, setMascotEnabledState] = useState<boolean>(() => profile.mascotEnabled ?? true);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_folders`, JSON.stringify(folders));
      localStorage.setItem(`${STORAGE_KEY}_resources`, JSON.stringify(resources));
      localStorage.setItem(`${STORAGE_KEY}_videos`, JSON.stringify(videos));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${STORAGE_KEY}_decks`, JSON.stringify(decks));
      localStorage.setItem(`${STORAGE_KEY}_quizzes`, JSON.stringify(quizzes));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_test_attempts`, JSON.stringify(testAttempts));
      localStorage.setItem(`${STORAGE_KEY}_selected_term`, JSON.stringify(selectedTermId));
    } catch (e) {
      console.error('Failed to sync to localStorage:', e);
    }
  }, [profile, subjects, folders, resources, videos, notes, tasks, decks, quizzes, activities, testAttempts, selectedTermId]);

  // Ensure Microeconomics PDF is fully readable and linked to static 328KB PDF asset
  useEffect(() => {
    setResources(prev => {
      const hasMicro = prev.some(r => r.name.toLowerCase().includes('microeconomics'));
      if (!hasMicro) {
        const microRes: Resource = {
          id: 'res-microeconomics-pdf',
          subjectId: 'sub-dt101',
          termId: 'term-2',
          folderId: 'folder-t2-dt',
          name: 'Session1_Introduction_to_Microeconomics_Detailed.pdf',
          size: 328574,
          type: 'pdf',
          status: 'ready',
          uploadedAt: '2026-11-14T20:13:00Z',
          tags: ['microeconomics', 'scarcity', 'opportunity-cost', 'ppf'],
          content: microeconomicsStudyContent,
          slides: microeconomicsSlides,
          slideCount: 5,
          downloadUrl: '/Session1_Introduction_to_Microeconomics_Detailed.pdf',
          canPreview: true,
        };
        return [microRes, ...prev];
      } else {
        return prev.map(r => {
          if (r.name.toLowerCase().includes('microeconomics')) {
            return {
              ...r,
              name: 'Session1_Introduction_to_Microeconomics_Detailed.pdf',
              downloadUrl: '/Session1_Introduction_to_Microeconomics_Detailed.pdf',
              size: 328574,
              type: 'pdf' as ResourceType,
              canPreview: true,
              content: microeconomicsStudyContent,
              slides: microeconomicsSlides,
              slideCount: 5,
            };
          }
          return r;
        });
      }
    });
  }, []);

  // Sync dark mode class to HTML tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    setProfile(prev => ({ ...prev, themeMode: next ? 'dark' : 'light' }));
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    setProfile(prev => ({ ...prev, accentColor: color }));
  };

  const setVisualTheme = (theme: VisualTheme) => {
    setVisualThemeState(theme);
    setProfile(prev => ({ ...prev, visualTheme: theme }));
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
    setProfile(prev => ({ ...prev, reducedMotion: reduced }));
  };

  const setDefaultQuizTimerMinutes = (min: number) => {
    setDefaultQuizTimerMinutesState(min);
    setProfile(prev => ({ ...prev, defaultQuizTimerMinutes: min }));
  };

  const setMascotEnabled = (enabled: boolean) => {
    setMascotEnabledState(enabled);
    setProfile(prev => ({ ...prev, mascotEnabled: enabled }));
  };

  const triggerMascotReaction = (mood: MascotMood, message?: string, durationMs: number = 7000) => {
    setMascotMood(mood);
    setMascotMessage(message);
    if (durationMs > 0) {
      setTimeout(() => {
        setMascotMood('idle');
        setMascotMessage(undefined);
      }, durationMs);
    }
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Study View Helper
  const openStudyView = (resource: Resource) => {
    setStudyResource(resource);
    setActiveModal('study_view');
    triggerMascotReaction('studying', `Opening "${resource.name}". Let's dive in!`);
  };

  // Timed Test Helper
  const startTimedTest = (quiz: SelfQuiz) => {
    setActiveTimedTestQuiz(quiz);
    setActiveModal('timed_test');
    triggerMascotReaction('timer_alert', `Timed test starting for "${quiz.title}". You've got this! Focus and pace yourself.`);
  };

  // Draft Quiz Review Helper
  const openDraftQuizReview = (quiz: SelfQuiz) => {
    setActiveDraftQuiz(quiz);
    setActiveModal('quiz_draft');
    triggerMascotReaction('studying', `Review your generated questions before saving to the question bank.`);
  };

  const saveDraftQuiz = (quiz: SelfQuiz) => {
    setQuizzes(prev => {
      const idx = prev.findIndex(q => q.id === quiz.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = quiz;
        return next;
      }
      return [quiz, ...prev];
    });

    logActivity({
      type: 'quiz_taken',
      subjectId: quiz.subjectId,
      description: `Saved quiz: "${quiz.title}" (${quiz.questions.length} questions)`,
    });

    setActiveModal('none');
    setActiveDraftQuiz(null);
    triggerMascotReaction('celebrating', `Quiz "${quiz.title}" saved successfully to your question bank!`);
  };

  const logActivity = (item: Omit<StudyActivityLog, 'id' | 'timestamp'>) => {
    const newAct: StudyActivityLog = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Subject Handlers
  const addSubject = (subjectData: Omit<Subject, 'id' | 'createdAt' | 'completedHoursThisWeek'>): Subject => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedHoursThisWeek: 0,
    };
    setSubjects(prev => [newSubject, ...prev]);
    triggerMascotReaction('celebrating', `Created new subject: ${newSubject.name}!`);
    return newSubject;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    triggerMascotReaction('idle', `Subject updated.`);
  };

  const deleteSubject = (id: string, reassignSubjectId?: string) => {
    // If reassignSubjectId is specified, move resources/quizzes to that subject
    if (reassignSubjectId) {
      setResources(prev => prev.map(r => (r.subjectId === id ? { ...r, subjectId: reassignSubjectId } : r)));
      setQuizzes(prev => prev.map(q => (q.subjectId === id ? { ...q, subjectId: reassignSubjectId } : q)));
      setDecks(prev => prev.map(d => (d.subjectId === id ? { ...d, subjectId: reassignSubjectId } : d)));
      setNotes(prev => prev.map(n => (n.subjectId === id ? { ...n, subjectId: reassignSubjectId } : n)));
      setTasks(prev => prev.map(t => (t.subjectId === id ? { ...t, subjectId: reassignSubjectId } : t)));
    } else {
      // Remove or keep orphaned
      setResources(prev => prev.filter(r => r.subjectId !== id));
      setQuizzes(prev => prev.filter(q => q.subjectId !== id));
      setDecks(prev => prev.filter(d => d.subjectId !== id));
      setNotes(prev => prev.filter(n => n.subjectId !== id));
      setTasks(prev => prev.filter(t => t.subjectId !== id));
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (selectedSubjectId === id) setSelectedSubjectId(null);
  };

  // Folder Handlers
  const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt'>): Folder => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setFolders(prev => [newFolder, ...prev]);
    triggerMascotReaction('celebrating', `Created folder "${newFolder.name}"!`);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(f => (f.id === id ? { ...f, ...updates } : f)));
    triggerMascotReaction('studying', 'Folder updated.');
  };

  const deleteFolder = (id: string) => {
    const targetFolder = folders.find(f => f.id === id);
    if (!targetFolder) return;
    const parentId = targetFolder.parentId || null;
    const termId = targetFolder.termId;

    // Safely move all resources inside this folder to parent folder or root (never lose files)
    setResources(prev =>
      prev.map(r => (r.folderId === id ? { ...r, folderId: parentId, termId } : r))
    );
    // Safely move child subfolders to parent
    setFolders(prev =>
      prev
        .filter(f => f.id !== id)
        .map(f => (f.parentId === id ? { ...f, parentId, termId } : f))
    );

    if (selectedFolderId === id) {
      setSelectedFolderId(parentId);
    }
    triggerMascotReaction('idle', `Deleted folder "${targetFolder.name}". Files inside were safely preserved.`);
  };

  const moveFolder = (folderId: string, targetTermId: AcademicTermId, targetParentId: string | null) => {
    setFolders(prev =>
      prev.map(f => (f.id === folderId ? { ...f, termId: targetTermId, parentId: targetParentId } : f))
    );
  };

  const moveResource = (resourceId: string, targetTermId: AcademicTermId, targetFolderId: string | null) => {
    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, termId: targetTermId, folderId: targetFolderId } : r))
    );
    const res = resources.find(r => r.id === resourceId);
    triggerMascotReaction('studying', `Moved "${res?.name || 'file'}" to destination.`);
  };

  // Resource Handlers
  const addResource = (
    resData: Omit<Resource, 'id' | 'uploadedAt' | 'termId'> & { termId?: AcademicTermId }
  ): Resource => {
    const newRes: Resource = {
      ...resData,
      termId: resData.termId || selectedTermId || 'term-2',
      folderId: resData.folderId !== undefined ? resData.folderId : (selectedFolderId || null),
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    setResources(prev => [newRes, ...prev]);
    logActivity({
      type: 'file_uploaded',
      subjectId: newRes.subjectId,
      description: `Uploaded file: ${newRes.name} (${newRes.type.toUpperCase()})`,
    });
    triggerMascotReaction('celebrating', `Awesome! "${newRes.name}" uploaded and organized.`);
    return newRes;
  };

  const updateResource = (id: string, updates: Partial<Resource>) => {
    setResources(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  // Video Handlers
  const addVideo = (
    videoData: Omit<VideoResource, 'id' | 'addedAt' | 'youtubeId'> & { url: string }
  ): VideoResource | null => {
    const yId = extractYouTubeId(videoData.url);
    if (!yId) return null;

    const newVideo: VideoResource = {
      id: `vid-${Date.now()}`,
      subjectId: videoData.subjectId,
      title: videoData.title,
      url: videoData.url,
      youtubeId: yId,
      description: videoData.description,
      tags: videoData.tags || ['youtube'],
      addedAt: new Date().toISOString(),
    };

    setVideos(prev => [newVideo, ...prev]);
    logActivity({
      type: 'file_uploaded',
      subjectId: newVideo.subjectId,
      description: `Added YouTube Video: "${newVideo.title}"`,
    });
    triggerMascotReaction('celebrating', `Added YouTube study resource: "${newVideo.title}"!`);
    return newVideo;
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    if (activeVideo && activeVideo.id === id) {
      setActiveVideo(null);
    }
  };

  // Note Handlers
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    logActivity({
      type: 'note_created',
      subjectId: newNote.subjectId,
      description: `Created note: "${newNote.title}"`,
    });
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };

  // Task Handlers
  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedAt'>): Task => {
    const newTask: Task = {
      ...taskData,
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
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            logActivity({
              type: 'task_completed',
              subjectId: t.subjectId,
              description: `Completed task: "${t.title}"`,
              minutesSpent: t.estimatedMinutes,
            });
            triggerMascotReaction('celebrating', `Great job completing "${t.title}"!`);
          }
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Flashcards Handlers
  const addDeck = (deckData: Omit<FlashcardDeck, 'id' | 'createdAt'>): FlashcardDeck => {
    const newDeck: FlashcardDeck = {
      ...deckData,
      id: `deck-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDecks(prev => [newDeck, ...prev]);
    triggerMascotReaction('celebrating', `Created new flashcard deck with ${newDeck.cards.length} cards!`);
    return newDeck;
  };

  const updateCardDifficulty = (deckId: string, cardId: string, difficulty: CardDifficulty) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
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
      })
    );
  };

  const deleteDeck = (id: string) => {
    setDecks(prev => prev.filter(d => d.id !== id));
  };

  const createFlashcardsFromMissedQuestions = (questions: QuizQuestion[], title?: string): FlashcardDeck => {
    const newCards = questions.map((q, idx) => ({
      id: `card-missed-${Date.now()}-${idx}`,
      front: q.question,
      back: `${q.options[q.correctAnswerIndex]}\n\n💡 Explanation: ${q.explanation}`,
      difficulty: 'unreviewed' as CardDifficulty,
      reviewsCount: 0,
      topic: q.topic || 'Review Target',
      sourceSlideNumber: q.sourceSlideNumber,
    }));

    const deckTitle = title || `Review Deck: Weak Topics (${newCards.length} Cards)`;
    const newDeck = addDeck({
      subjectId: selectedSubjectId || subjects[0]?.id || 'sub-dt101',
      title: deckTitle,
      description: `Targeted review flashcards generated automatically from missed quiz questions.`,
      cards: newCards,
    });

    triggerMascotReaction('encouraging', `Generated ${newCards.length} review flashcards to conquer your weak spots!`);
    return newDeck;
  };

  const generateDeckFromNote = (noteId: string): FlashcardDeck | null => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return null;

    const lines = note.content.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#'));
    const cards = (lines.length > 0 ? lines : [note.content]).slice(0, 6).map((l, i) => ({
      id: `c-note-${Date.now()}-${i}`,
      front: `Concept from "${note.title}" (#${i + 1})`,
      back: l.replace(/^[#\-* ]+/, ''),
      difficulty: 'unreviewed' as CardDifficulty,
      reviewsCount: 0,
      topic: note.title,
    }));

    return addDeck({
      subjectId: note.subjectId,
      sourceNoteId: note.id,
      title: `Deck: ${note.title}`,
      description: `Flashcards generated from note: ${note.title}`,
      cards,
    });
  };

  // Quizzes Handlers
  const addQuiz = (quizData: Omit<SelfQuiz, 'id' | 'createdAt'>): SelfQuiz => {
    const newQuiz: SelfQuiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    return newQuiz;
  };

  const updateQuiz = (id: string, updates: Partial<SelfQuiz>) => {
    setQuizzes(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
  };

  // Record Timed Test Attempt
  const recordTestAttempt = (attemptData: Omit<TestAttempt, 'id' | 'timestamp'>): TestAttempt => {
    const newAttempt: TestAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setTestAttempts(prev => [newAttempt, ...prev]);

    // Update Quiz Best Score and Attempts Count
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id !== newAttempt.quizId) return q;
        const currentBest = q.bestScore || 0;
        return {
          ...q,
          bestScore: Math.max(currentBest, newAttempt.scorePercentage),
          lastAttemptDate: newAttempt.timestamp,
          attemptsCount: (q.attemptsCount || 0) + 1,
        };
      })
    );

    // Log Activity
    logActivity({
      type: 'timed_test',
      subjectId: newAttempt.subjectId,
      description: `Completed Timed Test: "${newAttempt.quizTitle}" (${newAttempt.correctCount}/${newAttempt.totalQuestions})`,
      minutesSpent: Math.round(newAttempt.timeSpentSeconds / 60),
      scorePercentage: newAttempt.scorePercentage,
    });

    // Mascot Reaction based on performance
    if (newAttempt.scorePercentage >= 80) {
      triggerMascotReaction(
        'celebrating',
        `Incredible! Scored ${newAttempt.scorePercentage}% on "${newAttempt.quizTitle}"!`
      );
    } else {
      triggerMascotReaction(
        'encouraging',
        `Finished with ${newAttempt.scorePercentage}%. Great effort! Review the missed questions below to master this topic.`
      );
    }

    return newAttempt;
  };

  const logFocusSession = (subjectId: string, minutes: number) => {
    const sub = subjects.find(s => s.id === subjectId);
    logActivity({
      type: 'focus_session',
      subjectId,
      description: `Focus study session on ${sub?.name || 'materials'}`,
      minutesSpent: minutes,
    });
    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, completedHoursThisWeek: s.completedHoursThisWeek + minutes / 60 } : s))
    );
  };

  // Weak Topics Diagnostic Engine (computes topics based on missed quiz questions across attempts)
  const weakTopics = useMemo<WeakTopicReview[]>(() => {
    const topicMap: Record<
      string,
      {
        subjectId: string;
        missedCount: number;
        total: number;
        lastDate: string;
        relatedResourceId?: string;
        sampleQuestions: QuizQuestion[];
      }
    > = {};

    testAttempts.forEach(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quizId);
      if (!quiz) return;

      attempt.userAnswers.forEach(ans => {
        const question = quiz.questions.find(q => q.id === ans.questionId);
        if (!question) return;

        const topicName = question.topic || `${quiz.title} General`;
        if (!topicMap[topicName]) {
          topicMap[topicName] = {
            subjectId: attempt.subjectId,
            missedCount: 0,
            total: 0,
            lastDate: attempt.timestamp,
            relatedResourceId: quiz.resourceId,
            sampleQuestions: [],
          };
        }

        topicMap[topicName].total += 1;
        if (!ans.isCorrect) {
          topicMap[topicName].missedCount += 1;
          if (!topicMap[topicName].sampleQuestions.some(sq => sq.id === question.id)) {
            topicMap[topicName].sampleQuestions.push(question);
          }
          if (new Date(attempt.timestamp) > new Date(topicMap[topicName].lastDate)) {
            topicMap[topicName].lastDate = attempt.timestamp;
          }
        }
      });
    });

    const list: WeakTopicReview[] = Object.keys(topicMap)
      .map(topic => {
        const data = topicMap[topic];
        const sub = subjects.find(s => s.id === data.subjectId);
        return {
          topic,
          subjectId: data.subjectId,
          subjectName: sub?.name || 'General',
          missedCount: data.missedCount,
          totalQuestionsEncountered: data.total,
          lastMissedDate: data.lastDate,
          relatedResourceId: data.relatedResourceId,
          sampleQuestions: data.sampleQuestions,
        };
      })
      .filter(item => item.missedCount > 0)
      .sort((a, b) => b.missedCount - a.missedCount);

    return list;
  }, [testAttempts, quizzes, subjects]);

  // Data Reset & Backup
  const resetToDemoData = () => {
    setProfile(initialProfile);
    setSubjects(initialSubjects);
    setFolders(initialFolders);
    setResources(initialResources);
    setVideos(initialVideos);
    setNotes(initialNotes);
    setTasks(initialTasks);
    setDecks(initialDecks);
    setQuizzes(initialQuizzes);
    setActivities(initialActivities);
    setTestAttempts([]);
    setSelectedTermIdState('term-2');
    setSelectedFolderId(null);
    setIsDarkMode(false);
    setAccentColorState('rose');
    setVisualThemeState('anime');
    setReducedMotionState(false);
    setDefaultQuizTimerMinutesState(10);
    setMascotEnabledState(true);
    localStorage.clear();
    triggerMascotReaction('celebrating', 'Reset to initial state with PowerPoint study resources ready!');
  };

  const clearAllData = () => {
    setSubjects([]);
    setFolders([]);
    setResources([]);
    setVideos([]);
    setNotes([]);
    setTasks([]);
    setDecks([]);
    setQuizzes([]);
    setActivities([]);
    setTestAttempts([]);
    setSelectedFolderId(null);
    localStorage.clear();
  };

  const exportBackup = () => {
    exportStudyNestData({
      profile,
      subjects,
      folders,
      resources,
      videos,
      notes,
      tasks,
      decks,
      quizzes,
      activities,
    });
  };

  const importBackup = async (file: File): Promise<boolean> => {
    try {
      const data = await parseBackupFile(file);
      if (!data) return false;
      if (data.profile) setProfile(data.profile);
      if (data.subjects) setSubjects(data.subjects);
      if (data.folders) setFolders(data.folders);
      if (data.resources) setResources(data.resources);
      if (data.videos) setVideos(data.videos);
      if (data.notes) setNotes(data.notes);
      if (data.tasks) setTasks(data.tasks);
      if (data.decks) setDecks(data.decks);
      if (data.quizzes) setQuizzes(data.quizzes);
      if (data.activities) setActivities(data.activities);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  // Traceable Computed Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = useMemo(() => tasks.filter(t => !t.completed && t.dueDate <= todayStr), [tasks, todayStr]);
  const upcomingDeadlines = useMemo(() => tasks.filter(t => !t.completed).sort((a, b) => a.dueDate.localeCompare(b.dueDate)), [tasks]);
  const recentResources = useMemo(() => [...resources].sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)), [resources]);
  const completedTasksCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
  const totalCardsReviewed = useMemo(() => decks.reduce((acc, d) => acc + d.cards.reduce((cAcc, c) => cAcc + c.reviewsCount, 0), 0), [decks]);
  const weeklyStudyHours = useMemo(() => subjects.reduce((acc, s) => acc + s.completedHoursThisWeek, 0), [subjects]);

  const averageQuizScore = useMemo(() => {
    if (testAttempts.length === 0) return 0;
    const sum = testAttempts.reduce((acc, a) => acc + a.scorePercentage, 0);
    return Math.round(sum / testAttempts.length);
  }, [testAttempts]);

  return (
    <StudyNestContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedSubjectId,
        setSelectedSubjectId,
        activeModal,
        setActiveModal,
        studyResource,
        setStudyResource,
        openStudyView,
        previewResource: studyResource,
        setPreviewResource: setStudyResource,

        activeTimedTestQuiz,
        startTimedTest,
        activeDraftQuiz,
        openDraftQuizReview,
        saveDraftQuiz,

        isDarkMode,
        toggleDarkMode,
        accentColor,
        setAccentColor,
        visualTheme,
        setVisualTheme,
        reducedMotion,
        setReducedMotion,
        defaultQuizTimerMinutes,
        setDefaultQuizTimerMinutes,

        mascotEnabled,
        setMascotEnabled,
        mascotMood,
        mascotMessage,
        triggerMascotReaction,

        profile,
        updateProfile,
        subjects,
        folders,
        resources,
        videos,
        notes,
        tasks,
        decks,
        quizzes,
        activities,
        testAttempts,

        selectedTermId,
        setSelectedTermId,
        selectedFolderId,
        setSelectedFolderId,
        addFolder,
        updateFolder,
        deleteFolder,
        moveFolder,
        moveResource,

        activeMoveResource,
        setActiveMoveResource,

        isFolderModalOpen,
        setIsFolderModalOpen,
        folderModalMode,
        setFolderModalMode,
        editingFolder,
        setEditingFolder,
        parentFolderForNew,
        setParentFolderForNew,

        unsupportedPreviewResource,
        setUnsupportedPreviewResource,

        activeVideo,
        setActiveVideo,
        isAddVideoModalOpen,
        setIsAddVideoModalOpen,
        addVideo,
        deleteVideo,

        addSubject,
        updateSubject,
        deleteSubject,

        addResource,
        updateResource,
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
        createFlashcardsFromMissedQuestions,
        generateDeckFromNote,
        weakTopics,

        addQuiz,
        updateQuiz,
        deleteQuiz,
        recordTestAttempt,

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
        averageQuizScore,
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
