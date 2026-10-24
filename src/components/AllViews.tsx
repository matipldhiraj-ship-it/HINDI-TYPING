import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  HelpCircle,
  Keyboard,
  Layers,
  Lock,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Unlock,
  Volume2,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Info,
  ListOrdered,
  Shuffle,
  Zap,
} from 'lucide-react';
import { MATRA_CONJUNCT_DRILLS } from '../data/curriculumData';
import {
  KEYBOARD_LAYOUT_LIST,
  KEYBOARD_LAYOUTS,
  PHYSICAL_KEY_MAP,
  runLayoutSelfTests,
} from '../engine/keyboardLayouts';
import { SCORING_FORMULA_DOCS } from '../engine/scoringEngine';
import { StorageService } from '../services/storageService';
import {
  ExamPreset,
  KeyboardLayoutId,
  LessonItem,
  MistypedWordRecord,
  PracticePassage,
  ScreenId,
  TypingAttemptResult,
  UserAccount,
} from '../types/typing';
import { VirtualKeyboard } from './VirtualKeyboard';
import { DailyGoalProgressBar } from './NotificationCenter';
import { NotificationService } from '../services/notificationService';

// ==========================================
// 1. LANDING VIEW
// ==========================================
export const LandingView: React.FC<{
  currentUser: UserAccount;
  activeLayoutId: KeyboardLayoutId;
  onSelectLayout: (id: KeyboardLayoutId) => void;
  onNavigate: (screen: ScreenId) => void;
  onStartLesson: (lesson: LessonItem) => void;
  onStartExam: (preset: ExamPreset) => void;
  lessons: LessonItem[];
  examPresets: ExamPreset[];
}> = ({
  currentUser,
  activeLayoutId,
  onSelectLayout,
  onNavigate,
  onStartLesson,
  onStartExam,
  lessons,
  examPresets,
}) => {
  const currentLayout = KEYBOARD_LAYOUTS[activeLayoutId];
  const firstLesson = lessons[0] || null;
  const sscPreset =
    examPresets.find((p) => p.id === 'exam-ssc-chsl') || examPresets[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl md:p-12 border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>Government Exam Standard &bull; Devanagari Unicode &amp; Kruti Dev</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl font-hindi leading-snug">
            हिंदी टाइपिंग में निपुणता प्राप्त करें
          </h1>
          <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
            The definitive typing tutor for <strong>SSC CHSL/CGL, CPCT, UP Police, Allahabad High Court,</strong> and <strong>State Secretariat</strong> exams. Master InScript, Remington GAIL/CBI, and Kruti Dev 010 with accurate finger placement, backspace policies, and net speed scoring.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {firstLesson && (
              <button
                type="button"
                onClick={() => onStartLesson(firstLesson)}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 active:scale-95"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Start Learning (चरण १)</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigate('timed-test')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              <Clock className="h-4 w-4 text-sky-400" />
              <span>Practice Test (१ से ५ मिनट)</span>
            </button>
            {sscPreset && (
              <button
                type="button"
                onClick={() => onStartExam(sscPreset)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-5 py-3.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-900/50"
              >
                <Award className="h-4 w-4 text-emerald-400" />
                <span>Exam Simulator (SSC/CPCT)</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Grid Accent */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-12 bottom-0 hidden lg:block opacity-15">
          <span className="font-hindi text-9xl font-black text-sky-200 select-none">
            क ख ग घ
          </span>
        </div>
      </section>

      {/* Active Layout Quick Switcher Banner */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Keyboard Layout
                </span>
                <span className="rounded bg-sky-100 dark:bg-sky-950/70 px-2 py-0.5 text-xs font-semibold text-sky-800 dark:text-sky-300">
                  {currentLayout.badgeText}
                </span>
              </div>
              <p className="text-base font-bold text-slate-900 dark:text-white">{currentLayout.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {KEYBOARD_LAYOUT_LIST.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => onSelectLayout(spec.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeLayoutId === spec.id
                    ? 'bg-sky-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {spec.shortName}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onNavigate('layouts')}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span>Explore Mappings</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 Core Tracks */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Track 1 */}
        <div
          onClick={() => onNavigate('curriculum')}
          className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 transition group-hover:scale-110">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            12-Stage Structured Curriculum
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            From keyboard resting orientation and finger placement to home-row, upper-row, matras, halant half-letters, and full sentences.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
            <span>Explore all 12 stages</span>
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>

        {/* Track 2 */}
        <div
          onClick={() => onNavigate('matra-conjunct')}
          className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 transition group-hover:scale-110">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-hindi">
            मात्रा एवं संयुक्त अक्षर स्टूडियो
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Dedicated drills for pre-base choti-ee (ि), Repha (र्) vs Rakara (्र), Nukta (़), and complex ligatures like क्ष, त्र, ज्ञ, and द्व.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Open Matra Studio</span>
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>

        {/* Track 3 */}
        <div
          onClick={() => onNavigate('exam-simulator')}
          className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 transition group-hover:scale-110">
            <Award className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
            Official Exam Simulator
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Real exam presets for SSC, CPCT, UP Police, and High Courts with strict backspace lockouts, countdown timers, and official net speed formulas.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Launch Exam Preset</span>
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </section>

      {/* Exam Relevance Section */}
      <section className="rounded-2xl border border-slate-200 bg-slate-900 p-8 text-white shadow-md">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold">Standardized Government Exam Preparation</h2>
          <p className="mt-1 text-sm text-slate-400">
            Every test is scored using verified formulas specified by recruiting bodies:
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              SSC CHSL / CGL
            </div>
            <div className="mt-1 text-base font-bold text-slate-100">30 WPM (Net)</div>
            <div className="mt-2 text-xs text-slate-400">
              InScript or Remington GAIL &bull; 5-char keystroke word divisor &bull; Up to 7% allowable errors
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              MP CPCT Score Card
            </div>
            <div className="mt-1 text-base font-bold text-slate-100">20+ WPM Required</div>
            <div className="mt-2 text-xs text-slate-400">
              Remington GAIL or InScript &bull; Word-based Net WPM with real-time backspace control
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              UPSSSC / UP Police
            </div>
            <div className="mt-1 text-base font-bold text-slate-100">25 WPM (85% Accuracy)</div>
            <div className="mt-2 text-xs text-slate-400">
              Kruti Dev 010 / InScript &bull; Strict 5-minute paragraph speed test
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-800/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              High Court (RO/ARO)
            </div>
            <div className="mt-1 text-base font-bold text-slate-100">25–30 WPM</div>
            <div className="mt-2 text-xs text-slate-400">
              Remington CBI &amp; Kruti Dev &bull; Full and half mistake mark deduction scheme
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// 2. LEARNER DASHBOARD VIEW
// ==========================================
export const LearnerDashboardView: React.FC<{
  currentUser: UserAccount;
  attempts: TypingAttemptResult[];
  lessons: LessonItem[];
  onNavigate: (screen: ScreenId) => void;
  onStartLesson: (lesson: LessonItem) => void;
  onOpenAuth: () => void;
  onUpdateGoal?: (minutes: number) => void;
}> = ({
  currentUser,
  attempts,
  lessons,
  onNavigate,
  onStartLesson,
  onOpenAuth,
  onUpdateGoal,
}) => {
  const userAttempts = useMemo(
    () => attempts.filter((a) => a.userId === currentUser.id),
    [attempts, currentUser.id]
  );

  const goalStatus = useMemo(
    () =>
      NotificationService.getDailyGoalStatus(
        currentUser.id,
        currentUser.dailyGoalMinutes,
        userAttempts
      ),
    [currentUser.id, currentUser.dailyGoalMinutes, userAttempts]
  );

  const completedLessonIds = useMemo(
    () => StorageService.getCompletedLessons(currentUser.id),
    [currentUser.id, attempts]
  );

  const mistypedWords = useMemo(
    () => StorageService.getMistypedWords(currentUser.id),
    [currentUser.id, attempts]
  );

  const stats = useMemo(() => {
    if (userAttempts.length === 0) {
      return {
        avgNetWpm: 0,
        bestNetWpm: 0,
        avgAccuracy: 0,
        totalTimeMinutes: 0,
        totalKeystrokes: 0,
      };
    }
    const totalNet = userAttempts.reduce((acc, a) => acc + a.netWpm, 0);
    const bestNet = Math.max(...userAttempts.map((a) => a.netWpm));
    const totalAcc = userAttempts.reduce((acc, a) => acc + a.accuracy, 0);
    const totalTimeSec = userAttempts.reduce((acc, a) => acc + a.elapsedSeconds, 0);
    const totalKeys = userAttempts.reduce((acc, a) => acc + a.totalKeystrokes, 0);

    return {
      avgNetWpm: Math.round(totalNet / userAttempts.length),
      bestNetWpm: Math.round(bestNet),
      avgAccuracy: Math.round(totalAcc / userAttempts.length),
      totalTimeMinutes: Math.round(totalTimeSec / 60),
      totalKeystrokes: totalKeys,
    };
  }, [userAttempts]);

  // Next recommended lesson
  const nextLesson = useMemo(() => {
    return lessons.find((l) => !completedLessonIds.includes(l.id)) || lessons[0];
  }, [lessons, completedLessonIds]);

  return (
    <div className="space-y-8 pb-16">
      {/* Dashboard Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome, {currentUser.name}
            </h1>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${
                currentUser.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                  : currentUser.role === 'learner'
                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {currentUser.role}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Target Goal: <span className="font-medium text-slate-700 dark:text-slate-200">{currentUser.targetExam || 'General Devanagari Proficiency'}</span>
            {' '}&bull; Preferred Layout:{' '}
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {KEYBOARD_LAYOUTS[currentUser.preferredLayout]?.shortName || currentUser.preferredLayout}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === 'guest' && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-600 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Save Progress: Create Account</span>
            </button>
          )}
          {nextLesson && (
            <button
              type="button"
              onClick={() => onStartLesson(nextLesson)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-sky-500 transition"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Resume Lesson</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Daily Typing-Practice Goal Progress Bar */}
      <DailyGoalProgressBar
        currentUser={currentUser}
        goalStatus={goalStatus}
        onUpdateGoal={(mins) => {
          if (onUpdateGoal) {
            onUpdateGoal(mins);
          } else {
            StorageService.updateUserProfile(currentUser.id, {
              dailyGoalMinutes: mins,
            });
          }
        }}
        onStartQuickPractice={() => {
          if (nextLesson) onStartLesson(nextLesson);
          else onNavigate('timed-test');
        }}
        onNavigate={onNavigate}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Speed</span>
            <TrendingUp className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {stats.avgNetWpm}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Net WPM</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Best:{' '}
            <strong className="text-slate-800 dark:text-slate-200 font-mono-tabular">{stats.bestNetWpm} WPM</strong>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Accuracy</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {stats.avgAccuracy || 100}%
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Target:{' '}
            <strong className="text-slate-800 dark:text-slate-200">&gt;= 95%</strong>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Progress</span>
            <BookOpen className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {completedLessonIds.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ {lessons.length}</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {lessons.length > 0
              ? `${Math.round((completedLessonIds.length / lessons.length) * 100)}% completed`
              : '0% completed'}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Practice</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {stats.totalTimeMinutes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">minutes</span>
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {stats.totalKeystrokes.toLocaleString()} keystrokes
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Next recommended action */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-sky-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Next Up in Curriculum
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('curriculum')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
            >
              View Full Course &rarr;
            </button>
          </div>

          {nextLesson ? (
            <div className="mt-4 rounded-xl border border-sky-100 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/30 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider">
                    {nextLesson.stageTitle}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {nextLesson.title}
                  </h3>
                  <p className="font-hindi text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                    {nextLesson.hindiTitle}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    {nextLesson.objective}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onStartLesson(nextLesson)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-sky-500 transition"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Lesson #{nextLesson.lessonNumber}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-800 dark:text-emerald-300 text-sm">
              Congratulations! You have completed all lessons in the curriculum. Try exam presets or timed passages to maintain peak speed.
            </div>
          )}

          {/* Quick links inside dashboard */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => onNavigate('timed-test')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-left transition hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Clock className="h-4 w-4 text-sky-500" />
              <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Timed Test</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">1, 3, 5, 10 min</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('matra-conjunct')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-left transition hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Layers className="h-4 w-4 text-purple-500" />
              <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white font-hindi">मात्रा अभ्यास</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Pre-base, Repha</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('mistyped-words')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-left transition hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Mistyped Words</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{mistypedWords.length} in review</div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 text-left transition hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              <div className="mt-2 text-xs font-bold text-slate-900 dark:text-white">Charts &amp; History</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Speed trends</div>
            </button>
          </div>
        </div>

        {/* Mistyped words card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Needs Review
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('mistyped-words')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
            >
              Review all &rarr;
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Words requiring accuracy reinforcement:
          </p>

          <div className="mt-4 space-y-2">
            {mistypedWords.length > 0 ? (
              mistypedWords.slice(0, 5).map((w: MistypedWordRecord, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-2 text-xs"
                >
                  <span className="font-hindi text-base font-medium text-slate-900 dark:text-white">
                    {w.word}
                  </span>
                  <span className="rounded bg-rose-100 dark:bg-rose-950/60 px-1.5 py-0.5 font-semibold text-rose-700 dark:text-rose-300 font-mono-tabular">
                    {w.errorCount} {w.errorCount === 1 ? 'error' : 'errors'}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                No error records logged yet! Great accuracy!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Attempts Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Practice Sessions
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700"
          >
            View Full Log ({userAttempts.length}) &rarr;
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Session Title</th>
                <th className="py-2.5 px-3">Layout</th>
                <th className="py-2.5 px-3">Gross WPM</th>
                <th className="py-2.5 px-3">Net WPM</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {userAttempts.length > 0 ? (
                userAttempts.slice(0, 5).map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      {att.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        {att.layoutId}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-tabular">{att.grossWpm}</td>
                    <td className="py-3 px-3 font-bold font-mono-tabular text-slate-900 dark:text-white">
                      {att.netWpm}
                    </td>
                    <td className="py-3 px-3 font-mono-tabular">
                      <span
                        className={
                          att.accuracy >= 95
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : att.accuracy >= 90
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : 'text-rose-600 dark:text-rose-400 font-semibold'
                        }
                      >
                        {att.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(att.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold ${
                          att.passed
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {att.passed ? 'Qualified' : 'Retake'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No attempts logged yet. Complete your first lesson to see results here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. KEYBOARD LAYOUTS EXPLORER VIEW
// ==========================================
export const LayoutsView: React.FC<{
  activeLayoutId: KeyboardLayoutId;
  onSelectLayout: (id: KeyboardLayoutId) => void;
  onNavigate: (screen: ScreenId) => void;
}> = ({ activeLayoutId, onSelectLayout, onNavigate }) => {
  const currentSpec = KEYBOARD_LAYOUTS[activeLayoutId];
  const [selectedSpecId, setSelectedSpecId] = useState<KeyboardLayoutId>(activeLayoutId);
  const spec = KEYBOARD_LAYOUTS[selectedSpecId];

  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Hindi Keyboard Layouts &amp; Encodings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Understand the critical differences between modern Unicode Devanagari (InScript, Remington GAIL/CBI) and legacy font-encoded typings (Kruti Dev 010 / DevLys).
        </p>
      </div>

      {/* Layout Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {KEYBOARD_LAYOUT_LIST.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setSelectedSpecId(l.id)}
            className={`rounded-xl border p-3.5 text-left transition ${
              selectedSpecId === l.id
                ? 'border-sky-500 dark:border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {l.badgeText}
              </span>
              {activeLayoutId === l.id && (
                <span className="rounded bg-sky-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  Active
                </span>
              )}
            </div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{l.name}</div>
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
              {l.description}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Layout Deep-Dive Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{spec.name}</h2>
              <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {spec.encodingType}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{spec.description}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectLayout(spec.id);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${
              activeLayoutId === spec.id
                ? 'bg-emerald-600 text-white'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            {activeLayoutId === spec.id ? '✓ Currently Active Layout' : 'Set as Active Layout'}
          </button>
        </div>

        {/* Architecture & Exam Relevance */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Exam &amp; Government Board Relevance
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
              {spec.examRelevance.map((ex, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-sky-100 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/30 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
              Technical Architecture &amp; Rules
            </h3>
            <p className="mt-1 text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
              {spec.architectureNote}
            </p>
          </div>
        </div>

        {/* Interactive Virtual Keyboard Preview for this layout */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Layout Map &amp; Finger Guidance
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Press physical keys or toggle Shift to inspect characters
            </span>
          </div>

          <VirtualKeyboard
            layoutId={spec.id}
            showHandDiagram={true}
            showFingerColors={true}
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CURRICULUM VIEW (12 STAGES)
// ==========================================
export const CurriculumView: React.FC<{
  currentUser: UserAccount;
  lessons: LessonItem[];
  activeLayoutId: KeyboardLayoutId;
  onStartLesson: (lesson: LessonItem) => void;
}> = ({ currentUser, lessons, activeLayoutId, onStartLesson }) => {
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const completedLessonIds = useMemo(
    () => StorageService.getCompletedLessons(currentUser.id),
    [currentUser.id]
  );

  const stages = useMemo(() => {
    const map = new Map<number, string>();
    lessons.forEach((l) => map.set(l.stageNumber, l.stageTitle));
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      if (selectedStage !== 'all' && l.stageNumber !== selectedStage) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.title.toLowerCase().includes(q) ||
          l.hindiTitle.toLowerCase().includes(q) ||
          l.objective.toLowerCase().includes(q) ||
          l.stageTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [lessons, selectedStage, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            12-Stage Beginner-to-Pro Curriculum
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Master Hindi touch-typing systematically with progressive unlocks and muscle-memory drills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Stage Selector Pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => setSelectedStage('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            selectedStage === 'all'
              ? 'bg-slate-900 dark:bg-sky-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Stages ({lessons.length})
        </button>
        {stages.map(([num, title]) => (
          <button
            key={num}
            type="button"
            onClick={() => setSelectedStage(num)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              selectedStage === num
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Stage {num}
          </button>
        ))}
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isUnlocked =
            currentUser.unlockAllLessons ||
            currentUser.role === 'admin' ||
            lesson.stageNumber === 1 ||
            isCompleted ||
            completedLessonIds.some((id: string) => {
              const prev = lessons.find((l) => l.id === id);
              return prev && prev.stageNumber >= lesson.stageNumber - 1;
            });

          return (
            <div
              key={lesson.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-sm'
                  : isUnlocked
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md'
                  : 'border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Stage {lesson.stageNumber} &bull; Lesson #{lesson.lessonNumber}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                      <Check className="h-3 w-3" />
                      <span>Completed</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:text-sky-300">
                      <Unlock className="h-3 w-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      <Lock className="h-3 w-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                  {lesson.title}
                </h3>
                <p className="font-hindi text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                  {lesson.hindiTitle}
                </p>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {lesson.objective}
                </p>

                {/* Focus keys */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {lesson.focusKeys.slice(0, 6).map((k, i) => (
                    <span
                      key={i}
                      className="rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-700 dark:text-slate-300"
                    >
                      {k}
                    </span>
                  ))}
                  {lesson.focusKeys.length > 6 && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">
                      +{lesson.focusKeys.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: <strong>{lesson.minAccuracy}% acc</strong>
                </div>

                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => onStartLesson(lesson)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${
                    isUnlocked
                      ? 'bg-sky-600 text-white hover:bg-sky-500'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Practice</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 5. KEYBOARD GUIDE & FINGER PLACEMENT VIEW
// ==========================================
export const KeyboardGuideView: React.FC<{
  activeLayoutId: KeyboardLayoutId;
  onSelectLayout: (id: KeyboardLayoutId) => void;
}> = ({ activeLayoutId, onSelectLayout }) => {
  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Virtual Keyboard &amp; 10-Finger Placement Guide
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Master the exact tactile resting position on <strong>F and J</strong>. Observe color-coded finger zones for every Devanagari character.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Layout:
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {KEYBOARD_LAYOUTS[activeLayoutId]?.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {KEYBOARD_LAYOUT_LIST.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectLayout(l.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  activeLayoutId === l.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {l.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Virtual Keyboard with Finger placement enabled */}
        <VirtualKeyboard
          layoutId={activeLayoutId}
          showHandDiagram={true}
          showFingerColors={true}
        />

        {/* Ergonomic Rules */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              1. Tactile Anchors (F &amp; J)
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Rest your index fingers on the physical raised bumps on <strong>F</strong> (Left Hand) and <strong>J</strong> (Right Hand). Never look at the keys while typing.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              2. Left-Right Matra Balance
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In InScript, vowels and matras reside on the left hand, consonants on the right. This creates natural alternating-hand rhythm.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              3. Dedicated Thumb Spacebar
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Use either thumb strictly for Spacebar. Never press Space with an index or middle finger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MATRA & CONJUNCT STUDIO VIEW
// ==========================================
export const MatraStudioView: React.FC<{
  currentUser: UserAccount;
  activeLayoutId: KeyboardLayoutId;
  onStartDrill: (drill: (typeof MATRA_CONJUNCT_DRILLS)[0]) => void;
}> = ({ currentUser, activeLayoutId, onStartDrill }) => {
  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-hindi">
          मात्रा एवं संयुक्त अक्षर अभ्यास (Matra &amp; Conjuncts Studio)
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          The most critical hurdle in Devanagari typing: mastering pre-base <strong>Choti-ee (ि)</strong>, <strong>Halant (्)</strong> half-letters, <strong>Repha (र्)</strong> vs <strong>Rakara (्र)</strong>, and special ligatures.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {MATRA_CONJUNCT_DRILLS.map((drill) => (
          <div
            key={drill.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  {drill.group}
                </span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white font-hindi">
                {drill.hindiTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{drill.description}</p>

              {/* Tokens Preview Table */}
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-2">Glyph</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">InScript</th>
                      <th className="p-2">Remington</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {drill.tokens.slice(0, 4).map((t, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-hindi text-base font-bold text-slate-900 dark:text-white">
                          {t.hindi}
                        </td>
                        <td className="p-2 text-slate-600 dark:text-slate-300 text-[11px]">{t.name}</td>
                        <td className="p-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          {t.inscriptKeys}
                        </td>
                        <td className="p-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          {t.remingtonKeys}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 rounded-lg bg-slate-100 dark:bg-slate-800 p-2.5 text-xs text-slate-700 dark:text-slate-200 font-hindi">
                <span className="font-semibold text-slate-900 dark:text-white">अभ्यास वाक्य: </span>
                {drill.practiceText.slice(0, 70)}...
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartDrill(drill)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-purple-500"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Start Drill: {drill.title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. PASSAGE & PARAGRAPH PRACTICE VIEW
// ==========================================
export const PassagePracticeView: React.FC<{
  passages: PracticePassage[];
  onStartPassage: (passage: PracticePassage) => void;
}> = ({ passages, onStartPassage }) => {
  const [filterCat, setFilterCat] = useState<string>('all');

  const filtered = useMemo(() => {
    if (filterCat === 'all') return passages;
    return passages.filter((p) => p.category === filterCat);
  }, [passages, filterCat]);

  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Words, Sentences &amp; Paragraph Practice
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Build sustained muscle memory with official government gazettes, editorial prose, and legal terminology passages.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'words', 'sentences', 'paragraphs', 'editorial', 'official-letter'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCat(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition ${
              filterCat === cat
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((passage) => (
          <div
            key={passage.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {passage.category}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {passage.difficulty}
                </span>
              </div>

              <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{passage.title}</h2>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 font-hindi leading-relaxed">
                {passage.text}
              </p>

              <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{passage.wordCount} words</span>
                <span>&bull;</span>
                <span>{passage.charCount} characters</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onStartPassage(passage)}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-sky-500"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Practice Passage</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. TIMED TEST VIEW
// ==========================================
export const TimedTestView: React.FC<{
  passages: PracticePassage[];
  onStartTimedTest: (durationMin: number, passage: PracticePassage) => void;
}> = ({ passages, onStartTimedTest }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    passages[0]?.id || ''
  );

  const selectedPassage =
    passages.find((p) => p.id === selectedPassageId) || passages[0];

  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Timed Typing Speed Test
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Select a duration and practice text to measure your Gross WPM, Net WPM, accuracy, and error distribution under countdown pressure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Duration Picker */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Select Test Duration
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 5, 10, 15].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSelectedDuration(mins)}
                className={`rounded-xl border p-3 text-center transition ${
                  selectedDuration === mins
                    ? 'border-sky-500 dark:border-sky-500 bg-sky-50 dark:bg-sky-950/40 font-bold text-sky-700 dark:text-sky-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-lg font-bold font-mono-tabular">{mins}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Minutes</div>
              </button>
            ))}
          </div>
        </div>

        {/* Passage Picker */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. Choose Test Passage
          </h2>

          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {passages.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPassageId(p.id)}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  selectedPassage?.id === p.id
                    ? 'border-sky-500 dark:border-sky-500 bg-sky-50/60 dark:bg-sky-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{p.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono-tabular">
                    {p.wordCount} words
                  </span>
                </div>
                <p className="mt-1 font-hindi text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={!selectedPassage}
              onClick={() => {
                if (selectedPassage) onStartTimedTest(selectedDuration, selectedPassage);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white shadow hover:bg-sky-500 transition"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>
                Start {selectedDuration}-Minute Timed Test
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. RESULTS & ERROR ANALYSIS VIEW
// ==========================================
export const ResultsView: React.FC<{
  result: TypingAttemptResult;
  onRetry: () => void;
  onNavigate: (screen: ScreenId) => void;
}> = ({ result, onRetry, onNavigate }) => {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div
        className={`rounded-2xl border p-8 text-center shadow-sm ${
          result.passed
            ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100'
            : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100'
        }`}
      >
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm mb-4">
          {result.passed ? (
            <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <RotateCcw className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {result.passed ? 'Test Qualified!' : 'Needs Practice'}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
          {result.passReason}
        </p>

        {/* Big Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Gross Speed</div>
            <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {result.grossWpm}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">WPM</div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Net Speed</div>
            <div className="mt-1 text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-mono-tabular">
              {result.netWpm}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">WPM (After Penalty)</div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Accuracy</div>
            <div
              className={`mt-1 text-3xl font-extrabold font-mono-tabular ${
                result.accuracy >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {result.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Correctness</div>
          </div>

          <div className="rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Keystrokes</div>
            <div className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white font-mono-tabular">
              {result.totalKeystrokes}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {result.backspaceCount} Backspaces
            </div>
          </div>
        </div>

        {/* Retry / Continue buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 dark:hover:bg-sky-500 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Mistyped words & Difficult characters breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mistyped words */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Mistyped Words ({result.mistypedWords.length})
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            These words have been automatically saved to your Mistyped Practice List.
          </p>

          <div className="mt-4 space-y-2">
            {result.mistypedWords.length > 0 ? (
              result.mistypedWords.map((mw, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-hindi text-base font-bold text-emerald-700 dark:text-emerald-400">
                      Expected: {mw.expected}
                    </div>
                    <div className="font-hindi text-sm text-rose-600 dark:text-rose-400 line-through">
                      Typed: {mw.typed}
                    </div>
                  </div>
                  <span className="rounded bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 font-bold text-rose-700 dark:text-rose-300">
                    {mw.count} {mw.count === 1 ? 'error' : 'errors'}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center text-xs text-emerald-800 dark:text-emerald-300">
                100% word accuracy! Zero mistyped words recorded in this session.
              </div>
            )}
          </div>
        </div>

        {/* Difficult Characters */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Error Hotspots by Glyph
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Characters with highest frequency of mis-strokes during this test:
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {result.difficultChars.length > 0 ? (
              result.difficultChars.map((dc, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 text-center"
                >
                  <div className="font-hindi text-2xl font-bold text-slate-900 dark:text-white">
                    {dc.char}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {dc.errors} {dc.errors === 1 ? 'error' : 'errors'}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-6 text-center text-xs text-emerald-800 dark:text-emerald-300">
                Flawless keystroke accuracy! No individual glyph hotspots.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. MISTYPED WORDS PRACTICE VIEW
// ==========================================
export const MistypedWordsView: React.FC<{
  currentUser: UserAccount;
  activeLayoutId: KeyboardLayoutId;
  onStartDrill: (words: string[]) => void;
}> = ({ currentUser, activeLayoutId, onStartDrill }) => {
  const [words, setWords] = useState<MistypedWordRecord[]>(() =>
    StorageService.getMistypedWords(currentUser.id)
  );

  const handleClear = () => {
    StorageService.saveMistypedWords(currentUser.id, []);
    setWords([]);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Mistyped Words &amp; Accuracy Doctor
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Adaptive drill engine that targets your personal weak words until you achieve 100% accuracy.
          </p>
        </div>

        {words.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => onStartDrill(words.map((w) => w.word))}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-sky-500"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Practice All Weak Words</span>
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        {words.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {words.map((w, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4"
              >
                <div>
                  <div className="font-hindi text-lg font-bold text-slate-900 dark:text-white">
                    {w.word}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mastered: {w.masteredCount} times
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 text-xs font-bold text-rose-700 dark:text-rose-300 font-mono-tabular">
                    {w.errorCount} {w.errorCount === 1 ? 'error' : 'errors'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Clean Error Sheet!
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              As you practice lessons or timed tests, any mistyped words will appear here for targeted retraining.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 11. PROGRESS & TREND CHARTS VIEW
// ==========================================
export const ProgressView: React.FC<{
  currentUser: UserAccount;
  attempts: TypingAttemptResult[];
}> = ({ currentUser, attempts }) => {
  const userAttempts = useMemo(
    () => attempts.filter((a) => a.userId === currentUser.id),
    [attempts, currentUser.id]
  );

  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Title',
      'Layout',
      'Duration (sec)',
      'Gross WPM',
      'Net WPM',
      'Accuracy (%)',
      'Keystrokes',
      'Errors',
      'Backspaces',
      'Passed',
    ];
    const rows = userAttempts.map((a) => [
      a.timestamp,
      `"${a.title.replace(/"/g, '""')}"`,
      a.layoutId,
      a.elapsedSeconds,
      a.grossWpm,
      a.netWpm,
      a.accuracy,
      a.totalKeystrokes,
      a.incorrectChars,
      a.backspaceCount,
      a.passed ? 'YES' : 'NO',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `typing_master_progress_${currentUser.username}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart points
  const points = useMemo(() => {
    if (userAttempts.length < 2) return null;
    const slice = userAttempts.slice(-15);
    const maxWpm = Math.max(...slice.map((s) => s.netWpm), 40);
    const width = 600;
    const height = 180;
    const padding = 20;

    const coords = slice.map((item, idx) => {
      const x = padding + (idx / (slice.length - 1)) * (width - 2 * padding);
      const y = height - padding - (item.netWpm / maxWpm) * (height - 2 * padding);
      return { x, y, wpm: item.netWpm, label: item.title };
    });

    const pathD = coords.reduce(
      (acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`),
      ''
    );

    return { coords, pathD, maxWpm, width, height };
  }, [userAttempts]);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Speed Progress &amp; Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Track Net WPM trends over your last sessions and download complete audit logs for exam verification.
          </p>
        </div>

        {userAttempts.length > 0 && (
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Progress (CSV)</span>
          </button>
        )}
      </div>

      {/* SVG Trend Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Net Speed Progression (Last 15 Sessions)
        </h2>

        {points ? (
          <div className="mt-4 overflow-x-auto">
            <svg
              viewBox={`0 0 ${points.width} ${points.height}`}
              className="w-full h-48 overflow-visible"
            >
              {/* Grid Lines */}
              <line
                x1="20"
                y1={points.height - 20}
                x2={points.width - 20}
                y2={points.height - 20}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="20"
                x2={points.width - 20}
                y2="20"
                className="stroke-slate-100 dark:stroke-slate-800/60"
                strokeWidth="1"
                strokeDasharray="4"
              />

              {/* Sparkline */}
              <path
                d={points.pathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots */}
              {points.coords.map((c, i) => (
                <g key={i}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r="4.5"
                    fill="#0284c7"
                    className="stroke-white dark:stroke-slate-900"
                    strokeWidth="2"
                  />
                  <text
                    x={c.x}
                    y={c.y - 8}
                    textAnchor="middle"
                    className="text-[10px] font-bold fill-slate-700 dark:fill-slate-200 font-mono-tabular"
                  >
                    {c.wpm}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
            Complete at least 2 sessions to render the interactive speed curve.
          </div>
        )}
      </div>

      {/* Comprehensive Log Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Complete Practice History
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-850 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Layout</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Gross WPM</th>
                <th className="py-2.5 px-3">Net WPM</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Backspaces</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {userAttempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{att.title}</td>
                  <td className="py-3 px-3 font-mono text-[11px]">{att.layoutId}</td>
                  <td className="py-3 px-3 font-mono-tabular">{att.elapsedSeconds}s</td>
                  <td className="py-3 px-3 font-mono-tabular">{att.grossWpm}</td>
                  <td className="py-3 px-3 font-bold text-sky-600 dark:text-sky-400 font-mono-tabular">
                    {att.netWpm}
                  </td>
                  <td className="py-3 px-3 font-mono-tabular">{att.accuracy}%</td>
                  <td className="py-3 px-3 font-mono-tabular">{att.backspaceCount}</td>
                  <td className="py-3 px-3 text-slate-400 dark:text-slate-500">
                    {new Date(att.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        att.passed
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {att.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. EXAM SIMULATOR VIEW
// ==========================================
export const ExamSimulatorView: React.FC<{
  currentUser: UserAccount;
  examPresets: ExamPreset[];
  activeLayoutId: KeyboardLayoutId;
  onStartExam: (preset: ExamPreset) => void;
}> = ({ currentUser, examPresets, activeLayoutId, onStartExam }) => {
  return (
    <div className="space-y-8 pb-16">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Official Government Exam Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Replicate the exact exam software environment of <strong>SSC, CPCT, UP Police, and High Courts</strong>. Strictly enforce backspace policies, time limits, and official net speed formulas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {examPresets.map((preset) => {
          const formulaInfo = SCORING_FORMULA_DOCS[preset.scoringFormula];
          const isLayoutAllowed = preset.allowedLayouts.includes(activeLayoutId);

          return (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {preset.organization}
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono-tabular">
                    {preset.durationMinutes} Minutes
                  </span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                  {preset.name}
                </h2>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-850 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Min Net Speed:</span>
                    <div className="font-bold text-slate-900 dark:text-white font-mono-tabular">
                      {preset.minNetWpm} WPM
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-850 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Min Accuracy:</span>
                    <div className="font-bold text-slate-900 dark:text-white font-mono-tabular">
                      {preset.minAccuracy}%
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-850 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Backspace Policy:</span>
                    <div className="font-bold text-slate-900 dark:text-white capitalize">
                      {preset.backspacePolicy}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-850 p-2.5">
                    <span className="text-slate-500 dark:text-slate-400">Max Error Rate:</span>
                    <div className="font-bold text-slate-900 dark:text-white font-mono-tabular">
                      {preset.maxAllowedErrorPercent}%
                    </div>
                  </div>
                </div>

                {/* Scoring formula callout */}
                <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Formula: {formulaInfo?.name || preset.scoringFormula}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {preset.formulaDescription}
                  </p>
                </div>

                {/* Official Disclaimer */}
                <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 italic">
                  &ldquo;{preset.officialDisclaimer}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allowed:{' '}
                  <strong className="text-slate-700 dark:text-slate-200">{preset.allowedLayouts.join(', ')}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => onStartExam(preset)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition"
                >
                  <Award className="h-4 w-4" />
                  <span>Launch Exam Simulator</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
