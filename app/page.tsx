"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Navigation,
  GlassCardProfile,
  Hero,
  LoadingGlobe,
  HeroOverlay,
  ProjectShape,
} from "@/components/ui";
import { MeshGradient } from "@/components/canvas";
import { useScrollPhysics } from "@/hooks";
import { usePortfolioStore } from "@/store";

// Dynamic import for 3D Scene - must disable SSR for R3F
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

// Section component for scroll content
function Section({
  id,
  title,
  className = "",
  children,
}: {
  id: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`min-h-screen flex flex-col items-center justify-start px-4 md:px-8 pt-20 md:pt-24 pb-20 md:pb-32 gap-8 ${className}`}
    >
      <motion.h2
        className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8"
        // Remove vertical translation to prevent perceived jumping between sections
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        viewport={{ once: true, amount: 0.4 }}
      >
        {title}
      </motion.h2>
      {children}
    </section>
  );
}

// Projects section content
function ProjectsSection() {
  const projects = [
    {
      title: "Project Alpha",
      description: "A revolutionary web application",
      tech: ["React", "Node.js", "PostgreSQL"],
    },
    {
      title: "Project Beta",
      description: "Mobile-first design system",
      tech: ["Flutter", "Firebase", "Figma"],
    },
    {
      title: "Project Gamma",
      description: "AI-powered analytics platform",
      tech: ["Python", "TensorFlow", "AWS"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          className="liquid-glass rounded-2xl p-6 transition-all hover:scale-[1.02]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-lg mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {project.title}
          </h3>
          <p className="text-foreground/60 text-sm mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-foreground/5 text-foreground/80 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// About section content
function AboutSection() {
  return (
    <motion.div
      className="max-w-2xl text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <p className="text-lg text-foreground/70 leading-relaxed mb-6">
        I&apos;m a passionate developer currently pursuing my Computer Science
        degree at the University of Hong Kong. I love building things that make
        a difference and solving complex problems with elegant solutions.
      </p>
      <p className="text-lg text-foreground/70 leading-relaxed">
        When I&apos;m not coding, you&apos;ll find me exploring new
        technologies, contributing to open source, or working on creative side
        projects.
      </p>
    </motion.div>
  );
}

// Contact section content
function ContactSection() {
  const links = [
    { label: "GitHub", href: "https://github.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Email", href: "mailto:hello@graceyuen.dev" },
  ];

  return (
    <div className="flex flex-col items-center">
      <p className="text-foreground/60 mb-8">
        Let&apos;s build something together
      </p>
      <div className="flex gap-6">
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="text-lg font-medium text-foreground/80 hover:text-foreground transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.label}
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  // Initialize scroll physics
  useScrollPhysics();

  const isSceneReady = usePortfolioStore((state) => state.isSceneReady);
  const normalizedScroll = usePortfolioStore((state) => state.normalizedScroll);

  // Ensure proper overflow handling
  useEffect(() => {
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, []);

  return (
    <main className="relative">
      {/* Loading State */}
      <LoadingGlobe isLoaded={isSceneReady} />

      {/* Pastel mesh gradient base layer (matches previous hero background) */}
      <MeshGradient />

      {/* 3D Scene (Fixed background) */}
      <Scene />

      {/* UI Overlays */}
      <Navigation />
      <HeroOverlay />

      {/* Scroll Container */}
      <div className="scroll-container">
        {/* Telescope Zoom Hero with Next Section Inside */}
        <Hero>
          <GlassCardProfile />
        </Hero>

        {/* Projects Section */}
        <Section
          id="projects"
          title="Projects"
          className="relative overflow-hidden"
        >
          <ProjectShape />
          <ProjectsSection />
        </Section>

        {/* Experience Section */}
        <Section id="experience" title="Experience">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {[
                {
                  role: "Software Developer Intern",
                  company: "Tech Company",
                  period: "2024",
                },
                {
                  role: "Teaching Assistant",
                  company: "HKU Computer Science",
                  period: "2023 - Present",
                },
                {
                  role: "Freelance Developer",
                  company: "Various Clients",
                  period: "2022 - Present",
                },
              ].map((exp, index) => (
                <motion.div
                  key={exp.role}
                  className="border-l-2 border-foreground/20 pl-6 py-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold text-foreground">
                    {exp.role}
                  </h3>
                  <p className="text-foreground/60">{exp.company}</p>
                  <p className="text-sm text-foreground/40">{exp.period}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" title="Get in Touch">
          <ContactSection />
        </Section>

        {/* Footer */}
        <footer className="py-8 text-center text-foreground/40 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Grace Yuen. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
