import React, { useMemo } from 'react';
import { Icon } from '@mdi/react';
import { mdiClose, mdiHistory } from '@mdi/js';
import { useThemeColors } from '../theme/ThemeContext';
import type { Colors } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearHistory, removeEntry } from '../store/historySlice';
import type { HistoryEntry } from '../store/historySlice';

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function HistoryItem({
  item,
  onDelete,
}: {
  item: HistoryEntry;
  onDelete: (id: string) => void;
}) {
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);
  return (
    <div style={s.item}>
      <div style={s.itemContent}>
        <span style={s.expression}>{item.expression}</span>
        <span style={s.result}>= {item.result}</span>
        <span style={s.timestamp}>{formatDate(item.timestamp)}</span>
      </div>
      <button style={s.deleteBtn} onClick={() => onDelete(item.id)}>
        <Icon path={mdiClose} size={0.75} color={c.outline} />
      </button>
    </div>
  );
}

export default function HistoryScreen() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector(state => state.history.entries);
  const c = useThemeColors();
  const s = useMemo(() => makeStyles(c), [c]);

  const handleDelete = (id: string) => dispatch(removeEntry(id));

  const handleClearAll = () => {
    if (window.confirm('Delete all calculation history?')) {
      dispatch(clearHistory());
    }
  };

  return (
    <div style={s.root}>
      {entries.length > 0 && (
        <div style={s.actionBar}>
          <button style={s.clearBtn} onClick={handleClearAll}>Clear all</button>
        </div>
      )}

      {entries.length === 0 ? (
        <div style={s.empty}>
          <Icon path={mdiHistory} size={2.5} color={c.outlineVariant} />
          <span style={s.emptyText}>No calculations yet</span>
        </div>
      ) : (
        <div style={s.list}>
          {entries.map(item => (
            <HistoryItem key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}
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
    actionBar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 10,
      flexShrink: 0,
    },
    clearBtn: {
      background: 'none',
      border: 'none',
      padding: 4,
      cursor: 'pointer',
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.error,
    },
    empty: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.onSurfaceVariant,
    },
    list: {
      flex: 1,
      overflowY: 'auto',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surfaceContainerLow,
      borderRadius: 16,
      padding: 16,
      flexShrink: 0,
    },
    itemContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    expression: {
      fontSize: 14,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.onSurfaceVariant,
      marginBottom: 2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    result: {
      fontSize: 22,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 500,
      color: c.onSurface,
    },
    timestamp: {
      fontSize: 12,
      fontFamily: 'Geist Variable, system-ui, sans-serif',
      fontWeight: 400,
      color: c.outline,
      marginTop: 4,
    },
    deleteBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.surfaceContainerHigh,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      marginLeft: 8,
      flexShrink: 0,
    },
  };
}
