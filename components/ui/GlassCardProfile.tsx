"use client";

import { motion, useMotionValue } from "framer-motion";
import {
  Code2,
  Terminal,
  Download,
  ArrowRight,
  Palette,
  Cloud,
} from "lucide-react";
import { AnimatedLetter } from "./AnimatedLetter";
import styles from "./GlassCardText.module.css";
import { useState, useEffect } from "react";

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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="relative flex flex-col md:flex-row items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl
                 liquid-glass-sm
                 hover:shadow-lg transition-all group w-full"
    >
      <div
        className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full
                      bg-white/60 dark:bg-white/5 
                      text-indigo-600 dark:text-indigo-300
                      shadow-inner border border-white/50 dark:border-white/5"
      >
        <card.Icon
          size={16}
          strokeWidth={2}
          className="md:w-[18px] md:h-[18px]"
        />
      </div>

      <div className="flex flex-wrap justify-center md:justify-start gap-1.5 md:gap-2">
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
              <div className="text-[clamp(0.6rem,2vw,0.8rem)] md:text-[clamp(0.7rem,1.5vw,1rem)] font-bold tracking-[0.25em] text-indigo-500 mb-4 uppercase">
                Creative Technologist
              </div>

              {/* The "Developer" Title */}
              <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold text-gray-900 dark:text-white tracking-tighter leading-none mb-3">
                Developer
              </h2>

              <div className="mt-4 relative pl-4 border-l-2 border-indigo-500/30">
                <p className="text-[clamp(0.875rem,3.5vw,1.25rem)] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Bridging the gap between tangible interfaces and digital
                  experiences. Currently crafting spatial web environments and
                  exploring the frontiers of human-computer interaction with a
                  focus on immersive utility.
                </p>
              </div>
            </div>

            {/* Stylized Buttons matching Screenshot */}
            <div className="flex flex-wrap gap-2.5 mt-5">
              {/* Download CV: Black BG, White Text, Rounded 2xl (More boxy pill) */}
              <button className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-gray-900 text-white dark:bg-white dark:text-black rounded-lg font-bold text-[clamp(0.6rem,1.5vw,0.75rem)] tracking-[0.25em] sm:tracking-[0.35em] uppercase shadow-lg hover:translate-y-[-1.5px] hover:shadow-xl transition-all flex-1 sm:flex-none whitespace-nowrap">
                <Download size={14} strokeWidth={3} />
                Download CV
              </button>

              {/* Contact: White BG, Black Text, Rounded 2xl */}
              <button className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 bg-white text-gray-900 border border-gray-100 rounded-lg font-bold text-[clamp(0.6rem,1.5vw,0.75rem)] tracking-[0.25em] sm:tracking-[0.35em] uppercase shadow-sm hover:translate-y-[-1.5px] hover:shadow-md transition-all flex-1 sm:flex-none whitespace-nowrap">
                Contact
                <ArrowRight size={14} strokeWidth={3} />
              </button>
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
    </section>
  );
}
