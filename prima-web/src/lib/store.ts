"use client";

import { create } from "zustand";

interface JourneyState {
  name: string;
  kelas: string;
  school: string;
  hookFrequency: string;
  hookReason: string;
  quizScore: number;
  characterKey: string;
  kartKey: string;
  setIntro: (v: { name: string; kelas: string; school: string }) => void;
  setHook: (v: { frequency: string; reason: string }) => void;
  setQuizScore: (n: number) => void;
  setCharacter: (k: string) => void;
  setKart: (k: string) => void;
  reset: () => void;
}

export const useJourney = create<JourneyState>((set) => ({
  name: "",
  kelas: "",
  school: "",
  hookFrequency: "",
  hookReason: "",
  quizScore: 0,
  characterKey: "KARA",
  kartKey: "PRIMA FLASH",
  setIntro: (v) => set((s) => ({ ...s, ...v })),
  setHook: (v) => set((s) => ({ ...s, ...v })),
  setQuizScore: (n) => set({ quizScore: n }),
  setCharacter: (k) => set({ characterKey: k }),
  setKart: (k) => set({ kartKey: k }),
  reset: () =>
    set({ name: "", kelas: "", school: "", hookFrequency: "", hookReason: "", quizScore: 0, characterKey: "KARA", kartKey: "PRIMA FLASH" }),
}));
