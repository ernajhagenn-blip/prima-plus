"use client";

import { useRef } from "react";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { GameSky, Clouds, CityScape, Ground, FloatingParticles, Ramp } from "./PrimaBits";
import { Kart } from "./Kart";
import { Hero, HEROES } from "./Hero";

function Rig({ onReady }: { onReady: () => void }) {
  const { camera } = useThree();
  const kart = useRef<THREE.Group>(null);
  const t = useRef(0);
  const ready = useRef(false);

  useFrame((_, dt) => {
    if (ready.current) return;
    t.current += dt;
    const T = t.current;
    const drive = Math.min(T / 2.6, 1);
    const z = 30 - drive * 34;
    let y = 0;
    if (T > 2.4 && T < 3.2) {
      const p = (T - 2.4) / 0.8;
      y = Math.sin(p * Math.PI) * 3.2;
    }
    if (kart.current) {
      kart.current.position.set(0, y, z);
      kart.current.rotation.y = Math.sin(T * 2) * 0.1;
    }
    if (T < 2.4) {
      camera.position.lerp(new THREE.Vector3(0, 8, 26), 0.05);
      camera.lookAt(0, 1, z);
    } else if (T < 3.4) {
      const a = (T - 2.4) * 1.6;
      camera.position.set(Math.sin(a) * 9, 5, z + Math.cos(a) * 9);
      camera.lookAt(0, 1.5, z);
    } else {
      camera.position.lerp(new THREE.Vector3(0, 3.2, 12), 0.06);
      camera.lookAt(0, 1, -2);
      if (T > 4.2 && !ready.current) {
        ready.current = true;
        onReady();
      }
    }
  });

  return (
    <group ref={kart}>
      <Kart body="#ef4444" accent="#0ea5e9" />
    </group>
  );
}

export default function OpeningScene({ onReady }: { onReady: () => void }) {
  return (
    <Canvas shadows camera={{ position: [0, 8, 26], fov: 50 }}>
      <GameSky top="#1ea5e9" bottom="#a5f3fc" />
      <ambientLight intensity={0.8} />
      <directionalLight position={[12, 20, 8]} intensity={1.3} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={60} color="#a855f7" />
      <pointLight position={[10, 10, 10]} intensity={60} color="#22d3ee" />
      <Clouds />
      <CityScape />
      <Ground color="#22c55e" />
      <FloatingParticles count={70} color="#ffffff" />
      <Rig onReady={onReady} />
      <group position={[2.4, -1.6, -3]}>
        <Hero config={HEROES[1]} />
      </group>
      <group position={[-2.4, -1.6, -2.4]}>
        <Hero config={HEROES[2]} />
      </group>
      <group position={[3.2, -1.6, -2]}>
        <Hero config={HEROES[4]} />
      </group>
      <Ramp position={[0, -1.6, 2]} rotation={[0.5, 0, 0]} />
    </Canvas>
  );
}
