"use client";

import { useRef } from "react";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { GameSky, Clouds, CityScape, Ground, FloatingParticles, Flag, CheckeredRing } from "./PrimaBits";
import { Kart } from "./Kart";
import { Hero, HEROES } from "./Hero";

function Location({
  position, hovered, index, children,
}: {
  position: [number, number, number]; hovered: number | null; index: number; children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const target = hovered === index ? 1.18 : 1;
    ref.current.scale.x += (target - ref.current.scale.x) * 0.1;
    ref.current.scale.y = ref.current.scale.z = ref.current.scale.x;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, -1.6, 0]}><cylinderGeometry args={[3.4, 3.8, 0.6, 24]} /><meshStandardMaterial color="#334155" /></mesh>
      {children}
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  const a = useRef(0);
  useFrame((_, dt) => {
    a.current += dt * 0.06;
    const R = 30;
    camera.position.set(Math.sin(a.current) * R, 9, Math.cos(a.current) * R);
    camera.lookAt(0, 2, -4);
  });
  return null;
}

export default function WorldHubScene({ hovered, onPick }: { hovered: number | null; onPick: (i: number) => void }) {
  return (
    <Canvas shadows camera={{ position: [0, 9, 30], fov: 50 }}>
      <Rig />
      <GameSky top="#1ea5e9" bottom="#bae6fd" />
      <ambientLight intensity={0.8} />
      <directionalLight position={[12, 20, 8]} intensity={1.2} castShadow />
      <pointLight position={[-12, 10, -8]} intensity={60} color="#a855f7" />
      <pointLight position={[12, 10, 8]} intensity={60} color="#22d3ee" />
      <Clouds count={16} />
      <CityScape y={-24} />
      <Ground color="#16a34a" />
      <FloatingParticles count={80} color="#ffffff" />
      <CheckeredRing radius={3.6} />

      {/* KART ARENA */}
      <Location position={[-14, 0, -2]} hovered={hovered} index={0}>
        <group position={[0, -1, 0]} onClick={() => onPick(0)}>
          <Kart body="#ef4444" accent="#0ea5e9" spin />
        </group>
      </Location>

      {/* MINI GAME ARCADE */}
      <Location position={[14, 0, -2]} hovered={hovered} index={1}>
        <mesh position={[0, 1.5, 0]} onClick={() => onPick(1)}>
          <boxGeometry args={[3, 3, 0.4]} />
          <meshStandardMaterial color={hovered === 1 ? "#22d3ee" : "#0ea5e9"} emissive="#22d3ee" emissiveIntensity={hovered === 1 ? 0.8 : 0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0.25]}><planeGeometry args={[2.4, 2.4]} /><meshStandardMaterial color="#0b1120" /></mesh>
      </Location>

      {/* CHALLENGE TOWER */}
      <Location position={[0, 0, -22]} hovered={hovered} index={2}>
        <mesh position={[0, 2, 0]} onClick={() => onPick(2)}><boxGeometry args={[2.4, 8, 2.4]} /><meshStandardMaterial color="#7c3aed" /></mesh>
        <mesh position={[0, 7, 0]}><octahedronGeometry args={[1.2, 0]} /><meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.6} /></mesh>
      </Location>

      {/* FEEDBACK STATION */}
      <Location position={[0, 0, 12]} hovered={hovered} index={3}>
        <group position={[0, -1, 0]} onClick={() => onPick(3)}>
          <Hero config={HEROES[6]} />
        </group>
        <Flag position={[2, -1.4, 0]} color="#ec4899" />
      </Location>
    </Canvas>
  );
}
