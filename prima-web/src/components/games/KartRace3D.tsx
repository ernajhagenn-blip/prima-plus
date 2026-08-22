"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const GOOD = [
  "makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar",
  "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik",
];
const BAD = [
  "hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you", "so fun",
];

const ARENA = 26;

type Tkn = { x: number; z: number; word: string; good: boolean; taken: boolean };

function makeTokens(): Tkn[] {
  const arr: Tkn[] = [];
  for (let i = 0; i < 8; i++)
    arr.push({ x: (Math.random() * 2 - 1) * (ARENA - 4), z: (Math.random() * 2 - 1) * (ARENA - 4), word: GOOD[i % GOOD.length], good: true, taken: false });
  for (let i = 0; i < 4; i++)
    arr.push({ x: (Math.random() * 2 - 1) * (ARENA - 4), z: (Math.random() * 2 - 1) * (ARENA - 4), word: BAD[i % BAD.length], good: false, taken: false });
  return arr;
}

function Kara(props: { bob?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current && props.bob) ref.current.position.y = 0.9 + Math.sin(s.clock.elapsedTime * 3) * 0.05;
  });
  return (
    <group ref={ref} position={[0, 0.9, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#f1c9a5" />
      </mesh>
      <mesh position={[0, 0.05, 0.18]}>
        <boxGeometry args={[0.4, 0.18, 0.18]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.35]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    </group>
  );
}

function Kart({ body = "#ef4444", accent = "#0ea5e9" }: { body?: string; accent?: string }) {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.1, 0.4, 1.8]} />
        <meshStandardMaterial color={body} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[0.8, 0.4, 0.7]} />
        <meshStandardMaterial color={accent} metalness={0.2} roughness={0.3} />
      </mesh>
      {[[-0.5, 0.1, 0.7], [0.5, 0.1, 0.7], [-0.5, 0.1, -0.7], [0.5, 0.1, -0.7]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 18]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
      <Kara bob />
    </group>
  );
}

function TrackTokens({ tokens, taken }: { tokens: Tkn[]; taken: React.MutableRefObject<boolean[]> }) {
  return (
    <>
      {tokens.map((t, i) =>
        taken.current[i] ? null : (
          <mesh key={i} position={[t.x, 0.8, t.z]}>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color={t.good ? "#22d3ee" : "#fb7185"} emissive={t.good ? "#0891b2" : "#be123c"} emissiveIntensity={0.5} />
          </mesh>
        )
      )}
    </>
  );
}

