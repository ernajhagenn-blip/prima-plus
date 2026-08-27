"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Ground() {
  return (
    <group>
      {/* Grass — brighter green */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#4caf50" roughness={0.85} />
      </mesh>
      {/* Asphalt track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[5.5, 70]} />
        <meshStandardMaterial color="#37474f" roughness={0.65} />
      </mesh>
      {/* Center line — dashed white */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -32 + i * 2.8]}>
          <planeGeometry args={[0.12, 1.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      ))}
      {/* Left kerb — red white */}
      {Array.from({ length: 35 }).map((_, i) => (
        <mesh key={`kl-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-2.85, 0.02, -35 + i * 2]}>
          <planeGeometry args={[0.25, 1.7]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#e53935" : "#ffffff"} roughness={0.5} />
        </mesh>
      ))}
      {/* Right kerb — red white */}
      {Array.from({ length: 35 }).map((_, i) => (
        <mesh key={`kr-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[2.85, 0.02, -35 + i * 2]}>
          <planeGeometry args={[0.25, 1.7]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#e53935" : "#ffffff"} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function TireStack({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 0.25, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y + 0.13, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.24, 10]} />
          <meshStandardMaterial color="#212121" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.08;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 1.1, 6]} />
        <meshStandardMaterial color="#795548" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.65, 1.1, 7]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <coneGeometry args={[0.5, 0.85, 7]} />
        <meshStandardMaterial color="#43a047" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[0.32, 0.65, 7]} />
        <meshStandardMaterial color="#66bb6a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 1.2;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.03;
  });
  return (
    <group ref={ref} position={position}>
      {/* Petals */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, 0, Math.sin(a) * 0.12]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial color="#fdd835" roughness={0.5} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.25, 4]} />
        <meshStandardMaterial color="#4caf50" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Barrier({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[0.12, 0.44, 1.6]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.35} metalness={0.15} />
      </mesh>
      {[-0.5, 0, 0.5].map((z, i) => (
        <mesh key={i} position={[0.065, 0.22, z]}>
          <boxGeometry args={[0.14, 0.44, 0.3]} />
          <meshStandardMaterial color="#e53935" roughness={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function Flag({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children[1].rotation.z = Math.sin(state.clock.elapsedTime * 3.5 + position[0] * 2) * 0.18;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 1.5, 6]} />
        <meshStandardMaterial color="#90a4ae" roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[0.28, 1.35, 0]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color={color} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Kart({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.9 + position[0] * 2) * 0.4;
    ref.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 2.5 + position[0])) * 0.04;
  });
  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[0.45, 0.22, 0.82]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.36, -0.04]}>
        <boxGeometry args={[0.36, 0.18, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.38, 0.16]}>
        <boxGeometry args={[0.32, 0.14, 0.03]} />
        <meshStandardMaterial color="#81d4fa" roughness={0.1} metalness={0.35} transparent opacity={0.7} />
      </mesh>
      {[[-0.24, 0.07, 0.28], [0.24, 0.07, 0.28], [-0.24, 0.07, -0.28], [0.24, 0.07, -0.28]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.09, 0.09, 0.07, 8]} />
          <meshStandardMaterial color="#212121" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  const speed = useMemo(() => 0.06 + Math.random() * 0.05, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += speed * delta;
    if (ref.current.position.x > 20) ref.current.position.x = -20;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.75, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[0.65, 0.12, 0]}>
        <sphereGeometry args={[0.55, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[-0.55, 0.08, 0]}>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[0.25, 0.3, 0]}>
        <sphereGeometry args={[0.42, 10, 10]} />
        <meshStandardMaterial color="#f5f5f5" roughness={1} />
      </mesh>
    </group>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <group position={[12, 14, -18]}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="#fdd835" emissive="#fdd835" emissiveIntensity={0.85} roughness={0.2} />
      </mesh>
      {/* Sun rays */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.4, Math.sin(a) * 2.4, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial color="#ffee58" emissive="#ffee58" emissiveIntensity={0.6} />
          </mesh>
        );
      })}
      <pointLight color="#fff8e1" intensity={2.5} distance={55} />
    </group>
  );
}

function Grandstand({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.8, 0.7, 1.1]} />
        <meshStandardMaterial color="#eceff1" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.2, 0.08, 1.4]} />
        <meshStandardMaterial color="#546e7a" roughness={0.35} metalness={0.2} />
      </mesh>
      {[-1.3, 0, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0.8, 0.55]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
          <meshStandardMaterial color="#90a4ae" roughness={0.45} metalness={0.25} />
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={`c${i}`} position={[-1.2 + i * 0.18, 0.82, 0]}>
          <sphereGeometry args={[0.065, 6, 6]} />
          <meshStandardMaterial
            color={["#e53935", "#1e88e5", "#43a047", "#fdd835", "#8e24aa", "#ec407a", "#ff7043", "#26c6da"][i % 8]}
            roughness={0.65}
          />
        </mesh>
      ))}
    </group>
  );
}

