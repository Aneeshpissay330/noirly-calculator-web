import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BrandMark from './BrandMark';
import ThemeToggle from './ThemeToggle';

export default function PublicHeader() {
  const pathname = useLocation().pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = (
    <>
      <Link
        to="/calc"
        onClick={() => setMenuOpen(false)}
        className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-on-primary transition hover:bg-primary/90"
      >
        Open Calculator
      </Link>
    </>
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-outline-variant/40 bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-6">
        <BrandMark variant="header" />

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {navLinks}
        </div>

        <div className="flex items-center gap-2 md:hidden">
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

      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="fixed top-16 right-0 left-0 z-[70] border-b border-outline-variant/40 bg-surface-container p-4 shadow-lg sm:top-[4.5rem] md:hidden">
            <div className="flex flex-col gap-2">{navLinks}</div>
          </nav>
        </>
      )}
    </>
  );
}
