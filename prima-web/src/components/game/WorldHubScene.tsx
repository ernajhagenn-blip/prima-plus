"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CityBuilding({
  position,
  color,
  height,
  width,
}: {
  position: [number, number, number];
  color: string;
  height: number;
  width: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, height + 0.1, 0]}>
        <boxGeometry args={[width * 0.6, 0.2, width * 0.6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.25, 0]}>
        <coneGeometry args={[width * 0.35, 0.5, 4]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  );
}

function CityGrid() {
  const buildings = useMemo(
    () => [
      { pos: [-3, 0, -2] as [number, number, number], color: "#EF5350", h: 3, w: 1 },
      { pos: [-1.5, 0, -2.5] as [number, number, number], color: "#42A5F5", h: 4, w: 0.9 },
      { pos: [0, 0, -2] as [number, number, number], color: "#66BB6A", h: 2.5, w: 1.1 },
      { pos: [1.5, 0, -2.5] as [number, number, number], color: "#FFA726", h: 3.5, w: 1 },
      { pos: [3, 0, -2] as [number, number, number], color: "#AB47BC", h: 3.8, w: 1 },
      { pos: [-3.5, 0, -4] as [number, number, number], color: "#26C6DA", h: 2.8, w: 0.9 },
      { pos: [-2, 0, -4.5] as [number, number, number], color: "#FFEE58", h: 3.2, w: 1.1 },
      { pos: [-0.5, 0, -4] as [number, number, number], color: "#EC407A", h: 4.5, w: 1 },
      { pos: [1, 0, -4.5] as [number, number, number], color: "#5C6BC0", h: 3, w: 0.9 },
      { pos: [2.5, 0, -4] as [number, number, number], color: "#FF7043", h: 3.6, w: 1 },
      { pos: [4, 0, -4.5] as [number, number, number], color: "#29B6F6", h: 2.9, w: 1 },
      { pos: [-4, 0, -6] as [number, number, number], color: "#9CCC65", h: 2.2, w: 1.2 },
      { pos: [-2.5, 0, -6.5] as [number, number, number], color: "#FFCA28", h: 3, w: 1 },
      { pos: [-1, 0, -6] as [number, number, number], color: "#8D6E63", h: 2.6, w: 0.9 },
      { pos: [0.5, 0, -6.5] as [number, number, number], color: "#4DB6AC", h: 3.4, w: 1 },
      { pos: [2, 0, -6] as [number, number, number], color: "#F06292", h: 2.8, w: 1.1 },
      { pos: [3.5, 0, -6.5] as [number, number, number], color: "#7E57C2", h: 3.2, w: 0.9 },
      { pos: [5, 0, -6] as [number, number, number], color: "#42A5F5", h: 2.5, w: 1 },
    ],
    [],
  );

  return (
    <group>
      {buildings.map((b, i) => (
        <CityBuilding key={i} position={b.pos} color={b.color} height={b.h} width={b.w} />
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#66BB6A" roughness={0.8} />
    </mesh>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.05 + Math.random() * 0.08, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 12) ref.current.position.x = -12;
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[0.8, 0.2, 0]}>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[-0.7, 0.15, 0]}>
        <sphereGeometry args={[0.65, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
    </group>
  );
}

function CameraOrbit() {
  const ref = useRef({ angle: 0 });

  useFrame((state, delta) => {
    ref.current.angle += 0.15 * delta;
    const a = ref.current.angle;
    const r = 10;
    state.camera.position.x = Math.sin(a) * r;
    state.camera.position.z = Math.cos(a) * r;
    state.camera.position.y = 5;
    state.camera.lookAt(0, 1, -3);
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 5]} intensity={1.1} color="#fff8e1" />
      <directionalLight position={[-5, 8, -3]} intensity={0.3} color="#bbdefb" />
      <fog attach="fog" args={["#87CEEB", 10, 25]} />
      <CameraOrbit />
      <Ground />
      <CityGrid />
      <Cloud position={[-5, 7, -6]} />
      <Cloud position={[3, 8, -9]} />
      <Cloud position={[7, 6.5, -5]} />
      <Cloud position={[-2, 9, -8]} />
    </>
  );
}

export default function WorldHubScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [10, 5, 0], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E8F5E9 100%)" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
