"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CharacterBody({ color, accent }: { color: string; accent: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.8 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <torusGeometry args={[0.45, 0.08, 8, 24]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshStandardMaterial color={accent} roughness={0.5} opacity={0.6} transparent />
      </mesh>
    </group>
  );
}

function Platform() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.3 * delta;
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <cylinderGeometry args={[0.8, 1, 0.15, 32]} />
      <meshStandardMaterial color="#FFD54F" roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

function ParticleRing({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 1.2 * delta;
      ref.current.rotation.x += 0.3 * delta;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 1.2;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, 0.3, Math.sin(angle) * r]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function NeonBuilding({ position, color, height }: { position: [number, number, number]; color: string; height: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.15;
  });
  return (
    <mesh ref={ref} position={[position[0], height / 2, position[2]]} castShadow>
      <boxGeometry args={[0.6, height, 0.6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

function TrackLine() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
      {/* Circuit road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, 0]} receiveShadow>
        <planeGeometry args={[4, 40]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Kerb left - neon */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`kl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2.1, -1.47, -18 + i * 2.5]}>
          <planeGeometry args={[0.12, 2]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#ef4444" : "#ffffff"} emissive={i % 2 === 0 ? "#ef4444" : "#ffffff"} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Kerb right - neon */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`kr-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[2.1, -1.47, -18 + i * 2.5]}>
          <planeGeometry args={[0.12, 2]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#3b82f6" : "#ffffff"} emissive={i % 2 === 0 ? "#3b82f6" : "#ffffff"} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Center dashed line */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`cl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.46, -16 + i * 3]}>
          <planeGeometry args={[0.08, 1.5]} />
          <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function DarkCloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.04 + Math.random() * 0.03, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 14) ref.current.position.x = -14;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>
      <mesh position={[-0.4, 0.08, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={1} />
      </mesh>
    </group>
  );
}

function FloatingStar({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 2) * 0.3;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3 + position[0]) * 0.3;
  });
  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
    </mesh>
  );
}

function Scene({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#c7d2fe" />
      <pointLight position={[-3, 4, -3]} intensity={0.6} color={accent} />
      <pointLight position={[3, 2, 2]} intensity={0.3} color="#facc15" />
      <fog attach="fog" args={["#0b0d22", 8, 20]} />

      <TrackLine />

      {/* Neon buildings */}
      <NeonBuilding position={[-4, 0, -6]} color="#ef4444" height={3} />
      <NeonBuilding position={[-3, 0, -8]} color="#3b82f6" height={4.5} />
      <NeonBuilding position={[-5, 0, -10]} color="#a855f7" height={2.5} />
      <NeonBuilding position={[4, 0, -5]} color="#22d3ee" height={3.5} />
      <NeonBuilding position={[3.5, 0, -9]} color="#f97316" height={4} />
      <NeonBuilding position={[5, 0, -12]} color="#ec4899" height={2.8} />
      <NeonBuilding position={[-3.5, 0, -14]} color="#4ade80" height={3.2} />
      <NeonBuilding position={[4.5, 0, -15]} color="#facc15" height={3.8} />

      {/* Floating stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingStar
          key={i}
          position={[
            -8 + Math.random() * 16,
            2 + Math.random() * 6,
            -18 + Math.random() * 14,
          ]}
        />
      ))}

      {/* Dark clouds */}
      <DarkCloud position={[-6, 5, -10]} />
      <DarkCloud position={[4, 6, -12]} />
      <DarkCloud position={[0, 5.5, -8]} />

      <Platform />
      <CharacterBody color={color} accent={accent} />
      <ParticleRing color={accent} />
    </>
  );
}

export default function SelectScene({ color, accent }: { color: string; accent: string }) {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #0b0d22 0%, #1e1b4b 40%, #312e81 100%)" }}
      >
        <Scene color={color} accent={accent} />
      </Canvas>
    </div>
  );
}
