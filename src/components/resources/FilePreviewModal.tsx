import React from 'react';
import { X, Download, FileText, Calendar, Tag, HardDrive } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';

export const FilePreviewModal: React.FC = () => {
  const { previewResource, setPreviewResource, subjects } = useStudyNest();

  if (!previewResource) return null;

  const subject = subjects.find(s => s.id === previewResource.subjectId);

  const handleDownload = () => {
    const blob = new Blob([previewResource.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = previewResource.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl shadow-warm flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-base font-semibold text-stone-900 truncate">
                {previewResource.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-stone-500 mt-0.5">
                {subject && (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded font-medium text-[11px]"
                    style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                  >
                    {subject.code}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{formatBytes(previewResource.size)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(previewResource.uploadedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setPreviewResource(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close file preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags bar if tags present */}
        {previewResource.tags && previewResource.tags.length > 0 && (
          <div className="px-6 py-2 bg-stone-50 border-b border-stone-200/60 flex items-center space-x-2 text-xs text-stone-600">
            <Tag className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-[11px] font-medium text-stone-400">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {previewResource.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-700 text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Viewer */}
        <div className="flex-1 p-6 overflow-y-auto font-sans text-stone-800 text-sm leading-relaxed whitespace-pre-wrap bg-[#FAF8F5]">
          <div className="p-4 bg-white rounded-xl border border-stone-200/80 font-mono text-xs text-stone-800 leading-relaxed shadow-2xs overflow-x-auto">
            {previewResource.content || 'No text content available for preview.'}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-100/70 border-t border-[#E7E2DA] flex items-center justify-between text-xs text-stone-500">
          <span>Private to current student profile. Stored in client cache.</span>
          <button
            onClick={() => setPreviewResource(null)}
            className="px-4 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-700 shadow-2xs transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
