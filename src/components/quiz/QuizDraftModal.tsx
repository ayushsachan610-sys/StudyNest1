import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Save,
  Check,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { SelfQuiz, QuizQuestion, QuestionType } from '../../types';

export const QuizDraftModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    activeDraftQuiz,
    saveDraftQuiz,
    subjects,
  } = useStudyNest();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (activeDraftQuiz) {
      setTitle(activeDraftQuiz.title);
      setDescription(activeDraftQuiz.description);
      setSubjectId(activeDraftQuiz.subjectId);
      setQuestions(activeDraftQuiz.questions ? [...activeDraftQuiz.questions] : []);
      setValidationError(null);
    }
  }, [activeDraftQuiz]);

  if (activeModal !== 'quiz_draft' || !activeDraftQuiz) return null;

  const handleUpdateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      const opts = [...q.options];
      opts[optIndex] = value;
      q.options = opts;
      copy[qIndex] = q;
      return copy;
    });
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], correctAnswerIndex: optIndex };
      return copy;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuestions(prev => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      q.options = [...q.options, `New Option ${q.options.length + 1}`];
      copy[qIndex] = q;
      return copy;
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuestions(prev => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      if (q.options.length <= 2) return copy; // Keep at least 2 options
      q.options = q.options.filter((_, idx) => idx !== optIndex);
      if (q.correctAnswerIndex >= q.options.length) {
        q.correctAnswerIndex = 0;
      }
      copy[qIndex] = q;
      return copy;
    });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== qIndex));
  };

  const handleAddNewQuestion = (type: QuestionType = 'multiple_choice') => {
    const newQ: QuizQuestion = {
      id: `q-manual-${Date.now()}-${questions.length + 1}`,
      type,
      question: type === 'multiple_choice' ? 'Enter question prompt here...' : 'True or False: Statement here...',
      options: type === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : ['True', 'False'],
      correctAnswerIndex: 0,
      explanation: 'Explanation for why this answer is correct.',
      topic: 'General Review',
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const handleSave = () => {
    if (!title.trim()) {
      setValidationError('Please enter a quiz title.');
      return;
    }
    if (questions.length === 0) {
      setValidationError('Please include at least one question in your quiz.');
      return;
    }

    // Check if any question has empty prompt
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        setValidationError(`Question ${i + 1} has an empty prompt.`);
        return;
      }
    }

    const updatedQuiz: SelfQuiz = {
      ...activeDraftQuiz,
      title: title.trim(),
      description: description.trim(),
      subjectId,
      questions,
    };

    saveDraftQuiz(updatedQuiz);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Review & Customize Draft Questions</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                  {questions.length} Questions
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Edit question wording, adjust choices, and set correct answers before saving to your quiz bank.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save to Quiz Bank</span>
            </button>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Validation Error Alert */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Body / Questions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata: Title & Subject */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Design Thinking Quiz"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-5">
            {questions.map((q, qIdx) => (
              <div
                key={q.id || qIdx}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center">
                      {qIdx + 1}
                    </span>
                    <select
                      value={q.type}
                      onChange={e => handleUpdateQuestion(qIdx, { type: e.target.value as QuestionType })}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True / False</option>
                    </select>

                    <input
                      type="text"
                      value={q.topic || ''}
                      onChange={e => handleUpdateQuestion(qIdx, { topic: e.target.value })}
                      placeholder="Topic (e.g. SLA Countdown)"
                      className="px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-stone-800 text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 max-w-[200px]"
                    />

                    {q.sourceSlideNumber !== undefined ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-[11px] border border-rose-200 dark:border-rose-900 shrink-0">
                        📌 Slide {q.sourceSlideNumber}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 font-medium text-[11px] shrink-0">
                        📄 Custom / Manual
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(qIdx)}
                    className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Question Prompt
                  </label>
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={e => handleUpdateQuestion(qIdx, { question: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 font-medium focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Answer Options (Click checkmark to select correct answer)
                  </label>

                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div key={optIdx} className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSetCorrectOption(qIdx, optIdx)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                            isCorrect
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                          }`}
                          title={isCorrect ? 'Correct answer' : 'Mark as correct answer'}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          value={opt}
                          onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                          className={`flex-1 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-stone-900 dark:text-stone-100 font-semibold'
                              : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                          }`}
                        />

                        {q.type === 'multiple_choice' && q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(qIdx, optIdx)}
                            className="p-1.5 text-stone-300 hover:text-stone-500 transition-colors"
                            title="Remove choice"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {q.type === 'multiple_choice' && q.options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => handleAddOption(qIdx)}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center space-x-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                    Explanation (Shown after submission)
                  </label>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={e => handleUpdateQuestion(qIdx, { explanation: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300"
                    placeholder="Why this answer is correct..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleAddNewQuestion('multiple_choice')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Add Multiple Choice Question</span>
            </button>

            <button
              onClick={() => handleAddNewQuestion('true_false')}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 text-purple-500" />
              <span>Add True / False Question</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {questions.length} questions ready to save
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveModal('none')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Discard Draft
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Quiz</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
