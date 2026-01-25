"use client";

import { useRef, useState } from "react";
import styles from "./styles.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MeshGradient as PaperMeshGradient } from "@paper-design/shaders-react";

gsap.registerPlugin(ScrollTrigger);

export function TelescopeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useGSAP(
    () => {
      setMounted(true);
      const smallImages = gsap.utils.toArray<HTMLElement>(
        `.${styles.section__images} img`,
      );
      const frontImages = gsap.utils.toArray<HTMLElement>(
        `.${styles.section__media__front}`,
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Pin for 200% of viewport height
          scrub: 1.5,
          pin: true,
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
      // We animate a proxy object or use onUpdate to set the CSS variable
      timeline.to(
        containerRef.current,
        {
          "--progress": 1, // Animate from 0 to 1
          duration: 1,
          ease: "power1.inOut",
        },
        "<", // Start at same time
      );
    },
    { scope: containerRef },
  );

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

      {/* Main Visual & Split Text */}
      <div className={styles.section__media}>
        <div className={styles.section__media__back}>
          {/* Soft Iridescent Mesh Gradient Background */}
          {mounted && (
            <div className="w-full h-full relative">
              <PaperMeshGradient
                width="100%"
                height="100%"
                colors={[
                  "#FFE4E1", // MistyRose (Very Light Pink)
                  "#E3F2FD", // Very Light Blue
                  "#F3E5F5", // Very Light Purple
                  "#FAFAFA", // Off White
                ]}
                distortion={1}
                swirl={0.6}
                grainMixer={0.05}
                speed={0.2}
              />
            </div>
          )}
        </div>
      </div>

      {/* Split Text */}

      <h1>
        <span className={styles.left}>
          <span className="museo-ss01">GRACE</span>
        </span>
        <span className={styles.right}>
          <span className="museo-ss01">YUE</span>
          <span className="museo-n-normal">N</span>
        </span>
      </h1>
    </div>
  );
}
