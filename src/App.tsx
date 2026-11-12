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

// Modals
import { UploadModal } from './components/resources/UploadModal';
import { SubjectModal } from './components/subjects/SubjectModal';
import { TaskModal } from './components/planner/TaskModal';
import { FocusTimerModal } from './components/focus/FocusTimerModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { FilePreviewModal } from './components/resources/FilePreviewModal';

const AppContent: React.FC = () => {
  const { activeTab, selectedSubjectId } = useStudyNest();

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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#121214] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors">
      {/* Top Banner for Demo State & Persistence */}
      <DemoModeBanner />

      {/* Main App Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E7E2DA] dark:border-stone-800 bg-[#F7F3EC]/70 dark:bg-[#161619]/70 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-semibold text-stone-800 dark:text-stone-200">StudyNest</span>
            <span>—</span>
            <span>Product Management 2 Assignment MVP</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-600 dark:text-stone-400">
            <span>Calm & supportive learning workspace</span>
            <span>•</span>
            <span>Client-side private persistence</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <UploadModal />
      <SubjectModal />
      <TaskModal />
      <FocusTimerModal />
      <SettingsModal />
      <FilePreviewModal />
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
