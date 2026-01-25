"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { usePortfolioStore } from "@/store";

// Renders the 3D scene
export function Scene() {
  const setSceneReady = usePortfolioStore((state) => state.setSceneReady);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setSceneReady(true), 400);
    return () => clearTimeout(timer);
  }, [setSceneReady]);

  if (!mounted) return null;

  return (
    <Canvas
      className="pointer-events-none fixed inset-0 z-0"
      camera={{ fov: 14, position: [0, 0, 5] }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Environment files="/env/empty_warehouse_01_1k.hdr" />
      </Suspense>
    </Canvas>
  );
}

export default Scene;
