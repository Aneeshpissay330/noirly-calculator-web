import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiBackspaceOutline, mdiClose, mdiMinus, mdiPlus, mdiDivision } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';
import { useAppDispatch } from '../store/hooks';
import { addEntry } from '../store/historySlice';

// ─── Button definitions ───────────────────────────────────────────────────────

interface SciButton {
  label: string;
  value: string;
  variant: 'number' | 'operator' | 'equals' | 'clear' | 'action' | 'del';
  icon?: string;
  span?: number;
}

const ICON_MAP: Record<string, string> = {
  'backspace-outline': mdiBackspaceOutline,
  'close': mdiClose,
  'minus': mdiMinus,
  'plus': mdiPlus,
  'division': mdiDivision,
};

const FUNC_CHIPS: { label: string; value: string }[] = [
  { label: 'sin', value: 'sin(' },
  { label: 'cos', value: 'cos(' },
  { label: 'tan', value: 'tan(' },
  { label: 'log', value: 'log(' },
  { label: 'ln', value: 'ln(' },
  { label: '√', value: '√(' },
  { label: 'xʸ', value: '^' },
  { label: 'π', value: 'π' },
  { label: 'e', value: 'ℯ' },
  { label: 'x²', value: '^2' },
  { label: '1/x', value: '1/' },
  { label: '±', value: 'neg' },
];

