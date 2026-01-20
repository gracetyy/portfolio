"use client";

import * as THREE from "three";
import { useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial, Plane } from "@react-three/drei";
import { usePortfolioStore } from "@/store";

// Define the shader material
const GradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 1.0,
    uColor1: new THREE.Color("#050511"), // Navy
    uColor2: new THREE.Color("#10103a"), // Slightly lighter navy/purple
    uColor3: new THREE.Color("#0000aa"), // Deep blue
    uColor4: new THREE.Color("#000033"), // Darkest blue
  },
  // vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  `
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      float time = uTime * 0.15;
      
      // Moving blobs
      float n = snoise(uv * 1.5 + time * 0.3);
      float n2 = snoise(uv * 2.5 - time * 0.15);
      
      // Mix logic
      float noiseMix = n * 0.5 + 0.5;
      float noiseMix2 = n2 * 0.5 + 0.5;
      
      vec3 color = mix(uColor1, uColor2, noiseMix); // Base mix
      color = mix(color, uColor3, noiseMix2 * smoothstep(0.0, 1.0, uv.y)); // Add blue gradient up
      color = mix(color, uColor4, smoothstep(0.4, 0.6, abs(n - n2)) * 0.5); // Add highlight
      
      gl_FragColor = vec4(color, uOpacity);
    }
  `,
);

extend({ GradientMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    gradientMaterial: any;
  }
}

export function MeshGradient() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const heroTextOpacity = usePortfolioStore((state) => state.heroTextOpacity);

  // Get viewport at the background position (e.g. z=-40)
  // Since camera is at z=8, dist is 48
  const { viewport } = useThree((state) => ({
    viewport: state.viewport.getCurrentViewport(state.camera, [0, 0, -40]),
  }));

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smoothly interpolate opacity if needed, but direct assignment is fine for React updates often
      // Use a lerp for smoother transition if frame-rate allows, or rely on store updates
      materialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uOpacity.value,
        heroTextOpacity,
        0.1,
      );
    }
  });

  return (
    <Plane
      args={[1, 1]}
      scale={[viewport.width, viewport.height, 1]}
      position={[0, 0, -40]}
    >
      <gradientMaterial ref={materialRef} transparent={true} />
    </Plane>
  );
}
