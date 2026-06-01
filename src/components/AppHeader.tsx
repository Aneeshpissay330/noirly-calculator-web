import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiHistory, mdiCogOutline } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';

export default function AppHeader() {
  const navigate = useNavigate();
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  return (
    <div style={s.header}>
      <button style={s.iconBtn} onClick={() => navigate('/history')}>
        <Icon path={mdiHistory} size={1.1} color={c.onSurfaceVariant} />
      </button>
      <button style={s.iconBtn} onClick={() => navigate('/settings')}>
        <Icon path={mdiCogOutline} size={1.1} color={c.onSurfaceVariant} />
      </button>
    </div>
  );
}

function makeStyles(c: Colors): Record<string, React.CSSProperties> {
  return {
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 8,
      gap: 16,
      backgroundColor: c.background,
      flexShrink: 0,
    },
    iconBtn: {
      background: 'none',
      border: 'none',
      padding: 4,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
  };
}
