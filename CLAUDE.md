# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Visual Development Workflow

When making visual changes, use Playwright to open http://localhost:3000/ and monitor the current appearance of the website while editing. This ensures changes render correctly in the 3D scene and UI components.

## Architecture Overview

This is an interactive 3D portfolio website built with Next.js App Router, React Three Fiber, and Zustand.

### Tech Stack
- **Next.js 16** with App Router (`/app` directory)
- **React Three Fiber** + **Three.js** for 3D graphics
- **Zustand** for state management
- **Framer Motion** for animations
- **Tailwind CSS** for styling

### Key Directories

```
app/           # Next.js App Router pages and layouts
components/
  ├── ui/      # 2D UI components (Navigation, HeroOverlay, LoadingGlobe)
  └── canvas/  # 3D components (Scene, PolaroidCard)
hooks/         # Custom hooks (useScrollPhysics)
lib/           # Shared utilities (seededRandom)
store/         # Zustand store (scroll, UI, scene state)
```

### State Management

`/store/index.ts` exports `usePortfolioStore` which manages:
- **Scroll state:** depth, scrollVelocity, normalizedScroll
- **UI state:** isNavExpanded (auto-expands at 70% scroll, collapses at 10%)
- **Scene state:** isSceneReady, cardsVisible, heroTextOpacity

### 3D Scene Architecture

The main 3D scene (`/components/canvas/Scene.tsx`) renders:
- 12 Polaroid cards in a tunnel formation around center
- Wind physics: cards lean based on scroll velocity
- Seeded randomness for deterministic card positioning
- Loading globe animation until scene is ready

`/components/canvas/Card.tsx` contains:
- `PolaroidCard` - 3D polaroid card with multiple meshes and wind physics
- Independent floating animation per card with unique parameters
- Uses `maath/easing` for smooth damped animations

### Custom Hooks

- `useScrollPhysics()` - Tracks scroll position and velocity with 0.95 damping, updates store state

### Shared Utilities

`/lib/utils.ts` contains:
- `seededRandom(seed)` - Deterministic pseudo-random number generator for consistent card positioning

### Page Structure

`/app/page.tsx` is a client component with:
- Dynamically imported Scene (SSR disabled)
- Hero section with 1100vh scroll space for 3D tunnel effect
- Projects, About, Experience, Contact, Footer sections

### Styling

Custom Tailwind theme in `tailwind.config.ts`:
- Navy (`#050511`), Electric Blue/Cyan/Yellow palette
- Custom animations: float, pulse-slow, shimmer, elastic-scale
- Custom easing: out-expo, in-out-expo, spring

### Important Technical Details

- Scene uses `dynamic` import with `ssr: false` to avoid hydration issues
- Canvas DPR is `[1.5, 2]` for quality rendering
- Navigation auto-expands at 70% scroll, collapses when returning to hero (< 10%)
- Cards fade out individually based on their scroll progress (0.4 to 0.8 range)
- Hero text uses CSS `mix-blend-mode: difference` for color inversion effect on cards
