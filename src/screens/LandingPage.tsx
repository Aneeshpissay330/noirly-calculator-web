import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import SiteFooter from '../components/SiteFooter';
import PublicHeader from '../components/PublicHeader';

const features = [
  {
    icon: 'calculate',
    title: 'Basic & Scientific',
    description:
      'Everyday arithmetic and advanced functions — trig, logs, powers — with live expression preview.',
  },
  {
    icon: 'swap_horiz',
    title: 'Unit Converter',
    description:
      'Convert length, weight, temperature, volume, area, and speed with a built-in numpad.',
  },
  {
    icon: 'show_chart',
    title: 'Graph Plotter',
    description:
      'Plot up to two equations on an interactive canvas with pan, zoom, and axis labels.',
  },
  {
    icon: 'code',
    title: 'Programmer Mode',
    description:
      'Hex, decimal, octal, and binary with bitwise AND, OR, XOR, NOT, and shift operations.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Pick a mode',
    description: 'Basic, scientific, convert, graph, or programmer — all from one sidebar.',
  },
  {
    step: '02',
    title: 'Calculate',
    description: 'Type with the on-screen keypad or keyboard. See results update live.',
  },
  {
    step: '03',
    title: 'Review history',
    description: 'Every result is saved locally so you can revisit past calculations anytime.',
  },
];

const modes = [
  { icon: 'calculate', title: 'Basic', description: 'Standard arithmetic with percentage and backspace.' },
  { icon: 'science', title: 'Scientific', description: 'Sin, cos, tan, log, ln, sqrt, and power functions.' },
  { icon: 'swap_horiz', title: 'Convert', description: 'Six unit categories with quick category switching.' },
  { icon: 'show_chart', title: 'Graph', description: 'Visualize functions with dual-equation plotting.' },
  { icon: 'code', title: 'Programmer', description: 'Base conversions and bitwise operations.' },
];

function HeroPreview() {
  return (
    <div className="glass-card w-full max-w-sm rounded-2xl p-5 sm:p-6">
      <p className="mb-4 text-xs uppercase tracking-widest text-on-surface-variant">
        Basic Calc — Live Preview
      </p>
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-high p-4">
        <p className="text-right font-mono text-2xl font-semibold text-on-surface">1,248</p>
        <p className="mt-1 text-right font-mono text-xs text-on-surface-variant">52 × 24</p>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '='].map((key, i) => (
          <div
            key={key + i}
            className={`flex h-9 items-center justify-center rounded-lg text-sm font-medium ${
              key === '='
                ? 'col-span-1 bg-primary text-on-primary shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                : ['÷', '×', '−'].includes(key)
                  ? 'bg-primary/15 text-primary'
                  : 'border border-outline-variant/30 bg-surface-container text-on-surface'
            }`}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="pt-16 sm:pt-[4.5rem]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-outline-variant/30">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.25) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-tertiary/10 blur-3xl" />

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 text-center sm:gap-10 sm:px-6 sm:py-16 lg:flex-row lg:gap-10 lg:py-28 lg:text-left">
            <div className="flex-1 space-y-5 sm:space-y-6">
              <div className="flex justify-center lg:justify-start">
                <BrandMark variant="hero" href={null} />
              </div>
              <h1 className="font-display text-3xl font-extrabold leading-tight text-on-surface sm:text-4xl lg:text-[3.25rem]">
                Don&apos;t reach for your phone.
                <br />
                <span className="text-primary">Calculate right here.</span>
              </h1>
              <p className="mx-auto max-w-xl text-base text-on-surface-variant sm:text-lg lg:mx-0">
                A full-featured calculator in your browser — basic, scientific, unit conversion,
                graphing, and programmer modes. Works offline, saves your history locally.
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:justify-start">
                <Link
                  to="/calc"
                  className="cursor-pointer rounded-lg bg-primary px-6 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
                >
                  Open Calculator
                </Link>
                <Link
                  to="/scientific"
                  className="cursor-pointer rounded-lg border border-outline-variant/40 px-6 py-3 text-center font-display font-semibold text-on-surface transition hover:bg-surface-container-high"
                >
                  Try Scientific Mode
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm flex-shrink-0 lg:max-w-sm">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-outline-variant/20 bg-surface-container/50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 md:grid-cols-4">
            {[
              { value: '5', label: 'Calculator Modes' },
              { value: '6', label: 'Unit Categories' },
              { value: '100%', label: 'Offline Ready' },
              { value: '∞', label: 'History Saved' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              Everything you need to calculate
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
              Five modes, one app — from quick sums to graph plotting and bitwise ops.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {features.map(f => (
              <div
                key={f.title}
                className="glass-card cursor-pointer rounded-xl p-5 sm:p-6"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <span className="material-symbols-outlined">{f.icon}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Modes */}
        <section className="border-y border-outline-variant/20 bg-surface-container/30 py-12 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                Five modes, one sidebar
              </h2>
              <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
                Switch instantly between calculator types without losing your place.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {modes.map(mode => (
                <div
                  key={mode.title}
                  className="glass-card rounded-xl p-5 sm:p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      {mode.icon}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-on-surface sm:text-xl">
                    {mode.title}
                  </h3>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {mode.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              Simple as 1-2-3
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
              No accounts, no downloads — open the app and start calculating.
            </p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {steps.map(s => (
              <div
                key={s.step}
                className="relative rounded-xl border border-outline-variant/30 bg-surface-container p-5 sm:p-6"
              >
                <span className="font-mono text-3xl font-bold text-primary/20 sm:text-4xl">
                  {s.step}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold text-on-surface">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-outline-variant/20 bg-gradient-to-br from-primary/10 via-background to-tertiary/5">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
              Ready to crunch some numbers?
            </h2>
            <p className="mt-4 text-sm text-on-surface-variant sm:text-base">
              Open the calculator and start with basic mode — your history saves automatically.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                to="/calc"
                className="cursor-pointer rounded-lg bg-primary px-8 py-3 text-center font-display font-semibold text-on-primary transition hover:bg-primary/90"
              >
                Open Calculator
              </Link>
              <Link
                to="/graph"
                className="cursor-pointer rounded-lg border border-outline-variant/40 px-8 py-3 text-center font-display font-semibold text-on-surface transition hover:bg-surface-container-high"
              >
                Try Graph Mode
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter>
          <div className="flex gap-4 text-sm">
            <Link
              to="/calc"
              className="text-on-surface-variant transition hover:text-primary"
            >
              Calculator
            </Link>
            <Link
              to="/privacy-policy"
              className="text-on-surface-variant transition hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-on-surface-variant transition hover:text-primary"
            >
              Terms
            </Link>
          </div>
        </SiteFooter>
      </main>
    </div>
  );
}
