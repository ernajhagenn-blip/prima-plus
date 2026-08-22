"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Stars, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Kart() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group ref={ref} position={[0, -0.4, 0]}>
      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[1.1, 0.4, 1.8]} />
        <meshStandardMaterial color="#ff5a5f" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[0.8, 0.4, 0.7]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.2} />
      </mesh>
      {[
        [-0.5, 0.1, 0.7],
        [0.5, 0.1, 0.7],
        [-0.5, 0.1, -0.7],
        [0.5, 0.1, -0.7],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 20]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
    </group>
  );
}

function Symbol({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <mesh position={position}>
        <torusGeometry args={[0.32, 0.1, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
    </Float>
  );
}

const SYMBOLS = [
  { p: [-3.2, 1.4, -2] as [number, number, number], c: "#22d3ee" },
  { p: [-1.2, 2.2, -1] as [number, number, number], c: "#a855f7" },
  { p: [1.0, 1.8, -2.5] as [number, number, number], c: "#fb923c" },
  { p: [3.0, 1.0, -1.5] as [number, number, number], c: "#f472b6" },
  { p: [0.2, 0.4, -3] as [number, number, number], c: "#38bdf8" },
  { p: [-2.4, 0.2, -2.5] as [number, number, number], c: "#facc15" },
];

export default function PrimaOpening() {
  return (
    <Canvas shadows camera={{ position: [0, 1, 6], fov: 50 }} className="!fixed inset-0">
      <color attach="background" args={["#0a0f2c"]} />
      <fog attach="fog" args={["#0a0f2c", 6, 16]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-4, 2, 3]} intensity={30} color="#a855f7" />
      <pointLight position={[4, -1, 2]} intensity={20} color="#fb923c" />
      <Stars radius={40} depth={30} count={1200} factor={3} saturation={0} fade speed={1} />
      <Kart />
      {SYMBOLS.map((s, i) => (
        <Symbol key={i} position={s.p} color={s.c} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
}
