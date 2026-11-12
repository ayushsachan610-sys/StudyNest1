import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, CloudRain, Wind, Coffee, Bell } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { ambientSound } from '../../lib/ambientAudio';

export const FocusTimerModal: React.FC = () => {
  const { activeModal, setActiveModal, subjects, logFocusSession } = useStudyNest();

  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [ambientMode, setAmbientMode] = useState<'off' | 'rain' | 'whitenoise' | 'cafe'>('off');
  const [volume, setVolume] = useState<number>(0.3);

  const timerRef = useRef<number | null>(null);

  // Sync when duration preset changes while not running
  const setPreset = (mins: number) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Timer complete!
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            ambientSound.playChime();
            ambientSound.stop();
            setAmbientMode('off');
            if (selectedSubjectId) {
              logFocusSession(selectedSubjectId, durationMinutes);
            }
            alert(`Great focus session! You completed ${durationMinutes} minutes of focused study.`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, durationMinutes, selectedSubjectId, logFocusSession]);

  const handleTogglePlay = () => {
    if (!isRunning && secondsLeft === 0) {
      setSecondsLeft(durationMinutes * 60);
    }
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const handleAmbientChange = (mode: 'off' | 'rain' | 'whitenoise' | 'cafe') => {
    setAmbientMode(mode);
    if (mode === 'off') {
      ambientSound.stop();
    } else {
      ambientSound.play(mode, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSound.setVolume(newVol);
  };

  const handleClose = () => {
    ambientSound.stop();
    setActiveModal('none');
  };

  if (activeModal !== 'focus_timer') return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl shadow-warm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Focus Study Companion</h3>
              <p className="text-xs text-stone-500">Pomodoro timer with calm ambient soundscapes</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Preset Buttons */}
          <div className="flex items-center space-x-2 mb-6 bg-stone-100/80 p-1 rounded-xl border border-stone-200/80 text-xs">
            <button
              onClick={() => setPreset(25)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                durationMinutes === 25 ? 'bg-white text-emerald-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              25m Pomodoro
            </button>
            <button
              onClick={() => setPreset(50)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                durationMinutes === 50 ? 'bg-white text-emerald-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              50m Deep Sprint
            </button>
            <button
              onClick={() => setPreset(5)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                durationMinutes === 5 ? 'bg-white text-emerald-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              5m Break
            </button>
          </div>

          {/* Circular/Ring Timer Display */}
          <div className="relative w-52 h-52 flex items-center justify-center rounded-full bg-white border-4 border-stone-200/70 shadow-inner my-2">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E7E2DA"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2E7D5B"
                strokeWidth="4"
                strokeDasharray="282.7"
                strokeDashoffset={282.7 - (282.7 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="text-center z-10">
              <span className="font-serif text-5xl font-bold tracking-tight text-stone-900 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <p className="text-[11px] text-stone-500 font-medium uppercase tracking-wider mt-1">
                {isRunning ? 'Focus In Progress' : 'Ready'}
              </p>
            </div>
          </div>

          {/* Primary Action Controls */}
          <div className="flex items-center space-x-4 mt-6">
            <button
              onClick={handleTogglePlay}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium shadow-sm transition-all transform active:scale-95"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl border border-stone-200 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Subject Attribution Selector */}
          <div className="w-full mt-6 pt-4 border-t border-stone-200/80">
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Attribute Time To Subject:
            </label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ambient Sound Generators */}
          <div className="w-full mt-4 bg-stone-50 p-3 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-stone-700 flex items-center space-x-1.5">
                <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                <span>Ambient Study Soundscape</span>
              </span>
              {ambientMode !== 'off' && (
                <span className="text-[11px] text-emerald-700 font-medium capitalize">
                  {ambientMode} active
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                onClick={() => handleAmbientChange('off')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all flex items-center justify-center space-x-1 ${
                  ambientMode === 'off'
                    ? 'bg-white border-stone-300 text-stone-900 font-semibold shadow-2xs'
                    : 'bg-stone-100/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <VolumeX className="w-3 h-3 text-stone-400" />
                <span>Mute</span>
              </button>
              <button
                onClick={() => handleAmbientChange('rain')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all flex items-center justify-center space-x-1 ${
                  ambientMode === 'rain'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                    : 'bg-stone-100/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <CloudRain className="w-3 h-3 text-emerald-600" />
                <span>Rain</span>
              </button>
              <button
                onClick={() => handleAmbientChange('whitenoise')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all flex items-center justify-center space-x-1 ${
                  ambientMode === 'whitenoise'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                    : 'bg-stone-100/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <Wind className="w-3 h-3 text-emerald-600" />
                <span>White</span>
              </button>
              <button
                onClick={() => handleAmbientChange('cafe')}
                className={`py-1.5 px-2 rounded-lg border text-center transition-all flex items-center justify-center space-x-1 ${
                  ambientMode === 'cafe'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold shadow-2xs'
                    : 'bg-stone-100/60 border-stone-200 text-stone-600 hover:bg-white'
                }`}
              >
                <Coffee className="w-3 h-3 text-emerald-600" />
                <span>Cafe</span>
              </button>
            </div>

            {ambientMode !== 'off' && (
              <div className="mt-2.5 flex items-center space-x-2 text-xs">
                <span className="text-[11px] text-stone-500">Volume</span>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100/80 border-t border-[#E7E2DA] flex items-center justify-between text-xs text-stone-500">
          <span>Synthesized in-browser via Web Audio API. 100% offline.</span>
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded font-medium text-stone-700 transition-colors"
          >
            Minimize
          </button>
        </div>
      </div>
    </div>
  );
};
