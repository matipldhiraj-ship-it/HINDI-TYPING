import {
  FingerId,
  KeyboardLayoutId,
  KeyboardLayoutSpec,
  LayoutSelfTestResult,
  NextKeyGuidance,
  PhysicalKeyDef,
} from '../types/typing';

export const FINGER_METADATA: Record<
  FingerId,
  {
    label: string;
    hindiLabel: string;
    hand: 'Left Hand (बायाँ हाथ)' | 'Right Hand (दायाँ हाथ)' | 'Both Thumbs (अंगूठे)';
    shortCode: string;
    colorClass: string;
    badgeBg: string;
  }
> = {
  'left-pinky': {
    label: 'Left Pinky',
    hindiLabel: 'बायाँ कनिष्ठा',
    hand: 'Left Hand (बायाँ हाथ)',
    shortCode: 'LP',
    colorClass: 'border-rose-500 text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-500/15',
  },
  'left-ring': {
    label: 'Left Ring',
    hindiLabel: 'बायाँ अनामिका',
    hand: 'Left Hand (बायाँ हाथ)',
    shortCode: 'LR',
    colorClass: 'border-amber-500 text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-500/15',
  },
  'left-middle': {
    label: 'Left Middle',
    hindiLabel: 'बायाँ मध्यमा',
    hand: 'Left Hand (बायाँ हाथ)',
    shortCode: 'LM',
    colorClass: 'border-emerald-500 text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-500/15',
  },
  'left-index': {
    label: 'Left Index',
    hindiLabel: 'बायाँ तर्जनी',
    hand: 'Left Hand (बायाँ हाथ)',
    shortCode: 'LI',
    colorClass: 'border-sky-500 text-sky-700 dark:text-sky-300',
    badgeBg: 'bg-sky-500/15',
  },
  thumbs: {
    label: 'Thumb (Spacebar)',
    hindiLabel: 'अंगूठा (स्पेसबार)',
    hand: 'Both Thumbs (अंगूठे)',
    shortCode: 'TH',
    colorClass: 'border-slate-500 text-slate-700 dark:text-slate-300',
    badgeBg: 'bg-slate-500/15',
  },
  'right-index': {
    label: 'Right Index',
    hindiLabel: 'दायाँ तर्जनी',
    hand: 'Right Hand (दायाँ हाथ)',
    shortCode: 'RI',
    colorClass: 'border-cyan-500 text-cyan-700 dark:text-cyan-300',
    badgeBg: 'bg-cyan-500/15',
  },
  'right-middle': {
    label: 'Right Middle',
    hindiLabel: 'दायाँ मध्यमा',
    hand: 'Right Hand (दायाँ हाथ)',
    shortCode: 'RM',
    colorClass: 'border-teal-500 text-teal-700 dark:text-teal-300',
    badgeBg: 'bg-teal-500/15',
  },
  'right-ring': {
    label: 'Right Ring',
    hindiLabel: 'दायाँ अनामिका',
    hand: 'Right Hand (दायाँ हाथ)',
    shortCode: 'RR',
    colorClass: 'border-orange-500 text-orange-700 dark:text-orange-300',
    badgeBg: 'bg-orange-500/15',
  },
  'right-pinky': {
    label: 'Right Pinky',
    hindiLabel: 'दायाँ कनिष्ठा',
    hand: 'Right Hand (दायाँ हाथ)',
    shortCode: 'RP',
    colorClass: 'border-pink-500 text-pink-700 dark:text-pink-300',
    badgeBg: 'bg-pink-500/15',
  },
};

export const PHYSICAL_KEYBOARD_ROWS: PhysicalKeyDef[][] = [
  // Row 0: Number row
  [
    { code: 'Backquote', qwertyNormal: '`', qwertyShift: '~', row: 0, finger: 'left-pinky' },
    { code: 'Digit1', qwertyNormal: '1', qwertyShift: '!', row: 0, finger: 'left-pinky' },
    { code: 'Digit2', qwertyNormal: '2', qwertyShift: '@', row: 0, finger: 'left-ring' },
    { code: 'Digit3', qwertyNormal: '3', qwertyShift: '#', row: 0, finger: 'left-middle' },
    { code: 'Digit4', qwertyNormal: '4', qwertyShift: '$', row: 0, finger: 'left-index' },
    { code: 'Digit5', qwertyNormal: '5', qwertyShift: '%', row: 0, finger: 'left-index' },
    { code: 'Digit6', qwertyNormal: '6', qwertyShift: '^', row: 0, finger: 'right-index' },
    { code: 'Digit7', qwertyNormal: '7', qwertyShift: '&', row: 0, finger: 'right-index' },
    { code: 'Digit8', qwertyNormal: '8', qwertyShift: '*', row: 0, finger: 'right-middle' },
    { code: 'Digit9', qwertyNormal: '9', qwertyShift: '(', row: 0, finger: 'right-ring' },
    { code: 'Digit0', qwertyNormal: '0', qwertyShift: ')', row: 0, finger: 'right-pinky' },
    { code: 'Minus', qwertyNormal: '-', qwertyShift: '_', row: 0, finger: 'right-pinky' },
    { code: 'Equal', qwertyNormal: '=', qwertyShift: '+', row: 0, finger: 'right-pinky' },
  ],
  // Row 1: Upper QWERTY row
  [
    { code: 'KeyQ', qwertyNormal: 'q', qwertyShift: 'Q', row: 1, finger: 'left-pinky' },
    { code: 'KeyW', qwertyNormal: 'w', qwertyShift: 'W', row: 1, finger: 'left-ring' },
    { code: 'KeyE', qwertyNormal: 'e', qwertyShift: 'E', row: 1, finger: 'left-middle' },
    { code: 'KeyR', qwertyNormal: 'r', qwertyShift: 'R', row: 1, finger: 'left-index' },
    { code: 'KeyT', qwertyNormal: 't', qwertyShift: 'T', row: 1, finger: 'left-index' },
    { code: 'KeyY', qwertyNormal: 'y', qwertyShift: 'Y', row: 1, finger: 'right-index' },
    { code: 'KeyU', qwertyNormal: 'u', qwertyShift: 'U', row: 1, finger: 'right-index' },
    { code: 'KeyI', qwertyNormal: 'i', qwertyShift: 'I', row: 1, finger: 'right-middle' },
    { code: 'KeyO', qwertyNormal: 'o', qwertyShift: 'O', row: 1, finger: 'right-ring' },
    { code: 'KeyP', qwertyNormal: 'p', qwertyShift: 'P', row: 1, finger: 'right-pinky' },
    { code: 'BracketLeft', qwertyNormal: '[', qwertyShift: '{', row: 1, finger: 'right-pinky' },
    { code: 'BracketRight', qwertyNormal: ']', qwertyShift: '}', row: 1, finger: 'right-pinky' },
    { code: 'Backslash', qwertyNormal: '\\', qwertyShift: '|', row: 1, finger: 'right-pinky' },
  ],
  // Row 2: Home row
  [
    { code: 'KeyA', qwertyNormal: 'a', qwertyShift: 'A', row: 2, finger: 'left-pinky' },
    { code: 'KeyS', qwertyNormal: 's', qwertyShift: 'S', row: 2, finger: 'left-ring' },
    { code: 'KeyD', qwertyNormal: 'd', qwertyShift: 'D', row: 2, finger: 'left-middle' },
    { code: 'KeyF', qwertyNormal: 'f', qwertyShift: 'F', row: 2, finger: 'left-index' },
    { code: 'KeyG', qwertyNormal: 'g', qwertyShift: 'G', row: 2, finger: 'left-index' },
    { code: 'KeyH', qwertyNormal: 'h', qwertyShift: 'H', row: 2, finger: 'right-index' },
    { code: 'KeyJ', qwertyNormal: 'j', qwertyShift: 'J', row: 2, finger: 'right-index' },
    { code: 'KeyK', qwertyNormal: 'k', qwertyShift: 'K', row: 2, finger: 'right-middle' },
    { code: 'KeyL', qwertyNormal: 'l', qwertyShift: 'L', row: 2, finger: 'right-ring' },
    { code: 'Semicolon', qwertyNormal: ';', qwertyShift: ':', row: 2, finger: 'right-pinky' },
    { code: 'Quote', qwertyNormal: "'", qwertyShift: '"', row: 2, finger: 'right-pinky' },
  ],
  // Row 3: Lower row
  [
    { code: 'KeyZ', qwertyNormal: 'z', qwertyShift: 'Z', row: 3, finger: 'left-pinky' },
    { code: 'KeyX', qwertyNormal: 'x', qwertyShift: 'X', row: 3, finger: 'left-ring' },
    { code: 'KeyC', qwertyNormal: 'c', qwertyShift: 'C', row: 3, finger: 'left-middle' },
    { code: 'KeyV', qwertyNormal: 'v', qwertyShift: 'V', row: 3, finger: 'left-index' },
    { code: 'KeyB', qwertyNormal: 'b', qwertyShift: 'B', row: 3, finger: 'left-index' },
    { code: 'KeyN', qwertyNormal: 'n', qwertyShift: 'N', row: 3, finger: 'right-index' },
    { code: 'KeyM', qwertyNormal: 'm', qwertyShift: 'M', row: 3, finger: 'right-index' },
    { code: 'Comma', qwertyNormal: ',', qwertyShift: '<', row: 3, finger: 'right-middle' },
    { code: 'Period', qwertyNormal: '.', qwertyShift: '>', row: 3, finger: 'right-ring' },
    { code: 'Slash', qwertyNormal: '/', qwertyShift: '?', row: 3, finger: 'right-pinky' },
  ],
];

