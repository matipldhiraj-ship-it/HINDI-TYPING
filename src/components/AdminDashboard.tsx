import React, { useMemo, useState } from 'react';
import {
  Users,
  Award,
  BookOpen,
  FileText,
  Keyboard,
  Sliders,
  Database,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Search,
  Check,
  X,
  TrendingUp,
  Clock,
  Shield,
} from 'lucide-react';
import {
  KEYBOARD_LAYOUT_LIST,
  KEYBOARD_LAYOUTS,
  runLayoutSelfTests,
} from '../engine/keyboardLayouts';
import { SCORING_FORMULA_DOCS } from '../engine/scoringEngine';
import { StorageService } from '../services/storageService';
import {
  BackspacePolicy,
  ExamPreset,
  KeyboardLayoutId,
  LessonItem,
  PracticePassage,
  ScoringFormulaType,
  TypingAttemptResult,
  UserAccount,
} from '../types/typing';

interface AdminDashboardProps {
  currentUser: UserAccount;
  lessons: LessonItem[];
  onUpdateLessons: (lessons: LessonItem[]) => void;
  passages: PracticePassage[];
  onUpdatePassages: (passages: PracticePassage[]) => void;
  examPresets: ExamPreset[];
  onUpdateExamPresets: (presets: ExamPreset[]) => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  lessons,
  onUpdateLessons,
  passages,
  onUpdatePassages,
  examPresets,
  onUpdateExamPresets,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'lessons' | 'passages' | 'layouts' | 'exams' | 'users' | 'backup'
  >('overview');

  // Overview stats
  const stats = useMemo(() => StorageService.getPlatformStats(), [lessons, passages, examPresets]);
  const allAttempts = useMemo(() => StorageService.getAllAttempts(), []);
  const allUsers = useMemo(() => StorageService.getUsers(), []);

