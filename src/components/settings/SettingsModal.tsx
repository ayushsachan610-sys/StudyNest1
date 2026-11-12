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
  HardDrive,
  Cloud,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { getSyncStatus } from '../../lib/supabase';

export const SettingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    profile,
    updateProfile,
    resetToDemoData,
    clearAllData,
    exportBackup,
    importBackup,
    subjects,
    notes,
    tasks,
    resources,
  } = useStudyNest();

  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [term, setTerm] = useState(profile.academicTerm);
  const [weeklyTarget, setWeeklyTarget] = useState(profile.weeklyTargetHours);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const importFileRef = useRef<HTMLInputElement | null>(null);
  const syncStatus = getSyncStatus();

  if (activeModal !== 'settings') return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      major,
      academicTerm: term,
      weeklyTargetHours: weeklyTarget,
    });
    setSaveMessage('Profile preferences updated.');
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
        setImportError('Invalid backup file. Could not parse StudyNest JSON schema.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl shadow-warm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <User className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Student Profile & Data Settings</h3>
              <p className="text-xs text-stone-500">Configure academic goals, backups, and backend persistence</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {saveMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          {importError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{importError}</span>
            </div>
          )}

          {/* Student Profile Section */}
          <form onSubmit={handleSaveProfile} className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Academic Information
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Major / Degree Track
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Term / Semester
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Weekly Target Study Hours
                </label>
                <input
                  type="number"
                  min="2"
                  max="40"
                  value={weeklyTarget}
                  onChange={e => setWeeklyTarget(parseInt(e.target.value) || 16)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>

          {/* Backend & Persistence Status */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Storage & Backend Architecture
            </h4>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                {syncStatus.isConfigured ? <Cloud className="w-5 h-5 text-emerald-700" /> : <HardDrive className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-stone-900">
                  {syncStatus.statusMessage}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {syncStatus.isConfigured
                    ? 'Row Level Security enforces strict student data isolation.'
                    : '100% private to this browser. Ready for Supabase via .env.local and supabase/schema.sql.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-xs">
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                <span className="block font-bold text-stone-800">{subjects.length}</span>
                <span className="text-[10px] text-stone-500">Subjects</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                <span className="block font-bold text-stone-800">{resources.length}</span>
                <span className="text-[10px] text-stone-500">Files</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                <span className="block font-bold text-stone-800">{notes.length}</span>
                <span className="text-[10px] text-stone-500">Notes</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/60">
                <span className="block font-bold text-stone-800">{tasks.length}</span>
                <span className="text-[10px] text-stone-500">Tasks</span>
              </div>
            </div>
          </div>

          {/* Backup & Portability Actions */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Data Sovereignty & Portability
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={exportBackup}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-700 text-xs font-medium transition-colors"
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span>Export JSON Backup</span>
              </button>

              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-700 text-xs font-medium transition-colors"
              >
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Import JSON Backup</span>
              </button>
              <input
                type="file"
                ref={importFileRef}
                className="hidden"
                accept=".json"
                onChange={handleImportFile}
              />
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all workspace data back to realistic PM2 sample demo data?')) {
                    resetToDemoData();
                    setActiveModal('none');
                  }
                }}
                className="flex items-center space-x-1.5 text-xs text-amber-800 hover:text-amber-900 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Demo Data</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear ALL subjects, notes, and tasks to start blank?')) {
                    clearAllData();
                    setActiveModal('none');
                  }
                }}
                className="flex items-center space-x-1 text-xs text-rose-700 hover:text-rose-900 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100/80 border-t border-[#E7E2DA] flex justify-end">
          <button
            onClick={() => setActiveModal('none')}
            className="px-4 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
