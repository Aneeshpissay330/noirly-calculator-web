# Noirly Calculator

**Calculate anything. Offline. Always.**

Noirly Calculator is a full-featured browser calculator with five modes — basic, scientific, unit conversion, graph plotting, and programmer — plus local history. It shares the Noirly design system with [Noirly AlgoLab](../noirly-codelab): dark-first slate/cyan theming, Geist typography, and glass-style UI.

![Vite](https://img.shields.io/badge/Vite-8-646CFF)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [UI & Theming](#ui--theming)
- [Scripts](#scripts)

---

## Features

### Calculator modes
- **Basic** — arithmetic, percentage, backspace, live expression preview
- **Scientific** — trig, log, ln, sqrt, powers, and related functions
- **Convert** — length, weight, temperature, volume, area, and speed
- **Graph** — plot up to two equations with pan, zoom, and axis labels
- **Programmer** — hex, decimal, octal, binary, and bitwise operations

### Platform
- **Landing page** at `/` with feature overview and CTAs
- **Sidebar app shell** — 240px desktop nav, mobile drawer
- **Calculation history** — persisted locally via Redux Persist
- **Theme support** — system, light, and dark modes
- **Offline-ready** — no backend or account required
- **Privacy & Terms** pages included

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Build | [Vite 8](https://vite.dev/) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| Routing | [React Router 7](https://reactrouter.com/) |
| State | [Redux Toolkit](https://redux-toolkit.js.org/) + [redux-persist](https://github.com/rt2zz/redux-persist) |
| Icons | Material Symbols (shell), [MDI](https://materialdesignicons.com/) (calculator keypads) |
| Fonts | [Geist](https://vercel.com/font), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| Language | TypeScript 6 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+

### Install and run

```bash
git clone <repo-url>
cd noirly-calculator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm run build
npm run preview
```

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/calc` | Basic calculator |
| `/scientific` | Scientific calculator |
| `/convert` | Unit converter |
| `/graph` | Graph plotter |
| `/programmer` | Programmer calculator |
| `/history` | Calculation history |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms of service |

Click **Noirly Calculator** in the sidebar to return to the landing page from any app route.

---

## Project Structure

```
noirly-calculator/
├── src/
│   ├── assets/
│   │   └── logo.png          # Brand logo — also synced to public/favicon.png
│   ├── components/           # BrandMark, TabLayout, PublicHeader, etc.
│   ├── lib/
│   │   └── brand.ts          # Brand name and tagline
│   ├── screens/              # Landing page and calculator modes
│   ├── store/                # Redux slices (history, settings)
│   ├── theme/                # Colors, ThemeContext, fonts
│   ├── App.tsx               # Router setup
│   └── index.css             # Tailwind + design tokens
├── index.html
├── postcss.config.mjs
└── vite.config.ts
```

---

## UI & Theming

The app uses the same token-driven design system as Noirly AlgoLab:

- **Dark default** — `#0B0F19` background, `#111827` surfaces, `#38BDF8` primary
- **Light mode** — white/slate surfaces, `#0284C7` primary
- **CSS variables** on `html.dark` / `html.light` mapped to Tailwind utilities
- **Utility classes** — `glass-card`, `glass-panel`, `accent-card`, `app-main`

Theme preference is stored in localStorage via Redux Persist (`settings.theme`: `system` | `light` | `dark`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Part of the Noirly family

| Project | Description |
|---------|-------------|
| **Noirly Calculator** | This repo — offline multi-mode calculator |
| **Noirly AlgoLab** | Visual DSA learning platform |

Both projects share branding, color palette, typography, and UI patterns.
