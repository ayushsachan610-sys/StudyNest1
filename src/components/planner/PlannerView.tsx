import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Trash2,
  CalendarCheck,
  AlertCircle,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { Priority, Task } from '../../types';

export const PlannerView: React.FC = () => {
  const {
    tasks,
    subjects,
    toggleTaskComplete,
    deleteTask,
    setActiveModal,
  } = useStudyNest();

  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSubject = filterSubject === 'all' || task.subjectId === filterSubject;
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'pending' && !task.completed) ||
        (filterStatus === 'completed' && task.completed);
      const matchPriority = filterPriority === 'all' || task.priority === filterPriority;

      return matchSubject && matchStatus && matchPriority;
    });
  }, [tasks, filterSubject, filterStatus, filterPriority]);

  // Group into: Today's Tasks, Upcoming (Future), and Completed/Past
  const todayTasksList = useMemo(() => {
    return filteredTasks.filter(t => t.dueDate === todayStr || (!t.completed && t.dueDate < todayStr));
  }, [filteredTasks, todayStr]);

  const upcomingTasksList = useMemo(() => {
    return filteredTasks
      .filter(t => t.dueDate > todayStr && !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [filteredTasks, todayStr]);

  const completedTasksList = useMemo(() => {
    return filteredTasks
      .filter(t => t.completed)
      .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
  }, [filteredTasks]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Study Planner & Agenda
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Keep track of upcoming deadlines, syllabus deliverables, and daily study blocks
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_task')}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-xs font-semibold text-stone-700">Filters:</span>
        </div>

        {/* Subject filter */}
        <select
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          className="text-xs px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden"
        >
          <option value="all">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-lg text-xs">
          {(['all', 'pending', 'completed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                filterStatus === st
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="text-xs px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Task Sections */}
      <div className="space-y-8">
        {/* Section 1: Today's Tasks */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                <Calendar className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">Today & Urgent</h3>
                <p className="text-xs text-stone-500">Tasks due today or awaiting completion</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              {todayTasksList.length} tasks
            </span>
          </div>

          {todayTasksList.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              No tasks scheduled for today.
            </p>
          ) : (
            <div className="space-y-2.5">
              {todayTasksList.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  subjects={subjects}
                  onToggle={() => toggleTaskComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  isTodayOrOverdue={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Upcoming Schedule */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <CalendarCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-stone-900">Upcoming Agenda</h3>
                <p className="text-xs text-stone-500">Scheduled for later this week and beyond</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              {upcomingTasksList.length} tasks
            </span>
          </div>

          {upcomingTasksList.length === 0 ? (
            <p className="text-xs text-stone-400 py-4 text-center">
              No upcoming future tasks scheduled.
            </p>
          ) : (
            <div className="space-y-2.5">
              {upcomingTasksList.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  subjects={subjects}
                  onToggle={() => toggleTaskComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Completed Tasks */}
        {completedTasksList.length > 0 && filterStatus !== 'pending' && (
          <div className="bg-white/60 rounded-3xl p-6 border border-stone-200/60 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-stone-100 text-stone-600">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-700">Completed Tasks</h3>
                  <p className="text-xs text-stone-400">Accomplished study milestones</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-400">
                {completedTasksList.length} done
              </span>
            </div>

            <div className="space-y-2">
              {completedTasksList.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  subjects={subjects}
                  onToggle={() => toggleTaskComplete(task.id)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Task Row Component
const TaskRow: React.FC<{
  task: Task;
  subjects: ReturnType<typeof useStudyNest>['subjects'];
  onToggle: () => void;
  onDelete: () => void;
  isTodayOrOverdue?: boolean;
}> = ({ task, subjects, onToggle, onDelete, isTodayOrOverdue }) => {
  const subject = subjects.find(s => s.id === task.subjectId);

  return (
    <div
      className={`group flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
        task.completed
          ? 'bg-stone-50/50 border-stone-200/60 opacity-60'
          : 'bg-white border-stone-200/90 hover:border-emerald-300 shadow-2xs'
      }`}
    >
      <div className="flex items-start space-x-3 min-w-0">
        <button
          onClick={onToggle}
          className="mt-0.5 text-stone-400 hover:text-emerald-700 transition-colors shrink-0"
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 text-stone-400 group-hover:text-emerald-700" />
          )}
        </button>

        <div className="min-w-0">
          <p
            className={`text-xs font-semibold leading-snug truncate ${
              task.completed ? 'line-through text-stone-400' : 'text-stone-900'
            }`}
          >
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
            {subject && (
              <span
                className="font-medium px-1.5 py-0.2 rounded text-[10px]"
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
            <span>•</span>
            <span
              className={`font-semibold uppercase text-[9px] px-1 py-0.2 rounded ${
                task.priority === 'high'
                  ? 'bg-rose-50 text-rose-800'
                  : task.priority === 'medium'
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.notes && (
            <p className="text-[11px] text-stone-500 mt-1 italic line-clamp-1">
              "{task.notes}"
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0 ml-3">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded ${
            isTodayOrOverdue && !task.completed
              ? 'bg-amber-100 text-amber-900'
              : 'text-stone-500'
          }`}
        >
          {task.dueDate}
        </span>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
