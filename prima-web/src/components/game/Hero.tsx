"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface HeroConfig {
  key: string;
  name: string;
  body: string;
  accent: string;
  skin?: string;
  hat: "cap" | "none" | "crown" | "beanie" | "band";
  item: "none" | "flag" | "phone" | "book" | "star" | "mic";
  trait: string;
}

export const HEROES: HeroConfig[] = [
  { key: "NARA", name: "NARA", body: "#173B8F", accent: "#19BFEA", skin: "#f1c9a5", hat: "none", item: "book", trait: "Tenang, suka nanya 'kenapa sih?', nggak suka nggurui." },
  { key: "RAGA", name: "RAGA", body: "#FF8A2A", accent: "#FFD62E", skin: "#e8b894", hat: "cap", item: "phone", trait: "Cepat ngegas ikut tren, hobi scroll sampai lupa waktu." },
  { key: "KIRA", name: "KIRA", body: "#E83E9F", accent: "#8B5CF6", skin: "#f1c9a5", hat: "cap", item: "mic", trait: "Kreator, peduli audiens, pilih kata sesuai yang nonton." },
  { key: "BIMO", name: "BIMO", body: "#74D43B", accent: "#101A3A", skin: "#d9a06b", hat: "crown", item: "star", trait: "Pecinta budaya, bangga pakai bahasa daerah sendiri." },
  { key: "ALYA", name: "ALYA", body: "#19BFEA", accent: "#173B8F", skin: "#e8b894", hat: "band", item: "none", trait: "Praktis, tau kapan harus formal kapan santai." },
  { key: "DAVA", name: "DAVA", body: "#FF4D4D", accent: "#FFD62E", skin: "#f1c9a5", hat: "cap", item: "flag", trait: "Berani, suka komunitas, nggak takut beda." },
  { key: "MIRA", name: "MIRA", body: "#8B5CF6", accent: "#173B8F", skin: "#e8b894", hat: "none", item: "book", trait: "Analitis, suka debat ide, tantang asumsi." },
  { key: "SENA", name: "SENA", body: "#FFD62E", accent: "#E83E9F", skin: "#d9a06b", hat: "band", item: "none", trait: "Praktis, peka konteks, milih bahasa sesuai situasi." },
];

export function Hero({
  config,
  idle = true,
  walk = false,
}: {
  config: HeroConfig;
  idle?: boolean;
  walk?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(Math.random() * 10);
  useFrame((s, dt) => {
    if (!ref.current) return;
    phase.current += dt;
    if (idle) ref.current.position.y = Math.sin(phase.current * 2) * 0.06;
    if (walk) ref.current.position.z = Math.sin(phase.current * 6) * 0.15;
    ref.current.rotation.y = idle ? Math.sin(phase.current * 0.6) * 0.25 : 0;
  });

  const skin = config.skin ?? "#f1c9a5";
  return (
    <group ref={ref}>
      {/* legs */}
      <mesh position={[-0.18, -0.95, 0]}><cylinderGeometry args={[0.13, 0.13, 0.5, 10]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[0.18, -0.95, 0]}><cylinderGeometry args={[0.13, 0.13, 0.5, 10]} /><meshStandardMaterial color="#1e293b" /></mesh>
      {/* body */}
      <mesh position={[0, -0.35, 0]} castShadow><boxGeometry args={[0.6, 0.7, 0.35]} /><meshStandardMaterial color={config.body} /></mesh>
      <mesh position={[0, -0.35, 0.18]}><boxGeometry args={[0.4, 0.5, 0.05]} /><meshStandardMaterial color={config.accent} /></mesh>
      {/* arms */}
      <mesh position={[-0.4, -0.35, 0]}><cylinderGeometry args={[0.09, 0.09, 0.6, 8]} /><meshStandardMaterial color={config.body} /></mesh>
      <mesh position={[0.4, -0.35, 0]}><cylinderGeometry args={[0.09, 0.09, 0.6, 8]} /><meshStandardMaterial color={config.body} /></mesh>
      {/* head */}
      <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.32, 24, 24]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.12, 0.34, 0.27]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[0.12, 0.34, 0.27]}><sphereGeometry args={[0.05, 10, 10]} /><meshStandardMaterial color="#0f172a" /></mesh>
      {/* hat */}
      {config.hat === "cap" && (
        <mesh position={[0, 0.55, 0]}><sphereGeometry args={[0.34, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={config.accent} /></mesh>
      )}
      {config.hat === "beanie" && (
        <mesh position={[0, 0.5, 0]}><sphereGeometry args={[0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={config.accent} /></mesh>
      )}
      {config.hat === "crown" && (
        <mesh position={[0, 0.6, 0]}><coneGeometry args={[0.3, 0.3, 6]} /><meshStandardMaterial color="#facc15" metalness={0.5} /></mesh>
      )}
      {config.hat === "band" && (
        <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.32, 0.06, 8, 24]} /><meshStandardMaterial color={config.accent} /></mesh>
      )}
      {/* item */}
      {config.item === "flag" && (
        <mesh position={[0.45, 0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 1, 8]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      )}
      {config.item === "phone" && (
        <mesh position={[0.45, -0.1, 0.1]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.12, 0.22, 0.04]} /><meshStandardMaterial color="#0f172a" /></mesh>
      )}
      {config.item === "book" && (
        <mesh position={[0.45, -0.1, 0.1]} rotation={[0, 0, -0.4]}><boxGeometry args={[0.05, 0.3, 0.22]} /><meshStandardMaterial color={config.accent} /></mesh>
      )}
      {config.item === "star" && (
        <mesh position={[0.45, 0.1, 0.1]} rotation={[0, 0, 0]}><octahedronGeometry args={[0.16, 0]} /><meshStandardMaterial color="#facc15" emissive="#f59e0b" emissiveIntensity={0.5} /></mesh>
      )}
      {config.item === "mic" && (
        <mesh position={[0.45, 0.0, 0.1]} rotation={[0.4, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.35, 10]} /><meshStandardMaterial color="#0f172a" /></mesh>
      )}
    </group>
  );
}