const ROWS: SciButton[][] = [
  [
    { label: 'C', value: 'C', variant: 'clear' },
    { label: '(', value: '(', variant: 'action' },
    { label: ')', value: ')', variant: 'action' },
    { label: '⌫', value: 'DEL', variant: 'del', icon: 'backspace-outline' },
  ],
  [
    { label: '7', value: '7', variant: 'number' },
    { label: '8', value: '8', variant: 'number' },
    { label: '9', value: '9', variant: 'number' },
    { label: '÷', value: '/', variant: 'operator', icon: 'division' },
  ],
  [
    { label: '4', value: '4', variant: 'number' },
    { label: '5', value: '5', variant: 'number' },
    { label: '6', value: '6', variant: 'number' },
    { label: '×', value: '*', variant: 'operator', icon: 'close' },
  ],
  [
    { label: '1', value: '1', variant: 'number' },
    { label: '2', value: '2', variant: 'number' },
    { label: '3', value: '3', variant: 'number' },
    { label: '−', value: '-', variant: 'operator', icon: 'minus' },
  ],
  [
    { label: '0', value: '0', variant: 'number' },
    { label: '.', value: '.', variant: 'number' },
    { label: '+', value: '+', variant: 'operator', icon: 'plus' },
    { label: '=', value: '=', variant: 'equals' },
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toEvalForm(expr: string): string {
  return expr
    .replace(/π/g, String(Math.PI))
    .replace(/ℯ/g, String(Math.E))
    .replace(/√\(/g, 'sqrt(')
    .replace(/\^/g, '**')
    .replace(/ln\(/g, 'ln(')
    .replace(/log\(/g, 'log10(')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
}

function evaluate(expr: string): string {
  try {
    const trimmed = expr.replace(/[+\-*/^]$/, '');
    if (!trimmed) return '0';
    const e = toEvalForm(trimmed);
    // eslint-disable-next-line no-new-func
    const result = Function(`
      "use strict";
      const _d = Math.PI / 180;
      const sin = x => Math.sin(x * _d);
      const cos = x => Math.cos(x * _d);
      const tan = x => Math.tan(x * _d);
      const sqrt = x => Math.sqrt(x);
      const ln = x => Math.log(x);
      const log10 = x => Math.log10(x);
      return (${e});
    `)();
    if (!isFinite(result) || isNaN(result)) return 'Error';
    return String(parseFloat(result.toFixed(10)));
  } catch {
    return 'Error';
  }
}

const TRAILING_OP = /[+\-*/^]$/;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScientificScreen() {
  const dispatch = useAppDispatch();
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  const [expression, setExpression] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const liveResult = useMemo(() => evaluate(expression), [expression]);

  const handleFuncChip = useCallback(
    (value: string) => {
      if (value === 'neg') {
        setExpression(prev =>
          prev.startsWith('-') ? prev.slice(1) : '-' + prev,
        );
        return;
      }
      setJustEvaluated(false);
      setExpression(prev => {
        if (justEvaluated && !TRAILING_OP.test(value)) return value;
        return prev + value;
      });
    },
    [justEvaluated],
  );

  const handlePress = useCallback(
    (btn: SciButton) => {
      const { value } = btn;

      if (value === 'C') {
        setExpression('');
        setJustEvaluated(false);
        return;
      }

      if (value === 'DEL') {
        setJustEvaluated(false);
        setExpression(prev => prev.slice(0, -1));
        return;
      }

      if (value === '=') {
        if (!expression) return;
        const result = evaluate(expression);
        if (result !== 'Error') {
          dispatch(addEntry({ expression, result }));
          setExpression(result);
          setJustEvaluated(true);
        }
        return;
      }

      const isOp = ['+', '-', '*', '/', '^'].includes(value);

      if (justEvaluated && !isOp) {
        setExpression(value);
        setJustEvaluated(false);
        return;
      }

      setJustEvaluated(false);
      setExpression(prev => {
        if (isOp && TRAILING_OP.test(prev)) {
          return prev.slice(0, -1) + value;
        }
        return prev + value;
      });
    },
    [expression, justEvaluated, dispatch],
  );

  const resultIsNeutral =
    expression === '' || liveResult === 'Error' || liveResult === expression;

  return (
    <div style={s.root}>
      {/* Display Stage */}
      <div style={s.stage}>
        <div style={s.exprScroll}>
          <span style={s.expressionText}>{expression || ''}</span>
        </div>
        <span
          style={{
            ...s.resultText,
            ...(resultIsNeutral ? s.resultTextNeutral : {}),
          }}>
          {expression === ''
            ? '0'
            : liveResult !== 'Error' && liveResult !== expression
            ? liveResult
            : expression}
        </span>
      </div>

      {/* Function chips row */}
      <div style={s.funcRow}>
        {FUNC_CHIPS.map(chip => (
          <button
            key={chip.label}
            style={s.funcChip}
            onClick={() => handleFuncChip(chip.value)}>
            <span style={s.funcChipText}>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Main keypad */}
      <div style={s.keypad}>
        {ROWS.map((row, ri) => (
          <div key={ri} style={s.row}>
            {row.map(btn => {
              const span = btn.span ?? 1;
              const containerStyle: React.CSSProperties = {
                ...s.key,
                ...(span === 2 ? s.keySpan2 : {}),
                ...(btn.variant === 'operator' ? s.keyOp : {}),
                ...(btn.variant === 'del' ? s.keyDel : {}),
                ...(btn.variant === 'equals' ? s.keyEq : {}),
                ...(btn.variant === 'clear' ? s.keyClear : {}),
              };
              const textStyle: React.CSSProperties = {
                ...s.keyLabel,
                ...(btn.variant === 'operator' ? s.keyLabelOp : {}),
                ...(btn.variant === 'equals' ? s.keyLabelEq : {}),
                ...(btn.variant === 'clear' ? s.keyLabelClear : {}),
              };
              return (
                <button
                  key={btn.label}
                  style={containerStyle}
                  onClick={() => handlePress(btn)}>
                  {btn.icon && ICON_MAP[btn.icon] ? (
                    <Icon
                      path={ICON_MAP[btn.icon]}
                      size={0.95}
                      color={btn.variant === 'del' ? c.onSecondary : c.onTertiaryContainer}
                    />
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

const GAP = 10;

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
      paddingBottom: 12,
      gap: 8,
      minHeight: 0,
    },
    exprScroll: {
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      textAlign: 'right',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    expressionText: {
      fontSize: 24,
      fontFamily: 'Manrope',
      fontWeight: 300,
      color: c.onSurfaceVariant,
    },
    resultText: {
      fontSize: 64,
      fontFamily: 'Manrope',
      fontWeight: 200,
      color: c.primary,
      textAlign: 'right',
      lineHeight: '72px',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    resultTextNeutral: {
      color: c.onSurface,
    },
    funcRow: {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'auto',
      paddingLeft: GAP,
      paddingRight: GAP,
      gap: 8,
      marginBottom: 10,
      flexShrink: 0,
    },
    funcChip: {
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 14,
      backgroundColor: c.surfaceContainerHigh,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 56,
      border: 'none',
      cursor: 'pointer',
      flexShrink: 0,
    },
    funcChipText: {
      fontSize: 15,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.primary,
      userSelect: 'none',
    },
    keypad: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      padding: GAP,
      gap: GAP,
      minHeight: 0,
    },
    row: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: GAP,
      minHeight: 0,
    },
    key: {
      flex: 1,
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      minWidth: 0,
    },
    keySpan2: { flex: 2 },
    keyOp: { backgroundColor: c.tertiaryContainer },
    keyDel: { backgroundColor: c.secondary },
    keyEq: { backgroundColor: c.primaryContainer },
    keyClear: { backgroundColor: c.surfaceContainerHigh },
    keyLabel: {
      fontSize: 24,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurface,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    keyLabelOp: { color: c.onTertiaryContainer },
    keyLabelEq: { fontSize: 28, color: c.onPrimaryContainer },
    keyLabelClear: { color: c.tertiary },
  };
}
