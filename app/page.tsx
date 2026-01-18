'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { HeroOverlay, Navigation } from '@/components/ui'
import { useScrollPhysics } from '@/hooks'
import { usePortfolioStore } from '@/store'

// Dynamic import for 3D Scene - must disable SSR for R3F
const Scene = dynamic(
  () => import('@/components/canvas/Scene'),
  { ssr: false }
)

// Section component for scroll content
function Section({
  id,
  title,
  className = '',
  children,
}: {
  id: string
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`min-h-screen flex flex-col items-center justify-center px-8 ${className}`}
    >
      <motion.h2
        className="text-4xl md:text-6xl font-bold mb-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        viewport={{ once: true, margin: '-100px' }}
      >
        {title}
      </motion.h2>
      {children}
    </section>
  )
}

// Projects section content
function ProjectsSection() {
  const projects = [
    {
      title: 'Project Alpha',
      description: 'A revolutionary web application',
      tech: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      title: 'Project Beta',
      description: 'Mobile-first design system',
      tech: ['Flutter', 'Firebase', 'Figma'],
    },
    {
      title: 'Project Gamma',
      description: 'AI-powered analytics platform',
      tech: ['Python', 'TensorFlow', 'AWS'],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
      {projects.map((project, index) => (
        <motion.div
          key={project.title}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="w-full h-40 bg-gradient-to-br from-electric-blue/20 to-transparent rounded-lg mb-4" />
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-white/60 text-sm mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 bg-white/10 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
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
      <p className="text-lg text-white/70 leading-relaxed mb-6">
        I&apos;m a passionate developer currently pursuing my Computer Science degree
        at the University of Hong Kong. I love building things that make a difference
        and solving complex problems with elegant solutions.
      </p>
      <p className="text-lg text-white/70 leading-relaxed">
        When I&apos;m not coding, you&apos;ll find me exploring new technologies,
        contributing to open source, or working on creative side projects.
      </p>
    </motion.div>
  )
}

// Contact section content
function ContactSection() {
  const links = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Email', href: 'mailto:hello@graceyuen.dev' },
  ]

  return (
    <div className="flex flex-col items-center">
      <p className="text-white/60 mb-8">Let&apos;s build something together</p>
      <div className="flex gap-6">
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="text-lg font-medium text-white/80 hover:text-white transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.label}
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-px bg-electric-blue"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  // Initialize scroll physics
  useScrollPhysics()

  const normalizedScroll = usePortfolioStore((state) => state.normalizedScroll)

  // Prevent scroll during initial load
  useEffect(() => {
    document.body.style.overflow = 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <main className="relative">
      {/* 3D Scene (Fixed background) */}
      <Scene />

      {/* UI Overlays */}
      <Navigation />
      <HeroOverlay />

      {/* Scroll Container */}
      <div className="scroll-container">
        {/* Hero Scroll Space - extended for cards to fully pass camera */}
        <div className="h-[1300vh]" />

        {/* Projects Section */}
        <Section
          id="projects"
          title="Projects"
          className="bg-navy"
        >
          <ProjectsSection />
        </Section>

        {/* About Section */}
        <Section
          id="about"
          title="About"
          className="bg-navy"
        >
          <AboutSection />
        </Section>

        {/* Experience Section */}
        <Section
          id="experience"
          title="Experience"
          className="bg-navy"
        >
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {[
                {
                  role: 'Software Developer Intern',
                  company: 'Tech Company',
                  period: '2024',
                },
                {
                  role: 'Teaching Assistant',
                  company: 'HKU Computer Science',
                  period: '2023 - Present',
                },
                {
                  role: 'Freelance Developer',
                  company: 'Various Clients',
                  period: '2022 - Present',
                },
              ].map((exp, index) => (
                <motion.div
                  key={exp.role}
                  className="border-l-2 border-white/20 pl-6 py-2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-white/60">{exp.company}</p>
                  <p className="text-sm text-white/40">{exp.period}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Contact Section */}
        <Section
          id="contact"
          title="Get in Touch"
          className="bg-navy"
        >
          <ContactSection />
        </Section>

        {/* Footer */}
        <footer className="py-8 text-center text-white/40 text-sm bg-navy">
          <p>&copy; {new Date().getFullYear()} Grace Yuen. All rights reserved.</p>
        </footer>
      </div>

      {/* Background transition overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-5"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, 100 - normalizedScroll * 150)}%, rgba(26, 26, 26, ${normalizedScroll * 0.8}) 100%)`,
        }}
      />
    </main>
  )
}
