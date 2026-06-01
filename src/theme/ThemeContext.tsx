import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { lightColors, darkColors } from './colors';
import type { Colors } from './colors';

const ThemeContext = createContext<Colors>(lightColors);

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  let resolved: Colors;
  if (themeSetting === 'dark') {
    resolved = darkColors;
  } else if (themeSetting === 'light') {
    resolved = lightColors;
  } else {
    resolved = systemDark ? darkColors : lightColors;
  }

  return (
    <ThemeContext.Provider value={resolved}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): Colors {
  return useContext(ThemeContext);
}
