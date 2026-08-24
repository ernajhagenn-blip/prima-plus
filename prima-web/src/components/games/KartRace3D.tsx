"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   LANGUAGE KART — Mario Kart × Bahasa Indonesia Edu-Racer
   ═══════════════════════════════════════════════════════════ */

const GOOD_WORDS = ["makasih", "sampai jumpa", "seru", "hebat", "teman", "belajar", "santun", "ramah", "karya", "cita-cita", "semangat", "jujur", "rapi", "cantik", "gotong royong", "sopan"];
const BAD_WORDS = ["hallo guys", "btw", "omg", "literally", "vibes", "slay", "bestie", "okay dah", "see you"];

const CHALLENGES = [
  { q: "Seorang siswa menulis di chat: 'Gw lagi males banget nih, males gerak, males ngapa-ngapain.' Menurutmu, apa dampak jangka panjang kebiasaan ini terhadap kemampuan bahasanya?", opts: ["Tidak ada dampak, toh cuma di chat pribadi", "Kemampuan menulis dan berbicara bahasa baku akan melemah karena jarang berlatih", "Justru menambah variasi kosakata", "Lebih efisien karena singkat"], ans: 1, tip: "Kebiasaan menulis informal secara konsisten akan membentuk pola pikir linguistik yang sulit beralih ke bahasa baku saat dibutuhkan (di sekolah, ujian, kerja)." },
  { q: "Di sebuah seminar, pembicara berkata: 'Jadi basically, intinya kita harus aware terhadap issue ini, karena literally everyone affected.' Apa yang salah dari komunikasi ini?", opts: ["Tidak ada yang salah, semua orang paham", "Pencampuran bahasa asing yang tidak perlu mengurangi kejelasan bagi pendengar yang tidak menguasai bahasa tersebut", "Gaya bicara ini sudah diterima secara universal", "Hanya masalah selera, bukan kualitas"], ans: 1, tip: "Dalam konteks formal/semnar, penggunaan campuran bahasa asing bisa mengalienasi pendengar yang tidak familiar dan menurunkan kredibilitas pembicara." },
  { q: "Sebuah penelitian menunjukkan bahwa remaja yang aktif di media sosial cenderung lebih sering menggunakan bahasa gaul dibanding bahasa baku. Mengapa fenomena ini perlu diwaspadai?", opts: ["Karena media sosial itu buruk bagi remaja", "Karena batas antara bahasa gaul dan baku bisa kabur, sehingga remaja kesulitan beralih ke bahasa formal saat diperlukan", "Karena bahasa gaul lebih kreatif", "Sebenarnya tidak perlu dikhawatirkan"], ans: 1, tip: "Media sosial membentuk kebiasaan linguistik. Tanpa kesadaran, remaja bisa kehilangan kemampuan beralih ragam (code-switching) yang tepat untuk konteks berbeda." },
  { q: "Perhatikan kalimat ini: 'Aku mau presentasi tentang impact of social media terhadap generasi muda.' Apa masalah utama dari kalimat tersebut?", opts: ["Tidak ada masalah, semua orang mengerti", "Terlalu banyak kata serapan bahasa asing yang bisa diganti dengan padanan Indonesia yang lebih tepat", "Kalimatnya terlalu pendek", "Struktur kalimatnya sudah benar"], ans: 1, tip: "'Impact' → dampak, 'social media' → media sosial, 'terhadap' sudah benar. Menggunakan padanan Indonesia menunjukkan penguasaan kosakata yang lebih kuat." },
  { q: "Guru bahasa Indonesia meminta siswa membuat esai formal. Seorang siswa menulis dengan campuran bahasa: 'Essay ini basically membahas tentang fenomena yang literally terjadi di sekitar kita.' Penilaian yang tepat adalah...", opts: ["Sudah bagus karena kreatif", "Perlu diperbaiki karena esai formal harus menggunakan bahasa Indonesia yang konsisten tanpa campuran bahasa asing yang tidak perlu", "Tidak masalah karena pembaca masih mengerti", "Nilai penuh karena isi/esainya yang penting"], ans: 1, tip: "Esai formal mengharapkan konsistensi penggunaan bahasa. Campuran bahasa asing yang tidak perlu menunjukkan belum matangnya kesadaran berbahasa." },
  { q: "Ibu Kota Nusantara (IKN) menggunakan bahasa Indonesia sebagai bahasa resmi. Mengapa penegasan ini penting bagi identitas bangsa?", opts: ["Hanya formalitas administratif", "Bahasa Indonesia adalah alat pemersatu yang menjamin semua warga negara bisa berkomunikasi tanpa diskriminasi", "Bahasa Inggris seharusnya dijadikan bahasa utama", "Tidak terlalu penting selama komunikasi berjalan"], ans: 1, tip: "Penggunaan bahasa Indonesia di institusi negara memperkuat fungsi bahasa sebagai alat pemersatu dan identitas nasional Indonesia." },
  { q: "Seorang konten kreator bilang: 'Content ini gw buat buat kalian semua yang literally need this!' Dari perspektif loyalitas berbahasa, apa yang terjadi?", opts: ["Normal saja, semua orang juga bicara begitu", "Terjadi erosi kesadaran berbahasa karena penggunaan bahasa asing secara membabi buta tanpa mempertimbangkan konteks", "Ini menunjukkan kreativitas tinggi", "Bahasa berkembang, itu wajar saja"], ans: 1, tip: "Loyalitas berbahasa bukan berarti tidak boleh meminjam kata, tapi tentang kesadaran memilih ragam yang tepat sesuai konteks dan audiens." },
  { q: "Seorang siswa berkata: 'Aku lebih nyaman pakai bahasa gaul karena bahasa baku itu kaku dan membosankan.' Bagaimana cara merespons dengan bijak?", opts: ["Setuju saja, toh bahasa baku memang kaku", "Menjelaskan bahwa bahasa baku dan bahasa gaul punya fungsi masing-masing, dan keterampilan beralih antar keduanya adalah kekuatan, bukan kelemahan", "Melarang penggunaan bahasa gaul sepenuhnya", "Tidak usah dipedulikan"], ans: 1, tip: "Pendekatan ekstrem (larang total atau biarkan saja) kurang efektif. Yang dibutuhkan adalah kesadaran untuk menggunakan ragam yang tepat di waktu yang tepat." },
  { q: "Dalam ujian tulis, seorang siswa menulis: 'Gimana caranya biar Indonesia tetep jaya?' Padahal soal meminta jawaban formal. Apa konsekuensinya?", opts: ["Tidak ada masalah karena isi jawabannya benar", "Guru berhak mengurangi poin karena penggunaan ragam informal tidak sesuai tuntutan soal yang meminta bahasa baku", "Siswa berhak menulis dengan gaya apapun", "Soal yang harus diperbaiki, bukan jawaban siswa"], ans: 1, tip: "Kesadaran berbahasa termasuk kemampuan menyesuaikan ragam dengan konteks. Ujian formal menuntut bahasa baku, dan ini adalah keterampilan yang harus dikuasai." },
  { q: "Sebuah iklan produk menggunakan bahasa: 'Produk kami, basically, super bagus dan literally bikin hidup kamu lebih amazing!' Apa analisis kritismu?", opts: ["Iklan yang efektif karena menggunakan bahasa anak muda", "Penggunaan bahasa asing yang berlebihan dalam iklan bisa memperkuat tren bahasa gaul dan melemahkan kesadaran berbahasa baku di masyarakat", "Iklan seperti ini sudah standar industri", "Tidak ada masalah seluai produknya laku"], ans: 1, tip: "Media massa (termasuk iklan) memiliki pengaruh besar dalam membentuk kebiasaan berbahasa. Iklan yang tidak memperhatikan kualitas bahasa ikut andil dalam degradasi kesadaran berbahasa." },
  { q: "Kata 'literally' sering dipakai remaja Indonesia dalam percakapan sehari-hari. Apa fungsi sebenarnya kata ini dan mengapa penggunaannya di Indonesia perlu dikritisi?", opts: ["Kata ini universal dan tidak perlu dikritisi", "Literally berarti 'secara harfiah' dalam bahasa Inggris, dan penggunaannya dalam bahasa Indonesia tanpa konteks yang tepat menunjukkan minimnya kesadaran linguistik", "Kata ini sudah menjadi bagian dari bahasa Indonesia", "Hanya masalah tren yang akan hilang sendiri"], ans: 1, tip: "Literally = secara harfiah. Dipakai remaja Indonesia biasanya tanpa makna harfiah, menunjukkan pengaruh media sosial yang membentuk kebiasaan tanpa pemahaman makna." },
  { q: "Sebuah sekolah menerapkan 'Gerakan Ngomong Bahasa Indonesia' di lingkungan sekolah. Langkah ini sejalan dengan...", opts: ["Membatasi kreativitas siswa", "Upaya membangun kesadaran berbahasa dan loyalitas terhadap bahasa Indonesia sebagai identitas bangsa", "Aturan yang tidak relevan dengan zaman digital", "Memaksa siswa berbicara formal sepanjang hari"], ans: 1, tip: "Program seperti ini membantu remaja membiasakan diri menggunakan bahasa Indonesia secara konsisten, membangun kesadaran dan loyalitas berbahasa." },
  { q: "Amatan: Di media sosial, banyak remaja menulis caption seperti 'Day 47: Still healing, still growing, still learning.' Padahal mereka berbicara tentang kehidupan di Indonesia. Apa yang bisa disimpulkan?", opts: ["Mereka lebih berbakat menulis dalam bahasa Inggris", "Terdapat desakulturalisasi bahasa Indonesia di kalangan remaja akibat pengaruh konten luar negeri yang dominan", "Tidak ada masalah karena caption Instagram memang pakai bahasa Inggris", "Mereka sedang belajar bahasa Inggris"], ans: 1, tip: "Ketika remaja secara default memilih bahasa asing untuk mengekspresikan diri (bukan karena konteks internasional), ini menunjukkan pelemahan ikatan emosional dengan bahasa Indonesia." },
  { q: "Perhatikan dua kalimat: (A) 'Film ini bagus banget, wajib nonton!' (B) 'Film ini sangat menarik dan layak ditonton.' Kapan masing-masing kalimat tepat digunakan?", opts: ["Kalimat A untuk semua situasi", "Kalimat B untuk situasi formal/tulisan, Kalimat A untuk percakapan santai — keduanya valid di konteksnya masing-masing", "Kalimat B lebih baik dari Kalimat A", "Kalimat A tidak boleh digunakan"], ans: 1, tip: "Kesadaran berbahasa bukan tentang melarang bahasa gaul, tapi tentang kemampuan memilih ragam yang tepat. Formal = B, informal = A. Masalah muncul ketika satu ragam mendominasi semua konteks." },
  { q: "Menurut UUD 1945 Pasal 36, bahasa Indonesia adalah bahasa negara. Faktanya, banyak remaja lebih bangga menggunakan bahasa asing. Apa langkah konkret yang bisa dilakukan untuk memperkuat loyalitas berbahasa?", opts: ["Melarang semua penggunaan bahasa asing", "Membangun kesadaran melalui edukasi, penguatan di lingkungan sekolah, dan menunjukkan bahwa bahasa Indonesia itu kaya, indah, dan mampu mengekspresikan ide kompleks", "Biarkan saja karena tren akan berubah", "Ganti semua bahasa asing dengan bahasa Indonesia di teknologi"], ans: 1, tip: "Pendekatan represif (melarang) kurang efektif. Yang dibutuhkan adalah pendekatan positif: edukasi, paparan, dan pembuktian bahwa bahasa Indonesia memadai untuk semua kebutuhan komunikasi." },
];

