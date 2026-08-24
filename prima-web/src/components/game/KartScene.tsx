"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import type * as THREE from "three";
import { GameSky, Ground, FloatingParticles } from "./PrimaBits";
import { Kart } from "./Kart";
import { KartConfig } from "./karts";

function Spinner({
  config,
  dragRef,
}: {
  config: KartConfig;
  dragRef: React.MutableRefObject<{ dragging: boolean; lastX: number; velocity: number }>;
}) {
  const ref = useRef<THREE.Group>(null);
  const angleRef = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const d = dragRef.current;
    if (d.dragging) {
      angleRef.current += d.velocity * dt * 8;
      d.velocity *= 0.92;
    } else {
      angleRef.current += dt * 0.4;
      d.velocity *= 0.95;
    }
    ref.current.rotation.y = angleRef.current;
  });

  return (
    <group ref={ref} position={[0, -1, 0]} scale={1.3}>
      <Kart body={config.body} accent={config.accent} />
    </group>
  );
}

export default function KartScene({
  config,
  interactive = false,
}: {
  config: KartConfig;
  interactive?: boolean;
}) {
  const dragRef = useRef({ dragging: false, lastX: 0, velocity: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      dragRef.current.dragging = true;
      dragRef.current.lastX = e.clientX;
      dragRef.current.velocity = 0;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [interactive]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive || !dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.lastX;
      dragRef.current.velocity = dx * 0.3;
      dragRef.current.lastX = e.clientX;
    },
    [interactive]
  );

  const onPointerUp = useCallback(() => {
    dragRef.current.dragging = false;
  }, []);

  return (
    <div
      className="h-full w-full"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "none", cursor: interactive ? "grab" : undefined }}
    >
      <Canvas shadows camera={{ position: [0, 3, 8], fov: 45 }}>
        <GameSky top="#87CEEB" bottom="#E0F7FA" />
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 14, 6]} intensity={1.4} />
        <pointLight position={[-8, 6, 4]} intensity={50} color={config.body} />
        <pointLight position={[8, 6, -4]} intensity={50} color={config.accent} />
        <Ground color="#16a34a" />
        <FloatingParticles count={30} color={config.trail} />
        <mesh position={[0, -1.55, 0]}>
          <cylinderGeometry args={[3, 3.4, 0.5, 32]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, -1.25, 0]}>
          <cylinderGeometry args={[2.8, 2.8, 0.1, 32]} />
          <meshStandardMaterial color={config.accent} emissive={config.accent} emissiveIntensity={0.3} />
        </mesh>
        <Spinner config={config} dragRef={dragRef} />
      </Canvas>
    </div>
  );
}
