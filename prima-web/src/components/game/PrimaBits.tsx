"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function GameSky({ top = "#1ea5e9", bottom = "#a5f3fc" }: { top?: string; bottom?: string }) {
  return (
    <>
      <color attach="background" args={[top]} />
      <fog attach="fog" args={[top, 60, 220]} />
      <mesh position={[0, 60, -120]}>
        <sphereGeometry args={[40, 24, 24]} />
        <meshBasicMaterial color="#fde68a" />
      </mesh>
    </>
  );
}

export function Clouds({ count = 14 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.x += dt * 0.6;
    if (ref.current && ref.current.position.x > 40) ref.current.position.x = -40;
  });
  const puffs = Array.from({ length: count });
  return (
    <group ref={ref}>
      {puffs.map((_, i) => {
        const x = (i / count) * 90 - 45;
        const y = 14 + (i % 3) * 6;
        const z = -30 - (i % 4) * 10;
        const s = 2 + (i % 3);
        return (
          <group key={i} position={[x, y, z]}>
            <mesh position={[0, 0, 0]}><sphereGeometry args={[s, 12, 12]} /><meshStandardMaterial color="#ffffff" roughness={1} /></mesh>
            <mesh position={[s, -0.3, 0]}><sphereGeometry args={[s * 0.8, 12, 12]} /><meshStandardMaterial color="#f1f5f9" roughness={1} /></mesh>
            <mesh position={[-s, -0.3, 0]}><sphereGeometry args={[s * 0.8, 12, 12]} /><meshStandardMaterial color="#f1f5f9" roughness={1} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

export function CityScape({ y = -22 }: { y?: number }) {
  const palette = ["#ef4444", "#f59e0b", "#22d3ee", "#a855f7", "#34d399", "#fb7185", "#facc15", "#38bdf8"];
  const buildings = Array.from({ length: 40 });
  return (
    <group position={[0, y, -70]}>
      {buildings.map((_, i) => {
        const x = (i % 10) * 14 - 63;
        const z = -Math.floor(i / 10) * 16;
        const h = 8 + ((i * 37) % 18);
        const w = 6 + ((i * 13) % 4);
        return (
          <mesh key={i} position={[x, h / 2, z]}>
            <boxGeometry args={[w, h, w]} />
            <meshStandardMaterial color={palette[i % palette.length]} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Ground({ color = "#22c55e" }: { color?: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export function FloatingParticles({ count = 60, color = "#ffffff" }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 80;
    arr[i * 3 + 1] = Math.random() * 40 - 5;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[arr, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.4} transparent opacity={0.7} />
    </points>
  );
}

export function Flag({ position = [0, 0, 0], color = "#ef4444" }: { position?: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}><cylinderGeometry args={[0.12, 0.12, 4, 8]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[0.9, 3.2, 0]}><boxGeometry args={[1.8, 1.2, 0.05]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  );
}

export function Ramp({ position = [0, 0, 0], rotation = [0, 0, 0] }: { position?: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[6, 0.5, 4]} />
      <meshStandardMaterial color="#facc15" />
    </mesh>
  );
}

export function CheckeredRing({ radius = 30 }: { radius?: number }) {
  const tiles = Array.from({ length: 48 });
  return (
    <group position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {tiles.map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        const c = i % 2 ? "#111827" : "#f8fafc";
        return (
          <mesh key={i} position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]} rotation={[0, -a, 0]}>
            <boxGeometry args={[4, 0.1, 4]} />
            <meshStandardMaterial color={c} />
          </mesh>
        );
      })}
    </group>
  );
}
