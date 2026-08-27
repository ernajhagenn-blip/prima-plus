const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL || "";

interface SheetRow {
  sheet: string;
  data: (string | number)[];
}

export async function sendToGoogleSheets(row: SheetRow) {
  if (!GOOGLE_SHEETS_URL) return;

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
  } catch (err) {
    console.error("Failed to send to Google Sheets:", err);
  }
}

export async function logRegistration(data: {
  code: string;
  name: string;
  kelas: string;
  timestamp: string;
}) {
  await sendToGoogleSheets({
    sheet: "Registrasi",
    data: [data.timestamp, data.code, data.name, data.kelas],
  });
}

export async function logPretest(data: {
  code: string;
  name: string;
  kelas: string;
  total: number;
  answers: { dimension: string; answer: string; score: number }[];
  timestamp: string;
}) {
  const answerCols = data.answers.map((a) => `${a.dimension}: ${a.answer} (${a.score})`);
  await sendToGoogleSheets({
    sheet: "Pretest",
    data: [data.timestamp, data.code, data.name, data.kelas, data.total, ...answerCols],
  });
}

export async function logGame(data: {
  code: string;
  name: string;
  kelas: string;
  score: number;
  max: number;
  answers: { scenario_id: number; chosen: string; correct: boolean }[];
  timestamp: string;
}) {
  const answerCols = data.answers.map((a) => `Q${a.scenario_id}: ${a.correct ? "✓" : "✗"} (${a.chosen})`);
  await sendToGoogleSheets({
    sheet: "Game PRIMA",
    data: [data.timestamp, data.code, data.name, data.kelas, data.score, data.max, ...answerCols],
  });
}

export async function logPosttest(data: {
  code: string;
  name: string;
  kelas: string;
  total: number;
  answers: { dimension: string; answer: string; score: number }[];
  timestamp: string;
}) {
  const answerCols = data.answers.map((a) => `${a.dimension}: ${a.answer} (${a.score})`);
  await sendToGoogleSheets({
    sheet: "Posttest",
    data: [data.timestamp, data.code, data.name, data.kelas, data.total, ...answerCols],
  });
}

export async function logRespons(data: {
  code: string;
  name: string;
  kelas: string;
  answers: { item_id: number; dimension: string; answer: string }[];
  timestamp: string;
}) {
  const answerCols = data.answers.map((a) => `${a.dimension}: ${a.answer}`);
  await sendToGoogleSheets({
    sheet: "Angket Respons",
    data: [data.timestamp, data.code, data.name, data.kelas, ...answerCols],
  });
}
