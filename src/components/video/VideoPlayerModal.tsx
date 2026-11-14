import React, { useState } from 'react';
import { X, ExternalLink, Play, AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { VideoResource } from '../../types';

interface VideoPlayerModalProps {
  video: VideoResource | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { subjects } = useStudyNest();
  const [embedError, setEmbedError] = useState(false);

  if (!video) return null;

  const subject = subjects.find(s => s.id === video.subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-red-600 text-white shrink-0">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {video.title}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-stone-400 mt-0.5">
                {subject && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: `${subject.color}25`, color: subject.color }}
                  >
                    {subject.name}
                  </span>
                )}
                <span>•</span>
                <span>YouTube Study Resource</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              title="Open directly on YouTube"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Close video player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setEmbedError(true)}
          />
        </div>

        {/* Informational Callout & Fallback */}
        <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Playing in-app via YouTube Embed API. If the video displays "Playback on other websites has been disabled by the video owner", you can{' '}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-400 hover:underline font-bold"
              >
                open it directly on YouTube here
              </a>.
            </p>
          </div>

          {video.description && (
            <p className="text-stone-300 italic max-w-sm text-right shrink-0">
              "{video.description}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