interface Token { x: number; y: number; word: string; good: boolean; taken: boolean; respawn: number; z: number; bob: number; }
interface Obstacle { x: number; y: number; angle: number; type: string; }
interface AIKart { angle: number; speed: number; color: string; glow: string; lap: number; crossed: boolean; }
interface Particle { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; max: number; color: string; size: number; }
interface Popup { x: number; y: number; z: number; text: string; color: string; life: number; }
interface Star { x: number; y: number; r: number; b: number; layer: number; }
interface QuizGate { angle: number; used: boolean; }

function sfx(type: string) {
  try {
    const c = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = c.createOscillator(); const g = c.createGain();
    o.connect(g); g.connect(c.destination); g.gain.value = 0.05;
    if (type === "pickup") { o.type = "sine"; o.frequency.setValueAtTime(880, c.currentTime); o.frequency.exponentialRampToValueAtTime(1760, c.currentTime + 0.08); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15); o.start(); o.stop(c.currentTime + 0.15); }
    else if (type === "crash") { o.type = "sawtooth"; o.frequency.setValueAtTime(200, c.currentTime); o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.2); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25); o.start(); o.stop(c.currentTime + 0.25); }
    else if (type === "correct") { o.type = "sine"; o.frequency.setValueAtTime(523, c.currentTime); o.frequency.setValueAtTime(659, c.currentTime + 0.1); o.frequency.setValueAtTime(784, c.currentTime + 0.2); g.gain.value = 0.07; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35); o.start(); o.stop(c.currentTime + 0.35); }
    else if (type === "wrong") { o.type = "sawtooth"; o.frequency.setValueAtTime(300, c.currentTime); o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.3); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35); o.start(); o.stop(c.currentTime + 0.35); }
    else if (type === "tick") { o.type = "square"; o.frequency.value = 1200; g.gain.value = 0.025; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05); o.start(); o.stop(c.currentTime + 0.05); }
    else if (type === "go") { o.type = "sine"; o.frequency.setValueAtTime(523, c.currentTime); o.frequency.setValueAtTime(659, c.currentTime + 0.12); o.frequency.setValueAtTime(784, c.currentTime + 0.24); g.gain.value = 0.07; g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4); o.start(); o.stop(c.currentTime + 0.4); }
  } catch {}
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function project(x: number, y: number, z: number, cx: number, cy: number, sc: number, cam: number) {
  const ca = Math.cos(cam), sa = Math.sin(cam);
  const rx = x * ca - y * sa;
  const ry = x * sa + y * ca;
  return { px: cx + rx * sc, py: cy + ry * sc * 0.42 - z * sc * 0.75, depth: ry, s: sc * (1 - ry * 0.0002) };
}

