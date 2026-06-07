import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import BrandMark from './BrandMark';
import ThemeToggle from './ThemeToggle';
import { useThemeControl } from '../theme/ThemeContext';

const TABS = [
  { path: '/calc',        label: 'Calc',        icon: 'calculate' },
  { path: '/scientific',  label: 'Scientific',  icon: 'science' },
  { path: '/convert',     label: 'Convert',     icon: 'swap_horiz' },
  { path: '/graph',       label: 'Graph',       icon: 'show_chart' },
  { path: '/programmer',  label: 'Programmer',  icon: 'code' },
];

const BOTTOM_LINKS = [
  { path: '/history',        label: 'History',        icon: 'history' },
  { path: '/privacy-policy', label: 'Privacy Policy', icon: 'shield' },
  { path: '/terms',          label: 'Terms',          icon: 'description' },
];

export default function TabLayout() {
  const pathname = useLocation().pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const { themeSetting } = useThemeControl();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isActive = (path: string) => {
    if (path === '/calc') return pathname === '/calc';
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navLinkClass = (path: string) =>
    `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-display text-body-md transition-colors duration-200 active:scale-95 ${
      isActive(path)
        ? 'border border-primary/20 bg-primary/10 text-primary'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-outline-variant/40 bg-background/95 px-4 backdrop-blur-md lg:hidden">
        <BrandMark variant="header" href="/" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-[65] bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-[70] flex h-full w-[min(280px,85vw)] flex-col border-r border-outline-variant/40 bg-surface-container p-4 transition-transform duration-300 ease-out lg:w-[240px] lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-6 w-full shrink-0 px-0.5">
          <BrandMark variant="sidebar" href="/" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {TABS.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/calc'}
              className={navLinkClass(tab.path)}
            >
              <span className="material-symbols-outlined">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 space-y-1 border-t border-outline-variant/30 pt-4">
          {BOTTOM_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={navLinkClass(link.path)}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-4">
          <span className="text-xs capitalize text-on-surface-variant">
            Theme: {themeSetting}
          </span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content */}
      <div className="app-main pt-16 lg:pt-0">
        <main className="flex min-h-screen flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
