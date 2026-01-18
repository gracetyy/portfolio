'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { usePortfolioStore } from '@/store'
import { seededRandom } from '@/lib/utils'

interface PolaroidCardProps {
  position: [number, number, number]
  initialTilt: [number, number, number]
  index: number
}

export function PolaroidCard({
  position,
  initialTilt,
  index,
}: PolaroidCardProps) {
  const groupRef = useRef<THREE.Group>(null)
  const cardRef = useRef<THREE.Mesh>(null)
  const sheenRef = useRef<THREE.Mesh>(null)

  const scrollVelocity = usePortfolioStore((state) => state.scrollVelocity)
  const normalizedScroll = usePortfolioStore((state) => state.normalizedScroll)
  const cardsVisible = usePortfolioStore((state) => state.cardsVisible)

  const initialPosition = useMemo(() => {
    return new THREE.Vector3(...position)
  }, [position])

  const initialRotation = useMemo(() => {
    return new THREE.Euler(...initialTilt)
  }, [initialTilt])

  const floatParams = useMemo(() => {
    const seed = index * 137.5
    return {
      freqY: 0.5 + seededRandom(seed) * 1.5,
      freqX: 0.3 + seededRandom(seed + 1) * 1.0,
      freqRot: 0.4 + seededRandom(seed + 2) * 1.0,
      ampY: 0.04 + seededRandom(seed + 3) * 0.08,
      ampX: 0.02 + seededRandom(seed + 4) * 0.05,
      ampRot: 0.015 + seededRandom(seed + 5) * 0.04,
      phase: seededRandom(seed + 6) * Math.PI * 2,
      speedMult: 0.4 + seededRandom(seed + 7) * 1.2,
      dampingFactor: 0.15 + seededRandom(seed + 8) * 0.2,
      scrollDelay: seededRandom(seed + 9) * 0.15,
    }
  }, [index])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const group = groupRef.current
    const time = state.clock.elapsedTime

    const delayedScroll = Math.max(0, normalizedScroll - floatParams.scrollDelay)
    const adjustedScroll = delayedScroll / (1 - floatParams.scrollDelay)

    const baseSpeed = 60
    const scrollZ = adjustedScroll * baseSpeed * floatParams.speedMult

    const cardProgress = adjustedScroll * floatParams.speedMult
    const driftFactor = Math.max(0, cardProgress - 0.15) * 2.5
    const proximityDrift = Math.max(0, cardProgress - 0.5) * 1.5
    const outwardX = initialPosition.x * (1 + driftFactor * Math.sign(initialPosition.x) * 0.6 + proximityDrift * 0.4)
    const outwardY = initialPosition.y * (1 + driftFactor * Math.sign(initialPosition.y) * 0.5 + proximityDrift * 0.3)

    const floatY = Math.sin(time * floatParams.freqY + floatParams.phase) * floatParams.ampY
    const floatX = Math.sin(time * floatParams.freqX + floatParams.phase + Math.PI / 3) * floatParams.ampX

    const targetX = outwardX + floatX
    const targetY = outwardY + floatY
    const targetZ = initialPosition.z + scrollZ

    const windIntensity = Math.min(Math.abs(scrollVelocity) * 10, 0.3)
    const windDirection = scrollVelocity > 0 ? 1 : -1

    easing.damp3(
      group.position,
      [targetX, targetY, targetZ],
      floatParams.dampingFactor,
      delta
    )

    const floatRotation = Math.sin(time * floatParams.freqRot + floatParams.phase) * floatParams.ampRot
    const targetRotX = initialRotation.x + windIntensity * windDirection * 0.2 + floatRotation
    const targetRotY = initialRotation.y + Math.cos(time * floatParams.freqRot * 0.7 + floatParams.phase) * floatParams.ampRot * 0.5
    const targetRotZ = initialRotation.z + windIntensity * windDirection * 0.08

    easing.dampE(
      group.rotation,
      [targetRotX, targetRotY, targetRotZ],
      floatParams.dampingFactor + 0.05,
      delta
    )

    if (sheenRef.current) {
      const sheenX = Math.sin(time * 0.8 + index) * 0.5
      sheenRef.current.position.x = sheenX
    }

    const fadeStart = 0.4
    const fadeEnd = 0.8
    const fadeProgress = Math.max(0, Math.min(1, (cardProgress - fadeStart) / (fadeEnd - fadeStart)))
    const opacity = cardsVisible ? 1 - fadeProgress : 0

    group.visible = opacity > 0.01
    if (cardRef.current && cardRef.current.material) {
      (cardRef.current.material as THREE.MeshStandardMaterial).opacity = opacity
    }
  })

  const cardWidth = 2.0
  const cardHeight = 2.5
  const borderWidth = 0.18
  const topBorder = 0.18
  const bottomBorder = 0.55
  const cardDepth = 0.025

  const imageWidth = cardWidth - borderWidth * 2
  const imageHeight = cardHeight - topBorder - bottomBorder
  const imageYOffset = (bottomBorder - topBorder) / 2

  return (
    <group ref={groupRef} position={position} rotation={initialTilt}>
      <mesh ref={cardRef} castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial
          color="#F8F6F1"
          roughness={0.55}
          metalness={0.0}
          transparent
          stencilWrite
          stencilRef={1}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>

      <mesh position={[0, cardHeight / 2 - 0.01, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[cardWidth - 0.02, 0.02]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, imageYOffset, cardDepth / 2 + 0.001]}>
        <planeGeometry args={[imageWidth, imageHeight]} />
        <meshStandardMaterial
          color="#151515"
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      <mesh position={[0, imageYOffset + imageHeight / 2 - 0.03, cardDepth / 2 + 0.002]}>
        <planeGeometry args={[imageWidth, 0.06]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={sheenRef} position={[0, 0, cardDepth / 2 + 0.003]}>
        <planeGeometry args={[0.3, cardHeight * 0.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -cardDepth / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshStandardMaterial
          color="#E8E6E1"
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>
    </group>
  )
}

export default PolaroidCard
