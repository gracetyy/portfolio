"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { usePortfolioStore } from "@/store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

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

const statusTextVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.8 + i * 0.15,
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as [number, number, number, number],
    },
  }),
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.3 },
  },
};

const NOISE_PATTERN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

const WAVES_PATTERN = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 12 Q 6 6 12 12 T 24 12' stroke='rgba(255,255,255,0.5)' fill='none' stroke-width='2'/%3E%3C/svg%3E")`;
const DOT_PATTERN = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='2' fill='rgba(255,255,255,0.5)'/%3E%3C/svg%3E")`;
const STRIPE_PATTERN = `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2 M6,8 l4,-4 M9,11 l2,-2' stroke='rgba(255,255,255,0.4)' stroke-width='1.5'/%3E%3C/svg%3E")`;
const CROSS_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L20 20 M20 0 L0 20' stroke='rgba(255,255,255,0.4)' stroke-width='1'/%3E%3C/svg%3E")`;
const HEX_PATTERN = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0 L24 6 L24 18 L12 24 L0 18 L0 6 Z' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='1'/%3E%3C/svg%3E")`;

function AnimatedLetter({
  letter,
  index,
  highlightColor = "rgba(255,255,255,0.5)",
  textStyle = {},
  hoverStyle = {},
  mouseX,
  mouseY,
}: {
  letter: string;
  index: number;
  highlightColor?: string;
  textStyle?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  mouseX: any;
  mouseY: any;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const letterRef = useRef<HTMLSpanElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Measure center for proximity effect
    if (letterRef.current) {
      const rect = letterRef.current.getBoundingClientRect();
      setCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    // Optional: Re-measure on resize
    const handleResize = () => {
      if (letterRef.current) {
        const rect = letterRef.current.getBoundingClientRect();
        setCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const distance = useTransform([mouseX, mouseY], ([x, y]) => {
    if (!center.x) return 1000;
    return Math.hypot((x as number) - center.x, (y as number) - center.y);
  });

  // Proximity Effects: Variable Font Weight
  // Map distance to weight: Close (0px) -> 900, Far (200px) -> 600
  // Note: We use a string for fontVariationSettings because fontWeight numerical animation can be jerky in some browsers
  // But Framer Motion handles numbers well. Let's try direct fontWeight first if using standard variable font features.
  // Actually, 'fontVariationSettings' is more reliable for smooth interpolation.

  const weight = useTransform(distance, [0, 200], [900, 600]);

  // We need to pass this as a style.
  // Since 'fontWeight' expects numbers or strings, motion value works.

  return (
    <motion.div
      className="relative inline-block overflow-hidden py-4 -my-4 align-top cursor-pointer pointer-events-auto"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        ref={letterRef}
        variants={letterVariants}
        custom={index}
        className="inline-block relative z-10"
        style={{
          display: letter === " " ? "inline" : "inline-block",
          fontWeight: weight,
          // Removed scale/y as requested
          ...textStyle,
          ...(isHovered ? hoverStyle : {}),
          transition: "background-image 0.3s ease, color 0.3s ease",
        }}
      >
        {letter === " " ? "\u00A0" : letter}
      </motion.span>

      {/* Sweep Effect */}
      {letter !== " " && (
        <motion.div
          variants={sweepVariants}
          custom={index}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${highlightColor} 50%, transparent 100%)`,
            transform: "skewX(-20deg)",
          }}
        />
      )}
    </motion.div>
  );
}

function HeroText({ fallbackMode }: { fallbackMode: boolean }) {
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);

  const graceName = "GRACE";
  const yuenName = "YUEN";

  const shouldShow = isSceneReady || fallbackMode;

  // Mouse tracking for proximity effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Generate distinct gradients/patterns for each hover state
  const getHoverPattern = (index: number) => {
    const i = index % 9;

    // 0: Simplex Noise (Approximated with fluid noise gradient)
    if (i === 0) {
      return `${NOISE_PATTERN}, radial-gradient(circle at 60% 40%, #ff9a9e 0%, #fecfef 20%, #a18cd1 60%, #fbc2eb 100%)`;
    }
    // 1: Waves (Clean vector waves over gradient)
    if (i === 1) {
      return `${WAVES_PATTERN}, linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)`;
    }
    // 2: Dot Grid (Clean dots over gradient)
    if (i === 2) {
      return `${DOT_PATTERN}, linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)`;
    }
    // 3: Diagonal Stripes (Black/White or Silver)
    if (i === 3) {
      return `${STRIPE_PATTERN}, linear-gradient(to bottom, #2b5876 0%, #4e4376 100%)`; // Dark Purple/Blue
    }
    // 4: Crosshatch
    if (i === 4) {
      return `${CROSS_PATTERN}, linear-gradient(to right, #4facfe 0%, #00f2fe 100%)`; // Bright Blue
    }
    // 5: Hexagons
    if (i === 5) {
      return `${HEX_PATTERN}, linear-gradient(180deg, #43e97b 0%, #38f9d7 100%)`; // Turquoise/Green
    }

    const patterns = [
      "",
      "",
      "",
      "",
      "",
      "", // Placeholders 0-5
      // 6: Liquid Metal (Silver/Grey/White)
      "linear-gradient(45deg, #E0E0E0 0%, #707070 50%, #F5F5F5 100%)",
      // 7: Holographic Prism
      "linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)",
      // 8: Mystic Lavender (Lavender/Purple)
      "radial-gradient(circle at top right, #E6E6FA 0%, #9370DB 50%, #483D8B 100%)",
    ];
    // For the rest, keep the grain
    return `${NOISE_PATTERN}, ${patterns[i]}`;
  };

  // Defined styles for reuse
  const graceStyle = {
    fontFamily: "var(--font-inter)",
    backgroundImage: `${NOISE_PATTERN}, linear-gradient(to bottom, #ffffff, #bbbbbb)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    filter: "contrast(120%)",
  };

  const yuenStyle = {
    fontFamily: "var(--font-inter)",
    backgroundImage: `${NOISE_PATTERN}, linear-gradient(to bottom, #0000FF, #3333FF)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    filter: "contrast(120%)",
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
      style={{
        opacity: heroTextOpacity,
        mixBlendMode: "normal",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: heroTextOpacity }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center select-none pointer-events-auto">
        <AnimatePresence mode="wait">
          {shouldShow && (
            <motion.div
              key="hero-text"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="text-[15vw] md:text-[13vw] lg:text-[11vw] font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-inter)",
                }}
              >
                {graceName.split("").map((letter, i) => (
                  <AnimatedLetter
                    key={`grace-${i}`}
                    letter={letter}
                    index={i}
                    highlightColor="rgba(255, 255, 255, 0.4)"
                    textStyle={graceStyle}
                    hoverStyle={{
                      backgroundImage: getHoverPattern(i),
                    }}
                    mouseX={mouseX}
                    mouseY={mouseY}
                  />
                ))}
              </motion.div>

              <motion.div
                className="text-[15vw] md:text-[13vw] lg:text-[11vw] font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-inter)",
                }}
              >
                {yuenName.split("").map((letter, i) => (
                  <AnimatedLetter
                    key={`yuen-${i}`}
                    letter={letter}
                    index={graceName.length + i}
                    highlightColor="rgba(0, 255, 255, 0.4)"
                    textStyle={yuenStyle}
                    hoverStyle={{
                      backgroundImage: getHoverPattern(graceName.length + i),
                    }}
                    mouseX={mouseX}
                    mouseY={mouseY}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatusText({ fallbackMode }: { fallbackMode: boolean }) {
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const statusLines = [
    "Year 3 Computer Science @ HKU",
    "Developer / Builder / Problem Solver",
  ];

  const shouldShow = isSceneReady || fallbackMode;

  return (
    <AnimatePresence>
      {heroTextOpacity > 0.1 && shouldShow && (
        <motion.div
          className="fixed bottom-8 left-8 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: heroTextOpacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {statusLines.map((line, lineIndex) => (
            <motion.div
              key={lineIndex}
              custom={lineIndex}
              variants={statusTextVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="status-text text-white/60 mb-1"
            >
              {line.split(" ").map((word, wordIndex) => {
                const isInteractive = [
                  "Builder",
                  "Developer",
                  "Problem",
                ].includes(word);
                return (
                  <span
                    key={wordIndex}
                    className={`inline-block mr-1 ${
                      isInteractive
                        ? "cursor-pointer transition-all duration-300"
                        : ""
                    }`}
                    style={{
                      textShadow:
                        isInteractive && hoveredWord === word
                          ? "0 0 20px rgba(0, 0, 255, 0.8), 0 0 40px rgba(0, 0, 255, 0.4)"
                          : "none",
                      color:
                        isInteractive && hoveredWord === word
                          ? "#ffffff"
                          : undefined,
                    }}
                    onMouseEnter={() => isInteractive && setHoveredWord(word)}
                    onMouseLeave={() => setHoveredWord(null)}
                  >
                    {word}
                  </span>
                );
              })}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DepthMeter() {
  const normalizedScroll = usePortfolioStore((state) => state.normalizedScroll);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);

  const smoothScroll = useSpring(0, {
    stiffness: 50,
    damping: 15,
  });

  useEffect(() => {
    smoothScroll.set(normalizedScroll);
  }, [normalizedScroll, smoothScroll]);

  const height = useTransform(smoothScroll, [0, 1], ["5%", "95%"]);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 150);

    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [normalizedScroll]);

  return (
    <AnimatePresence>
      {isSceneReady && (
        <motion.div
          className="fixed right-8 top-1/2 -translate-y-1/2 z-20 h-[40vh]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.8, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="relative w-[2px] h-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 via-white/40 to-transparent depth-meter-glow rounded-full"
              style={{ height }}
              animate={{
                scaleY: isScrolling ? 1.02 : 1,
              }}
              transition={{
                scaleY: {
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
            />

            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
              style={{
                top: height,
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
              }}
              animate={{
                scale: isScrolling ? 1.3 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HeroOverlay() {
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);
  const [fallbackMode, setFallbackMode] = useState(false);

  // Fallback: show text content after 5 seconds if scene hasn't loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSceneReady) {
        setFallbackMode(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isSceneReady]);

  return (
    <>
      <HeroText fallbackMode={fallbackMode} />
      <StatusText fallbackMode={fallbackMode} />
      <DepthMeter />
    </>
  );
}

export default HeroOverlay;
