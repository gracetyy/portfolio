# GitHub Copilot instructions for this repo

Purpose: short, actionable guidance so an AI coding agent becomes productive quickly in this repository.

## Big picture
- This is a **Next.js 16 App Router** portfolio site with a heavy client-side 3D scene implemented with **React Three Fiber / three.js**. The 3D scene is a visual centerpiece — most changes are either layout/UI or 3D scene behavior.
- The build produces a **static export** (`output: 'export'` in `next.config.ts`) and is deployed to GitHub Pages (published to the `gh-pages` branch via Actions).
- Keep source code (React + TSX) on `main`; built site is pushed to `gh-pages` by CI. The live domain is `gracetyy.dev`.

## Key files
- App entry & routes: `app/` (App Router). Primary page: `app/page.tsx` (client component, imports `Scene` dynamically: `ssr: false`).
- 3D Scene: `components/canvas/Scene.tsx`, `components/canvas/Card.tsx`, `components/canvas/index.ts`.
- UI components: `components/ui/*` (Hero, Navigation, LoadingGlobe, GlassCardProfile). Use these for layout & non-3D UI changes.
- State store: `store/index.ts` — single zustand store (`usePortfolioStore`) for scroll, UI and scene flags.
- Hooks & utils: `hooks/useScrollPhysics.ts`, `lib/utils.ts` (e.g., `seededRandom`).
- Build/deploy: `next.config.ts`, `package.json` scripts, `.github/workflows/pages.yml`, `public/CNAME`.
- Linting & types: `.eslintrc` (uses `eslint-config-next`), `tsconfig.json`.

## Important developer workflows & commands
- Local dev: `npm run dev` → http://localhost:3000 (use interactive dev to see 3D scene).
- Production build: `npm run build` (Next.js 16 build produces static pages because of `output: 'export'`).
- Pages deployment: GitHub Actions runs workflow `.github/workflows/pages.yml` and uses `peaceiris/actions-gh-pages@v4` to publish `./out` to `gh-pages`.
- Re-run or inspect workflow runs with GH CLI: `gh run list --workflow "GitHub Pages"` and `gh run view <run-id> --log`.
- DNS checks: `nslookup -type=A gracetyy.dev`, `dig +short A gracetyy.dev`, `curl -I https://gracetyy.dev`.

## Conventions & repo-specific rules
- Commit message style: use one-line conventional commits starting with one of: `chore:`, `docs:`, `feat:`, `fix:`, `refactor:`, `style:`, `test:` followed by a **lowercase** first letter (e.g., `fix: update pages workflow`). Keep them concise. Do NOT push the commits to remote, just commit locally.
- CI / Actions: workflow needs `permissions.contents: write` for the `peaceiris/actions-gh-pages` step to push to `gh-pages` (don’t change permissions without confirming intent).
- Next.js export constraints: watch out for server-only APIs or next/server imports — converting to static export requires purely static/prerendered content.
- 3D behavior is deterministic via seeded randomness (`lib/utils.seededRandom`) — preserve seeds for reproducible layouts in tests.

## Typical tasks & patterns with examples
- Adding a new UI section: update `app/page.tsx` and add a component under `components/ui/`. Keep layout responsive and avoid server-only APIs.
- Tuning card physics: edit `components/canvas/Card.tsx` or `useScrollPhysics.ts`. Use the existing damping/velocity values and store keys (e.g., `scrollVelocity`) rather than introducing new global state unless needed.
- Fixing build/export problems: ensure `next.config.ts` includes `output: 'export'` and avoid features incompatible with static export (Edge/Server functions, dynamic server routes).

## Debugging tips
- If the Pages deploy fails: check workflow logs and confirm `permissions.contents` is `write`, Node version is `>=22` for Next 16, and `./out` exists (build step produced `out/`).
- For rendering/hydration issues: verify `Scene` is dynamically imported with `ssr: false` (see `app/page.tsx`), and that client components are prefixed with `'use client'` where required.
- For visual regressions: run dev server and preview in a browser (Playwright or manual) to confirm 3D behavior and scroll physics.

## What an AI should *not* change without human confirmation
- `next.config.ts` (e.g., toggling `output` or Turbopack root) — discuss before changing major build options.
- Workflow permissions or tokens — ask the repo owner before switching Actions permissions or adding PAT secrets.
- DNS/CNAME records and custom domain settings

## Useful one-liners for the agent
- Start dev server: `npm run dev`
- Build + local prod test: `npm run build && npm run start`
- Run linter: `npm run lint`
- List Pages runs: `gh run list --repo gracetyy/portfolio --workflow "GitHub Pages"`
- Inspect Pages config: `gh api repos/gracetyy/portfolio/pages --jq '.'`

## UI Style
A compact, usable palette tuned for a clean, tactile UI (Teenage Engineering + Dieter Rams) with cassette-futurism accents and high‑fidelity finishes. Use neutrals for surfaces, vivid International Orange accent for interactive dials & readouts, and warm amber for dot‑matrix displays.

### Visual guidance & usage tips
- **Surface hierarchy:** stack surfaces with slightly different neutrals and use soft shadow for elevated panels to sell the tactile feel.
- **Dot‑matrix displays:** use **amber** or **green** with a subtle glow: small text-shadow + low-opacity radial highlight behind the digits to simulate a recessed LED matrix.
- **Materials:** add a faint metallic specular: linear gradient highlight (top 2–3%) + micro bevel (1px hairline) to simulate machined panels.
- **Typography:** monospace for technical labels (e.g., JetBrains Mono, Inconsolata, IBM Plex Mono). Use **bold** monospace at small sizes for dot-matrix/indicator text.
- **Shadows & lighting:** prefer soft ambient occlusion and 1–2 directional, crisp rim highlights to preserve the industrial aesthetic — avoid heavy, blurry shadows that feel organic.
- **Bento layout:** use subtle borders and 8–12px gutters; label each cell with muted monospace captions for the technical labeling vibe.

---

### Accessibility & contrast
- Use neutrals for body text (dark on light or light on dark); **avoid** using color accents (magenta/amber) for body copy.
- Reserve display colors (amber/green) for short numeric readouts or icons; verify contrast for each combination (aim for WCAG AA for text, or use these colors for non‑text indicators).
