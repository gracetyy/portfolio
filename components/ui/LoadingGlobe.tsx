'use client'

import { useEffect, useState, useRef } from 'react'

interface LoadingGlobeProps {
  isLoaded: boolean
}

export function LoadingGlobe({ isLoaded }: LoadingGlobeProps) {
  const [phase, setPhase] = useState<'loading' | 'exiting' | 'hidden'>('loading')
  const [rotation, setRotation] = useState(0)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const animationRef = useRef<number | null>(null)

  // Minimum display time of 1.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Animate rotation continuously
  useEffect(() => {
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime
      lastTime = currentTime

      // Rotate approximately 65 degrees per second
      setRotation((prev) => (prev + delta * 0.065) % 360)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && minTimeElapsed && phase === 'loading') {
      setPhase('exiting')
      // Longer exit animation
      const timer = setTimeout(() => setPhase('hidden'), 1800)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, minTimeElapsed, phase])

  if (phase === 'hidden') return null

  // Calculate longitude line transforms based on rotation
  const getLongitudeScaleX = (baseAngle: number) => {
    const angle = (rotation + baseAngle) % 180
    const radians = (angle * Math.PI) / 180
    return Math.abs(Math.cos(radians))
  }

  // Generate longitude lines (12 lines, evenly distributed)
  const longitudeAngles = Array.from({ length: 12 }, (_, i) => (i * 180) / 12)

  // Generate latitude lines
  const latitudeLines = [
    { y: -70, radius: 71.4 },
    { y: -45, radius: 89.4 },
    { y: -20, radius: 98 },
    { y: 20, radius: 98 },
    { y: 45, radius: 89.4 },
    { y: 70, radius: 71.4 },
  ]

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-navy"
      style={{
        opacity: phase === 'exiting' ? 0 : 1,
        transition: phase === 'exiting' ? 'opacity 1s ease-out 0.8s' : 'none',
        pointerEvents: phase === 'exiting' ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          transform: phase === 'exiting' ? 'scale(25)' : 'scale(1)',
          transition: phase === 'exiting'
            ? 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
      >
        <svg
          viewBox="-120 -120 240 240"
          className="w-48 h-48 md:w-64 md:h-64"
        >
          {/* Glow effect */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)">
            {/* Outer circle (equator from side view) */}
            <circle
              cx="0"
              cy="0"
              r="100"
              fill="none"
              stroke="#0000FF"
              strokeWidth="1.5"
            />

            {/* Latitude lines (horizontal ellipses) */}
            {latitudeLines.map((line, i) => (
              <ellipse
                key={`lat-${i}`}
                cx="0"
                cy={line.y}
                rx={line.radius}
                ry={line.radius * 0.25}
                fill="none"
                stroke="#0000FF"
                strokeWidth="1"
                opacity="0.7"
              />
            ))}

            {/* Equator */}
            <ellipse
              cx="0"
              cy="0"
              rx="100"
              ry="25"
              fill="none"
              stroke="#0000FF"
              strokeWidth="1.2"
              opacity="0.9"
            />

            {/* Longitude lines (vertical ellipses that simulate rotation) */}
            {longitudeAngles.map((baseAngle, i) => {
              const scaleX = getLongitudeScaleX(baseAngle)
              // Only render if visible (not edge-on)
              if (scaleX < 0.05) return null

              return (
                <ellipse
                  key={`long-${i}`}
                  cx="0"
                  cy="0"
                  rx={100 * scaleX}
                  ry="100"
                  fill="none"
                  stroke="#0000FF"
                  strokeWidth="1"
                  opacity={0.3 + scaleX * 0.5}
                />
              )
            })}

            {/* Central meridian (always visible) */}
            <ellipse
              cx="0"
              cy="0"
              rx={100 * getLongitudeScaleX(0)}
              ry="100"
              fill="none"
              stroke="#0000FF"
              strokeWidth="1.2"
              opacity="0.9"
            />

            {/* Poles markers */}
            <circle cx="0" cy="-100" r="3" fill="#0000FF" opacity="0.8" />
            <circle cx="0" cy="100" r="3" fill="#0000FF" opacity="0.8" />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default LoadingGlobe
