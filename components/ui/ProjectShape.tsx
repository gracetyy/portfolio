"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectShape.module.css";

export function ProjectShape() {
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const progress = time - startTimeRef.current;

    // Smooth slow rotation
    setRotation(progress * 0.0003);

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const generateTorusSpiral = (rotY: number) => {
    // Canvas dimensions (aspect ratio 573/416)
    const viewWidth = 573;
    const viewHeight = 416;
    const cx = viewWidth / 2;
    const cy = viewHeight / 2;

    // Torus parameters
    const R = 140; // Major radius
    const r = 55; // Minor radius

    // Spiral parameters
    const loops = 40;
    const pointsPerLoop = 24;
    const totalPoints = loops * pointsPerLoop;

    let path = "";

    for (let i = 0; i <= totalPoints; i++) {
      // u goes from 0 to 2PI (around the major circle)
      // This is u for the Torus parameterization, but in our new orientation we'll map it to theta around Y
      const u = (i / totalPoints) * Math.PI * 2;

      // v goes from 0 to loops * 2PI (around the tube)
      const v = (i / pointsPerLoop) * Math.PI * 2;

      // ORIENTATION: Torus lying flat on XZ plane (Symmetry axis = Y)
      // Animate theta (around Y) to spin it like a top
      const theta = u + rotY;
      const phi = v;

      // XZ plane major circle
      let x = (R + r * Math.cos(phi)) * Math.cos(theta);
      let z = (R + r * Math.cos(phi)) * Math.sin(theta);
      let y = r * Math.sin(phi); // limit height in Y

      // Rotation Matrix for TILT (View Angle)
      // Rotate around X axis to bring the top towards viewer
      const tilt = 0.6;
      const tiltZ = -0.3; // Tilt leftward (counter-clockwise)

      // X-Axis Tilt
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      y = y2;
      z = z2;

      // Z-Axis Tilt
      const x3 = x * Math.cos(tiltZ) - y * Math.sin(tiltZ);
      const y3 = x * Math.sin(tiltZ) + y * Math.cos(tiltZ);
      x = x3;
      y = y3;

      // Project to 2D
      const perspective = 800;
      const scale = perspective / (perspective + z + 400);

      const x2d = cx + x * scale;
      const y2d = cy + y * scale;

      if (i === 0) {
        path += `M${x2d.toFixed(1)},${y2d.toFixed(1)}`;
      } else {
        path += ` L${x2d.toFixed(1)},${y2d.toFixed(1)}`;
      }
    }

    return path;
  };

  return (
    <div className={styles.shapeContainer}>
      <svg
        viewBox="0 0 573 416"
        className={styles.svgContainer}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <mask id="torus-mask">
            <rect width="100%" height="100%" fill="black" />
            <path
              d={generateTorusSpiral(rotation)}
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        <foreignObject
          x="0"
          y="0"
          width="100%"
          height="100%"
          mask="url(#torus-mask)"
        >
          <div className={styles.innerGradient} />
        </foreignObject>
      </svg>
    </div>
  );
}
