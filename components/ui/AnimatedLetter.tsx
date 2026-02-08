"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionTemplate } from "framer-motion";
import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
    scale: 0.9,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 12,
      stiffness: 100,
      delay: i * 0.03, // Tighter stagger for clean reveal
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// Sweep overlay variants
const sweepVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: (i: number) => ({
    x: "100%",
    opacity: [0, 1, 0],
    transition: {
      delay: i * 0.03,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function AnimatedLetter({
  letter,
  index,
  mouseX,
  mouseY,
  highlightColor = "rgba(255,255,255,0.5)",
  isGrace = false,
  cardsVisible = false,
  onHoverChange,
  isHovered: parentHovered,
  useShader = true,
  dynamicWeight = true,
  className,
  style,
}: {
  letter: string;
  index: number;
  mouseX: any;
  mouseY: any;
  highlightColor?: string;
  isGrace?: boolean;
  cardsVisible?: boolean;
  onHoverChange?: (hovering: boolean) => void;
  isHovered?: boolean;
  useShader?: boolean;
  dynamicWeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const letterRef = useRef<HTMLSpanElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (letterRef.current) {
      const rect = letterRef.current.getBoundingClientRect();
      setCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  }, []);

  const distance = useTransform([mouseX, mouseY], ([x, y]) => {
    if (!center.x) return 1000;
    return Math.hypot((x as number) - center.x, (y as number) - center.y);
  });

  const weight = useTransform(
    distance,
    [0, 150],
    dynamicWeight ? [900, 600] : [800, 800],
  );

  const wdth = useTransform(
    distance,
    [0, 150],
    dynamicWeight ? [200, 100] : [100, 100],
  );

  const fontVariationSettings = useMotionTemplate`"wght" ${weight}, "wdth" ${wdth}`;

  // Use a transform to create an animated mask data-uri that doesn't "eat" the letters
  const maskImage = useTransform([weight, wdth], ([w, s]) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='85%' text-anchor='middle' font-family='MuseoModerno' font-size='100%' fill='white' style='font-variation-settings: "wght" ${w}, "wdth" ${s}; font-feature-settings: "ss01" ${letter.toUpperCase() === "N" ? 0 : 1}'>${letter}</text></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });

  // Shader gradient colors - vibrant on hover, subtle default
  // Adjust colors based on theme
  const isDark = theme === "dark";

  const shaderColors = parentHovered
    ? ["#FF0080", "#7928CA", "#00DFD8", "#FF4D4D"] // Vibrant hover colors remain same
    : isDark
      ? ["#E8B4D8", "#B794F4", "#93C5FD", "#FFFFFF"] // Original pastel/light colors work well on dark
      : ["#FF9A9E", "#FECFEF", "#A18CD1", "#FBC2EB"]; // Slightly deeper/warmer colors for light background visibility

  return (
    <motion.div
      className="relative inline-block overflow-visible py-4 -my-4 align-top cursor-pointer pointer-events-auto"
      onHoverStart={() => {
        setIsHovered(true);
        onHoverChange?.(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHoverChange?.(false);
      }}
    >
      {/* Shader gradient layer - masked by the text shape */}
      {useShader && letter !== " " && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            WebkitMaskImage: maskImage,
            WebkitMaskSize: "100% 100%",
            WebkitMaskRepeat: "no-repeat",
            maskImage: maskImage,
            maskSize: "100% 100%",
            maskRepeat: "no-repeat",
          }}
        >
          <PaperMeshGradient
            width="100%"
            height="100%"
            colors={shaderColors}
            distortion={parentHovered ? 1.5 : 1}
            swirl={parentHovered ? 0.8 : 0.6}
            grainMixer={0.02}
            speed={parentHovered ? 0.5 : 0.3}
          />
        </motion.div>
      )}
      {/* Text layer - transparent to show shader through */}
      <motion.span
        ref={letterRef}
        variants={letterVariants}
        custom={index}
        className={`inline-block relative z-0 ${
          letter.toUpperCase() === "N" ? "museo-n-normal" : "museo-ss01"
        } ${className || ""}`}
        style={{
          ...style,
          display: letter === " " ? "inline" : "inline-block",
          color: useShader ? "transparent" : "currentColor",
          WebkitTextStroke: useShader ? "0px transparent" : undefined,
          ["fontFeatureSettings" as any]:
            letter.toUpperCase() === "N" ? "'ss01' 0" : "'ss01' 1",
          ["WebkitFontFeatureSettings" as any]:
            letter.toUpperCase() === "N" ? "'ss01' 0" : "'ss01' 1",
          fontVariationSettings,
        }}
      >
        {letter === " " ? " " : letter}
      </motion.span>

      {/* Sweep Effect (Optional overlay) */}
      {useShader && letter !== " " && (
        <motion.div
          variants={sweepVariants}
          custom={index}
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            transform: "skewX(-20deg)",
          }}
        />
      )}
    </motion.div>
  );
}
