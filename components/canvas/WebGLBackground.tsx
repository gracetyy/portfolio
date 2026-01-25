"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Pastel animated gradient for the lens buffer (keeps the old hero mesh-gradient vibe)
export function WebGLBackground() {
  const mesh = useRef<THREE.Mesh>(null!);
  const viewport = useThree((s) => s.viewport);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColors: {
        value: [
          new THREE.Color("#FFE4E1"),
          new THREE.Color("#E3F2FD"),
          new THREE.Color("#F3E5F5"),
          new THREE.Color("#FAFAFA"),
        ],
      },
    }),
    [],
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={mesh} scale={Math.max(viewport.width, viewport.height) * 1.6} rotation-z={-0.35}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColors[4];

          // Soft noise-ish warp using sin/cos
          vec2 warp(vec2 uv) {
            float t = uTime * 0.35;
            uv += 0.06 * vec2(
              sin(uv.y * 6.283 + t),
              cos(uv.x * 6.283 + t * 0.8)
            );
            return uv;
          }

          void main() {
            vec2 uv = warp(vUv);

            float mixX = smoothstep(0.0, 1.0, uv.x);
            float mixY = smoothstep(0.0, 1.0, uv.y);

            vec3 horiz = mix(uColors[0], uColors[1], mixX);
            vec3 vert = mix(uColors[2], uColors[3], mixY);

            float swirl = 0.5 + 0.5 * sin(uTime * 0.4 + uv.x * 3.0 - uv.y * 3.0);
            vec3 color = mix(horiz, vert, swirl);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
}
