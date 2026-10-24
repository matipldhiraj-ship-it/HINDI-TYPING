import {
  ExamPreset,
  KeyboardLayoutId,
  ScoringFormulaType,
  TypingAttemptResult,
} from '../types/typing';

export const SCORING_FORMULA_DOCS: Record<
  ScoringFormulaType,
  {
    name: string;
    shortLabel: string;
    equation: string;
    explanation: string;
  }
> = {
  'standard-5char': {
    name: 'Standard 5-Character Word Formula',
    shortLabel: '5 Chars = 1 Word',
    equation: 'Gross WPM = (Chars ÷ 5) ÷ Min | Net WPM = Gross WPM − (Uncorrected Errors ÷ Min)',
    explanation:
      'Every 5 typed Unicode characters (including spaces and matras) count as 1 standardized word. Uncorrected character errors reduce Net WPM proportionally.',
  },
  'ssc-penalty': {
    name: 'SSC Skill Test Practice Formula (5-Depression + Error Threshold)',
    shortLabel: 'SSC 5-Stroke + Threshold',
    equation: 'Gross = (Strokes ÷ 5) ÷ Min | Excess Errors > Permissible% deducted with weight',
    explanation:
      'Uses 5 key depressions per word. Up to the configured permissible error percentage is tolerated; errors exceeding the threshold incur a weighted penalty on Net WPM.',
  },
  'cpct-net': {
    name: 'CPCT Net Word Speed Formula',
    shortLabel: 'CPCT Net WPM',
    equation: 'Net WPM = Correct Words ÷ Min | Qualifying requires Net WPM ≥ 20 & Accuracy ≥ 85%',
    explanation:
      'Evaluates completed words against the reference passage and computes Net WPM from verified accurate words per minute.',
  },
  'highcourt-word': {
    name: 'High Court Full & Half Mistake Formula',
    shortLabel: 'Full/Half Mistake Rule',
    equation: 'Net Words = Total Words − (Full Mistakes + 0.5 × Half Mistakes) | Net WPM = Net Words ÷ Min',
    explanation:
      'Word-level evaluation where wrong/omitted words count as 1 Full Mistake and matra/punctuation variances count as 0.5 Half Mistake.',
  },
};

export interface ComputeAttemptParams {
  userId: string;
  mode: TypingAttemptResult['mode'];
  referenceId: string;
  title: string;
  layoutId: KeyboardLayoutId;
  targetText: string;
  typedText: string;
  durationSeconds: number;
  elapsedSeconds: number;
  totalKeystrokes: number;
  errorKeystrokes: number;
  backspaceCount: number;
  charErrorMap: Record<string, number>;
  scoringFormula: ScoringFormulaType;
  minAccuracyTarget: number;
  minWpmTarget: number;
  examPreset?: ExamPreset;
}

