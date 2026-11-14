// StudyNest Core Type Definitions

export type Priority = 'low' | 'medium' | 'high';

export type AcademicTermId = 'term-1' | 'term-2' | 'term-3' | 'term-4' | 'term-5' | 'term-6';

export interface AcademicTerm {
  id: AcademicTermId;
  name: string; // 'First Term', 'Second Term', 'Third Term', 'Fourth Term', 'Fifth Term', 'Sixth Term'
  shortName: string; // 'Term 1', 'Term 2', ...
  order: number;
  description: string;
}

export const ACADEMIC_TERMS: AcademicTerm[] = [
  { id: 'term-1', name: 'First Term', shortName: 'Term 1', order: 1, description: 'Foundations, Quantitative Methods & Communication' },
  { id: 'term-2', name: 'Second Term', shortName: 'Term 2', order: 2, description: 'Design Thinking, Product Management & Core Strategy' },
  { id: 'term-3', name: 'Third Term', shortName: 'Term 3', order: 3, description: 'Human-Computer Interaction & Market Analysis' },
  { id: 'term-4', name: 'Fourth Term', shortName: 'Term 4', order: 4, description: 'Operations Management, Financial Analytics & Systems' },
  { id: 'term-5', name: 'Fifth Term', shortName: 'Term 5', order: 5, description: 'Strategic Leadership, Technology Innovation & Electives' },
  { id: 'term-6', name: 'Sixth Term', shortName: 'Term 6', order: 6, description: 'Capstone Consulting, Industry Practicum & Defense' },
];

export interface Folder {
  id: string;
  name: string;
  termId: AcademicTermId;
  parentId?: string | null; // null or undefined means top level inside this term
  color?: string; // Folder color badge hex or token
  createdAt: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  termId?: AcademicTermId;
  color: string; // Tailwind color token or hex
  icon: string;  // Lucide icon name
  description: string;
  targetHoursPerWeek: number;
  completedHoursThisWeek: number;
  createdAt: string;
}

export type ResourceType = 'pptx' | 'ppt' | 'pdf' | 'docx' | 'markdown' | 'txt' | 'image' | 'csv' | 'doc' | 'spreadsheet' | 'archive' | 'binary' | 'other';
export type ResourceStatus = 'ready' | 'processing' | 'error';

export interface SlideData {
  slideNumber: number;
  title: string;
  content: string;
  paragraphs: string[];
  notes?: string;
}

export interface Resource {
  id: string;
  subjectId: string;
  termId: AcademicTermId; // Which term this file belongs to (term-1 .. term-6)
  folderId?: string | null; // Folder inside term (null = root of term)
  name: string;
  size: number; // in bytes
  type: ResourceType | string;
  status: ResourceStatus;
  uploadedAt: string;
  content: string; // Text content or simulated text extract
  slides?: SlideData[];
  slideCount?: number;
  downloadUrl?: string; // Static URL if hosted (e.g. /DT_Group_Presentation_7min.pptx)
  originalDataUrl?: string; // Raw base64 data URL for downloading user-uploaded file
  tags: string[];
  canPreview?: boolean; // Whether in-app reading/preview is supported
  previewUnavailableReason?: string; // Explanation when preview is unsupported
}

export interface VideoResource {
  id: string;
  subjectId: string;
  title: string;
  url: string;
  youtubeId: string;
  description?: string;
  tags: string[];
  addedAt: string;
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
  topic?: string;
  sourceSlideNumber?: number;
}

export interface FlashcardDeck {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  sourceResourceId?: string;
  sourceNoteId?: string;
  sourceSnippet?: string;
  cards: Flashcard[];
  createdAt: string;
}

export type QuestionType = 'multiple_choice' | 'true_false';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic?: string;
  sourceSlideNumber?: number;
}

export interface SelfQuiz {
  id: string;
  subjectId: string;
  resourceId?: string;
  title: string;
  description: string;
  sourceNoteId?: string;
  questions: QuizQuestion[];
  bestScore?: number;
  lastAttemptDate?: string;
  attemptsCount?: number;
  createdAt: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  flagged?: boolean;
}

export interface TestAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subjectId: string;
  timestamp: string;
  durationSeconds: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  userAnswers: UserAnswerRecord[];
  missedQuestionIds: string[];
}

export interface WeakTopicReview {
  topic: string;
  subjectId: string;
  subjectName: string;
  missedCount: number;
  totalQuestionsEncountered: number;
  lastMissedDate: string;
  relatedResourceId?: string;
  sampleQuestions: QuizQuestion[];
}

export type AccentColor = 'emerald' | 'rose' | 'indigo' | 'violet' | 'amber' | 'cyan';
export type VisualTheme = 'anime' | 'clean';
export type MascotMood = 'idle' | 'studying' | 'celebrating' | 'encouraging' | 'timer_alert';

export interface StudentProfile {
  name: string;
  email: string;
  major: string;
  academicTerm: string;
  weeklyTargetHours: number;
  currentWeeklyHours: number;
  themeMode: 'light' | 'dark';
  accentColor: AccentColor;
  visualTheme: VisualTheme;
  reducedMotion: boolean;
  defaultQuizTimerMinutes: number;
  mascotEnabled: boolean;
  theme: 'warm' | 'slate' | 'dusk';
  isDemoMode: boolean;
}

export interface StudyActivityLog {
  id: string;
  timestamp: string;
  type: 'task_completed' | 'card_reviewed' | 'note_created' | 'file_uploaded' | 'quiz_taken' | 'timed_test' | 'focus_session';
  subjectId?: string;
  description: string;
  minutesSpent?: number;
  scorePercentage?: number;
}
