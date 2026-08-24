export interface KartStats {
  speed: number;
  accel: number;
  control: number;
  boost: number;
  durability: number;
}

export interface KartConfig {
  key: string;
  name: string;
  body: string;
  accent: string;
  trail: string;
  trait: string;
  stats: KartStats;
}

export const KARTS: KartConfig[] = [
  {
    key: "SPEED RACER",
    name: "Speed Racer",
    body: "#ef4444",
    accent: "#fbbf24",
    trail: "#f97316",
    trait: "Seimbang di semua aspek. Pilihan aman untuk pemula yang ingin merasakan seluruh sirkuit.",
    stats: { speed: 8, accel: 7, control: 7, boost: 6, durability: 7 },
  },
  {
    key: "DRIFT KING",
    name: "Drift King",
    body: "#a855f7",
    accent: "#06b6d4",
    trail: "#8b5cf6",
    trait: "Spesialis drift dan kendali. Belokan tajam adalah rumahnya; mini-turbo adalah senjatanya.",
    stats: { speed: 6, accel: 8, control: 9, boost: 8, durability: 5 },
  },
  {
    key: "HEAVY HAULER",
    name: "Heavy Hauler",
    body: "#1e293b",
    accent: "#22d3ee",
    trail: "#475569",
    trait: "Kelas berat: lambat saat menanjak, tetapi hampir tidak tergoyahkan dari lintasan.",
    stats: { speed: 9, accel: 4, control: 5, boost: 5, durability: 10 },
  },
  {
    key: "QUICK FOX",
    name: "Quick Fox",
    body: "#f97316",
    accent: "#34d399",
    trail: "#fb923c",
    trait: "Akselerasi tercepat di garasi. Gesit menembus kerumunan, tetapi rentan terdorong.",
    stats: { speed: 7, accel: 10, control: 8, boost: 7, durability: 4 },
  },
];

export const STAT_META: { key: keyof KartStats; label: string; color: string; gradient: string }[] = [
  { key: "speed", label: "Kecepatan", color: "#ef4444", gradient: "from-red-500 to-rose-400" },
  { key: "accel", label: "Akselerasi", color: "#f97316", gradient: "from-orange-500 to-amber-400" },
  { key: "control", label: "Kendali", color: "#3b82f6", gradient: "from-blue-500 to-cyan-400" },
  { key: "boost", label: "Boost", color: "#a855f7", gradient: "from-purple-500 to-violet-400" },
  { key: "durability", label: "Ketahanan", color: "#22c55e", gradient: "from-emerald-500 to-green-400" },
];
