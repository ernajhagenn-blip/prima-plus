"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function Model() {
  const r = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (r.current) {
      r.current.position.y = Math.sin(s.clock.elapsedTime * 2) * 0.06;
      r.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.7) * 0.3;
    }
  });
  return (
    <group ref={r} position={[0, 0, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.34, 28, 28]} />
        <meshStandardMaterial color="#f1c9a5" />
      </mesh>
      <mesh position={[0, 0.05, 0.16]}>
        <boxGeometry args={[0.42, 0.16, 0.2]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.55, 0.7, 0.4]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.5, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
}

export default function KaraModel() {
  return (
    <Canvas camera={{ position: [0, 0.4, 3.6], fov: 42 }}>
      <color attach="background" args={["#0b1130"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} />
      <pointLight position={[-3, 2, 2]} intensity={20} color="#22d3ee" />
      <Model />
    </Canvas>
  );
}
