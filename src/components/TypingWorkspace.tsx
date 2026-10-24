import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Keyboard,
  Hand,
  AlertCircle,
} from 'lucide-react';
import {
  ComposerState,
  KEYBOARD_LAYOUTS,
  PHYSICAL_KEY_MAP,
  convertUnicodeToKrutiDevStream,
  createInitialComposerState,
  handleEngineBackspace,
  processPhysicalKeystroke,
  resolveNextKeyGuidance,
} from '../engine/keyboardLayouts';
import { evaluateTypingAttempt, SCORING_FORMULA_DOCS } from '../engine/scoringEngine';
import { soundEngine } from '../engine/soundEngine';
import {
  BackspacePolicy,
  ExamPreset,
  KeyboardLayoutId,
  ScoringFormulaType,
  TypingAttemptResult,
} from '../types/typing';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TypingWorkspaceProps {
  userId: string;
  mode: TypingAttemptResult['mode'];
  referenceId: string;
  title: string;
  subtitle?: string;
  objective?: string;
  targetText: string;
  layoutId: KeyboardLayoutId;
  onLayoutChange?: (layoutId: KeyboardLayoutId) => void;
  lockLayout?: boolean;
  isTimed: boolean;
  durationSeconds?: number;
  minAccuracyTarget?: number;
  minWpmTarget?: number;
  backspacePolicy?: BackspacePolicy;
  scoringFormula?: ScoringFormulaType;
  examPreset?: ExamPreset;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showVirtualKeyboard: boolean;
  onToggleVirtualKeyboard: () => void;
  showFingerGuide: boolean;
  onToggleFingerGuide: () => void;
  onComplete: (result: TypingAttemptResult) => void;
}

