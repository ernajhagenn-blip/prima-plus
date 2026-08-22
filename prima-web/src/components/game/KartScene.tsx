"use client";

import { useRef } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import type * as THREE from "three";
import { GameSky, Ground, FloatingParticles } from "./PrimaBits";
import { Kart } from "./Kart";
import { KartConfig } from "./karts";

function Spinner({ config }: { config: KartConfig }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group ref={ref} position={[0, -1, 0]} scale={1.3}>
      <Kart body={config.body} accent={config.accent} />
    </group>
  );
}

export default function KartScene({ config }: { config: KartConfig }) {
  return (
    <Canvas shadows camera={{ position: [0, 3, 8], fov: 45 }}>
      <GameSky top="#1ea5e9" bottom="#bae6fd" />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} />
      <pointLight position={[-8, 6, 4]} intensity={40} color="#a855f7" />
      <pointLight position={[8, 6, -4]} intensity={40} color="#22d3ee" />
      <Ground color="#16a34a" />
      <FloatingParticles count={40} />
      <mesh position={[0, -1.55, 0]}><cylinderGeometry args={[3, 3.4, 0.5, 32]} /><meshStandardMaterial color="#334155" /></mesh>
      <mesh position={[0, -1.25, 0]}><cylinderGeometry args={[2.8, 2.8, 0.1, 32]} /><meshStandardMaterial color="#facc15" /></mesh>
      <Spinner config={config} />
    </Canvas>
  );
}
