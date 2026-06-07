import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTheme, type ThemeMode } from '../store/settingsSlice';
import { lightColors, darkColors } from './colors';
import type { Colors } from './colors';

const ThemeContext = createContext<Colors>(lightColors);

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyThemeClass(resolved: 'dark' | 'light') {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [systemDark, setSystemDark] = useState(getSystemDark);
  const themeSetting = useAppSelector(s => s.settings?.theme ?? 'system');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    themeSetting === 'dark' ? 'dark' :
    themeSetting === 'light' ? 'light' :
    systemDark ? 'dark' : 'light';

  useEffect(() => {
    applyThemeClass(resolvedTheme);
  }, [resolvedTheme]);

  const resolved = resolvedTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={resolved}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): Colors {
  return useContext(ThemeContext);
}

export function useThemeControl() {
  const dispatch = useAppDispatch();
  const themeSetting = useAppSelector(s => s.settings?.theme ?? 'system');
  const [systemDark, setSystemDark] = useState(getSystemDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'dark' | 'light' =
    themeSetting === 'dark' ? 'dark' :
    themeSetting === 'light' ? 'light' :
    systemDark ? 'dark' : 'light';

  const cycleTheme = () => {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(themeSetting) + 1) % order.length];
    dispatch(setTheme(next));
  };

  const toggleTheme = () => {
    dispatch(setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'));
  };

  return { themeSetting, resolvedTheme, cycleTheme, toggleTheme };
}
