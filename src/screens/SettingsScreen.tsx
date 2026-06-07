import React, { useMemo } from 'react';
import { Icon } from '@mdi/react';
import { mdiWeatherNight, mdiShieldCheckOutline, mdiChevronRight } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/settingsSlice';
import type { ThemeMode } from '../store/settingsSlice';

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(s => s.settings.theme);
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <div style={s.root}>
      {/* Appearance */}
      <span style={s.sectionLabel}>APPEARANCE</span>
      <div style={s.card}>
        <div style={s.cardRow}>
          <Icon path={mdiWeatherNight} size={0.9} color={c.onSurfaceVariant} />
          <span style={s.cardRowLabel}>Theme</span>
        </div>
        <div style={s.segmented}>
          {THEME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              style={{ ...s.segment, ...(theme === opt.value ? s.segmentActive : {}) }}
              onClick={() => dispatch(setTheme(opt.value))}>
              <span style={{ ...s.segmentText, ...(theme === opt.value ? s.segmentTextActive : {}) }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Legal */}
      <span style={s.sectionLabel}>LEGAL</span>
      <div style={s.card}>
        <a
          href="https://example.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          style={s.cardRowLink}>
          <Icon path={mdiShieldCheckOutline} size={0.9} color={c.onSurfaceVariant} />
          <span style={s.cardRowLabel}>Privacy Policy</span>
          <Icon path={mdiChevronRight} size={0.85} color={c.outlineVariant} />
        </a>
      </div>
    </div>
  );
}

function makeStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: c.background,
      overflow: 'hidden',
    },
    sectionLabel: {
      fontSize: 11,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurfaceVariant,
      letterSpacing: '1.4px',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 24,
      paddingBottom: 8,
      display: 'block',
      flexShrink: 0,
    },
    card: {
      marginLeft: 14,
      marginRight: 14,
      backgroundColor: c.surfaceContainerHigh,
      borderRadius: 18,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 14,
      paddingBottom: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      flexShrink: 0,
    },
    cardRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    cardRowLink: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      textDecoration: 'none',
      color: 'inherit',
    },
    cardRowLabel: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
    },
    segmented: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: c.surfaceContainerHighest,
      borderRadius: 12,
      padding: 3,
      gap: 2,
    },
    segment: {
      flex: 1,
      paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      background: 'none',
    },
    segmentActive: {
      backgroundColor: c.primaryContainer,
    },
    segmentText: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 600,
      color: c.onSurfaceVariant,
      userSelect: 'none',
    },
    segmentTextActive: {
      color: c.onPrimaryContainer,
    },
  };
}
