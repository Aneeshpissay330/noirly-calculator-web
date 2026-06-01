import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiBackspaceOutline, mdiClose, mdiMinus, mdiRestore, mdiHandBackLeft } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

// ─── Types ────────────────────────────────────────────────────────────────────

type Viewport = { xMin: number; xMax: number; yMin: number; yMax: number };
type CanvasSize = { width: number; height: number };
type KVariant = 'num' | 'del' | 'calc';
interface KBtn { label: string; value: string; variant: KVariant; icon?: string }

const ICON_MAP: Record<string, string> = {
  'backspace-outline': mdiBackspaceOutline,
  'close': mdiClose,
  'minus': mdiMinus,
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_VP: Viewport = {
  xMin: -Math.PI * 2,
  xMax: Math.PI * 2,
  yMin: -1.2,
  yMax: 2.5,
};
const SAMPLES = 300;
const GAP = 10;

const GRAPH_KEYS: KBtn[][] = [
  [
    { label: '7', value: '7', variant: 'num' },
    { label: '8', value: '8', variant: 'num' },
    { label: '9', value: '9', variant: 'num' },
    { label: '', value: 'DEL', variant: 'del', icon: 'backspace-outline' },
  ],
  [
    { label: '4', value: '4', variant: 'num' },
    { label: '5', value: '5', variant: 'num' },
    { label: '6', value: '6', variant: 'num' },
    { label: '×', value: '*', variant: 'num', icon: 'close' },
  ],
  [
    { label: '1', value: '1', variant: 'num' },
    { label: '2', value: '2', variant: 'num' },
    { label: '3', value: '3', variant: 'num' },
    { label: '−', value: '-', variant: 'num', icon: 'minus' },
  ],
  [
    { label: 'x', value: 'x', variant: 'num' },
    { label: '0', value: '0', variant: 'num' },
    { label: '.', value: '.', variant: 'num' },
    { label: '=', value: 'CALC', variant: 'calc' },
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createEvaluator(expr: string): ((x: number) => number) | null {
  const t = expr.trim().toLowerCase();
  if (!t) return null;
  try {
    let s = t;
    s = s.replace(/\bsin\b/g, 'Math.sin');
    s = s.replace(/\bcos\b/g, 'Math.cos');
    s = s.replace(/\btan\b/g, 'Math.tan');
    s = s.replace(/\bsqrt\b/g, 'Math.sqrt');
    s = s.replace(/\babs\b/g, 'Math.abs');
    s = s.replace(/\blog\b/g, 'Math.log10');
    s = s.replace(/\bln\b/g, 'Math.log');
    s = s.replace(/\bpi\b/g, `${Math.PI}`);
    s = s.replace(/π/g, `${Math.PI}`);
    s = s.replace(/\bx\b/g, '(x)');
    s = s.replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    return Function(
      'x',
      `"use strict"; try { const v = +(${s}); return isFinite(v) ? v : NaN; } catch(e) { return NaN; }`,
    ) as (x: number) => number;
  } catch {
    return null;
  }
}

function worldToScreen(wx: number, wy: number, vp: Viewport, cs: CanvasSize): [number, number] {
  const sx = ((wx - vp.xMin) / (vp.xMax - vp.xMin)) * cs.width;
  const sy = ((vp.yMax - wy) / (vp.yMax - vp.yMin)) * cs.height;
  return [sx, sy];
}

type Segment = { x1: number; y1: number; x2: number; y2: number };

function computeSegments(fn: (x: number) => number, vp: Viewport, cs: CanvasSize): Segment[] {
  if (!cs.width || !cs.height) return [];
  const segs: Segment[] = [];
  let prev: [number, number] | null = null;
  for (let i = 0; i <= SAMPLES; i++) {
    const wx = vp.xMin + (i / SAMPLES) * (vp.xMax - vp.xMin);
    const wy = fn(wx);
    if (isNaN(wy)) { prev = null; continue; }
    const cur = worldToScreen(wx, wy, vp, cs);
    if (prev) {
      if (Math.abs(cur[1] - prev[1]) < cs.height * 4) {
        segs.push({ x1: prev[0], y1: prev[1], x2: cur[0], y2: cur[1] });
      }
    }
    prev = cur;
  }
  return segs;
}

function niceStep(range: number, count: number): number {
  const raw = Math.abs(range) / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  if (n <= 1.5) return mag;
  if (n <= 3.5) return 2 * mag;
  if (n <= 7.5) return 5 * mag;
  return 10 * mag;
}

function fmtTick(v: number): string {
  if (Math.abs(v) < 1e-9) return '0';
  const abs = Math.abs(v);
  if (abs >= 1000 || (abs < 0.01 && abs > 0)) return v.toExponential(1);
  return parseFloat(v.toPrecision(4)).toString();
}

function formatLegend(expr: string, index: number): string {
  const names = ['F(X)', 'G(X)', 'H(X)'];
  const name = names[index] ?? `F${index + 1}(X)`;
  const display = expr
    .toUpperCase()
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\*/g, '×');
  return `${name} = ${display}`;
}

// ─── GraphCanvas (SVG-based) ─────────────────────────────────────────────────

function GraphCanvas({
  vp,
  curves,
  curveColors,
  exprs,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  onLayout,
}: {
  vp: Viewport;
  curves: Segment[][];
  curveColors: string[];
  exprs: string[];
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onLayout: (w: number, h: number) => void;
}) {
  const c = useThemeColors();
  const divRef = useRef<HTMLDivElement>(null);

  const isDark = c.background === '#0F0F11';
  const GRID_COLOR = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)';
  const AXIS_COLOR = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.35)';

  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 });

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    (divRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
        onLayout(width, height);
      }
    });
    obs.observe(node);
  }, [onLayout]);

  const { width, height } = size;
  const xRange = vp.xMax - vp.xMin;
  const yRange = vp.yMax - vp.yMin;
  const axisX = Math.max(0, Math.min(width, ((0 - vp.xMin) / xRange) * width));
  const axisY = Math.max(0, Math.min(height, ((vp.yMax - 0) / yRange) * height));
  const xStep = width > 0 ? niceStep(xRange, 8) : 1;
  const yStep = height > 0 ? niceStep(yRange, 6) : 1;

  return (
    <div
      ref={handleRef}
      style={{ flex: 1, position: 'relative', backgroundColor: c.surfaceContainerLow, overflow: 'hidden', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}>
      {width > 0 && height > 0 && (
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
          viewBox={`0 0 ${width} ${height}`}>
          {/* Grid & Axes */}
          {(() => {
            const els = [];
            const xStart = Math.ceil(vp.xMin / xStep) * xStep;
            for (let wx = xStart; wx <= vp.xMax + xStep * 0.01; wx += xStep) {
              const sx = ((wx - vp.xMin) / xRange) * width;
              const isAxis = Math.abs(wx) < xStep * 0.05;
              els.push(
                <line key={`v${wx.toFixed(6)}`} x1={sx} y1={0} x2={sx} y2={height}
                  stroke={isAxis ? AXIS_COLOR : GRID_COLOR}
                  strokeWidth={isAxis ? 1.5 : 0.5} />,
              );
              if (!isAxis) {
                const labelY = Math.max(14, Math.min(height - 4, axisY + 12));
                els.push(
                  <text key={`vl${wx.toFixed(6)}`} x={sx + 3} y={labelY}
                    fontSize={9} fontFamily="Manrope" fill={c.onSurface} opacity={0.5}>{fmtTick(wx)}</text>,
                );
              }
            }
            const yStart = Math.ceil(vp.yMin / yStep) * yStep;
            for (let wy = yStart; wy <= vp.yMax + yStep * 0.01; wy += yStep) {
              const sy = ((vp.yMax - wy) / yRange) * height;
              const isAxis = Math.abs(wy) < yStep * 0.05;
              els.push(
                <line key={`h${wy.toFixed(6)}`} x1={0} y1={sy} x2={width} y2={sy}
                  stroke={isAxis ? AXIS_COLOR : GRID_COLOR}
                  strokeWidth={isAxis ? 1.5 : 0.5} />,
              );
              if (!isAxis) {
                const labelX = Math.max(4, Math.min(width - 30, axisX + 3));
                els.push(
                  <text key={`hl${wy.toFixed(6)}`} x={labelX} y={sy - 3}
                    fontSize={9} fontFamily="Manrope" fill={c.onSurface} opacity={0.5}>{fmtTick(wy)}</text>,
                );
              }
            }
            return els;
          })()}
          {/* Axis labels */}
          <text x={width - 10} y={Math.max(14, Math.min(height - 4, axisY - 4))}
            fontSize={11} fontFamily="Manrope" fill={AXIS_COLOR}>x</text>
          <text x={Math.max(4, Math.min(width - 14, axisX + 4))} y={14}
            fontSize={11} fontFamily="Manrope" fill={AXIS_COLOR}>y</text>
          {/* Curves */}
          {curves.map((segs, ci) =>
            segs.map((seg, si) => (
              <line key={`${ci}-${si}`}
                x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
                stroke={curveColors[ci] ?? c.primary}
                strokeWidth={1.5}
                strokeLinecap="round" />
            )),
          )}
        </svg>
      )}
      {/* Legend */}
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {exprs.filter(e => e.trim()).map((expr, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.50)', borderRadius: 12, paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: curveColors[i] ?? c.primary }} />
            <span style={{ fontSize: 11, fontFamily: 'Manrope', fontWeight: 600, color: '#FFFFFF' }}>{formatLegend(expr, i)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GraphScreen ─────────────────────────────────────────────────────────────

export default function GraphScreen() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);
  const curveColors = [c.primary, c.secondary];

  const [exprs, setExprs] = useState(['sin(x)', 'x^2']);
  const [activeEq, setActiveEq] = useState(0);
  const [vp, setVp] = useState<Viewport>(DEFAULT_VP);
  const [cs, setCs] = useState<CanvasSize>({ width: 0, height: 0 });
  const [panMode, setPanMode] = useState(true);

  const vpRef = useRef(vp);
  vpRef.current = vp;
  const csRef = useRef(cs);
  csRef.current = cs;
  const panModeRef = useRef(panMode);
  panModeRef.current = panMode;
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!panModeRef.current) return;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!panModeRef.current || !lastPos.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    const { xMin, xMax, yMin, yMax } = vpRef.current;
    const { width, height } = csRef.current;
    if (!width || !height) return;
    const worldDx = (dx / width) * (xMax - xMin);
    const worldDy = (dy / height) * (yMax - yMin);
    setVp({
      xMin: xMin - worldDx,
      xMax: xMax - worldDx,
      yMin: yMin + worldDy,
      yMax: yMax + worldDy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    lastPos.current = null;
  }, []);

  const handleZoomIn = useCallback(() => {
    setVp(v => {
      const cx = (v.xMin + v.xMax) / 2;
      const cy = (v.yMin + v.yMax) / 2;
      const xr = (v.xMax - v.xMin) * 0.4;
      const yr = (v.yMax - v.yMin) * 0.4;
      return { xMin: cx - xr, xMax: cx + xr, yMin: cy - yr, yMax: cy + yr };
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setVp(v => {
      const cx = (v.xMin + v.xMax) / 2;
      const cy = (v.yMin + v.yMax) / 2;
      const xr = (v.xMax - v.xMin) * 0.625;
      const yr = (v.yMax - v.yMin) * 0.625;
      return { xMin: cx - xr, xMax: cx + xr, yMin: cy - yr, yMax: cy + yr };
    });
  }, []);

  const handleReset = useCallback(() => setVp(DEFAULT_VP), []);

  const handleKey = useCallback(
    (btn: KBtn) => {
      if (btn.value === 'CALC') return;
      setExprs(prev => {
        const next = [...prev];
        next[activeEq] =
          btn.value === 'DEL'
            ? next[activeEq].slice(0, -1)
            : next[activeEq] + btn.value;
        return next;
      });
    },
    [activeEq],
  );

  const evaluators = useMemo(() => exprs.map(e => createEvaluator(e)), [exprs]);
  const curves = useMemo(() => evaluators.map(fn => (fn ? computeSegments(fn, vp, cs) : [])), [evaluators, vp, cs]);

  const handleLayout = useCallback((w: number, h: number) => {
    setCs({ width: w, height: h });
  }, []);

  return (
    <div style={s.root}>
      {/* Graph section */}
      <div style={s.graphSection}>
        <GraphCanvas
          vp={vp}
          curves={curves}
          curveColors={curveColors}
          exprs={exprs}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onLayout={handleLayout}
        />
        {/* Zoom controls */}
        <div style={s.zoomControls}>
          <button style={s.zoomBtn} onClick={handleZoomIn}>
            <span style={s.zoomBtnLabel}>+</span>
          </button>
          <div style={s.zoomDivider} />
          <button style={s.zoomBtn} onClick={handleZoomOut}>
            <span style={s.zoomBtnLabel}>−</span>
          </button>
          <div style={s.zoomDivider} />
          <button style={s.zoomBtn} onClick={handleReset}>
            <Icon path={mdiRestore} size={0.75} color={c.onSurface} />
          </button>
          <div style={s.zoomDivider} />
          <button
            style={{ ...s.zoomBtn, ...(panMode ? s.zoomBtnPan : {}) }}
            onClick={() => setPanMode(p => !p)}>
            <Icon path={mdiHandBackLeft} size={0.75} color={panMode ? c.onPrimary : c.onSurface} />
          </button>
        </div>
      </div>

      {/* Equation inputs */}
      <div style={s.equations}>
        {exprs.map((expr, i) => (
          <div
            key={i}
            style={{ ...s.eqSlot, ...(activeEq === i ? s.eqSlotActive : {}) }}
            onClick={() => setActiveEq(i)}>
            <span style={s.eqLabel}>{i === 0 ? 'f₁' : 'f₂'}</span>
            <input
              style={s.eqInput}
              value={expr}
              onChange={e => {
                const text = e.target.value;
                setExprs(prev => {
                  const next = [...prev];
                  next[i] = text;
                  return next;
                });
              }}
              onFocus={() => setActiveEq(i)}
              placeholder={i === 0 ? 'Enter equation' : 'Add equation'}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div style={s.keypad}>
        {GRAPH_KEYS.map((row, ri) => (
          <div key={ri} style={s.krow}>
            {row.map(btn => (
              <button
                key={btn.value}
                style={{
                  ...s.kbtn,
                  ...(btn.variant === 'del' ? s.kbtnDel : {}),
                  ...(btn.variant === 'calc' ? s.kbtnCalc : {}),
                }}
                onClick={() => handleKey(btn)}>
                {btn.icon && ICON_MAP[btn.icon] ? (
                  <Icon
                    path={ICON_MAP[btn.icon]}
                    size={1}
                    color={
                      btn.variant === 'del'
                        ? c.onSecondary
                        : c.onSurface
                    }
                  />
                ) : (
                  <span style={{
                    ...s.kbtnLabel,
                    ...(btn.variant === 'calc' ? s.kbtnLabelCalc : {}),
                  }}>
                    {btn.label}
                  </span>
                )}
              </button>
            ))}
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
    graphSection: {
      flex: 1,
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    zoomControls: {
      position: 'absolute',
      right: 12,
      bottom: 12,
      backgroundColor: c.surfaceContainerHighest,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    zoomBtn: {
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    zoomBtnPan: {
      backgroundColor: c.primaryContainer,
    },
    zoomBtnLabel: {
      fontSize: 22,
      fontFamily: 'Manrope',
      fontWeight: 300,
      color: c.onSurface,
      lineHeight: '26px',
      userSelect: 'none',
      pointerEvents: 'none',
    },
    zoomDivider: {
      height: 1,
      backgroundColor: c.outlineVariant,
      marginLeft: 8,
      marginRight: 8,
    },
    equations: {
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 10,
      gap: 8,
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    },
    eqSlot: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 16,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      gap: 12,
      border: '1.5px solid transparent',
      cursor: 'text',
    },
    eqSlotActive: {
      borderColor: c.primaryContainer,
    },
    eqLabel: {
      fontSize: 13,
      fontFamily: 'Manrope',
      fontWeight: 400,
      color: c.onSurfaceVariant,
      minWidth: 14,
    },
    eqInput: {
      flex: 1,
      fontSize: 26,
      fontFamily: 'Manrope',
      fontWeight: 400,
      color: c.onSurface,
      background: 'none',
      border: 'none',
      outline: 'none',
      padding: 0,
    },
    keypad: {
      paddingLeft: GAP,
      paddingRight: GAP,
      paddingTop: GAP,
      paddingBottom: GAP,
      gap: GAP,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
    },
    krow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      gap: GAP,
      minHeight: 0,
    },
    kbtn: {
      flex: 1,
      minHeight: 0,
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      minWidth: 0,
    },
    kbtnDel: {
      backgroundColor: c.secondary,
    },
    kbtnCalc: {
      backgroundColor: c.primaryContainer,
    },
    kbtnLabel: {
      fontSize: 22,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurface,
      userSelect: 'none',
      pointerEvents: 'none',
    },
    kbtnLabelCalc: {
      fontSize: 26,
      color: c.onPrimaryContainer,
    },
  };
}
