export interface KartConfig {
  key: string;
  name: string;
  body: string;
  accent: string;
  trait: string;
}

export const KARTS: KartConfig[] = [
  { key: "PRIMA FLASH", name: "PRIMA FLASH", body: "#ef4444", accent: "#0ea5e9", trait: "Cepat & lincah." },
  { key: "PRIMA COMET", name: "PRIMA COMET", body: "#a855f7", accent: "#facc15", trait: "Elegan, stabil di tikungan." },
  { key: "PRIMA NOVA", name: "PRIMA NOVA", body: "#22d3ee", accent: "#7c3aed", trait: "Cerah, mudah dikendalikan." },
  { key: "PRIMA VOLT", name: "PRIMA VOLT", body: "#f59e0b", accent: "#1e293b", trait: "Berat, kuat nge-boost." },
  { key: "PRIMA BREEZE", name: "PRIMA BREEZE", body: "#34d399", accent: "#065f46", trait: "Sejuk, irit tenaga." },
  { key: "PRIMA RUSH", name: "PRIMA RUSH", body: "#ec4899", accent: "#831843", trait: "Agresif, untuk pemburu skor." },
];
