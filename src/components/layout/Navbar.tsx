import React from 'react';
import {
  BookOpen,
  LayoutDashboard,
  FolderGit2,
  FileText,
  Calendar,
  Sparkles,
  Settings,
  Moon,
  Sun,
  Layers,
  Clock,
  Palette,
  Smartphone,
  Download,
} from 'lucide-react';
import { useStudyNest, NavTab } from '../../context/StudyNestContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedSubjectId,
    setActiveModal,
    isDarkMode,
    toggleDarkMode,
    visualTheme,
    setVisualTheme,
    resources,
    openStudyView,
  } = useStudyNest();

  const handleNav = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'subjects') {
      setSelectedSubjectId(null);
    }
  };

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subjects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'resources', label: 'Library & Slides', icon: <Layers className="w-4 h-4" /> },
    { id: 'review', label: 'Quizzes & Review', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'notes', label: 'Study Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <Calendar className="w-4 h-4" /> },
  ];

  const primaryPresentation = resources.find(r => r.type === 'pptx' || r.type === 'ppt');

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#151518]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNav('dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md">
              <span className="font-black text-xl tracking-tight">K</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                  StudyNest
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
                  LMS
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                Personal Learning Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-stone-100/80 dark:bg-stone-800/60 p-1 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-400 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-white/40'
                  }`}
                >
                  <span className={isActive ? 'text-rose-500' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility Cluster */}
          <div className="flex items-center space-x-2">
            {/* Download Android APK Button */}
            <a
              href="/StudyNest.apk"
              download="StudyNest.apk"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-2xs"
              title="Download StudyNest APK for Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Android APK</span>
            </a>

            {/* Visual Theme Switcher (Anime vs Clean) */}
            <button
              onClick={() => setVisualTheme(visualTheme === 'anime' ? 'clean' : 'anime')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                visualTheme === 'anime'
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                  : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title="Switch between Anime-inspired theme and Clean simple theme"
            >
              <span>{visualTheme === 'anime' ? '🌸 Anime' : '🌿 Clean'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors shadow-2xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={() => setActiveModal('settings')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 transition-colors shadow-2xs"
              title="Settings & Themes"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-stone-200/60 dark:border-stone-800 space-x-2 text-xs">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
