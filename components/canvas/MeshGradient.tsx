"use client";

import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import { usePortfolioStore } from "@/store";
import { useTheme } from "next-themes";

export function MeshGradient() {
  const { theme } = useTheme();
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const isDark = theme === "dark";

  return (
    // eslint-disable-next-line
    <div
      className="fixed inset-0 h-full w-full pointer-events-none transition-opacity duration-300 ease-out"
      style={{
        opacity: heroTextOpacity,
        backgroundColor: isDark ? "#000000" : "#F5F5F5",
        zIndex: 0,
      }}
    >
      <PaperMeshGradient
        width="100%"
        height="100%"
        colors={
          isDark
            ? [
                "#0f0f13", // Pure Black
                "#010221", // Dark Blue
                "#121212", // Mac Dark Gray
                "#180436", // Dark Purple
              ]
            : [
                "#FFE4E1", // MistyRose (Very Light Pink)
                "#E3F2FD", // Very Light Blue
                "#F3E5F5", // Very Light Purple
                "#FAFAFA", // Off White
              ]
        }
        distortion={1}
        swirl={0.6}
        grainMixer={0.05}
        speed={0.2}
      />
    </div>
  );
}
