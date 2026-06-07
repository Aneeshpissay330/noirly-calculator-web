import type { ReactNode } from 'react';
import BrandMark from './BrandMark';

interface SiteFooterProps {
  children?: ReactNode;
  className?: string;
}

export default function SiteFooter({ children, className = '' }: SiteFooterProps) {
  return (
    <footer
      className={`border-t border-outline-variant/20 bg-surface-container/50 ${className}`.trim()}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:px-6 sm:py-8 sm:text-left">
        <BrandMark variant="footer" href="/" />
        {children}
      </div>
    </footer>
  );
}
