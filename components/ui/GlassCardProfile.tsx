"use client";

import { motion, useMotionValue } from "framer-motion";
import {
  Code2,
  Terminal,
  Download,
  ArrowRight,
  Palette,
  Cloud,
  Send,
} from "lucide-react";
import { AnimatedLetter } from "./AnimatedLetter";
import { GlowBorderButton, GlowBorderButtonDefs } from "./GlowBorderButton";
import {
  DownloadIcon as AnimatedDownloadIcon,
  MessageSquareMoreIcon as AnimatedMessageIcon,
} from "./icons";
import styles from "./GlassCardText.module.css";
import { useState, useEffect, useRef } from "react";

const words = [
  "Developer",
  "Entrepreneur",
  "Storyteller",
  "Problem Solver",
  "Leader",
  "Engineer",
  "Builder",
  "Creator",
  "Innovator",
];

function MorphingText() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const textIndexRef = useRef(0);

  useEffect(() => {
    let time = new Date();
    let morph = 0;
    const morphTime = 1.5;
    const cooldownTime = 1.5;
    let cooldown = cooldownTime;

    function setMorph(fraction: number) {
      if (text1Ref.current && text2Ref.current) {
        const index = textIndexRef.current;
        text1Ref.current.textContent = words[index % words.length];
        text2Ref.current.textContent = words[(index + 1) % words.length];

        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        const fractionInv = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / fractionInv - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(fractionInv, 0.4) * 100}%`;
      }
    }

    function doMorph(dt: number) {
      morph += dt;
      if (morph >= morphTime) {
        cooldown = cooldownTime;
        morph = 0;
        textIndexRef.current++;
        doCooldown();
      } else {
        setMorph(morph / morphTime);
      }
    }

    function doCooldown() {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.textContent =
          words[textIndexRef.current % words.length];
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "100%";
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "0%";
      }
    }

    // Initial state
    doCooldown();

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const newTime = new Date();
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;
      if (cooldown <= 0) {
        doMorph(dt);
      } else {
        // Stay in cooldown state
      }
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      className="relative mb-3 h-[clamp(2.5rem,6vw,5rem)] flex items-center select-none"
      style={{ filter: "url(#threshold)" }}
    >
      <span
        ref={text1Ref}
        className="absolute w-full text-[clamp(2.5rem,6vw,5rem)] font-extrabold text-foreground tracking-tighter leading-none inline-block whitespace-nowrap"
      />
      <span
        ref={text2Ref}
        className="absolute w-full text-[clamp(2.5rem,6vw,5rem)] font-extrabold text-foreground tracking-tighter leading-none inline-block whitespace-nowrap"
      />
    </div>
  );
}

// Reorganized content to match screenshot specific cards
const cards = [
  {
    id: "languages",
    title: "Languages",
    Icon: Code2,
    skills: ["Python", "TypeScript", "Java", "GLSL", "C++"],
  },
  {
    id: "systems",
    title: "Systems & Cloud",
    Icon: Cloud,
    skills: ["AWS", "Docker", "Kubernetes", "Linux Arch"],
  },
  {
    id: "tools",
    title: "Tools & Design",
    Icon: Palette,
    skills: ["Figma", "Blender", "Three.js", "Spline"],
  },
];

function CardRow({ card, index }: { card: (typeof cards)[0]; index: number }) {
  const maskId = `icon-mask-${index}`;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
      className="relative flex items-center gap-3 md:gap-4 p-2.5 md:p-4 rounded-xl
                 liquid-glass-sm
                 hover:shadow-lg transition-all group w-full"
    >
      <div className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-full">
        {/* Using SVG Masking to apply the complex CSS animated gradient to the icon stroke */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] md:w-[24px] md:h-[24px] overflow-visible"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <card.Icon
                size={24}
                stroke="white"
                strokeWidth={2}
                fill="none"
                color="white"
              />
            </mask>
          </defs>
          <foreignObject
            x="0"
            y="0"
            width="24"
            height="24"
            mask={`url(#${maskId})`}
          >
            <div className="static-mesh-gradient dark:brightness-[1.15]" />
          </foreignObject>
        </svg>
      </div>

      <div className="flex flex-wrap justify-start gap-1.5 md:gap-2">
        {card.skills.map((skill) => (
          <span
            key={skill}
            className="text-[clamp(0.7rem,1vw,1rem)] text-gray-600 dark:text-gray-300 font-medium px-1.5 py-0.5 rounded-md hover:bg-white/30 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function GlassCardProfile() {
  const [isAnyHover, setIsAnyHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="w-full max-w-[90vw] xl:max-w-6xl mx-auto px-4 py-8 md:py-6 flex items-center justify-center min-h-[60vh] md:min-h-[70vh]">
      {/* BACKGROUND TYPOGRAPHY "ABOUT" & "ME" */}
      <div className={`${styles.bigText} ${styles.topLeft}`}>
        {"ABOUT".split("").map((letter, i) => (
          <AnimatedLetter
            key={`bg-about-${i}`}
            letter={letter}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
            onHoverChange={(h) => setIsAnyHover(h)}
            isHovered={isAnyHover}
            useShader={false}
            dynamicWeight={false}
            className={styles.plainText}
            style={{ "--char-index": i } as React.CSSProperties}
          />
        ))}
      </div>

      <div className={`${styles.bigText} ${styles.bottomRight}`}>
        {"ME".split("").map((letter, i) => (
          <AnimatedLetter
            key={`bg-me-${i}`}
            letter={letter}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
            onHoverChange={(h) => setIsAnyHover(h)}
            isHovered={isAnyHover}
            useShader={false}
            dynamicWeight={false}
            className={styles.plainText}
            style={{ "--char-index": i } as React.CSSProperties}
          />
        ))}
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        {/* Left Column: CLEAN PROFILE (No Card Background) */}
        <div className="h-full min-h-[400px] flex items-center">
          <div className="h-full flex flex-col justify-center p-3">
            <div>
              {/* The "Developer" Morphing Title */}
              <MorphingText />

              <div className={styles.aboutLine}>
                <p
                  className="text-[clamp(0.875rem,3.5vw,1.25rem)] leading-relaxed font-medium"
                  style={{ color: "var(--muted-text)" }}
                >
                  Bridging the gap between tangible interfaces and digital
                  experiences. Currently crafting spatial web environments and
                  exploring the frontiers of human-computer interaction with a
                  focus on immersive utility.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
              <GlowBorderButtonDefs />

              {/* Contact: Primary Style (Opposite color) */}
              <GlowBorderButton
                variant="primary"
                icon={AnimatedMessageIcon}
                className="text-xs sm:text-sm tracking-widest uppercase"
                style={{ padding: "0.8em 1.4em" }}
              >
                Contact Me
              </GlowBorderButton>

              {/* Download CV: Secondary Style (Same color) */}
              <GlowBorderButton
                variant="secondary"
                icon={AnimatedDownloadIcon}
                className="text-xs sm:text-sm tracking-widest uppercase"
                style={{ padding: "0.8em 1.4em" }} // Slight adjustment for layout validation
              >
                Download CV
              </GlowBorderButton>
            </div>
          </div>
        </div>

        {/* Right Column: Stacked Cards */}
        <div className="flex flex-col gap-4 justify-center">
          {cards.map((card, idx) => (
            <CardRow key={card.id} card={card} index={idx} />
          ))}
        </div>
      </div>

      {/* Gooey SVG Filter for MorphingText */}
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </section>
  );
}
