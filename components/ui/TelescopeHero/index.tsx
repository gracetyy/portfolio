"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePortfolioStore } from "@/store";
import { AnimatedLetter } from "../AnimatedLetter";
import { useMotionValue } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function TelescopeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const setLensTarget = usePortfolioStore((state) => state.setLensTarget);
  const setLensActive = usePortfolioStore((state) => state.setLensActive);
  const setLensZoom = usePortfolioStore((state) => state.setLensZoom);

  const [isAnyHover, setIsAnyHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Since the hero is 100vh and pinned, we can safely assume center screen
  // This avoids jumping or "above" positioning issues with getBoundingClientRect()
  const setCenterTarget = useCallback(() => {
    setLensTarget({ x: 0.5, y: 0.5 });
  }, [setLensTarget]);

  useGSAP(
    () => {
      const smallImages = gsap.utils.toArray<HTMLElement>(
        `.${styles.section__images} img`,
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Pin for 200% of viewport height
          scrub: 1.5,
          pin: true,
          onEnter: () => {
            setCenterTarget();
            setLensActive(true);
          },
          onEnterBack: () => {
            setCenterTarget();
            setLensActive(true);
          },
          onLeave: () => setLensActive(false),
          onLeaveBack: () => setLensActive(false),
        },
      });

      // Animate small images (Z-axis zoom)
      timeline.to(smallImages, {
        z: "100vh",
        duration: 1,
        ease: "power1.inOut",
        stagger: {
          amount: 0.2, // Randomize slightly
          from: "center",
        },
      });

      // Animate Main Visual (scale & text spread via CSS variable)
      // Also update lens zoom in store
      const proxy = { progress: 0 };

      timeline.to(
        containerRef.current,
        {
          "--progress": 1, // Animate from 0 to 1
          duration: 1,
          ease: "power1.inOut",
        },
        "<", // Start at same time
      );

      timeline.to(
        proxy,
        {
          progress: 1,
          duration: 1,
          ease: "power1.inOut",
          onUpdate: () => {
            setLensZoom(proxy.progress);
          },
        },
        "<",
      );

      setCenterTarget();
      setLensActive(true);
    },
    { scope: containerRef, dependencies: [setCenterTarget, setLensActive] },
  );

  useEffect(() => {
    setCenterTarget();
    setLensActive(true);

    const handleResize = () => setCenterTarget();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      setLensActive(false);
    };
  }, [setCenterTarget, setLensActive]);

  // Placeholder images
  const smallImageUrls = Array.from({ length: 10 }).map(
    (_, i) => `https://picsum.photos/400/500?random=${i + 100}`,
  );

  return (
    <div ref={containerRef} className={styles.section}>
      {/* Floating Image Grid */}
      <div className={styles.section__images}>
        {smallImageUrls.map((src, i) => (
          <img key={i} src={src} alt={`Float ${i}`} />
        ))}
      </div>

      {/* Split Text */}

      <h1 ref={titleRef}>
        <span className={styles.left}>
          {"GRACE".split("").map((letter, i) => (
            <AnimatedLetter
              key={`grace-${i}`}
              letter={letter}
              index={i}
              mouseX={mouseX}
              mouseY={mouseY}
              onHoverChange={(h) => setIsAnyHover(h)}
              isHovered={isAnyHover}
              useShader={false}
              className={styles.gradientText}
              style={{ "--char-index": i } as React.CSSProperties}
            />
          ))}
        </span>
        <span className={styles.right}>
          {"YUEN".split("").map((letter, i) => (
            <AnimatedLetter
              key={`yuen-${i}`}
              letter={letter}
              index={5 + i}
              mouseX={mouseX}
              mouseY={mouseY}
              onHoverChange={(h) => setIsAnyHover(h)}
              isHovered={isAnyHover}
              useShader={false}
              className={styles.gradientText}
              style={{ "--char-index": i + 5 } as React.CSSProperties}
            />
          ))}
        </span>
      </h1>
    </div>
  );
}
