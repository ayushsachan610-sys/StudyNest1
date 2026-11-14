import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  File,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  FolderPlus,
  FolderTree,
  HardDrive,
  Download,
  Info,
  Laptop,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import {
  validateStudyFile,
  readFileText,
  readFileDataUrl,
  formatBytes,
  detectResourceType,
} from '../../lib/fileValidation';
import { parsePptxFile } from '../../lib/pptxParser';
import { parseDocxFile } from '../../lib/docxParser';
import { downloadOriginalFile } from '../../lib/downloadHelper';
import { Resource, SlideData, AcademicTermId, ACADEMIC_TERMS } from '../../types';

export const UploadModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    subjects,
    selectedSubjectId,
    folders,
    selectedTermId,
    selectedFolderId,
    addResource,
    openStudyView,
    addSubject,
    setIsFolderModalOpen,
    setFolderModalMode,
    setParentFolderForNew,
  } = useStudyNest();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Term & Folder destination
  const [targetTermId, setTargetTermId] = useState<AcademicTermId>(
    selectedTermId || 'term-2'
  );
  const [targetFolderId, setTargetFolderId] = useState<string | null>(
    selectedFolderId || null
  );

  // Subject assignment
  const [targetSubjectId, setTargetSubjectId] = useState<string>(
    selectedSubjectId || subjects[0]?.id || ''
  );
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [isCreatingNewSubject, setIsCreatingNewSubject] = useState(false);
  const [tagsInput, setTagsInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<Resource | null>(null);
  const [extractedSlidesCount, setExtractedSlidesCount] = useState<number | null>(null);
  const [previewSupportInfo, setPreviewSupportInfo] = useState<{
    canPreview: boolean;
    reason?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (activeModal !== 'upload') return null;

  // Filter folders belonging to target term
  const termFolders = folders.filter(f => f.termId === targetTermId);
  const rootFolders = termFolders.filter(f => !f.parentId);
  const getSubfolders = (parentId: string) => termFolders.filter(f => f.parentId === parentId);

  const handleFileSelection = (file: File) => {
    setValidationError(null);
    setUploadSuccess(null);
    setExtractedSlidesCount(null);

    const validation = validateStudyFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file.');
      setSelectedFile(null);
      setPreviewSupportInfo(null);
      return;
    }

    setSelectedFile(file);
    setPreviewSupportInfo({
      canPreview: validation.canPreview,
      reason: validation.previewUnavailableReason,
    });
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

    let finalSubjectId = targetSubjectId;

    // Handle inline creation of new subject if requested
    if (isCreatingNewSubject) {
      if (!newSubjectName.trim()) {
        setValidationError('Please enter a name for the new subject.');
        return;
      }
      const createdSub = addSubject({
        name: newSubjectName.trim(),
        code: newSubjectName.trim().substring(0, 3).toUpperCase(),
        color: '#E11D48',
        icon: 'Sparkles',
        description: `Subject for ${newSubjectName.trim()} study materials`,
        targetHoursPerWeek: 4,
      });
      finalSubjectId = createdSub.id;
    }

    if (!finalSubjectId) {
      setValidationError('Please select or create a subject for this resource.');
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    try {
      const type = detectResourceType(selectedFile.name, selectedFile.type);
      const validation = validateStudyFile(selectedFile);
      let content = '';
      let slides: SlideData[] | undefined;
      let slideCount: number | undefined;
      let originalDataUrl: string | undefined;

      // Preserve raw data URL for original download (if file size < 25MB)
      if (selectedFile.size <= 25 * 1024 * 1024) {
        try {
          originalDataUrl = await readFileDataUrl(selectedFile);
        } catch (e) {
          console.warn('Could not read file as data URL:', e);
        }
      }

      // Extract slide text for PPTX using client-side JSZip DrawingML parser
      if (type === 'pptx') {
        try {
          const parsed = await parsePptxFile(selectedFile);
          slides = parsed.slides;
          slideCount = parsed.slideCount;
          content = parsed.fullText;
          setExtractedSlidesCount(parsed.slideCount);
        } catch (pptxErr) {
          console.warn('Could not extract PPTX slides:', pptxErr);
          content = `[Presentation: ${selectedFile.name}]\nSlide count extraction unavailable for this file format. You can study and create quizzes manually.`;
        }
      } else if (type === 'docx') {
        try {
          const docxText = await parseDocxFile(selectedFile);
          content = docxText || (await readFileText(selectedFile));
        } catch {
          content = await readFileText(selectedFile);
        }
      } else if (type === 'pdf') {
        content = `[PDF Document: "${selectedFile.name}"]\nUploaded: ${new Date().toLocaleString()}\nSize: ${formatBytes(selectedFile.size)}\n\nThis PDF is openable and readable in the in-app PDF Reader.`;
      } else {
        content = await readFileText(selectedFile);
      }

      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      const newRes = addResource({
        name: selectedFile.name,
        subjectId: finalSubjectId,
        termId: targetTermId,
        folderId: targetFolderId,
        size: selectedFile.size,
        type,
        status: 'ready',
        content,
        slides,
        slideCount: slideCount || (slides ? slides.length : undefined),
        originalDataUrl,
        tags,
        canPreview: validation.canPreview,
        previewUnavailableReason: validation.previewUnavailableReason,
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

  const handleOpenNewFolder = () => {
    setFolderModalMode('create');
    setParentFolderForNew(targetFolderId ? folders.find(f => f.id === targetFolderId) || null : null);
    setIsFolderModalOpen(true);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setValidationError(null);
    setUploadSuccess(null);
    setExtractedSlidesCount(null);
    setPreviewSupportInfo(null);
    setActiveModal('none');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Upload & Organize Study Materials
              </h3>
              <p className="text-xs text-stone-500">
                Place files into six terms and folders with in-app preview & download
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Success State */}
          {uploadSuccess ? (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Resource Uploaded Successfully!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  <strong className="text-stone-900 dark:text-stone-100">"{uploadSuccess.name}"</strong> has been saved in{' '}
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {ACADEMIC_TERMS.find(t => t.id === uploadSuccess.termId)?.name}
                  </span>
                  {uploadSuccess.folderId && (
                    <span> › {folders.find(f => f.id === uploadSuccess.folderId)?.name}</span>
                  )}
                  .
                </p>
                {extractedSlidesCount && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Extracted {extractedSlidesCount} slides ready for in-app reading & quiz drafting.
                  </p>
                )}
                {uploadSuccess.canPreview === false && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    ℹ In-app preview is unavailable for this format. You can download the original file to your laptop anytime.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {uploadSuccess.canPreview !== false && (
                  <button
                    onClick={() => {
                      handleClose();
                      openStudyView(uploadSuccess);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open in Study View</span>
                  </button>
                )}

                <button
                  onClick={() => downloadOriginalFile(uploadSuccess)}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Drop Zone */}
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                    : selectedFile
                    ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-stone-300 dark:border-stone-700 hover:border-rose-400 bg-white dark:bg-stone-900'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelection(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center space-y-2">
                    <File className="w-10 h-10 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-stone-500">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-500 underline">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <UploadCloud className="w-10 h-10 text-stone-400" />
                    <div>
                      <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                        Drop any study file here (or click to browse)
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Supports PPT/PPTX (slide text extracted), PDF, DOCX, Markdown, Text, Images & other files up to 50MB
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                      Browse Files
                    </span>
                  </div>
                )}
              </div>

              {/* Preview Support Badge Indicator */}
              {previewSupportInfo && (
                <div
                  className={`p-3 rounded-2xl border text-xs flex items-start space-x-2.5 ${
                    previewSupportInfo.canPreview
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {previewSupportInfo.canPreview ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">In-App Preview Supported:</strong> You will be able to read, study, navigate slides/pages, and generate quizzes directly in StudyNest.
                      </div>
                    </>
                  ) : (
                    <>
                      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Safe Storage & Download Only:</strong> {previewSupportInfo.reason || 'This format cannot be previewed in the browser, but it will be safely saved and available to download to your laptop anytime.'}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Term & Folder Destination Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Academic Term */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    1. Academic Term
                  </label>
                  <select
                    value={targetTermId}
                    onChange={e => {
                      setTargetTermId(e.target.value as AcademicTermId);
                      setTargetFolderId(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                  >
                    {ACADEMIC_TERMS.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.shortName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Folder & Subfolder */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      2. Folder / Subfolder
                    </label>
                    <button
                      type="button"
                      onClick={handleOpenNewFolder}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
                    >
                      + New Folder
                    </button>
                  </div>
                  <select
                    value={targetFolderId || ''}
                    onChange={e => setTargetFolderId(e.target.value ? e.target.value : null)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">(Root / Top Level of Term)</option>
                    {rootFolders.map(folder => {
                      const subs = getSubfolders(folder.id);
                      return (
                        <React.Fragment key={folder.id}>
                          <option value={folder.id}>📁 {folder.name}</option>
                          {subs.map(sub => (
                            <option key={sub.id} value={sub.id}>
                              &nbsp;&nbsp;&nbsp;&nbsp;↳ 📁 {sub.name}
                            </option>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Subject Selector & Organization */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Subject Association
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewSubject(!isCreatingNewSubject)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                  >
                    {isCreatingNewSubject ? 'Select Existing Subject' : '+ Create New Subject'}
                  </button>
                </div>

                {isCreatingNewSubject ? (
                  <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                    <label className="block text-[11px] font-bold text-stone-500 uppercase">
                      New Subject Name
                    </label>
                    <input
                      type="text"
                      value={newSubjectName}
                      onChange={e => setNewSubjectName(e.target.value)}
                      placeholder="e.g. Design Thinking & Innovation"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                ) : (
                  <select
                    value={targetSubjectId}
                    onChange={e => setTargetSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                )}

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Tags (Optional, comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    placeholder="e.g. presentation, capstone, exam-prep"
                    className="w-full px-3 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!uploadSuccess && (
          <div className="flex items-center justify-end space-x-2 px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessUpload}
              disabled={!selectedFile || isProcessing}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isProcessing ? (
                <span>Extracting & Processing...</span>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Save</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
