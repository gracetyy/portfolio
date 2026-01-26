"use client";

import { motion } from "framer-motion";
import { Code2, Globe, Package, Terminal, Download, Mail } from "lucide-react";

const skillCategories = [
  {
    id: "programming",
    title: "Programming",
    Icon: Code2,
    skills: ["Python", "Java", "R", "C", "C++"],
  },
  {
    id: "devops",
    title: "DevOps",
    Icon: Terminal,
    skills: ["Linux CLI", "Git", "Powershell"],
  },
  {
    id: "webdev",
    title: "Web Development",
    Icon: Globe,
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Figma"],
  },
  {
    id: "software",
    title: "Software",
    Icon: Package,
    skills: [
      "Github",
      "Google Cloud",
      "AWS",
      "Azure",
      "Splunk",
      "Jira",
      "Microsoft Office",
      "Power Automate",
      "Blender",
      "Canva",
    ],
  },
];

// --- Components ---

function SkillPill({ skill }: { skill: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-3 py-1.5 text-xs font-medium rounded-full 
                 bg-white/40 dark:bg-white/5 
                 border border-white/40 dark:border-white/10
                 text-gray-800 dark:text-gray-200
                 shadow-sm backdrop-blur-sm
                 hover:bg-white/60 dark:hover:bg-white/10
                 transition-colors cursor-default"
    >
      {skill}
    </motion.div>
  );
}

function SkillGroup({
  category,
  index,
}: {
  category: (typeof skillCategories)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="p-4 rounded-xl 
                 bg-white/30 dark:bg-black/20 
                 border border-white/40 dark:border-white/5
                 backdrop-blur-md shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
        <category.Icon size={18} strokeWidth={2} />
        <h3 className="text-sm font-bold uppercase tracking-wider">
          {category.title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <SkillPill key={skill} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

function ProfileContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Left Column: Bio */}
      <div className="lg:col-span-2 flex flex-col justify-between space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
            Grace Yuen
          </h2>
          {/* Removed AI slop styling: no background, no border, no pulse */}
          <div className="inline-block text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-6">
            Year 3 CS Student @ HKU
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            <p>
              Obsessed with the space between{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                2D interfaces
              </span>{" "}
              and{" "}
              <span className="text-gray-900 dark:text-white font-bold">
                3D environments
              </span>
              . I build digital archives that feel tangible.
            </p>
            <p>
              Currently exploring WebGL interactions and spatial UI patterns for
              the next generation of web experiences.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 lg:pt-0">
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-gray-900 dark:bg-white
                       text-white dark:text-gray-900
                       font-bold text-sm shadow-lg
                       hover:shadow-xl transition-all"
          >
            <Download size={16} />
            Download CV
          </motion.a>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl
                       bg-white/50 dark:bg-white/10
                       border border-gray-200 dark:border-white/10
                       text-gray-800 dark:text-white
                       font-bold text-sm backdrop-blur-md
                       hover:bg-white/80 dark:hover:bg-white/20 transition-all"
          >
            <Mail size={16} />
            Contact Me
          </motion.a>
        </div>
      </div>

      {/* Right Column: Skills */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
        {skillCategories.map((cat, i) => (
          <SkillGroup key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export function GlassCardProfile() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Soft Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-300/30 dark:bg-blue-900/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "7s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/30 dark:bg-indigo-900/10 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full max-w-6xl relative z-10"
      >
        {/* Glass Card - More transparency, Frostier */}
        <div
          className="relative rounded-3xl overflow-hidden 
                        bg-white/10 dark:bg-black/10 
                        backdrop-blur-3xl backdrop-saturate-150
                        border border-white/20 dark:border-white/5 
                        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]"
        >
          {/* Subtle noise texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Additional specular gradient on top border */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

          {/* Content Container - No more tabs logic */}
          <div className="relative z-10 p-8 md:p-12">
            <ProfileContent />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
