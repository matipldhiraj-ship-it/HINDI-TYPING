import {
  DEFAULT_EXAM_PRESETS,
  DEFAULT_LESSONS,
  PRACTICE_PASSAGES,
  SEED_ATTEMPTS,
  SEED_MISTYPED_WORDS,
} from '../data/curriculumData';
import {
  ExamPreset,
  KeyboardLayoutId,
  LessonItem,
  MistypedWordRecord,
  PracticePassage,
  TypingAttemptResult,
  UserAccount,
  UserRole,
} from '../types/typing';

const STORAGE_USERS_KEY = 'hmp_users_v2';
const STORAGE_CURRENT_USER_KEY = 'hmp_current_user_id_v2';
const STORAGE_CURRICULUM_KEY = 'hmp_curriculum_v2';
const STORAGE_PASSAGES_KEY = 'hmp_passages_v2';
const STORAGE_EXAM_PRESETS_KEY = 'hmp_exam_presets_v2';
const STORAGE_ATTEMPTS_KEY = 'hmp_all_attempts_v2';
const STORAGE_USER_DATA_PREFIX = 'hmp_user_data_';

export interface UserPersonalData {
  completedLessonIds: string[];
  mistypedWords: MistypedWordRecord[];
  dailyPracticeMinutes: number;
  lastActiveDate: string;
}

const PRE_SEEDED_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    username: 'admin',
    name: 'Chief Admin Officer (राजभाषा)',
    email: 'admin@typingmaster.in',
    role: 'admin',
    passwordHash: 'admin123',
    createdAt: '2026-09-01T08:00:00Z',
    lastLoginAt: '2026-10-24T00:30:00Z',
    targetExam: 'All Exams (Supervisor)',
    preferredLayout: 'inscript',
    dailyGoalMinutes: 30,
    soundEnabled: true,
    showVirtualKeyboard: true,
    showFingerGuide: true,
    unlockAllLessons: true,
  },
  {
    id: 'user-learner-demo',
    username: 'learner',
    name: 'Aarav Sharma (SSC Aspirant)',
    email: 'learner@typingmaster.in',
    role: 'learner',
    passwordHash: 'learner123',
    createdAt: '2026-09-15T10:00:00Z',
    lastLoginAt: '2026-10-23T19:00:00Z',
    targetExam: 'SSC CHSL / CGL Hindi Skill Test',
    preferredLayout: 'inscript',
    dailyGoalMinutes: 25,
    soundEnabled: true,
    showVirtualKeyboard: true,
    showFingerGuide: true,
    unlockAllLessons: false,
  },
];

export const GUEST_USER: UserAccount = {
  id: 'user-guest',
  username: 'guest',
  name: 'Guest Learner (अतिथि अभ्यासकर्ता)',
  email: 'guest@typingmaster.in',
  role: 'guest',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  targetExam: 'Self-Paced Practice',
  preferredLayout: 'inscript',
  dailyGoalMinutes: 20,
  soundEnabled: true,
  showVirtualKeyboard: true,
  showFingerGuide: true,
  unlockAllLessons: true,
};

