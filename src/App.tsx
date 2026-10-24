import React, { useEffect, useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  GraduationCap,
  HelpCircle,
  Keyboard,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Play,
  RotateCcw,
  Shield,
  Sliders,
  Sparkles,
  Sun,
  User,
  Volume2,
  VolumeX,
  X,
  Zap,
} from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import {
  CurriculumView,
  ExamSimulatorView,
  KeyboardGuideView,
  LandingView,
  LearnerDashboardView,
  LayoutsView,
  MatraStudioView,
  MistypedWordsView,
  PassagePracticeView,
  ProgressView,
  ResultsView,
  TimedTestView,
} from './components/AllViews';
import { AuthModal } from './components/AuthModal';
import { InAppReminderBanner, NotificationCenter } from './components/NotificationCenter';
import { TypingWorkspace } from './components/TypingWorkspace';
import { MATRA_CONJUNCT_DRILLS } from './data/curriculumData';
import { KEYBOARD_LAYOUT_LIST, KEYBOARD_LAYOUTS } from './engine/keyboardLayouts';
import { soundEngine } from './engine/soundEngine';
import { NotificationService } from './services/notificationService';
import { StorageService } from './services/storageService';
import {
  BackspacePolicy,
  ExamPreset,
  KeyboardLayoutId,
  LessonItem,
  PracticePassage,
  ScoringFormulaType,
  ScreenId,
  TypingAttemptResult,
  UserAccount,
} from './types/typing';

interface ActiveWorkspaceSession {
  mode: TypingAttemptResult['mode'];
  referenceId: string;
  title: string;
  subtitle?: string;
  objective?: string;
  targetText: string;
  isTimed: boolean;
  durationSeconds?: number;
  minAccuracyTarget?: number;
  minWpmTarget?: number;
  backspacePolicy?: BackspacePolicy;
  scoringFormula?: ScoringFormulaType;
  examPreset?: ExamPreset;
}

