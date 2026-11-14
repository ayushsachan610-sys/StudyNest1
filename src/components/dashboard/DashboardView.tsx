import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Plus,
  Timer,
  Layers,
  Award,
  BarChart3,
  Upload,
  Play,
  RotateCcw,
  Target,
  FileText,
  Flame,
  Film,
  FolderTree,
  Laptop,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';
import { ACADEMIC_TERMS, AcademicTermId } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    profile,
    subjects,
    folders,
    resources,
    videos,
    recentResources,
    activities,
    testAttempts,
    quizzes,
    decks,
    averageQuizScore,
    weeklyStudyHours,
    totalCardsReviewed,
    openStudyView,
    startTimedTest,
    setActiveVideo,
    setIsAddVideoModalOpen,
    setSelectedSubjectId,
    setActiveTab,
    setActiveModal,
    selectedTermId,
    setSelectedTermId,
    visualTheme,
    mascotEnabled,
  } = useStudyNest();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const openSubject = (id: string) => {
    setSelectedSubjectId(id);
    setActiveTab('subjects');
  };

  const primaryPresentation = resources.find(r => r.type === 'pptx' || r.type === 'ppt');

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Welcome Hero Banner */}
      <section
        className={`rounded-3xl p-6 sm:p-8 border relative overflow-hidden transition-all ${
          visualTheme === 'anime'
            ? 'bg-gradient-to-r from-rose-100/70 via-amber-50 to-pink-100/70 dark:from-rose-950/40 dark:via-stone-900 dark:to-pink-950/40 border-rose-200 dark:border-rose-900/60 shadow-lg'
            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs'
        }`}
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Personal LMS • Single Learner Workspace</span>
            {visualTheme === 'anime' && (
              <span className="ml-1 px-1.5 py-0.2 rounded-md bg-rose-500 text-white text-[9px] font-black uppercase">
                Anime Edition
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
            {getGreeting()}, {profile.name}!
          </h1>

          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2 leading-relaxed">
            Welcome back to your personal study nest. You have{' '}
            <strong className="text-stone-900 dark:text-stone-100 font-bold">
              {subjects.length} active subjects
            </strong>{' '}
            and{' '}
            <strong className="text-stone-900 dark:text-stone-100 font-bold">
              {resources.length} study resources
            </strong>{' '}
            ready for review.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {primaryPresentation && (
              <button
                onClick={() => openStudyView(primaryPresentation)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all transform active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Study Primary Presentation</span>
              </button>
            )}

            {quizzes.length > 0 && (
              <button
                onClick={() => startTimedTest(quizzes[0])}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs shadow-2xs transition-colors"
              >
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Take Timed Test</span>
              </button>
            )}

            <button
              onClick={() => setActiveModal('upload')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs shadow-2xs transition-colors"
            >
              <Upload className="w-4 h-4 text-stone-500" />
              <span>Upload File</span>
            </button>

            <button
              onClick={() => setIsAddVideoModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs shadow-2xs transition-colors"
            >
              <Play className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Add YouTube Video</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-xs shadow-2xs transition-colors"
            >
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Review Weak Topics</span>
            </button>
          </div>
        </div>

        {/* Mascot / Theme Accents in background */}
        {visualTheme === 'anime' && (
          <div className="absolute right-4 bottom-2 opacity-20 pointer-events-none hidden md:block">
            <span className="text-8xl select-none">🦊</span>
          </div>
        )}
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Subjects
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {subjects.length}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Study Files
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {resources.length}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Avg Quiz Score
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {averageQuizScore > 0 ? `${averageQuizScore}%` : '88%'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Study Hours
            </span>
            <div className="text-xl font-black text-stone-900 dark:text-stone-100">
              {weeklyStudyHours.toFixed(1)} / {profile.weeklyTargetHours}h
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Academic Terms & Laptop Folders */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <FolderTree className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                Academic Terms & Folders
              </h2>
              <p className="text-xs text-stone-500">
                Organized into six terms with laptop-style nested folders & subfolders
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('resources')}
            className="flex items-center space-x-1 text-xs font-bold text-rose-500 hover:text-rose-600"
          >
            <span>Open File Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {ACADEMIC_TERMS.map(term => {
            const isCurrentTerm = term.id === selectedTermId;
            const termFiles = resources.filter(r => r.termId === term.id);
            const termFolders = folders.filter(f => f.termId === term.id);

            return (
              <button
                key={term.id}
                onClick={() => {
                  setSelectedTermId(term.id);
                  setActiveTab('resources');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all group ${
                  isCurrentTerm
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/40 hover:border-emerald-300 dark:hover:border-emerald-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {term.name}
                  </span>
                  {isCurrentTerm && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-0.5">
                  <p>{termFolders.length} folders</p>
                  <p>{termFiles.length} files</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Subjects Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
              My Subjects
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold">
              {subjects.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveModal('new_subject')}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
            >
              + New Subject
            </button>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <button
              onClick={() => setActiveTab('subjects')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              View All Subjects →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map(subject => {
            const subjectResources = resources.filter(r => r.subjectId === subject.id);
            const progressPct = Math.min(
              100,
              Math.round((subject.completedHoursThisWeek / (subject.targetHoursPerWeek || 1)) * 100)
            );

            return (
              <div
                key={subject.id}
                onClick={() => openSubject(subject.id)}
                className={`p-5 rounded-3xl bg-white dark:bg-stone-900 border transition-all cursor-pointer flex flex-col justify-between space-y-4 group ${
                  visualTheme === 'anime'
                    ? 'border-stone-200 dark:border-stone-800 hover:border-rose-400 hover:shadow-md'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider"
                      style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                    >
                      {subject.code}
                    </span>
                    <span className="text-xs font-semibold text-stone-400">
                      {subjectResources.length} files
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 group-hover:text-rose-500 transition-colors line-clamp-1">
                    {subject.name}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                    <span>Weekly Progress</span>
                    <span>
                      {subject.completedHoursThisWeek.toFixed(1)} / {subject.targetHoursPerWeek}h
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${progressPct}%`, backgroundColor: subject.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Uploaded Files & Recent Study Activity (Split Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploaded Files Table / Cards */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
                Study Files & Video Lectures
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddVideoModalOpen(true)}
                className="text-xs font-bold text-red-500 hover:text-red-600"
              >
                + Video
              </button>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <button
                onClick={() => setActiveTab('resources')}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                Library ({resources.length + videos.length}) →
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {recentResources.slice(0, 3).map(res => {
              const sub = subjects.find(s => s.id === res.subjectId);
              const isPpt = res.type === 'pptx' || res.type === 'ppt';

              return (
                <div
                  key={res.id}
                  className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`p-2 rounded-xl text-xs font-black uppercase shrink-0 ${
                        isPpt
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {res.type}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {res.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
                        {sub && <span>{sub.code}</span>}
                        <span>•</span>
                        <span>{res.slides ? `${res.slides.length} slides` : formatBytes(res.size)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openStudyView(res)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 hover:border-rose-300 transition-colors shrink-0"
                  >
                    Study
                  </button>
                </div>
              );
            })}

            {/* Video Preview in Dashboard */}
            {videos.slice(0, 2).map(video => {
              const sub = subjects.find(s => s.id === video.subjectId);

              return (
                <div
                  key={video.id}
                  className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0">
                      <Film className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {video.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
                        {sub && <span>{sub.code}</span>}
                        <span>•</span>
                        <span>YouTube Embed</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveVideo(video)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 flex items-center space-x-1"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Study Activity Timeline & Quiz Scores */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
                Recent Study Activity & Scores
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('review')}
              className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              Quiz History →
            </button>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 4).map(act => {
              const sub = subjects.find(s => s.id === act.subjectId);
              const isTest = act.type === 'timed_test' || act.type === 'quiz_taken';

              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-stone-800 dark:text-stone-200 leading-snug">
                        {act.description}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
                        {sub && <span>{sub.name}</span>}
                        <span>•</span>
                        <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                        {act.minutesSpent && (
                          <>
                            <span>•</span>
                            <span>{act.minutesSpent} mins</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {act.scorePercentage !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-black text-xs shrink-0">
                      {act.scorePercentage}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
