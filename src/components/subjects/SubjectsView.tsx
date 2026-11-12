import React, { useState } from 'react';
import { Plus, Search, FolderGit2, BookOpen, Clock, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    setSelectedSubjectId,
    setActiveModal,
    notes,
    resources,
    tasks,
    deleteSubject,
  } = useStudyNest();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = subjects.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the "${name}" subject notebook? Linked notes and tasks will remain accessible in general library.`)) {
      deleteSubject(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            My Subjects & Notebooks
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Dedicated learning workspaces for each of your semester courses
          </p>
        </div>

        <button
          onClick={() => setActiveModal('new_subject')}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by subject name or code..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-stone-200/90 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Grid of Subject Cards */}
      {filteredSubjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
          <FolderGit2 className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-stone-800">No subjects found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'No subjects matched your search term.' : 'Get started by creating your first subject notebook.'}
          </p>
          <button
            onClick={() => setActiveModal('new_subject')}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-xl shadow-xs"
          >
            Create Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => {
            const subjectNotes = notes.filter(n => n.subjectId === subject.id);
            const subjectResources = resources.filter(r => r.subjectId === subject.id);
            const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
            const completedTasks = subjectTasks.filter(t => t.completed);

            return (
              <div
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className="group bg-white rounded-3xl p-6 border border-stone-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top code badge & delete */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-2.5 py-1 rounded-lg font-bold text-xs tracking-wider"
                      style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                    >
                      {subject.code}
                    </span>

                    <button
                      onClick={e => handleDelete(subject.id, subject.name, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-all"
                      title="Delete subject workspace"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                    {subject.description}
                  </p>

                  {/* Subject Materials Summary */}
                  <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-stone-100 text-center">
                    <div>
                      <span className="block text-xs font-bold text-stone-800">{subjectNotes.length}</span>
                      <span className="text-[10px] text-stone-400 flex items-center justify-center space-x-1 mt-0.5">
                        <FileText className="w-2.5 h-2.5" />
                        <span>Notes</span>
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-800">{subjectResources.length}</span>
                      <span className="text-[10px] text-stone-400 flex items-center justify-center space-x-1 mt-0.5">
                        <BookOpen className="w-2.5 h-2.5" />
                        <span>Files</span>
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-stone-800">
                        {completedTasks.length}/{subjectTasks.length}
                      </span>
                      <span className="text-[10px] text-stone-400 flex items-center justify-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Tasks</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer progress bar & open link */}
                <div className="mt-5 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1.5">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{subject.completedHoursThisWeek} / {subject.targetHoursPerWeek} hrs</span>
                    </span>
                    <span className="font-semibold text-emerald-800 group-hover:translate-x-0.5 transition-transform">
                      Open Notebook &rarr;
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: subject.color,
                        width: `${Math.min(100, (subject.completedHoursThisWeek / subject.targetHoursPerWeek) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
