import React, { useState, useMemo } from 'react';
import {
  Upload,
  Search,
  Filter,
  FileText,
  FileCode,
  Download,
  Trash2,
  Eye,
  FileCheck2,
  HardDrive,
  Calendar,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';
import { ResourceType } from '../../types';

export const ResourcesView: React.FC = () => {
  const {
    resources,
    subjects,
    deleteResource,
    setActiveModal,
    setPreviewResource,
  } = useStudyNest();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  const filteredResources = useMemo(() => {
    return resources
      .filter(res => {
        const matchesSearch =
          res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSubject =
          selectedSubjectFilter === 'all' || res.subjectId === selectedSubjectFilter;

        const matchesType =
          selectedTypeFilter === 'all' || res.type === selectedTypeFilter;

        return matchesSearch && matchesSubject && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return b.uploadedAt.localeCompare(a.uploadedAt);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'size') {
          return b.size - a.size;
        }
        return 0;
      });
  }, [resources, searchQuery, selectedSubjectFilter, selectedTypeFilter, sortBy]);

  const handleDownload = (res: (typeof resources)[0]) => {
    const blob = new Blob([res.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from your resource library?`)) {
      deleteResource(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header and prominent Upload Callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Lecture slides, syllabus PDFs, readings, and datasets organized by subject
          </p>
        </div>

        <button
          onClick={() => setActiveModal('upload')}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files by name or tag (#sprint, #exam)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedSubjectFilter}
              onChange={e => setSelectedSubjectFilter(e.target.value)}
              className="text-xs px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-800 focus:outline-hidden"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={e => setSelectedTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-800 focus:outline-hidden w-full md:w-auto"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="markdown">Markdown (.md)</option>
            <option value="txt">Plain Text (.txt)</option>
            <option value="code">Code / Scripts</option>
            <option value="csv">CSV / Data</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'date' | 'name' | 'size')}
            className="text-xs px-3 py-2 bg-stone-50 border border-stone-200/80 rounded-xl text-stone-800 focus:outline-hidden w-full md:w-auto"
          >
            <option value="date">Sort: Newest First</option>
            <option value="name">Sort: Alphabetical</option>
            <option value="size">Sort: File Size</option>
          </select>
        </div>
      </div>

      {/* File List / Table */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300">
          <HardDrive className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-serif font-bold text-stone-800">No resources found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSubjectFilter !== 'all'
              ? 'No documents match your active search filters.'
              : 'Your library is empty. Upload syllabus slides or reading notes to get started.'}
          </p>
          <button
            onClick={() => setActiveModal('upload')}
            className="mt-4 px-4 py-2 bg-emerald-800 text-white text-xs font-medium rounded-xl shadow-xs"
          >
            Upload Study Document
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-card overflow-hidden">
          <div className="divide-y divide-stone-100">
            {filteredResources.map(res => {
              const subject = subjects.find(s => s.id === res.subjectId);
              return (
                <div
                  key={res.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/60 transition-colors"
                >
                  {/* File Info */}
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0 mt-0.5 sm:mt-0">
                      {res.type === 'code' ? (
                        <FileCode className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4
                          onClick={() => setPreviewResource(res)}
                          className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-emerald-800 cursor-pointer truncate max-w-md"
                        >
                          {res.name}
                        </h4>
                        <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded text-[10px] bg-stone-100 text-stone-600 font-medium uppercase">
                          <FileCheck2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Ready</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                        {subject && (
                          <span
                            className="font-medium px-1.5 py-0.5 rounded text-[10px]"
                            style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                          >
                            {subject.code}
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatBytes(res.size)}</span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {/* Tags */}
                      {res.tags && res.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {res.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setPreviewResource(res)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors"
                      title="Preview content inside StudyNest"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(res)}
                      className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Download file to device"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(res.id, res.name)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
