import { useThemeControl } from '../theme/ThemeContext';

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useThemeControl();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-high text-on-surface transition hover:border-primary/40 hover:bg-primary/10"
    >
      <span className="material-symbols-outlined text-[20px]">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
