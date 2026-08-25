import { CHALLENGES, CHAPTERS } from "./challenges";

export type DomainLabel =
  | "context-awareness"
  | "language-norm-awareness"
  | "code-mixing-awareness"
  | "language-attitude"
  | "language-agency";

export type LoyaltyIndicator =
  | "kebanggaan-bahasa"
  | "kesadaran-norma-bahasa"
  | "loyalitas-bahasa";

export type GameEffect = "boost" | "neutral" | "slowdown";

export interface ChallengeScenario {
  id: string;
  chapter: 1 | 2 | 3 | 4 | 5;
  thinkingLevel: 1 | 2 | 3 | 4 | 5 | 6;
  domain: DomainLabel;
  loyaltyIndicator: LoyaltyIndicator;
  context: string;
  choices: {
    id: "A" | "B" | "C";
    text: string;
    isBestAnswer: boolean;
    consequence: {
      gameEffect: GameEffect;
      feedback: string;
    };
  }[];
  reflectiveQuestion: string;
  nextContextShift?: string;
}

const DOMAIN_MAP: Record<string, DomainLabel> = {
  CONTEXT: "context-awareness",
  NORM: "language-norm-awareness",
  "CODE-MIXING": "code-mixing-awareness",
  ATTITUDE: "language-attitude",
  AGENCY: "language-agency",
};

const INDICATOR_MAP: Record<string, LoyaltyIndicator> = {
  data: "kesadaran-norma-bahasa",
  aliran: "kesadaran-norma-bahasa",
  healing: "loyalitas-bahasa",
  keren: "kebanggaan-bahasa",
  poster: "kebanggaan-bahasa",
  hitungkata: "loyalitas-bahasa",
  reschedule: "kesadaran-norma-bahasa",
  balasguru: "kesadaran-norma-bahasa",
  akunsekolah: "kesadaran-norma-bahasa",
  adikkelas: "kebanggaan-bahasa",
  identitas: "kebanggaan-bahasa",
  menertawakan: "kebanggaan-bahasa",
  empatpesan: "loyalitas-bahasa",
  dilema: "loyalitas-bahasa",
  pola: "loyalitas-bahasa",
};

const EFFECT_MAP: Record<string, GameEffect> = {
  best: "boost",
  ok: "neutral",
  poor: "slowdown",
};

export const SCENARIOS: ChallengeScenario[] = CHALLENGES.map((c) => ({
  id: c.id,
  chapter: (c.chapter + 1) as 1 | 2 | 3 | 4 | 5,
  thinkingLevel: c.level as 1 | 2 | 3 | 4 | 5 | 6,
  domain: DOMAIN_MAP[c.domain] ?? "language-agency",
  loyaltyIndicator: INDICATOR_MAP[c.id] ?? "loyalitas-bahasa",
  context: c.q,
  choices: c.opts.map((o, i) => ({
    id: (String.fromCharCode(65 + i) as "A" | "B" | "C"),
    text: o.text,
    isBestAnswer: o.quality === "best",
    consequence: {
      gameEffect: EFFECT_MAP[o.quality] ?? "neutral",
      feedback: o.fb,
    },
  })),
  reflectiveQuestion: c.reflect,
}));

export const CHAPTER_TITLES = CHAPTERS;