export class StorageService {
  // Initialize storage with defaults if empty
  static init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_USERS_KEY)) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(PRE_SEEDED_USERS));
    }
    if (!localStorage.getItem(STORAGE_CURRENT_USER_KEY)) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, 'user-admin');
    }
    if (!localStorage.getItem(STORAGE_CURRICULUM_KEY)) {
      localStorage.setItem(STORAGE_CURRICULUM_KEY, JSON.stringify(DEFAULT_LESSONS));
    }
    if (!localStorage.getItem(STORAGE_PASSAGES_KEY)) {
      localStorage.setItem(STORAGE_PASSAGES_KEY, JSON.stringify(PRACTICE_PASSAGES));
    }
    if (!localStorage.getItem(STORAGE_EXAM_PRESETS_KEY)) {
      localStorage.setItem(STORAGE_EXAM_PRESETS_KEY, JSON.stringify(DEFAULT_EXAM_PRESETS));
    }
    if (!localStorage.getItem(STORAGE_ATTEMPTS_KEY)) {
      localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(SEED_ATTEMPTS));
    }

    // Seed personal data for demo learner if missing
    const learnerDataKey = STORAGE_USER_DATA_PREFIX + 'user-learner-demo';
    if (!localStorage.getItem(learnerDataKey)) {
      const learnerData: UserPersonalData = {
        completedLessonIds: ['stage-1-1', 'stage-1-2'],
        mistypedWords: SEED_MISTYPED_WORDS,
        dailyPracticeMinutes: 18,
        lastActiveDate: new Date().toISOString().slice(0, 10),
      };
      localStorage.setItem(learnerDataKey, JSON.stringify(learnerData));
    }
  }

  // User Management & Authentication
  static getUsers(): UserAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      return raw ? JSON.parse(raw) : PRE_SEEDED_USERS;
    } catch {
      return PRE_SEEDED_USERS;
    }
  }

  static getCurrentUser(): UserAccount {
    try {
      const currentId = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (currentId === 'user-guest') return GUEST_USER;
      const users = this.getUsers();
      const found = users.find((u) => u.id === currentId);
      return found || users[0] || GUEST_USER;
    } catch {
      return GUEST_USER;
    }
  }

  static setCurrentUser(userId: string): UserAccount {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, userId);
    return this.getCurrentUser();
  }

  static registerUser(params: {
    username: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    preferredLayout: KeyboardLayoutId;
    targetExam?: string;
  }): { success: boolean; message: string; user?: UserAccount } {
    const users = this.getUsers();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanUsername = params.username.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: 'This username is already taken. Please choose another.' };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      name: params.name.trim(),
      email: cleanEmail,
      role: params.role,
      passwordHash: params.password || 'password123',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      targetExam: params.targetExam || 'General Devanagari Proficiency',
      preferredLayout: params.preferredLayout,
      dailyGoalMinutes: 20,
      soundEnabled: true,
      showVirtualKeyboard: true,
      showFingerGuide: true,
      unlockAllLessons: params.role === 'admin',
    };

    const updated = [...users, newUser];
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, newUser.id);

    // Initialize personal data
    const initialData: UserPersonalData = {
      completedLessonIds: [],
      mistypedWords: [],
      dailyPracticeMinutes: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };
    localStorage.setItem(STORAGE_USER_DATA_PREFIX + newUser.id, JSON.stringify(initialData));

    return { success: true, message: 'Account registered successfully!', user: newUser };
  }

  static loginUser(
    identifier: string,
    password?: string
  ): { success: boolean; message: string; user?: UserAccount } {
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.username.toLowerCase() === cleanId
    );

    if (!user) {
      return { success: false, message: 'No account found with this email or username.' };
    }

    if (user.passwordHash && password && user.passwordHash !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    user.lastLoginAt = new Date().toISOString();
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.id);

    return { success: true, message: `Welcome back, ${user.name}!`, user };
  }

  static switchToGuest(): UserAccount {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, 'user-guest');
    return GUEST_USER;
  }

  static updateUserProfile(userId: string, updates: Partial<UserAccount>): UserAccount {
    if (userId === 'user-guest') {
      Object.assign(GUEST_USER, updates);
      return GUEST_USER;
    }
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
      return users[idx];
    }
    return this.getCurrentUser();
  }

  static deleteUser(userId: string): boolean {
    if (userId === 'user-admin' || userId === 'user-guest') return false;
    const users = this.getUsers().filter((u) => u.id !== userId);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    localStorage.removeItem(STORAGE_USER_DATA_PREFIX + userId);
    if (localStorage.getItem(STORAGE_CURRENT_USER_KEY) === userId) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, 'user-admin');
    }
    return true;
  }

  // Per-User Segregated Personal Progress Data
  static getUserPersonalData(userId: string): UserPersonalData {
    try {
      const key = STORAGE_USER_DATA_PREFIX + userId;
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      // fallback
    }
    return {
      completedLessonIds: [],
      mistypedWords: [],
      dailyPracticeMinutes: 0,
      lastActiveDate: new Date().toISOString().slice(0, 10),
    };
  }

  static saveUserPersonalData(userId: string, data: UserPersonalData) {
    try {
      const key = STORAGE_USER_DATA_PREFIX + userId;
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  // Attempt history (global table with userId tag)
  static getAllAttempts(): TypingAttemptResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      return raw ? JSON.parse(raw) : SEED_ATTEMPTS;
    } catch {
      return SEED_ATTEMPTS;
    }
  }

  static getUserAttempts(userId: string): TypingAttemptResult[] {
    const all = this.getAllAttempts();
    return all.filter((a) => a.userId === userId);
  }

  static recordAttempt(attempt: TypingAttemptResult) {
    const all = this.getAllAttempts();
    const updated = [...all, attempt];
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(updated));

    // Update personal user progress
    const personal = this.getUserPersonalData(attempt.userId);
    if (attempt.mode === 'lesson' && attempt.passed) {
      if (!personal.completedLessonIds.includes(attempt.referenceId)) {
        personal.completedLessonIds.push(attempt.referenceId);
      }
    }

    if (attempt.mistypedWords.length > 0) {
      const map = new Map<string, MistypedWordRecord>(
        personal.mistypedWords.map((m) => [m.word, m])
      );
      for (const mw of attempt.mistypedWords) {
        const existing = map.get(mw.expected);
        if (existing) {
          map.set(mw.expected, {
            ...existing,
            errorCount: existing.errorCount + mw.count,
            lastMistypedAt: attempt.timestamp,
          });
        } else {
          map.set(mw.expected, {
            word: mw.expected,
            errorCount: mw.count,
            masteredCount: 0,
            lastMistypedAt: attempt.timestamp,
            layoutId: attempt.layoutId,
          });
        }
      }
      personal.mistypedWords = Array.from(map.values()).sort(
        (a, b) => b.errorCount - a.errorCount
      );
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (personal.lastActiveDate === todayStr) {
      personal.dailyPracticeMinutes += Math.round(attempt.elapsedSeconds / 60);
    } else {
      personal.lastActiveDate = todayStr;
      personal.dailyPracticeMinutes = Math.round(attempt.elapsedSeconds / 60);
    }

    this.saveUserPersonalData(attempt.userId, personal);
  }

  static saveAttempt(attempt: TypingAttemptResult) {
    this.recordAttempt(attempt);
  }

  static getCompletedLessons(userId: string): string[] {
    return this.getUserPersonalData(userId).completedLessonIds;
  }

  static markLessonCompleted(userId: string, lessonId: string) {
    const personal = this.getUserPersonalData(userId);
    if (!personal.completedLessonIds.includes(lessonId)) {
      personal.completedLessonIds.push(lessonId);
      this.saveUserPersonalData(userId, personal);
    }
  }

  static getMistypedWords(userId: string): MistypedWordRecord[] {
    return this.getUserPersonalData(userId).mistypedWords;
  }

  static saveMistypedWords(userId: string, words: MistypedWordRecord[]) {
    const personal = this.getUserPersonalData(userId);
    personal.mistypedWords = words;
    this.saveUserPersonalData(userId, personal);
  }

  static addMistypedWords(
    userId: string,
    words: string[],
    layoutId: KeyboardLayoutId
  ) {
    const personal = this.getUserPersonalData(userId);
    const map = new Map<string, MistypedWordRecord>(
      personal.mistypedWords.map((m) => [m.word, m])
    );
    for (const w of words) {
      const existing = map.get(w);
      if (existing) {
        map.set(w, {
          ...existing,
          errorCount: existing.errorCount + 1,
          lastMistypedAt: new Date().toISOString(),
        });
      } else {
        map.set(w, {
          word: w,
          errorCount: 1,
          masteredCount: 0,
          lastMistypedAt: new Date().toISOString(),
          layoutId,
        });
      }
    }
    personal.mistypedWords = Array.from(map.values()).sort(
      (a, b) => b.errorCount - a.errorCount
    );
    this.saveUserPersonalData(userId, personal);
  }

  // Platform-wide Curriculum & Passages & Exam Presets
  static getLessons(): LessonItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_CURRICULUM_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_LESSONS;
    } catch {
      return DEFAULT_LESSONS;
    }
  }

  static saveLessons(lessons: LessonItem[]) {
    localStorage.setItem(STORAGE_CURRICULUM_KEY, JSON.stringify(lessons));
  }

  static getPassages(): PracticePassage[] {
    try {
      const raw = localStorage.getItem(STORAGE_PASSAGES_KEY);
      return raw ? JSON.parse(raw) : PRACTICE_PASSAGES;
    } catch {
      return PRACTICE_PASSAGES;
    }
  }

  static savePassages(passages: PracticePassage[]) {
    localStorage.setItem(STORAGE_PASSAGES_KEY, JSON.stringify(passages));
  }

  static getExamPresets(): ExamPreset[] {
    try {
      const raw = localStorage.getItem(STORAGE_EXAM_PRESETS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_EXAM_PRESETS;
    } catch {
      return DEFAULT_EXAM_PRESETS;
    }
  }

  static saveExamPresets(presets: ExamPreset[]) {
    localStorage.setItem(STORAGE_EXAM_PRESETS_KEY, JSON.stringify(presets));
  }

  // Platform Admin Usage Statistics
  static getPlatformStats() {
    const users = this.getUsers();
    const attempts = this.getAllAttempts();
    const lessons = this.getLessons();
    const passages = this.getPassages();
    const examPresets = this.getExamPresets();

    const totalSeconds = attempts.reduce((acc, a) => acc + a.elapsedSeconds, 0);
    const avgNetWpm =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((acc, a) => acc + a.netWpm, 0) / attempts.length) * 10
          ) / 10
        : 0;
    const avgAccuracy =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((acc, a) => acc + a.accuracy, 0) / attempts.length) * 10
          ) / 10
        : 100;

    const layoutCounts: Record<KeyboardLayoutId, number> = {
      inscript: 0,
      'remington-gail': 0,
      'remington-cbi': 0,
      'krutidev-010': 0,
      phonetic: 0,
    };
    for (const a of attempts) {
      if (layoutCounts[a.layoutId] !== undefined) {
        layoutCounts[a.layoutId]++;
      }
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const testsToday = attempts.filter((a) => a.timestamp.startsWith(todayStr)).length;

    return {
      totalUsers: users.length,
      totalAttempts: attempts.length,
      totalPracticeHours: Math.round((totalSeconds / 3600) * 10) / 10,
      avgNetWpm,
      avgAccuracy,
      testsToday,
      totalLessons: lessons.length,
      totalPassages: passages.length,
      totalExamPresets: examPresets.length,
      layoutCounts,
    };
  }

  // Platform Factory Reset
  static resetToFactoryDefaults() {
    localStorage.removeItem(STORAGE_USERS_KEY);
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    localStorage.removeItem(STORAGE_CURRICULUM_KEY);
    localStorage.removeItem(STORAGE_PASSAGES_KEY);
    localStorage.removeItem(STORAGE_EXAM_PRESETS_KEY);
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
    this.init();
  }
}
