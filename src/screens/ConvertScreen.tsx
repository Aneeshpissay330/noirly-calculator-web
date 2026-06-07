import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '@mdi/react';
import {
  mdiBackspaceOutline,
  mdiRuler,
  mdiWeightKilogram,
  mdiThermometer,
  mdiCashMultiple,
  mdiVectorSquare,
  mdiSpeedometer,
  mdiSwapVertical,
  mdiChevronDown,
} from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Unit {
  label: string;
  abbr: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

interface Category {
  name: string;
  icon: string;
  units: Unit[];
}

const ICON_MAP: Record<string, string> = {
  ruler: mdiRuler,
  'weight-kilogram': mdiWeightKilogram,
  thermometer: mdiThermometer,
  'cash-multiple': mdiCashMultiple,
  'vector-square': mdiVectorSquare,
  speedometer: mdiSpeedometer,
};

const CATEGORIES: Category[] = [
  {
    name: 'Length',
    icon: 'ruler',
    units: [
      { label: 'Meter',      abbr: 'm',  toBase: v => v,            fromBase: v => v },
      { label: 'Kilometer',  abbr: 'km', toBase: v => v * 1000,     fromBase: v => v / 1000 },
      { label: 'Centimeter', abbr: 'cm', toBase: v => v / 100,      fromBase: v => v * 100 },
      { label: 'Millimeter', abbr: 'mm', toBase: v => v / 1000,     fromBase: v => v * 1000 },
      { label: 'Mile',       abbr: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { label: 'Yard',       abbr: 'yd', toBase: v => v * 0.9144,   fromBase: v => v / 0.9144 },
      { label: 'Foot',       abbr: 'ft', toBase: v => v * 0.3048,   fromBase: v => v / 0.3048 },
      { label: 'Inch',       abbr: 'in', toBase: v => v * 0.0254,   fromBase: v => v / 0.0254 },
    ],
  },
  {
    name: 'Weight',
    icon: 'weight-kilogram',
    units: [
      { label: 'Kilogram',  abbr: 'kg', toBase: v => v,            fromBase: v => v },
      { label: 'Gram',      abbr: 'g',  toBase: v => v / 1000,     fromBase: v => v * 1000 },
      { label: 'Milligram', abbr: 'mg', toBase: v => v / 1e6,      fromBase: v => v * 1e6 },
      { label: 'Pound',     abbr: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { label: 'Ounce',     abbr: 'oz', toBase: v => v * 0.028349, fromBase: v => v / 0.028349 },
      { label: 'Ton',       abbr: 't',  toBase: v => v * 1000,     fromBase: v => v / 1000 },
    ],
  },
  {
    name: 'Temperature',
    icon: 'thermometer',
    units: [
      { label: 'Celsius',    abbr: '°C', toBase: v => v,                 fromBase: v => v },
      { label: 'Fahrenheit', abbr: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { label: 'Kelvin',     abbr: 'K',  toBase: v => v - 273.15,        fromBase: v => v + 273.15 },
    ],
  },
  {
    name: 'Currency',
    icon: 'cash-multiple',
    units: [
      { label: 'US Dollar',     abbr: 'USD', toBase: v => v,          fromBase: v => v },
      { label: 'Euro',          abbr: 'EUR', toBase: v => v / 0.92,   fromBase: v => v * 0.92 },
      { label: 'British Pound', abbr: 'GBP', toBase: v => v / 0.79,   fromBase: v => v * 0.79 },
      { label: 'Japanese Yen',  abbr: 'JPY', toBase: v => v / 149.5,  fromBase: v => v * 149.5 },
      { label: 'Indian Rupee',  abbr: 'INR', toBase: v => v / 83.2,   fromBase: v => v * 83.2 },
      { label: 'Chinese Yuan',  abbr: 'CNY', toBase: v => v / 7.24,   fromBase: v => v * 7.24 },
      { label: 'Canadian $',    abbr: 'CAD', toBase: v => v / 1.36,   fromBase: v => v * 1.36 },
      { label: 'Aus Dollar',    abbr: 'AUD', toBase: v => v / 1.53,   fromBase: v => v * 1.53 },
    ],
  },
  {
    name: 'Area',
    icon: 'vector-square',
    units: [
      { label: 'Sq Meter',  abbr: 'm²',  toBase: v => v,              fromBase: v => v },
      { label: 'Sq Km',     abbr: 'km²', toBase: v => v * 1e6,        fromBase: v => v / 1e6 },
      { label: 'Sq Foot',   abbr: 'ft²', toBase: v => v * 0.092903,   fromBase: v => v / 0.092903 },
      { label: 'Sq Inch',   abbr: 'in²', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
      { label: 'Acre',      abbr: 'ac',  toBase: v => v * 4046.86,    fromBase: v => v / 4046.86 },
      { label: 'Hectare',   abbr: 'ha',  toBase: v => v * 10000,      fromBase: v => v / 10000 },
    ],
  },
  {
    name: 'Speed',
    icon: 'speedometer',
    units: [
      { label: 'm/s',  abbr: 'm/s',  toBase: v => v,           fromBase: v => v },
      { label: 'km/h', abbr: 'km/h', toBase: v => v / 3.6,     fromBase: v => v * 3.6 },
      { label: 'mph',  abbr: 'mph',  toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { label: 'Knot', abbr: 'kn',   toBase: v => v * 0.51444, fromBase: v => v / 0.51444 },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function convertValue(raw: string, from: Unit, to: Unit): string {
  const num = parseFloat(raw);
  if (!raw || isNaN(num)) return '';
  const result = to.fromBase(from.toBase(num));
  if (!isFinite(result)) return '—';
  return parseFloat(result.toFixed(8)).toLocaleString('en-US', { maximumFractionDigits: 8 });
}

function formatInput(raw: string): string {
  if (!raw) return '0';
  const parts = raw.split('.');
  const intFormatted = parseInt(parts[0] || '0', 10).toLocaleString('en-US');
  return parts.length > 1 ? `${intFormatted}.${parts[1]}` : intFormatted;
}

type NumpadKey =
  | { type: 'digit'; value: string }
  | { type: 'dot' }
  | { type: 'del' }
  | { type: 'clear' }
  | { type: 'confirm' };

const NUMPAD_ROWS: NumpadKey[][] = [
  [{ type: 'digit', value: '7' }, { type: 'digit', value: '8' }, { type: 'digit', value: '9' }, { type: 'del' }],
  [{ type: 'digit', value: '4' }, { type: 'digit', value: '5' }, { type: 'digit', value: '6' }, { type: 'clear' }],
  [{ type: 'digit', value: '1' }, { type: 'digit', value: '2' }, { type: 'digit', value: '3' }, { type: 'dot' }],
  [{ type: 'digit', value: '0' }, { type: 'confirm' }],
];

// ─── Unit Picker (bottom sheet) ───────────────────────────────────────────────

interface PickerOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

interface UnitPickerProps {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedId: string;
  onSelect: (i: number) => void;
  onClose: () => void;
}

function UnitPicker({ visible, title, options, selectedId, onSelect, onClose }: UnitPickerProps) {
  const c = useThemeColors();
  const s = useMemo(() => makePickerStyles(c), [c]);
  if (!visible) return null;
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.sheet} onClick={e => e.stopPropagation()}>
        <div style={s.handle} />
        <span style={s.title}>{title}</span>
        <div style={s.list}>
          {options.map((item, index) => (
            <button
              key={item.id}
              style={{ ...s.item, ...(item.id === selectedId ? s.itemActive : {}) }}
              onClick={() => { onSelect(index); onClose(); }}>
              <div style={s.itemContent}>
                {item.icon && ICON_MAP[item.icon] && (
                  <Icon
                    path={ICON_MAP[item.icon]}
                    size={0.9}
                    color={item.id === selectedId ? c.primary : c.onSurfaceVariant}
                  />
                )}
                <span style={{ ...s.itemLabel, ...(item.id === selectedId ? s.itemLabelActive : {}) }}>
                  {item.label}
                </span>
              </div>
              <span style={s.itemAbbr}>{item.value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function makePickerStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 100,
    },
    sheet: {
      backgroundColor: c.surfaceContainerLow,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingTop: 12,
      paddingBottom: 32,
      maxHeight: '55%',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 15,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurface,
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 10,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: c.outlineVariant,
      alignSelf: 'center',
      marginBottom: 12,
    },
    list: {
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
    },
    item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 14,
      paddingBottom: 14,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
    },
    itemContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    itemActive: { backgroundColor: c.surfaceContainerHigh },
    itemLabel: {
      fontSize: 16,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.onSurfaceVariant,
    },
    itemLabelActive: { fontWeight: 600, color: c.primary },
    itemAbbr: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.outline,
    },
  };
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ConvertScreen() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  const [categoryIndex, setCategoryIndex] = useState(0);
  const [fromIndex, setFromIndex] = useState(0);
  const [toIndex, setToIndex] = useState(1);
  const [inputRaw, setInputRaw] = useState('');
  const [pickerTarget, setPickerTarget] = useState<'category' | 'from' | 'to' | null>(null);

  const category = CATEGORIES[categoryIndex];
  const fromUnit = category.units[fromIndex];
  const toUnit = category.units[toIndex];

  const categoryOptions = useMemo(
    () => CATEGORIES.map(item => ({
      id: item.name,
      label: item.name,
      value: `${item.units.length} units`,
      icon: item.icon,
    })),
    [],
  );
  const unitOptions = useMemo(
    () => category.units.map(unit => ({ id: unit.label, label: unit.label, value: unit.abbr })),
    [category.units],
  );

  const outputValue = useMemo(
    () => convertValue(inputRaw, fromUnit, toUnit),
    [inputRaw, fromUnit, toUnit],
  );

  const selectCategory = useCallback((i: number) => {
    setCategoryIndex(i);
    setFromIndex(0);
    setToIndex(Math.min(1, CATEGORIES[i].units.length - 1));
    setInputRaw('');
  }, []);

  const swap = useCallback(() => {
    setFromIndex(toIndex);
    setToIndex(fromIndex);
    setInputRaw('');
  }, [fromIndex, toIndex]);

  const handleNumpad = useCallback((key: NumpadKey) => {
    setInputRaw(prev => {
      switch (key.type) {
        case 'digit':
          if (prev === '0') return key.value;
          return prev + key.value;
        case 'dot':
          if (prev.includes('.')) return prev;
          return (prev || '0') + '.';
        case 'del':
          return prev.slice(0, -1);
        case 'clear':
          return '';
        default:
          return prev;
      }
    });
  }, []);

  const pickerSelected = pickerTarget === 'category'
    ? categoryOptions[categoryIndex]?.id ?? ''
    : pickerTarget === 'from'
      ? unitOptions[fromIndex]?.id ?? ''
      : unitOptions[toIndex]?.id ?? '';

  const onPickerSelect = useCallback((i: number) => {
    if (pickerTarget === 'category') {
      selectCategory(i);
      return;
    }
    if (pickerTarget === 'from') setFromIndex(i);
    else setToIndex(i);
    setInputRaw('');
  }, [pickerTarget, selectCategory]);

  const pickerOptions = pickerTarget === 'category' ? categoryOptions : unitOptions;
  const pickerTitle = pickerTarget === 'category' ? 'Select conversion type' : 'Select unit';

  return (
    <div style={s.root}>
      {/* Input display */}
      <div style={s.displayCard}>
        {!!outputValue && (
          <span style={s.bgResult}>{outputValue}</span>
        )}
        <span style={s.inputText}>{formatInput(inputRaw)}</span>
        <span style={s.unitAbbr}>{fromUnit.abbr}</span>
      </div>

      {/* Type / From / To rows */}
      <div style={s.categoryRow}>
        <span style={s.categoryLabel}>Type</span>
        <button style={s.categoryPill} onClick={() => setPickerTarget('category')}>
          <div style={s.categoryPillContent}>
            {ICON_MAP[category.icon] && (
              <Icon path={ICON_MAP[category.icon]} size={0.85} color={c.primary} />
            )}
            <span style={s.categoryPillText}>{category.name}</span>
          </div>
          <Icon path={mdiChevronDown} size={0.75} color={c.onSurface} />
        </button>
      </div>

      <div style={s.unitRow}>
        <span style={s.unitRowLabel}>From</span>
        <button style={s.unitPill} onClick={() => setPickerTarget('from')}>
          <span style={s.unitPillText}>{fromUnit.label}</span>
          <Icon path={mdiChevronDown} size={0.65} color={c.onSurface} />
        </button>
      </div>

      <div style={s.swapDivider}>
        <div style={s.swapLine} />
        <button style={s.swapBtn} onClick={swap}>
          <Icon path={mdiSwapVertical} size={0.85} color={c.onSurface} />
        </button>
        <div style={s.swapLine} />
      </div>

      <div style={s.unitRow}>
        <span style={s.unitRowLabel}>To</span>
        <button style={s.unitPill} onClick={() => setPickerTarget('to')}>
          <span style={s.unitPillText}>{toUnit.label}</span>
          <Icon path={mdiChevronDown} size={0.65} color={c.onSurface} />
        </button>
      </div>

      <div style={s.resultRow}>
        <span style={s.resultValue}>{outputValue || ''}</span>
        {!!outputValue && <span style={s.resultAbbr}>{toUnit.abbr}</span>}
      </div>

      {/* Custom numpad */}
      <div style={s.numpad}>
        {NUMPAD_ROWS.map((row, ri) => (
          <div key={ri} style={s.numRow}>
            {row.map((key, ki) => {
              const isConfirm = key.type === 'confirm';
              const isDel = key.type === 'del';
              const isClear = key.type === 'clear';
              return (
                <button
                  key={ki}
                  style={{
                    ...s.numKey,
                    ...(isConfirm ? s.numKeyConfirm : {}),
                    ...((isDel || isClear) ? s.numKeyAction : {}),
                    ...(isDel ? s.numKeyDel : {}),
                  }}
                  onClick={() => handleNumpad(key)}>
                  {isDel ? (
                    <Icon path={mdiBackspaceOutline} size={0.85} color={c.onSecondary} />
                  ) : isConfirm ? (
                    <span style={s.numKeyLabelConfirm}>=</span>
                  ) : (
                    <span style={{ ...s.numKeyLabel, ...(isClear ? s.numKeyLabelClear : {}) }}>
                      {key.type === 'dot' ? '.' : key.type === 'digit' ? key.value : 'C'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <UnitPicker
        visible={pickerTarget !== null}
        title={pickerTitle}
        options={pickerOptions}
        selectedId={pickerSelected}
        onSelect={onPickerSelect}
        onClose={() => setPickerTarget(null)}
      />
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
      position: 'relative',
    },
    displayCard: {
      marginLeft: 12,
      marginRight: 12,
      marginTop: 8,
      backgroundColor: c.background,
      borderRadius: 20,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 8,
      paddingBottom: 8,
      height: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
    },
    bgResult: {
      position: 'absolute',
      bottom: 6,
      left: 16,
      right: 16,
      fontSize: 88,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 200,
      color: c.onSurface,
      opacity: 0.06,
      textAlign: 'right',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
    },
    inputText: {
      fontSize: 38,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 200,
      color: c.onSurface,
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    unitAbbr: {
      fontSize: 13,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurfaceVariant,
      textAlign: 'right',
      marginTop: 2,
    },
    categoryRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 6,
      marginBottom: 2,
      flexShrink: 0,
    },
    categoryLabel: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.onSurfaceVariant,
    },
    categoryPill: {
      minWidth: 174,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 9,
      paddingBottom: 9,
      borderRadius: 9999,
      border: `1px solid ${c.outlineVariant}`,
      backgroundColor: c.surfaceContainerHigh,
      cursor: 'pointer',
    },
    categoryPillContent: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexShrink: 1,
    },
    categoryPillText: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurface,
      userSelect: 'none',
    },
    unitRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 14,
      paddingRight: 14,
      marginTop: 4,
      marginBottom: 2,
      flexShrink: 0,
    },
    unitRowLabel: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.onSurfaceVariant,
    },
    unitPill: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 7,
      paddingBottom: 7,
      borderRadius: 9999,
      border: `1px solid ${c.outlineVariant}`,
      backgroundColor: c.surfaceContainerHigh,
      cursor: 'pointer',
    },
    unitPillText: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurface,
      userSelect: 'none',
    },
    swapDivider: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 14,
      paddingRight: 14,
      marginTop: 2,
      marginBottom: 2,
      flexShrink: 0,
    },
    swapLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.outlineVariant,
    },
    swapBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.surfaceContainerHigh,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
    },
    resultRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 6,
      paddingLeft: 20,
      paddingRight: 20,
      height: 36,
      marginTop: 4,
      flexShrink: 0,
    },
    resultValue: {
      flex: 1,
      fontSize: 22,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 300,
      color: c.primary,
      textAlign: 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    resultAbbr: {
      fontSize: 13,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurfaceVariant,
    },
    numpad: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: GAP,
      gap: 8,
      minHeight: 0,
    },
    numRow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      minHeight: 0,
    },
    numKey: {
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
    numKeyAction: {
      backgroundColor: c.surfaceContainerHighest,
    },
    numKeyDel: {
      backgroundColor: c.secondary,
    },
    numKeyConfirm: {
      flex: 2,
      backgroundColor: c.primaryContainer,
    },
    numKeyPressed: {
      opacity: 0.7,
    },
    numKeyLabel: {
      fontSize: 22,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    numKeyLabelClear: {
      color: c.secondary,
    },
    numKeyLabelConfirm: {
      fontSize: 28,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onPrimaryContainer,
      userSelect: 'none',
      pointerEvents: 'none',
    },
  };
}
