"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Code2,
  Globe,
  Package,
  Terminal,
  FileText,
  Clock,
  Award,
  LucideIcon,
} from "lucide-react";
import { MouseEvent, useRef, useState } from "react";

// --- Tab & Data Configuration ---
const tabs = [
  { id: "about", label: "FILE: PROFILE_V1.0" },
  { id: "process", label: "FILE: PROCESS_V2.0" },
  { id: "logs", label: "FILE: LAB_LOGS" },
  { id: "recognition", label: "FILE: RECOGNITION" },
];

const skillCategories = [
  {
    id: "programming",
    title: "Programming",
    Icon: Code2,
    skills: ["Python", "Java", "R", "C", "C++"],
    isStatus: false,
  },
  {
    id: "devops",
    title: "DevOps",
    Icon: Terminal,
    skills: ["Linux CLI", "Git", "Powershell"],
    isStatus: false,
  },
  {
    id: "webdev",
    title: "Web Development",
    Icon: Globe,
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Figma"],
    isStatus: false,
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
    isStatus: false,
  },
];

// --- SVG Masks & Filters ---
const tapeMask =
  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 20%22%3E%3Cpolygon points=%220,3 6,5 1,9 7,11 2,15 8,17 0,19 100,19 93,16 99,12 94,8 100,5 92,2 100,0 0,0%22 fill=%22white%22/%3E%3C/svg%3E')";

// Finer, more realistic torn paper edge (4 sides jagged)
const finePaperEdgeMask =
  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,0 L10,0.7 L20,0.4 L30,4.4 L40,4.3 L50,5.3 L60,0.5 L70,3.6 L80,3.7 L90,2.5 L100,5.3 L110,4.1 L120,2.6 L130,2.1 L140,2.4 L150,3.3 L160,1.5 L170,0.9 L180,0.2 L190,4.8 L200,1.4 L210,4.2 L220,4.4 L230,0.9 L240,1.2 L250,3.4 L260,5.7 L270,5.7 L280,4.0 L290,5.0 L300,0.9 L310,0.6 L320,5.5 L330,1.4 L340,4.8 L350,2.6 L360,5.7 L370,3.5 L380,2.9 L390,1.5 L400,3.2 L394.5,10 L399.2,20 L394.1,30 L398.2,40 L398.9,50 L394.8,60 L398.1,70 L397.2,80 L394.5,90 L398.7,100 L398.1,110 L395.9,120 L399.1,130 L396.6,140 L396.1,150 L394.9,160 L397.2,170 L394.9,180 L394.0,190 L395.5,200 L398.3,210 L399.3,220 L399.9,230 L399.3,240 L395.7,250 L396.9,260 L397.4,270 L397.8,280 L396.2,290 L396.5,300 L395.9,310 L394.1,320 L399.4,330 L397.8,340 L397.9,350 L399.2,360 L395.5,370 L397.6,380 L398.5,390 L394.8,400 L390,397.6 L380,394.8 L370,395.6 L360,394.1 L350,396.8 L340,394.1 L330,399.7 L320,398.4 L310,394.8 L300,398.4 L290,395.8 L280,398.8 L270,394.6 L260,399.0 L250,398.0 L240,398.1 L230,398.8 L220,395.8 L210,395.7 L200,396.3 L190,395.5 L180,395.6 L170,399.3 L160,398.2 L150,395.6 L140,398.7 L130,398.3 L120,398.1 L110,396.2 L100,395.2 L90,396.8 L80,394.6 L70,394.9 L60,394.0 L50,395.6 L40,394.8 L30,394.7 L20,396.0 L10,398.0 L0,395.9 L1.2,390 L0.9,380 L6.0,370 L0.8,360 L4.3,350 L2.7,340 L5.5,330 L3.1,320 L1.6,310 L5.2,300 L0.3,290 L5.3,280 L1.1,270 L1.4,260 L1.9,250 L2.6,240 L0.0,230 L4.1,220 L1.2,210 L3.2,200 L1.0,190 L2.8,180 L0.5,170 L3.8,160 L5.3,150 L4.6,140 L0.5,130 L0.9,120 L2.6,110 L3.7,100 L4.1,90 L1.8,80 L3.1,70 L2.7,60 L0.3,50 L2.8,40 L2.8,30 L4.1,20 L1.6,10 L0.3,0 Z%22 fill=%22white%22/%3E%3C/svg%3E')";

const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.25'/%3E%3C/svg%3E")`;

const skillRotations = ["-1deg", "0.8deg", "-0.6deg", "0.4deg"];

// --- Helper Components ---

