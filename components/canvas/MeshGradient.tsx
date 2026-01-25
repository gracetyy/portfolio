"use client";

import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import { usePortfolioStore } from "@/store";

export function MeshGradient() {
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);

  return (
    // eslint-disable-next-line
    <div
      className="fixed inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-300 ease-out"
      style={{ opacity: heroTextOpacity, backgroundColor: "#F5F5F5" }}
    >
      <PaperMeshGradient
        width="100%"
        height="100%"
        colors={[
          "#FFE4E1", // MistyRose (Very Light Pink)
          "#E3F2FD", // Very Light Blue
          "#F3E5F5", // Very Light Purple
          "#FAFAFA", // Off White
        ]}
        distortion={1}
        swirl={0.6}
        grainMixer={0.05}
        speed={0.2}
      />
    </div>
  );
}
