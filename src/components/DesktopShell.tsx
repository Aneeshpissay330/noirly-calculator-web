import React from 'react';
import { useThemeColors } from '../theme/ThemeContext';

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const c = useThemeColors();
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surfaceContainerLowest,
      backgroundImage: `radial-gradient(circle at 1px 1px, ${c.outlineVariant}33 1px, transparent 0)`,
      backgroundSize: '28px 28px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 460,
        height: '100%',
        maxHeight: 820,
        backgroundColor: c.background,
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${c.outlineVariant}`,
      }}>
        {children}
      </div>
    </div>
  );
}
