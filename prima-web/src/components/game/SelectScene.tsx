"use client";

import { useRef } from "react";
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

function Scene({ color, accent }: { color: string; accent: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#fff8e1" />
      <pointLight position={[-3, 4, -3]} intensity={0.4} color="#bbdefb" />
      <fog attach="fog" args={["#B3E5FC", 6, 14]} />
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
        style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 40%, #B3E5FC 70%, #E1F5FE 100%)" }}
      >
        <Scene color={color} accent={accent} />
      </Canvas>
    </div>
  );
}
