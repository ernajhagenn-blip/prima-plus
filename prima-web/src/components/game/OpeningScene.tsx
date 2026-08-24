"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.08 + Math.random() * 0.12, []);
  const startX = position[0];

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 18) ref.current.position.x = -18;
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[1, 0.3, 0]}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[-0.9, 0.2, 0]}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[0.4, 0.5, 0]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#f8f8ff" roughness={1} />
      </mesh>
    </group>
  );
}

function Building({
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
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width * 0.5, 0.3, width * 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
    </group>
  );
}

function City() {
  const buildings = useMemo(
    () => [
      { pos: [-4, 0, -2] as [number, number, number], color: "#EF5350", h: 3.5, w: 1.2 },
      { pos: [-2.5, 0, -1.5] as [number, number, number], color: "#42A5F5", h: 4.5, w: 1 },
      { pos: [-1, 0, -2.5] as [number, number, number], color: "#66BB6A", h: 3, w: 1.3 },
      { pos: [0.5, 0, -1.8] as [number, number, number], color: "#FFA726", h: 5, w: 1.1 },
      { pos: [2, 0, -2.2] as [number, number, number], color: "#AB47BC", h: 3.8, w: 1.2 },
      { pos: [3.5, 0, -1.5] as [number, number, number], color: "#26C6DA", h: 4.2, w: 1 },
      { pos: [5, 0, -2] as [number, number, number], color: "#FFEE58", h: 3.2, w: 1.3 },
      { pos: [-5.5, 0, -3] as [number, number, number], color: "#EC407A", h: 2.8, w: 1 },
      { pos: [-3.5, 0, -3.5] as [number, number, number], color: "#5C6BC0", h: 4, w: 0.9 },
      { pos: [1, 0, -3.5] as [number, number, number], color: "#4CAF50", h: 3.5, w: 1.1 },
      { pos: [4.5, 0, -3.5] as [number, number, number], color: "#FF7043", h: 4.8, w: 1 },
      { pos: [6, 0, -3] as [number, number, number], color: "#29B6F6", h: 3, w: 1.2 },
      { pos: [-6, 0, -4] as [number, number, number], color: "#9CCC65", h: 2.5, w: 1.4 },
      { pos: [0, 0, -4.5] as [number, number, number], color: "#FFCA28", h: 5.5, w: 1.3 },
      { pos: [3, 0, -4.5] as [number, number, number], color: "#8D6E63", h: 3.3, w: 1 },
    ],
    [],
  );

  return (
    <group>
      {buildings.map((b, i) => (
        <Building key={i} position={b.pos} color={b.color} height={b.h} width={b.w} />
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#66BB6A" roughness={0.8} />
    </mesh>
  );
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
      <planeGeometry args={[3, 12]} />
      <meshStandardMaterial color="#78909C" roughness={0.6} />
    </mesh>
  );
}

function CameraFly() {
  const ref = useRef({ z: 16, y: 6, targetZ: 3 });
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state, delta) => {
    const r = ref.current;
    if (r.z > r.targetZ) {
      r.z -= 4 * delta;
      r.y = 6 + (r.z - r.targetZ) * 0.5;
    }
    if (groupRef.current) {
      groupRef.current.position.z = r.z;
      groupRef.current.position.y = r.y;
      groupRef.current.lookAt(0, 2, -2);
      state.camera.position.copy(groupRef.current.position);
      state.camera.lookAt(0, 2, -2);
    }
  });

  return <group ref={groupRef} position={[0, 6, 16]} />;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 5]} intensity={1.2} color="#fff8e1" />
      <directionalLight position={[-5, 8, -3]} intensity={0.4} color="#bbdefb" />
      <fog attach="fog" args={["#87CEEB", 12, 30]} />
      <CameraFly />
      <Ground />
      <Road />
      <City />
      <Cloud position={[-6, 7, -5]} />
      <Cloud position={[2, 8, -8]} />
      <Cloud position={[8, 6.5, -4]} />
      <Cloud position={[-3, 9, -10]} />
      <Cloud position={[5, 7.5, -7]} />
    </>
  );
}

export default function OpeningScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 6, 16], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #4FC3F7 0%, #81D4FA 30%, #B3E5FC 60%, #E1F5FE 100%)" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
