import React, { useState } from 'react';
import { X, Sparkles, MessageCircle, Volume2, VolumeX } from 'lucide-react';
import { MascotMood, VisualTheme } from '../../types';

interface StudyMascotProps {
  mood?: MascotMood;
  customMessage?: string;
  visualTheme: VisualTheme;
  mascotEnabled: boolean;
  reducedMotion?: boolean;
}

export const StudyMascot: React.FC<StudyMascotProps> = ({
  mood = 'idle',
  customMessage,
  visualTheme,
  mascotEnabled,
  reducedMotion = false,
}) => {
  const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!mascotEnabled || visualTheme !== 'anime') {
    return null;
  }

  const defaultMessages: Record<MascotMood, string> = {
    idle: "Konnichiwa! I'm Kiko, your study companion. Ready to conquer some knowledge today?",
    studying: "Deep focus mode activated! Absorb every key concept on these slides.",
    celebrating: "Sugoi! Fantastic job on that quiz! Your brain power is leveling up!",
    encouraging: "Don't worry about mistakes — that's how mastery happens! Let's review the weak spots together.",
    timer_alert: "Stay sharp! The countdown is ticking. Trust your preparation and finish strong!",
  };

  const message = customMessage || defaultMessages[mood];

  // SVG Renderers for Kiko's Expressive Anime Moods
  const renderMascotSvg = () => {
    switch (mood) {
      case 'studying':
        return (
          <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md select-none" aria-label="Kiko studying">
            <defs>
              <linearGradient id="furGradStudying" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA07A" />
                <stop offset="100%" stopColor="#FF6B4A" />
              </linearGradient>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
            </defs>
            {/* Tail */}
            <path d="M 40 120 C 15 110, 10 70, 30 55 C 40 45, 55 60, 48 85 Z" fill="#FF8552" />
            <path d="M 28 58 C 32 50, 42 55, 38 70 Z" fill="#FFF5EB" />
            {/* Body */}
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="url(#furGradStudying)" />
            <ellipse cx="80" cy="118" rx="22" ry="20" fill="#FFF9F5" />
            {/* Ears */}
            <polygon points="50,45 68,15 82,48" fill="#FF6B4A" />
            <polygon points="56,40 68,23 76,43" fill="#FFE5D9" />
            <polygon points="110,45 92,15 78,48" fill="#FF6B4A" />
            <polygon points="104,40 92,23 84,43" fill="#FFE5D9" />
            {/* Head */}
            <circle cx="80" cy="65" r="35" fill="url(#furGradStudying)" />
            {/* Face White Patch */}
            <path d="M 52 75 Q 80 98 108 75 Q 100 55 80 58 Q 60 55 52 75 Z" fill="#FFF9F5" />
            {/* Glasses */}
            <circle cx="68" cy="64" r="11" fill="none" stroke="#2D3748" strokeWidth="2.5" />
            <circle cx="92" cy="64" r="11" fill="none" stroke="#2D3748" strokeWidth="2.5" />
            <line x1="79" y1="64" x2="81" y2="64" stroke="#2D3748" strokeWidth="2.5" />
            {/* Eyes behind glasses (concentrated) */}
            <ellipse cx="68" cy="65" rx="4" ry="5" fill="#2B2D42" />
            <ellipse cx="92" cy="65" rx="4" ry="5" fill="#2B2D42" />
            <circle cx="66" cy="63" r="1.5" fill="#FFFFFF" />
            <circle cx="90" cy="63" r="1.5" fill="#FFFFFF" />
            {/* Little Nose & Smile */}
            <polygon points="78,74 82,74 80,77" fill="#4A302C" />
            <path d="M 77 79 Q 80 82 83 79" fill="none" stroke="#4A302C" strokeWidth="1.5" strokeLinecap="round" />
            {/* Open Book */}
            <path d="M 50 115 Q 80 122 80 140 Q 80 122 110 115 L 115 135 Q 80 142 80 155 Q 80 142 45 135 Z" fill="url(#bookGrad)" />
            <path d="M 52 116 Q 79 122 79 138 L 79 136 Q 79 120 52 116 Z" fill="#FFFFFF" opacity="0.9" />
            <path d="M 108 116 Q 81 122 81 138 L 81 136 Q 81 120 108 116 Z" fill="#FFFFFF" opacity="0.9" />
            {/* Floating Sparkle */}
            <path d="M 120 35 Q 125 35 125 30 Q 125 35 130 35 Q 125 35 125 40 Q 125 35 120 35" fill="#FBBF24" />
          </svg>
        );

      case 'celebrating':
        return (
          <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md select-none" aria-label="Kiko celebrating">
            <defs>
              <linearGradient id="furGradCelem" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA07A" />
                <stop offset="100%" stopColor="#FF5252" />
              </linearGradient>
            </defs>
            {/* Sparkles & Confetti */}
            <circle cx="30" cy="30" r="3" fill="#F59E0B" />
            <circle cx="130" cy="25" r="4" fill="#EC4899" />
            <circle cx="20" cy="65" r="3" fill="#10B981" />
            <circle cx="135" cy="70" r="3.5" fill="#6366F1" />
            {/* Ears perked up */}
            <polygon points="46,40 62,10 78,42" fill="#FF5252" />
            <polygon points="52,36 62,18 72,38" fill="#FFE5D9" />
            <polygon points="114,40 98,10 82,42" fill="#FF5252" />
            <polygon points="108,36 98,18 88,38" fill="#FFE5D9" />
            {/* Body */}
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="url(#furGradCelem)" />
            <ellipse cx="80" cy="118" rx="22" ry="20" fill="#FFF9F5" />
            {/* Head */}
            <circle cx="80" cy="62" r="34" fill="url(#furGradCelem)" />
            {/* Cheerful Happy Eyes (Anime arcs ^ ^) */}
            <path d="M 60 62 Q 67 53 74 62" fill="none" stroke="#2B2D42" strokeWidth="3" strokeLinecap="round" />
            <path d="M 86 62 Q 93 53 100 62" fill="none" stroke="#2B2D42" strokeWidth="3" strokeLinecap="round" />
            {/* Blushing cheeks */}
            <ellipse cx="58" cy="70" rx="5" ry="3" fill="#FF8BA7" opacity="0.8" />
            <ellipse cx="102" cy="70" rx="5" ry="3" fill="#FF8BA7" opacity="0.8" />
            {/* Open Happy Smile */}
            <polygon points="78,67 82,67 80,70" fill="#4A302C" />
            <path d="M 72 73 Q 80 86 88 73 Z" fill="#D90429" />
            <path d="M 74 77 Q 80 82 86 77" fill="#FF8BA7" />
            {/* Raised Paws in Celebration */}
            <circle cx="48" cy="85" r="9" fill="#FFF9F5" stroke="#FF5252" strokeWidth="2" />
            <circle cx="112" cy="85" r="9" fill="#FFF9F5" stroke="#FF5252" strokeWidth="2" />
            {/* Golden Star Trophy */}
            <polygon points="80,15 83,23 92,23 85,28 87,36 80,31 73,36 75,28 68,23 77,23" fill="#FBBF24" />
          </svg>
        );

      case 'encouraging':
        return (
          <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md select-none" aria-label="Kiko encouraging">
            <defs>
              <linearGradient id="furGradEnc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFB088" />
                <stop offset="100%" stopColor="#FF7A59" />
              </linearGradient>
            </defs>
            {/* Headband with red circle */}
            <polygon points="48,42 66,12 80,45" fill="#FF7A59" />
            <polygon points="112,42 94,12 80,45" fill="#FF7A59" />
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="url(#furGradEnc)" />
            <circle cx="80" cy="62" r="34" fill="url(#furGradEnc)" />
            {/* Headband */}
            <path d="M 46 54 Q 80 50 114 54 L 114 62 Q 80 58 46 62 Z" fill="#FFFFFF" />
            <circle cx="80" cy="57" r="4" fill="#EF4444" />
            {/* Big Determined Anime Eyes */}
            <ellipse cx="67" cy="72" rx="7" ry="8" fill="#2B2D42" />
            <ellipse cx="93" cy="72" rx="7" ry="8" fill="#2B2D42" />
            <circle cx="65" cy="69" r="2.5" fill="#FFFFFF" />
            <circle cx="91" cy="69" r="2.5" fill="#FFFFFF" />
            {/* Confident Smile */}
            <path d="M 74 83 Q 80 89 86 83" fill="none" stroke="#4A302C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Supportive Fist Pump Paw */}
            <circle cx="114" cy="92" r="11" fill="#FFF9F5" stroke="#FF7A59" strokeWidth="3" />
            <path d="M 112 87 L 116 87" stroke="#4A302C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'timer_alert':
        return (
          <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md select-none" aria-label="Kiko timer alert">
            <defs>
              <linearGradient id="furGradAlert" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
            </defs>
            {/* Ears angled */}
            <polygon points="46,45 60,18 78,48" fill="#EA580C" />
            <polygon points="114,45 100,18 82,48" fill="#EA580C" />
            {/* Head & Body */}
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="url(#furGradAlert)" />
            <circle cx="80" cy="62" r="34" fill="url(#furGradAlert)" />
            {/* Wide Alert Anime Eyes */}
            <ellipse cx="66" cy="68" rx="8" ry="9" fill="#1E293B" />
            <ellipse cx="94" cy="68" rx="8" ry="9" fill="#1E293B" />
            <circle cx="63" cy="64" r="3" fill="#FFFFFF" />
            <circle cx="91" cy="64" r="3" fill="#FFFFFF" />
            <circle cx="68" cy="72" r="1.5" fill="#FFFFFF" />
            <circle cx="96" cy="72" r="1.5" fill="#FFFFFF" />
            {/* Little 'O' Mouth */}
            <ellipse cx="80" cy="82" rx="3.5" ry="4.5" fill="#7C2D12" />
            {/* Holding Pocket Watch */}
            <circle cx="115" cy="100" r="14" fill="#FDE047" stroke="#B45309" strokeWidth="2.5" />
            <circle cx="115" cy="100" r="11" fill="#FFFFFF" />
            <line x1="115" y1="100" x2="115" y2="93" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            <line x1="115" y1="100" x2="120" y2="100" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
            {/* Little sweatdrop of focus */}
            <path d="M 112 40 C 112 40 106 50 112 55 C 117 55 117 48 112 40 Z" fill="#60A5FA" />
          </svg>
        );

      case 'idle':
      default:
        return (
          <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md select-none" aria-label="Kiko companion">
            <defs>
              <linearGradient id="furGradIdle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA07A" />
                <stop offset="100%" stopColor="#FF7A59" />
              </linearGradient>
            </defs>
            {/* Cute Tail */}
            <path d="M 40 120 C 15 110, 10 70, 30 55 C 40 45, 55 60, 48 85 Z" fill="#FF8552" />
            <path d="M 28 58 C 32 50, 42 55, 38 70 Z" fill="#FFF5EB" />
            {/* Body */}
            <ellipse cx="80" cy="115" rx="36" ry="32" fill="url(#furGradIdle)" />
            <ellipse cx="80" cy="118" rx="22" ry="20" fill="#FFF9F5" />
            {/* Ears */}
            <polygon points="50,45 68,15 82,48" fill="#FF7A59" />
            <polygon points="56,40 68,23 76,43" fill="#FFE5D9" />
            <polygon points="110,45 92,15 78,48" fill="#FF7A59" />
            <polygon points="104,40 92,23 84,43" fill="#FFE5D9" />
            {/* Head */}
            <circle cx="80" cy="65" r="35" fill="url(#furGradIdle)" />
            <path d="M 52 75 Q 80 98 108 75 Q 100 55 80 58 Q 60 55 52 75 Z" fill="#FFF9F5" />
            {/* Round Glasses */}
            <circle cx="68" cy="65" r="10" fill="none" stroke="#374151" strokeWidth="2" />
            <circle cx="92" cy="65" r="10" fill="none" stroke="#374151" strokeWidth="2" />
            <line x1="78" y1="65" x2="82" y2="65" stroke="#374151" strokeWidth="2" />
            {/* Cute Anime Eyes */}
            <circle cx="68" cy="66" r="4.5" fill="#1F2937" />
            <circle cx="92" cy="66" r="4.5" fill="#1F2937" />
            <circle cx="66" cy="64" r="1.8" fill="#FFFFFF" />
            <circle cx="90" cy="64" r="1.8" fill="#FFFFFF" />
            {/* Blushing cheeks */}
            <ellipse cx="58" cy="74" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.7" />
            <ellipse cx="102" cy="74" rx="4" ry="2.5" fill="#FF8BA7" opacity="0.7" />
            {/* Nose & Smile */}
            <polygon points="78,73 82,73 80,76" fill="#4A302C" />
            <path d="M 76 78 Q 80 82 84 78" fill="none" stroke="#4A302C" strokeWidth="1.8" strokeLinecap="round" />
            {/* Tiny magical feather quill */}
            <path d="M 106 100 Q 120 85 125 70 Q 115 80 110 95 Z" fill="#60A5FA" />
            <line x1="110" y1="95" x2="105" y2="108" stroke="#3B82F6" strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-40 flex items-end space-x-3 pointer-events-auto transition-transform ${
        reducedMotion ? '' : 'duration-300'
      }`}
    >
      {/* Dynamic Speech Bubble */}
      {!isBubbleDismissed && !isMinimized && (
        <div
          className={`relative max-w-xs sm:max-w-sm p-3.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-xl border-2 border-rose-200 dark:border-rose-900/60 text-stone-800 dark:text-stone-100 text-xs sm:text-sm leading-relaxed mb-2 ${
            reducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-300'
          }`}
        >
          {/* Speech Bubble Arrow pointing right to mascot */}
          <div className="absolute -right-2 bottom-5 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white dark:border-l-stone-900" />

          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center space-x-1.5 font-bold text-rose-500 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kiko • Study Companion</span>
            </div>
            <button
              onClick={() => setIsBubbleDismissed(true)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="font-medium">{message}</p>
        </div>
      )}

      {/* Mascot Avatar Widget */}
      <div className="relative group">
        <button
          onClick={() => {
            if (isBubbleDismissed) setIsBubbleDismissed(false);
            else setIsMinimized(!isMinimized);
          }}
          className={`relative p-1 rounded-2xl bg-gradient-to-tr from-rose-100 via-amber-50 to-orange-100 dark:from-rose-950/60 dark:via-stone-900 dark:to-orange-950/60 border-2 border-rose-300 dark:border-rose-700 shadow-xl transition-all cursor-pointer ${
            reducedMotion ? '' : 'hover:scale-105 active:scale-95'
          }`}
          title="Click to talk with Kiko"
          aria-label="Kiko Mascot Companion"
        >
          {renderMascotSvg()}

          {/* Level / Status Pill */}
          <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] tracking-wider shadow-xs uppercase">
            LVL 3
          </div>
        </button>
      </div>
    </div>
  );
};
