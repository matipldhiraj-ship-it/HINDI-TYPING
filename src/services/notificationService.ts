import { soundEngine } from '../engine/soundEngine';
import { StorageService } from './storageService';
import { TypingAttemptResult, UserAccount } from '../types/typing';

export interface DailyGoalStatus {
  targetMinutes: number;
  practicedMinutes: number;
  remainingMinutes: number;
  percent: number;
  isCompleted: boolean;
  streakDays: number;
  todayAttemptCount: number;
}

export interface AppNotification {
  id: string;
  type: 'goal-reminder' | 'goal-achieved' | 'streak-alert' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high';
  actionLabel?: string;
  actionScreen?: string;
}

const STORAGE_NOTIFICATIONS_KEY = 'hmp_notifications_v1';
const STORAGE_REMINDER_SNOOZE_KEY = 'hmp_reminder_snooze_until_v1';

export class NotificationService {
  /**
   * Calculate exact today's typing practice progress for a user
   */
  static getDailyGoalStatus(
    userId: string,
    dailyGoalMinutes = 20,
    attempts?: TypingAttemptResult[]
  ): DailyGoalStatus {
    const todayStr = new Date().toISOString().slice(0, 10);
    const allAttempts = attempts || StorageService.getAllAttempts();
    const userAttempts = allAttempts.filter((a) => a.userId === userId);
    const todayAttempts = userAttempts.filter((a) => a.timestamp.startsWith(todayStr));

    // Calculate sum of seconds practiced today
    const totalTodaySeconds = todayAttempts.reduce(
      (acc, a) => acc + (a.elapsedSeconds || 0),
      0
    );

    // Also check storage personal data in case short drills were recorded
    const personal = StorageService.getUserPersonalData(userId);
    let practicedMinutes = Math.round(totalTodaySeconds / 60);

    // If personal data logged minutes for today, use the higher value to never lose track
    if (personal.lastActiveDate === todayStr && personal.dailyPracticeMinutes > practicedMinutes) {
      practicedMinutes = personal.dailyPracticeMinutes;
    }

    const targetMinutes = Math.max(5, dailyGoalMinutes || 20);
    const remainingMinutes = Math.max(0, targetMinutes - practicedMinutes);
    const percent = Math.min(100, Math.round((practicedMinutes / targetMinutes) * 100));
    const isCompleted = practicedMinutes >= targetMinutes;

    // Calculate streak days
    const activeDates = new Set(userAttempts.map((a) => a.timestamp.slice(0, 10)));
    let streakDays = 0;
    const d = new Date();
    // If today has practice, streak includes today
    if (activeDates.has(todayStr)) {
      streakDays = 1;
      d.setDate(d.getDate() - 1);
    }
    // Count consecutive past days
    while (activeDates.has(d.toISOString().slice(0, 10))) {
      streakDays++;
      d.setDate(d.getDate() - 1);
    }

    return {
      targetMinutes,
      practicedMinutes,
      remainingMinutes,
      percent,
      isCompleted,
      streakDays,
      todayAttemptCount: todayAttempts.length,
    };
  }

  /**
   * Get all active in-app notifications for the user
   */
  static getNotifications(user: UserAccount): AppNotification[] {
    const status = this.getDailyGoalStatus(user.id, user.dailyGoalMinutes);
    const notifications: AppNotification[] = [];
    const todayStr = new Date().toISOString().slice(0, 10);

    // Check if user dismissed for today
    const isDismissedToday = user.lastReminderDismissedDate === todayStr;

    // Check if currently snoozed
    let isSnoozed = false;
    try {
      const snoozeUntil = localStorage.getItem(STORAGE_REMINDER_SNOOZE_KEY);
      if (snoozeUntil && Date.now() < parseInt(snoozeUntil, 10)) {
        isSnoozed = true;
      }
    } catch {
      // ignore
    }

    // 1. Goal Status Notification
    if (status.isCompleted) {
      notifications.push({
        id: `goal-achieved-${todayStr}`,
        type: 'goal-achieved',
        title: '🎉 Daily Practice Goal Completed!',
        message: `Great job! You achieved your ${status.targetMinutes}-minute daily Hindi typing goal with ${status.practicedMinutes} mins practiced today.`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'normal',
        actionLabel: 'View Progress',
        actionScreen: 'dashboard',
      });
    } else if (!isDismissedToday && !isSnoozed && user.remindersEnabled !== false) {
      const timeGreeting = this.getTimeOfDayGreeting();
      notifications.push({
        id: `goal-pending-${todayStr}`,
        type: 'goal-reminder',
        title: `${timeGreeting}: Daily Typing Goal Pending`,
        message: `You have practiced ${status.practicedMinutes} of ${status.targetMinutes} minutes today (${status.remainingMinutes}m remaining). Practice now to keep your streak!`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: status.practicedMinutes === 0 ? 'high' : 'normal',
        actionLabel: 'Start Practice Now',
        actionScreen: 'curriculum',
      });
    }

    // 2. Streak Alert
    if (status.streakDays >= 2) {
      notifications.push({
        id: `streak-${status.streakDays}`,
        type: 'streak-alert',
        title: `🔥 ${status.streakDays}-Day Practice Streak!`,
        message: `You've maintained consistent Hindi typing practice for ${status.streakDays} consecutive days. Keep up the momentum!`,
        timestamp: new Date().toISOString(),
        read: true,
        priority: 'low',
      });
    }

    return notifications;
  }

  /**
   * Request native browser Web Notification permission
   */
  static async requestBrowserPermission(): Promise<'granted' | 'denied' | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    try {
      const result = await Notification.requestPermission();
      return result as 'granted' | 'denied';
    } catch {
      return 'denied';
    }
  }

  /**
   * Dispatch a browser push notification if permitted
   */
  static sendBrowserNotification(title: string, options?: NotificationOptions) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          body: options?.body || 'Complete your daily Hindi typing practice.',
          ...options,
        });
      } catch {
        // Fallback for sandboxed iframe
      }
    }
  }

  /**
   * Snooze reminders for 1 hour
   */
  static snoozeReminders(durationMinutes = 60) {
    const until = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem(STORAGE_REMINDER_SNOOZE_KEY, until.toString());
  }

  /**
   * Dismiss reminder for the remainder of today
   */
  static dismissReminderForToday(userId: string) {
    const todayStr = new Date().toISOString().slice(0, 10);
    StorageService.updateUserProfile(userId, {
      lastReminderDismissedDate: todayStr,
    });
  }

  /**
   * Preview reminder sound / chime
   */
  static playReminderChime(soundEnabled = true) {
    if (soundEnabled) {
      soundEngine.playCompletionChime(true);
    }
  }

  private static getTimeOfDayGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Morning Reminder';
    if (hour < 17) return '⚡ Afternoon Practice';
    return '🌙 Evening Reminder';
  }
}
