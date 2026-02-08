"use client";

import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import { usePortfolioStore } from "@/store";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MeshGradient() {
  const { theme } = useTheme();
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
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
                "#43364A", // Muted Purple
                "#2F3043", // Dark Blue-Purple
                "#1B1724", // Darkest Purple
                "#2F3043", // Repeated Blue-Purple for flow
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
