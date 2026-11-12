import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  FolderGit2,
  FileText,
  Calendar,
  Sparkles,
  Timer,
  Upload,
  Settings,
  Database,
  Moon,
  Sun,
} from 'lucide-react';
import { useStudyNest, NavTab } from '../../context/StudyNestContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedSubjectId,
    setActiveModal,
    profile,
    weeklyStudyHours,
    isDarkMode,
    toggleDarkMode,
  } = useStudyNest();

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'subjects') {
      setSelectedSubjectId(null);
    }
  };

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subjects', label: 'My Subjects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <Calendar className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#161619]/90 backdrop-blur-md border-b border-[#E7E2DA] dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
              <span className="font-serif font-bold text-xl tracking-tight">S</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100">StudyNest</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                Calm learning workspace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100/70 dark:bg-stone-800/60 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-stone-700/50'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right utility cluster */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors shadow-2xs"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-500" />
              )}
            </button>

            {/* Quick Upload Button */}
            <button
              onClick={() => setActiveModal('upload')}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm transition-colors"
              title="Upload study files or slides"
            >
              <Upload className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Upload</span>
            </button>

            {/* Pomodoro Focus Study Timer */}
            <button
              onClick={() => setActiveModal('focus_timer')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 rounded-lg transition-colors"
              title="Open Focus Pomodoro Timer with ambient sounds"
            >
              <Timer className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Focus</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">{weeklyStudyHours}h</span>
            </button>

            {/* Demo Status Indicator */}
            <div
              onClick={() => setActiveModal('settings')}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100/80 border border-amber-200 dark:border-amber-800 rounded-md cursor-pointer transition-colors"
              title="Demo Mode: All data stored locally in browser"
            >
              <Database className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>Local Demo</span>
            </div>

            {/* Profile Avatar / Settings */}
            <button
              onClick={() => setActiveModal('settings')}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
              title="Settings & Profile"
              aria-label="Settings"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-rose-500 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                {profile.name.charAt(0)}
              </div>
              <Settings className="w-4 h-4 text-stone-400 hover:text-stone-600 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-stone-200/60 overflow-x-auto gap-1">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex flex-col items-center py-1 px-2 rounded text-[10px] font-medium shrink-0 ${
                  isActive ? 'text-emerald-800 font-semibold' : 'text-stone-500'
                }`}
              >
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
