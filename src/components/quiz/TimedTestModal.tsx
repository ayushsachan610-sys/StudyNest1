import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Award,
  Filter,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { SelfQuiz, QuizQuestion, UserAnswerRecord } from '../../types';

export const TimedTestModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    activeTimedTestQuiz,
    recordTestAttempt,
    createFlashcardsFromMissedQuestions,
    defaultQuizTimerMinutes,
    reducedMotion,
    triggerMascotReaction,
    setActiveTab,
  } = useStudyNest();

  // Test Phase: 'setup' | 'testing' | 'results'
  const [phase, setPhase] = useState<'setup' | 'testing' | 'results'>('setup');

  // Test Configuration
  const [durationMinutes, setDurationMinutes] = useState(defaultQuizTimerMinutes || 10);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);

  // Active Test State
  const [testQuestions, setTestQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(600);
  const [showEarlySubmitConfirm, setShowEarlySubmitConfirm] = useState(false);
  const [autoSubmittedDueToTime, setAutoSubmittedDueToTime] = useState(false);

  // Results State
  const [scorePercentage, setScorePercentage] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [filterMode, setFilterMode] = useState<'all' | 'missed' | 'flagged'>('all');
  const [flashcardsCreatedToast, setFlashcardsCreatedToast] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Setup when quiz opens
  useEffect(() => {
    if (activeTimedTestQuiz) {
      setPhase('setup');
      setDurationMinutes(defaultQuizTimerMinutes || 10);
      setTestQuestions(activeTimedTestQuiz.questions ? [...activeTimedTestQuiz.questions] : []);
      setUserAnswers({});
      setFlaggedQuestions({});
      setCurrentQIndex(0);
      setAutoSubmittedDueToTime(false);
      setFlashcardsCreatedToast(false);
    }
  }, [activeTimedTestQuiz, defaultQuizTimerMinutes]);

  // Countdown Timer
  useEffect(() => {
    if (phase !== 'testing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Keyboard navigation during test
  useEffect(() => {
    if (phase !== 'testing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentQ = testQuestions[currentQIndex];
      if (!currentQ) return;

      // Number keys 1-4 to select option
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (e.key === 'ArrowRight' && currentQIndex < testQuestions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQIndex > 0) {
        setCurrentQIndex(prev => prev - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFlagCurrentQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentQIndex, testQuestions]);

  if (activeModal !== 'timed_test' || !activeTimedTestQuiz) return null;

  const startTest = () => {
    let qs = [...activeTimedTestQuiz.questions];
    if (shuffleQuestions) {
      qs = qs.sort(() => Math.random() - 0.5);
    }
    setTestQuestions(qs);
    const totalSecs = Math.max(1, durationMinutes) * 60;
    setTotalDurationSeconds(totalSecs);
    setSecondsRemaining(totalSecs);
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentQIndex(0);
    setPhase('testing');
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleFlagCurrentQuestion = () => {
    const q = testQuestions[currentQIndex];
    if (!q) return;
    setFlaggedQuestions(prev => ({
      ...prev,
      [q.id]: !prev[q.id],
    }));
  };

  const handleTimeExpire = () => {
    setAutoSubmittedDueToTime(true);
    finishAndEvaluateTest();
  };

  const finishAndEvaluateTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const spent = totalDurationSeconds - secondsRemaining;
    setTimeSpentSeconds(spent);

    let correct = 0;
    const answerRecords: UserAnswerRecord[] = [];
    const missedIds: string[] = [];

    testQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      const isCorrect = selected !== undefined && selected === q.correctAnswerIndex;
      if (isCorrect) correct += 1;
      else missedIds.push(q.id);

      answerRecords.push({
        questionId: q.id,
        selectedIndex: selected !== undefined ? selected : -1,
        isCorrect,
        flagged: !!flaggedQuestions[q.id],
      });
    });

    const scorePct = Math.round((correct / testQuestions.length) * 100);
    setScorePercentage(scorePct);
    setCorrectCount(correct);

    // Record in global context
    recordTestAttempt({
      quizId: activeTimedTestQuiz.id,
      quizTitle: activeTimedTestQuiz.title,
      subjectId: activeTimedTestQuiz.subjectId,
      durationSeconds: totalDurationSeconds,
      timeSpentSeconds: spent,
      totalQuestions: testQuestions.length,
      correctCount: correct,
      scorePercentage: scorePct,
      userAnswers: answerRecords,
      missedQuestionIds: missedIds,
    });

    if (scorePct >= 80 && !reducedMotion) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }

    setPhase('results');
    setShowEarlySubmitConfirm(false);
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateFlashcardsFromMissed = () => {
    const missed = testQuestions.filter(q => userAnswers[q.id] !== q.correctAnswerIndex);
    if (missed.length === 0) return;

    createFlashcardsFromMissedQuestions(missed, `Review: Missed in ${activeTimedTestQuiz.title}`);
    setFlashcardsCreatedToast(true);
    setTimeout(() => setFlashcardsCreatedToast(false), 4000);
  };

  const currentQ = testQuestions[currentQIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = testQuestions.length - answeredCount;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* ================= PHASE 1: SETUP ================= */}
        {phase === 'setup' && (
          <div className="p-8 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900 dark:text-stone-100">
                    Timed Test Configuration
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {activeTimedTestQuiz.title} • {testQuestions.length} Questions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-w-xl mx-auto w-full py-4">
              {/* Duration Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Test Duration (Minutes)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[3, 5, 10, 15].map(min => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDurationMinutes(min)}
                      className={`py-3 rounded-2xl text-sm font-bold border transition-all ${
                        durationMinutes === min
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {min} Mins
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-stone-500">Custom Duration:</span>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-center"
                  />
                  <span className="text-xs text-stone-500">minutes</span>
                </div>
              </div>

              {/* Options */}
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={e => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded-md text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      Shuffle Question Order
                    </span>
                    <p className="text-xs text-stone-500">Randomizes the sequence of questions</p>
                  </div>
                </label>
              </div>

              {/* Instructions Callout */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <p className="font-bold">⏰ Timed Exam Rules:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-stone-600 dark:text-stone-300">
                  <li>The test will submit automatically when time runs out.</li>
                  <li>You can flag questions to revisit before submitting early.</li>
                  <li>You can use keyboard shortcuts 1–4 to pick choices and ← → to navigate.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-stone-200 dark:border-stone-800 pt-4">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startTest}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold shadow-md transition-colors"
              >
                <span>Start Timed Test</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= PHASE 2: ACTIVE TEST ================= */}
        {phase === 'testing' && currentQ && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sticky Header with Live Countdown Timer */}
            <header className="px-6 py-3 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Q {currentQIndex + 1} of {testQuestions.length}
                </span>
                <span className="text-stone-300 dark:text-stone-700">|</span>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 truncate">
                  {activeTimedTestQuiz.title}
                </span>
              </div>

              {/* Countdown Timer Display */}
              <div
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-2xl font-mono text-sm font-black border transition-colors ${
                  secondsRemaining < 30
                    ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-400 text-rose-700 dark:text-rose-300 animate-pulse'
                    : secondsRemaining < 120
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>

              {/* Flag & Submit Early Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFlagCurrentQuestion}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    flaggedQuestions[currentQ.id]
                      ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800 dark:text-amber-200'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                  }`}
                  title="Flag question for review"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {flaggedQuestions[currentQ.id] ? 'Flagged' : 'Flag'}
                  </span>
                </button>

                <button
                  onClick={() => setShowEarlySubmitConfirm(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Submit Early
                </button>
              </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-1">
              <div
                className="bg-rose-500 h-1 transition-all duration-300"
                style={{ width: `${(answeredCount / testQuestions.length) * 100}%` }}
              />
            </div>

            {/* Question Arena */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between">
              <div className="max-w-3xl mx-auto w-full space-y-6">
                {/* Topic / Source Pill */}
                {currentQ.topic && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-[11px] font-bold tracking-wider uppercase">
                    {currentQ.topic}
                  </span>
                )}

                {/* Question Prompt */}
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  {currentQ.question}
                </h1>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center space-x-3.5 ${
                          isSelected
                            ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-500 text-stone-900 dark:text-stone-100 shadow-xs'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-300 dark:hover:border-stone-700'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-sm font-medium leading-relaxed flex-1">
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav: Prev / Next + Question Palette Grid */}
              <div className="max-w-3xl mx-auto w-full mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQIndex === 0}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() => setCurrentQIndex(prev => Math.min(testQuestions.length - 1, prev + 1))}
                    disabled={currentQIndex === testQuestions.length - 1}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Question Palette (Jump Grid) */}
                <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full py-1">
                  {testQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = currentQIndex === idx;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQIndex(idx)}
                        className={`relative w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-stone-900'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-rose-500 text-white shadow-2xs'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}
                        title={`Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}${isFlagged ? ' (Flagged)' : ''}`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-stone-900" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Early Submit Confirmation Modal */}
            {showEarlySubmitConfirm && (
              <div className="absolute inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
                  <div className="flex items-center space-x-3 text-rose-500">
                    <AlertTriangle className="w-6 h-6" />
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      Submit Test Early?
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300">
                    <p>Here is your test completion summary:</p>
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 space-y-1">
                      <div className="flex justify-between">
                        <span>Answered:</span>
                        <span className="font-bold text-emerald-600">{answeredCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unanswered:</span>
                        <span className="font-bold text-rose-600">{unansweredCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Flagged for review:</span>
                        <span className="font-bold text-amber-600">{flaggedCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setShowEarlySubmitConfirm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Keep Working
                    </button>
                    <button
                      onClick={finishAndEvaluateTest}
                      className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs"
                    >
                      Confirm Submission
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PHASE 3: RESULTS & REVIEW ================= */}
        {phase === 'results' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Timed Test Results & Explanation Breakdown
                </h2>
                <p className="text-xs text-stone-500">
                  {autoSubmittedDueToTime && '⏰ Time expired: Auto-submitted • '}
                  {activeTimedTestQuiz.title}
                </p>
              </div>

              <button
                onClick={() => setActiveModal('none')}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Flashcards Created Notification */}
            {flashcardsCreatedToast && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Review flashcards generated and added to your deck collection!</span>
              </div>
            )}

            {/* Results Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Score Card Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs uppercase tracking-wider font-extrabold text-rose-200">
                    Your Performance
                  </span>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-black">{scorePercentage}%</span>
                    <span className="text-sm font-medium text-rose-100">
                      ({correctCount} / {testQuestions.length} Correct)
                    </span>
                  </div>
                  <p className="text-xs text-rose-100 mt-2">
                    Time spent: {formatTimer(timeSpentSeconds)} of {formatTimer(totalDurationSeconds)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={startTest}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Test</span>
                  </button>

                  {correctCount < testQuestions.length && (
                    <button
                      onClick={handleCreateFlashcardsFromMissed}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold shadow-md transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Make Flashcards from Missed</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Detailed Question Review
                </span>

                <div className="flex items-center space-x-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filterMode === 'all'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    All ({testQuestions.length})
                  </button>
                  <button
                    onClick={() => setFilterMode('missed')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filterMode === 'missed'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Missed ({testQuestions.length - correctCount})
                  </button>
                  <button
                    onClick={() => setFilterMode('flagged')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      filterMode === 'flagged'
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                        : 'text-stone-500'
                    }`}
                  >
                    Flagged ({flaggedCount})
                  </button>
                </div>
              </div>

              {/* Question Breakdown List */}
              <div className="space-y-4">
                {testQuestions
                  .filter(q => {
                    const isCorrect = userAnswers[q.id] === q.correctAnswerIndex;
                    if (filterMode === 'missed') return !isCorrect;
                    if (filterMode === 'flagged') return !!flaggedQuestions[q.id];
                    return true;
                  })
                  .map((q, idx) => {
                    const selectedIdx = userAnswers[q.id];
                    const isCorrect = selectedIdx === q.correctAnswerIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border-2 space-y-3 ${
                          isCorrect
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50'
                            : 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCorrect
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {isCorrect ? '✓' : '✗'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                              Question {idx + 1} {q.topic ? `• ${q.topic}` : ''}
                            </span>
                            {q.sourceSlideNumber !== undefined && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                                📌 Slide {q.sourceSlideNumber}
                              </span>
                            )}
                          </div>

                          {flaggedQuestions[q.id] && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              <Flag className="w-3 h-3" />
                              <span>Flagged</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {q.question}
                        </h3>

                        {/* Options Breakdown */}
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedIdx === optIdx;
                            const isAnswer = q.correctAnswerIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                  isAnswer
                                    ? 'bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-400 font-bold text-emerald-900 dark:text-emerald-100'
                                    : isSelected && !isCorrect
                                    ? 'bg-rose-100/70 dark:bg-rose-950/40 border-rose-400 font-bold text-rose-900 dark:text-rose-100'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                <span>
                                  {String.fromCharCode(65 + optIdx)}. {opt}
                                </span>
                                {isAnswer && (
                                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">
                                    ✓ Correct Answer
                                  </span>
                                )}
                                {isSelected && !isCorrect && (
                                  <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400">
                                    ✗ Your Choice
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 text-xs text-stone-700 dark:text-stone-300 flex items-start space-x-2">
                            <HelpCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                            <p>
                              <strong className="text-stone-900 dark:text-stone-100">Explanation:</strong>{' '}
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer */}
            <footer className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveModal('none');
                  setActiveTab('review');
                }}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600"
              >
                Go to Flashcards & Weak Topics Hub →
              </button>

              <button
                onClick={() => setActiveModal('none')}
                className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold"
              >
                Done
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};
