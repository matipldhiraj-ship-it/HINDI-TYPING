import React from 'react';
import {
  FINGER_METADATA,
  KEYBOARD_LAYOUTS,
  PHYSICAL_KEYBOARD_ROWS,
  PHYSICAL_KEY_MAP,
} from '../engine/keyboardLayouts';
import { FingerId, KeyboardLayoutId, NextKeyGuidance } from '../types/typing';

interface VirtualKeyboardProps {
  layoutId: KeyboardLayoutId;
  guidance?: NextKeyGuidance | null;
  activeShiftPressed?: boolean;
  lastPressedCode?: string | null;
  lastPressWasError?: boolean;
  showFingerColors?: boolean;
  showHandDiagram?: boolean;
  compact?: boolean;
  onVirtualKeyPress?: (code: string, shift: boolean) => void;
}

const ORDERED_FINGERS: FingerId[] = [
  'left-pinky',
  'left-ring',
  'left-middle',
  'left-index',
  'thumbs',
  'right-index',
  'right-middle',
  'right-ring',
  'right-pinky',
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  layoutId,
  guidance,
  activeShiftPressed = false,
  lastPressedCode = null,
  lastPressWasError = false,
  showFingerColors = true,
  showHandDiagram = true,
  compact = false,
  onVirtualKeyPress,
}) => {
  const layout = KEYBOARD_LAYOUTS[layoutId];
  const effectiveShift = activeShiftPressed || Boolean(guidance?.shift);

  const targetFingerMeta = guidance ? FINGER_METADATA[guidance.finger] : null;
  const recommendLeftShift =
    Boolean(guidance?.shift) && targetFingerMeta?.hand === 'Right Hand (दायाँ हाथ)';
  const recommendRightShift =
    Boolean(guidance?.shift) && targetFingerMeta?.hand === 'Left Hand (बायाँ हाथ)';

  return (
    <div className="space-y-3 select-none">
      {/* Guidance Instruction Bar */}
      {guidance && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400">Next Target:</span>
            <span className="font-hindi text-base font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {guidance.targetCluster}
            </span>
            <span className="text-slate-400" aria-hidden="true">
              ·
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Press Key:{' '}
              <kbd className="font-mono-tabular font-semibold px-1.5 py-0.5 rounded bg-sky-600 text-white">
                {guidance.shift ? `Shift + ${guidance.qwertyLabel.toUpperCase()}` : guidance.qwertyLabel}
              </kbd>{' '}
              <span className="font-hindi font-semibold text-sky-700 dark:text-sky-400">
                ({guidance.hindiLabel})
              </span>
            </span>
            {guidance.sequenceStep && (
              <>
                <span className="text-slate-400" aria-hidden="true">
                  ·
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-medium">
                  {guidance.sequenceStep}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span>Finger:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {FINGER_METADATA[guidance.finger].label} ({FINGER_METADATA[guidance.finger].hindiLabel})
            </span>
            {guidance.shift && (
              <>
                <span className="text-slate-400" aria-hidden="true">
                  +
                </span>
                <span className="font-semibold text-amber-700 dark:text-amber-400">
                  {recommendLeftShift ? 'Left Pinky (Left Shift)' : 'Right Pinky (Right Shift)'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Matrix */}
      <div className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/80 overflow-x-auto">
        <div className="min-w-[680px] space-y-1.5">
          {PHYSICAL_KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-center gap-1.5">
              {rowIndex === 1 && (
                <div
                  className={`flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/50 text-[11px] text-slate-400 font-mono-tabular ${
                    compact ? 'h-10 w-14' : 'h-12 w-16'
                  }`}
                >
                  Tab
                </div>
              )}

              {rowIndex === 2 && (
                <div
                  className={`flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/50 text-[11px] text-slate-400 font-mono-tabular ${
                    compact ? 'h-10 w-16' : 'h-12 w-20'
                  }`}
                >
                  Caps
                </div>
              )}

              {rowIndex === 3 && (
                <button
                  type="button"
                  onClick={() => onVirtualKeyPress?.('ShiftLeft', true)}
                  className={`flex items-center justify-between px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    compact ? 'h-10 w-20' : 'h-12 w-24'
                  } ${
                    recommendLeftShift
                      ? 'bg-amber-500 text-white border-amber-600 font-bold ring-2 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>Shift</span>
                  <span className="text-[10px] opacity-75">LP</span>
                </button>
              )}

              {row.map((keyDef) => {
                const glyph = layout.keys[keyDef.code] || { normal: '', shift: '' };
                const isTargetKey = guidance?.code === keyDef.code;
                const isJustPressed = lastPressedCode === keyDef.code;
                const isHomeAnchor = keyDef.code === 'KeyF' || keyDef.code === 'KeyJ';
                const fingerMeta = FINGER_METADATA[keyDef.finger];

                let keyContainerClass =
                  'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600';

                if (showFingerColors && !isTargetKey && !isJustPressed) {
                  keyContainerClass = `bg-white dark:bg-slate-800/90 border-b-2 ${fingerMeta.colorClass} border-t border-x border-t-slate-200 border-x-slate-200 dark:border-t-slate-700 dark:border-x-slate-700`;
                }

                if (isTargetKey) {
                  keyContainerClass =
                    'bg-sky-600 text-white border-sky-700 ring-2 ring-sky-400/60 shadow-sm';
                } else if (isJustPressed) {
                  keyContainerClass = lastPressWasError
                    ? 'bg-red-600 text-white border-red-700'
                    : 'bg-emerald-600 text-white border-emerald-700';
                }

                return (
                  <button
                    key={keyDef.code}
                    type="button"
                    onClick={() => onVirtualKeyPress?.(keyDef.code, effectiveShift)}
                    title={`${keyDef.qwertyNormal.toUpperCase()} — Normal: ${glyph.normal} | Shift: ${glyph.shift} (${fingerMeta.label})`}
                    className={`relative flex flex-col justify-between p-1.5 rounded-lg border transition-transform duration-100 active:scale-95 ${
                      compact ? 'h-10 w-11' : 'h-12 w-12 sm:w-13'
                    } ${keyContainerClass}`}
                  >
                    <div className="flex items-center justify-between w-full leading-none">
                      <span
                        className={`font-mono-tabular text-[10px] ${
                          isTargetKey
                            ? 'text-sky-100 font-semibold'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {keyDef.qwertyNormal.toUpperCase()}
                      </span>
                      <span
                        className={`font-hindi text-[11px] leading-none ${
                          isTargetKey
                            ? guidance?.shift
                              ? 'text-white font-bold underline'
                              : 'text-sky-200'
                            : effectiveShift
                              ? 'text-amber-600 dark:text-amber-400 font-semibold'
                              : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {glyph.shift}
                      </span>
                    </div>

                    <div className="flex items-end justify-between w-full leading-none">
                      <span className="text-[9px] font-mono-tabular opacity-55">
                        {showFingerColors ? fingerMeta.shortCode : ''}
                      </span>
                      <span
                        className={`font-hindi text-sm sm:text-base font-bold leading-none ${
                          isTargetKey
                            ? 'text-white'
                            : !effectiveShift
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {glyph.normal}
                      </span>
                    </div>

                    {isHomeAnchor && (
                      <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full ${
                          isTargetKey ? 'bg-white' : 'bg-sky-500 dark:bg-sky-400'
                        }`}
                      />
                    )}
                  </button>
                );
              })}

              {rowIndex === 0 && (
                <button
                  type="button"
                  onClick={() => onVirtualKeyPress?.('Backspace', false)}
                  className={`flex items-center justify-center px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium ${
                    compact ? 'h-10 w-16' : 'h-12 w-20'
                  }`}
                >
                  ⌫ Back
                </button>
              )}

              {rowIndex === 2 && (
                <div
                  className={`flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/50 text-[11px] text-slate-400 font-mono-tabular ${
                    compact ? 'h-10 w-16' : 'h-12 w-20'
                  }`}
                >
                  Enter ↵
                </div>
              )}

              {rowIndex === 3 && (
                <button
                  type="button"
                  onClick={() => onVirtualKeyPress?.('ShiftRight', true)}
                  className={`flex items-center justify-between px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    compact ? 'h-10 w-20' : 'h-12 w-24'
                  } ${
                    recommendRightShift
                      ? 'bg-amber-500 text-white border-amber-600 font-bold ring-2 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span>Shift</span>
                  <span className="text-[10px] opacity-75">RP</span>
                </button>
              )}
            </div>
          ))}

          {/* Spacebar Row */}
          <div className="flex items-center justify-center gap-2 pt-0.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Physical Keyboard Recommended for Speed Training
            </span>
            <button
              type="button"
              onClick={() => onVirtualKeyPress?.('Space', false)}
              className={`flex items-center justify-center rounded-lg border font-mono-tabular text-xs transition-colors ${
                compact ? 'h-9 w-64' : 'h-10 w-80'
              } ${
                guidance?.code === 'Space'
                  ? 'bg-sky-600 text-white border-sky-700 font-semibold ring-2 ring-sky-400/50'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Spacebar (अंतराल — Thumbs / अंगूठा)
            </button>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono-tabular">
              {layout.shortName}
            </span>
          </div>
        </div>
      </div>

      {/* 10-Finger Diagram */}
      {showHandDiagram && (
        <div className="grid grid-cols-2 sm:grid-cols-9 gap-1.5">
          {ORDERED_FINGERS.map((fid) => {
            const meta = FINGER_METADATA[fid];
            const isActiveFinger = guidance?.finger === fid;
            const isShiftFinger =
              (fid === 'left-pinky' && recommendLeftShift) ||
              (fid === 'right-pinky' && recommendRightShift);

            const homeKeys = PHYSICAL_KEYBOARD_ROWS[2]
              .filter((k) => k.finger === fid)
              .map((k) => {
                const g = layout.keys[k.code]?.normal || '';
                return `${k.qwertyNormal.toUpperCase()}(${g})`;
              })
              .join(' ');

            return (
              <div
                key={fid}
                className={`px-2.5 py-2 rounded-lg border text-center transition-colors ${
                  isActiveFinger
                    ? 'bg-sky-600 text-white border-sky-700 font-semibold shadow-xs'
                    : isShiftFinger
                      ? 'bg-amber-500 text-white border-amber-600 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-[11px] font-semibold truncate">{meta.label}</div>
                <div
                  className={`text-[10px] font-hindi truncate ${
                    isActiveFinger || isShiftFinger
                      ? 'text-white/90'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {meta.hindiLabel}
                </div>
                <div
                  className={`mt-1 text-[10px] font-mono-tabular truncate ${
                    isActiveFinger || isShiftFinger
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {fid === 'thumbs' ? 'Space' : homeKeys || meta.shortCode}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
