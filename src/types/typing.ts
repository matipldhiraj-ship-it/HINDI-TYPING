export type KeyboardLayoutId =
  | 'inscript'
  | 'remington-gail'
  | 'remington-cbi'
  | 'krutidev-010'
  | 'phonetic';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumbs'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export type BackspacePolicy = 'full' | 'current-word' | 'disabled';

export type ScoringFormulaType =
  | 'standard-5char' // 5 keystrokes = 1 word
  | 'ssc-penalty' // 5 keystrokes = 1 word, threshold penalty
  | 'cpct-net' // Word-based Net WPM
  | 'highcourt-word'; // Full & half mistake deductions

export interface PhysicalKeyDef {
  code: string;
  qwertyNormal: string;
  qwertyShift: string;
  row: 0 | 1 | 2 | 3 | 4;
  finger: FingerId;
  width?: number;
}

export interface LayoutKeyGlyph {
  normal: string;
  shift: string;
  altGr?: string;
  legacyNormalCode?: string;
  legacyShiftCode?: string;
  note?: string;
}

export interface MultiKeySequenceDef {
  keys: Array<{ code: string; shift?: boolean; label: string }>;
  explanation: string;
}

export interface KeyboardLayoutSpec {
  id: KeyboardLayoutId;
  name: string;
  shortName: string;
  encodingType: 'unicode' | 'legacy-font-mapped' | 'phonetic-transliteration';
  badgeText: string;
  description: string;
  examRelevance: string[];
  isLegacyFont: boolean;
  architectureNote: string;
  keys: Record<string, LayoutKeyGlyph>;
  multiKeySequences: Record<string, MultiKeySequenceDef>;
}

export interface NextKeyGuidance {
  targetChar: string;
  targetCluster: string;
  code: string;
  shift: boolean;
  qwertyLabel: string;
  hindiLabel: string;
  finger: FingerId;
  sequenceStep?: string;
  legacyRawChar?: string;
}

export interface LessonItem {
  id: string;
  stageNumber: number; // 1 to 12
  stageTitle: string;
  lessonNumber: number;
  title: string;
  hindiTitle: string;
  objective: string;
  focusKeys: string[];
  targetText: string;
  layoutTargetText?: Partial<Record<KeyboardLayoutId, string>>;
  minAccuracy: number;
  minWpm: number;
  isTimed: boolean;
  durationSeconds?: number;
  backspacePolicy: BackspacePolicy;
  category:
    | 'orientation'
    | 'home-row'
    | 'upper-row'
    | 'lower-row'
    | 'shift-special'
    | 'vowels-matras'
    | 'halant-conjuncts'
    | 'words'
    | 'sentences'
    | 'paragraphs'
    | 'speed-drills'
    | 'exam-simulation';
}

export interface MatraConjunctDrill {
  id: string;
  title: string;
  hindiTitle: string;
  group: 'swar-matra' | 'halant-half' | 'repha-rakara' | 'samyukta-akshara';
  description: string;
  tokens: Array<{
    hindi: string;
    name: string;
    inscriptKeys: string;
    remingtonKeys: string;
    krutidevKeys: string;
  }>;
  practiceText: string;
}

export interface PracticePassage {
  id: string;
  title: string;
  category: 'words' | 'sentences' | 'paragraphs' | 'editorial' | 'official-letter';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Exam-Grade';
  wordCount: number;
  charCount: number;
  text: string;
  createdAt?: string;
}

export interface ExamPreset {
  id: string;
  name: string;
  organization: string;
  allowedLayouts: KeyboardLayoutId[];
  defaultLayout: KeyboardLayoutId;
  durationMinutes: number;
  minNetWpm: number;
  minAccuracy: number;
  maxAllowedErrorPercent: number;
  backspacePolicy: BackspacePolicy;
  scoringFormula: ScoringFormulaType;
  formulaDescription: string;
  officialDisclaimer: string;
  passageId: string;
  customPassageText?: string;
  createdAt?: string;
}

export interface TypingAttemptResult {
  id: string;
  userId: string;
  timestamp: string;
  mode:
    | 'lesson'
    | 'matra-drill'
    | 'word-sentence'
    | 'paragraph'
    | 'timed-test'
    | 'mistyped-drill'
    | 'exam-simulator';
  referenceId: string;
  title: string;
  layoutId: KeyboardLayoutId;
  durationSeconds: number;
  elapsedSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctChars: number;
  incorrectChars: number;
  backspaceCount: number;
  mistypedWords: Array<{ expected: string; typed: string; count: number }>;
  difficultChars: Array<{ char: string; errors: number }>;
  scoringFormulaUsed: ScoringFormulaType;
  passed: boolean;
  passReason: string;
  examPresetId?: string;
}

export interface MistypedWordRecord {
  word: string;
  errorCount: number;
  masteredCount: number;
  lastMistypedAt: string;
  layoutId: KeyboardLayoutId;
  hintSequence?: string;
}

export type UserRole = 'guest' | 'learner' | 'admin';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash?: string; // Plaintext or salt-hash in simulation
  createdAt: string;
  lastLoginAt: string;
  targetExam?: string;
  preferredLayout: KeyboardLayoutId;
  dailyGoalMinutes: number;
  soundEnabled: boolean;
  showVirtualKeyboard: boolean;
  showFingerGuide: boolean;
  unlockAllLessons: boolean;
  remindersEnabled?: boolean;
  reminderTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  lastReminderDismissedDate?: string;
}

export interface LayoutSelfTestResult {
  layoutId: KeyboardLayoutId;
  testName: string;
  keySequenceDescription: string;
  expectedUnicode: string;
  actualUnicode: string;
  legacyStream?: string;
  passed: boolean;
}

export type ScreenId =
  | 'landing'
  | 'dashboard'
  | 'layouts'
  | 'curriculum'
  | 'lesson'
  | 'keyboard-guide'
  | 'matra-conjunct'
  | 'words-sentences'
  | 'paragraphs'
  | 'timed-test'
  | 'results'
  | 'mistyped-words'
  | 'progress'
  | 'exam-simulator'
  | 'admin';
