"use client";

import * as THREE from "three";
import { useRef, useState, ReactNode } from "react";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO, useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import { easing } from "maath";

interface LensProps {
  children: ReactNode;
  damping?: number;
  [key: string]: any;
}

export function Lens({ children, damping = 0.14, ...props }: LensProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const { nodes } = useGLTF("/glb/lens-transformed2.glb") as any;
  const buffer = useFBO();
  const viewport = useThree((state) => state.viewport);
  const [scene] = useState(() => new THREE.Scene());
  const target = useRef(new THREE.Vector3(0, 0, 1));

  useFrame((state, delta) => {
    // Keep the lens locked to the camera target (hero center)
    easing.damp3(ref.current.position, target.current, damping, delta);

    // This renders the scene into a buffer, whose texture will then be fed into
    // a plane spanning the full screen and the lens transmission material
    state.gl.setRenderTarget(buffer);
    state.gl.setClearColor("#000000", 0); // transparent buffer so DOM gradient can show through
    state.gl.render(scene, state.camera);
    state.gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(children, scene)}
      <mesh
        scale={Math.min(viewport.width, viewport.height) * 0.14}
        ref={ref}
        rotation-x={Math.PI / 2}
        geometry={nodes.Cylinder.geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={1.14}
          thickness={1.4}
          anisotropy={0.14}
          chromaticAberration={0.14}
          distortion={0.14}
          distortionScale={1.4}
          temporalDistortion={0.14}
        />
      </mesh>
    </>
  );
}

useGLTF.preload("/glb/lens-transformed2.glb");
