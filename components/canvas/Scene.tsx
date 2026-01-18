"use client";

import { Suspense, useMemo, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { PolaroidCard } from "./Card";
import { usePortfolioStore } from "@/store";
import { LoadingGlobe } from "@/components/ui";
import { seededRandom } from "@/lib/utils";

interface CardData {
  position: [number, number, number];
  tilt: [number, number, number];
  index: number;
}

function generateCardPositions(count: number): CardData[] {
  const cards: CardData[] = [];

  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;

    const innerRadius = 6;
    const outerRadius = 8;
    const radius =
      innerRadius + seededRandom(seed) * (outerRadius - innerRadius);

    const angle = (i / count) * Math.PI * 2 + seededRandom(seed + 1) * 0.5;

    const x = Math.cos(angle) * radius + (seededRandom(seed + 2) - 0.5) * 0.8;
    const y =
      Math.sin(angle) * radius * 0.55 + (seededRandom(seed + 3) - 0.5) * 0.6;
    const z = -1 - seededRandom(seed + 4) * 25;

    const tiltX = (seededRandom(seed + 5) - 0.5) * 0.17;
    const tiltY = (seededRandom(seed + 6) - 0.5) * 0.1;
    const tiltZ = (seededRandom(seed + 7) - 0.5) * 0.17;

    cards.push({
      position: [x, y, z],
      tilt: [tiltX, tiltY, tiltZ],
      index: i,
    });
  }

  return cards;
}

function SceneContent() {
  const setSceneReady = usePortfolioStore((state) => state.setSceneReady);

  // Generate card positions once (fewer cards for cleaner look)
  const cards = useMemo(() => generateCardPositions(12), []);

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
      <color attach="background" args={["#050511"]} />
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
