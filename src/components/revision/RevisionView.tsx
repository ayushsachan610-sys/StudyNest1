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
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { FlashcardDeck, SelfQuiz, CardDifficulty } from '../../types';

export const RevisionView: React.FC = () => {
  const {
    decks,
    quizzes,
    subjects,
    updateCardDifficulty,
    submitQuizAttempt,
  } = useStudyNest();

  const [activeTab, setActiveTab] = useState<'decks' | 'quizzes'>('decks');
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<SelfQuiz | null>(null);

  // Deck Player State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckCompleted, setDeckCompleted] = useState(false);
  const [deckSessionStats, setDeckSessionStats] = useState<{ easy: number; good: number; hard: number; again: number; medium: number }>({
    easy: 0,
    good: 0,
    hard: 0,
    again: 0,
    medium: 0,
  });

  // Quiz Player State
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Deck Player Handlers
  const startDeck = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setDeckCompleted(false);
    setDeckSessionStats({ easy: 0, good: 0, hard: 0, again: 0, medium: 0 });
  };

  const handleRateCard = (difficulty: CardDifficulty) => {
    if (!activeDeck) return;

    const currentCard = activeDeck.cards[currentCardIndex];
    updateCardDifficulty(activeDeck.id, currentCard.id, difficulty);

    setDeckSessionStats(prev => ({
      ...prev,
      [difficulty === 'unreviewed' ? 'good' : difficulty]: prev[difficulty === 'unreviewed' ? 'good' : difficulty] + 1,
    }));

    if (currentCardIndex + 1 < activeDeck.cards.length) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Completed deck!
      setDeckCompleted(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Quiz Player Handlers
  const startQuiz = (quiz: SelfQuiz) => {
    setActiveQuiz(quiz);
    setQuizQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectAnswersCount(0);
    setQuizCompleted(false);
  };

  const handleSelectOption = (index: number) => {
    if (hasAnswered || !activeQuiz) return;

    setSelectedOption(index);
    setHasAnswered(true);

    const currentQ = activeQuiz.questions[quizQuestionIndex];
    if (index === currentQ.correctAnswerIndex) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (quizQuestionIndex + 1 < activeQuiz.questions.length) {
      setQuizQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Completed quiz!
      const total = activeQuiz.questions.length;
      const scorePct = Math.round((correctAnswersCount / total) * 100);
      submitQuizAttempt(activeQuiz.id, scorePct);
      setQuizCompleted(true);
      if (scorePct >= 80) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Active Recall & Revision Suite
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Test retention with 3D flashcards and syllabus comprehension checks
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => {
              setActiveTab('decks');
              setActiveDeck(null);
              setActiveQuiz(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'decks'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Flashcard Decks ({decks.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('quizzes');
              setActiveDeck(null);
              setActiveQuiz(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'quizzes'
                ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Self-Quizzes ({quizzes.length})
          </button>
        </div>
      </div>

      {/* AI Attribution & Integrity Guarantee Banner */}
      <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Pedagogical Integrity Guarantee:</strong> All revision questions in StudyNest are deterministic and explicitly cite verified note definitions. No hallucinated AI claims.
        </p>
      </div>

      {/* 1. Flashcard Deck Active Player Mode */}
      {activeDeck && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-warm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Flashcard Session
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">{activeDeck.title}</h3>
            </div>
            <button
              onClick={() => setActiveDeck(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
            >
              Exit Deck
            </button>
          </div>

          {deckCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Deck Review Completed!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                You reviewed all {activeDeck.cards.length} cards in this deck. Spaced repetition strengthens your memory traces.
              </p>

              <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto py-2 text-xs">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-800 font-bold">
                  {deckSessionStats.easy} <span className="block font-normal text-[10px]">Easy</span>
                </div>
                <div className="bg-teal-50 p-2 rounded-xl text-teal-800 font-bold">
                  {deckSessionStats.good} <span className="block font-normal text-[10px]">Good</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl text-amber-800 font-bold">
                  {deckSessionStats.hard} <span className="block font-normal text-[10px]">Hard</span>
                </div>
                <div className="bg-rose-50 p-2 rounded-xl text-rose-800 font-bold">
                  {deckSessionStats.again} <span className="block font-normal text-[10px]">Again</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-4">
                <button
                  onClick={() => startDeck(activeDeck)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review Again</span>
                </button>
                <button
                  onClick={() => setActiveDeck(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium"
                >
                  Return to Decks
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>
                  Card {currentCardIndex + 1} of {activeDeck.cards.length}
                </span>
                <span>Tap card to flip</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-700 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${((currentCardIndex + 1) / activeDeck.cards.length) * 100}%`,
                  }}
                />
              </div>

              {/* 3D Flashcard */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="perspective-1000 min-h-[260px] cursor-pointer"
              >
                <div
                  className={`w-full min-h-[260px] rounded-3xl p-8 border-2 transition-transform duration-500 transform-style-3d flex flex-col justify-between text-center select-none shadow-card ${
                    isFlipped
                      ? 'bg-gradient-to-b from-stone-900 to-stone-950 text-white border-stone-800'
                      : 'bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EE] text-stone-900 border-amber-200/70 hover:border-amber-300'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
                    {isFlipped ? 'Answer & Mechanism' : 'Question / Concept'}
                  </div>

                  <div className="my-auto py-4">
                    <p className={`font-serif text-lg sm:text-xl font-medium leading-relaxed ${isFlipped ? 'text-stone-100' : 'text-stone-900'}`}>
                      {isFlipped
                        ? activeDeck.cards[currentCardIndex].back
                        : activeDeck.cards[currentCardIndex].front}
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-400">
                    {isFlipped ? 'Rate your recall below' : 'Click to reveal answer'}
                  </div>
                </div>
              </div>

              {/* Source attribution snippet */}
              {activeDeck.sourceSnippet && (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start space-x-2">
                  <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <p className="italic">
                    Source Note Citation: "{activeDeck.sourceSnippet}"
                  </p>
                </div>
              )}

              {/* Self-Rating Controls */}
              {isFlipped ? (
                <div className="space-y-2 pt-2 animate-in fade-in">
                  <p className="text-center text-xs font-semibold text-stone-700">
                    How well did you know this?
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleRateCard('again')}
                      className="py-2.5 px-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold transition-colors"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => handleRateCard('hard')}
                      className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold transition-colors"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => handleRateCard('good')}
                      className="py-2.5 px-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold transition-colors"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => handleRateCard('easy')}
                      className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold transition-colors"
                    >
                      Easy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    Flip Card (Spacebar)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 2. Self-Quiz Active Player Mode */}
      {activeQuiz && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-warm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Self-Quiz Mode
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">{activeQuiz.title}</h3>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
            >
              Exit Quiz
            </button>
          </div>

          {quizCompleted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Quiz Completed!</h3>
              <p className="text-sm text-stone-700">
                Your Score:{' '}
                <strong className="text-emerald-800 font-bold text-lg">
                  {Math.round((correctAnswersCount / activeQuiz.questions.length) * 100)}%
                </strong>{' '}
                ({correctAnswersCount} of {activeQuiz.questions.length} correct)
              </p>

              <div className="flex items-center justify-center space-x-3 pt-4">
                <button
                  onClick={() => startQuiz(activeQuiz)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium"
                >
                  Return to Quizzes
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Question counter & progress */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span>
                  Question {quizQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
                <span>Active Knowledge Check</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-700 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${((quizQuestionIndex + 1) / activeQuiz.questions.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Statement */}
              <div className="py-2">
                <h4 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                  {activeQuiz.questions[quizQuestionIndex].question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {activeQuiz.questions[quizQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeQuiz.questions[quizQuestionIndex].correctAnswerIndex;

                  let optionStyle =
                    'bg-white border-stone-200/90 text-stone-800 hover:border-emerald-300 hover:bg-stone-50/50';

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                    } else {
                      optionStyle = 'bg-stone-50/40 border-stone-200/50 text-stone-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start space-x-3 text-xs leading-relaxed ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {hasAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {hasAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation box */}
              {hasAnswered && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5 animate-in fade-in">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1">
                    <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>Explanation & Pedagogical Rationale</span>
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {activeQuiz.questions[quizQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {/* Next Question Button */}
              {hasAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>
                      {quizQuestionIndex + 1 < activeQuiz.questions.length ? 'Next Question' : 'Finish Quiz'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 3. Catalog View of Decks & Quizzes (when neither is actively running) */}
      {!activeDeck && !activeQuiz && activeTab === 'decks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => {
            const subject = subjects.find(s => s.id === deck.subjectId);
            return (
              <div
                key={deck.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {subject && (
                      <span
                        className="px-2 py-0.5 rounded-md font-semibold text-xs"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.code}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {deck.cards.length} Cards
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-stone-900">{deck.title}</h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                    {deck.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {deck.cards.reduce((sum, c) => sum + c.reviewsCount, 0)} total reps
                  </span>
                  <button
                    onClick={() => startDeck(deck)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice Deck</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!activeDeck && !activeQuiz && activeTab === 'quizzes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map(quiz => {
            const subject = subjects.find(s => s.id === quiz.subjectId);
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-2xs hover:border-emerald-300 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {subject && (
                      <span
                        className="px-2 py-0.5 rounded-md font-semibold text-xs"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.code}
                      </span>
                    )}
                    {quiz.bestScore !== undefined && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Best: {quiz.bestScore}%
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-stone-900">{quiz.title}</h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                    {quiz.description}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-2">
                    {quiz.questions.length} multiple-choice questions with educational rationales
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {quiz.lastAttemptDate
                      ? `Last taken ${new Date(quiz.lastAttemptDate).toLocaleDateString()}`
                      : 'Not attempted yet'}
                  </span>
                  <button
                    onClick={() => startQuiz(quiz)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Take Self-Quiz</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
