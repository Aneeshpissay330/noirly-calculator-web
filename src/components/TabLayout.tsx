import React, { useMemo } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import {
  mdiCalculatorVariant,
  mdiFlaskOutline,
  mdiSwapHorizontal,
  mdiChartBellCurve,
  mdiCodeBraces,
  mdiHistory,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiThemeLightDark,
  mdiShieldCheckOutline,
  mdiFileDocumentOutline,
} from '@mdi/js';
import logoImg from '../assets/logo-1.png';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme } from '../store/settingsSlice';
import type { ThemeMode } from '../store/settingsSlice';

const TABS = [
  { path: '/',           label: 'Calc',        icon: mdiCalculatorVariant },
  { path: '/scientific', label: 'Scientific',  icon: mdiFlaskOutline },
  { path: '/convert',    label: 'Convert',     icon: mdiSwapHorizontal },
  { path: '/graph',      label: 'Graph',       icon: mdiChartBellCurve },
  { path: '/programmer', label: 'Programmer',  icon: mdiCodeBraces },
];

const BOTTOM_LINKS = [
  { path: '/history',        label: 'History',        icon: mdiHistory },
  { path: '/privacy-policy', label: 'Privacy Policy', icon: mdiShieldCheckOutline },
  { path: '/terms',          label: 'Terms',          icon: mdiFileDocumentOutline },
];

const THEME_CYCLE: ThemeMode[] = ['system', 'light', 'dark'];
const THEME_ICON: Record<ThemeMode, string> = {
  system: mdiThemeLightDark,
  light:  mdiWeatherSunny,
  dark:   mdiWeatherNight,
};
const THEME_LABEL: Record<ThemeMode, string> = {
  system: 'System',
  light:  'Light',
  dark:   'Dark',
};

export default function TabLayout() {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(st => st.settings.theme);

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    dispatch(setTheme(next));
  };

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.brand}>
          <img src={logoImg} alt="Noirly" style={s.logo} />
          <div style={s.brandText}>
            <span style={s.brandName}>Noirly</span>
            <span style={s.brandSub}>CALCULATOR</span>
          </div>
        </div>

        {/* Main nav */}
        <nav style={s.nav}>
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/'}
              style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navItemActive : {}) })}>
              {({ isActive }) => (
                <>
                  <Icon
                    path={tab.icon}
                    size={0.9}
                    color={isActive ? c.onPrimary : c.onSurfaceVariant}
                  />
                  <span style={{ ...s.navLabel, ...(isActive ? s.navLabelActive : {}) }}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom links */}
        <div style={s.bottomLinks}>
          {BOTTOM_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({ ...s.navItem, ...(isActive ? s.navItemActive : {}) })}>
              {({ isActive }) => (
                <>
                  <Icon
                    path={link.icon}
                    size={0.85}
                    color={isActive ? c.onPrimary : c.onSurfaceVariant}
                  />
                  <span style={{ ...s.navLabel, ...(isActive ? s.navLabelActive : {}) }}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Theme toggle */}
        <div style={s.themeRow}>
          <button style={s.themeBtn} onClick={cycleTheme} title={`Theme: ${THEME_LABEL[theme]}`}>
            <Icon path={THEME_ICON[theme]} size={0.85} color={c.onSurfaceVariant} />
            <span style={s.themeLabel}>{THEME_LABEL[theme]}</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>
        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function makeStyles(c: Colors): Record<string, React.CSSProperties> {
  const isDark = c.background === '#0F0F11';
  const sidebarBg = isDark ? '#0d0d0f' : '#f0f0f0';
  const sidebarBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      backgroundColor: c.background,
      overflow: 'hidden',
    },

    // ── Sidebar ──────────────────────────────────────────
    sidebar: {
      width: 200,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: sidebarBg,
      borderRight: `1px solid ${sidebarBorder}`,
      paddingTop: 20,
      paddingBottom: 16,
      paddingLeft: 12,
      paddingRight: 12,
      overflowY: 'auto',
    },
    brand: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 8,
      paddingRight: 8,
      marginBottom: 28,
      flexShrink: 0,
    },
    logo: {
      width: 34,
      height: 34,
      objectFit: 'contain' as const,
      borderRadius: 9,
      flexShrink: 0,
    },
    brandText: {
      display: 'flex',
      flexDirection: 'column',
    },
    brandName: {
      fontSize: 15,
      fontFamily: 'Manrope',
      fontWeight: 800,
      color: c.onSurface,
      lineHeight: 1.2,
      letterSpacing: '-0.2px',
    },
    brandSub: {
      fontSize: 9,
      fontFamily: 'Manrope',
      fontWeight: 600,
      color: c.onSurfaceVariant,
      letterSpacing: '1.4px',
      opacity: 0.6,
    },
    nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
    navItem: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10,
      textDecoration: 'none',
      transition: 'background 0.15s',
      cursor: 'pointer',
    },
    navItemActive: {
      backgroundColor: c.primary,
    },
    navLabel: {
      fontSize: 14,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurfaceVariant,
      whiteSpace: 'nowrap' as const,
    },
    navLabelActive: {
      color: c.onPrimary,
      fontWeight: 600,
    },
    bottomLinks: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      marginBottom: 8,
    },
    themeRow: {
      paddingTop: 8,
      borderTop: `1px solid ${sidebarBorder}`,
      marginTop: 4,
    },
    themeBtn: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      gap: 10,
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 10,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
    },
    themeLabel: {
      fontSize: 14,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurfaceVariant,
    },

    // ── Main ─────────────────────────────────────────────
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      overflow: 'hidden',
    },
    footer: {
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
      height: 36,
      backgroundColor: isDark ? 'rgba(15,15,17,0.9)' : 'rgba(245,245,245,0.9)',
      borderTop: `1px solid ${sidebarBorder}`,
    },
    footerText: {
      fontSize: 11,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurfaceVariant,
      opacity: 0.5,
    },
    footerLinks: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    footerLink: {
      fontSize: 11,
      fontFamily: 'Manrope',
      fontWeight: 500,
      color: c.onSurfaceVariant,
      opacity: 0.5,
      textDecoration: 'none',
    } as React.CSSProperties,
    footerSep: {
      fontSize: 10,
      color: c.onSurfaceVariant,
      opacity: 0.3,
    },
  };
}
