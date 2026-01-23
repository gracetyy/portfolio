"use client";

import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import { usePortfolioStore } from "@/store";

export function MeshGradient() {
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);

  return (
    // eslint-disable-next-line
    <div
      className="absolute inset-0 -z-10 h-full w-full transition-opacity duration-300 ease-out"
      style={{ opacity: heroTextOpacity, backgroundColor: "#050511" }}
    >
      <PaperMeshGradient
        width="100%"
        height="100%"
        colors={[
          "#050511", // Deep background
          "#1a1a1a", // Lowered soft dark grey
          "#333333", // Lowered highlight
          "#0d0d0d", // Lowered shadow
        ]}
        distortion={1}
        swirl={0.6}
        grainMixer={0.05}
        speed={0.2}
      />
    </div>
  );
}