export function evaluateTypingAttempt(params: ComputeAttemptParams): TypingAttemptResult {
  const {
    userId,
    mode,
    referenceId,
    title,
    layoutId,
    targetText,
    typedText,
    durationSeconds,
    elapsedSeconds,
    totalKeystrokes,
    errorKeystrokes,
    backspaceCount,
    charErrorMap,
    scoringFormula,
    minAccuracyTarget,
    minWpmTarget,
    examPreset,
  } = params;

  const normTarget = targetText.normalize('NFC');
  const normTyped = typedText.normalize('NFC');
  const effectiveSeconds = Math.max(elapsedSeconds, 1);
  const minutes = effectiveSeconds / 60;

  // Character-by-character comparison
  let correctChars = 0;
  let uncorrectedCharErrors = 0;
  const localCharErrors: Record<string, number> = { ...charErrorMap };

  const compareLen = Math.max(normTyped.length, 1);
  for (let i = 0; i < normTyped.length; i++) {
    const exp = normTarget[i];
    const act = normTyped[i];
    if (exp && act === exp) {
      correctChars++;
    } else {
      uncorrectedCharErrors++;
      if (exp && exp !== ' ') {
        localCharErrors[exp] = (localCharErrors[exp] || 0) + 1;
      }
    }
  }

  const totalErrors = Math.max(uncorrectedCharErrors, errorKeystrokes);

  // Word-by-word comparison for mistyped words & word-level formulas
  const targetWords = normTarget.trim().split(/\s+/).filter(Boolean);
  const typedWords = normTyped.trim().split(/\s+/).filter(Boolean);
  const mistypedMap = new Map<string, { expected: string; typed: string; count: number }>();

  let fullWordMistakes = 0;
  let halfWordMistakes = 0;

  const wordCompareCount = typedWords.length;
  for (let w = 0; w < wordCompareCount; w++) {
    const expW = targetWords[w];
    const actW = typedWords[w];
    if (!expW) continue;
    if (expW !== actW) {
      const strippedExp = expW.replace(/[।,.\-?!]/g, '');
      const strippedAct = actW.replace(/[।,.\-?!]/g, '');
      if (strippedExp === strippedAct || Math.abs(strippedExp.length - strippedAct.length) <= 1) {
        halfWordMistakes++;
      } else {
        fullWordMistakes++;
      }

      const cleanExp = expW.replace(/[।,.\-?!]/g, '');
      if (cleanExp.length >= 2) {
        const existing = mistypedMap.get(cleanExp);
        if (existing) {
          existing.count += 1;
          existing.typed = actW;
        } else {
          mistypedMap.set(cleanExp, { expected: cleanExp, typed: actW, count: 1 });
        }
      }
    }
  }

  // Compute Gross WPM & Net WPM according to selected formula
  const standardGrossWpm = normTyped.length / 5 / minutes;
  let grossWpm = standardGrossWpm;
  let netWpm = Math.max(0, standardGrossWpm - uncorrectedCharErrors / minutes);

  if (scoringFormula === 'ssc-penalty') {
    const totalWordsTyped = normTyped.length / 5;
    const mistakeCount = fullWordMistakes + halfWordMistakes * 0.5 + uncorrectedCharErrors / 5;
    const errorPercent = totalWordsTyped > 0 ? (mistakeCount / totalWordsTyped) * 100 : 0;
    const allowedPercent = examPreset?.maxAllowedErrorPercent ?? 7;
    const excessMistakes =
      errorPercent > allowedPercent
        ? ((errorPercent - allowedPercent) / 100) * totalWordsTyped
        : 0;
    const netWords = Math.max(0, totalWordsTyped - excessMistakes * 2);
    grossWpm = totalWordsTyped / minutes;
    netWpm = netWords / minutes;
  } else if (scoringFormula === 'cpct-net') {
    const correctWordCount = Math.max(0, wordCompareCount - fullWordMistakes - halfWordMistakes);
    grossWpm = wordCompareCount / minutes;
    netWpm = correctWordCount / minutes;
  } else if (scoringFormula === 'highcourt-word') {
    const penaltyWords = fullWordMistakes + halfWordMistakes * 0.5;
    grossWpm = wordCompareCount / minutes;
    netWpm = Math.max(0, (wordCompareCount - penaltyWords) / minutes);
  }

  grossWpm = Math.round(grossWpm * 10) / 10;
  netWpm = Math.round(Math.min(grossWpm, Math.max(0, netWpm)) * 10) / 10;

  const totalAttemptsDenominator = Math.max(totalKeystrokes, compareLen);
  const rawAccuracy =
    totalAttemptsDenominator > 0
      ? ((totalAttemptsDenominator - Math.min(totalAttemptsDenominator, totalErrors)) /
          totalAttemptsDenominator) *
        100
      : 100;
  const accuracy = Math.round(Math.max(0, Math.min(100, rawAccuracy)) * 10) / 10;

  const mistypedWords = Array.from(mistypedMap.values()).sort((a, b) => b.count - a.count);
  const difficultChars = Object.entries(localCharErrors)
    .map(([char, errors]) => ({ char, errors }))
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 8);

  let passed = true;
  const reasons: string[] = [];

  if (accuracy < minAccuracyTarget) {
    passed = false;
    reasons.push(`Accuracy ${accuracy}% is below required ${minAccuracyTarget}%`);
  }
  if (minWpmTarget > 0 && netWpm < minWpmTarget) {
    passed = false;
    reasons.push(`Net Speed ${netWpm} WPM is below required ${minWpmTarget} WPM`);
  }
  if (normTyped.length < Math.min(15, normTarget.length)) {
    passed = false;
    reasons.push('Passage completion was too short to qualify');
  }

  const passReason = passed
    ? `Qualified: Achieved ${netWpm} Net WPM at ${accuracy}% accuracy.`
    : reasons.join(' · ');

  return {
    id: `attempt-${Date.now()}`,
    userId,
    timestamp: new Date().toISOString(),
    mode,
    referenceId,
    title,
    layoutId,
    durationSeconds,
    elapsedSeconds: effectiveSeconds,
    grossWpm,
    netWpm,
    accuracy,
    totalKeystrokes: Math.max(totalKeystrokes, normTyped.length),
    correctChars,
    incorrectChars: totalErrors,
    backspaceCount,
    mistypedWords,
    difficultChars,
    scoringFormulaUsed: scoringFormula,
    passed,
    passReason,
    examPresetId: examPreset?.id,
  };
}
