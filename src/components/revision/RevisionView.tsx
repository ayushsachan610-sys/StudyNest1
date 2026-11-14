import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Plus,
  Clock,
  ChevronRight,
  Target,
  AlertTriangle,
  RotateCw,
  Flame,
  Layers,
  Award,
  BookMarked,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { FlashcardDeck, SelfQuiz, CardDifficulty, QuizQuestion } from '../../types';
import { generateDraftQuestionsFromSlides } from '../../lib/quizGenerator';

export const RevisionView: React.FC = () => {
  const {
    decks,
    quizzes,
    subjects,
    resources,
    updateCardDifficulty,
    startTimedTest,
    openDraftQuizReview,
    createFlashcardsFromMissedQuestions,
    weakTopics,
    openStudyView,
    addDeck,
    visualTheme,
    reducedMotion,
    triggerMascotReaction,
  } = useStudyNest();

  const [activeTab, setActiveTab] = useState<'decks' | 'quizzes' | 'weak_topics'>('decks');

  // Deck Player State
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);

  // Deck Player Handlers
  const startDeck = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setDeckCompleted(false);
    triggerMascotReaction('studying', `Studying "${deck.title}". Click or press Space to flip!`);
  };

  const handleRateCard = (difficulty: CardDifficulty) => {
    if (!activeDeck) return;
    const currentCard = activeDeck.cards[currentCardIndex];
    updateCardDifficulty(activeDeck.id, currentCard.id, difficulty);

    if (currentCardIndex + 1 < activeDeck.cards.length) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setDeckCompleted(true);
      if (!reducedMotion) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      }
      triggerMascotReaction('celebrating', `Deck completed! Every repetition reinforces memory.`);
    }
  };

  // Keyboard navigation for Flashcards
  React.useEffect(() => {
    if (!activeDeck || deckCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRateCard('again');
        else if (e.key === '2') handleRateCard('hard');
        else if (e.key === '3') handleRateCard('good');
        else if (e.key === '4') handleRateCard('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck, currentCardIndex, isFlipped, deckCompleted]);

  // Create Manual Quiz
  const handleCreateManualQuiz = () => {
    const blankQuiz: SelfQuiz = {
      id: `quiz-manual-${Date.now()}`,
      subjectId: subjects[0]?.id || 'sub-dt101',
      title: 'New Custom Quiz',
      description: 'Handcrafted questions to test specific concepts.',
      questions: [
        {
          id: `q-1`,
          type: 'multiple_choice',
          question: 'What is the primary concept you want to test?',
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correctAnswerIndex: 0,
          explanation: 'Clear explanation of why this answer is correct.',
          topic: 'Core Concept',
        },
      ],
      createdAt: new Date().toISOString(),
    };
    openDraftQuizReview(blankQuiz);
  };

  // Create Manual Flashcard Deck
  const handleCreateManualDeck = () => {
    const newDeck = addDeck({
      subjectId: subjects[0]?.id || 'sub-dt101',
      title: `Custom Flashcard Deck (${new Date().toLocaleDateString()})`,
      description: 'Personal study deck created by learner.',
      cards: [
        {
          id: `c-manual-1`,
          front: 'What is the first term or concept?',
          back: 'Definition, formula, or key takeaway here.',
          difficulty: 'unreviewed',
          reviewsCount: 0,
        },
      ],
    });
    startDeck(newDeck);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100">
            Quizzes & Active Recall Hub
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Timed tests, spaced-repetition flashcards, and diagnostic weak topic reviews
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'quizzes' && (
            <button
              onClick={handleCreateManualQuiz}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quiz Manually</span>
            </button>
          )}

          {activeTab === 'decks' && (
            <button
              onClick={handleCreateManualDeck}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Deck</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => {
            setActiveTab('decks');
            setActiveDeck(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'decks'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Flashcard Decks ({decks.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('quizzes');
            setActiveDeck(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'quizzes'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Timed Tests & Quizzes ({quizzes.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('weak_topics');
            setActiveDeck(null);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'weak_topics'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Topics to Review ({weakTopics.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: FLASHCARDS ================= */}
      {activeTab === 'decks' && (
        <>
          {activeDeck ? (
            /* Active Interactive Flashcard Study Player */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveDeck(null)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  ← Exit Study Session
                </button>
                <span className="text-xs font-bold text-rose-500">
                  Card {currentCardIndex + 1} of {activeDeck.cards.length}
                </span>
              </div>

              {!deckCompleted ? (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{
                        width: `${((currentCardIndex + 1) / activeDeck.cards.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* 3D Flip Flashcard */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full min-h-[320px] rounded-3xl p-8 cursor-pointer select-none transition-all flex flex-col justify-between border-2 ${
                      visualTheme === 'anime'
                        ? 'border-rose-200 dark:border-rose-900/60 shadow-xl'
                        : 'border-stone-200 dark:border-stone-800 shadow-md'
                    } ${
                      isFlipped
                        ? 'bg-gradient-to-br from-rose-50 to-amber-50/50 dark:from-stone-900 dark:to-stone-850'
                        : 'bg-white dark:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-400">
                      <span className="uppercase tracking-wider">
                        {isFlipped ? 'Answer / Explanation' : 'Question / Concept'}
                      </span>
                      <span>Click or Space to Flip ⟳</span>
                    </div>

                    <div className="my-auto text-center py-6">
                      <p
                        className={`text-lg sm:text-xl font-bold leading-relaxed whitespace-pre-wrap ${
                          isFlipped
                            ? 'text-stone-900 dark:text-stone-100'
                            : 'text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {isFlipped
                          ? activeDeck.cards[currentCardIndex].back
                          : activeDeck.cards[currentCardIndex].front}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>Deck: {activeDeck.title}</span>
                      {activeDeck.cards[currentCardIndex].topic && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold">
                          {activeDeck.cards[currentCardIndex].topic}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Leitner Rating Controls */}
                  {isFlipped ? (
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      <button
                        onClick={() => handleRateCard('again')}
                        className="py-3 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold text-xs hover:bg-rose-200 transition-colors text-center"
                      >
                        <div>Again (1)</div>
                        <div className="text-[10px] opacity-70">Review soon</div>
                      </button>

                      <button
                        onClick={() => handleRateCard('hard')}
                        className="py-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 font-bold text-xs hover:bg-amber-200 transition-colors text-center"
                      >
                        <div>Hard (2)</div>
                        <div className="text-[10px] opacity-70">Moderate effort</div>
                      </button>

                      <button
                        onClick={() => handleRateCard('good')}
                        className="py-3 rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-200 transition-colors text-center"
                      >
                        <div>Good (3)</div>
                        <div className="text-[10px] opacity-70">Remembered</div>
                      </button>

                      <button
                        onClick={() => handleRateCard('easy')}
                        className="py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition-colors text-center"
                      >
                        <div>Easy (4)</div>
                        <div className="text-[10px] opacity-70">Mastered</div>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setIsFlipped(true)}
                        className="px-6 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold shadow-xs hover:opacity-90"
                      >
                        Show Answer
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Deck Completed State */
                <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-4 shadow-md">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                    Session Complete!
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You reviewed all {activeDeck.cards.length} cards in this deck. Regular spaced recall cements long-term memory.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => startDeck(activeDeck)}
                      className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-bold"
                    >
                      Study Again
                    </button>
                    <button
                      onClick={() => setActiveDeck(null)}
                      className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
                    >
                      Back to Decks
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Flashcard Decks Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map(deck => {
                const subject = subjects.find(s => s.id === deck.subjectId);
                const masteredCount = deck.cards.filter(c => c.difficulty === 'easy').length;
                const masteryPct = deck.cards.length > 0 ? Math.round((masteredCount / deck.cards.length) * 100) : 0;

                return (
                  <div
                    key={deck.id}
                    className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        {subject && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                          >
                            {subject.name}
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-400">
                          {deck.cards.length} Cards
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                        {deck.title}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {deck.description}
                      </p>

                      {/* Mastery Progress Bar */}
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                          <span>Mastery</span>
                          <span>{masteryPct}%</span>
                        </div>
                        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${masteryPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => startDeck(deck)}
                      className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Flashcard Session</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: TIMED TESTS & QUIZZES ================= */}
      {activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map(quiz => {
            const subject = subjects.find(s => s.id === quiz.subjectId);
            const sourceResource = resources.find(r => r.id === quiz.resourceId);

            return (
              <div
                key={quiz.id}
                className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    {subject && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.name}
                      </span>
                    )}

                    {quiz.bestScore !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Best: {quiz.bestScore}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-3 flex items-center space-x-3 text-xs text-stone-400">
                    <span>{quiz.questions.length} Questions</span>
                    <span>•</span>
                    <span>{quiz.attemptsCount || 0} Attempts</span>
                  </div>

                  {sourceResource && (
                    <div className="mt-2 text-[11px] text-stone-400 truncate">
                      Source: {sourceResource.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => startTimedTest(quiz)}
                    className="w-full py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Take Timed Test</span>
                  </button>

                  <button
                    onClick={() => openDraftQuizReview(quiz)}
                    className="w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors"
                  >
                    Edit / Customize Questions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TAB 3: WEAK TOPICS DIAGNOSTIC ================= */}
      {activeTab === 'weak_topics' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-amber-900 dark:text-amber-100">
                Diagnostic Weak Topic Analysis
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300 mt-0.5 leading-relaxed">
                This engine tracks the exact questions and concepts you missed during timed tests and quizzes. Practice targeted flashcards or re-read the source slides to turn weak areas into strengths.
              </p>
            </div>
          </div>

          {weakTopics.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                No Weak Topics Detected!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You have answered questions accurately! Take more timed tests to stress-test your knowledge.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {weakTopics.map((wt, idx) => {
                const relatedRes = resources.find(r => r.id === wt.relatedResourceId);

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                            {wt.missedCount} Missed Questions
                          </span>
                          <span className="text-xs text-stone-400 font-semibold">
                            Subject: {wt.subjectName}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 mt-1">
                          {wt.topic}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        {relatedRes && (
                          <button
                            onClick={() => openStudyView(relatedRes)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold"
                          >
                            Study Source Presentation
                          </button>
                        )}

                        <button
                          onClick={() =>
                            createFlashcardsFromMissedQuestions(
                              wt.sampleQuestions,
                              `Review: ${wt.topic}`
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-2xs"
                        >
                          Practice Topic Flashcards
                        </button>
                      </div>
                    </div>

                    {/* Sample Missed Questions */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                        Concepts to Master:
                      </span>
                      {wt.sampleQuestions.map((sq, sqIdx) => (
                        <div
                          key={sqIdx}
                          className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 text-xs space-y-1"
                        >
                          <p className="font-bold text-stone-800 dark:text-stone-200">
                            • {sq.question}
                          </p>
                          <p className="text-stone-500 pl-3">
                            <strong className="text-emerald-600">Correct:</strong>{' '}
                            {sq.options[sq.correctAnswerIndex]}
                          </p>
                          {sq.explanation && (
                            <p className="text-stone-400 pl-3 text-[11px]">
                              💡 {sq.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
