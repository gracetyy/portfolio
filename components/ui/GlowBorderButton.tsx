import React from "react";
import styles from "./GlowBorderButton.module.css";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface GlowBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: React.ComponentType<any>; // Allow any component, including animated ones
  children: React.ReactNode;
}

export const GlowBorderButtonDefs = () => (
  <svg
    width="0"
    height="0"
    style={{ position: "absolute", pointerEvents: "none" }}
  >
    <defs>
      <filter id="heroNoise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      {/* Pastel gradients for the hover effect */}
      <radialGradient id="rg0" cx="85%" cy="80%" r="82%">
        <stop offset="0%" stopColor="hsl(267,60%,80%)" stopOpacity="1" />
        <stop offset="70%" stopColor="hsl(267,60%,80%)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rg1" cx="60%" cy="24%" r="78%">
        <stop offset="0%" stopColor="hsl(336,100%,82%)" stopOpacity="1" />
        <stop offset="78%" stopColor="hsl(336,100%,82%)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rg2" cx="13%" cy="82%" r="75%">
        <stop offset="0%" stopColor="hsl(54,100%,52%)" stopOpacity="0.8" />
        <stop offset="68%" stopColor="hsl(54,100%,52%)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="rg3" cx="24%" cy="7%" r="76%">
        <stop offset="0%" stopColor="hsl(299,72%,68%)" stopOpacity="1" />
        <stop offset="70%" stopColor="hsl(299,72%,68%)" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export function GlowBorderButton({
  variant = "primary",
  icon: Icon,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  ...props
}: GlowBorderButtonProps) {
  const id = React.useId().replace(/:/g, ""); // Clean ID for SVG selector
  const maskId = `mask-${id}`;
  const iconRef = React.useRef<any>(null);

  const containerClass = `
    ${styles.container} 
    ${variant === "primary" ? styles.primary : styles.secondary}
    ${className || ""}
  `;

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    iconRef.current?.startAnimation?.();
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    iconRef.current?.stopAnimation?.();
    onMouseLeave?.(e);
  };

  return (
    <div className={containerClass}>
      <motion.button
        className={styles.btn}
        whileHover="hover"
        initial="initial"
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(props as any)}
      >
        <svg className={styles.hoverBg} width="100%" height="100%">
          <rect width="100%" height="100%" fill="white" opacity="0.25" />
          <rect width="100%" height="100%" fill="url(#rg0)" />
          <rect width="100%" height="100%" fill="url(#rg1)" />
          <rect width="100%" height="100%" fill="url(#rg2)" />
          <rect width="100%" height="100%" fill="url(#rg3)" />
          <rect
            width="100%"
            height="100%"
            filter="url(#heroNoise)"
            opacity="0.32"
          />
        </svg>
        <span className={styles.spark}></span>
        <span className={styles.backdrop}></span>

        {Icon && (
          <motion.div
            className={styles.icon}
            variants={{
              hover: { y: -2, scale: 1.1 },
            }}
          >
            <div className={styles.iconWrapper}>
              <Icon 
                ref={iconRef} 
                size={18} 
                className="relative z-10" 
                style={{ color: 'inherit' }}
              />
            </div>
          </motion.div>
        )}

        <span className={styles.text}>{children}</span>
      </motion.button>
    </div>
  );
}