export default function App() {
  // Initialize persistence on mount
  useEffect(() => {
    StorageService.init();
  }, []);

  // Global State
  const [currentUser, setCurrentUser] = useState<UserAccount>(() =>
    StorageService.getCurrentUser()
  );
  const [activeLayoutId, setActiveLayoutId] = useState<KeyboardLayoutId>(
    () => currentUser.preferredLayout || 'inscript'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    () => currentUser.soundEnabled ?? true
  );
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState<boolean>(
    () => currentUser.showVirtualKeyboard ?? true
  );
  const [showFingerGuide, setShowFingerGuide] = useState<boolean>(
    () => currentUser.showFingerGuide ?? true
  );

  // Data Collections
  const [lessons, setLessons] = useState<LessonItem[]>(() =>
    StorageService.getLessons()
  );
  const [passages, setPassages] = useState<PracticePassage[]>(() =>
    StorageService.getPassages()
  );
  const [examPresets, setExamPresets] = useState<ExamPreset[]>(() =>
    StorageService.getExamPresets()
  );
  const [attempts, setAttempts] = useState<TypingAttemptResult[]>(() =>
    StorageService.getAllAttempts()
  );

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspaceSession | null>(
    null
  );
  const [lastResult, setLastResult] = useState<TypingAttemptResult | null>(null);

  // Modals & UI Toggles
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [snoozeTrigger, setSnoozeTrigger] = useState(0);

  // Theme State with instant HTML class synchronization & persistence
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hmp_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('hmp_theme_mode', theme);
    } catch {
      // Local storage unavailable
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Daily Goal & Notification Computation
  const goalStatus = NotificationService.getDailyGoalStatus(
    currentUser.id,
    currentUser.dailyGoalMinutes,
    attempts
  );
  const notifications = NotificationService.getNotifications(currentUser);
  const hasUnreadReminders =
    !goalStatus.isCompleted && currentUser.remindersEnabled !== false;

  // Keep soundEngine in sync with user state
  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Sync user updates to storage
  const handleUserChanged = (newUser: UserAccount) => {
    setCurrentUser(newUser);
    setActiveLayoutId(newUser.preferredLayout);
    setSoundEnabled(newUser.soundEnabled);
    setShowVirtualKeyboard(newUser.showVirtualKeyboard);
    setShowFingerGuide(newUser.showFingerGuide);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setEnabled(next);
    if (currentUser.id !== 'user-guest') {
      StorageService.updateUserProfile(currentUser.id, { soundEnabled: next });
    }
  };

  const handleToggleVirtualKeyboard = () => {
    const next = !showVirtualKeyboard;
    setShowVirtualKeyboard(next);
    if (currentUser.id !== 'user-guest') {
      StorageService.updateUserProfile(currentUser.id, { showVirtualKeyboard: next });
    }
  };

  const handleToggleFingerGuide = () => {
    const next = !showFingerGuide;
    setShowFingerGuide(next);
    if (currentUser.id !== 'user-guest') {
      StorageService.updateUserProfile(currentUser.id, { showFingerGuide: next });
    }
  };

  const handleSelectLayout = (layoutId: KeyboardLayoutId) => {
    setActiveLayoutId(layoutId);
    if (currentUser.id !== 'user-guest') {
      StorageService.updateUserProfile(currentUser.id, { preferredLayout: layoutId });
    }
  };

  // Launchers for Interactive Workspace
  const handleStartLesson = (lesson: LessonItem) => {
    // Choose layout-specific target text if defined
    const target =
      lesson.layoutTargetText?.[activeLayoutId] || lesson.targetText;

    setActiveWorkspace({
      mode: 'lesson',
      referenceId: lesson.id,
      title: `${lesson.stageTitle}: ${lesson.title}`,
      subtitle: lesson.hindiTitle,
      objective: lesson.objective,
      targetText: target,
      isTimed: lesson.isTimed,
      durationSeconds: lesson.durationSeconds,
      minAccuracyTarget: lesson.minAccuracy,
      minWpmTarget: lesson.minWpm,
      backspacePolicy: lesson.backspacePolicy,
      scoringFormula: 'standard-5char',
    });
    setCurrentScreen('lesson');
  };

  const handleStartMatraDrill = (drill: (typeof MATRA_CONJUNCT_DRILLS)[0]) => {
    setActiveWorkspace({
      mode: 'matra-drill',
      referenceId: drill.id,
      title: drill.title,
      subtitle: drill.hindiTitle,
      objective: drill.description,
      targetText: drill.practiceText,
      isTimed: false,
      backspacePolicy: 'full',
      scoringFormula: 'standard-5char',
    });
    setCurrentScreen('lesson');
  };

  const handleStartPassage = (passage: PracticePassage) => {
    setActiveWorkspace({
      mode: passage.category === 'words' ? 'word-sentence' : 'paragraph',
      referenceId: passage.id,
      title: passage.title,
      subtitle: `${passage.category.toUpperCase()} • ${passage.difficulty}`,
      targetText: passage.text,
      isTimed: false,
      backspacePolicy: 'full',
      scoringFormula: 'standard-5char',
    });
    setCurrentScreen('lesson');
  };

  const handleStartTimedTest = (durationMinutes: number, passage: PracticePassage) => {
    setActiveWorkspace({
      mode: 'timed-test',
      referenceId: passage.id,
      title: `${passage.title} (${durationMinutes}-Min Speed Test)`,
      subtitle: `Target: Speed assessment under ${durationMinutes}m time limit`,
      targetText: passage.text,
      isTimed: true,
      durationSeconds: durationMinutes * 60,
      backspacePolicy: 'full',
      scoringFormula: 'standard-5char',
    });
    setCurrentScreen('lesson');
  };

  const handleStartExamPreset = (preset: ExamPreset) => {
    // Find passage
    const passage =
      passages.find((p) => p.id === preset.passageId) || passages[0];
    const textToType = preset.customPassageText || passage?.text || 'हिंदी टाइपिंग परीक्षा';

    setActiveWorkspace({
      mode: 'exam-simulator',
      referenceId: preset.id,
      title: `${preset.organization} - ${preset.name}`,
      subtitle: `Official Simulation • ${preset.durationMinutes} Min • ${preset.scoringFormula.toUpperCase()} Formula`,
      objective: preset.formulaDescription,
      targetText: textToType,
      isTimed: true,
      durationSeconds: preset.durationMinutes * 60,
      minAccuracyTarget: preset.minAccuracy,
      minWpmTarget: preset.minNetWpm,
      backspacePolicy: preset.backspacePolicy,
      scoringFormula: preset.scoringFormula,
      examPreset: preset,
    });
    setCurrentScreen('lesson');
  };

  const handleStartWeakWordDrill = (words: string[]) => {
    const text = words.map((w) => `${w} ${w} ${w}`).join(' ');
    setActiveWorkspace({
      mode: 'mistyped-drill',
      referenceId: `weak-words-${Date.now()}`,
      title: 'Targeted Weak Word Rehabilitation',
      subtitle: 'Type each problematic word carefully to eliminate muscle-memory errors',
      targetText: text,
      isTimed: false,
      backspacePolicy: 'full',
      scoringFormula: 'standard-5char',
    });
    setCurrentScreen('lesson');
  };

  // Typing session completion handler
  const handleWorkspaceComplete = (result: TypingAttemptResult) => {
    // Persist attempt
    StorageService.saveAttempt(result);

    // If lesson mode and passed, mark completed
    if (result.mode === 'lesson' && result.passed) {
      StorageService.markLessonCompleted(result.userId, result.referenceId);
    }

    // Persist mistyped words
    if (result.mistypedWords && result.mistypedWords.length > 0) {
      StorageService.addMistypedWords(
        result.userId,
        result.mistypedWords.map((mw) => mw.expected),
        result.layoutId
      );
    }

    // Refresh attempts
    setAttempts(StorageService.getAllAttempts());
    setLastResult(result);
    setCurrentScreen('results');
  };

  // Nav items list
  const navItems: Array<{ id: ScreenId; label: string; icon: React.ReactNode }> = [
    { id: 'landing', label: 'Home', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'curriculum', label: '12-Stage Lessons', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'layouts', label: 'Keyboard Layouts', icon: <Keyboard className="h-4 w-4" /> },
    { id: 'keyboard-guide', label: 'Finger Guide', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'matra-conjunct', label: 'Matra Studio', icon: <Layers className="h-4 w-4" /> },
    { id: 'words-sentences', label: 'Passages', icon: <Clock className="h-4 w-4" /> },
    { id: 'timed-test', label: 'Speed Test', icon: <Zap className="h-4 w-4" /> },
    { id: 'mistyped-words', label: 'Mistyped Words', icon: <RotateCcw className="h-4 w-4" /> },
    { id: 'progress', label: 'Progress & Charts', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'exam-simulator', label: 'Exam Simulator', icon: <Award className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div
              onClick={() => setCurrentScreen('landing')}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white shadow-md shadow-sky-600/20">
                <span className="font-hindi text-xl font-bold">क</span>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Hindi Typing Master
                </span>
                <span className="ml-1.5 rounded bg-sky-100 dark:bg-sky-950/80 px-1.5 py-0.2 text-[10px] font-bold text-sky-800 dark:text-sky-300">
                  PRO
                </span>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Devanagari Unicode &amp; Kruti Dev 010
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Layout Badge, Sound, Bell, & Theme Switcher */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs">
              <Keyboard className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-slate-500 dark:text-slate-400">Layout:</span>
              <select
                value={activeLayoutId}
                onChange={(e) => handleSelectLayout(e.target.value as KeyboardLayoutId)}
                aria-label="Select Keyboard Layout"
                className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {KEYBOARD_LAYOUT_LIST.map((l) => (
                  <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {l.shortName} ({l.badgeText})
                  </option>
                ))}
              </select>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundEnabled ? 'Mute Mechanical Keystroke Sound' : 'Enable Mechanical Keystroke Sound'}
              aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              ) : (
                <VolumeX className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              )}
            </button>

            {/* Daily Practice Reminders Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
                title="Daily Practice Reminders & Alerts"
                aria-label="Daily Practice Reminders"
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <Bell className="h-4 w-4" />
                {hasUnreadReminders && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                    1
                  </span>
                )}
              </button>

              <NotificationCenter
                currentUser={currentUser}
                goalStatus={goalStatus}
                notifications={notifications}
                isOpen={isNotificationCenterOpen}
                onClose={() => setIsNotificationCenterOpen(false)}
                onToggleReminders={() => {
                  const next = currentUser.remindersEnabled === false;
                  const updated = StorageService.updateUserProfile(currentUser.id, {
                    remindersEnabled: next,
                  });
                  setCurrentUser({ ...updated });
                }}
                onNavigate={(s) => {
                  setCurrentScreen(s);
                  setIsNotificationCenterOpen(false);
                }}
                onStartPractice={() => {
                  setIsNotificationCenterOpen(false);
                  const next =
                    lessons.find(
                      (l) =>
                        !StorageService.getCompletedLessons(currentUser.id).includes(
                          l.id
                        )
                    ) || lessons[0];
                  if (next) handleStartLesson(next);
                  else setCurrentScreen('timed-test');
                }}
              />
            </div>

            {/* Theme Mode Toggle (Sun / Moon) */}
            <button
              type="button"
              onClick={handleToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme mode"
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              )}
            </button>
          </div>

          {/* User Account & Admin Access */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme mode"
              className="md:hidden rounded-xl border border-slate-200 dark:border-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Admin Switch shortcut */}
            {currentUser.role === 'admin' ? (
              <button
                type="button"
                onClick={() => setCurrentScreen('admin')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition ${
                  currentScreen === 'admin'
                    ? 'bg-purple-700 text-white shadow-purple-600/30'
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </button>
            ) : null}

            {/* User Profile / Auth trigger */}
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-bold text-[11px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block max-w-[120px] truncate">
                <div className="font-semibold text-slate-900 dark:text-white leading-tight truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-1">
          <div className="pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Navigation
          </div>

          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentScreen(item.id);
                  setActiveWorkspace(null);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin Dashboard Sidebar Item */}
          <div className="pt-4 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
            Administration
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrentScreen('admin');
              setActiveWorkspace(null);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
              currentScreen === 'admin'
                ? 'bg-purple-700 text-white shadow-sm shadow-purple-600/20'
                : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Admin Center</span>
          </button>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <span className="font-extrabold text-slate-900 dark:text-white">Menu</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 text-slate-500 dark:text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setCurrentScreen(item.id);
                        setActiveWorkspace(null);
                        setIsMobileNavOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold ${
                        currentScreen === item.id
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('admin');
                      setActiveWorkspace(null);
                      setIsMobileNavOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold ${
                      currentScreen === 'admin'
                        ? 'bg-purple-700 text-white'
                        : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Center</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 p-2.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Theme</span>
                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="h-3.5 w-3.5 text-amber-400" />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5 text-slate-600" />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  Account ({currentUser.role})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content View Area */}
        <main className="flex-1 min-w-0">
          {/* Daily Goal In-App Reminder Banner (visible outside active lesson if goal pending) */}
          {currentScreen !== 'lesson' && !activeWorkspace && (
            <InAppReminderBanner
              currentUser={currentUser}
              goalStatus={goalStatus}
              onDismiss={() => {
                NotificationService.dismissReminderForToday(currentUser.id);
                setCurrentUser(StorageService.getCurrentUser());
              }}
              onSnooze={() => {
                NotificationService.snoozeReminders(60);
                setSnoozeTrigger(Date.now());
              }}
              onStartPractice={() => {
                const next =
                  lessons.find(
                    (l) =>
                      !StorageService.getCompletedLessons(currentUser.id).includes(
                        l.id
                      )
                  ) || lessons[0];
                if (next) handleStartLesson(next);
                else setCurrentScreen('timed-test');
              }}
            />
          )}

          {/* Active Typing Workspace takes full stage when active */}
          {currentScreen === 'lesson' && activeWorkspace ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setActiveWorkspace(null);
                    setCurrentScreen('curriculum');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  &larr; Exit Session to Curriculum
                </button>
              </div>

              <TypingWorkspace
                userId={currentUser.id}
                mode={activeWorkspace.mode}
                referenceId={activeWorkspace.referenceId}
                title={activeWorkspace.title}
                subtitle={activeWorkspace.subtitle}
                objective={activeWorkspace.objective}
                targetText={activeWorkspace.targetText}
                layoutId={activeLayoutId}
                onLayoutChange={handleSelectLayout}
                isTimed={activeWorkspace.isTimed}
                durationSeconds={activeWorkspace.durationSeconds}
                minAccuracyTarget={activeWorkspace.minAccuracyTarget}
                minWpmTarget={activeWorkspace.minWpmTarget}
                backspacePolicy={activeWorkspace.backspacePolicy}
                scoringFormula={activeWorkspace.scoringFormula}
                examPreset={activeWorkspace.examPreset}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                showVirtualKeyboard={showVirtualKeyboard}
                onToggleVirtualKeyboard={handleToggleVirtualKeyboard}
                showFingerGuide={showFingerGuide}
                onToggleFingerGuide={handleToggleFingerGuide}
                onComplete={handleWorkspaceComplete}
              />
            </div>
          ) : currentScreen === 'results' && lastResult ? (
            <ResultsView
              result={lastResult}
              onRetry={() => {
                if (activeWorkspace) {
                  setCurrentScreen('lesson');
                } else {
                  setCurrentScreen('timed-test');
                }
              }}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          ) : currentScreen === 'landing' ? (
            <LandingView
              currentUser={currentUser}
              activeLayoutId={activeLayoutId}
              onSelectLayout={handleSelectLayout}
              onNavigate={(s) => setCurrentScreen(s)}
              onStartLesson={handleStartLesson}
              onStartExam={handleStartExamPreset}
              lessons={lessons}
              examPresets={examPresets}
            />
          ) : currentScreen === 'dashboard' ? (
            <LearnerDashboardView
              currentUser={currentUser}
              attempts={attempts}
              lessons={lessons}
              onNavigate={(s) => setCurrentScreen(s)}
              onStartLesson={handleStartLesson}
              onOpenAuth={() => setIsAuthOpen(true)}
              onUpdateGoal={(mins) => {
                const updated = StorageService.updateUserProfile(currentUser.id, {
                  dailyGoalMinutes: mins,
                });
                setCurrentUser({ ...updated });
              }}
            />
          ) : currentScreen === 'curriculum' ? (
            <CurriculumView
              currentUser={currentUser}
              lessons={lessons}
              activeLayoutId={activeLayoutId}
              onStartLesson={handleStartLesson}
            />
          ) : currentScreen === 'layouts' ? (
            <LayoutsView
              activeLayoutId={activeLayoutId}
              onSelectLayout={handleSelectLayout}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          ) : currentScreen === 'keyboard-guide' ? (
            <KeyboardGuideView
              activeLayoutId={activeLayoutId}
              onSelectLayout={handleSelectLayout}
            />
          ) : currentScreen === 'matra-conjunct' ? (
            <MatraStudioView
              currentUser={currentUser}
              activeLayoutId={activeLayoutId}
              onStartDrill={handleStartMatraDrill}
            />
          ) : currentScreen === 'words-sentences' || currentScreen === 'paragraphs' ? (
            <PassagePracticeView
              passages={passages}
              onStartPassage={handleStartPassage}
            />
          ) : currentScreen === 'timed-test' ? (
            <TimedTestView
              passages={passages}
              onStartTimedTest={handleStartTimedTest}
            />
          ) : currentScreen === 'mistyped-words' ? (
            <MistypedWordsView
              currentUser={currentUser}
              activeLayoutId={activeLayoutId}
              onStartDrill={handleStartWeakWordDrill}
            />
          ) : currentScreen === 'progress' ? (
            <ProgressView currentUser={currentUser} attempts={attempts} />
          ) : currentScreen === 'exam-simulator' ? (
            <ExamSimulatorView
              currentUser={currentUser}
              examPresets={examPresets}
              activeLayoutId={activeLayoutId}
              onStartExam={handleStartExamPreset}
            />
          ) : currentScreen === 'admin' ? (
            <AdminDashboard
              currentUser={currentUser}
              lessons={lessons}
              onUpdateLessons={(updated) => setLessons(updated)}
              passages={passages}
              onUpdatePassages={(updated) => setPassages(updated)}
              examPresets={examPresets}
              onUpdateExamPresets={(updated) => setExamPresets(updated)}
              onRefreshData={() => {
                setLessons(StorageService.getLessons());
                setPassages(StorageService.getPassages());
                setExamPresets(StorageService.getExamPresets());
                setAttempts(StorageService.getAllAttempts());
              }}
            />
          ) : null}
        </main>
      </div>

      {/* Global Auth / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
      />
    </div>
  );
}
