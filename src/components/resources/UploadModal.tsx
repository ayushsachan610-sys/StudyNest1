import React, { useState, useRef } from 'react';
import { X, UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { validateStudyFile, readFileText, formatBytes } from '../../lib/fileValidation';
import { Resource } from '../../types';

export const UploadModal: React.FC = () => {
  const { activeModal, setActiveModal, subjects, selectedSubjectId, addResource, setPreviewResource } = useStudyNest();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetSubjectId, setTargetSubjectId] = useState<string>(
    selectedSubjectId || subjects[0]?.id || ''
  );
  const [tagsInput, setTagsInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<Resource | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (activeModal !== 'upload') return null;

  const handleFileSelection = (file: File) => {
    setValidationError(null);
    setUploadSuccess(null);

    const validation = validateStudyFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleProcessUpload = async () => {
    if (!selectedFile) return;

    if (!targetSubjectId) {
      setValidationError('Please select a subject to associate this resource with.');
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    try {
      const content = await readFileText(selectedFile);
      const validation = validateStudyFile(selectedFile);

      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const newRes = addResource({
        name: selectedFile.name,
        subjectId: targetSubjectId,
        size: selectedFile.size,
        type: validation.type || 'txt',
        status: 'ready',
        content,
        tags,
      });

      setUploadSuccess(newRes);
      setSelectedFile(null);
      setTagsInput('');
    } catch (err) {
      setValidationError((err as Error).message || 'Failed to process file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadSuccess(null);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E7E2DA] rounded-3xl shadow-warm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2DA] bg-white">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Upload Study Resource</h3>
              <p className="text-xs text-stone-500">PDF, Markdown, Notes, Code, CSV (max 15MB)</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {uploadSuccess ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-semibold text-stone-900">
                Resource Uploaded Successfully
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                <span className="font-semibold text-stone-800">{uploadSuccess.name}</span> ({formatBytes(uploadSuccess.size)}) is saved and ready for note synthesis.
              </p>

              <div className="flex items-center justify-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleClose();
                    setPreviewResource(uploadSuccess);
                  }}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
                >
                  Preview Document
                </button>
                <button
                  onClick={() => {
                    setUploadSuccess(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                    : selectedFile
                    ? 'border-emerald-400 bg-white'
                    : 'border-stone-300 bg-stone-50/60 hover:border-emerald-400 hover:bg-stone-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                  accept=".pdf,.md,.markdown,.txt,.rtf,.js,.ts,.py,.java,.cpp,.c,.html,.css,.json,.sql,.csv,.tsv,.doc,.docx,.png,.jpg,.jpeg"
                />

                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-3 py-2">
                    <File className="w-8 h-8 text-emerald-700" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-stone-900 truncate max-w-[240px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-stone-500">{formatBytes(selectedFile.size)}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-stone-800">
                      Drag & drop lecture notes or syllabus slides here
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      or click to browse from your device
                    </p>
                  </div>
                )}
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Subject Association */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Associate With Subject *
                </label>
                <select
                  value={targetSubjectId}
                  onChange={e => setTargetSubjectId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tags (comma separated, optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. midterm, lecture-slides, chapter-3"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedFile || isProcessing}
                  onClick={handleProcessUpload}
                  className="flex items-center space-x-1.5 px-5 py-2 text-xs font-medium text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors"
                >
                  {isProcessing ? <span>Validating & Storing...</span> : <span>Upload Resource</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
