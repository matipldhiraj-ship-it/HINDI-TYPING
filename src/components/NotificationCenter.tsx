import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Sliders,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import {
  AppNotification,
  DailyGoalStatus,
  NotificationService,
} from '../services/notificationService';
import { ScreenId, UserAccount } from '../types/typing';

// ==========================================
// 1. VISUAL DAILY GOAL PROGRESS BAR CARD
// ==========================================
export const DailyGoalProgressBar: React.FC<{
  currentUser: UserAccount;
  goalStatus: DailyGoalStatus;
  onUpdateGoal: (minutes: number) => void;
  onStartQuickPractice: () => void;
  onNavigate: (screen: ScreenId) => void;
}> = ({
  currentUser,
  goalStatus,
  onUpdateGoal,
  onStartQuickPractice,
  onNavigate,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const goalOptions = [10, 15, 20, 30, 45, 60];

  const handleSelectGoal = (mins: number) => {
    onUpdateGoal(mins);
    setIsEditingGoal(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-200">
      {/* Accent Background Tint */}
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-30 ${
          goalStatus.isCompleted ? 'bg-emerald-400 dark:bg-emerald-500/20' : 'bg-sky-400 dark:bg-sky-500/20'
        }`}
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                goalStatus.isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300'
              }`}
            >
              {goalStatus.isCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Clock className="h-5 w-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daily Typing Practice Goal
                </span>
                {goalStatus.isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    <Sparkles className="h-3 w-3" />
                    <span>Goal Met Today</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {goalStatus.isCompleted
                  ? 'Awesome Job! Daily Target Completed'
                  : `${goalStatus.remainingMinutes} min remaining to reach goal`}
              </h2>
            </div>
          </div>

          {/* Quick Actions & Streak */}
          <div className="flex items-center gap-2">
            <div
              title={`${goalStatus.streakDays} Day Practice Streak`}
              className="flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300"
            >
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>
                {goalStatus.streakDays} {goalStatus.streakDays === 1 ? 'Day' : 'Days'} Streak
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Change daily goal minutes"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Goal: {goalStatus.targetMinutes}m</span>
            </button>
          </div>
        </div>

        {/* Goal Preset Selector Popover */}
        {isEditingGoal && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Set Target Daily Practice Duration:
              </span>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {goalOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectGoal(opt)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                    goalStatus.targetMinutes === opt
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  {opt} Minutes
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Visual Progress Bar Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white font-mono-tabular">
                {goalStatus.practicedMinutes}
              </strong>{' '}
              of{' '}
              <strong className="text-slate-900 dark:text-white font-mono-tabular">
                {goalStatus.targetMinutes}
              </strong>{' '}
              minutes completed today
            </span>
            <span
              className={`font-mono-tabular text-sm font-extrabold ${
                goalStatus.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {goalStatus.percent}%
            </span>
          </div>

          {/* Bar track */}
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/80 dark:border-slate-700 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out shadow-xs ${
                goalStatus.isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${goalStatus.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {goalStatus.todayAttemptCount === 0
                ? 'No sessions logged today yet'
                : `${goalStatus.todayAttemptCount} ${
                    goalStatus.todayAttemptCount === 1 ? 'session' : 'sessions'
                  } logged today`}
            </span>
            <span>
              {goalStatus.isCompleted
                ? 'Target achieved for today!'
                : `${goalStatus.remainingMinutes} minutes left to finish`}
            </span>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Bell className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Daily reminders:{' '}
              <strong className="text-slate-700 dark:text-slate-200">
                {currentUser.remindersEnabled !== false ? 'Active' : 'Muted'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!goalStatus.isCompleted && (
              <button
                type="button"
                onClick={onStartQuickPractice}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 active:scale-95 transition"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Practice 5 Mins Now</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('timed-test')}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Speed Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. IN-APP REMINDER BANNER
// ==========================================
export const InAppReminderBanner: React.FC<{
  currentUser: UserAccount;
  goalStatus: DailyGoalStatus;
  onDismiss: () => void;
  onSnooze: () => void;
  onStartPractice: () => void;
}> = ({ currentUser, goalStatus, onDismiss, onSnooze, onStartPractice }) => {
  // If goal is already met or user muted reminders, do not display
  if (goalStatus.isCompleted || currentUser.remindersEnabled === false) {
    return null;
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-r from-sky-50 via-indigo-50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-4 shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white shadow-xs">
            <BellRing className="h-4 w-4 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                Daily Hindi Typing Goal Reminder
              </span>
              <span className="rounded bg-sky-200/70 dark:bg-sky-900/50 px-1.5 py-0.2 text-[10px] font-bold text-sky-800 dark:text-sky-300 font-mono-tabular">
                {goalStatus.practicedMinutes}/{goalStatus.targetMinutes} min
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              You still have <strong>{goalStatus.remainingMinutes} minutes</strong> to complete today&apos;s typing practice and maintain your streak!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={onStartPractice}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-sky-500 transition"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Practice Now</span>
          </button>

          <button
            type="button"
            onClick={onSnooze}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Remind me again in 1 hour"
          >
            Snooze 1h
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
            title="Dismiss for today"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. HEADER NOTIFICATION CENTER DROPDOWN
// ==========================================
export const NotificationCenter: React.FC<{
  currentUser: UserAccount;
  goalStatus: DailyGoalStatus;
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onToggleReminders: () => void;
  onNavigate: (screen: ScreenId) => void;
  onStartPractice: () => void;
}> = ({
  currentUser,
  goalStatus,
  notifications,
  isOpen,
  onClose,
  onToggleReminders,
  onNavigate,
  onStartPractice,
}) => {
  const [browserPermission, setBrowserPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await NotificationService.requestBrowserPermission();
    setBrowserPermission(res);
    if (res === 'granted') {
      NotificationService.sendBrowserNotification(
        'Hindi Typing Master Pro Reminders Enabled',
        {
          body: `Daily goal set to ${goalStatus.targetMinutes} minutes. We will remind you to keep your practice streak!`,
        }
      );
    }
  };

  const handleTestChime = () => {
    NotificationService.playReminderChime(currentUser.soundEnabled);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/10 dark:bg-black/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Popover */}
      <div className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl text-slate-900 dark:text-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Practice Reminders &amp; Alerts
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Goal Quick Summary */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-slate-700 dark:text-slate-300">Today&apos;s Typing Progress:</span>
            <span
              className={
                goalStatus.isCompleted ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-sky-600 dark:text-sky-400 font-bold'
              }
            >
              {goalStatus.practicedMinutes} / {goalStatus.targetMinutes} min ({goalStatus.percent}%)
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className={`h-full rounded-full transition-all ${
                goalStatus.isCompleted ? 'bg-emerald-500' : 'bg-sky-500'
              }`}
              style={{ width: `${goalStatus.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {goalStatus.isCompleted
                ? 'Target achieved!'
                : `${goalStatus.remainingMinutes}m remaining`}
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
              <Flame className="h-3 w-3 fill-amber-500" />
              {goalStatus.streakDays} Day Streak
            </span>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/70 p-3 text-xs shadow-xs space-y-1 hover:border-sky-300 dark:hover:border-sky-600 transition"
              >
                <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{n.message}</p>
                {n.actionLabel && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onStartPractice();
                    }}
                    className="mt-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    {n.actionLabel} &rarr;
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No new alerts at this time. Keep practicing!
            </div>
          )}
        </div>

        {/* Settings & Browser Permission */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-400">Daily In-App Reminders:</span>
            <button
              type="button"
              onClick={onToggleReminders}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                currentUser.remindersEnabled !== false
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {currentUser.remindersEnabled !== false ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {browserPermission !== 'granted' && (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 py-2 text-xs font-semibold text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition"
            >
              <BellRing className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Enable Browser Desktop Reminders</span>
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleTestChime}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <Volume2 className="h-3 w-3" />
              <span>Test Audio Chime</span>
            </button>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Web Audio Synthesizer
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
