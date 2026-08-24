"use client";

import { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Hero, HeroConfig } from "./Hero";
import { GameSky, Ground, FloatingParticles } from "./PrimaBits";

function Spinner({ config }: { config: HeroConfig }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group ref={ref}>
      <Hero config={config} idle={false} />
    </group>
  );
}

export default function SelectScene({ config }: { config: HeroConfig }) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 7], fov: 40 }}>
      <GameSky top="#87CEEB" bottom="#E0F7FA" />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} />
      <pointLight position={[-8, 6, 4]} intensity={40} color="#a855f7" />
      <pointLight position={[8, 6, -4]} intensity={40} color="#22d3ee" />
      <Ground color="#16a34a" />
      <FloatingParticles count={40} />
      <mesh position={[0, -1.55, 0]}><cylinderGeometry args={[2.6, 2.9, 0.5, 32]} /><meshStandardMaterial color="#94A3B8" /></mesh>
      <mesh position={[0, -1.25, 0]}><cylinderGeometry args={[2.4, 2.4, 0.1, 32]} /><meshStandardMaterial color="#FBBF24" /></mesh>
      <group position={[0, -1.4, 0]}>
        <Spinner config={config} />
      </group>
    </Canvas>
  );
}
