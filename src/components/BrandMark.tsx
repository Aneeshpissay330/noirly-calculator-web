import { Link } from 'react-router-dom';
import { BRAND_NAME, BRAND_TAGLINE } from '../lib/brand';
import logoUrl from '../assets/logo.png';

type BrandVariant = 'header' | 'sidebar' | 'footer' | 'hero';

const titleClasses: Record<BrandVariant, string> = {
  header: 'font-display text-sm font-bold leading-none text-primary sm:text-base',
  sidebar: 'font-display text-base font-bold leading-none text-primary',
  footer: 'font-display text-sm font-bold leading-none text-primary sm:text-base',
  hero: 'font-display text-lg font-bold leading-none text-primary sm:text-xl',
};

const taglineClasses: Record<BrandVariant, string> = {
  header: 'mt-0.5 text-[9px] leading-snug text-on-surface-variant/80 sm:text-[10px]',
  sidebar: 'mt-1 text-[10px] leading-snug text-on-surface-variant/80',
  footer: 'mt-0.5 text-[9px] leading-snug text-on-surface-variant/80 sm:text-[10px]',
  hero: 'mt-1 text-xs leading-snug text-on-surface-variant sm:text-sm',
};

const iconClasses: Record<BrandVariant, string> = {
  header: 'h-10 w-10 shrink-0 sm:h-11 sm:w-11',
  sidebar: 'h-11 w-11 shrink-0',
  footer: 'h-10 w-10 shrink-0 sm:h-11 sm:w-11',
  hero: 'h-12 w-12 shrink-0 sm:h-14 sm:w-14',
};

interface BrandMarkProps {
  variant?: BrandVariant;
  href?: string | null;
  className?: string;
}

function BrandIcon({ variant }: { variant: BrandVariant }) {
  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden
      width={512}
      height={512}
      decoding="async"
      className={`rounded-lg object-contain ${iconClasses[variant]}`}
    />
  );
}

export default function BrandMark({
  variant = 'header',
  href = '/',
  className = '',
}: BrandMarkProps) {
  const content = (
    <span
      className={`inline-flex min-w-0 items-center gap-2.5 sm:gap-3 ${className}`.trim()}
    >
      <BrandIcon variant={variant} />
      <span className="min-w-0 text-left">
        <span className={`block truncate ${titleClasses[variant]}`}>{BRAND_NAME}</span>
        <span className={`block truncate ${taglineClasses[variant]}`}>{BRAND_TAGLINE}</span>
      </span>
    </span>
  );

  if (href) {
    return (
      <Link to={href} className="inline-flex min-w-0 max-w-full shrink-0 cursor-pointer">
        {content}
      </Link>
    );
  }

  return content;
}