  // Search & Filter States
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonStageFilter, setLessonStageFilter] = useState<number | 'all'>('all');
  const [passageSearch, setPassageSearch] = useState('');
  const [passageCategoryFilter, setPassageCategoryFilter] = useState<string>('all');

  // Edit / Create Modals State
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [isCreatingLesson, setIsCreatingLesson] = useState<boolean>(false);

  const [editingPassage, setEditingPassage] = useState<PracticePassage | null>(null);
  const [isCreatingPassage, setIsCreatingPassage] = useState<boolean>(false);

  const [editingExamPreset, setEditingExamPreset] = useState<ExamPreset | null>(null);
  const [isCreatingExamPreset, setIsCreatingExamPreset] = useState<boolean>(false);

  // Layout editor state
  const [selectedLayoutId, setSelectedLayoutId] = useState<KeyboardLayoutId>('inscript');
  const [layoutKeySearch, setLayoutKeySearch] = useState('');
  const selfTests = useMemo(() => runLayoutSelfTests(), []);

  // Notification message
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // LESSON CRUD
  const handleSaveLesson = (lesson: LessonItem) => {
    let updated: LessonItem[];
    if (lessons.some((l) => l.id === lesson.id)) {
      updated = lessons.map((l) => (l.id === lesson.id ? lesson : l));
      showFeedback(`Updated lesson: "${lesson.title}"`);
    } else {
      updated = [...lessons, lesson];
      showFeedback(`Created new lesson: "${lesson.title}"`);
    }
    onUpdateLessons(updated);
    StorageService.saveLessons(updated);
    setEditingLesson(null);
    setIsCreatingLesson(false);
  };

  const handleDeleteLesson = (id: string) => {
    if (lessons.length <= 1) {
      showFeedback('Cannot delete the last remaining lesson.', 'error');
      return;
    }
    const updated = lessons.filter((l) => l.id !== id);
    onUpdateLessons(updated);
    StorageService.saveLessons(updated);
    showFeedback('Lesson deleted.');
  };

  const handleDuplicateLesson = (l: LessonItem) => {
    const copy: LessonItem = {
      ...l,
      id: `lesson-${Date.now()}`,
      title: `${l.title} (Copy)`,
      hindiTitle: `${l.hindiTitle} (प्रतिलिपि)`,
      lessonNumber: lessons.length + 1,
    };
    const updated = [...lessons, copy];
    onUpdateLessons(updated);
    StorageService.saveLessons(updated);
    showFeedback(`Duplicated lesson to "${copy.title}"`);
  };

  // PASSAGE CRUD
  const handleSavePassage = (passage: PracticePassage) => {
    let updated: PracticePassage[];
    if (passages.some((p) => p.id === passage.id)) {
      updated = passages.map((p) => (p.id === passage.id ? passage : p));
      showFeedback(`Updated passage: "${passage.title}"`);
    } else {
      updated = [...passages, passage];
      showFeedback(`Added new passage: "${passage.title}"`);
    }
    onUpdatePassages(updated);
    StorageService.savePassages(updated);
    setEditingPassage(null);
    setIsCreatingPassage(false);
  };

  const handleDeletePassage = (id: string) => {
    if (passages.length <= 1) {
      showFeedback('Cannot delete the last remaining passage.', 'error');
      return;
    }
    const updated = passages.filter((p) => p.id !== id);
    onUpdatePassages(updated);
    StorageService.savePassages(updated);
    showFeedback('Passage deleted.');
  };

  // EXAM PRESET CRUD
  const handleSaveExamPreset = (preset: ExamPreset) => {
    let updated: ExamPreset[];
    if (examPresets.some((e) => e.id === preset.id)) {
      updated = examPresets.map((e) => (e.id === preset.id ? preset : e));
      showFeedback(`Updated exam preset: "${preset.name}"`);
    } else {
      updated = [...examPresets, preset];
      showFeedback(`Created new exam preset: "${preset.name}"`);
    }
    onUpdateExamPresets(updated);
    StorageService.saveExamPresets(updated);
    setEditingExamPreset(null);
    setIsCreatingExamPreset(false);
  };

  const handleDeleteExamPreset = (id: string) => {
    if (examPresets.length <= 1) {
      showFeedback('Cannot delete the last remaining exam preset.', 'error');
      return;
    }
    const updated = examPresets.filter((e) => e.id !== id);
    onUpdateExamPresets(updated);
    StorageService.saveExamPresets(updated);
    showFeedback('Exam preset deleted.');
  };

  // BACKUP & EXPORT
  const handleExportFullConfig = () => {
    const fullConfig = {
      exportTimestamp: new Date().toISOString(),
      platformVersion: '2.0.0-pro',
      users: StorageService.getUsers(),
      lessons,
      passages,
      examPresets,
      attempts: StorageService.getAllAttempts(),
    };
    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hindi-typing-master-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showFeedback('Platform configuration exported successfully.');
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.lessons) {
          onUpdateLessons(parsed.lessons);
          StorageService.saveLessons(parsed.lessons);
        }
        if (parsed.passages) {
          onUpdatePassages(parsed.passages);
          StorageService.savePassages(parsed.passages);
        }
        if (parsed.examPresets) {
          onUpdateExamPresets(parsed.examPresets);
          StorageService.saveExamPresets(parsed.examPresets);
        }
        showFeedback('Configuration imported and restored successfully!');
        onRefreshData();
      } catch {
        showFeedback('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (window.confirm('Reset all curriculum, passages, exam presets, and test logs to factory defaults?')) {
      StorageService.resetToFactoryDefaults();
      onRefreshData();
      showFeedback('Platform restored to factory defaults.');
    }
  };

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchStage = lessonStageFilter === 'all' || l.stageNumber === lessonStageFilter;
      const matchSearch =
        !lessonSearch ||
        l.title.toLowerCase().includes(lessonSearch.toLowerCase()) ||
        l.hindiTitle.includes(lessonSearch) ||
        l.targetText.includes(lessonSearch);
      return matchStage && matchSearch;
    });
  }, [lessons, lessonStageFilter, lessonSearch]);

  // Filtered Passages
  const filteredPassages = useMemo(() => {
    return passages.filter((p) => {
      const matchCat = passageCategoryFilter === 'all' || p.category === passageCategoryFilter;
      const matchSearch =
        !passageSearch ||
        p.title.toLowerCase().includes(passageSearch.toLowerCase()) ||
        p.text.includes(passageSearch);
      return matchCat && matchSearch;
    });
  }, [passages, passageCategoryFilter, passageSearch]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-purple-700 dark:text-purple-400">
              Administrative Control Center
            </span>
            <span aria-hidden="true">·</span>
            <span>Logged in as: {currentUser.name} ({currentUser.role.toUpperCase()})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Admin Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportFullConfig}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Config JSON</span>
          </button>
          <button
            type="button"
            onClick={handleFactoryReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Factory Reset</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border-red-200 text-red-800 dark:text-red-300'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button type="button" onClick={() => setFeedbackMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
          { id: 'lessons', label: `Lessons (${lessons.length})`, icon: BookOpen },
          { id: 'passages', label: `Passages (${passages.length})`, icon: FileText },
          { id: 'layouts', label: 'Layout Definitions', icon: Keyboard },
          { id: 'exams', label: `Exam Presets (${examPresets.length})`, icon: Sliders },
          { id: 'users', label: `Learners (${allUsers.length})`, icon: Users },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & USAGE METRICS
         ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Registered Users</div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900 dark:text-white mt-1">
                {stats.totalUsers}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Total Tests Taken</div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900 dark:text-white mt-1">
                {stats.totalAttempts}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Practice Hours</div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900 dark:text-white mt-1">
                {stats.totalPracticeHours}h
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Platform Avg WPM</div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900 dark:text-white mt-1">
                {stats.avgNetWpm}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Avg Accuracy</div>
              <div className="text-2xl font-bold font-mono-tabular text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.avgAccuracy}%
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs text-slate-500">Sessions Today</div>
              <div className="text-2xl font-bold font-mono-tabular text-sky-600 dark:text-sky-400 mt-1">
                {stats.testsToday}
              </div>
            </div>
          </div>

          {/* Layout Distribution Grid */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Keyboard Layout Popularity (Session Usage Across All Learners)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {KEYBOARD_LAYOUT_LIST.map((l) => {
                const count = stats.layoutCounts[l.id] || 0;
                const percent =
                  stats.totalAttempts > 0
                    ? Math.round((count / stats.totalAttempts) * 100)
                    : 0;
                return (
                  <div
                    key={l.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {l.shortName}
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-bold font-mono-tabular text-sky-600">
                        {count}
                      </span>
                      <span className="text-xs text-slate-500">{percent}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Global Submissions */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Learner Submissions & Skill Test Results
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">User ID</th>
                    <th className="py-2 px-3">Test / Lesson</th>
                    <th className="py-2 px-3">Layout</th>
                    <th className="py-2 px-3 text-right">Net WPM</th>
                    <th className="py-2 px-3 text-right">Accuracy</th>
                    <th className="py-2 px-3 text-right">Duration</th>
                    <th className="py-2 px-3 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {allAttempts
                    .slice()
                    .reverse()
                    .slice(0, 8)
                    .map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-2 px-3 font-mono-tabular text-slate-500">
                          {a.timestamp.slice(0, 16).replace('T', ' ')}
                        </td>
                        <td className="py-2 px-3 font-mono-tabular text-slate-600 dark:text-slate-400">
                          {a.userId}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                          {a.title}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                          {KEYBOARD_LAYOUTS[a.layoutId].shortName}
                        </td>
                        <td className="py-2 px-3 text-right font-mono-tabular font-bold text-slate-900 dark:text-white">
                          {a.netWpm}
                        </td>
                        <td className="py-2 px-3 text-right font-mono-tabular font-semibold text-emerald-600">
                          {a.accuracy}%
                        </td>
                        <td className="py-2 px-3 text-right font-mono-tabular text-slate-500">
                          {a.elapsedSeconds}s
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span
                            className={`font-semibold ${
                              a.passed
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600'
                            }`}
                          >
                            {a.passed ? '✓ Qualified' : '▲ Incomplete'}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: CURRICULUM & LESSON MANAGER
         ========================================================================= */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lessons..."
                  value={lessonSearch}
                  onChange={(e) => setLessonSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <select
                value={lessonStageFilter}
                onChange={(e) =>
                  setLessonStageFilter(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="all">All Stages (1–12)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s}>
                    Stage {s}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingLesson({
                  id: `lesson-${Date.now()}`,
                  stageNumber: 1,
                  stageTitle: 'Stage 1: Custom Keyboard Module',
                  lessonNumber: lessons.length + 1,
                  title: 'New Custom Lesson',
                  hindiTitle: 'नवीन अभ्यास पाठ',
                  objective: 'Practice rhythmic physical-key execution on target Devanagari tokens.',
                  focusKeys: ['Home Row'],
                  targetText: 'कमल कसरत कलम कर पर सरल सफल',
                  minAccuracy: 92,
                  minWpm: 15,
                  isTimed: false,
                  backspacePolicy: 'full',
                  category: 'words',
                });
                setIsCreatingLesson(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Lesson</span>
            </button>
          </div>

          {/* Lessons Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Lesson Title</th>
                  <th className="py-2.5 px-3">Hindi Subtitle</th>
                  <th className="py-2.5 px-3">Target Text Preview</th>
                  <th className="py-2.5 px-3 text-right">Min Acc</th>
                  <th className="py-2.5 px-3 text-right">Min WPM</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {filteredLessons.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-semibold text-sky-700 dark:text-sky-400">
                      Stage {l.stageNumber}.{l.lessonNumber}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {l.title}
                    </td>
                    <td className="py-2.5 px-3 font-hindi text-slate-600 dark:text-slate-300">
                      {l.hindiTitle}
                    </td>
                    <td className="py-2.5 px-3 font-hindi text-slate-500 truncate max-w-xs">
                      {l.targetText}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-tabular font-semibold">
                      {l.minAccuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono-tabular">
                      {l.minWpm > 0 ? `${l.minWpm} WPM` : 'Untimed'}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLesson(l);
                          setIsCreatingLesson(false);
                        }}
                        className="p-1 text-slate-500 hover:text-sky-600"
                        title="Edit Lesson"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateLesson(l)}
                        className="p-1 text-slate-500 hover:text-emerald-600"
                        title="Duplicate Lesson"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLesson(l.id)}
                        className="p-1 text-slate-500 hover:text-red-600"
                        title="Delete Lesson"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PRACTICE PASSAGE MANAGER
         ========================================================================= */}
      {activeTab === 'passages' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search passages..."
                  value={passageSearch}
                  onChange={(e) => setPassageSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <select
                value={passageCategoryFilter}
                onChange={(e) => setPassageCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="paragraphs">Paragraphs</option>
                <option value="editorial">Editorial</option>
                <option value="official-letter">Official Letter</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingPassage({
                  id: `pass-${Date.now()}`,
                  title: 'New Official Passage',
                  category: 'paragraphs',
                  difficulty: 'Intermediate',
                  wordCount: 50,
                  charCount: 300,
                  text: 'शासकीय कार्यों में पारदर्शिता और जनसामान्य की सुविधा के लिए पत्राचार सरल एवं स्पष्ट हिन्दी में किया जाना चाहिए।',
                  createdAt: new Date().toISOString(),
                });
                setIsCreatingPassage(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Passage</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPassages.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-sky-700 dark:text-sky-400 capitalize">
                      {p.category}
                    </span>
                    <span>
                      {p.wordCount} words · {p.charCount} chars · {p.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs font-hindi text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {p.text}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPassage(p);
                      setIsCreatingPassage(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Edit Passage
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePassage(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: KEYBOARD LAYOUT DEFINITIONS & VERIFICATION
         ========================================================================= */}
      {activeTab === 'layouts' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Keyboard Layout Definitions & Mapping Engine
              </h2>
              <p className="text-xs text-slate-500">
                Inspect physical key assignments, Shift-layer outputs, and automated Devanagari
                composition invariants.
              </p>
            </div>

            <select
              value={selectedLayoutId}
              onChange={(e) => setSelectedLayoutId(e.target.value as KeyboardLayoutId)}
              className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
            >
              {KEYBOARD_LAYOUT_LIST.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layout Specs Box */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  Layout ID: {KEYBOARD_LAYOUTS[selectedLayoutId].id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {KEYBOARD_LAYOUTS[selectedLayoutId].name}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                {KEYBOARD_LAYOUTS[selectedLayoutId].badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {KEYBOARD_LAYOUTS[selectedLayoutId].description}
            </p>
            <div className="text-xs text-slate-500">
              <strong>Architecture Note:</strong> {KEYBOARD_LAYOUTS[selectedLayoutId].architectureNote}
            </div>
          </div>

          {/* Automated Self-Test Diagnostics */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Engine Self-Test Diagnostics ({selfTests.filter((t) => t.passed).length}/{selfTests.length} Invariants Verified)
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ All Physical Key & Conjunct Tests Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="py-2 px-3">Layout</th>
                    <th className="py-2 px-3">Test Case</th>
                    <th className="py-2 px-3">Simulated Keystroke Sequence</th>
                    <th className="py-2 px-3">Expected Unicode</th>
                    <th className="py-2 px-3">Engine Output</th>
                    <th className="py-2 px-3 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {selfTests.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                        {KEYBOARD_LAYOUTS[t.layoutId].shortName}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300">{t.testName}</td>
                      <td className="py-2 px-3 font-mono-tabular text-slate-500">{t.keySequenceDescription}</td>
                      <td className="py-2 px-3 font-hindi font-bold text-sm text-slate-900 dark:text-white">{t.expectedUnicode}</td>
                      <td className="py-2 px-3 font-hindi font-bold text-sm text-emerald-600">{t.actualUnicode}</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-600">
                        {t.passed ? '✓ PASSED' : '✗ FAILED'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: EXAM PRESET CONFIGURATOR
         ========================================================================= */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Exam Simulator Practice Profiles
              </h2>
              <p className="text-xs text-slate-500">
                Configure exam duration, allowed layouts, Backspace restrictions, error penalty formulas, and speed benchmarks.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingExamPreset({
                  id: `exam-${Date.now()}`,
                  name: 'CISF / CRPF Head Constable (Ministerial)',
                  organization: 'Central Armed Police Forces (CAPF Practice Profile)',
                  allowedLayouts: ['inscript', 'remington-gail', 'krutidev-010'],
                  defaultLayout: 'remington-gail',
                  durationMinutes: 10,
                  minNetWpm: 30,
                  minAccuracy: 95,
                  maxAllowedErrorPercent: 5,
                  backspacePolicy: 'current-word',
                  scoringFormula: 'ssc-penalty',
                  formulaDescription: '5 strokes = 1 word. 10 minutes. Errors > 5% penalized.',
                  officialDisclaimer: 'Practice Preset: Configured per recent recruitment notification.',
                  passageId: passages[0]?.id || 'pass-para-1',
                  createdAt: new Date().toISOString(),
                });
                setIsCreatingExamPreset(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Exam Preset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examPresets.map((preset) => (
              <div
                key={preset.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                    {preset.organization}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {preset.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular text-slate-600 dark:text-slate-400 pt-1">
                    <div>Duration: <strong>{preset.durationMinutes} min</strong></div>
                    <div>Target: <strong>{preset.minNetWpm} Net WPM</strong></div>
                    <div>Min Acc: <strong>{preset.minAccuracy}%</strong></div>
                    <div>Backspace: <strong>{preset.backspacePolicy}</strong></div>
                  </div>
                  <div className="text-xs text-slate-500 pt-1">
                    <strong>Scoring Formula:</strong> {SCORING_FORMULA_DOCS[preset.scoringFormula].shortLabel}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed italic">
                    {preset.officialDisclaimer}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExamPreset(preset);
                      setIsCreatingExamPreset(false);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Edit Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExamPreset(preset.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                    title="Delete Preset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: LEARNERS & USAGE MONITORING
         ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Learners & Identity Directory ({allUsers.length})
            </h2>
            <p className="text-xs text-slate-500">
              Inspect individual learner practice volume, personal goal achievements, and account credentials.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 bg-slate-50/50 dark:bg-slate-800/40">
                  <th className="py-2.5 px-3">Name / Username</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Layout</th>
                  <th className="py-2.5 px-3">Target Exam</th>
                  <th className="py-2.5 px-3 text-right">Tests</th>
                  <th className="py-2.5 px-3 text-right">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {allUsers.map((u) => {
                  const userAttempts = allAttempts.filter((a) => a.userId === u.id);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono-tabular">@{u.username}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono-tabular text-slate-600 dark:text-slate-400">
                        {u.email}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {u.preferredLayout}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">
                        {u.targetExam || 'General'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-tabular font-bold">
                        {userAttempts.length}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono-tabular text-slate-500">
                        {u.lastLoginAt?.slice(0, 10) || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: BACKUP & DATA MIGRATION
         ========================================================================= */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Export Complete Platform Configuration
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Generate a portable JSON backup containing all 12 curriculum stages, custom passages, exam presets, user accounts, and test attempt logs.
            </p>
            <button
              type="button"
              onClick={handleExportFullConfig}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
            >
              <Download className="w-4 h-4" />
              <span>Download Platform Backup JSON</span>
            </button>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Import Platform Configuration JSON
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload an existing backup file to restore custom exam presets, institutional passages, or curriculum updates across browsers.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:bg-slate-100">
              <Upload className="w-4 h-4" />
              <span>Select Backup JSON File</span>
              <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT/CREATE LESSON MODAL
         ========================================================================= */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreatingLesson ? 'Create New Lesson' : 'Edit Lesson'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLesson(editingLesson);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Stage (1–12)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={editingLesson.stageNumber}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        stageNumber: Number(e.target.value),
                        stageTitle: `Stage ${e.target.value}: Progressive Curriculum`,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Lesson Number</label>
                  <input
                    type="number"
                    value={editingLesson.lessonNumber}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, lessonNumber: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Hindi Title</label>
                <input
                  type="text"
                  value={editingLesson.hindiTitle}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, hindiTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-hindi"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Objective</label>
                <input
                  type="text"
                  value={editingLesson.objective}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, objective: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Min Accuracy (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={editingLesson.minAccuracy}
                    onChange={(e) =>
                      setEditingLesson({
                        ...editingLesson,
                        minAccuracy: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Min Net WPM</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    value={editingLesson.minWpm}
                    onChange={(e) =>
                      setEditingLesson({ ...editingLesson, minWpm: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Target Devanagari Practice Text
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingLesson.targetText}
                  onChange={(e) =>
                    setEditingLesson({
                      ...editingLesson,
                      targetText: e.target.value.normalize('NFC'),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-hindi text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT/CREATE PASSAGE MODAL
         ========================================================================= */}
      {editingPassage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreatingPassage ? 'Add Practice Passage' : 'Edit Practice Passage'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPassage(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const clean = editingPassage.text.trim().normalize('NFC');
                handleSavePassage({
                  ...editingPassage,
                  text: clean,
                  wordCount: clean.split(/\s+/).length,
                  charCount: clean.length,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-600 mb-1">Passage Title</label>
                <input
                  type="text"
                  required
                  value={editingPassage.title}
                  onChange={(e) =>
                    setEditingPassage({ ...editingPassage, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Category</label>
                  <select
                    value={editingPassage.category}
                    onChange={(e) =>
                      setEditingPassage({
                        ...editingPassage,
                        category: e.target.value as PracticePassage['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="words">Words</option>
                    <option value="sentences">Sentences</option>
                    <option value="paragraphs">Paragraphs</option>
                    <option value="editorial">Editorial</option>
                    <option value="official-letter">Official Letter</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Difficulty</label>
                  <select
                    value={editingPassage.difficulty}
                    onChange={(e) =>
                      setEditingPassage({
                        ...editingPassage,
                        difficulty: e.target.value as PracticePassage['difficulty'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Exam-Grade">Exam-Grade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Devanagari Content
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingPassage.text}
                  onChange={(e) =>
                    setEditingPassage({ ...editingPassage, text: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-hindi text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPassage(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                >
                  Save Passage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          EDIT/CREATE EXAM PRESET MODAL
         ========================================================================= */}
      {editingExamPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isCreatingExamPreset ? 'Configure Exam Preset' : 'Edit Exam Preset'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingExamPreset(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveExamPreset(editingExamPreset);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-600 mb-1">Exam Preset Name</label>
                <input
                  type="text"
                  required
                  value={editingExamPreset.name}
                  onChange={(e) =>
                    setEditingExamPreset({ ...editingExamPreset, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Recruitment Organization / Board
                </label>
                <input
                  type="text"
                  required
                  value={editingExamPreset.organization}
                  onChange={(e) =>
                    setEditingExamPreset({
                      ...editingExamPreset,
                      organization: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={editingExamPreset.durationMinutes}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Default Layout</label>
                  <select
                    value={editingExamPreset.defaultLayout}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        defaultLayout: e.target.value as KeyboardLayoutId,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                  >
                    {KEYBOARD_LAYOUT_LIST.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.shortName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Passing Speed (Net WPM)</label>
                  <input
                    type="number"
                    min={5}
                    max={80}
                    value={editingExamPreset.minNetWpm}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        minNetWpm: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Passing Accuracy (%)</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={editingExamPreset.minAccuracy}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        minAccuracy: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Backspace Restriction</label>
                  <select
                    value={editingExamPreset.backspacePolicy}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        backspacePolicy: e.target.value as BackspacePolicy,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="full">Full Backspace</option>
                    <option value="current-word">Current Word Only</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-600 mb-1">Scoring Formula</label>
                  <select
                    value={editingExamPreset.scoringFormula}
                    onChange={(e) =>
                      setEditingExamPreset({
                        ...editingExamPreset,
                        scoringFormula: e.target.value as ScoringFormulaType,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="standard-5char">5-Stroke Word</option>
                    <option value="ssc-penalty">SSC Error Threshold</option>
                    <option value="cpct-net">CPCT Net WPM</option>
                    <option value="highcourt-word">Full/Half Mistake</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Official Notification Disclaimer / Instructions
                </label>
                <textarea
                  rows={3}
                  value={editingExamPreset.officialDisclaimer}
                  onChange={(e) =>
                    setEditingExamPreset({
                      ...editingExamPreset,
                      officialDisclaimer: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingExamPreset(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
                >
                  Save Exam Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
