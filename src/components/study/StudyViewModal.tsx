import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Sparkles,
  BookOpen,
  Clock,
  Download,
  List,
  Layers,
  Search,
  CheckCircle,
  Tag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  AlertCircle,
  Info,
  ExternalLink,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { generateDraftQuestionsFromSlides, generateFlashcardsFromSlides } from '../../lib/quizGenerator';
import { formatBytes } from '../../lib/fileValidation';
import { downloadOriginalFile } from '../../lib/downloadHelper';

export const StudyViewModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    studyResource,
    setStudyResource,
    subjects,
    openDraftQuizReview,
    addDeck,
    addNote,
    startTimedTest,
    quizzes,
    visualTheme,
    triggerMascotReaction,
  } = useStudyNest();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'slides' | 'outline'>('slides');
  const [pdfViewTab, setPdfViewTab] = useState<'pdf' | 'notes'>('pdf');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 75%, 100%, 125%, 150%, 200%
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSlideIndex(0);
    setZoomLevel(100);
    setPdfViewTab('pdf');
  }, [studyResource]);

  // Keyboard navigation for presentation
  useEffect(() => {
    if (activeModal !== 'study_view' || !studyResource) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'Escape' && !isFullscreen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, studyResource, currentSlideIndex, isFullscreen]);

  if (activeModal !== 'study_view' || !studyResource) return null;

  const slides = studyResource.slides || [];
  const hasSlides = slides.length > 0;
  const currentSlide = hasSlides ? slides[currentSlideIndex] : null;
  const subject = subjects.find(s => s.id === studyResource.subjectId);
  const isImage = studyResource.type === 'image';
  const isPdf =
    studyResource.type === 'pdf' ||
    studyResource.name.toLowerCase().endsWith('.pdf') ||
    Boolean(studyResource.downloadUrl?.toLowerCase().endsWith('.pdf'));
  const isDoc = studyResource.type === 'docx' || studyResource.type === 'doc';

  const getPdfUrl = (): string => {
    if (studyResource.name.toLowerCase().includes('microeconomics')) {
      return '/Session1_Introduction_to_Microeconomics_Detailed.pdf';
    }
    if (studyResource.downloadUrl) {
      return studyResource.downloadUrl;
    }
    if (studyResource.originalDataUrl) {
      return studyResource.originalDataUrl;
    }
    return '';
  };

  const pdfUrl = isPdf ? getPdfUrl() : '';

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleClose = () => {
    setActiveModal('none');
    setStudyResource(null);
  };

  const goToNextSlide = () => {
    if (hasSlides && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (hasSlides && currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(75, prev - 25));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Draft Quiz Generation from Slides
  const handleDraftQuiz = () => {
    if (!hasSlides && !studyResource.content) {
      showToast('No slide or document text available to draft questions.');
      return;
    }

    const slidesToParse = hasSlides
      ? slides
      : [
          {
            slideNumber: 1,
            title: studyResource.name.replace(/\.[^/.]+$/, ''),
            paragraphs: studyResource.content.split('\n').filter(p => p.trim().length > 0),
            content: studyResource.content,
          },
        ];

    const generatedQuestions = generateDraftQuestionsFromSlides(slidesToParse, studyResource.name);
    const draftQuiz = {
      id: `quiz-draft-${Date.now()}`,
      subjectId: studyResource.subjectId,
      resourceId: studyResource.id,
      title: `Quiz: ${studyResource.name.replace(/\.[^/.]+$/, '')}`,
      description: `Drafted from ${slidesToParse.length} slides/sections of ${studyResource.name}. Review question sources and options before saving.`,
      questions: generatedQuestions,
      createdAt: new Date().toISOString(),
    };

    openDraftQuizReview(draftQuiz);
  };

  // Generate Flashcards from Slides
  const handleGenerateFlashcards = () => {
    if (!hasSlides && !studyResource.content) {
      showToast('No slide or document text available for flashcards.');
      return;
    }

    const slidesToParse = hasSlides
      ? slides
      : [
          {
            slideNumber: 1,
            title: studyResource.name.replace(/\.[^/.]+$/, ''),
            paragraphs: studyResource.content.split('\n').filter(p => p.trim().length > 0),
            content: studyResource.content,
          },
        ];

    const generatedCards = generateFlashcardsFromSlides(slidesToParse);
    if (generatedCards.length === 0) {
      showToast('Not enough bullet points to create flashcards.');
      return;
    }

    addDeck({
      subjectId: studyResource.subjectId,
      sourceResourceId: studyResource.id,
      title: `Flashcards: ${studyResource.name.replace(/\.[^/.]+$/, '')}`,
      description: `Key concepts & headings extracted from ${studyResource.name}.`,
      cards: generatedCards,
    });

    showToast(`Created flashcard deck with ${generatedCards.length} cards!`);
    triggerMascotReaction('celebrating', `Generated ${generatedCards.length} flashcards from "${studyResource.name}"!`);
  };

  const handleStartTimedTest = () => {
    const existingQuiz = quizzes.find(
      q => q.resourceId === studyResource.id || q.subjectId === studyResource.subjectId
    );
    if (existingQuiz) {
      startTimedTest(existingQuiz);
    } else {
      handleDraftQuiz();
    }
  };

  const handleCreateNoteFromSlide = () => {
    const slideInfo = currentSlide
      ? `## Slide ${currentSlide.slideNumber}: ${currentSlide.title}\n\n${currentSlide.content}`
      : studyResource.content;

    addNote({
      subjectId: studyResource.subjectId,
      resourceId: studyResource.id,
      title: `Notes on ${studyResource.name} (Slide ${currentSlide ? currentSlide.slideNumber : 1})`,
      content: slideInfo,
      tags: ['study-notes', studyResource.type],
    });

    showToast('Created study note in your Notes section!');
  };

  const handleDownload = () => {
    downloadOriginalFile(studyResource);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-6xl max-h-[94vh] rounded-3xl'
        } bg-[#FAF8F5] dark:bg-[#151518] border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden transition-all`}
      >
        {/* Toast Alert */}
        {feedbackToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Top Control Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md">
          {/* File Meta */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
                  {studyResource.name}
                </h2>
                {subject && (
                  <span
                    className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                  >
                    {subject.name}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
                <span className="uppercase font-semibold tracking-wider text-[10px] text-rose-500">
                  {studyResource.type.toUpperCase()}
                </span>
                <span>•</span>
                <span>{hasSlides ? `${slides.length} Slides` : formatBytes(studyResource.size)}</span>
                {hasSlides && viewMode === 'slides' && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      Slide {currentSlideIndex + 1} of {slides.length}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-0.5 border border-stone-200 dark:border-stone-700 text-xs">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-mono font-bold text-[11px] text-stone-700 dark:text-stone-300">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                title="Reset Zoom to 100%"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* View Mode Switcher for Presentations */}
            {hasSlides && !isPdf && (
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                <button
                  onClick={() => setViewMode('slides')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    viewMode === 'slides'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                  title="Slide-by-slide presentation view"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Slides</span>
                </button>
                <button
                  onClick={() => setViewMode('outline')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    viewMode === 'outline'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                  title="Full document text outline"
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Outline</span>
                </button>
              </div>
            )}

            {/* View Mode Switcher for PDF */}
            {isPdf && (
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs">
                <button
                  onClick={() => setPdfViewTab('pdf')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${
                    pdfViewTab === 'pdf'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                  title="Embedded PDF Document Reader"
                >
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>PDF Document</span>
                </button>
                <button
                  onClick={() => setPdfViewTab('notes')}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-bold transition-all ${
                    pdfViewTab === 'notes'
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                  title="Structured study notes & outline"
                >
                  <List className="w-3.5 h-3.5 text-rose-500" />
                  <span>Study Notes</span>
                </button>
              </div>
            )}

            {/* Direct Open in New Tab for PDF */}
            {isPdf && pdfUrl && (
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors"
                title="Open PDF in a dedicated browser tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Full Tab</span>
              </button>
            )}

            {/* Draft Quiz Action */}
            <button
              onClick={handleDraftQuiz}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200 dark:border-purple-800 transition-colors"
              title="Draft editable questions from this content"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Draft Quiz</span>
            </button>

            {/* Flashcards Action */}
            <button
              onClick={handleGenerateFlashcards}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-colors"
              title="Generate flashcards from headings & key terms"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flashcards</span>
            </button>

            {/* Timed Test Action */}
            <button
              onClick={handleStartTimedTest}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Start timed test on this content"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Timed Test</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
              aria-label="Close study view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Supported Formats Info Strip */}
        <div className="px-6 py-1.5 bg-stone-100/70 dark:bg-stone-800/40 border-b border-stone-200/60 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-3 h-3 text-rose-500 shrink-0" />
            <span>
              Supported in-app formats: <strong>PPTX, PPT, PDF, DOCX, TXT, MD, PNG, JPG, SVG, CSV</strong>. Text and slides are extracted client-side for zero-privacy leaks.
            </span>
          </div>

          <button onClick={handleDownload} className="text-rose-500 hover:underline font-semibold shrink-0">
            Download File
          </button>
        </div>

        {/* Study Content Arena */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* BRANCH 0: PREVIEW UNAVAILABLE FOR THIS FORMAT */}
          {studyResource.canPreview === false ? (
            <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-center space-y-6">
              <div className="p-4 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>

              <div className="max-w-md space-y-2">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  In-App Preview Unavailable
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {studyResource.name}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {studyResource.previewUnavailableReason ||
                    'This file type requires desktop-native software (such as Microsoft Excel, 7-Zip, or an OS application) to open and edit.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-sm text-xs text-stone-500 space-y-2">
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ✓ Your original file is safely stored
                </p>
                <p>
                  You can download the original file to your laptop at any time to open, calculate, and modify it.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original ({formatBytes(studyResource.size)})</span>
                </button>
              </div>
            </div>
          ) : isImage ? (
            <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center bg-stone-950/90">
              <div
                className="transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel / 100})` }}
              >
                <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 max-w-2xl text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      {studyResource.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Image study asset • {formatBytes(studyResource.size)}
                    </p>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto whitespace-pre-wrap leading-relaxed">
                    {studyResource.content || 'Image resource loaded in library.'}
                  </p>
                </div>
              </div>
            </div>
          ) : isPdf && pdfViewTab === 'pdf' ? (
            /* BRANCH 1.5: EMBEDDED NATIVE PDF READER */
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-900 relative">
              <div className="px-4 py-2 bg-stone-800 text-stone-300 text-xs flex items-center justify-between border-b border-stone-700">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[10px]">
                    PDF
                  </span>
                  <span className="font-semibold text-stone-200 truncate max-w-sm">
                    {studyResource.name}
                  </span>
                  <span className="text-stone-400">({formatBytes(studyResource.size)})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-stone-700 hover:bg-stone-600 text-white text-xs font-semibold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Dedicated Tab</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Original PDF</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full h-full min-h-[580px] bg-stone-900 relative">
                <object
                  data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  type="application/pdf"
                  className="w-full h-full min-h-[580px] border-0"
                >
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                    className="w-full h-full min-h-[580px] border-0"
                    title={studyResource.name}
                  >
                    <div className="p-8 text-center text-stone-300 space-y-3">
                      <p>Your browser could not embed this PDF directly.</p>
                      <button
                        onClick={() => window.open(pdfUrl, '_blank')}
                        className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold"
                      >
                        Open PDF in Dedicated Tab
                      </button>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          ) : viewMode === 'slides' && hasSlides ? (
            /* BRANCH 2: SLIDE PRESENTATION VIEWER */
            <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-8 bg-[#FAF8F5] dark:bg-[#121214]">
              {/* Slide Card Presentation Stage */}
              <div className="flex-1 flex items-center justify-center overflow-y-auto">
                <div
                  className={`w-full max-w-4xl min-h-[380px] sm:min-h-[460px] p-6 sm:p-10 rounded-3xl bg-white dark:bg-stone-900 border-2 transition-transform duration-150 ${
                    visualTheme === 'anime'
                      ? 'border-rose-200 dark:border-rose-900/60 shadow-xl'
                      : 'border-stone-200 dark:border-stone-800 shadow-md'
                  } flex flex-col justify-between`}
                  style={{ zoom: `${zoomLevel}%` }}
                >
                  {/* Slide Header */}
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black text-xs tracking-wider uppercase">
                        Slide {currentSlide?.slideNumber} / {slides.length}
                      </span>
                      <span className="text-xs font-medium text-stone-400">
                        Use ← → Arrow Keys or Space to Navigate
                      </span>
                    </div>

                    <h1 className="font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug mb-6 text-xl sm:text-2xl">
                      {currentSlide?.title}
                    </h1>

                    {/* Bullet Points / Paragraphs */}
                    <div className="space-y-3">
                      {currentSlide?.paragraphs && currentSlide.paragraphs.length > 1 ? (
                        currentSlide.paragraphs.slice(1).map((para, idx) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-3 p-3.5 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-800 text-sm leading-relaxed text-stone-700 dark:text-stone-200"
                          >
                            <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                            <p className="flex-1 whitespace-pre-wrap">{para}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-600 dark:text-stone-400 text-sm whitespace-pre-wrap leading-relaxed">
                          {currentSlide?.content}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Slide Footer */}
                  <div className="pt-6 mt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCreateNoteFromSlide}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium transition-colors"
                      >
                        📝 Pin as Note
                      </button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <span>Source:</span>
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        {studyResource.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Bar & Thumbnail Strip */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Prev / Next Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPrevSlide}
                    disabled={currentSlideIndex === 0}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={goToNextSlide}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail Rail */}
                <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full py-1">
                  {slides.map((s, idx) => (
                    <button
                      key={s.slideNumber}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        currentSlideIndex === idx
                          ? 'bg-rose-500 text-white shadow-xs scale-105'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {s.slideNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* BRANCH 3: DOCUMENT / OUTLINE READER (PDF, DOCX, TXT, MD) */
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FAF8F5] dark:bg-[#121214] space-y-6">
              <div
                className="max-w-4xl mx-auto space-y-6 transition-all"
                style={{ zoom: `${zoomLevel}%` }}
              >
                {/* Search in text */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search terms or phrases within this document..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {hasSlides ? (
                  slides
                    .filter(
                      s =>
                        !searchQuery ||
                        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.content.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(slide => (
                      <div
                        key={slide.slideNumber}
                        className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                            Slide {slide.slideNumber}: {slide.title}
                          </h3>
                          <button
                            onClick={() => {
                              setCurrentSlideIndex(slide.slideNumber - 1);
                              setViewMode('slides');
                            }}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600"
                          >
                            Open Slide View →
                          </button>
                        </div>
                        <div className="space-y-2 text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
                          {slide.paragraphs.slice(1).map((p, pIdx) => (
                            <p key={pIdx} className="pl-3 border-l-2 border-rose-300 dark:border-rose-800">
                              {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans whitespace-pre-wrap shadow-xs">
                    {studyResource.content || (
                      <div className="text-center py-8 space-y-3">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                        <h4 className="font-bold text-stone-800 dark:text-stone-200">
                          Preview Text Unavailable
                        </h4>
                        <p className="text-xs text-stone-500 max-w-sm mx-auto">
                          This format does not have extracted text. You can still download the original file or draft quiz questions manually.
                        </p>
                        <button
                          onClick={handleDownload}
                          className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold"
                        >
                          Download {studyResource.name}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
