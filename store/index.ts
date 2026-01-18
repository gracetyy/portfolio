import { create } from 'zustand'

interface PortfolioState {
  // Scroll state
  depth: number
  scrollVelocity: number
  normalizedScroll: number

  // UI state
  isNavExpanded: boolean

  // 3D scene state
  isSceneReady: boolean
  cardsVisible: boolean
  heroTextOpacity: number

  // Actions
  setDepth: (depth: number) => void
  setScrollVelocity: (velocity: number) => void
  setNormalizedScroll: (value: number) => void
  toggleNav: () => void
  setSceneReady: (ready: boolean) => void
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Initial scroll state
  depth: 0,
  scrollVelocity: 0,
  normalizedScroll: 0,

  // Initial UI state
  isNavExpanded: false,

  // Initial 3D state
  isSceneReady: false,
  cardsVisible: true,
  heroTextOpacity: 1,

  // Actions
  setDepth: (depth) => set({ depth }),

  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),

  setNormalizedScroll: (value) => {
    const clampedValue = Math.max(0, Math.min(1, value))

    const scrollY = window.scrollY
    const viewportHeight = window.innerHeight

    // Hero section fade timing
    const heroFadeStart = viewportHeight * 4
    const heroFadeEnd = viewportHeight * 7

    const heroTextOpacity = scrollY < heroFadeStart
      ? 1
      : scrollY > heroFadeEnd
        ? 0
        : 1 - ((scrollY - heroFadeStart) / (heroFadeEnd - heroFadeStart))

    const cardsVisible = clampedValue < 0.95

    // Auto-expand/collapse nav based on scroll position
    const shouldExpandNav = clampedValue > 0.7
    const shouldCollapseNav = clampedValue < 0.1

    set({
      normalizedScroll: clampedValue,
      heroTextOpacity,
      cardsVisible,
      isNavExpanded: shouldCollapseNav ? false : (shouldExpandNav ? true : get().isNavExpanded)
    })
  },

  toggleNav: () => set((state) => ({ isNavExpanded: !state.isNavExpanded })),

  setSceneReady: (ready) => set({ isSceneReady: ready }),
}))
