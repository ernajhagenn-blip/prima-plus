"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ChatBubble({
  position,
  color,
  width,
  height,
  delay,
}: {
  position: [number, number, number];
  color: string;
  width: number;
  height: number;
  delay: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  const startY = position[1];

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + delay;
    ref.current.position.y = startY + Math.sin(t * 0.8) * 0.3;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, height, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} opacity={0.85} transparent />
      </mesh>
      <mesh position={[0, -height / 2 - 0.12, 0]}>
        <coneGeometry args={[0.15, 0.25, 3]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} opacity={0.85} transparent />
      </mesh>
      <mesh position={[-width * 0.2, 0, 0.1]}>
        <boxGeometry args={[width * 0.5, height * 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
      <mesh position={[-width * 0.2, -height * 0.2, 0.1]}>
        <boxGeometry args={[width * 0.35, height * 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" opacity={0.4} transparent />
      </mesh>
    </group>
  );
}

function FloatingStars() {
  const ref = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 3 + Math.random() * 2;
        const y = (Math.random() - 0.5) * 4;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
            <octahedronGeometry args={[0.04 + Math.random() * 0.04, 0]} />
            <meshStandardMaterial
              color="#FFD54F"
              emissive="#FFD54F"
              emissiveIntensity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene() {
  const bubbles = useMemo(
    () => [
      { pos: [-2.5, 1.5, -1] as [number, number, number], color: "#FF8A2A", w: 1.8, h: 0.8, d: 0 },
      { pos: [2, 0.5, -0.5] as [number, number, number], color: "#E83E9F", w: 1.6, h: 0.7, d: 0.5 },
      { pos: [-1, -0.5, -1.5] as [number, number, number], color: "#19BFEA", w: 2, h: 0.9, d: 1 },
      { pos: [1.5, 2, -2] as [number, number, number], color: "#173B8F", w: 1.4, h: 0.6, d: 1.5 },
      { pos: [-2, -1.5, -0.8] as [number, number, number], color: "#66BB6A", w: 1.5, h: 0.7, d: 2 },
      { pos: [2.5, -1, -1.8] as [number, number, number], color: "#FFCA28", w: 1.7, h: 0.75, d: 2.5 },
    ],
    [],
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#fff8e1" />
      <pointLight position={[-4, 3, -2]} intensity={0.3} color="#FF8A2A" />
      <pointLight position={[4, 3, -2]} intensity={0.3} color="#E83E9F" />
      <fog attach="fog" args={["#B3E5FC", 5, 12]} />
      {bubbles.map((b, i) => (
        <ChatBubble key={i} position={b.pos} color={b.color} width={b.w} height={b.h} delay={b.d} />
      ))}
      <FloatingStars />
    </>
  );
}

export default function HookScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E1F5FE 100%)" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
