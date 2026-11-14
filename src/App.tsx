import React from 'react';
import { StudyNestProvider, useStudyNest } from './context/StudyNestContext';
import { Navbar } from './components/layout/Navbar';
import { DemoModeBanner } from './components/layout/DemoModeBanner';
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SubjectDetailView } from './components/subjects/SubjectDetailView';
import { ResourcesView } from './components/resources/ResourcesView';
import { NotesView } from './components/notes/NotesView';
import { PlannerView } from './components/planner/PlannerView';
import { RevisionView } from './components/revision/RevisionView';

// Modals & Interactive Arenas
import { UploadModal } from './components/resources/UploadModal';
import { MoveFileModal } from './components/resources/MoveFileModal';
import { FolderModal } from './components/resources/FolderModal';
import { UnsupportedPreviewModal } from './components/resources/UnsupportedPreviewModal';
import { SubjectModal } from './components/subjects/SubjectModal';
import { TaskModal } from './components/planner/TaskModal';
import { FocusTimerModal } from './components/focus/FocusTimerModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { StudyViewModal } from './components/study/StudyViewModal';
import { TimedTestModal } from './components/quiz/TimedTestModal';
import { QuizDraftModal } from './components/quiz/QuizDraftModal';
import { VideoPlayerModal } from './components/video/VideoPlayerModal';
import { AddVideoModal } from './components/video/AddVideoModal';
import { StudyMascot } from './components/mascot/StudyMascot';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedSubjectId,
    visualTheme,
    mascotEnabled,
    mascotMood,
    mascotMessage,
    reducedMotion,
    activeVideo,
    setActiveVideo,
    isAddVideoModalOpen,
    setIsAddVideoModalOpen,
  } = useStudyNest();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return selectedSubjectId ? <SubjectDetailView /> : <SubjectsView />;
      case 'resources':
        return <ResourcesView />;
      case 'notes':
        return <NotesView />;
      case 'planner':
        return <PlannerView />;
      case 'review':
        return <RevisionView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121214] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900 transition-colors">
      {/* Top Banner for Initial PowerPoint & Storage */}
      <DemoModeBanner />

      {/* Main App Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-[#F7F3EC]/70 dark:bg-[#161619]/70 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-black text-rose-500">StudyNest LMS</span>
            <span>—</span>
            <span>Personal Learning Management System for One Learner</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-600 dark:text-stone-400">
            <span>Client-side persistent storage</span>
            <span>•</span>
            <span>Interactive Presentation & Timed Exam Engine</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Interactive Arenas */}
      <UploadModal />
      <MoveFileModal />
      <FolderModal />
      <UnsupportedPreviewModal />
      <SubjectModal />
      <TaskModal />
      <FocusTimerModal />
      <SettingsModal />
      <StudyViewModal />
      <TimedTestModal />
      <QuizDraftModal />
      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      <AddVideoModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
      />

      {/* Friendly Anime Study Companion Mascot (Kiko) */}
      <StudyMascot
        visualTheme={visualTheme}
        mascotEnabled={mascotEnabled}
        mood={mascotMood}
        customMessage={mascotMessage}
        reducedMotion={reducedMotion}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <StudyNestProvider>
      <AppContent />
    </StudyNestProvider>
  );
};

export default App;
