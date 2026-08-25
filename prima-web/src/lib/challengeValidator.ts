import { SCENARIOS, type ChallengeScenario } from "./challengeScenarios";

export interface ValidationIssue {
  id: string;
  rule: string;
  detail: string;
}

const BAD_PHRASES_IN_CONTEXT = ["mana yang paling benar", "mana yang paling sesuai bahasa indonesia", "pilih jawaban yang benar"];
const OVERCLAIM_WORDS = ["pasti", "selalu", "wajib", "jelas sekali"];

export function validateScenario(s: ChallengeScenario): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (s.choices.length !== 3) issues.push({ id: s.id, rule: "choices.length===3", detail: `punya ${s.choices.length}` });
  const bestCount = s.choices.filter((c) => c.isBestAnswer).length;
  if (bestCount !== 1) {
    const allNeutral = s.choices.every((c) => c.consequence.gameEffect === "neutral");
    if (!(bestCount === 0 && allNeutral)) issues.push({ id: s.id, rule: "exactly-1-best", detail: `isBestAnswer=${bestCount}` });
  }
  for (const c of s.choices) {
    const fbSentences = c.consequence.feedback.split(/[.!?]+\s/).filter(Boolean).length;
    if (fbSentences > 5) issues.push({ id: s.id, rule: "feedback<=4-kalimat", detail: `${c.id}: ~${fbSentences} kalimat` });
    if (!c.isBestAnswer && /salah/i.test(c.consequence.feedback)) {
      issues.push({ id: s.id, rule: "tanpa-kata-salah", detail: `${c.id}: feedback mengandung kata "salah"` });
    }
    if (!c.isBestAnswer && OVERCLAIM_WORDS.some((w) => new RegExp(`\\b${w}\\b`, "i").test(c.text))) {
      issues.push({ id: s.id, rule: "heuristik-overclaim", detail: `${c.id}: mengandung "${OVERCLAIM_WORDS.find((w) => new RegExp(`\\b${w}\\b`, "i").test(c.text))}"` });
    }
  }
  const lowCtx = BAD_PHRASES_IN_CONTEXT.find((p) => s.context.toLowerCase().includes(p));
  if (lowCtx) issues.push({ id: s.id, rule: "konteks-bebas-pola-ujian", detail: `mengandung "${lowCtx}"` });
  if (!s.reflectiveQuestion.trim().endsWith("?")) issues.push({ id: s.id, rule: "reflektif-diakhiri-tanda-tanya", detail: s.reflectiveQuestion.slice(-20) });
  return issues;
}

export function validateAll(): ValidationIssue[] {
  return SCENARIOS.flatMap(validateScenario);
}
