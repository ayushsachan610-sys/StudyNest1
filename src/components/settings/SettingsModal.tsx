import React, { useState, useRef } from 'react';
import {
  X,
  User,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun,
  Palette,
  Sparkles,
  Clock,
  Activity,
  Smile,
  Eye,
  Sliders,
  Smartphone,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { AccentColor, VisualTheme } from '../../types';

export const SettingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    profile,
    updateProfile,
    isDarkMode,
    toggleDarkMode,
    accentColor,
    setAccentColor,
    visualTheme,
    setVisualTheme,
    reducedMotion,
    setReducedMotion,
    defaultQuizTimerMinutes,
    setDefaultQuizTimerMinutes,
    mascotEnabled,
    setMascotEnabled,
    resetToDemoData,
    clearAllData,
    exportBackup,
    importBackup,
    subjects,
    resources,
    quizzes,
  } = useStudyNest();

  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [term, setTerm] = useState(profile.academicTerm);
  const [weeklyTarget, setWeeklyTarget] = useState(profile.weeklyTargetHours);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const importFileRef = useRef<HTMLInputElement | null>(null);

  if (activeModal !== 'settings') return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      major,
      academicTerm: term,
      weeklyTargetHours: weeklyTarget,
    });
    setSaveMessage('Profile settings saved.');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImportError(null);
      const success = await importBackup(e.target.files[0]);
      if (success) {
        setSaveMessage('Backup restored successfully.');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setImportError('Invalid backup file. Could not parse StudyNest JSON.');
      }
    }
  };

  const accentOptions: { id: AccentColor; name: string; hex: string }[] = [
    { id: 'rose', name: 'Sakura Rose', hex: '#F43F5E' },
    { id: 'emerald', name: 'Sage Emerald', hex: '#10B981' },
    { id: 'indigo', name: 'Celestial Indigo', hex: '#6366F1' },
    { id: 'violet', name: 'Amethyst Violet', hex: '#8B5CF6' },
    { id: 'amber', name: 'Sunburst Amber', hex: '#F59E0B' },
    { id: 'cyan', name: 'Ocean Cyan', hex: '#06B6D4' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Personal LMS Settings & Themes
              </h2>
              <p className="text-xs text-stone-500">
                Visual styling, study companion, exam timers, and data storage
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {saveMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {/* Section 1: Visual Theme Style (Anime vs Clean) */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Visual Theme Style
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Anime-Inspired Theme Card */}
              <button
                type="button"
                onClick={() => setVisualTheme('anime')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  visualTheme === 'anime'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    <span>🌸</span>
                    <span>Anime-Inspired Theme</span>
                  </span>
                  {visualTheme === 'anime' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Expressive original illustrations, colorful cards, playful icons, and friendly study companion mascot Kiko.
                </p>
              </button>

              {/* Clean & Simple Theme Card */}
              <button
                type="button"
                onClick={() => setVisualTheme('clean')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  visualTheme === 'clean'
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                    <span>🌿</span>
                    <span>Clean & Simple Theme</span>
                  </span>
                  {visualTheme === 'clean' && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Understated minimalism with clean borders, uncluttered layouts, and distraction-free study focus.
                </p>
              </button>
            </div>
          </div>

          {/* Section 2: Light / Dark Mode & Accent Colors */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Appearance & Accent Colors
              </h3>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Theme Appearance
                </span>
                <p className="text-[11px] text-stone-500">
                  Switch between crisp daylight and comfortable dark mode
                </p>
              </div>

              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Accent Colors Picker */}
            <div>
              <span className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Accent Color Palette
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {accentOptions.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => setAccentColor(acc.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center space-y-1 transition-all ${
                      accentColor === acc.id
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800 ring-2 ring-rose-400/50'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full shadow-2xs"
                      style={{ backgroundColor: acc.hex }}
                    />
                    <span className="text-[10px] font-bold text-stone-700 dark:text-stone-300 truncate w-full text-center">
                      {acc.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Study Companion & Accessibility */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center space-x-2">
              <Smile className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Study Companion Mascot & Accessibility
              </h3>
            </div>

            <div className="space-y-3">
              {/* Mascot Companion Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Friendly Study Mascot (Kiko)
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Displays encouraging messages, exam tips, and study reactions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={mascotEnabled}
                  onChange={e => setMascotEnabled(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded-md focus:ring-rose-500"
                />
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Reduced Motion
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Disables confetti celebrations, 3D card flips, and bouncy animations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={e => setReducedMotion(e.target.checked)}
                  className="w-4 h-4 text-rose-500 rounded-md focus:ring-rose-500"
                />
              </div>

              {/* Default Quiz Timer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Default Quiz Timer
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Initial duration for new timed tests
                  </p>
                </div>
                <select
                  value={defaultQuizTimerMinutes}
                  onChange={e => setDefaultQuizTimerMinutes(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-bold text-stone-900 dark:text-stone-100"
                >
                  <option value={3}>3 Minutes</option>
                  <option value={5}>5 Minutes</option>
                  <option value={10}>10 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Learner Profile & Goals */}
          <form onSubmit={handleSaveProfile} className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Learner Profile & Academic Goals
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Major / Program
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Academic Term
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                  Weekly Goal (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={weeklyTarget}
                  onChange={e => setWeeklyTarget(parseInt(e.target.value, 10) || 10)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Section 5: Mobile App (Android APK) */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold">
                StudyNest for Android (APK)
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                Native App
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Install StudyNest directly on your Android phone or tablet. Includes full offline storage, gesture navigation, PDF reading, and timed test taking.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="/StudyNest.apk"
                download="StudyNest.apk"
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download Android APK</span>
              </a>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Direct package installable on any Android 8.0+ device
              </span>
            </div>
          </div>

          {/* Section 6: Data Backup & Reset */}
          <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Data Management & Backup
            </h3>
            <p className="text-xs text-stone-500">
              All materials, presentations, quizzes, test attempts, and settings are saved automatically in your browser's private local storage.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={exportBackup}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <button
                onClick={() => importFileRef.current?.click()}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
              </button>

              <input
                ref={importFileRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />

              <button
                onClick={() => {
                  if (window.confirm('Reset all LMS data back to default with initial PowerPoint resource?')) {
                    resetToDemoData();
                  }
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Initial Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
