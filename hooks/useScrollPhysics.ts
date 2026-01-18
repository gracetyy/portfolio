import { useEffect, useRef, useCallback } from 'react'
import { usePortfolioStore } from '@/store'

interface ScrollPhysicsOptions {
  dampingFactor?: number
  velocityThreshold?: number
}

export function useScrollPhysics(options: ScrollPhysicsOptions = {}) {
  const {
    dampingFactor = 0.95,
    velocityThreshold = 0.001
  } = options

  const lastScrollY = useRef(0)
  const lastTime = useRef(performance.now())
  const velocityRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const setScrollVelocity = usePortfolioStore((state) => state.setScrollVelocity)
  const setNormalizedScroll = usePortfolioStore((state) => state.setNormalizedScroll)
  const setDepth = usePortfolioStore((state) => state.setDepth)

  const updateVelocity = useCallback(() => {
    velocityRef.current *= dampingFactor

    if (Math.abs(velocityRef.current) > velocityThreshold) {
      setScrollVelocity(velocityRef.current)
      rafRef.current = requestAnimationFrame(updateVelocity)
    } else {
      velocityRef.current = 0
      setScrollVelocity(0)
    }
  }, [dampingFactor, velocityThreshold, setScrollVelocity])

  const handleScroll = useCallback(() => {
    const currentTime = performance.now()
    const currentScrollY = window.scrollY
    const deltaTime = currentTime - lastTime.current
    const deltaScroll = currentScrollY - lastScrollY.current

    if (deltaTime > 0) {
      velocityRef.current = deltaScroll / deltaTime
    }

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const normalized = maxScroll > 0 ? currentScrollY / maxScroll : 0

    setNormalizedScroll(normalized)
    setDepth(currentScrollY)
    setScrollVelocity(velocityRef.current)

    lastScrollY.current = currentScrollY
    lastTime.current = currentTime

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(updateVelocity)
  }, [setNormalizedScroll, setDepth, setScrollVelocity, updateVelocity])

  useEffect(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll])
}