function TapeStrip({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(120deg, rgba(255,255,255,0.7), rgba(255,255,255,0.45))",
        opacity: 0.72,
        boxShadow: "0 10px 18px rgba(0, 0, 0, 0.22)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        maskImage: tapeMask,
        WebkitMaskImage: tapeMask,
      }}
    />
  );
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <motion.span
      className="inline-block px-3 py-1.5 text-xs font-medium bg-gray-50/80 text-gray-700 rounded-sm border border-gray-200 cursor-default select-none relative"
      whileHover={{
        backgroundColor: "rgba(0, 100, 255, 0.05)",
        borderColor: "rgba(0, 100, 255, 0.5)",
        color: "#0050dd",
      }}
      transition={{ duration: 0.2 }}
    >
      {skill}
    </motion.span>
  );
}

function SkillCard({
  category,
  index,
}: {
  category: (typeof skillCategories)[0];
  index: number;
}) {
  const rotation = skillRotations[index % skillRotations.length];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
      style={{
        rotate: rotation,
        transformOrigin: "center center",
      }}
    >
      {/* Tape Strip: Rendered Outside mask to prevent clipping */}
      <TapeStrip className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 -rotate-1 z-20" />

      {/* Masked Paper Content */}
      <div
        className="relative bg-[#fdfbf7] p-5"
        style={{
          maskImage: finePaperEdgeMask,
          WebkitMaskImage: finePaperEdgeMask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.05), 0 10px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Paper Texture Overlay: Increased opacity for visibility */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
          style={{ backgroundImage: paperTexture }}
        />

        {/* Subtle Inner Highlight */}
        <div className="absolute inset-0 border border-white/50 pointer-events-none mix-blend-overlay" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            {category.Icon && (
              <category.Icon className="w-4 h-4 text-gray-600" aria-hidden />
            )}
            <h4 className="text-xs font-bold tracking-wider text-gray-800 uppercase">
              {category.title}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.skills?.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileCard() {
  return (
    <motion.div
      className="relative h-full"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Tape Strip: Rendered Outside mask */}
      <TapeStrip className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 z-20 rotate-1" />

      {/* Masked Glass Content */}
      <div
        className="relative h-full bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl p-8 border border-white/30 shadow-2xl"
        style={{
          // Removed mix-blend-overlay to ensure the frosted paper looks like a solid (but translucent) object
          boxShadow:
            "0 14px 36px rgba(0, 0, 0, 0.38), 0 4px 10px rgba(0, 0, 0, 0.25)",
          maskImage: finePaperEdgeMask,
          WebkitMaskImage: finePaperEdgeMask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        {/* Subtle white fill to make it look like paper, not just a cutout */}
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: paperTexture }}
        />

        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] tracking-tight">
              Grace Yuen
            </h2>
            <p className="font-semibold text-[#1239ff] drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)] px-2 py-1 inline-block rounded-sm">
              Year 3 Computer Science Student @ HKU
            </p>
          </div>

          <div className="flex-1 space-y-4 text-white text-sm leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] font-medium">
            <p>
              Obsessed with the space between 2D interfaces and 3D environments.
              I build digital archives that feel tangible.
            </p>
            <p>
              Currently exploring WebGL interactions and spatial UI patterns for
              the next generation of web experiences.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <motion.a
              href="#"
              className="text-sm font-bold text-white underline underline-offset-4 decoration-white/50 hover:decoration-white transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DOWNLOAD CV
            </motion.a>
            <motion.a
              href="#contact"
              className="text-sm font-bold text-white/90 hover:text-white transition-colors drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONTACT
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PlaceholderContent({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-[#7c7258] gap-4 p-8 border-2 border-dashed border-[#a3987d] rounded-xl bg-[#e6dec5]/30">
      <Icon size={48} strokeWidth={1.5} className="opacity-50" />
      <div className="text-center">
        <h3 className="text-lg font-bold uppercase tracking-widest mb-2">
          {title}
        </h3>
        <p className="text-xs opacity-75 max-w-[200px] leading-relaxed">
          This file is currently encrypted. Access requires higher clearance
          level.
        </p>
      </div>
    </div>
  );
}

function FolderTab({
  tab,
  index,
  isActive,
  onClick,
}: {
  tab: (typeof tabs)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent jitter when clicking
        onClick();
      }}
      className={`relative px-5 py-3 text-[10px] md:text-xs font-bold tracking-wider rounded-t-xl transition-colors select-none group`}
      style={{
        marginLeft: index > 0 ? "4px" : "0",
        zIndex: isActive ? 50 : 10 - index,
        // Pull Tabs down to connect with main body
        marginBottom: "-6px",
        paddingBottom: "8px",
      }}
      initial={false}
      animate={{
        y: isActive ? 0 : 4,
        color: isActive ? "#333" : "#666",
      }}
      whileHover={!isActive ? { y: 2 } : {}}
    >
      {/* Tab Background with Connection to body - Simplified Border Loop */}
      <div
        className={`absolute inset-0 rounded-t-xl ${
          isActive ? "bg-[#d4c5a3]" : "bg-[#c4b593] group-hover:bg-[#ccbf9f]"
        }`}
        style={{
          boxShadow: isActive ? "0 -2px 5px rgba(0,0,0,0.05)" : "none",
        }}
      />

      {/* Paper Thickness Highlight on Top Edge */}
      <div className="absolute top-[1px] left-[1px] right-[1px] h-[1px] bg-white/40 rounded-t-xl pointer-events-none" />

      {/* Label - Green dot removed */}
      <span className="relative z-10 flex items-center gap-2">{tab.label}</span>
    </motion.button>
  );
}

export function ManilaFolder() {
  const [activeTab, setActiveTab] = useState("about");
  const folderRef = useRef<HTMLDivElement>(null);

  // Tilt State
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateXRaw = useTransform(pointerY, [0, 1], [5, -5]); // Reduced tilt range to minimize jitter
  const rotateYRaw = useTransform(pointerX, [0, 1], [-5, 5]);
  const rotateX = useSpring(rotateXRaw, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 150, damping: 20 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    // We attach this to the wrapper now, so we need to be careful with rect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    pointerX.set(Math.min(Math.max(x, 0), 1));
    pointerY.set(Math.min(Math.max(y, 0), 1));
  };

  const resetTilt = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  // Render Content based on Active Tab
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="lg:h-full min-h-[400px]">
              <ProfileCard />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 auto-rows-min content-start">
              {skillCategories.map((category, idx) => (
                <SkillCard key={category.id} category={category} index={idx} />
              ))}
            </div>
          </div>
        );
      case "process":
        return <PlaceholderContent title="Process V2.0" icon={Clock} />;
      case "logs":
        return <PlaceholderContent title="Lab Logs" icon={FileText} />;
      case "recognition":
        return <PlaceholderContent title="Recognition" icon={Award} />;
      default:
        return null;
    }
  };

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center px-4 py-20 font-mono"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.div
        className="relative w-full max-w-5xl mx-auto md:scale-[0.9]"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        viewport={{ once: true }}
        style={{ perspective: "1000px" }}
        // Move event listeners here to the static parent to fix jitter/thrashing
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
      >
        <motion.div
          ref={folderRef}
          className="relative origin-center transform-style-3d"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main Folder Backing / Shadow Layer */}
          <div className="absolute inset-0 bg-black/20 rounded-xl blur-xl translate-y-8 translate-x-4 -z-50" />

          {/* Paper Thickness Layers (Stacked Papers effect) */}
          <div className="absolute inset-0 bg-[#f4f1ea] rounded-xl translate-y-[-10px] scale-[0.985] -z-40 shadow-sm border border-gray-200" />
          <div className="absolute inset-0 bg-[#efebe2] rounded-xl translate-y-[-6px] scale-[0.99] -z-30 shadow-sm border border-gray-200" />
          <div className="absolute inset-0 bg-[#ebe6db] rounded-xl translate-y-[-3px] scale-[0.995] -z-20 shadow-sm border border-gray-200" />

          {/* Tabs Row */}
          <div className="flex items-end ml-4 md:ml-8 relative z-10 translate-y-[1px]">
            {tabs.map((tab, index) => (
              <FolderTab
                key={tab.id}
                tab={tab}
                index={index}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {/* Main Folder Body */}
          <div
            className="relative bg-[#d4c5a3] rounded-xl rounded-tl-none p-6 md:p-10 shadow-2xl min-h-[600px] transform-style-3d"
            style={{
              // Inner shadow to enhance depth
              boxShadow:
                "inset 0 0 40px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,0.3) inset",
            }}
          >
            {/* Dynamic Paper Stack behind tabs/content to show 'thickness' between tabs */}
            {tabs.map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-0 right-0 h-full bg-white rounded-xl -z-10 border-t border-gray-200"
                style={{
                  transform: `translateZ(${-1 * (i + 1)}px) translateY(${-1 * (i + 1)}px)`,
                  opacity: activeTab === tabs[i].id ? 0 : 0.5, // Hide the one active? Or just stack
                }}
              />
            ))}

            {/* Folder Material Textures (Grain & Gradient) */}
            <div className="absolute inset-0 bg-[#d4c5a3] rounded-xl rounded-tl-none -z-10" />
            <div className="absolute inset-x-0 bottom-0 top-[20%] bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-b-xl" />

            {/* Noise Texture */}
            <div
              className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: "150px 150px",
              }}
            />

            {/* Crease/Fold Effect on Left spine */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none" />

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full">{renderContent()}</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
