"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Globe,
  Terminal,
  Cpu,
  Download,
  ArrowRight,
  Palette,
} from "lucide-react";

// Reorganized content for the 3-column layout
const cards = [
  {
    id: "frontend",
    title: "Frontend & Design",
    description:
      "Crafting immersive user experiences with modern web technologies and 3D interactions.",
    Icon: Palette,
    skills: ["React", "TypeScript", "Tailwind", "Three.js", "Figma", "Blender"],
  },
  {
    id: "backend",
    title: "Backend & Systems",
    description:
      "Building robust, scalable server-side logic and high-performance algorithms.",
    Icon: Code2,
    skills: ["Python", "Java", "C++", "R", "Node.js"],
  },
  {
    id: "devops",
    title: "Cloud & DevOps",
    description:
      "Streamlining deployment pipelines and managing cloud infrastructure.",
    Icon: Terminal,
    skills: ["AWS", "Google Cloud", "Docker", "Git", "Linux CLI"],
  },
];

function FeatureCard({
  card,
  index,
}: {
  card: (typeof cards)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="flex flex-col h-full p-6 rounded-2xl
                 bg-white/40 dark:bg-black/20 
                 border border-white/40 dark:border-white/10
                 backdrop-blur-sm shadow-sm
                 hover:shadow-md hover:bg-white/50 dark:hover:bg-white/10
                 transition-all group"
    >
      <div
        className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl 
                      bg-white/60 dark:bg-white/5 
                      text-indigo-600 dark:text-indigo-300
                      shadow-inner border border-white/50 dark:border-white/5"
      >
        <card.Icon size={24} strokeWidth={1.5} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {card.title}
      </h3>

      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
        {card.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {card.skills.map((skill) => (
          <span
            key={skill}
            className="text-[10px] uppercase tracking-wider font-semibold 
                       px-2 py-1 rounded-md
                       bg-white/50 dark:bg-white/10 
                       text-gray-600 dark:text-gray-400"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function ProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                     bg-indigo-100/50 dark:bg-indigo-900/30 
                     text-indigo-800 dark:text-indigo-200 
                     text-xs font-bold uppercase tracking-widest"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Open to Work
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          Grace Yuen
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-lg"
        >
          Obsessed with the space between{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            2D interfaces
          </span>{" "}
          and{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            3D environments
          </span>
          . I build digital archives that feel tangible.
        </motion.p>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <a
          href="/resume.pdf" // Placeholder path
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-gray-900 dark:bg-white text-white dark:text-gray-900
                     font-semibold text-sm shadow-lg hover:shadow-xl
                     hover:translate-y-[-2px] transition-all"
        >
          <Download size={16} />
          Resume
        </a>
        <a
          href="#contact" // Link to existing contact section
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-white/50 dark:bg-white/10 
                     border border-white/40 dark:border-white/10
                     text-gray-900 dark:text-white
                     font-semibold text-sm backdrop-blur-md
                     hover:bg-white/80 dark:hover:bg-white/20 transition-all"
        >
          Contact
          <ArrowRight size={16} />
        </a>
      </motion.div>
    </div>
  );
}

export function GlassCardProfile() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Background Glows matching the theme */}
      <div className="absolute inset-0 -z-10 translate-y-20 opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/30 rounded-full blur-[120px]" />
      </div>

      {/* Main Container - The "Card" Look */}
      <div
        className="relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden
                      bg-white/20 dark:bg-black/20
                      backdrop-blur-2xl backdrop-saturate-150
                      border border-white/40 dark:border-white/10
                      shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
      >
        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <ProfileHeader />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <FeatureCard key={card.id} card={card} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
