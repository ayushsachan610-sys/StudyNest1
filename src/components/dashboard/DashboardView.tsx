import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Plus,
  Timer,
  AlertCircle,
  FileText,
  FileCheck2,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';

export const DashboardView: React.FC = () => {
  const {
    profile,
    subjects,
    todayTasks,
    upcomingDeadlines,
    recentResources,
    toggleTaskComplete,
    setActiveTab,
    setSelectedSubjectId,
    setActiveModal,
    setPreviewResource,
    totalCardsReviewed,
    weeklyStudyHours,
    completedTasksCount,
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

  const pendingTodayTasks = todayTasks.filter(t => !t.completed);
  const completedTodayTasks = todayTasks.filter(t => t.completed);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Welcome & Primary Action Hero */}
      <section className="bg-gradient-to-r from-[#F4EDE2] via-[#FBF8F3] to-[#EAE3D2] rounded-3xl p-6 sm:p-8 border border-[#E2D8C6] shadow-warm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Product Promise: Keep your study materials organized and make your next study step clear.</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 leading-tight">
            {getGreeting()}, {profile.name}.
          </h1>
          <p className="text-stone-600 text-sm sm:text-base mt-2 leading-relaxed">
            You have <strong className="font-semibold text-stone-900">{pendingTodayTasks.length} pending tasks</strong> in today’s plan across your active subjects. Take a breath and let’s tackle the next priority.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => setActiveModal('focus_timer')}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-medium text-xs shadow-sm transition-all transform active:scale-95"
            >
              <Timer className="w-4 h-4" />
              <span>Start 25m Focus Session</span>
            </button>

            <button
              onClick={() => setActiveModal('new_task')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300/80 text-stone-800 rounded-xl font-medium text-xs shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4 text-stone-500" />
              <span>Plan Next Task</span>
            </button>

            <button
              onClick={() => setActiveModal('upload')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-300/80 text-stone-800 rounded-xl font-medium text-xs shadow-2xs transition-colors"
            >
              <BookOpen className="w-4 h-4 text-stone-500" />
              <span>Upload Files</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle aesthetic graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:flex items-center justify-end pr-8">
          <BookOpen className="w-64 h-64 text-stone-700" />
        </div>
      </section>

      {/* 2. Traceable Metric Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Weekly Study Hours</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-2xl font-bold text-stone-900">{weeklyStudyHours}</span>
            <span className="text-xs text-stone-400 font-medium">/ {profile.weeklyTargetHours} hrs goal</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-700 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (weeklyStudyHours / profile.weeklyTargetHours) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Tasks Completed</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-2xl font-bold text-stone-900">{completedTasksCount}</span>
            <span className="text-xs text-stone-400 font-medium">tasks total</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {completedTodayTasks.length} finished in today’s plan
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Flashcards Reviewed</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-2xl font-bold text-stone-900">{totalCardsReviewed}</span>
            <span className="text-xs text-stone-400 font-medium">retrieval reps</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Active recall retention
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Active Subjects</span>
            <FolderGit2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-2xl font-bold text-stone-900">{subjects.length}</span>
            <span className="text-xs text-stone-400 font-medium">notebooks</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {profile.academicTerm}
          </p>
        </div>
      </section>

      {/* 3. Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Plan & Active Subjects (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Today's Plan Interactive Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-stone-900">Today’s Plan</h2>
                  <p className="text-xs text-stone-500">
                    {completedTodayTasks.length} of {todayTasks.length} tasks completed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('new_task')}
                className="flex items-center space-x-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900 px-2.5 py-1 bg-emerald-50 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Checklist items */}
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 px-4 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-semibold text-stone-800">All clear for today!</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  No pending deadlines scheduled for today. Enjoy your rest or plan ahead for tomorrow.
                </p>
                <button
                  onClick={() => setActiveModal('new_task')}
                  className="mt-3 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 shadow-2xs"
                >
                  Schedule a Task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayTasks.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-start space-x-3 p-3.5 rounded-2xl border transition-all ${
                        task.completed
                          ? 'bg-stone-50/60 border-stone-200/50 opacity-60'
                          : 'bg-white border-stone-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors shrink-0"
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-400 group-hover:text-emerald-700" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p
                            className={`text-xs font-medium leading-snug truncate ${
                              task.completed ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 mt-1.5 text-[11px] text-stone-500">
                          {subject && (
                            <span
                              className="font-medium px-1.5 py-0.5 rounded text-[10px]"
                              style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                            >
                              {subject.code}
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{task.estimatedMinutes}m</span>
                          </span>
                          {task.priority === 'high' && (
                            <>
                              <span>•</span>
                              <span className="text-rose-700 font-semibold uppercase text-[9px] bg-rose-50 px-1 py-0.2 rounded">
                                High Priority
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Subjects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif font-bold text-stone-900">Active Subjects</h2>
                <p className="text-xs text-stone-500">Your current semester courses and workspaces</p>
              </div>
              <button
                onClick={() => setActiveTab('subjects')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.map(subject => (
                <div
                  key={subject.id}
                  onClick={() => openSubject(subject.id)}
                  className="group bg-white p-5 rounded-3xl border border-stone-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2 py-0.5 rounded-md font-semibold text-xs tracking-wide"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.code}
                      </span>
                      <span className="text-xs font-medium text-stone-400 group-hover:text-stone-700 transition-colors">
                        Notebook &rarr;
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                      <span>Weekly Pace</span>
                      <span className="font-semibold text-stone-700">
                        {subject.completedHoursThisWeek} / {subject.targetHoursPerWeek} hrs
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: subject.color,
                          width: `${Math.min(100, (subject.completedHoursThisWeek / subject.targetHoursPerWeek) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Subject Card */}
              <div
                onClick={() => setActiveModal('new_subject')}
                className="bg-[#FAF8F5] border-2 border-dashed border-stone-300/80 hover:border-emerald-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-emerald-50/20 min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 mb-2 shadow-2xs">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-stone-800">Add New Subject</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Create a dedicated notebook</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Recent Files & Focus Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-stone-900">Upcoming Deadlines</h2>
                  <p className="text-xs text-stone-500">Next 7 days schedule</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
              >
                Full Agenda
              </button>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">No upcoming deadlines registered.</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map(task => {
                  const subject = subjects.find(s => s.id === task.subjectId);
                  const isToday = task.dueDate === new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-medium text-stone-900 truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-1.5 text-[10px] text-stone-500 mt-1">
                          {subject && (
                            <span
                              className="font-medium px-1 rounded"
                              style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                            >
                              {subject.code}
                            </span>
                          )}
                          <span>•</span>
                          <span>{task.estimatedMinutes}m</span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isToday ? 'bg-rose-100 text-rose-800' : 'bg-stone-200/70 text-stone-700'
                          }`}
                        >
                          {isToday ? 'Due Today' : task.dueDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Added Resources */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-stone-900">Recent Materials</h2>
                  <p className="text-xs text-stone-500">Lecture slides & readings</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('resources')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-900"
              >
                Library
              </button>
            </div>

            {recentResources.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-stone-500">No resources uploaded yet.</p>
                <button
                  onClick={() => setActiveModal('upload')}
                  className="mt-2 text-xs font-medium text-emerald-800 underline"
                >
                  Upload your first file
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentResources.map(res => {
                  const subject = subjects.find(s => s.id === res.subjectId);
                  return (
                    <div
                      key={res.id}
                      onClick={() => setPreviewResource(res)}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-stone-200/70 hover:border-emerald-300 hover:bg-stone-50/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-stone-100 text-stone-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-medium text-stone-900 truncate">
                            {res.name}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {subject?.code} • {formatBytes(res.size)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-400 group-hover:text-emerald-700 font-medium shrink-0 ml-2">
                        Preview
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
