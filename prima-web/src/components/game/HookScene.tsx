"use client";

import { Canvas } from "@react-three/fiber";
import { GameSky, Ground, FloatingParticles, CityScape } from "./PrimaBits";
import { Hero, HEROES } from "./Hero";

export default function HookScene() {
  return (
    <Canvas shadows camera={{ position: [0, 3, 12], fov: 50 }}>
      <GameSky top="#1ea5e9" bottom="#bae6fd" />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 14, 6]} intensity={1.2} />
      <pointLight position={[-8, 6, 4]} intensity={40} color="#a855f7" />
      <pointLight position={[8, 6, -4]} intensity={40} color="#22d3ee" />
      <CityScape y={-24} />
      <Ground color="#22c55e" />
      <FloatingParticles count={50} color="#ffffff" />
      <group position={[-3, -1.6, 0]}><Hero config={HEROES[0]} /></group>
      <group position={[0, -1.6, 1.5]}><Hero config={HEROES[1]} /></group>
      <group position={[3, -1.6, 0]}><Hero config={HEROES[2]} /></group>
    </Canvas>
  );
}
