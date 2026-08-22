"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Kart({
  body = "#ef4444",
  accent = "#0ea5e9",
  spin = false,
}: {
  body?: string;
  accent?: string;
  spin?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin && ref.current) ref.current.rotation.y += dt * 0.6;
  });
  const Wheel = ({ x, z }: { x: number; z: number }) => (
    <group position={[x, 0.1, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh><cylinderGeometry args={[0.24, 0.24, 0.18, 18]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh><cylinderGeometry args={[0.1, 0.1, 0.2, 12]} /><meshStandardMaterial color={accent} /></mesh>
    </group>
  );
  return (
    <group ref={ref}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.1, 0.4, 1.8]} />
        <meshStandardMaterial color={body} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.62, 0.1]}>
        <boxGeometry args={[0.8, 0.42, 0.7]} />
        <meshStandardMaterial color={accent} metalness={0.3} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.55, 0.95]}>
        <boxGeometry args={[0.7, 0.18, 0.2]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Wheel x={-0.5} z={0.7} />
      <Wheel x={0.5} z={0.7} />
      <Wheel x={-0.5} z={-0.7} />
      <Wheel x={0.5} z={-0.7} />
    </group>
  );
}
