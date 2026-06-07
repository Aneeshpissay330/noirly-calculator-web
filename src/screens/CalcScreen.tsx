import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiBackspaceOutline, mdiClose, mdiMinus, mdiPlus, mdiDivision } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';
import { useAppDispatch } from '../store/hooks';
import { addEntry } from '../store/historySlice';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'number' | 'operator' | 'action' | 'equals' | 'clear' | 'del';

interface CalcButton {
  label: string;
  value: string;
  variant: ButtonVariant;
  icon?: string;
  span?: number;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, string> = {
  'backspace-outline': mdiBackspaceOutline,
  'close': mdiClose,
  'minus': mdiMinus,
  'plus': mdiPlus,
  'division': mdiDivision,
};

const BUTTONS: CalcButton[][] = [
  [
    { label: 'C', value: 'C', variant: 'clear' },
    { label: '⌫', value: 'DEL', variant: 'del', icon: 'backspace-outline' },
    { label: '%', value: '%', variant: 'action' },
    { label: '×', value: '*', variant: 'operator', icon: 'close' },
  ],
  [
    { label: '7', value: '7', variant: 'number' },
    { label: '8', value: '8', variant: 'number' },
    { label: '9', value: '9', variant: 'number' },
    { label: '−', value: '-', variant: 'operator', icon: 'minus' },
  ],
  [
    { label: '4', value: '4', variant: 'number' },
    { label: '5', value: '5', variant: 'number' },
    { label: '6', value: '6', variant: 'number' },
    { label: '+', value: '+', variant: 'operator', icon: 'plus' },
  ],
  [
    { label: '1', value: '1', variant: 'number' },
    { label: '2', value: '2', variant: 'number' },
    { label: '3', value: '3', variant: 'number' },
    { label: '÷', value: '/', variant: 'operator', icon: 'division' },
  ],
  [
    { label: '0', value: '0', variant: 'number' },
    { label: '.', value: '.', variant: 'number' },
    { label: '=', value: '=', variant: 'equals', span: 2 },
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(value: string): string {
  if (!value || value === 'Error') return value;
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-US', { maximumFractionDigits: 10 });
}

function evaluate(expression: string): string {
  try {
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (result === Infinity || result === -Infinity) return 'Error';
    if (isNaN(result)) return 'Error';
    return String(result);
  } catch {
    return 'Error';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalcScreen() {
  const dispatch = useAppDispatch();
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  const [expression, setExpression] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  const display = useMemo(() => {
    if (!expression) return '0';
    const trimmed = expression.replace(/[+\-*/]$/, '');
    if (!trimmed) return '0';
    const result = evaluate(trimmed);
    return result === 'Error' ? '0' : result;
  }, [expression]);

  const handlePress = useCallback(
    (btn: CalcButton) => {
      const { value } = btn;

      if (value === 'C') {
        setExpression('');
        setJustEvaluated(false);
        return;
      }

      if (value === 'DEL') {
        if (justEvaluated) {
          setExpression('');
          setJustEvaluated(false);
          return;
        }
        setExpression(prev => prev.slice(0, -1));
        return;
      }

      if (value === '%') {
        const base = expression.replace(/[+\-*/]$/, '') || '0';
        const result = evaluate(`(${base}) / 100`);
        if (result !== 'Error') {
          setExpression(result);
          setJustEvaluated(true);
        }
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

      const isOperator = ['+', '-', '*', '/'].includes(value);

      if (justEvaluated && !isOperator) {
        setExpression(value);
        setJustEvaluated(false);
        return;
      }

      setJustEvaluated(false);
      setExpression(prev => {
        if (isOperator && /[+\-*/]$/.test(prev)) {
          return prev.slice(0, -1) + value;
        }
        return prev + value;
      });
    },
    [expression, justEvaluated, dispatch],
  );

  return (
    <div style={s.root}>
      {/* Display Stage */}
      <div style={s.stage}>
        <div style={s.expressionScroll}>
          <span style={s.expressionText}>{expression || ''}</span>
        </div>
        <span style={s.resultText}>{formatNumber(display)}</span>
      </div>

      {/* Keypad */}
      <div style={s.keypad}>
        {BUTTONS.map((row, ri) => (
          <div key={ri} style={s.row}>
            {row.map(btn => (
              <CalcKey key={btn.value} btn={btn} onPress={handlePress} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CalcKey ─────────────────────────────────────────────────────────────────

interface CalcKeyProps {
  btn: CalcButton;
  onPress: (btn: CalcButton) => void;
}

function CalcKey({ btn, onPress }: CalcKeyProps) {
  const [pressed, setPressed] = useState(false);
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);
  const span = btn.span ?? 1;

  const containerStyle: React.CSSProperties = {
    ...s.key,
    ...(span === 2 ? s.keySpan2 : {}),
    ...(btn.variant === 'operator' ? s.keyOperator : {}),
    ...(btn.variant === 'equals' ? s.keyEquals : {}),
    ...(btn.variant === 'clear' ? s.keyClear : {}),
    ...(btn.variant === 'del' ? s.keyDel : {}),
    ...(pressed ? s.keyPressed : {}),
  };

  const textStyle: React.CSSProperties = {
    ...s.keyLabel,
    ...(btn.variant === 'operator' ? s.keyLabelOperator : {}),
    ...(btn.variant === 'equals' ? s.keyLabelEquals : {}),
    ...(btn.variant === 'clear' && btn.label === 'C' ? s.keyLabelClear : {}),
  };

  const iconColor =
    btn.variant === 'del'
      ? c.onSecondary
      : btn.variant === 'operator'
      ? c.onTertiaryContainer
      : c.onSurfaceVariant;

  return (
    <button
      style={containerStyle}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => { setPressed(false); onPress(btn); }}
      onClick={() => onPress(btn)}>
      {btn.icon && ICON_MAP[btn.icon] ? (
        <Icon path={ICON_MAP[btn.icon]} size={1.1} color={iconColor} />
      ) : (
        <span style={textStyle}>{btn.label}</span>
      )}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GAP = 12;

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
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 24,
      gap: 8,
      minHeight: 0,
    },
    expressionScroll: {
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      textAlign: 'right',
      maxHeight: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    expressionText: {
      fontSize: 24,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 300,
      color: c.onSurfaceVariant,
    },
    resultText: {
      fontSize: 72,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 200,
      color: c.onSurface,
      textAlign: 'right',
      lineHeight: '80px',
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
      borderRadius: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      minWidth: 0,
    },
    keySpan2: {
      flex: 2,
    },
    keyOperator: {
      backgroundColor: c.tertiaryContainer,
    },
    keyEquals: {
      backgroundColor: c.primaryContainer,
    },
    keyClear: {
      backgroundColor: c.surfaceContainerHigh,
    },
    keyDel: {
      backgroundColor: c.secondary,
    },
    keyPressed: {
      opacity: 0.7,
      transform: 'scale(0.95)',
    },
    keyLabel: {
      fontSize: 28,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
      pointerEvents: 'none',
      userSelect: 'none',
    },
    keyLabelOperator: {
      color: c.onTertiaryContainer,
    },
    keyLabelEquals: {
      fontSize: 32,
      color: c.onPrimaryContainer,
    },
    keyLabelClear: {
      color: c.tertiary,
    },
  };
}