function Scene({
  onScore, onTime, onComplete, kartBody, kartAccent,
}: {
  onScore: (s: number) => void; onTime: (t: number) => void; onComplete: (s: number) => void;
  kartBody: string; kartAccent: string;
}) {
  const { camera } = useThree();
  const kart = useRef<THREE.Group>(null);
  const st = useRef({ x: 0, z: 6, a: Math.PI, v: 0 });
  const tokens = useRef<Tkn[]>(makeTokens());
  const taken = useRef<boolean[]>(new Array(12).fill(false));
  const score = useRef(0);
  const time = useRef(60);
  const over = useRef(false);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const ek = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keys.current[e.key.toLowerCase()] = true;
    };
    const eu = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);
    const timer = setInterval(() => {
      if (over.current) return;
      time.current -= 1;
      onTime(time.current);
      if (time.current <= 0) {
        over.current = true;
        onComplete(score.current);
      }
    }, 1000);
    return () => { window.removeEventListener("keydown", ek); window.removeEventListener("keyup", eu); clearInterval(timer); };
  }, []);

  useFrame((_, dt) => {
    const k = keys.current;
    const s = st.current;
    if (!over.current) {
      if (k["arrowup"] || k["w"]) s.v += 0.12;
      if (k["arrowdown"] || k["s"]) s.v -= 0.16;
      if (k["arrowleft"] || k["a"]) s.a += 0.035;
      if (k["arrowright"] || k["d"]) s.a -= 0.035;
      s.v *= 0.94;
      if (s.v > 0.6) s.v = 0.6;
      if (s.v < -0.25) s.v = -0.25;
      const fx = Math.sin(s.a), fz = -Math.cos(s.a);
      s.x += fx * s.v * (dt / 16) * 6;
      s.z += fz * s.v * (dt / 16) * 6;
      if (s.x < -ARENA) { s.x = -ARENA; s.v *= 0.4; }
      if (s.x > ARENA) { s.x = ARENA; s.v *= 0.4; }
      if (s.z < -ARENA) { s.z = -ARENA; s.v *= 0.4; }
      if (s.z > ARENA) { s.z = ARENA; s.v *= 0.4; }
    }
    if (kart.current) {
      kart.current.position.set(s.x, 0, s.z);
      kart.current.rotation.y = s.a;
    }
    // camera follow
    const fx = Math.sin(s.a), fz = -Math.cos(s.a);
    const camTarget = new THREE.Vector3(s.x - fx * 9, 5.5, s.z - fz * 9);
    camera.position.lerp(camTarget, 0.08);
    camera.lookAt(s.x, 1, s.z);

    // token collision
    for (let i = 0; i < tokens.current.length; i++) {
      const t = tokens.current[i];
      if (taken.current[i]) continue;
      const d = Math.hypot(t.x - s.x, t.z - s.z);
      if (d < 1.3) {
        taken.current[i] = true;
        if (t.good) { score.current += 10; onScore(score.current); }
        else { score.current = Math.max(0, score.current - 6); onScore(score.current); s.v *= 0.4; }
        // respawn
        tokens.current[i] = { x: (Math.random() * 2 - 1) * (ARENA - 4), z: (Math.random() * 2 - 1) * (ARENA - 4), word: t.word, good: t.good, taken: false };
        taken.current[i] = false;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 18, 8]} intensity={1.1} castShadow />
      <pointLight position={[-10, 8, -10]} intensity={40} color="#a855f7" />
      <pointLight position={[10, 8, 10]} intensity={40} color="#22d3ee" />
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ARENA * 2 + 10, ARENA * 2 + 10]} />
        <meshStandardMaterial color="#10243a" />
      </mesh>
      {/* road ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[ARENA - 1, ARENA + 1, 48]} />
        <meshStandardMaterial color="#1e293b" side={THREE.DoubleSide} />
      </mesh>
      {[...Array(12)].map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(ang) * (ARENA + 2), 1, Math.sin(ang) * (ARENA + 2)]}>
            <coneGeometry args={[0.6, 2, 8]} />
            <meshStandardMaterial color={i % 2 ? "#f59e0b" : "#ef4444"} />
          </mesh>
        );
      })}
      <group ref={kart}><Kart body={kartBody} accent={kartAccent} /></group>
      <TrackTokens tokens={tokens.current} taken={taken} />
    </>
  );
}

export default function KartRace3D({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#0ea5e9",
}: {
  onComplete: (score: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [over, setOver] = useState(false);

  return (
    <div className="relative h-[68vh] w-full">
      <div className="absolute left-3 top-2 z-10 flex w-[calc(100%-1.5rem)] items-center justify-between text-sm">
        <span className="font-bold text-cyan-300 drop-shadow">Skor: {score}</span>
        <span className="font-bold text-rose-300 drop-shadow">Waktu: {time}s</span>
      </div>
      <Canvas shadows camera={{ position: [0, 6, 16], fov: 55 }} className="h-full w-full rounded-2xl border border-white/10">
        <color attach="background" args={["#0a0f2c"]} />
        <fog attach="fog" args={["#0a0f2c", 30, 70]} />
        <Scene
          onScore={(s) => setScore(s)}
          onTime={(t) => setTime(t)}
          onComplete={(s) => { setOver(true); setScore(s); onComplete(s); }}
          kartBody={kartBody}
          kartAccent={kartAccent}
        />
      </Canvas>
      {!over && (
        <p className="absolute bottom-2 left-3 right-3 z-10 text-xs text-white/60 drop-shadow">
          Panah / WASD buat nyetir. Embat bola Biru (kata Indonesia, +10), hindari bola Merah (bahasa asing, −6). Kamera ngikut di belakang. Gas!
        </p>
      )}
      {over && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/75 text-center">
          <p className="text-2xl font-black text-white">SELESAI!</p>
          <p className="mt-1 text-cyan-300">Skor kamu: {score}</p>
          <p className="mt-1 text-xs text-white/70">
            {score >= 80 ? "Mantul! Loyalitas bahasamu kece." : score >= 40 ? "Lumayan, masih bisa lebih sadar." : "Coba lagi, kumpulin lebih banyak kata Indonesia!"}
          </p>
        </div>
      )}
    </div>
  );
}
