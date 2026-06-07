import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiBackspaceOutline, mdiSwapHorizontal, mdiCheck, mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type Base = 'HEX' | 'DEC' | 'OCT' | 'BIN';
type BitWidth = 16 | 32 | 64;

interface ProgBtn {
  label: string;
  value: string;
  variant: 'num' | 'logic' | 'shift' | 'del' | 'equals' | 'mode' | 'hex';
  icon?: string;
  span?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_RADIX: Record<Base, number> = { HEX: 16, DEC: 10, OCT: 8, BIN: 2 };
const BIT_WIDTHS: BitWidth[] = [64, 32, 16];
const GAP = 10;

const ROWS: ProgBtn[][] = [
  [
    { label: 'AND', value: 'AND', variant: 'logic' },
    { label: 'OR',  value: 'OR',  variant: 'logic' },
    { label: 'XOR', value: 'XOR', variant: 'logic' },
    { label: 'NOT', value: 'NOT', variant: 'logic' },
  ],
  [
    { label: 'A', value: 'A', variant: 'hex' },
    { label: 'B', value: 'B', variant: 'hex' },
    { label: 'C', value: 'C', variant: 'hex' },
    { label: 'D', value: 'D', variant: 'hex' },
  ],
  [
    { label: 'E', value: 'E', variant: 'hex' },
    { label: 'F', value: 'F', variant: 'hex' },
    { label: '«', value: '<<', variant: 'shift' },
    { label: '»', value: '>>', variant: 'shift' },
  ],
  [
    { label: '7', value: '7', variant: 'num' },
    { label: '8', value: '8', variant: 'num' },
    { label: '9', value: '9', variant: 'num' },
    { label: '⌫', value: 'DEL', variant: 'del', icon: 'backspace-outline' },
  ],
  [
    { label: '4', value: '4', variant: 'num' },
    { label: '5', value: '5', variant: 'num' },
    { label: '6', value: '6', variant: 'num' },
    { label: 'AC', value: 'AC', variant: 'num' },
  ],
  [
    { label: '4', value: '4', variant: 'num' },
    { label: '5', value: '5', variant: 'num' },
    { label: '6', value: '6', variant: 'num' },
    { label: '=', value: '=', variant: 'equals' },
  ],
  [
    { label: '1', value: '1', variant: 'num' },
    { label: '2', value: '2', variant: 'num' },
    { label: '3', value: '3', variant: 'num' },
    { label: '', value: 'MODE', variant: 'mode', icon: 'swap-horizontal' },
  ],
  [
    { label: '0', value: '0', variant: 'num', span: 3 },
    { label: '.', value: '.', variant: 'num' },
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseBase(str: string, base: Base): number {
  const n = parseInt(str || '0', BASE_RADIX[base]);
  return isNaN(n) ? 0 : n;
}

function toBaseStr(n: number, base: Base): string {
  const abs = Math.abs(n);
  if (abs === 0) return '0';
  return abs.toString(BASE_RADIX[base]).toUpperCase();
}

function applyMask(n: number, bw: BitWidth): number {
  if (bw === 16) return n & 0xffff;
  return n >>> 0;
}

function fmtHexCard(n: number): string {
  const h = n.toString(16).toUpperCase().padStart(8, '0');
  return `${h.slice(0, 4)} ${h.slice(4)}`;
}

function fmtDecCard(n: number): string {
  return n.toLocaleString('en-US');
}

function fmtOctCard(n: number): string {
  return n.toString(8);
}

function fmtBinCard(n: number): string {
  return n.toString(2).padStart(16, '0');
}

function fmtLargeDisplay(n: number, base: Base): string {
  switch (base) {
    case 'HEX': return n.toString(16).toUpperCase() || '0';
    case 'DEC': return n.toLocaleString('en-US');
    case 'OCT': return n.toString(8) || '0';
    case 'BIN': {
      const b = n.toString(2) || '0';
      return b.match(/.{1,4}/g)?.join(' ') ?? b;
    }
  }
}

// ─── BaseDropdown ─────────────────────────────────────────────────────────────

const BASES: Base[] = ['HEX', 'DEC', 'OCT', 'BIN'];

function BaseDropdown({
  activeBase,
  onSelect,
  values,
}: {
  activeBase: Base;
  onSelect: (b: Base) => void;
  values: Record<Base, string>;
}) {
  const [open, setOpen] = useState(false);
  const c = useThemeColors();
  const ds = useMemo(() => makeDropStyles(c), [c]);

  return (
    <div style={ds.wrapper}>
      <button style={ds.trigger} onClick={() => setOpen(o => !o)}>
        <span style={ds.triggerBase}>{activeBase}</span>
        <span style={ds.triggerValue}>{values[activeBase]}</span>
        <Icon path={open ? mdiChevronUp : mdiChevronDown} size={0.85} color={c.onSurfaceVariant} />
      </button>

      {open && (
        <>
          <div style={ds.backdrop} onClick={() => setOpen(false)} />
          <div style={ds.panel}>
            {BASES.map((base, i) => (
              <button
                key={base}
                style={{
                  ...ds.option,
                  ...(activeBase === base ? ds.optionActive : {}),
                  ...(i < BASES.length - 1 ? ds.optionBorder : {}),
                }}
                onClick={() => { onSelect(base); setOpen(false); }}>
                <span style={{ ...ds.optionBase, ...(activeBase === base ? ds.optionBaseActive : {}) }}>
                  {base}
                </span>
                <span style={{ ...ds.optionValue, ...(activeBase === base ? ds.optionValueActive : {}) }}>
                  {values[base]}
                </span>
                {activeBase === base && (
                  <Icon path={mdiCheck} size={0.65} color={c.primary} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function makeDropStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    wrapper: {
      paddingLeft: GAP,
      paddingRight: GAP,
      paddingBottom: GAP,
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    },
    trigger: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 14,
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 10,
      paddingBottom: 10,
      gap: 10,
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    },
    triggerBase: {
      fontSize: 12,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.primary,
      letterSpacing: '1.2px',
      minWidth: 30,
    },
    triggerValue: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    backdrop: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.55)',
      zIndex: 20,
    },
    panel: {
      position: 'absolute',
      left: GAP * 2,
      right: GAP * 2,
      top: '100%',
      backgroundColor: c.surfaceContainerHighest,
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
      zIndex: 30,
    },
    option: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 18,
      paddingRight: 18,
      paddingTop: 14,
      paddingBottom: 14,
      gap: 12,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    },
    optionBorder: {
      borderBottom: `1px solid ${c.outlineVariant}`,
    },
    optionActive: {
      backgroundColor: c.surfaceContainerLow,
    },
    optionBase: {
      fontSize: 12,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurfaceVariant,
      letterSpacing: '1.2px',
      minWidth: 34,
    },
    optionBaseActive: {
      color: c.primary,
    },
    optionValue: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurfaceVariant,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    optionValueActive: {
      color: c.onSurface,
    },
  };
}

// ─── ProgrammerScreen ────────────────────────────────────────────────────────

export default function ProgrammerScreen() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  const [inputStr, setInputStr]       = useState('A455');
  const [activeBase, setActiveBase]   = useState<Base>('HEX');
  const [pendingOp, setPendingOp]     = useState<string | null>(null);
  const [storedValue, setStoredValue] = useState(0);
  const [bwIdx, setBwIdx]             = useState(0);
  const [justEval, setJustEval]       = useState(false);

  const bitWidth = BIT_WIDTHS[bwIdx];

  const numericValue = useMemo(
    () => parseBase(inputStr, activeBase),
    [inputStr, activeBase],
  );

  const largeDisplay = justEval
    ? fmtLargeDisplay(numericValue, activeBase)
    : inputStr.toUpperCase();

  const pendingExpr = useMemo(() => {
    if (!pendingOp) return null;
    return `${fmtLargeDisplay(storedValue, activeBase)} ${pendingOp}`;
  }, [pendingOp, storedValue, activeBase]);

  const bitSegments = useMemo(() => {
    const n = numericValue & 0xffff;
    return Array.from({ length: 8 }, (_, i) => ((n >>> (14 - i * 2)) & 0x3) > 0);
  }, [numericValue]);

  const handleBaseSwitch = useCallback(
    (newBase: Base) => {
      if (newBase === activeBase) return;
      setInputStr(toBaseStr(numericValue, newBase));
      setActiveBase(newBase);
      setJustEval(false);
    },
    [activeBase, numericValue],
  );

  const isDigitValid = useCallback(
    (d: string): boolean => {
      if ('ABCDEF'.includes(d))              return activeBase === 'HEX';
      if (d === '8' || d === '9')            return activeBase !== 'OCT' && activeBase !== 'BIN';
      if ('234567'.includes(d))              return activeBase !== 'BIN';
      return true;
    },
    [activeBase],
  );

  const handleKey = useCallback(
    (btn: ProgBtn) => {
      const { value } = btn;

      if (value === 'MODE') {
        setBwIdx(i => (i + 1) % BIT_WIDTHS.length);
        return;
      }

      if (value === 'AC') {
        setInputStr('0');
        setPendingOp(null);
        setStoredValue(0);
        setJustEval(false);
        return;
      }

      if (value === 'DEL') {
        setInputStr(prev => prev.slice(0, -1) || '0');
        setJustEval(false);
        return;
      }

      if (value === '=') {
        if (!pendingOp) return;
        const a = storedValue;
        const b = numericValue;
        let result = 0;
        if (pendingOp === 'AND') result = a & b;
        else if (pendingOp === 'OR')  result = a | b;
        else if (pendingOp === 'XOR') result = a ^ b;
        result = applyMask(result, bitWidth);
        setInputStr(toBaseStr(result < 0 ? result >>> 0 : result, activeBase));
        setPendingOp(null);
        setJustEval(true);
        return;
      }

      if (value === 'NOT') {
        const mask = bitWidth === 16 ? 0xffff : 0xffffffff;
        const result = (~numericValue) & mask;
        setInputStr(toBaseStr(result < 0 ? result >>> 0 : result, activeBase));
        setJustEval(true);
        return;
      }

      if (value === '<<') {
        const result = applyMask(numericValue << 1, bitWidth);
        setInputStr(toBaseStr(result < 0 ? result >>> 0 : result, activeBase));
        setJustEval(true);
        return;
      }

      if (value === '>>') {
        const result = applyMask(numericValue >> 1, bitWidth);
        setInputStr(toBaseStr(result < 0 ? result >>> 0 : result, activeBase));
        setJustEval(true);
        return;
      }

      if (['AND', 'OR', 'XOR'].includes(value)) {
        setStoredValue(numericValue);
        setPendingOp(value);
        setInputStr('0');
        setJustEval(false);
        return;
      }

      if (value === '.') return;

      if (isDigitValid(value)) {
        if (justEval) {
          setInputStr(value);
          setJustEval(false);
        } else if (inputStr === '0' && value !== '0') {
          setInputStr(value);
        } else if (inputStr !== '0' || value === '0') {
          setInputStr(prev => prev + value);
        }
      }
    },
    [activeBase, numericValue, pendingOp, storedValue, bitWidth, isDigitValid, justEval, inputStr],
  );

  const BASE_VALUES: Record<Base, string> = useMemo(() => ({
    HEX: fmtHexCard(numericValue),
    DEC: fmtDecCard(numericValue),
    OCT: fmtOctCard(numericValue),
    BIN: fmtBinCard(numericValue),
  }), [numericValue]);

  return (
    <div style={s.root}>
      {/* Stage */}
      <div style={s.stage}>
        <button style={s.bitWidthBtn} onClick={() => setBwIdx(i => (i + 1) % BIT_WIDTHS.length)}>
          <span style={s.bitWidthLabel}>{bitWidth}-BIT SIGNED</span>
        </button>
        {pendingExpr ? (
          <span style={s.exprLine}>{pendingExpr}</span>
        ) : null}
        <span style={s.largeDisplay}>{largeDisplay}</span>
        <div style={s.bitStrip}>
          {bitSegments.map((on, i) => (
            <div key={i} style={{ ...s.bitSeg, ...(on ? s.bitSegOn : s.bitSegOff) }} />
          ))}
        </div>
      </div>

      {/* Base dropdown */}
      <BaseDropdown
        activeBase={activeBase}
        onSelect={handleBaseSwitch}
        values={BASE_VALUES}
      />

      {/* Keypad */}
      <div style={s.keypad}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={s.krow}>
            {row.map(btn => {
              const disabled =
                (btn.variant === 'hex' && activeBase !== 'HEX') ||
                ((btn.value === '8' || btn.value === '9') &&
                  (activeBase === 'OCT' || activeBase === 'BIN')) ||
                ('234567'.includes(btn.value) && activeBase === 'BIN');
              const containerStyle: React.CSSProperties = {
                ...s.key,
                ...(btn.span === 2 ? s.keySpan2 : {}),
                ...(btn.span === 3 ? s.keySpan3 : {}),
                ...(btn.variant === 'logic'  ? s.keyLogic : {}),
                ...(btn.variant === 'shift'  ? s.keyShift : {}),
                ...(btn.variant === 'del'    ? s.keyDel : {}),
                ...(btn.variant === 'equals' ? s.keyEquals : {}),
                ...(btn.variant === 'mode'   ? s.keyMode : {}),
                ...(disabled ? s.keyDisabled : {}),
              };
              const textStyle: React.CSSProperties = {
                ...s.keyLabel,
                ...(btn.variant === 'logic'  ? s.keyLabelLogic : {}),
                ...(btn.variant === 'shift'  ? s.keyLabelShift : {}),
                ...(btn.variant === 'equals' ? s.keyLabelEquals : {}),
                ...(disabled ? s.keyLabelDisabled : {}),
              };
              const iconColor = disabled
                ? c.outlineVariant
                : btn.variant === 'del'
                ? c.onSecondary
                : btn.variant === 'mode'
                ? c.onTertiary
                : c.onSurface;
              return (
                <button
                  key={btn.value + ri}
                  style={containerStyle}
                  disabled={disabled}
                  onClick={() => !disabled && handleKey(btn)}>
                  {btn.icon ? (
                    <Icon path={btn.icon === 'backspace-outline' ? mdiBackspaceOutline : mdiSwapHorizontal} size={0.9} color={iconColor} />
                  ) : (
                    <span style={textStyle}>{btn.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
      backgroundColor: c.background,
      overflow: 'hidden',
    },
    stage: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 10,
      gap: 6,
      minHeight: 0,
    },
    bitWidthBtn: {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      textAlign: 'right',
      alignSelf: 'flex-end',
    },
    bitWidthLabel: {
      fontSize: 11,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.primary,
      letterSpacing: '1.8px',
    },
    exprLine: {
      fontSize: 18,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 300,
      color: c.onSurfaceVariant,
      textAlign: 'right',
      opacity: 0.8,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    largeDisplay: {
      fontSize: 72,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 200,
      color: c.onSurface,
      textAlign: 'right',
      lineHeight: '78px',
      minHeight: 80,
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    bitStrip: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 6,
    },
    bitSeg: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    bitSegOn: {
      backgroundColor: c.primary,
    },
    bitSegOff: {
      backgroundColor: c.outlineVariant,
    },
    keypad: {
      flex: 4,
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: GAP,
      paddingRight: GAP,
      paddingTop: 4,
      paddingBottom: GAP,
      gap: GAP,
      minHeight: 0,
    },
    krow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: GAP,
      minHeight: 0,
    },
    key: {
      flex: 1,
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      minWidth: 0,
    },
    keySpan2: { flex: 2 },
    keySpan3: { flex: 3 },
    keyLogic: { backgroundColor: c.tertiaryContainer },
    keyShift: { backgroundColor: c.secondaryContainer },
    keyDel: { backgroundColor: c.secondary },
    keyEquals: { backgroundColor: c.primaryContainer },
    keyMode: { backgroundColor: c.tertiaryContainer, borderRadius: 24 },
    keyDisabled: { backgroundColor: c.surfaceContainerLow, opacity: 0.45 },
    keyLabel: {
      fontSize: 20,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    keyLabelLogic: {
      fontSize: 13,
      fontWeight: 600,
      color: c.onTertiaryContainer,
      letterSpacing: '0.5px',
    },
    keyLabelShift: {
      fontSize: 22,
      color: c.onSecondaryContainer,
    },
    keyLabelEquals: {
      fontSize: 26,
      color: c.onPrimaryContainer,
    },
    keyLabelDisabled: {
      color: c.outlineVariant,
    },
  };
}