export const PHYSICAL_KEY_MAP: Record<string, PhysicalKeyDef> = {};
for (const row of PHYSICAL_KEYBOARD_ROWS) {
  for (const key of row) {
    PHYSICAL_KEY_MAP[key.code] = key;
  }
}
PHYSICAL_KEY_MAP['Space'] = {
  code: 'Space',
  qwertyNormal: 'Space',
  qwertyShift: 'Space',
  row: 4,
  finger: 'thumbs',
  width: 6,
};

// ============================================================================
// 1. UNICODE HINDI INSCRIPT LAYOUT
// ============================================================================
const INSCRIPT_LAYOUT: KeyboardLayoutSpec = {
  id: 'inscript',
  name: 'Unicode Hindi InScript (Standard)',
  shortName: 'InScript Unicode',
  encodingType: 'unicode',
  badgeText: 'Unicode Logical Order',
  description:
    'Official Government of India standardized Devanagari layout. Left hand controls vowels and matras; right hand controls consonants in phonetic Varga groups.',
  examRelevance: ['SSC CHSL / CGL', 'Central Govt Ministries', 'KVS / NVS', 'DSSSB', 'AIIMS'],
  isLegacyFont: false,
  architectureNote:
    'InScript uses logical Unicode order: you always type the base consonant first, followed by its matra (e.g., क + ि = कि) or halant (्) + second consonant for conjuncts (क् + ष = क्ष).',
  keys: {
    Backquote: { normal: 'ൊ', shift: 'औ' },
    Digit1: { normal: '1', shift: 'ऍ' },
    Digit2: { normal: '2', shift: 'ॅ' },
    Digit3: { normal: '3', shift: '्र', note: 'Rakara conjunct (प्र, क्र)' },
    Digit4: { normal: '4', shift: 'र्', note: 'Repha conjunct (कर्म)' },
    Digit5: { normal: '5', shift: 'ज्ञ', note: 'Direct ज्ञ (ज् + ञ)' },
    Digit6: { normal: '6', shift: 'त्र', note: 'Direct त्र (त् + र)' },
    Digit7: { normal: '7', shift: 'क्ष', note: 'Direct क्ष (क् + ष)' },
    Digit8: { normal: '8', shift: 'श्र', note: 'Direct श्र (श् + र)' },
    Digit9: { normal: '(', shift: '(' },
    Digit0: { normal: ')', shift: ')' },
    Minus: { normal: '-', shift: 'ः' },
    Equal: { normal: 'ृ', shift: 'ऋ' },

    KeyQ: { normal: 'ौ', shift: 'औ' },
    KeyW: { normal: 'ै', shift: 'ऐ' },
    KeyE: { normal: 'ा', shift: 'आ' },
    KeyR: { normal: 'ी', shift: 'ई' },
    KeyT: { normal: 'ू', shift: 'ऊ' },
    KeyY: { normal: 'ब', shift: 'भ' },
    KeyU: { normal: 'ह', shift: 'ङ' },
    KeyI: { normal: 'ग', shift: 'घ' },
    KeyO: { normal: 'द', shift: 'ध' },
    KeyP: { normal: 'ज', shift: 'झ' },
    BracketLeft: { normal: 'ड', shift: 'ढ' },
    BracketRight: { normal: '़', shift: 'ञ' },
    Backslash: { normal: 'ॉ', shift: 'ऑ' },

    KeyA: { normal: 'ो', shift: 'ओ' },
    KeyS: { normal: 'े', shift: 'ए' },
    KeyD: { normal: '्', shift: 'अ', note: 'Halant (्) on normal, अ on Shift' },
    KeyF: { normal: 'ि', shift: 'इ' },
    KeyG: { normal: 'ु', shift: 'उ' },
    KeyH: { normal: 'प', shift: 'फ' },
    KeyJ: { normal: 'र', shift: 'ऱ' },
    KeyK: { normal: 'क', shift: 'ख' },
    KeyL: { normal: 'त', shift: 'थ' },
    Semicolon: { normal: 'च', shift: 'छ' },
    Quote: { normal: 'ट', shift: 'ठ' },

    KeyZ: { normal: 'ॆ', shift: 'ऎ' },
    KeyX: { normal: 'ं', shift: 'ँ' },
    KeyC: { normal: 'म', shift: 'ण' },
    KeyV: { normal: 'न', shift: 'ऩ' },
    KeyB: { normal: 'व', shift: 'ळ' },
    KeyN: { normal: 'ल', shift: 'ळ' },
    KeyM: { normal: 'स', shift: 'श' },
    Comma: { normal: ',', shift: 'ष' },
    Period: { normal: '.', shift: '।' },
    Slash: { normal: 'य', shift: '?' },
    Space: { normal: ' ', shift: ' ' },
  },
  multiKeySequences: {
    'क्ष': {
      keys: [{ code: 'Digit7', shift: true, label: 'Shift + 7 (&)' }],
      explanation: 'Press Shift+7 directly for क्ष, or type क (k) + ् (d) + ष (Shift+,).',
    },
    'त्र': {
      keys: [{ code: 'Digit6', shift: true, label: 'Shift + 6 (^)' }],
      explanation: 'Press Shift+6 directly for त्र, or type त (l) + ् (d) + र (j).',
    },
    'ज्ञ': {
      keys: [{ code: 'Digit5', shift: true, label: 'Shift + 5 (%)' }],
      explanation: 'Press Shift+5 directly for ज्ञ, or type ज (p) + ् (d) + ञ (Shift+]).',
    },
    'श्र': {
      keys: [{ code: 'Digit8', shift: true, label: 'Shift + 8 (*)' }],
      explanation: 'Press Shift+8 directly for श्र, or type श (Shift+m) + ् (d) + र (j).',
    },
    'प्र': {
      keys: [
        { code: 'KeyH', label: 'h (प)' },
        { code: 'KeyD', label: 'd (्)' },
        { code: 'KeyJ', label: 'j (र)' },
      ],
      explanation: 'Type प (h) + Halant ् (d) + र (j), or प (h) + Shift+3 (्र).',
    },
  },
};

