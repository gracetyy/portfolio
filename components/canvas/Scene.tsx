"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { PolaroidCard } from "./Card";
import { MeshGradient } from "./MeshGradient";
import { usePortfolioStore } from "@/store";
import { LoadingGlobe } from "@/components/ui";
import { seededRandom } from "@/lib/utils";

interface CardData {
  position: [number, number, number];
  tilt: [number, number, number];
  index: number;
  moveOffset: [number, number];
}

function generateCardPositions(): CardData[] {
  const specs = [
    { offset: [-100, 200], start: [-3, 2] }, // Polaroid 1: Top-Left
    { offset: [100, -200], start: [3, -2] }, // Polaroid 2: Bottom-Right
    { offset: [-100, -200], start: [-3, -2] }, // Polaroid 3: Bottom-Left
    { offset: [100, 200], start: [3, 2] }, // Polaroid 4: Top-Right
    { offset: [-100, 200], start: [-4, 0] }, // Polaroid 5: Mid-Left
    { offset: [100, -200], start: [4, 0] }, // Polaroid 6: Mid-Right
  ];

  return specs.map((spec, i) => {
    const seed = i * 137.5;

    // Space them out evenly in depth
    const z = -2 - i * 5;

    // Scale x/y based on distance from camera (z=8) to maintain visual tunnel separation
    // Otherwise distant cards would appear to cluster in the center
    const dist = 8 - z;
    const scale = dist / 10; // Normalized to ~1 at z=-2

    // Push card start positions outward, with extra push for the top-right card (index 3)
    const baseOutward = 1.25;
    const extra = i === 3 ? 0.35 : 0; // stronger push for top-right
    const outwardFactor = baseOutward + extra;

    const x =
      spec.start[0] * outwardFactor * scale + (seededRandom(seed) - 0.5) * 1.5;
    const y =
      spec.start[1] * outwardFactor * scale +
      (seededRandom(seed + 1) - 0.5) * 1.5;

    const tiltX = (seededRandom(seed + 5) - 0.5) * 0.17;
    const tiltY = (seededRandom(seed + 6) - 0.5) * 0.1;
    const tiltZ = (seededRandom(seed + 7) - 0.5) * 0.17;

    return {
      position: [x, y, z] as [number, number, number],
      tilt: [tiltX, tiltY, tiltZ] as [number, number, number],
      index: i,
      moveOffset: spec.offset as [number, number],
    };
  });
}

function SceneContent() {
  const setSceneReady = usePortfolioStore((state) => state.setSceneReady);

  // Generate card positions once
  const cards = useMemo(() => generateCardPositions(), []);

  useEffect(() => {
    // Signal that scene is ready after a brief delay
    const timer = setTimeout(() => setSceneReady(true), 500);
    return () => clearTimeout(timer);
  }, [setSceneReady]);

  return (
    <>
      {/* Simplified lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {/* Cards */}
      {cards.map((card) => (
        <PolaroidCard
          key={card.index}
          position={card.position}
          initialTilt={card.tilt}
          index={card.index}
          moveOffset={card.moveOffset}
        />
      ))}

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Fog for depth perception - subtle fade for distant cards */}
      <fog attach="fog" args={["#050511", 15, 35]} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#0000FF" wireframe />
    </mesh>
  );
}

function CanvasWrapper() {
  return (
    <Canvas
      dpr={[1.5, 2]}
      camera={{
        position: [0, 0, 8],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: "high-performance",
      }}
    >
      <MeshGradient />
      <Suspense fallback={<LoadingFallback />}>
        <SceneContent />
      </Suspense>
      <AdaptiveDpr />
    </Canvas>
  );
}

export function Scene() {
  const cardsVisible = usePortfolioStore((state) => state.cardsVisible);
  const normalizedScroll = usePortfolioStore((state) => state.normalizedScroll);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate scene opacity based on scroll progress
  const sceneOpacity =
    normalizedScroll > 0.7
      ? Math.max(0, 1 - (normalizedScroll - 0.7) / 0.25)
      : 1;

  return (
    <>
      {/* Loading Globe - shows until scene is ready */}
      <LoadingGlobe isLoaded={mounted && isSceneReady} />

      {/* 3D Scene */}
      {mounted && (
        <div
          className="canvas-container"
          style={{
            opacity: cardsVisible ? sceneOpacity : 0,
            transition: "opacity 0.5s ease-out",
          }}
        >
          <CanvasWrapper />
          {/* Bottom gradient for smooth transition */}
          <div
            className="fixed bottom-0 left-0 right-0 h-[30vh] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, #050511 100%)",
              opacity: Math.min(1, normalizedScroll * 2),
            }}
          />
        </div>
      )}
    </>
  );
}

export default Scene;
