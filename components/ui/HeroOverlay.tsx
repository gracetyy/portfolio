"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
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
    y: 80,
    rotateX: -90,
    scale: 0.5,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 10,
      mass: 0.8,
      delay: i * 0.02,
    },
  }),
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
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

function AnimatedLetter({ letter }: { letter: string }) {
  return (
    <motion.span
      variants={letterVariants}
      className="inline-block"
      style={{ display: letter === " " ? "inline" : "inline-block" }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

function HeroText({ fallbackMode }: { fallbackMode: boolean }) {
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);

  const graceName = "GRACE";
  const yuenName = "YUEN";

  const shouldShow = isSceneReady || fallbackMode;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
      style={{
        opacity: heroTextOpacity,
        mixBlendMode: fallbackMode && !isSceneReady ? "normal" : "difference",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: heroTextOpacity }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center hero-text select-none">
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
                className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "#ffffff",
                }}
              >
                {graceName.split("").map((letter, i) => (
                  <AnimatedLetter
                    key={`grace-${i}`}
                    letter={letter}
                  />
                ))}
              </motion.div>

              <motion.div
                className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-inter)",
                  color: "#0000FF",
                }}
              >
                {yuenName.split("").map((letter, i) => (
                  <AnimatedLetter
                    key={`yuen-${i}`}
                    letter={letter}
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
