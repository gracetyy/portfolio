"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePortfolioStore } from "@/store";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const navContainerVariants = {
  collapsed: {
    width: 40,
    height: 40,
    borderRadius: 10,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  expanded: {
    width: "auto",
    height: 44,
    borderRadius: 22,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants = {
  collapsed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
};

function HamburgerIcon({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="relative w-5 h-5 flex items-center justify-center focus:outline-none"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <X size={18} strokeWidth={2} className="text-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <Menu size={18} strokeWidth={2} className="text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

const NavItem = ({ label, href }: { label: string; href: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      variants={navItemVariants}
      className="relative px-2 md:px-3 py-2 text-[10px] sm:text-xs md:text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
      <motion.span
        className="absolute bottom-1 left-3 right-3 h-px bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        style={{ originX: 0 }}
      />
    </motion.a>
  );
};

export function Navigation() {
  const isNavExpanded = usePortfolioStore((state) => state.isNavExpanded);
  const toggleNav = usePortfolioStore((state) => state.toggleNav);
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);
  const [isHovered, setIsHovered] = useState(false);

  const showExpanded = isNavExpanded;

  return (
    <motion.nav
      className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-end overflow-hidden nav-expanded max-w-[calc(100vw-24px)]"
        variants={navContainerVariants}
        animate={showExpanded ? "expanded" : "collapsed"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          {showExpanded && (
            <motion.div
              className="flex items-center pl-2 md:pl-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {navItems.map((item) => (
                <NavItem key={item.label} label={item.label} href={item.href} />
              ))}
              <div className="mx-2 w-px h-6 bg-foreground/20" />
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex items-center justify-center w-10 h-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HamburgerIcon isOpen={showExpanded} onToggle={toggleNav} />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showExpanded && heroTextOpacity < 0.5 && (
          <motion.div
            className="fixed inset-0 -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at top right, rgba(26, 26, 26, 0.3) 0%, transparent 70%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navigation;