// ============================================================================
// 2. UNICODE HINDI REMINGTON GAIL LAYOUT
// ============================================================================
const REMINGTON_GAIL_KEYS: Record<string, { normal: string; shift: string; note?: string }> = {
  Backquote: { normal: 'ृ', shift: '्', note: 'Ri matra (ृ) / Halant (्)' },
  Digit1: { normal: '।', shift: '!' },
  Digit2: { normal: '/', shift: '/' },
  Digit3: { normal: 'ः', shift: 'रु' },
  Digit4: { normal: '*', shift: '+' },
  Digit5: { normal: '-', shift: 'ः' },
  Digit6: { normal: "'", shift: '"' },
  Digit7: { normal: '-', shift: '÷' },
  Digit8: { normal: 'द्ध', shift: '×' },
  Digit9: { normal: 'त्र', shift: '(' },
  Digit0: { normal: 'ऋ', shift: ')' },
  Minus: { normal: ';', shift: 'ं' },
  Equal: { normal: 'ृ', shift: 'त्र' },

  KeyQ: { normal: 'ु', shift: 'फ' },
  KeyW: { normal: 'ू', shift: 'ॅ' },
  KeyE: { normal: 'म', shift: 'म्' },
  KeyR: { normal: 'त', shift: 'त्' },
  KeyT: { normal: 'ज', shift: 'ज्' },
  KeyY: { normal: 'ल', shift: 'ल्' },
  KeyU: { normal: 'न', shift: 'न्' },
  KeyI: { normal: 'प', shift: 'प्' },
  KeyO: { normal: 'व', shift: 'व्' },
  KeyP: { normal: 'च', shift: 'च्' },
  BracketLeft: { normal: 'ख्', shift: 'क्ष्', note: 'Type ख् ([) + ा (k) -> ख' },
  BracketRight: { normal: ',', shift: 'द्व' },
  Backslash: { normal: '।', shift: '्र' },

  KeyA: { normal: 'ं', shift: '।', note: 'Anusvara (ं) / Purnavirama (।)' },
  KeyS: { normal: 'े', shift: 'ै' },
  KeyD: { normal: 'क', shift: 'क्' },
  KeyF: {
    normal: 'ि',
    shift: 'थ्',
    note: 'Pre-base ि: type f BEFORE consonant (e.g. f + d = कि)',
  },
  KeyG: { normal: 'ह', shift: 'ळ' },
  KeyH: { normal: 'ी', shift: 'भ्', note: 'Badi ी (h) / Half भ् (Shift+H + k = भ)' },
  KeyJ: { normal: 'र', shift: 'श्र' },
  KeyK: {
    normal: 'ा',
    shift: 'ज्ञ',
    note: 'Aa matra (ा) & completes half-letters (ख् + k = ख)',
  },
  KeyL: { normal: 'स', shift: 'स्' },
  Semicolon: { normal: 'य', shift: 'रू' },
  Quote: { normal: 'श्', shift: 'ष्', note: "Type श् (') + ा (k) -> श" },

  KeyZ: {
    normal: '्र',
    shift: 'र्',
    note: 'z = Rakara (प्र), Shift+Z = Repha (कर्म - type after consonant)',
  },
  KeyX: { normal: 'ग', shift: 'ग्' },
  KeyC: { normal: 'ब', shift: 'ब्' },
  KeyV: { normal: 'अ', shift: 'ट', note: 'v = अ (v + k = आ)' },
  KeyB: { normal: 'इ', shift: 'ठ', note: 'b = इ (b + Shift+Z = ई)' },
  KeyN: { normal: 'द', shift: 'छ' },
  KeyM: { normal: 'उ', shift: 'ड', note: 'm = उ (m + Shift+Q = ऊ)' },
  Comma: { normal: 'ए', shift: 'ढ', note: ', = ए (, + s = ऐ)' },
  Period: { normal: 'ण्', shift: 'झ', note: 'Type ण् (.) + ा (k) -> ण' },
  Slash: { normal: 'ध्', shift: 'घ्', note: 'Type ध् (/) + ा (k) -> ध; Shift+/ + k -> घ' },
  Space: { normal: ' ', shift: ' ' },
};

