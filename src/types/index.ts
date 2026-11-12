// StudyNest Core Type Definitions

export type Priority = 'low' | 'medium' | 'high';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Tailwind color token or hex
  icon: string;  // Lucide icon name
  description: string;
  targetHoursPerWeek: number;
  completedHoursThisWeek: number;
  createdAt: string;
}

export type ResourceType = 'pdf' | 'markdown' | 'txt' | 'code' | 'csv' | 'image' | 'doc';
export type ResourceStatus = 'ready' | 'processing' | 'error';

export interface Resource {
  id: string;
  subjectId: string;
  name: string;
  size: number; // in bytes
  type: ResourceType;
  status: ResourceStatus;
  uploadedAt: string;
  content: string; // Text content or simulated text extract
  downloadUrl?: string;
  tags: string[];
}

export interface Note {
  id: string;
  subjectId: string;
  resourceId?: string;
  title: string;
  content: string;
  templateUsed?: 'cornell' | 'lecture' | 'summary' | 'blank';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes: number;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export type CardDifficulty = 'easy' | 'good' | 'hard' | 'again' | 'medium' | 'unreviewed';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty?: CardDifficulty;
  reviewsCount: number;
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  sourceNoteId?: string;
  sourceSnippet?: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface SelfQuiz {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  sourceNoteId?: string;
  questions: QuizQuestion[];
  bestScore?: number;
  lastAttemptDate?: string;
  createdAt: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  major: string;
  academicTerm: string;
  weeklyTargetHours: number;
  currentWeeklyHours: number;
  theme: 'warm' | 'slate' | 'dusk';
  isDemoMode: boolean;
}

export interface StudyActivityLog {
  id: string;
  timestamp: string;
  type: 'task_completed' | 'card_reviewed' | 'note_created' | 'file_uploaded' | 'quiz_taken' | 'focus_session';
  subjectId?: string;
  description: string;
  minutesSpent?: number;
}