function Building({ position, color, height }: { position: [number, number, number]; color: string; height: number }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[0, height + 0.08, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0, height + 0.25, 0]}>
        <coneGeometry args={[0.28, 0.35, 4]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Balloon({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0] * 3) * 0.4;
    ref.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.6 + position[2]) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.15, 4]} />
        <meshStandardMaterial color="#9e9e9e" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CameraOrbit() {
  const ref = useRef({ angle: 0.2 });
  useFrame((state, delta) => {
    ref.current.angle += 0.1 * delta;
    const a = ref.current.angle;
    const r = 15;
    state.camera.position.x = Math.sin(a) * r * 0.35;
    state.camera.position.z = Math.cos(a) * r;
    state.camera.position.y = 7.5;
    state.camera.lookAt(0, 0.5, -5);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 16, 8]} intensity={1.3} color="#fff8e1" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 10, -4]} intensity={0.35} color="#bbdefb" />
      <pointLight position={[0, 3, -8]} intensity={0.4} color="#e8f5e9" />
      <fog attach="fog" args={["#87CEEB", 20, 50]} />
      <CameraOrbit />
      <Sun />
      <Ground />

      {/* Track furniture */}
      <TireStack position={[-3.5, 0, -3]} />
      <TireStack position={[-3.5, 0, -9]} />
      <TireStack position={[3.5, 0, -6]} />
      <TireStack position={[3.5, 0, -15]} />
      <TireStack position={[-3.5, 0, -19]} />
      <TireStack position={[3.5, 0, -23]} />
      <TireStack position={[-3.5, 0, -28]} />
      <TireStack position={[3.5, 0, -30]} />

      <Barrier position={[-3.1, 0, -1.5]} />
      <Barrier position={[-3.1, 0, -13]} />
      <Barrier position={[3.1, 0, -7]} />
      <Barrier position={[3.1, 0, -19]} />
      <Barrier position={[-3.1, 0, -24]} />

      {/* Trees — left side */}
      <Tree position={[-5.5, 0, -2]} />
      <Tree position={[-7, 0, -8]} scale={1.1} />
      <Tree position={[-6, 0, -16]} />
      <Tree position={[-7.5, 0, -24]} scale={0.9} />
      <Tree position={[-5, 0, -30]} />
      {/* Trees — right side */}
      <Tree position={[5.5, 0, -4]} />
      <Tree position={[6.5, 0, -12]} scale={1.15} />
      <Tree position={[6, 0, -20]} />
      <Tree position={[7.5, 0, -28]} scale={0.85} />
      <Tree position={[5, 0, -34]} />

      {/* Flowers — scattered */}
      <Flower position={[-4.5, 0.15, -5]} color="#e91e63" />
      <Flower position={[-5, 0.15, -11]} color="#ff9800" />
      <Flower position={[4.5, 0.15, -3]} color="#9c27b0" />
      <Flower position={[5, 0.15, -10]} color="#e91e63" />
      <Flower position={[-4.8, 0.15, -22]} color="#2196f3" />
      <Flower position={[4.8, 0.15, -26]} color="#ff5722" />
      <Flower position={[-4.2, 0.15, -32]} color="#e91e63" />
      <Flower position={[4.2, 0.15, -35]} color="#ffc107" />

      {/* Flags */}
      <Flag position={[-2.9, 0, -0.5]} color="#e53935" />
      <Flag position={[2.9, 0, -5]} color="#1e88e5" />
      <Flag position={[-2.9, 0, -11]} color="#43a047" />
      <Flag position={[2.9, 0, -17]} color="#fdd835" />
      <Flag position={[-2.9, 0, -23]} color="#8e24aa" />
      <Flag position={[2.9, 0, -29]} color="#ec407a" />

      {/* Karts on track */}
      <Kart position={[-0.7, 0.02, -4]} color="#e53935" />
      <Kart position={[0.7, 0.02, -11]} color="#1e88e5" />
      <Kart position={[-0.4, 0.02, -20]} color="#fdd835" />

      {/* Grandstands */}
      <Grandstand position={[-5.5, 0, -5]} />
      <Grandstand position={[5.5, 0, -15]} />

      {/* Buildings in distance */}
      <Building position={[-10, 0, -12]} color="#ef5350" height={3.2} />
      <Building position={[-9, 0, -18]} color="#42a5f5" height={4.5} />
      <Building position={[-11, 0, -25]} color="#66bb6a" height={2.8} />
      <Building position={[10, 0, -10]} color="#ab47bc" height={3.8} />
      <Building position={[9, 0, -20]} color="#ffa726" height={3.5} />
      <Building position={[11, 0, -28]} color="#26c6da" height={2.5} />

      {/* Balloons */}
      <Balloon position={[-4, 5, -6]} color="#e53935" />
      <Balloon position={[4, 6, -12]} color="#1e88e5" />
      <Balloon position={[-2, 7, -20]} color="#fdd835" />
      <Balloon position={[3, 5.5, -25]} color="#ec407a" />
      <Balloon position={[0, 6.5, -30]} color="#8e24aa" />

      {/* Clouds */}
      <Cloud position={[-9, 8.5, -10]} />
      <Cloud position={[6, 9.5, -14]} />
      <Cloud position={[11, 7, -8]} />
      <Cloud position={[-4, 10.5, -18]} />
      <Cloud position={[1, 8, -26]} />
      <Cloud position={[-7, 9, -30]} />
    </>
  );
}

export default function CircuitIntroScene() {
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [5, 7.5, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(180deg, #42a5f5 0%, #64b5f6 30%, #90caf9 50%, #bbdefb 62%, #c8e6c9 68%, #66bb6a 100%)" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