const REMINGTON_GAIL_LAYOUT: KeyboardLayoutSpec = {
  id: 'remington-gail',
  name: 'Unicode Hindi Remington GAIL',
  shortName: 'Remington GAIL',
  encodingType: 'unicode',
  badgeText: 'Typewriter Visual-to-Unicode',
  description:
    'Standard Remington typewriter layout over Unicode Devanagari used in MP CPCT, UPSSSC, and Rajasthan LDC exams. Supports visual-order pre-base ि (f) and half-letter + ा (k) fusion.',
  examRelevance: ['MP CPCT', 'UPSSSC Junior Assistant', 'Rajasthan RSSB LDC', 'UP Police ASI'],
  isLegacyFont: false,
  architectureNote:
    'Remington GAIL maps typewriter keystrokes into normalized Unicode Devanagari: (1) Type f (ि) BEFORE the consonant (f + d -> कि), (2) Combine half-letters with k (ा) to form full letters (ख् [ + k -> ख, ध् / + k -> ध), and (3) Type Shift+Z (र्) AFTER the consonant for top Repha (d + e + Shift+Z -> कर्म).',
  keys: REMINGTON_GAIL_KEYS,
  multiKeySequences: {
    'आ': {
      keys: [
        { code: 'KeyV', label: 'v (अ)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type अ (v) followed by ा (k) to produce आ.',
    },
    'ई': {
      keys: [
        { code: 'KeyB', label: 'b (इ)' },
        { code: 'KeyZ', shift: true, label: 'Shift+Z (र्)' },
      ],
      explanation: 'Type इ (b) followed by Shift+Z to produce ई.',
    },
    'ऊ': {
      keys: [
        { code: 'KeyM', label: 'm (उ)' },
        { code: 'KeyQ', shift: true, label: 'Shift+Q' },
      ],
      explanation: 'Type उ (m) followed by Shift+Q (or w) to produce ऊ.',
    },
    'ऐ': {
      keys: [
        { code: 'Comma', label: ', (ए)' },
        { code: 'KeyS', label: 's (े)' },
      ],
      explanation: 'Type ए (,) followed by े (s) to produce ऐ.',
    },
    'ओ': {
      keys: [
        { code: 'KeyV', label: 'v (अ)' },
        { code: 'KeyK', label: 'k (ा)' },
        { code: 'KeyS', label: 's (े)' },
      ],
      explanation: 'Type अ (v) + ा (k) + े (s) to produce ओ.',
    },
    'औ': {
      keys: [
        { code: 'KeyV', label: 'v (अ)' },
        { code: 'KeyK', label: 'k (ा)' },
        { code: 'KeyS', shift: true, label: 'Shift+S (ै)' },
      ],
      explanation: 'Type अ (v) + ा (k) + ै (Shift+S) to produce औ.',
    },
    'ख': {
      keys: [
        { code: 'BracketLeft', label: '[ (ख्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half ख् ([) followed by k (ा) to form full ख.',
    },
    'घ': {
      keys: [
        { code: 'Slash', shift: true, label: 'Shift+/ (घ्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half घ् (Shift+/) followed by k (ा) to form full घ.',
    },
    'थ': {
      keys: [
        { code: 'KeyF', shift: true, label: 'Shift+F (थ्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half थ् (Shift+F) followed by k (ा) to form full थ.',
    },
    'ध': {
      keys: [
        { code: 'Slash', label: '/ (ध्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half ध् (/) followed by k (ा) to form full ध.',
    },
    'भ': {
      keys: [
        { code: 'KeyH', shift: true, label: 'Shift+H (भ्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half भ् (Shift+H) followed by k (ा) to form full भ.',
    },
    'श': {
      keys: [
        { code: 'Quote', label: "' (श्)" },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: "Type half श् (') followed by k (ा) to form full श.",
    },
    'ष': {
      keys: [
        { code: 'Quote', shift: true, label: 'Shift+\' (ष्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half ष् (Shift+\') followed by k (ा) to form full ष.',
    },
    'ण': {
      keys: [
        { code: 'Period', label: '. (ण्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half ण् (.) followed by k (ा) to form full ण.',
    },
    'क्ष': {
      keys: [
        { code: 'BracketLeft', shift: true, label: 'Shift+[ (क्ष्)' },
        { code: 'KeyK', label: 'k (ा)' },
      ],
      explanation: 'Type half क्ष् (Shift+[) followed by k (ा) to form full क्ष.',
    },
  },
};

// ============================================================================
// 3. UNICODE HINDI REMINGTON CBI LAYOUT
// ============================================================================
const REMINGTON_CBI_LAYOUT: KeyboardLayoutSpec = {
  ...REMINGTON_GAIL_LAYOUT,
  id: 'remington-cbi',
  name: 'Unicode Hindi Remington CBI',
  shortName: 'Remington CBI',
  encodingType: 'unicode',
  badgeText: 'Remington CBI Variant',
  description:
    'Central Bureau of Investigation / Central Secretariat Remington Unicode variant. Shares home/upper/lower core keys with GAIL while differing on top-row symbol and special conjunct placements.',
  examRelevance: ['CBI / IB Steno & Clerk', 'High Court Typing Tests', 'State Secretariat Exams'],
  architectureNote:
    'Remington CBI uses the same core home/upper/lower Remington typewriter keys as GAIL, with top-row variations on Digit1–Digit0 and Backslash for punctuation and special ligatures.',
  keys: {
    ...REMINGTON_GAIL_KEYS,
    Digit1: { normal: '।', shift: '!' },
    Digit2: { normal: '/', shift: '@' },
    Digit3: { normal: 'ः', shift: '्र' },
    Digit4: { normal: '*', shift: 'र्' },
    Digit5: { normal: '-', shift: 'ज्ञ' },
    Digit6: { normal: "'", shift: 'त्र' },
    Digit7: { normal: 'द्ध', shift: 'क्ष' },
    Digit8: { normal: 'त्र', shift: 'श्र' },
    Digit9: { normal: '(', shift: '(' },
    Digit0: { normal: ')', shift: ')' },
    Minus: { normal: ';', shift: 'ः' },
    Equal: { normal: 'ृ', shift: 'ऋ' },
  },
};

// ============================================================================
// 4. KRUTI DEV 010 / DEVLYS LEGACY FONT ENCODING MODE
// ============================================================================
const KRUTIDEV_010_LAYOUT: KeyboardLayoutSpec = {
  id: 'krutidev-010',
  name: 'Kruti Dev 010 / DevLys (Legacy Font Mode)',
  shortName: 'Kruti Dev 010',
  encodingType: 'legacy-font-mapped',
  badgeText: 'Legacy ASCII-to-Unicode Engine',
  description:
    'Authentic Kruti Dev 010 / DevLys 010 legacy layout. Captures exact ASCII legacy key sequences (e.g., dke = काम, fdrkc = किताब), displays both the raw legacy code stream and converted Unicode Devanagari.',
  examRelevance: [
    'Bihar Beltron / BSSC',
    'UP High Court /UPPCL',
    'MP High Court',
    'Chhattisgarh Vyapam',
  ],
  isLegacyFont: true,
  architectureNote:
    'Unlike Unicode layouts, Kruti Dev 010 is a non-Unicode 8-bit font encoding where pressing "d" stores ASCII "d" and renders visually as "क". Our engine records your exact Kruti Dev ASCII keystrokes, validates legacy glyph rules (like typing "f" before "d" for "कि" = "fd", or "v" + "k" for "आ" = "vk"), and converts to Unicode Devanagari in real time.',
  keys: {
    ...REMINGTON_GAIL_KEYS,
    Backquote: {
      normal: 'ृ',
      shift: '्',
      legacyNormalCode: '`',
      legacyShiftCode: '~',
      note: 'Legacy ` = ृ, ~ = ् (Halant)',
    },
    KeyD: {
      normal: 'क',
      shift: 'क्',
      legacyNormalCode: 'd',
      legacyShiftCode: 'D',
    },
    KeyF: {
      normal: 'ि',
      shift: 'थ्',
      legacyNormalCode: 'f',
      legacyShiftCode: 'F',
      note: 'Legacy ASCII "f" = ि (typed BEFORE consonant: "fd" = कि)',
    },
    KeyK: {
      normal: 'ा',
      shift: 'ज्ञ',
      legacyNormalCode: 'k',
      legacyShiftCode: 'K',
      note: 'Legacy ASCII "k" = ा (completes half-letters: "[k" = ख)',
    },
  },
  multiKeySequences: REMINGTON_GAIL_LAYOUT.multiKeySequences,
};

// ============================================================================
// 5. PHONETIC HINDI TRANSLITERATION MODE
// ============================================================================
const PHONETIC_LAYOUT: KeyboardLayoutSpec = {
  id: 'phonetic',
  name: 'Phonetic Hindi (Roman-to-Devanagari Mode)',
  shortName: 'Phonetic Hindi',
  encodingType: 'phonetic-transliteration',
  badgeText: 'Transliteration Learning Mode',
  description:
    'Separate phonetic learning mode where English QWERTY keys map by sound (k -> क, kh -> ख, bharat -> भारत). Ideal for beginners learning Devanagari matra structure before transitioning to InScript or Remington.',
  examRelevance: ['General Digital Literacy', 'Personal & Editorial Writing', 'Devanagari Onboarding'],
  isLegacyFont: false,
  architectureNote:
    'Phonetic mode transliterates Roman syllables into Unicode Devanagari as you type. Note: Government speed exams require InScript, Remington GAIL/CBI, or Kruti Dev 010 rather than phonetic input.',
  keys: {
    Backquote: { normal: '़', shift: '~' },
    Digit1: { normal: '१', shift: '!' },
    Digit2: { normal: '२', shift: '@' },
    Digit3: { normal: '३', shift: '#' },
    Digit4: { normal: '४', shift: '₹' },
    Digit5: { normal: '५', shift: '%' },
    Digit6: { normal: '६', shift: 'ज्ञ' },
    Digit7: { normal: '७', shift: 'क्ष' },
    Digit8: { normal: '८', shift: 'श्र' },
    Digit9: { normal: '९', shift: '(' },
    Digit0: { normal: '०', shift: ')' },
    Minus: { normal: '-', shift: '_' },
    Equal: { normal: '=', shift: '+' },

    KeyQ: { normal: 'ट', shift: 'ठ' },
    KeyW: { normal: 'व', shift: 'औ' },
    KeyE: { normal: 'े / ए', shift: 'ै / ऐ' },
    KeyR: { normal: 'र', shift: 'ऋ / ृ' },
    KeyT: { normal: 'त', shift: 'थ' },
    KeyY: { normal: 'य', shift: 'ञ' },
    KeyU: { normal: 'ु / उ', shift: 'ू / ऊ' },
    KeyI: { normal: 'ि / इ', shift: 'ी / ई' },
    KeyO: { normal: 'ो / ओ', shift: 'ौ / औ' },
    KeyP: { normal: 'प', shift: 'फ' },
    BracketLeft: { normal: 'ड', shift: 'ढ' },
    BracketRight: { normal: '़', shift: 'ण' },
    Backslash: { normal: '।', shift: '॥' },

    KeyA: { normal: 'ा / अ', shift: 'आ' },
    KeyS: { normal: 'स', shift: 'श' },
    KeyD: { normal: 'द', shift: 'ध' },
    KeyF: { normal: '्', shift: 'फ' },
    KeyG: { normal: 'ग', shift: 'घ' },
    KeyH: { normal: 'ह', shift: 'ः' },
    KeyJ: { normal: 'ज', shift: 'झ' },
    KeyK: { normal: 'क', shift: 'ख' },
    KeyL: { normal: 'ल', shift: 'ळ' },
    Semicolon: { normal: ';', shift: ':' },
    Quote: { normal: "'", shift: '"' },

    KeyZ: { normal: 'ज़', shift: 'झ़' },
    KeyX: { normal: 'क्ष', shift: 'त्र' },
    KeyC: { normal: 'च', shift: 'छ' },
    KeyV: { normal: 'व', shift: 'ँ' },
    KeyB: { normal: 'ब', shift: 'भ' },
    KeyN: { normal: 'न', shift: 'ण' },
    KeyM: { normal: 'म', shift: 'ं' },
    Comma: { normal: ',', shift: 'ष' },
    Period: { normal: '।', shift: '.' },
    Slash: { normal: '/', shift: '?' },
    Space: { normal: ' ', shift: ' ' },
  },
  multiKeySequences: {
    'क': { keys: [{ code: 'KeyK', label: 'k' }], explanation: 'Press k for क.' },
    'का': {
      keys: [
        { code: 'KeyK', label: 'k (क)' },
        { code: 'KeyA', label: 'a (ा)' },
      ],
      explanation: 'Press k then a for का.',
    },
    'कि': {
      keys: [
        { code: 'KeyK', label: 'k (क)' },
        { code: 'KeyI', label: 'i (ि)' },
      ],
      explanation: 'Press k then i for कि.',
    },
  },
};

export const KEYBOARD_LAYOUTS: Record<KeyboardLayoutId, KeyboardLayoutSpec> = {
  inscript: INSCRIPT_LAYOUT,
  'remington-gail': REMINGTON_GAIL_LAYOUT,
  'remington-cbi': REMINGTON_CBI_LAYOUT,
  'krutidev-010': KRUTIDEV_010_LAYOUT,
  phonetic: PHONETIC_LAYOUT,
};

export const KEYBOARD_LAYOUT_LIST: KeyboardLayoutSpec[] = [
  INSCRIPT_LAYOUT,
  REMINGTON_GAIL_LAYOUT,
  REMINGTON_CBI_LAYOUT,
  KRUTIDEV_010_LAYOUT,
  PHONETIC_LAYOUT,
];

// ============================================================================
// ENGINE STATE & PHYSICAL KEYSTROKE COMPOSER
// ============================================================================
export interface ComposerState {
  unicodeText: string;
  legacyStream: string;
  pendingChhotiI: boolean;
}

export function createInitialComposerState(): ComposerState {
  return {
    unicodeText: '',
    legacyStream: '',
    pendingChhotiI: false,
  };
}

const DEVANAGARI_CONSONANT_REGEX = /[क-हक़-य़]/;
const DEVANAGARI_MATRA_REGEX = /[ा-ौृॄॅॉंँः़]/;

export function processPhysicalKeystroke(
  state: ComposerState,
  code: string,
  shiftKey: boolean,
  layoutId: KeyboardLayoutId
): ComposerState {
  const layout = KEYBOARD_LAYOUTS[layoutId];
  const keyDef = PHYSICAL_KEY_MAP[code];
  if (!layout || !keyDef) return state;

  const glyphDef = layout.keys[code];
  if (!glyphDef) return state;

  const rawLegacyKey = shiftKey ? keyDef.qwertyShift : keyDef.qwertyNormal;

  // 1. InScript
  if (layoutId === 'inscript') {
    const out = shiftKey ? glyphDef.shift : glyphDef.normal;
    return {
      unicodeText: (state.unicodeText + out).normalize('NFC'),
      legacyStream: state.legacyStream + rawLegacyKey,
      pendingChhotiI: false,
    };
  }

  // 2. Remington GAIL, CBI, Kruti Dev 010
  if (
    layoutId === 'remington-gail' ||
    layoutId === 'remington-cbi' ||
    layoutId === 'krutidev-010'
  ) {
    let text = state.unicodeText;
    let pendingI = state.pendingChhotiI;
    const nextLegacy = state.legacyStream + rawLegacyKey;

    if (code === 'Space') {
      if (pendingI) {
        text += 'ि';
        pendingI = false;
      }
      return {
        unicodeText: text + ' ',
        legacyStream: nextLegacy,
        pendingChhotiI: false,
      };
    }

    if (code === 'KeyF' && !shiftKey) {
      return {
        unicodeText: text,
        legacyStream: nextLegacy,
        pendingChhotiI: true,
      };
    }

    if (code === 'KeyK' && !shiftKey) {
      if (text.endsWith('्')) {
        const fullConsonantText = text.slice(0, -1);
        if (pendingI) {
          return {
            unicodeText: (fullConsonantText + 'ि').normalize('NFC'),
            legacyStream: nextLegacy,
            pendingChhotiI: false,
          };
        }
        return {
          unicodeText: fullConsonantText.normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      if (text.endsWith('अ')) {
        return {
          unicodeText: (text.slice(0, -1) + 'आ').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      return {
        unicodeText: (text + 'ा').normalize('NFC'),
        legacyStream: nextLegacy,
        pendingChhotiI: pendingI,
      };
    }

    if (code === 'KeyS' && !shiftKey) {
      if (text.endsWith('आ')) {
        return {
          unicodeText: (text.slice(0, -1) + 'ओ').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      if (text.endsWith('ए')) {
        return {
          unicodeText: (text.slice(0, -1) + 'ऐ').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
    }

    if (code === 'KeyS' && shiftKey) {
      if (text.endsWith('आ')) {
        return {
          unicodeText: (text.slice(0, -1) + 'औ').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      if (text.endsWith('ए')) {
        return {
          unicodeText: (text.slice(0, -1) + 'ऐ').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
    }

    if (code === 'KeyQ' && shiftKey && text.endsWith('उ')) {
      return {
        unicodeText: (text.slice(0, -1) + 'ऊ').normalize('NFC'),
        legacyStream: nextLegacy,
        pendingChhotiI: false,
      };
    }
    if (code === 'KeyW' && !shiftKey && text.endsWith('उ')) {
      return {
        unicodeText: (text.slice(0, -1) + 'ऊ').normalize('NFC'),
        legacyStream: nextLegacy,
        pendingChhotiI: false,
      };
    }

    if (code === 'KeyZ' && shiftKey) {
      if (text.endsWith('इ')) {
        return {
          unicodeText: (text.slice(0, -1) + 'ई').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      const rephaInserted = insertRephaBeforeLastSyllable(text);
      return {
        unicodeText: rephaInserted.normalize('NFC'),
        legacyStream: nextLegacy,
        pendingChhotiI: pendingI,
      };
    }

    const out = shiftKey ? glyphDef.shift : glyphDef.normal;

    if (pendingI) {
      if (out.endsWith('्') && out.length >= 2) {
        return {
          unicodeText: (text + out).normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: true,
        };
      }
      if (DEVANAGARI_CONSONANT_REGEX.test(out)) {
        return {
          unicodeText: (text + out + 'ि').normalize('NFC'),
          legacyStream: nextLegacy,
          pendingChhotiI: false,
        };
      }
      return {
        unicodeText: (text + 'ि' + out).normalize('NFC'),
        legacyStream: nextLegacy,
        pendingChhotiI: false,
      };
    }

    return {
      unicodeText: (text + out).normalize('NFC'),
      legacyStream: nextLegacy,
      pendingChhotiI: false,
    };
  }

  // 3. Phonetic
  if (layoutId === 'phonetic') {
    const out = processPhoneticKeystroke(state.unicodeText, code, shiftKey);
    return {
      unicodeText: out.normalize('NFC'),
      legacyStream: state.legacyStream + rawLegacyKey,
      pendingChhotiI: false,
    };
  }

  return state;
}

function insertRephaBeforeLastSyllable(text: string): string {
  if (!text) return 'र्';
  let idx = text.length - 1;
  while (idx >= 0 && DEVANAGARI_MATRA_REGEX.test(text[idx])) {
    idx--;
  }
  if (idx < 0) return 'र्' + text;

  if (DEVANAGARI_CONSONANT_REGEX.test(text[idx])) {
    while (idx >= 2 && text[idx - 1] === '्' && DEVANAGARI_CONSONANT_REGEX.test(text[idx - 2])) {
      idx -= 2;
    }
    return text.slice(0, idx) + 'र्' + text.slice(idx);
  }
  return text + 'र्';
}

function processPhoneticKeystroke(currentText: string, code: string, shift: boolean): string {
  if (code === 'Space') return currentText + ' ';
  const lastChar = currentText.slice(-1);
  const lastIsConsonant = DEVANAGARI_CONSONANT_REGEX.test(lastChar);

  if (code === 'KeyA') {
    if (shift) return currentText + (lastIsConsonant ? 'ा' : 'आ');
    if (lastChar === 'अ') return currentText.slice(0, -1) + 'आ';
    return currentText + (lastIsConsonant ? 'ा' : 'अ');
  }
  if (code === 'KeyI') {
    if (shift) return currentText + (lastIsConsonant ? 'ी' : 'ई');
    return currentText + (lastIsConsonant ? 'ि' : 'इ');
  }
  if (code === 'KeyU') {
    if (shift) return currentText + (lastIsConsonant ? 'ू' : 'ऊ');
    return currentText + (lastIsConsonant ? 'ु' : 'उ');
  }
  if (code === 'KeyE') {
    if (shift) return currentText + (lastIsConsonant ? 'ै' : 'ऐ');
    return currentText + (lastIsConsonant ? 'े' : 'ए');
  }
  if (code === 'KeyO') {
    if (shift) return currentText + (lastIsConsonant ? 'ौ' : 'औ');
    return currentText + (lastIsConsonant ? 'ो' : 'ओ');
  }
  if (code === 'KeyH' && !shift) {
    const aspirateMap: Record<string, string> = {
      'क': 'ख',
      'ग': 'घ',
      'च': 'छ',
      'ज': 'झ',
      'ट': 'ठ',
      'ड': 'ढ',
      'त': 'थ',
      'द': 'ध',
      'प': 'फ',
      'ब': 'भ',
    };
    if (aspirateMap[lastChar]) {
      return currentText.slice(0, -1) + aspirateMap[lastChar];
    }
    return currentText + 'ह';
  }

  const phoneticDirect: Record<string, { normal: string; shift: string }> = {
    KeyK: { normal: 'क', shift: 'ख' },
    KeyG: { normal: 'ग', shift: 'घ' },
    KeyC: { normal: 'च', shift: 'छ' },
    KeyJ: { normal: 'ज', shift: 'झ' },
    KeyQ: { normal: 'ट', shift: 'ठ' },
    BracketLeft: { normal: 'ड', shift: 'ढ' },
    BracketRight: { normal: '़', shift: 'ण' },
    KeyT: { normal: 'त', shift: 'थ' },
    KeyD: { normal: 'द', shift: 'ध' },
    KeyN: { normal: 'न', shift: 'ण' },
    KeyP: { normal: 'प', shift: 'फ' },
    KeyB: { normal: 'ब', shift: 'भ' },
    KeyM: { normal: 'म', shift: 'ं' },
    KeyY: { normal: 'य', shift: 'ञ' },
    KeyR: { normal: 'र', shift: 'ृ' },
    KeyL: { normal: 'ल', shift: 'ळ' },
    KeyV: { normal: 'व', shift: 'ँ' },
    KeyW: { normal: 'व', shift: 'औ' },
    KeyS: { normal: 'स', shift: 'श' },
    KeyF: { normal: '्', shift: 'फ' },
    KeyH: { normal: 'ह', shift: 'ः' },
    KeyX: { normal: 'क्ष', shift: 'त्र' },
    KeyZ: { normal: 'ज़', shift: 'झ़' },
    Comma: { normal: ',', shift: 'ष' },
    Period: { normal: '।', shift: '.' },
    Slash: { normal: '/', shift: '?' },
    Backslash: { normal: '।', shift: '॥' },
    Digit1: { normal: '१', shift: '!' },
    Digit2: { normal: '२', shift: '@' },
    Digit3: { normal: '३', shift: '#' },
    Digit4: { normal: '४', shift: '₹' },
    Digit5: { normal: '५', shift: '%' },
    Digit6: { normal: '६', shift: 'ज्ञ' },
    Digit7: { normal: '७', shift: 'क्ष' },
    Digit8: { normal: '८', shift: 'श्र' },
    Digit9: { normal: '९', shift: '(' },
    Digit0: { normal: '०', shift: ')' },
    Minus: { normal: '-', shift: '_' },
  };

  const entry = phoneticDirect[code];
  if (!entry) return currentText;
  return currentText + (shift ? entry.shift : entry.normal);
}

export function handleEngineBackspace(state: ComposerState): ComposerState {
  if (state.pendingChhotiI) {
    return {
      ...state,
      pendingChhotiI: false,
      legacyStream: state.legacyStream.slice(0, -1),
    };
  }
  return {
    unicodeText: state.unicodeText.slice(0, -1),
    legacyStream: state.legacyStream.slice(0, -1),
    pendingChhotiI: false,
  };
}

export function resolveNextKeyGuidance(
  targetText: string,
  typedState: ComposerState,
  layoutId: KeyboardLayoutId
): NextKeyGuidance | null {
  const normalizedTarget = targetText.normalize('NFC');
  const normalizedTyped = typedState.unicodeText.normalize('NFC');

  const cursor = normalizedTyped.length;
  if (cursor >= normalizedTarget.length) return null;

  const remaining = normalizedTarget.slice(cursor);
  const nextChar = remaining[0];
  const nextTwo = remaining.slice(0, 2);
  const nextThree = remaining.slice(0, 3);

  if (nextChar === ' ') {
    return {
      targetChar: 'Space',
      targetCluster: '␣ (Space)',
      code: 'Space',
      shift: false,
      qwertyLabel: 'Spacebar',
      hindiLabel: 'Space (अंतराल)',
      finger: 'thumbs',
    };
  }

  const layout = KEYBOARD_LAYOUTS[layoutId];

  if (
    layoutId === 'remington-gail' ||
    layoutId === 'remington-cbi' ||
    layoutId === 'krutidev-010'
  ) {
    if (
      remaining.length >= 2 &&
      DEVANAGARI_CONSONANT_REGEX.test(remaining[0]) &&
      remaining[1] === 'ि'
    ) {
      const consonant = remaining[0];
      if (!typedState.pendingChhotiI) {
        return {
          targetChar: 'ि',
          targetCluster: nextTwo,
          code: 'KeyF',
          shift: false,
          qwertyLabel: 'f',
          hindiLabel: 'ि',
          finger: 'left-index',
          sequenceStep: `For "${nextTwo}", Step 1/2: Press 'f' (ि) BEFORE '${consonant}'`,
          legacyRawChar: 'f',
        };
      } else {
        const consonantKey = findKeyForOutput(consonant, layoutId);
        if (consonantKey) {
          return {
            ...consonantKey,
            targetCluster: nextTwo,
            sequenceStep: `For "${nextTwo}", Step 2/2: Now press '${consonantKey.qwertyLabel}' (${consonant})`,
          };
        }
      }
    }

    const halfToFullMap: Record<
      string,
      { halfGlyph: string; code: string; shift: boolean; qwerty: string }
    > = {
      'ख': { halfGlyph: 'ख्', code: 'BracketLeft', shift: false, qwerty: '[' },
      'घ': { halfGlyph: 'घ्', code: 'Slash', shift: true, qwerty: '?' },
      'थ': { halfGlyph: 'थ्', code: 'KeyF', shift: true, qwerty: 'F' },
      'ध': { halfGlyph: 'ध्', code: 'Slash', shift: false, qwerty: '/' },
      'भ': { halfGlyph: 'भ्', code: 'KeyH', shift: true, qwerty: 'H' },
      'श': { halfGlyph: 'श्', code: 'Quote', shift: false, qwerty: "'" },
      'ष': { halfGlyph: 'ष्', code: 'Quote', shift: true, qwerty: '"' },
      'ण': { halfGlyph: 'ण्', code: 'Period', shift: false, qwerty: '.' },
    };

    if (halfToFullMap[nextChar]) {
      const info = halfToFullMap[nextChar];
      const keyDef = PHYSICAL_KEY_MAP[info.code];
      return {
        targetChar: nextChar,
        targetCluster: nextChar,
        code: info.code,
        shift: info.shift,
        qwertyLabel: info.qwerty,
        hindiLabel: `${info.halfGlyph} + ा`,
        finger: keyDef.finger,
        sequenceStep: `For "${nextChar}": Press '${info.qwerty}' (${info.halfGlyph}) then 'k' (ा)`,
        legacyRawChar: info.qwerty,
      };
    }

    if (nextChar === 'आ' || nextChar === 'ओ' || nextChar === 'औ') {
      return {
        targetChar: nextChar,
        targetCluster: nextChar,
        code: 'KeyV',
        shift: false,
        qwertyLabel: 'v',
        hindiLabel: 'अ',
        finger: 'left-index',
        sequenceStep: `For "${nextChar}": Press 'v' (अ) then 'k' (ा)${nextChar === 'ओ' ? " then 's' (े)" : nextChar === 'औ' ? " then 'Shift+S' (ै)" : ''}`,
        legacyRawChar: 'v',
      };
    }
    if (nextChar === 'ई') {
      return {
        targetChar: 'ई',
        targetCluster: 'ई',
        code: 'KeyB',
        shift: false,
        qwertyLabel: 'b',
        hindiLabel: 'इ',
        finger: 'left-index',
        sequenceStep: `For "ई": Press 'b' (इ) then 'Shift+Z' (र्)`,
        legacyRawChar: 'b',
      };
    }
    if (nextChar === 'ऊ') {
      return {
        targetChar: 'ऊ',
        targetCluster: 'ऊ',
        code: 'KeyM',
        shift: false,
        qwertyLabel: 'm',
        hindiLabel: 'उ',
        finger: 'right-index',
        sequenceStep: `For "ऊ": Press 'm' (उ) then 'Shift+Q' (or 'w')`,
        legacyRawChar: 'm',
      };
    }
    if (nextChar === 'ऐ') {
      return {
        targetChar: 'ऐ',
        targetCluster: 'ऐ',
        code: 'Comma',
        shift: false,
        qwertyLabel: ',',
        hindiLabel: 'ए',
        finger: 'right-middle',
        sequenceStep: `For "ऐ": Press ',' (ए) then 's' (े)`,
        legacyRawChar: ',',
      };
    }

    if (nextTwo.endsWith('्')) {
      const halfKey = findKeyForOutput(nextTwo, layoutId);
      if (halfKey) {
        return {
          ...halfKey,
          targetCluster: nextThree,
          sequenceStep: `Half-letter "${nextTwo}": Press ${halfKey.shift ? 'Shift + ' : ''}'${halfKey.qwertyLabel}'`,
        };
      }
    }
  }

  if (nextThree === 'क्ष' || nextThree === 'त्र' || nextThree === 'ज्ञ' || nextThree === 'श्र') {
    const directConjunct = findKeyForOutput(nextThree, layoutId);
    if (directConjunct) {
      return {
        ...directConjunct,
        targetCluster: nextThree,
        sequenceStep: `Direct conjunct "${nextThree}": Press ${directConjunct.shift ? 'Shift + ' : ''}'${directConjunct.qwertyLabel}'`,
      };
    }
  }

  const singleMatch = findKeyForOutput(nextChar, layoutId);
  if (singleMatch) {
    return singleMatch;
  }

  for (const [code, glyph] of Object.entries(layout.keys)) {
    if (glyph.normal.includes(nextChar)) {
      const kd = PHYSICAL_KEY_MAP[code];
      if (kd) {
        return {
          targetChar: nextChar,
          targetCluster: nextChar,
          code,
          shift: false,
          qwertyLabel: kd.qwertyNormal,
          hindiLabel: glyph.normal,
          finger: kd.finger,
        };
      }
    }
    if (glyph.shift.includes(nextChar)) {
      const kd = PHYSICAL_KEY_MAP[code];
      if (kd) {
        return {
          targetChar: nextChar,
          targetCluster: nextChar,
          code,
          shift: true,
          qwertyLabel: kd.qwertyShift,
          hindiLabel: glyph.shift,
          finger: kd.finger,
        };
      }
    }
  }

  return null;
}

function findKeyForOutput(target: string, layoutId: KeyboardLayoutId): NextKeyGuidance | null {
  const layout = KEYBOARD_LAYOUTS[layoutId];
  for (const [code, glyph] of Object.entries(layout.keys)) {
    const kd = PHYSICAL_KEY_MAP[code];
    if (!kd) continue;
    if (glyph.normal === target) {
      return {
        targetChar: target,
        targetCluster: target,
        code,
        shift: false,
        qwertyLabel: kd.qwertyNormal,
        hindiLabel: glyph.normal,
        finger: kd.finger,
        legacyRawChar: kd.qwertyNormal,
      };
    }
    if (glyph.shift === target) {
      return {
        targetChar: target,
        targetCluster: target,
        code,
        shift: true,
        qwertyLabel: kd.qwertyShift,
        hindiLabel: glyph.shift,
        finger: kd.finger,
        legacyRawChar: kd.qwertyShift,
      };
    }
  }
  return null;
}

export function convertUnicodeToKrutiDevStream(unicodeInput: string): string {
  const text = unicodeInput.normalize('NFC');
  let result = '';
  let i = 0;

  const fullConsonantToLegacy: Record<string, string> = {
    'क': 'd',
    'ख': '[k',
    'ग': 'x',
    'घ': '?k',
    'ङ': '³',
    'च': 'p',
    'छ': 'N',
    'ज': 't',
    'झ': '>',
    'ञ': '¥',
    'ट': 'V',
    'ठ': 'B',
    'ड': 'M',
    'ढ': '<',
    'ण': '.k',
    'त': 'r',
    'थ': 'Fk',
    'द': 'n',
    'ध': '/k',
    'न': 'u',
    'प': 'i',
    'फ': 'Q',
    'ब': 'c',
    'भ': 'Hk',
    'म': 'e',
    'य': ';',
    'र': 'j',
    'ल': 'y',
    'व': 'o',
    'श': "'k",
    'ष': '"k',
    'स': 'l',
    'ह': 'g',
    'ळ': 'G',
  };

  const halfConsonantToLegacy: Record<string, string> = {
    'क': 'D',
    'ख': '[',
    'ग': 'X',
    'घ': '?',
    'च': 'P',
    'ज': 'T',
    'ण': '.',
    'त': 'R',
    'थ': 'F',
    'ध': '/',
    'न': 'U',
    'प': 'I',
    'ब': 'C',
    'भ': 'H',
    'म': 'E',
    'ल': 'Y',
    'व': 'O',
    'श': "'",
    'ष': '"',
    'स': 'L',
  };

  const vowelToLegacy: Record<string, string> = {
    'अ': 'v',
    'आ': 'vk',
    'इ': 'b',
    'ई': 'bZ',
    'उ': 'm',
    'ऊ': 'mQ',
    'ऋ': '0',
    'ए': ',',
    'ऐ': ',s',
    'ओ': 'vks',
    'औ': 'vkS',
  };

  const matraToLegacy: Record<string, string> = {
    'ा': 'k',
    'ी': 'h',
    'ु': 'q',
    'ू': 'w',
    'ृ': '`',
    'े': 's',
    'ै': 'S',
    'ो': 'ks',
    'ौ': 'kS',
    'ं': 'a',
    'ः': '%',
    '।': 'A',
  };

  while (i < text.length) {
    const ch = text[i];
    const next1 = text[i + 1];
    const next2 = text[i + 2];

    if (ch === 'क' && next1 === '्' && next2 === 'ष') {
      result += '{k';
      i += 3;
      continue;
    }
    if (ch === 'त' && next1 === '्' && next2 === 'र') {
      result += '=';
      i += 3;
      continue;
    }
    if (ch === 'ज' && next1 === '्' && next2 === 'ञ') {
      result += 'K';
      i += 3;
      continue;
    }
    if (ch === 'श' && next1 === '्' && next2 === 'र') {
      result += 'J';
      i += 3;
      continue;
    }

    if (fullConsonantToLegacy[ch] && next1 === 'ि') {
      result += 'f' + fullConsonantToLegacy[ch];
      i += 2;
      continue;
    }

    if (halfConsonantToLegacy[ch] && next1 === '्') {
      result += halfConsonantToLegacy[ch];
      i += 2;
      continue;
    }

    if (fullConsonantToLegacy[ch]) {
      result += fullConsonantToLegacy[ch];
      i++;
      continue;
    }

    if (vowelToLegacy[ch]) {
      result += vowelToLegacy[ch];
      i++;
      continue;
    }

    if (matraToLegacy[ch]) {
      result += matraToLegacy[ch];
      i++;
      continue;
    }

    result += ch;
    i++;
  }

  return result;
}

export function runLayoutSelfTests(): LayoutSelfTestResult[] {
  const results: LayoutSelfTestResult[] = [];

  const runSequence = (
    layoutId: KeyboardLayoutId,
    testName: string,
    keySequenceDescription: string,
    steps: Array<{ code: string; shift?: boolean } | 'BACKSPACE'>,
    expectedUnicode: string
  ) => {
    let state = createInitialComposerState();
    for (const step of steps) {
      if (step === 'BACKSPACE') {
        state = handleEngineBackspace(state);
      } else {
        state = processPhysicalKeystroke(state, step.code, Boolean(step.shift), layoutId);
      }
    }
    results.push({
      layoutId,
      testName,
      keySequenceDescription,
      expectedUnicode: expectedUnicode.normalize('NFC'),
      actualUnicode: state.unicodeText.normalize('NFC'),
      legacyStream: state.legacyStream,
      passed: state.unicodeText.normalize('NFC') === expectedUnicode.normalize('NFC'),
    });
  };

  // InScript
  runSequence(
    'inscript',
    'Home & Matra Word (कमल)',
    'k (क) -> c (म) -> n (ल)',
    [{ code: 'KeyK' }, { code: 'KeyC' }, { code: 'KeyN' }],
    'कमल'
  );
  runSequence(
    'inscript',
    'Matras & Vowel Signs (किताब)',
    'k (क) -> f (ि) -> l (त) -> e (ा) -> y (ब)',
    [{ code: 'KeyK' }, { code: 'KeyF' }, { code: 'KeyL' }, { code: 'KeyE' }, { code: 'KeyY' }],
    'किताब'
  );
  runSequence(
    'inscript',
    'Halant & Conjunct (भारत प्रणाम)',
    'Shift+Y (भ) -> e (ा) -> j (र) -> l (त) -> Space -> h (प) -> d (्) -> j (र) -> Shift+C (ण) -> e (ा) -> c (म)',
    [
      { code: 'KeyY', shift: true },
      { code: 'KeyE' },
      { code: 'KeyJ' },
      { code: 'KeyL' },
      { code: 'Space' },
      { code: 'KeyH' },
      { code: 'KeyD' },
      { code: 'KeyJ' },
      { code: 'KeyC', shift: true },
      { code: 'KeyE' },
      { code: 'KeyC' },
    ],
    'भारत प्रणाम'
  );
  runSequence(
    'inscript',
    'Direct Samyukta Aksharas (क्ष त्र ज्ञ श्र)',
    'Shift+7 (क्ष) -> Shift+6 (त्र) -> Shift+5 (ज्ञ) -> Shift+8 (श्र)',
    [
      { code: 'Digit7', shift: true },
      { code: 'Digit6', shift: true },
      { code: 'Digit5', shift: true },
      { code: 'Digit8', shift: true },
    ],
    'क्षत्रज्ञश्र'
  );
  runSequence(
    'inscript',
    'Backspace Matra Removal',
    'k (क) -> e (ा) -> BACKSPACE -> f (ि)',
    [{ code: 'KeyK' }, { code: 'KeyE' }, 'BACKSPACE', { code: 'KeyF' }],
    'कि'
  );

  // Remington GAIL
  runSequence(
    'remington-gail',
    'Pre-Base Chhoti-I Reordering (किताब)',
    'f (ि) -> d (क) -> r (त) -> k (ा) -> c (ब)',
    [{ code: 'KeyF' }, { code: 'KeyD' }, { code: 'KeyR' }, { code: 'KeyK' }, { code: 'KeyC' }],
    'किताब'
  );
  runSequence(
    'remington-gail',
    'Half-Letter + k Fusion (भारत)',
    'Shift+H (भ्) -> k (ा -> भ) -> k (ा -> भा) -> j (र) -> r (त)',
    [
      { code: 'KeyH', shift: true },
      { code: 'KeyK' },
      { code: 'KeyK' },
      { code: 'KeyJ' },
      { code: 'KeyR' },
    ],
    'भारत'
  );
  runSequence(
    'remington-gail',
    'Repha Placement (कर्म)',
    'd (क) -> e (म) -> Shift+Z (र् Repha)',
    [{ code: 'KeyD' }, { code: 'KeyE' }, { code: 'KeyZ', shift: true }],
    'कर्म'
  );
  runSequence(
    'remington-gail',
    'Composite Vowels (आ ई ओ औ)',
    'v+k (आ) -> Space -> b+Shift+Z (ई) -> Space -> v+k+s (ओ) -> Space -> v+k+Shift+S (औ)',
    [
      { code: 'KeyV' },
      { code: 'KeyK' },
      { code: 'Space' },
      { code: 'KeyB' },
      { code: 'KeyZ', shift: true },
      { code: 'Space' },
      { code: 'KeyV' },
      { code: 'KeyK' },
      { code: 'KeyS' },
      { code: 'Space' },
      { code: 'KeyV' },
      { code: 'KeyK' },
      { code: 'KeyS', shift: true },
    ],
    'आ ई ओ औ'
  );

  // Remington CBI
  runSequence(
    'remington-cbi',
    'CBI Official Word & Conjunct (प्रशासन)',
    "i (प) -> z (्र) -> ' (श्) -> k (फ्यूज़ श) -> k (ा) -> l (स) -> u (न)",
    [
      { code: 'KeyI' },
      { code: 'KeyZ' },
      { code: 'Quote' },
      { code: 'KeyK' },
      { code: 'KeyK' },
      { code: 'KeyL' },
      { code: 'KeyU' },
    ],
    'प्रशासन'
  );

  // Kruti Dev 010
  runSequence(
    'krutidev-010',
    'Legacy Key Sequence "dke" -> काम',
    'd (क) -> k (ा) -> e (म)',
    [{ code: 'KeyD' }, { code: 'KeyK' }, { code: 'KeyE' }],
    'काम'
  );
  runSequence(
    'krutidev-010',
    'Legacy Pre-base ि "fganh" -> हिन्दी',
    'f (ि) -> g (ह) -> Shift+U (न्) -> n (द) -> h (ी)',
    [
      { code: 'KeyF' },
      { code: 'KeyG' },
      { code: 'KeyU', shift: true },
      { code: 'KeyN' },
      { code: 'KeyH' },
    ],
    'हिन्दी'
  );

  // Phonetic
  runSequence(
    'phonetic',
    'Phonetic Word (भारत)',
    'b (ब) -> h (भ) -> a (ा) -> r (र) -> t (त)',
    [{ code: 'KeyB' }, { code: 'KeyH' }, { code: 'KeyA' }, { code: 'KeyR' }, { code: 'KeyT' }],
    'भारत'
  );

  return results;
}
