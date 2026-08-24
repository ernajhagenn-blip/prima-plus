"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function KartModel({ body, accent }: { body: string; accent: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.7 * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[1.2, 0.35, 0.7]} />
        <meshStandardMaterial color={body} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.6, 0.25, 0.6]} />
        <meshStandardMaterial color={body} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.55, -0.05]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial color={accent} roughness={0.4} metalness={0.3} />
      </mesh>
      {[[-0.45, 0, -0.4], [0.45, 0, -0.4], [-0.45, 0, 0.4], [0.45, 0, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#333333" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.55, 0.15, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.55, 0.15, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#FFEE58" emissive="#FFEE58" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function Platform({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.4 * delta;
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <cylinderGeometry args={[1, 1.1, 0.15, 32]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
    </mesh>
  );
}

function Sparkles({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 1.5 * delta;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const r = 1.4;
        const y = (Math.random() - 0.5) * 0.6;
        return (
          <mesh key={i} position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene({ body, accent }: { body: string; accent: string }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.1} color="#fff8e1" />
      <pointLight position={[-3, 4, -3]} intensity={0.4} color="#bbdefb" />
      <fog attach="fog" args={["#B3E5FC", 6, 14]} />
      <Platform color={accent} />
      <KartModel body={body} accent={accent} />
      <Sparkles color={accent} />
    </>
  );
}

export default function KartScene({ body, accent }: { body: string; accent: string }) {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 2, 4.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 40%, #B3E5FC 70%, #E1F5FE 100%)" }}
      >
        <Scene body={body} accent={accent} />
      </Canvas>
    </div>
  );
}