export default function KartRace3D({
  onComplete,
  kartBody = "#ef4444",
  kartAccent = "#a855f7",
}: {
  onComplete: (raceScore: number, eduScore: number, correct: number) => void;
  kartBody?: string;
  kartAccent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [raceScore, setRaceScore] = useState(0);
  const [time, setTime] = useState(90);
  const [position, setPosition] = useState(1);
  const [lap, setLap] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [drifting, setDrifting] = useState(false);
  const [over, setOver] = useState(false);
  const [cd, setCd] = useState(3);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizQ, setQuizQ] = useState(0);
  const [quizTimer, setQuizTimer] = useState(10);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(-1);
  const [correctCount, setCorrectCount] = useState(0);
  const [eduScore, setEduScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const showInstructionsRef = useRef(true);

  const S = useRef({
    px: 0, py: 0, pa: 0, pv: 0, pz: 0,
    tokens: [] as Token[],
    obstacles: [] as Obstacle[],
    ai: [] as AIKart[],
    particles: [] as Particle[],
    popups: [] as Popup[],
    keys: {} as Record<string, boolean>,
    score: 0, time: 90, lap: 0, over: false,
    lastAngle: 0, crossedStart: false,
    cx: 0, cy: 0, trackR: 0, trackW: 0, sc: 1,
    cdVal: 3, cdTime: 0, started: false,
    stars: [] as Star[],
    camAngle: 0,
    gates: [] as QuizGate[],
    quizPaused: false,
    quizIdx: 0,
    combo: 0,
    usedQuestions: new Set<number>(),
    boostTimer: 0,
    shieldActive: false,
  });

  const touch = useRef({ steerX: 0, gas: false, brake: false, active: false, sx: 0 });

  useEffect(() => {
    const obs = new ResizeObserver(e => { for (const en of e) { const w = en.contentRect.width; const h = en.contentRect.height; if (w > 0 && h > 0) setDims({ w, h }); } });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Init
  useEffect(() => {
    const s = S.current;
    const w = dims.w, h = dims.h;
    s.cx = w / 2; s.cy = h * 0.52;
    s.trackR = Math.min(w, h) * 0.30;
    s.trackW = Math.min(w, h) * 0.12;
    s.sc = Math.min(w / 900, h / 600) * 1.05;
    s.px = 0; s.py = s.trackR; s.pa = Math.PI;

    s.stars = Array.from({ length: 100 }, () => ({ x: Math.random() * w, y: Math.random() * h * 0.55, r: Math.random() * 1.8 + 0.3, b: Math.random() * Math.PI * 2, layer: Math.floor(Math.random() * 3) }));

    // Tokens around track
    s.tokens = [];
    const tc = 14;
    for (let i = 0; i < tc; i++) {
      const a = (i / tc) * Math.PI * 2;
      const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.5;
      const good = i < 10;
      s.tokens.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, word: good ? GOOD_WORDS[i % GOOD_WORDS.length] : BAD_WORDS[(i - 10) % BAD_WORDS.length], good, taken: false, respawn: 0, z: 0, bob: Math.random() * Math.PI * 2 });
    }

    // Obstacles (bahasa gaul traps)
    s.obstacles = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.3;
      s.obstacles.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, angle: a, type: ["trap", "barrier", "oil"][i % 3] });
    }

    // Quiz gates at specific angles
    s.gates = [0, Math.PI / 2.5, Math.PI * 2 / 2.5, Math.PI * 3 / 2.5, Math.PI * 4 / 2.5].map(a => ({ angle: a, used: false }));

    s.ai = [
      { angle: 0, speed: 0.011, color: "#a855f7", glow: "#c084fc", lap: 0, crossed: false },
      { angle: Math.PI * 2 / 3, speed: 0.009, color: "#22c55e", glow: "#4ade80", lap: 0, crossed: false },
      { angle: Math.PI * 4 / 3, speed: 0.013, color: "#f97316", glow: "#fb923c", lap: 0, crossed: false },
    ];
  }, [dims]);

  const answeringRef = useRef(false);

  // Quiz logic
  const startQuiz = useCallback(() => {
    const s = S.current;
    if (s.quizPaused || s.over) return;
    answeringRef.current = false;
    // Pick unused question
    const available = CHALLENGES.map((_, i) => i).filter(i => !s.usedQuestions.has(i));
    if (available.length === 0) { s.usedQuestions.clear(); }
    const pool = CHALLENGES.map((_, i) => i).filter(i => !s.usedQuestions.has(i));
    const idx = pool[Math.floor(Math.random() * pool.length)];
    s.usedQuestions.add(idx);
    s.quizIdx = idx;
    s.quizPaused = true;
    setQuizQ(idx);
    setQuizActive(true);
    setQuizTimer(20);
    setQuizAnswered(false);
    setSelectedOpt(-1);
  }, []);

  const answerQuiz = useCallback((optIdx: number) => {
    const s = S.current;
    if (answeringRef.current) return;
    answeringRef.current = true;
    setQuizAnswered(true);
    setSelectedOpt(optIdx);
    const ch = CHALLENGES[s.quizIdx];
    const correct = optIdx >= 0 && optIdx === ch.ans;
    setQuizCorrect(correct);
    if (correct) {
      sfx("correct");
      s.score += 20;
      s.combo++;
      s.boostTimer = 30;
      setRaceScore(s.score);
      setCorrectCount(c => c + 1);
      setCombo(s.combo);
      s.popups.push({ x: s.px, y: s.py, z: 25, text: "+20 BENAR!", color: "#22c55e", life: 60 });
    } else {
      sfx("wrong");
      s.score = Math.max(0, s.score - 5);
      s.pv *= 0.4;
      s.combo = 0;
      setRaceScore(s.score);
      setCombo(0);
      s.popups.push({ x: s.px, y: s.py, z: 25, text: optIdx < 0 ? "WAKTU HABIS!" : "-5 SALAH", color: "#f43f5e", life: 60 });
    }
  }, []);

  const continueQuiz = useCallback(() => {
    const s = S.current;
    s.quizPaused = false;
    s.pv = Math.max(s.pv, 0.3);
    answeringRef.current = false;
    setQuizActive(false);
    setQuizAnswered(false);
    setQuizCorrect(false);
    setSelectedOpt(-1);
  }, []);

  // Quiz timer — no side effects inside state updater
  useEffect(() => {
    if (!quizActive || quizAnswered) return;
    if (quizTimer <= 0) {
      const to = setTimeout(() => answerQuiz(-1), 50);
      return () => clearTimeout(to);
    }
    const t = setTimeout(() => setQuizTimer(quizTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [quizActive, quizAnswered, quizTimer, answerQuiz]);

  // Quiz keyboard: 1-4 jawab, Enter/Spasi lanjut
  useEffect(() => {
    if (!quizActive) return;
    const h = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key) && !quizAnswered) {
        e.preventDefault();
        answerQuiz(parseInt(e.key) - 1);
      } else if ((e.key === "Enter" || e.key === " ") && quizAnswered) {
        e.preventDefault();
        continueQuiz();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [quizActive, quizAnswered, answerQuiz, continueQuiz]);

  // Game loop
  useEffect(() => {
    const s = S.current;
    const ek = (e: KeyboardEvent) => { if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault(); s.keys[e.key.toLowerCase()] = true; };
    const eu = (e: KeyboardEvent) => { s.keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", ek);
    window.addEventListener("keyup", eu);

    s.cdVal = 3; s.cdTime = Date.now(); s.over = false; s.score = 0; s.time = 90; s.lap = 0; s.usedQuestions.clear(); s.combo = 0;
    setRaceScore(0); setCorrectCount(0); setEduScore(0); setCombo(0);

    const timer = setInterval(() => {
      if (s.over) return;
      const el = Date.now() - s.cdTime;
      const v = 3 - Math.floor(el / 1000);
      if (v !== s.cdVal && v >= 0) { s.cdVal = v; setCd(v); if (v > 0) sfx("tick"); if (v === 0) { sfx("go"); s.started = true; setTimeout(() => { s.cdVal = -1; setCd(-1); }, 800); } }
      if (s.started && !s.quizPaused && el > 4200) {
        s.time--; setTime(s.time);
        if (s.time <= 10 && s.time > 0) sfx("tick");
        if (s.time <= 0) { s.over = true; setOver(true); onComplete(s.score, s.combo > 0 ? Math.floor(s.score * 0.3) : 0, 0); }
      }
    }, 1000);

    let lt = performance.now();
    const loop = (now: number) => {
      if (s.over) { draw(s, now); return; }
      const dt = Math.min(now - lt, 32); lt = now;
      if (!s.started) { draw(s, now); requestAnimationFrame(loop); return; }

      // PAUSED for quiz OR instructions
      if (s.quizPaused || showInstructionsRef.current) { draw(s, now); requestAnimationFrame(loop); return; }

      const k = s.keys;
      const tc = touch.current;
      const hasT = tc.active;

      const gas = k["arrowup"] || k["w"] || (hasT && tc.gas);
      const brake = k["arrowdown"] || k["s"] || (hasT && tc.brake);
      const steer = ((k["arrowleft"] || k["a"] ? 1 : 0) - (k["arrowright"] || k["d"] ? 1 : 0)) + (hasT ? tc.steerX : 0);

      if (gas) s.pv += 0.15;
      if (brake) s.pv -= 0.2;
      s.pa += steer * 0.045;

      const isDrift = !!k[" "];
      setDrifting(isDrift);
      s.pv *= isDrift ? 0.93 : 0.97;
      if (s.boostTimer > 0) { s.boostTimer--; s.pv += 0.02; }
      if (s.pv > 0.85) s.pv = 0.85;
      if (s.pv < -0.3) s.pv = -0.3;
      if (Math.abs(s.pv) < 0.003) s.pv = 0;

      s.px += Math.sin(s.pa) * s.pv * dt * 0.33;
      s.py += -Math.cos(s.pa) * s.pv * dt * 0.33;
      s.pz = Math.max(0, s.pz - 0.3);

      // Track bounds
      const dist = Math.hypot(s.px, s.py);
      const dTrack = Math.abs(dist - s.trackR);
      if (dTrack > s.trackW / 2 + 6) {
        const a = Math.atan2(s.py, s.px);
        const target = s.trackR + (dist > s.trackR ? s.trackW / 2 + 4 : -(s.trackW / 2 + 4));
        s.px = Math.cos(a) * target; s.py = Math.sin(a) * target;
        s.pv *= 0.2; sfx("crash");
        for (let i = 0; i < 8; i++) s.particles.push({ x: s.px, y: s.py, z: 3, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, vz: Math.random() * 3, life: 20, max: 20, color: "#f97316", size: Math.random() * 3 + 1 });
      }

      // Camera
      s.camAngle = lerp(s.camAngle, s.pa * 0.12, 0.03);

      // Lap
      const curA = Math.atan2(s.py, s.px);
      const norm = curA < 0 ? curA + Math.PI * 2 : curA;
      if (norm < 0.3 && s.lastAngle > Math.PI * 2 - 0.3 && !s.crossedStart) {
        s.crossedStart = true;
        if (s.pv > 0.05) { s.lap++; setLap(s.lap); if (s.lap >= 3) { s.over = true; setOver(true); onComplete(s.score, Math.floor(s.score * 0.3), 0); } }
      } else if (norm > Math.PI) s.crossedStart = false;
      s.lastAngle = norm;

      // Quiz gates — check proximity
      for (const gate of s.gates) {
        if (gate.used) continue;
        const gx = Math.cos(gate.angle) * s.trackR;
        const gy = Math.sin(gate.angle) * s.trackR;
        const gd = Math.hypot(gx - s.px, gy - s.py);
        if (gd < 35) {
          gate.used = true;
          startQuiz();
          break;
        }
      }

      // Tokens
      for (let i = 0; i < s.tokens.length; i++) {
        const t = s.tokens[i];
        if (t.taken) { if (t.respawn > 0) { t.respawn--; continue; } const a = Math.random() * Math.PI * 2; const r = s.trackR + (Math.random() - 0.5) * s.trackW * 0.5; t.x = Math.cos(a) * r; t.y = Math.sin(a) * r; t.word = t.good ? GOOD_WORDS[Math.floor(Math.random() * GOOD_WORDS.length)] : BAD_WORDS[Math.floor(Math.random() * BAD_WORDS.length)]; t.taken = false; t.z = 0; continue; }
        t.z = Math.sin(now * 0.003 + t.bob) * 3 + 5;
        const td = Math.hypot(t.x - s.px, t.y - s.py);
        if (td < 26) {
          t.taken = true; t.respawn = 180;
          if (t.good) {
            s.score += 10; sfx("pickup");
            s.popups.push({ x: t.x, y: t.y, z: 18, text: "+10 " + t.word, color: "#22d3ee", life: 50 });
            for (let j = 0; j < 6; j++) s.particles.push({ x: t.x, y: t.y, z: t.z, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: Math.random() * 2 + 1, life: 22, max: 22, color: "#22d3ee", size: Math.random() * 2.5 + 1 });
          } else {
            s.score = Math.max(0, s.score - 6); s.pv *= 0.35; sfx("crash");
            s.popups.push({ x: t.x, y: t.y, z: 18, text: "-6 " + t.word, color: "#f43f5e", life: 50 });
          }
          setRaceScore(s.score);
        }
      }

      // Obstacles
      for (const ob of s.obstacles) {
        const od = Math.hypot(ob.x - s.px, ob.y - s.py);
        if (od < 20) {
          s.pv *= 0.25; sfx("crash");
          s.popups.push({ x: ob.x, y: ob.y, z: 12, text: "BAHASA GAUL!", color: "#f97316", life: 40 });
          for (let j = 0; j < 6; j++) s.particles.push({ x: ob.x, y: ob.y, z: 3, vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4, vz: Math.random() * 2, life: 18, max: 18, color: "#f97316", size: Math.random() * 2 + 1 });
          // Respawn obstacle elsewhere
          const na = Math.random() * Math.PI * 2;
          const nr = s.trackR + (Math.random() - 0.5) * s.trackW * 0.3;
          ob.x = Math.cos(na) * nr; ob.y = Math.sin(na) * nr;
        }
      }

      // AI
      for (const ai of s.ai) {
        ai.angle += ai.speed * (1 + Math.sin(now * 0.0003 + ai.angle * 2) * 0.12);
        if (ai.angle > Math.PI * 2) ai.angle -= Math.PI * 2;
        if (ai.angle < 0.3 && !ai.crossed) { ai.crossed = true; ai.lap++; }
        else if (ai.angle > Math.PI) ai.crossed = false;
      }

      // Particles
      if (isDrift && Math.abs(s.pv) > 0.25) {
        for (let i = 0; i < 2; i++) s.particles.push({ x: s.px - Math.sin(s.pa) * 8 + (Math.random() - 0.5) * 5, y: s.py + Math.cos(s.pa) * 8 + (Math.random() - 0.5) * 5, z: 1, vx: -Math.sin(s.pa) * s.pv * 0.3, vy: Math.cos(s.pa) * s.pv * 0.3, vz: 0.3, life: 15, max: 15, color: "rgba(168,85,247,0.6)", size: Math.random() * 2 + 1 });
      }
      s.particles = s.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.z += p.vz; p.vz -= 0.1; if (p.z < 0) { p.z = 0; p.vz *= -0.3; } p.life--; return p.life > 0; });
      s.popups = s.popups.filter(p => { p.z += 0.25; p.life--; return p.life > 0; });

      // Position
      const pProg = s.lap * 1000 + norm * 100;
      let pos = 1;
      for (const ai of s.ai) { if (ai.lap * 1000 + ai.angle * 100 > pProg) pos++; }
      setPosition(pos);
      setSpeed(Math.abs(s.pv));

      draw(s, now);
      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => { window.removeEventListener("keydown", ek); window.removeEventListener("keyup", eu); clearInterval(timer); cancelAnimationFrame(id); };
  }, [dims, onComplete, startQuiz]);

  // ── RENDER ──
  const draw = (s: typeof S.current, now: number) => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = dims.w, h = dims.h;

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#050510"); sky.addColorStop(0.3, "#0a0a2e"); sky.addColorStop(0.6, "#0f0a30"); sky.addColorStop(1, "#1a0825");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);

    // Nebula
    for (let i = 0; i < 3; i++) {
      const nx = w * (0.2 + i * 0.3), ny = h * (0.15 + i * 0.15);
      const neb = ctx.createRadialGradient(nx, ny, 0, nx, ny, w * 0.3);
      neb.addColorStop(0, ["rgba(124,58,237,0.06)", "rgba(168,85,247,0.05)", "rgba(192,132,252,0.04)"][i]);
      neb.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = neb; ctx.fillRect(0, 0, w, h);
    }

    // Stars parallax
    for (let layer = 0; layer < 3; layer++) {
      const px = s.camAngle * 40 * (layer + 1) * 0.3;
      for (const star of s.stars) {
        if (star.layer !== layer) continue;
        const tw = 0.3 + 0.7 * Math.sin(now * 0.001 + star.b * 8);
        const sx = ((star.x - px) % w + w) % w;
        ctx.beginPath(); ctx.arc(sx, star.y, star.r * (0.6 + layer * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${tw * (0.25 + layer * 0.12)})`; ctx.fill();
      }
    }

    // Ground
    const gy = h * 0.4;
    const grd = ctx.createLinearGradient(0, gy, 0, h);
    grd.addColorStop(0, "rgba(12,12,40,0.5)"); grd.addColorStop(0.4, "rgba(8,8,30,0.8)"); grd.addColorStop(1, "rgba(5,5,20,1)");
    ctx.fillStyle = grd; ctx.fillRect(0, gy, w, h - gy);

    // Grid depth
    ctx.strokeStyle = "rgba(124,58,237,0.04)"; ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) { const yy = gy + i * (h - gy) / 15; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(w, yy); ctx.stroke(); }

    // ── DEPTH SORT ──
    interface Obj { type: string; depth: number; data: any; }
    const objs: Obj[] = [];

    // Track surface fill
    for (let i = 0; i < 60; i++) {
      const a1 = (i / 60) * Math.PI * 2, a2 = ((i + 1) / 60) * Math.PI * 2;
      const io1 = project(Math.cos(a1) * (s.trackR + s.trackW / 2), Math.sin(a1) * (s.trackR + s.trackW / 2), 0, s.cx, s.cy, s.sc, s.camAngle);
      const io2 = project(Math.cos(a2) * (s.trackR + s.trackW / 2), Math.sin(a2) * (s.trackR + s.trackW / 2), 0, s.cx, s.cy, s.sc, s.camAngle);
      const ii1 = project(Math.cos(a1) * (s.trackR - s.trackW / 2), Math.sin(a1) * (s.trackR - s.trackW / 2), 0, s.cx, s.cy, s.sc, s.camAngle);
      const ii2 = project(Math.cos(a2) * (s.trackR - s.trackW / 2), Math.sin(a2) * (s.trackR - s.trackW / 2), 0, s.cx, s.cy, s.sc, s.camAngle);
      const md = (io1.depth + io2.depth + ii1.depth + ii2.depth) / 4;
      objs.push({ type: "tracksurf", depth: md, data: { io1, io2, ii1, ii2 } });
    }

    // Track borders
    for (let ring = 0; ring < 2; ring++) {
      const r = ring === 0 ? s.trackR + s.trackW / 2 : s.trackR - s.trackW / 2;
      for (let i = 0; i < 60; i++) {
        const a1 = (i / 60) * Math.PI * 2, a2 = ((i + 1) / 60) * Math.PI * 2;
        const p1 = project(Math.cos(a1) * r, Math.sin(a1) * r, 0, s.cx, s.cy, s.sc, s.camAngle);
        const p2 = project(Math.cos(a2) * r, Math.sin(a2) * r, 0, s.cx, s.cy, s.sc, s.camAngle);
        objs.push({ type: "trackborder", depth: (p1.depth + p2.depth) / 2, data: { p1, p2, ring } });
      }
    }

    // Start/finish
    const sf1 = project(s.trackR, -3, 0, s.cx, s.cy, s.sc, s.camAngle);
    const sf2 = project(s.trackR, 3, 0, s.cx, s.cy, s.sc, s.camAngle);
    objs.push({ type: "startfinish", depth: sf1.depth, data: { p1: sf1, p2: sf2 } });

    // Quiz gates
    for (const gate of s.gates) {
      if (gate.used) continue;
      const gx = Math.cos(gate.angle) * s.trackR;
      const gy = Math.sin(gate.angle) * s.trackR;
      const pg = project(gx, gy, 0, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "quizgate", depth: pg.depth, data: { proj: pg, angle: gate.angle } });
    }

    // Tokens
    for (const t of s.tokens) {
      if (t.taken) continue;
      const p = project(t.x, t.y, t.z, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "token", depth: p.depth, data: { ...t, proj: p } });
    }

    // Obstacles
    for (const ob of s.obstacles) {
      const p = project(ob.x, ob.y, 4, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "obstacle", depth: p.depth, data: { ...ob, proj: p } });
    }

    // AI
    for (const ai of s.ai) {
      const ax = Math.cos(ai.angle) * s.trackR, ay = Math.sin(ai.angle) * s.trackR;
      const p = project(ax, ay, 3, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "kart", depth: p.depth, data: { ...ai, proj: p, isPlayer: false } });
    }

    // Player
    const pp = project(s.px, s.py, 3 + s.pz, s.cx, s.cy, s.sc, s.camAngle);
    objs.push({ type: "kart", depth: pp.depth, data: { color: s.boostTimer > 0 ? "#22d3ee" : kartBody, glow: s.boostTimer > 0 ? "#22d3ee" : kartAccent, angle: s.pa, proj: pp, isPlayer: true, speed: s.pv, drifting } });

    // Particles
    for (const p of s.particles) {
      const proj = project(p.x, p.y, p.z, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "particle", depth: proj.depth, data: { ...p, proj } });
    }

    // Popups
    for (const p of s.popups) {
      const proj = project(p.x, p.y, p.z, s.cx, s.cy, s.sc, s.camAngle);
      objs.push({ type: "popup", depth: proj.depth, data: { ...p, proj } });
    }

    objs.sort((a, b) => a.depth - b.depth);

    for (const obj of objs) {
      if (obj.type === "tracksurf") {
        const { io1, io2, ii1, ii2 } = obj.data;
        ctx.beginPath(); ctx.moveTo(io1.px, io1.py); ctx.lineTo(io2.px, io2.py); ctx.lineTo(ii2.px, ii2.py); ctx.lineTo(ii1.px, ii1.py); ctx.closePath();
        ctx.fillStyle = "rgba(18,12,45,0.75)"; ctx.fill();
      }
      if (obj.type === "trackborder") {
        const { p1, p2, ring } = obj.data;
        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = ring === 0 ? "rgba(168,85,247,0.45)" : "rgba(99,102,241,0.35)";
        ctx.lineWidth = ring === 0 ? 2 : 1.5;
        ctx.setLineDash(ring === 0 ? [] : [5, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (obj.type === "startfinish") {
        const { p1, p2 } = obj.data;
        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py);
        ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 4; ctx.stroke();
        ctx.setLineDash([4, 4]); ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      }
      if (obj.type === "quizgate") {
        const { proj: p, angle } = obj.data;
        const pulse = 0.7 + Math.sin(now * 0.005) * 0.3;
        const sz = Math.max(12, s.trackR * 0.08) * p.s;
        ctx.save(); ctx.translate(p.px, p.py);
        // Gate ring
        ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250,204,21,${pulse})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = "#facc15"; ctx.shadowBlur = 20 * pulse;
        ctx.stroke();
        ctx.shadowBlur = 0;
        // Question mark
        ctx.font = `900 ${sz * 0.9}px "Arial Black", sans-serif`;
        ctx.fillStyle = `rgba(250,204,21,${pulse})`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("?", 0, 0);
        // Label
        ctx.font = `800 ${Math.max(7, sz * 0.3)}px "Arial", sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("TANTANGAN", 0, sz + 10);
        ctx.restore();
      }
      if (obj.type === "token") {
        const t = obj.data;
        const p = t.proj;
        const pulse = 1 + Math.sin(now * 0.004 + t.bob) * 0.08;
        const sz = Math.max(7, s.trackR * 0.038) * p.s;
        const textW = ctx.measureText(`${t.good ? "+" : "−"} ${t.word}`).width;
        const pw = textW + 16, ph = sz * 1.5;
        ctx.save(); ctx.translate(p.px, p.py); ctx.scale(pulse, pulse);
        // Shadow
        ctx.beginPath(); ctx.ellipse(0, ph * 0.4, pw * 0.35, ph * 0.12, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fill();
        // Glow
        ctx.shadowColor = t.good ? "#22d3ee" : "#f43f5e"; ctx.shadowBlur = 12 * pulse;
        // Pill
        ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, ph / 2);
        const g = ctx.createLinearGradient(-pw / 2, 0, pw / 2, 0);
        g.addColorStop(0, t.good ? "rgba(34,211,238,0.9)" : "rgba(251,113,133,0.9)");
        g.addColorStop(1, t.good ? "rgba(14,165,233,0.9)" : "rgba(225,29,72,0.9)");
        ctx.fillStyle = g; ctx.fill();
        ctx.shadowBlur = 0;
        // Highlight
        ctx.beginPath(); ctx.roundRect(-pw / 2 + 2, -ph / 2 + 1, pw - 4, ph * 0.3, ph * 0.12); ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fill();
        // Text
        ctx.font = `800 ${sz * 0.8}px "Arial Black", sans-serif`; ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`${t.good ? "+" : "−"} ${t.word}`, 0, 1);
        ctx.restore();
      }
      if (obj.type === "obstacle") {
        const ob = obj.data;
        const p = ob.proj;
        const sz = Math.max(10, s.trackR * 0.05) * p.s;
        ctx.save(); ctx.translate(p.px, p.py);
        // Warning triangle
        ctx.beginPath(); ctx.moveTo(0, -sz); ctx.lineTo(-sz * 0.8, sz * 0.5); ctx.lineTo(sz * 0.8, sz * 0.5); ctx.closePath();
        ctx.fillStyle = "rgba(249,115,22,0.85)";
        ctx.shadowColor = "#f97316"; ctx.shadowBlur = 12;
        ctx.fill(); ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();
        // Exclamation
        ctx.font = `900 ${sz * 0.7}px "Arial Black", sans-serif`;
        ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("!", 0, sz * 0.15);
        ctx.restore();
      }
      if (obj.type === "kart") {
        const d = obj.data;
        const p = d.proj;
        const sz = Math.max(9, s.trackR * 0.055) * p.s;
        ctx.save(); ctx.translate(p.px, p.py);
        // Shadow
        ctx.beginPath(); ctx.ellipse(2, sz * 0.45, sz * 0.45, sz * 0.12, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fill();
        ctx.rotate((d.angle || 0) + Math.PI / 2);
        // Glow
        ctx.shadowColor = d.glow; ctx.shadowBlur = d.isPlayer ? 18 : 10;
        // Body
        ctx.beginPath(); ctx.roundRect(-sz * 0.32, -sz * 0.6, sz * 0.64, sz * 1.2, sz * 0.16);
        const bg = ctx.createLinearGradient(0, -sz * 0.6, 0, sz * 0.6); bg.addColorStop(0, d.glow); bg.addColorStop(1, d.color);
        ctx.fillStyle = bg; ctx.fill();
        // Highlight
        ctx.beginPath(); ctx.roundRect(-sz * 0.22, -sz * 0.5, sz * 0.44, sz * 0.4, sz * 0.1); ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fill();
        ctx.shadowBlur = 0;
        // Head
        ctx.beginPath(); ctx.arc(0, -sz * 0.12, sz * 0.2, 0, Math.PI * 2); ctx.fillStyle = "#f1c9a5"; ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.2; ctx.stroke();
        // Eyes
        ctx.fillStyle = "#1e293b"; ctx.beginPath(); ctx.arc(-sz * 0.06, -sz * 0.14, sz * 0.04, 0, Math.PI * 2); ctx.arc(sz * 0.06, -sz * 0.14, sz * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(-sz * 0.05, -sz * 0.15, sz * 0.013, 0, Math.PI * 2); ctx.arc(sz * 0.07, -sz * 0.15, sz * 0.013, 0, Math.PI * 2); ctx.fill();
        // Wheels
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(-sz * 0.42, -sz * 0.38, sz * 0.14, sz * 0.1); ctx.fillRect(sz * 0.28, -sz * 0.38, sz * 0.14, sz * 0.1);
        ctx.fillRect(-sz * 0.42, sz * 0.28, sz * 0.14, sz * 0.1); ctx.fillRect(sz * 0.28, sz * 0.28, sz * 0.14, sz * 0.1);
        ctx.fillStyle = `${d.glow}33`; ctx.fillRect(-sz * 0.42, -sz * 0.38, sz * 0.14, sz * 0.1); ctx.fillRect(sz * 0.28, -sz * 0.38, sz * 0.14, sz * 0.1);
        ctx.restore();
        // Player arrow
        if (d.isPlayer) {
          ctx.save(); ctx.translate(p.px, p.py - sz * 0.85); ctx.translate(0, Math.sin(now * 0.005) * 3);
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, -7); ctx.lineTo(4, -7); ctx.closePath();
          ctx.fillStyle = d.glow; ctx.shadowColor = d.glow; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;
          ctx.restore();
        }
      }
      if (obj.type === "particle") {
        const p = obj.data;
        ctx.globalAlpha = p.life / p.max;
        ctx.beginPath(); ctx.arc(p.proj.px, p.proj.py, p.size * (p.life / p.max) * p.proj.s, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
      }
      if (obj.type === "popup") {
        const p = obj.data;
        ctx.globalAlpha = p.life / 60;
        ctx.font = `900 ${Math.max(10, s.trackR * 0.05) * p.proj.s}px "Arial Black", sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.fillStyle = p.color; ctx.fillText(p.text, p.proj.px, p.proj.py);
        ctx.shadowBlur = 0;
      }
    }
    ctx.globalAlpha = 1;

    // Center label
    const cp = project(0, 0, 0, s.cx, s.cy, s.sc, s.camAngle);
    ctx.font = `900 ${Math.max(12, s.trackR * 0.09)}px "Arial Black", sans-serif`;
    ctx.fillStyle = "rgba(168,85,247,0.12)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("PRIMA+", cp.px, cp.py);

    // Countdown
    if (s.cdVal > 0) {
      ctx.font = `900 ${Math.min(w, h) * 0.28}px "Arial Black", sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 40; ctx.fillStyle = "white";
      ctx.fillText(String(s.cdVal), w / 2, h * 0.33); ctx.shadowBlur = 0;
    } else if (s.cdVal === 0) {
      ctx.font = `900 ${Math.min(w, h) * 0.2}px "Arial Black", sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = "#22c55e"; ctx.shadowBlur = 40; ctx.fillStyle = "#22c55e";
      ctx.fillText("GO!", w / 2, h * 0.33); ctx.shadowBlur = 0;
    }

    // Vignette
    const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.6);
    vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = vig; ctx.fillRect(0, 0, w, h);

    // Combo display
    if (s.combo > 1) {
      ctx.font = `900 ${Math.max(14, w * 0.02)}px "Arial Black", sans-serif`;
      ctx.textAlign = "right"; ctx.textBaseline = "top";
      ctx.fillStyle = "#facc15"; ctx.shadowColor = "#facc15"; ctx.shadowBlur = 10;
      ctx.fillText(`COMBO x${s.combo}`, w - 16, h * 0.48);
      ctx.shadowBlur = 0;
    }
  };

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0]; const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    touch.current = { active: true, sx: t.clientX - r.left, steerX: 0, gas: (t.clientY - r.top) < r.height * 0.55, brake: (t.clientY - r.top) >= r.height * 0.55 };
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); if (!touch.current.active) return;
    const t = e.touches[0]; const r = containerRef.current?.getBoundingClientRect(); if (!r) return;
    const x = t.clientX - r.left, y = t.clientY - r.top;
    touch.current.steerX = Math.max(-1, Math.min(1, (x - touch.current.sx) / (r.width * 0.1)));
    touch.current.gas = y < r.height * 0.55; touch.current.brake = y >= r.height * 0.55;
  }, []);
  const onTouchEnd = useCallback(() => { touch.current = { active: false, steerX: 0, gas: false, brake: false, sx: 0 }; }, []);

  const ch = CHALLENGES[quizQ];

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", touchAction: "none" }}>
      <canvas ref={canvasRef} width={dims.w} height={dims.h} style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />

      {/* INSTRUCTIONS OVERLAY */}
      {showInstructions && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.9)", backdropFilter: "blur(16px)", zIndex: 200 }}>
          <div style={{ padding: "32px 36px", borderRadius: 24, background: "rgba(15,15,50,0.95)", border: "1px solid rgba(124,58,237,0.4)", maxWidth: 520, width: "92%", textAlign: "center", animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <p style={{ fontFamily: "'Arial Black'", fontSize: 28, fontWeight: 900, color: "white", margin: "0 0 4px" }}>🏁 Language Kart</p>
            <p style={{ fontFamily: "Arial", fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>Balapan + Edukasi Bahasa Indonesia</p>

            <div style={{ display: "grid", gap: 12, textAlign: "left", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>⌨️</span>
                <div>
                  <p style={{ fontFamily: "'Arial Black'", fontSize: 14, color: "#22d3ee", margin: "0 0 2px" }}>Kontrol</p>
                  <p style={{ fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>
                    <b style={{ color: "white" }}>WASD / Panah</b> = Setir kart<br/>
                    <b style={{ color: "white" }}>Spasi</b> = Drift (belok tajam)<br/>
                    <b style={{ color: "white" }}>HP</b> = Sentuh kiri/kanan = setir, atas = gas, bawah = rem
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>💎</span>
                <div>
                  <p style={{ fontFamily: "'Arial Black'", fontSize: 14, color: "#22d3ee", margin: "0 0 2px" }}>Kata Terapung</p>
                  <p style={{ fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>
                    <b style={{ color: "#22d3ee" }}>Biru</b> = kata Indonesia yang baik → <b style={{ color: "#22d3ee" }}>+10</b><br/>
                    <b style={{ color: "#f43f5e" }}>Merah</b> = bahasa gaul/asing → <b style={{ color: "#f43f5e" }}>-6</b> + kart melambat
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>❓</span>
                <div>
                  <p style={{ fontFamily: "'Arial Black'", fontSize: 14, color: "#facc15", margin: "0 0 2px" }}>Tantangan Bahasa</p>
                  <p style={{ fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>
                    Lewati gerbang <b style={{ color: "#facc15" }}>?</b> = quiz muncul.<br/>
                    Jawab benar = <b style={{ color: "#22c55e" }}>+20 poin + speed boost</b><br/>
                    Jawab salah = <b style={{ color: "#f43f5e" }}>-5 poin + kart melambat</b>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>⚠️</span>
                <div>
                  <p style={{ fontFamily: "'Arial Black'", fontSize: 14, color: "#f97316", margin: "0 0 2px" }}>Rintangan</p>
                  <p style={{ fontFamily: "Arial", fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>
                    Hati-hati dengan <b style={{ color: "#f97316" }}>segi tiga oranye</b> di track!<br/>
                    Itu rintangan bahasa gaul — nabrak = kart melambat drastis.
                  </p>
                </div>
              </div>
            </div>

            <p style={{ fontFamily: "Arial", fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "0 0 18px" }}>🎯 Selesaikan 3 lap dalam 90 detik. Kumpulkan poin sebanyak mungkin!</p>

            <button onClick={() => { setShowInstructions(false); showInstructionsRef.current = false; }}
              style={{ padding: "16px 40px", borderRadius: 16, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Arial Black'", fontSize: 18, fontWeight: 900, cursor: "pointer", letterSpacing: "0.05em", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
              MULAI BALAPAN 🏁
            </button>
          </div>
        </div>
      )}

      {/* HUD */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", gap: 6, zIndex: 30, pointerEvents: "none", flexWrap: "wrap" }}>
        {[{ l: "SKOR", v: raceScore, c: "#22d3ee", i: "★" }, { l: "WAKTU", v: `${time}s`, c: time <= 10 ? "#ef4444" : "#f43f5e", i: "⏱" }, { l: "POS", v: `${position}/4`, c: "#a855f7", i: "🏁" }, { l: "LAP", v: `${Math.min(lap + 1, 3)}/3`, c: "#22c55e", i: "🔄" }, { l: "BENAR", v: correctCount, c: "#facc15", i: "📝" }].map(it => (
          <div key={it.l} style={{ padding: "4px 10px", borderRadius: 10, background: "rgba(10,10,30,0.88)", border: `1px solid ${it.c}40`, backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12 }}>{it.i}</span>
            <div><div style={{ fontFamily: "Arial", fontSize: 7, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.1em" }}>{it.l}</div>
              <div style={{ fontFamily: "'Arial Black'", fontSize: 12, color: it.c, fontWeight: 900, lineHeight: 1 }}>{it.v}</div></div>
          </div>
        ))}
      </div>

      {/* Speed */}
      <div style={{ position: "absolute", bottom: 32, left: 10, zIndex: 30, display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 8, background: "rgba(10,10,30,0.85)", border: "1px solid rgba(124,58,237,0.3)" }}>
        <span style={{ fontFamily: "'Arial Black'", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>SPD</span>
        <div style={{ width: 70, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${Math.min(speed * 118, 100)}%`, height: "100%", borderRadius: 3, background: drifting ? "linear-gradient(90deg,#f97316,#ef4444)" : "linear-gradient(90deg,#22c55e,#06b6d4)", transition: "width 0.08s", boxShadow: drifting ? "0 0 8px #f97316" : "0 0 8px #22c55e" }} />
        </div>
        {drifting && <span style={{ fontFamily: "'Arial Black'", fontSize: 8, color: "#f97316", textShadow: "0 0 8px #f97316" }}>DRIFT!</span>}
        {S.current.boostTimer > 0 && <span style={{ fontFamily: "'Arial Black'", fontSize: 8, color: "#22d3ee", textShadow: "0 0 8px #22d3ee" }}>BOOST!</span>}
      </div>

      {!over && !quizActive && (
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", zIndex: 30, padding: "2px 8px", borderRadius: 6, background: "rgba(10,10,30,0.6)", whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: "Arial", fontSize: 8, color: "rgba(255,255,255,0.3)" }}>WASD/Arrows · Spasi drift · Kumpul kata (+10) · Hindari bahasa asing (-6) · Lewati ? untuk quiz (+20)</span>
        </div>
      )}

      {/* QUIZ OVERLAY */}
      {quizActive && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.85)", backdropFilter: "blur(12px)", zIndex: 100 }}>
          <div style={{ padding: "28px 32px", borderRadius: 20, background: "rgba(15,15,50,0.95)", border: "1px solid rgba(250,204,21,0.4)", maxWidth: 560, width: "92%", animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            {/* Timer bar */}
            <div style={{ width: "100%", height: 5, borderRadius: 3, background: "rgba(255,255,255,0.1)", marginBottom: 18 }}>
              <div style={{ width: `${(quizTimer / 20) * 100}%`, height: "100%", borderRadius: 3, background: quizTimer <= 5 ? "#ef4444" : "#facc15", transition: "width 1s linear" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "'Arial Black'", fontSize: 13, color: "#facc15", letterSpacing: "0.08em" }}>TANTANGAN BAHASA</span>
              <span style={{ fontFamily: "'Arial Black'", fontSize: 18, color: quizTimer <= 5 ? "#ef4444" : "#facc15" }}>{quizTimer}s</span>
            </div>

            <p style={{ fontFamily: "'Arial Black'", fontSize: 20, color: "white", margin: "0 0 20px", lineHeight: 1.4 }}>{ch.q}</p>

            <div style={{ display: "grid", gap: 10 }}>
              {ch.opts.map((opt, i) => {
                let bg = "rgba(255,255,255,0.06)";
                let border = "rgba(255,255,255,0.1)";
                let txtColor = "rgba(255,255,255,0.85)";
                if (quizAnswered) {
                  if (i === ch.ans) { bg = "rgba(34,197,94,0.2)"; border = "#22c55e"; txtColor = "#22c55e"; }
                  else if (i === selectedOpt && i !== ch.ans) { bg = "rgba(239,68,68,0.2)"; border = "#ef4444"; txtColor = "#ef4444"; }
                } else if (i === selectedOpt) { bg = "rgba(250,204,21,0.15)"; border = "#facc15"; }
                return (
                  <button key={i} onClick={() => !quizAnswered && answerQuiz(i)} disabled={quizAnswered}
                    style={{ padding: "14px 18px", borderRadius: 12, background: bg, border: `1px solid ${border}`, color: txtColor, fontFamily: "Arial", fontSize: 15, fontWeight: 600, textAlign: "left", cursor: quizAnswered ? "default" : "pointer", transition: "all 0.15s", lineHeight: 1.3 }}>
                    <span style={{ fontFamily: "'Arial Black'", fontSize: 13, color: "rgba(255,255,255,0.35)", marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizAnswered && (
              <>
                <div style={{ marginTop: 16, padding: "12px 16px", borderRadius: 12, background: selectedOpt >= 0 && selectedOpt === ch.ans ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${selectedOpt >= 0 && selectedOpt === ch.ans ? "#22c55e44" : "#ef444444"}` }}>
                  <p style={{ fontFamily: "'Arial Black'", fontSize: 14, color: selectedOpt >= 0 && selectedOpt === ch.ans ? "#22c55e" : "#ef4444", margin: 0, fontWeight: 900 }}>
                    {selectedOpt >= 0 && selectedOpt === ch.ans ? "✓ Benar! +20 poin" : (selectedOpt < 0 ? "WAKTU HABIS!" : "✗ Salah! -5 poin")}
                  </p>
                  <p style={{ fontFamily: "Arial", fontSize: 13, color: "rgba(255,255,255,0.6)", margin: "6px 0 0", lineHeight: 1.4 }}>{ch.tip}</p>
                </div>
                <button onClick={continueQuiz} style={{ marginTop: 14, width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "white", fontFamily: "'Arial Black'", fontSize: 15, fontWeight: 900, cursor: "pointer", letterSpacing: "0.05em" }}>
                  LANJUTKAN → (atau tekan Enter)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {over && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(5,5,20,0.88)", backdropFilter: "blur(16px)", zIndex: 50 }}>
          <div style={{ padding: "28px 40px", borderRadius: 20, background: "rgba(15,15,45,0.95)", border: "1px solid rgba(124,58,237,0.5)", textAlign: "center", animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <p style={{ fontFamily: "'Arial Black'", fontSize: "2.2rem", fontWeight: 900, color: "white", margin: 0 }}>SELESAI!</p>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", margin: "14px 0" }}>
              <div><p style={{ fontFamily: "Arial", fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>SKOR</p><p style={{ fontFamily: "'Arial Black'", fontSize: "1.4rem", color: "#22d3ee", fontWeight: 900, margin: 0 }}>{raceScore}</p></div>
              <div><p style={{ fontFamily: "Arial", fontSize: 9, color: "rgba(255,255,255,0.4)", margin: 0 }}>BENAR</p><p style={{ fontFamily: "'Arial Black'", fontSize: "1.4rem", color: "#22c55e", fontWeight: 900, margin: 0 }}>{correctCount}</p></div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes popIn{0%{opacity:0;transform:scale(0.85)}100%{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}
