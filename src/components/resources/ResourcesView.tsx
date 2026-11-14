import React, { useState, useMemo } from 'react';
import {
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  Trash2,
  BookOpen,
  Sparkles,
  Layers,
  HardDrive,
  Calendar,
  Folder as FolderIcon,
  FolderPlus,
  FolderTree,
  Tag,
  CheckCircle,
  Play,
  Film,
  Plus,
  ExternalLink,
  Info,
  ChevronRight,
  ArrowLeft,
  MoveRight,
  Edit2,
  MoreVertical,
  Laptop,
  FileSpreadsheet,
  Archive,
  FileQuestion,
  Image as ImageIcon,
  Grid,
  List as ListIcon,
  CornerLeftUp,
} from 'lucide-react';
import { useStudyNest } from '../../context/StudyNestContext';
import { formatBytes } from '../../lib/fileValidation';
import { downloadOriginalFile } from '../../lib/downloadHelper';
import {
  Resource,
  ResourceType,
  VideoResource,
  AcademicTermId,
  ACADEMIC_TERMS,
  Folder as FolderType,
} from '../../types';
import { generateDraftQuestionsFromSlides } from '../../lib/quizGenerator';

export const ResourcesView: React.FC = () => {
  const {
    resources,
    videos,
    subjects,
    folders,
    deleteResource,
    updateResource,
    setActiveModal,
    openStudyView,
    openDraftQuizReview,
    setActiveVideo,
    setIsAddVideoModalOpen,
    deleteVideo,
    selectedTermId,
    setSelectedTermId,
    selectedFolderId,
    setSelectedFolderId,
    deleteFolder,
    setActiveMoveResource,
    setIsFolderModalOpen,
    setFolderModalMode,
    setEditingFolder,
    setParentFolderForNew,
    setUnsupportedPreviewResource,
  } = useStudyNest();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [folderMenuOpenId, setFolderMenuOpenId] = useState<string | null>(null);

  // Active Term & Current Folder
  const activeTerm = ACADEMIC_TERMS.find(t => t.id === selectedTermId) || ACADEMIC_TERMS[1];
  const currentFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) || null : null;

  // Build Breadcrumb hierarchy for current folder
  const breadcrumbTrail = useMemo(() => {
    const trail: FolderType[] = [];
    let curr = currentFolder;
    while (curr) {
      trail.unshift(curr);
      curr = curr.parentId ? folders.find(f => f.id === curr?.parentId) || null : null;
    }
    return trail;
  }, [currentFolder, folders]);

  // Subfolders in current view (matching active term and parentId)
  const currentSubfolders = useMemo(() => {
    return folders.filter(f => {
      const matchesTerm = f.termId === selectedTermId;
      const matchesParent = selectedFolderId ? f.parentId === selectedFolderId : !f.parentId;
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTerm && matchesParent && matchesSearch;
    });
  }, [folders, selectedTermId, selectedFolderId, searchQuery]);

  // Files in current view
  const currentFiles = useMemo(() => {
    return resources
      .filter(res => {
        // If searching across all files, relax term & folder match
        const isSearchingGlobal = searchQuery.trim().length > 2;

        const matchesTerm = isSearchingGlobal || res.termId === selectedTermId;
        const matchesFolder =
          isSearchingGlobal || (selectedFolderId ? res.folderId === selectedFolderId : !res.folderId);

        const matchesSearch =
          !searchQuery ||
          res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (res.content && res.content.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSubject =
          selectedSubjectFilter === 'all' || res.subjectId === selectedSubjectFilter;

        let matchesType = true;
        if (selectedTypeFilter === 'presentation') {
          matchesType = res.type === 'pptx' || res.type === 'ppt';
        } else if (selectedTypeFilter === 'document') {
          matchesType = ['pdf', 'docx', 'doc', 'txt', 'markdown'].includes(res.type);
        } else if (selectedTypeFilter === 'image') {
          matchesType = res.type === 'image';
        } else if (selectedTypeFilter === 'unsupported') {
          matchesType = res.canPreview === false;
        }

        return matchesTerm && matchesFolder && matchesSearch && matchesSubject && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date') return b.uploadedAt.localeCompare(a.uploadedAt);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'size') return b.size - a.size;
        return 0;
      });
  }, [resources, selectedTermId, selectedFolderId, searchQuery, selectedSubjectFilter, selectedTypeFilter, sortBy]);

  // Videos associated with active term/subject
  const filteredVideos = useMemo(() => {
    if (selectedTypeFilter !== 'all' && selectedTypeFilter !== 'video') return [];
    return videos.filter(v => {
      const matchesSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject =
        selectedSubjectFilter === 'all' || v.subjectId === selectedSubjectFilter;
      return matchesSearch && matchesSubject;
    });
  }, [videos, searchQuery, selectedSubjectFilter, selectedTypeFilter]);

  // Helper counts per Term
  const getTermStats = (termId: AcademicTermId) => {
    const termFiles = resources.filter(r => r.termId === termId);
    const termFold = folders.filter(f => f.termId === termId);
    return { filesCount: termFiles.length, foldersCount: termFold.length };
  };

  // Action Handlers
  const handleOpenFolder = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSearchQuery('');
  };

  const handleNavigateUp = () => {
    if (!currentFolder) return;
    setSelectedFolderId(currentFolder.parentId || null);
  };

  const handleCreateFolder = () => {
    setFolderModalMode('create');
    setParentFolderForNew(currentFolder || null);
    setIsFolderModalOpen(true);
  };

  const handleRenameFolder = (folder: FolderType, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolderMenuOpenId(null);
    setFolderModalMode('rename');
    setEditingFolder(folder);
    setIsFolderModalOpen(true);
  };

  const handleDeleteFolder = (folder: FolderType, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolderMenuOpenId(null);
    if (
      window.confirm(
        `Are you sure you want to delete folder "${folder.name}"? Any files inside will be safely moved to its parent folder so no files are lost.`
      )
    ) {
      deleteFolder(folder.id);
    }
  };

  const handleOpenFile = (res: Resource) => {
    if (res.canPreview === false) {
      setUnsupportedPreviewResource(res);
    } else {
      openStudyView(res);
    }
  };

  const handleDownload = (res: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    downloadOriginalFile(res);
  };

  const handleMoveFile = (res: Resource, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMoveResource(res);
  };

  const handleDeleteFile = (id: string, name: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Delete "${name}" from your LMS library?`)) {
      deleteResource(id);
    }
  };

  const getFileIcon = (res: Resource) => {
    if (res.type === 'pptx' || res.type === 'ppt') {
      return <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
    }
    if (res.type === 'pdf') {
      return <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />;
    }
    if (res.type === 'docx' || res.type === 'doc') {
      return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    if (res.type === 'image') {
      return <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
    if (res.type === 'spreadsheet' || res.name.endsWith('.xlsx') || res.name.endsWith('.xls')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (res.type === 'archive' || res.name.endsWith('.zip') || res.name.endsWith('.rar')) {
      return <Archive className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
    }
    return <FileText className="w-5 h-5 text-stone-600 dark:text-stone-400" />;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner / Academic Terms Switcher */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <Laptop className="w-4 h-4" />
              </span>
              <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                LMS File Explorer • Six Academic Terms
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Organized with folders and subfolders like on your laptop. Preview in-app or download original files anytime.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCreateFolder}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
            >
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              <span>{selectedFolderId ? '+ New Subfolder' : '+ New Folder'}</span>
            </button>

            <button
              onClick={() => setActiveModal('upload')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        {/* Six Terms Tabs */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ACADEMIC_TERMS.map(term => {
            const isSelected = selectedTermId === term.id;
            const stats = getTermStats(term.id);

            return (
              <button
                key={term.id}
                onClick={() => setSelectedTermId(term.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 shadow-xs ring-2 ring-rose-500/20'
                    : 'border-stone-200 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-black ${
                      isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    {term.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 text-stone-500 font-mono">
                    {stats.filesCount}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center space-x-1">
                  <span>{stats.foldersCount} folders</span>
                  <span>•</span>
                  <span>{stats.filesCount} files</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Explorer Controls & Breadcrumbs */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4 shadow-xs space-y-3">
        {/* Breadcrumb Trail (Laptop-style) */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-stone-600 dark:text-stone-400 overflow-x-auto py-1">
          {selectedFolderId && (
            <button
              onClick={handleNavigateUp}
              className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mr-1"
              title="Up one folder"
            >
              <CornerLeftUp className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setSelectedFolderId(null)}
            className={`hover:text-rose-600 transition-colors flex items-center space-x-1 ${
              !selectedFolderId ? 'font-black text-rose-600 dark:text-rose-400' : ''
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>{activeTerm.name} (Root)</span>
          </button>

          {breadcrumbTrail.map((folder, index) => {
            const isLast = index === breadcrumbTrail.length - 1;
            return (
              <React.Fragment key={folder.id}>
                <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`hover:text-rose-600 transition-colors truncate max-w-xs ${
                    isLast ? 'font-black text-rose-600 dark:text-rose-400' : ''
                  }`}
                >
                  {folder.name}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Toolbar: Search, Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search in ${currentFolder ? currentFolder.name : activeTerm.name}...`}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Subject Filter */}
            <select
              value={selectedSubjectFilter}
              onChange={e => setSelectedSubjectFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="all">All File Types</option>
              <option value="presentation">Presentations (.pptx/.ppt)</option>
              <option value="document">Documents (.pdf/.docx/.md)</option>
              <option value="image">Images</option>
              <option value="unsupported">Download Only</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'date' | 'name' | 'size')}
              className="px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-semibold text-stone-700 dark:text-stone-300"
            >
              <option value="date">Sort: Recent</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="size">Sort: Size</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center p-0.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Grid view"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="List / Table view"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Folders & Subfolders Section */}
      {currentSubfolders.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Folders & Subfolders ({currentSubfolders.length})
            </h3>
            <button
              onClick={handleCreateFolder}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600"
            >
              + Add Subfolder
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {currentSubfolders.map(folder => {
              const containedFiles = resources.filter(r => r.folderId === folder.id);
              const containedSubfolders = folders.filter(f => f.parentId === folder.id);

              return (
                <div
                  key={folder.id}
                  onClick={() => handleOpenFolder(folder.id)}
                  className="group relative p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-400 dark:hover:border-emerald-600 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-start justify-between"
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div
                      className="p-2.5 rounded-xl shrink-0 text-white shadow-xs"
                      style={{ backgroundColor: folder.color || '#10B981' }}
                    >
                      <FolderIcon className="w-5 h-5 fill-white/20" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {folder.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {containedFiles.length} {containedFiles.length === 1 ? 'file' : 'files'}
                        {containedSubfolders.length > 0 && ` • ${containedSubfolders.length} subfolders`}
                      </p>
                      {folder.description && (
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                          {folder.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for folder */}
                  <div
                    className="flex items-center space-x-1 shrink-0 ml-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={e => handleRenameFolder(folder, e)}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Rename folder"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={e => handleDeleteFolder(folder, e)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete folder (files preserved)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Files Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Files ({currentFiles.length})
          </h3>
          <span className="text-xs text-stone-500">
            {currentFiles.length} file{currentFiles.length === 1 ? '' : 's'} in{' '}
            {currentFolder ? currentFolder.name : `${activeTerm.name} (Root)`}
          </span>
        </div>

        {currentFiles.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-800 rounded-3xl space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                No files in this folder yet
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Upload PowerPoint, PDF, DOCX, or spreadsheets here, or move files into this folder.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('upload')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload to this folder</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View of Files */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFiles.map(res => {
              const sub = subjects.find(s => s.id === res.subjectId);
              const isPptx = res.type === 'pptx' || res.type === 'ppt';

              return (
                <div
                  key={res.id}
                  onClick={() => handleOpenFile(res)}
                  className="group p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xs hover:shadow-md hover:border-rose-400/60 transition-all flex flex-col justify-between cursor-pointer space-y-4"
                >
                  {/* File Top Info */}
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 shrink-0">
                        {getFileIcon(res)}
                      </div>

                      {/* Preview Support Badge */}
                      {res.canPreview !== false ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          ✓ In-App Preview
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          ⬇ Download Only
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {res.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-1">
                        <span>{formatBytes(res.size)}</span>
                        <span>•</span>
                        {res.slideCount ? (
                          <span>{res.slideCount} slides</span>
                        ) : (
                          <span>{res.type.toUpperCase()}</span>
                        )}
                        <span>•</span>
                        <span>{new Date(res.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Subject Pill */}
                    {sub && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold"
                        style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                      >
                        {sub.name} ({sub.code})
                      </span>
                    )}

                    {/* Tags */}
                    {res.tags && res.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {res.tags.slice(0, 3).map(t => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[10px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div
                    className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80 gap-1"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-1">
                      {res.canPreview !== false ? (
                        <button
                          onClick={() => handleOpenFile(res)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Study</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setUnsupportedPreviewResource(res)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Why Preview Unavailable</span>
                        </button>
                      )}

                      {/* Quiz Button for presentations */}
                      {isPptx && (
                        <button
                          onClick={() => {
                            if (res.slides && res.slides.length > 0) {
                              const questions = generateDraftQuestionsFromSlides(res.slides, res.name);
                              openDraftQuizReview({
                                id: `quiz-${Date.now()}`,
                                subjectId: res.subjectId,
                                resourceId: res.id,
                                title: `Quiz: ${res.name.replace(/\.[^/.]+$/, '')}`,
                                description: `Generated from ${res.slides.length} slides of ${res.name}.`,
                                questions,
                                createdAt: new Date().toISOString(),
                              });
                            }
                          }}
                          className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                          title="Generate Practice Quiz"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-1">
                      {/* Move to another Folder / Term */}
                      <button
                        onClick={e => handleMoveFile(res, e)}
                        className="p-1.5 text-stone-500 hover:text-indigo-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Move file to another folder or term"
                      >
                        <FolderTree className="w-4 h-4" />
                      </button>

                      {/* Download Original File */}
                      <button
                        onClick={e => handleDownload(res, e)}
                        className="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Download Original File to Laptop"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={e => handleDeleteFile(res.id, res.name, e)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View of Files */
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {currentFiles.map(res => {
                  const sub = subjects.find(s => s.id === res.subjectId);
                  return (
                    <tr
                      key={res.id}
                      onClick={() => handleOpenFile(res)}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                        {getFileIcon(res)}
                        <span className="truncate max-w-xs">{res.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        {sub && (
                          <span
                            className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold"
                            style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                          >
                            {sub.code}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-500">{formatBytes(res.size)}</td>
                      <td className="py-3 px-4">
                        {res.canPreview !== false ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            In-App Preview
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Download Only
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {new Date(res.uploadedAt).toLocaleDateString()}
                      </td>
                      <td
                        className="py-3 px-4 text-right space-x-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={e => handleMoveFile(res, e)}
                          className="p-1.5 text-stone-500 hover:text-indigo-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Move"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => handleDownload(res, e)}
                          className="p-1.5 text-stone-500 hover:text-emerald-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => handleDeleteFile(res.id, res.name, e)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Embedded Video Lectures Section */}
      {filteredVideos.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                YouTube Video Resources ({filteredVideos.length})
              </h3>
            </div>
            <button
              onClick={() => setIsAddVideoModalOpen(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600"
            >
              + Add YouTube Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(video => {
              const sub = subjects.find(s => s.id === video.subjectId);
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideo(video)}
                  className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-stone-900 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-stone-950/10 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2">
                      {video.title}
                    </h4>
                    {sub && (
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ backgroundColor: `${sub.color}15`, color: sub.color }}
                      >
                        {sub.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