export const TypingWorkspace: React.FC<TypingWorkspaceProps> = ({
  userId,
  mode,
  referenceId,
  title,
  subtitle,
  objective,
  targetText,
  layoutId,
  onLayoutChange,
  lockLayout = false,
  isTimed,
  durationSeconds = 180,
  minAccuracyTarget = 90,
  minWpmTarget = 0,
  backspacePolicy = 'full',
  scoringFormula = 'standard-5char',
  examPreset,
  soundEnabled,
  onToggleSound,
  showVirtualKeyboard,
  onToggleVirtualKeyboard,
  showFingerGuide,
  onToggleFingerGuide,
  onComplete,
}) => {
  const normalizedTarget = useMemo(() => targetText.normalize('NFC').trim(), [targetText]);
  const layout = KEYBOARD_LAYOUTS[layoutId];

  const [composer, setComposer] = useState<ComposerState>(createInitialComposerState);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'submitted'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [blockedBackspaceNotice, setBlockedBackspaceNotice] = useState<string | null>(null);
  const [charErrorMap, setCharErrorMap] = useState<Record<string, number>>({});
  const [shiftHeld, setShiftHeld] = useState<boolean>(false);
  const [lastPressedCode, setLastPressedCode] = useState<string | null>(null);
  const [lastPressError, setLastPressError] = useState<boolean>(false);

  const inputAreaRef = useRef<HTMLDivElement>(null);
  const passageContainerRef = useRef<HTMLDivElement>(null);
  const activeCharSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setComposer(createInitialComposerState());
    setStatus('idle');
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setErrorKeystrokes(0);
    setBackspaceCount(0);
    setBlockedBackspaceNotice(null);
    setCharErrorMap({});
    setLastPressedCode(null);
    setLastPressError(false);
    setTimeout(() => {
      inputAreaRef.current?.focus();
    }, 50);
  }, [normalizedTarget, layoutId, referenceId]);

  useEffect(() => {
    if (status !== 'running') return;

    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (isTimed && durationSeconds > 0 && next >= durationSeconds) {
          return durationSeconds;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [status, isTimed, durationSeconds]);

  useEffect(() => {
    if (status === 'running' && isTimed && durationSeconds > 0 && elapsedSeconds >= durationSeconds) {
      handleSubmitAttempt(elapsedSeconds);
    }
  }, [elapsedSeconds, status, isTimed, durationSeconds]);

  useEffect(() => {
    if (activeCharSpanRef.current && passageContainerRef.current) {
      const container = passageContainerRef.current;
      const span = activeCharSpanRef.current;
      const spanTop = span.offsetTop - container.offsetTop;
      if (spanTop > container.scrollTop + container.clientHeight - 64 || spanTop < container.scrollTop) {
        container.scrollTo({
          top: Math.max(0, spanTop - 48),
          behavior: 'smooth',
        });
      }
    }
  }, [composer.unicodeText.length]);

  const guidance = useMemo(
    () => resolveNextKeyGuidance(normalizedTarget, composer, layoutId),
    [normalizedTarget, composer, layoutId]
  );

  const liveMetrics = useMemo(() => {
    const mins = Math.max(elapsedSeconds, 1) / 60;
    const typedLen = composer.unicodeText.length;
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < typedLen; i++) {
      if (composer.unicodeText[i] === normalizedTarget[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    const totalErrs = Math.max(incorrect, errorKeystrokes);
    const grossWpm = elapsedSeconds > 0 ? Math.round((typedLen / 5 / mins) * 10) / 10 : 0;
    const netWpm =
      elapsedSeconds > 0
        ? Math.round(Math.max(0, grossWpm - incorrect / mins) * 10) / 10
        : 0;
    const denom = Math.max(totalKeystrokes, typedLen, 1);
    const accuracy =
      totalKeystrokes > 0
        ? Math.round(Math.max(0, ((denom - Math.min(denom, totalErrs)) / denom) * 100) * 10) / 10
        : 100;

    return {
      grossWpm,
      netWpm,
      accuracy,
      correct,
      incorrect,
      totalErrs,
      progressPercent: Math.min(100, Math.round((typedLen / Math.max(normalizedTarget.length, 1)) * 100)),
    };
  }, [composer.unicodeText, normalizedTarget, elapsedSeconds, totalKeystrokes, errorKeystrokes]);

  const handleRestart = () => {
    setComposer(createInitialComposerState());
    setStatus('idle');
    setElapsedSeconds(0);
    setTotalKeystrokes(0);
    setErrorKeystrokes(0);
    setBackspaceCount(0);
    setBlockedBackspaceNotice(null);
    setCharErrorMap({});
    setLastPressedCode(null);
    setLastPressError(false);
    inputAreaRef.current?.focus();
  };

  const handleSubmitAttempt = (finalElapsed = elapsedSeconds) => {
    if (status === 'submitted') return;
    setStatus('submitted');
    soundEngine.playCompletionChime(soundEnabled);

    const result = evaluateTypingAttempt({
      userId,
      mode,
      referenceId,
      title,
      layoutId,
      targetText: normalizedTarget,
      typedText: composer.unicodeText,
      durationSeconds: isTimed ? durationSeconds : finalElapsed,
      elapsedSeconds: Math.max(finalElapsed, 1),
      totalKeystrokes,
      errorKeystrokes,
      backspaceCount,
      charErrorMap,
      scoringFormula,
      minAccuracyTarget,
      minWpmTarget,
      examPreset,
    });

    onComplete(result);
  };

  const executeKeyInput = (code: string, shift: boolean) => {
    if (status === 'submitted') return;
    if (status === 'paused' || status === 'idle') {
      setStatus('running');
    }

    setBlockedBackspaceNotice(null);

    if (code === 'Backspace') {
      if (backspacePolicy === 'disabled') {
        setBlockedBackspaceNotice('Backspace is disabled by current exam rules.');
        soundEngine.playErrorTone(soundEnabled);
        return;
      }
      if (
        backspacePolicy === 'current-word' &&
        composer.unicodeText.endsWith(' ') &&
        !composer.pendingChhotiI
      ) {
        setBlockedBackspaceNotice(
          'Current-Word Backspace Rule: Cannot edit previous completed words after Spacebar.'
        );
        soundEngine.playErrorTone(soundEnabled);
        return;
      }
      setComposer((prev) => handleEngineBackspace(prev));
      setBackspaceCount((prev) => prev + 1);
      soundEngine.playKeyClick(soundEnabled, false);
      return;
    }

    if (!PHYSICAL_KEY_MAP[code]) return;

    const nextState = processPhysicalKeystroke(composer, code, shift, layoutId);
    const prevLen = composer.unicodeText.length;
    const nextLen = nextState.unicodeText.length;

    setTotalKeystrokes((prev) => prev + 1);
    setLastPressedCode(code);

    let isErr = false;
    if (nextState.pendingChhotiI && !composer.pendingChhotiI) {
      const upcoming = normalizedTarget.slice(prevLen, prevLen + 3);
      if (!upcoming.includes('ि')) {
        isErr = true;
      }
    } else if (nextLen > prevLen) {
      const newlyTypedSlice = nextState.unicodeText.slice(prevLen);
      const expectedSlice = normalizedTarget.slice(prevLen, prevLen + newlyTypedSlice.length);
      const isValidHalfPrefix =
        (layoutId === 'remington-gail' ||
          layoutId === 'remington-cbi' ||
          layoutId === 'krutidev-010') &&
        newlyTypedSlice.endsWith('्') &&
        expectedSlice.startsWith(newlyTypedSlice[0]);
      const isValidSwarPrefix =
        (layoutId === 'remington-gail' ||
          layoutId === 'remington-cbi' ||
          layoutId === 'krutidev-010') &&
        ((newlyTypedSlice === 'अ' && ['आ', 'ओ', 'औ'].includes(normalizedTarget[prevLen])) ||
          (newlyTypedSlice === 'इ' && normalizedTarget[prevLen] === 'ई') ||
          (newlyTypedSlice === 'उ' && normalizedTarget[prevLen] === 'ऊ') ||
          (newlyTypedSlice === 'ए' && normalizedTarget[prevLen] === 'ऐ'));
      const isValidRephaStep =
        (layoutId === 'remington-gail' ||
          layoutId === 'remington-cbi' ||
          layoutId === 'krutidev-010') &&
        normalizedTarget.slice(prevLen, prevLen + 2) === 'र्' &&
        newlyTypedSlice === normalizedTarget[prevLen + 2];

      if (
        newlyTypedSlice !== expectedSlice &&
        !isValidHalfPrefix &&
        !isValidSwarPrefix &&
        !isValidRephaStep
      ) {
        isErr = true;
        const expectedChar = normalizedTarget[prevLen];
        if (expectedChar && expectedChar !== ' ') {
          setCharErrorMap((prev) => ({
            ...prev,
            [expectedChar]: (prev[expectedChar] || 0) + 1,
          }));
        }
      }
    }

    setLastPressError(isErr);
    if (isErr) {
      setErrorKeystrokes((prev) => prev + 1);
      soundEngine.playErrorTone(soundEnabled);
    } else {
      soundEngine.playKeyClick(soundEnabled, code === 'Space');
    }

    setComposer(nextState);

    if (nextState.unicodeText.length >= normalizedTarget.length && !nextState.pendingChhotiI) {
      setTimeout(() => {
        setStatus('submitted');
        soundEngine.playCompletionChime(soundEnabled);
        const result = evaluateTypingAttempt({
          userId,
          mode,
          referenceId,
          title,
          layoutId,
          targetText: normalizedTarget,
          typedText: nextState.unicodeText,
          durationSeconds: isTimed ? durationSeconds : elapsedSeconds + 1,
          elapsedSeconds: Math.max(elapsedSeconds, 1),
          totalKeystrokes: totalKeystrokes + 1,
          errorKeystrokes: errorKeystrokes + (isErr ? 1 : 0),
          backspaceCount,
          charErrorMap,
          scoringFormula,
          minAccuracyTarget,
          minWpmTarget,
          examPreset,
        });
        onComplete(result);
      }, 120);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Shift') {
      setShiftHeld(true);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.code === 'Backspace') {
      e.preventDefault();
      executeKeyInput('Backspace', false);
      return;
    }

    if (PHYSICAL_KEY_MAP[e.code]) {
      e.preventDefault();
      executeKeyInput(e.code, e.shiftKey);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Shift') {
      setShiftHeld(false);
    }
  };

  const formatClock = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingSeconds = isTimed ? Math.max(0, durationSeconds - elapsedSeconds) : elapsedSeconds;

  const currentWordInfo = useMemo(() => {
    const cursor = composer.unicodeText.length;
    const before = normalizedTarget.slice(0, cursor);
    const lastSpace = before.lastIndexOf(' ');
    const nextSpace = normalizedTarget.indexOf(' ', cursor);
    const word = normalizedTarget.slice(
      lastSpace + 1,
      nextSpace === -1 ? normalizedTarget.length : nextSpace
    );
    return {
      word,
      krutiDevStream: convertUnicodeToKrutiDevStream(word),
    };
  }, [normalizedTarget, composer.unicodeText.length]);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-sky-700 dark:text-sky-400">
                {layout.name}
              </span>
              <span aria-hidden="true">·</span>
              <span>{layout.badgeText}</span>
              <span aria-hidden="true">·</span>
              <span>
                Backspace:{' '}
                {backspacePolicy === 'full'
                  ? 'Full Allowed'
                  : backspacePolicy === 'current-word'
                    ? 'Current Word Only'
                    : 'Disabled'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{SCORING_FORMULA_DOCS[scoringFormula].shortLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-hindi">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!lockLayout && onLayoutChange && (
              <select
                value={layoutId}
                onChange={(e) => onLayoutChange(e.target.value as KeyboardLayoutId)}
                aria-label="Select Hindi Keyboard Layout"
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="inscript">Unicode Hindi InScript</option>
                <option value="remington-gail">Unicode Remington GAIL</option>
                <option value="remington-cbi">Unicode Remington CBI</option>
                <option value="krutidev-010">Kruti Dev 010 / DevLys (Legacy)</option>
                <option value="phonetic">Phonetic Hindi (Learning Mode)</option>
              </select>
            )}

            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Keyboard Sound' : 'Enable Keyboard Sound'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-sky-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleVirtualKeyboard}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showVirtualKeyboard
                  ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keyboard</span>
            </button>

            <button
              type="button"
              onClick={onToggleFingerGuide}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showFingerGuide
                  ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Hands</span>
            </button>
          </div>
        </div>

        {objective && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span>
              <strong className="text-slate-800 dark:text-slate-200">Objective:</strong> {objective}
            </span>
            <span>
              Criteria: Min Accuracy <strong className="font-mono-tabular">{minAccuracyTarget}%</strong>
              {minWpmTarget > 0 && (
                <>
                  {' '}
                  · Target Speed <strong className="font-mono-tabular">{minWpmTarget} WPM</strong>
                </>
              )}
            </span>
          </div>
        )}

        {/* Live Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Net Speed</div>
            <div className="text-lg font-bold font-mono-tabular text-slate-900 dark:text-white">
              {liveMetrics.netWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Gross Speed</div>
            <div className="text-lg font-bold font-mono-tabular text-slate-900 dark:text-white">
              {liveMetrics.grossWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Accuracy</div>
            <div
              className={`text-lg font-bold font-mono-tabular ${
                liveMetrics.accuracy >= minAccuracyTarget
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {liveMetrics.accuracy}%
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Errors / Strokes</div>
            <div className="text-lg font-bold font-mono-tabular text-slate-900 dark:text-white">
              <span className={liveMetrics.totalErrs > 0 ? 'text-red-600 dark:text-red-400' : ''}>
                {liveMetrics.totalErrs}
              </span>{' '}
              <span className="text-xs font-normal text-slate-500">/ {totalKeystrokes}</span>
            </div>
          </div>

          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {isTimed ? 'Remaining Time' : 'Elapsed Time'}
            </div>
            <div className="text-lg font-bold font-mono-tabular text-slate-900 dark:text-white">
              {formatClock(remainingSeconds)}
            </div>
          </div>

          {/* Session Playback Controls */}
          <div className="flex items-center justify-end gap-1.5">
            {status === 'running' ? (
              <button
                type="button"
                onClick={() => setStatus('paused')}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : status === 'paused' ? (
              <button
                type="button"
                onClick={() => {
                  setStatus('running');
                  inputAreaRef.current?.focus();
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-700 whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmitAttempt(elapsedSeconds)}
              disabled={composer.unicodeText.length === 0 || status === 'submitted'}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-sky-600 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-sky-500 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-transform duration-150 origin-left"
            style={{ transform: `scaleX(${liveMetrics.progressPercent / 100})` }}
          />
        </div>
      </div>

      {(layoutId === 'krutidev-010' ||
        layoutId === 'remington-gail' ||
        layoutId === 'remington-cbi') && (
        <div className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {layoutId === 'krutidev-010'
                ? 'Kruti Dev 010 Legacy ASCII Inspector:'
                : 'Remington Typewriter Sequence:'}
            </span>
            <span className="text-slate-500">Current Word:</span>
            <span className="font-hindi font-bold text-sm text-slate-900 dark:text-white">
              {currentWordInfo.word || '—'}
            </span>
            <span aria-hidden="true" className="text-slate-400">
              →
            </span>
            <span className="text-slate-500">Physical Keys:</span>
            <code className="font-mono-tabular font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300">
              {currentWordInfo.krutiDevStream || '—'}
            </code>
          </div>

          <div className="flex items-center gap-3">
            {composer.pendingChhotiI && (
              <span className="font-semibold text-amber-700 dark:text-amber-400">
                ● Pending Pre-base ि (f) active — now type the base consonant!
              </span>
            )}
            <span className="text-slate-500">
              Typed Key Stream:{' '}
              <code className="font-mono-tabular text-slate-800 dark:text-slate-200">
                {composer.legacyStream.slice(-24) || '(empty)'}
              </code>
            </span>
          </div>
        </div>
      )}

      {blockedBackspaceNotice && (
        <div className="px-4 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{blockedBackspaceNotice}</span>
        </div>
      )}

      {/* Main Target Passage & Interactive Typing Area */}
      <div className="grid grid-cols-1 gap-4">
        <div
          ref={passageContainerRef}
          onClick={() => inputAreaRef.current?.focus()}
          className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-56 overflow-y-auto cursor-text"
        >
          <div className="font-hindi text-xl sm:text-2xl leading-relaxed tracking-wide select-none break-words">
            {Array.from(normalizedTarget).map((char, idx) => {
              const typedChar = composer.unicodeText[idx];
              const isCurrent = idx === composer.unicodeText.length;
              const isTyped = idx < composer.unicodeText.length;
              const isCorrect = isTyped && typedChar === char;

              if (isCurrent) {
                return (
                  <span
                    key={idx}
                    ref={activeCharSpanRef}
                    className="bg-sky-600 text-white rounded px-0.5 underline decoration-2 underline-offset-4 font-bold"
                  >
                    {char === ' ' ? '␣' : char}
                  </span>
                );
              }

              if (isTyped) {
                return isCorrect ? (
                  <span key={idx} className="text-emerald-700 dark:text-emerald-400">
                    {char}
                  </span>
                ) : (
                  <span
                    key={idx}
                    title={`Expected "${char}", typed "${typedChar}"`}
                    className="bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 underline decoration-wavy decoration-red-600 rounded px-0.5"
                  >
                    {char === ' ' ? '␣' : char}
                  </span>
                );
              }

              return (
                <span key={idx} className="text-slate-700 dark:text-slate-300">
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        <div
          ref={inputAreaRef}
          tabIndex={0}
          role="textbox"
          aria-label="Hindi Typing Practice Input Area"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          className="relative p-4 sm:p-5 rounded-xl border-2 border-sky-600/80 dark:border-sky-500/80 bg-white dark:bg-slate-900 min-h-[104px] focus:outline-none focus:ring-4 focus:ring-sky-500/20 transition-shadow cursor-text"
        >
          <div className="flex items-center justify-between mb-2 text-xs text-slate-400 dark:text-slate-500">
            <span>
              {status === 'idle'
                ? 'Click here and start typing on your physical keyboard — timer starts on first keystroke'
                : status === 'paused'
                  ? 'Session Paused — press any key or Resume to continue'
                  : 'Active Physical Key Mapping — type the highlighted Devanagari characters above'}
            </span>
            <span className="font-mono-tabular">
              {composer.unicodeText.length} / {normalizedTarget.length} chars
            </span>
          </div>

          <div className="font-hindi text-xl sm:text-2xl leading-relaxed text-slate-900 dark:text-white break-words min-h-[40px]">
            {composer.unicodeText}
            {composer.pendingChhotiI && (
              <span className="inline-block px-1.5 py-0.5 mx-0.5 text-sm rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-400">
                ि (pending consonant)
              </span>
            )}
            <span className="inline-block w-0.5 h-6 align-middle bg-sky-600 dark:bg-sky-400 ml-0.5 animate-pulse" />
          </div>
        </div>
      </div>

      {showVirtualKeyboard && (
        <VirtualKeyboard
          layoutId={layoutId}
          guidance={guidance}
          activeShiftPressed={shiftHeld}
          lastPressedCode={lastPressedCode}
          lastPressWasError={lastPressError}
          showFingerColors={true}
          showHandDiagram={showFingerGuide}
          onVirtualKeyPress={(code, shift) => {
            if (code === 'ShiftLeft' || code === 'ShiftRight') {
              setShiftHeld((prev) => !prev);
            } else {
              executeKeyInput(code, shiftHeld || shift);
              setShiftHeld(false);
            }
            inputAreaRef.current?.focus();
          }}
        />
      )}
    </div>
  );
};
