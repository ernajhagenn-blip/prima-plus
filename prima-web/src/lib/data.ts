export type LikertOption = "SS" | "S" | "TS" | "STS";

export const LIKERT_OPTIONS: { value: string; label: string; score: number }[] = [
  { value: "SS", label: "SS", score: 4 },
  { value: "S", label: "S", score: 3 },
  { value: "TS", label: "TS", score: 2 },
  { value: "STS", label: "STS", score: 1 },
];

export const LOYALTY_DIMENSIONS = [
  "Sikap positif",
  "Kesetiaan penggunaan",
  "Kesadaran norma",
  "Kebanggaan bahasa",
  "Pemilihan ragam",
];

export const GAME_CONSTRUCTS = [
  "Kesadaran konteks",
  "Kesadaran norma",
  "Kesadaran ragam",
  "Refleksi diri",
  "Kesadaran makna",
  "Komitmen identitas",
];

export interface QuestionnaireItem {
  id: number;
  dimension: string;
  statement: string;
}

export const LOYALTY_ITEMS: QuestionnaireItem[] = [
  { id: 1, dimension: "Sikap positif", statement: "Bahasa Indonesia tetap penting digunakan di media sosial meskipun banyak istilah asing yang populer." },
  { id: 2, dimension: "Sikap positif", statement: "Saya merasa bahasa Indonesia yang baik menunjukkan identitas sebagai pelajar Indonesia." },
  { id: 3, dimension: "Sikap positif", statement: "Penggunaan bahasa Indonesia yang benar lebih membanggakan daripada campur kode Inggris-Indonesia." },
  { id: 4, dimension: "Sikap positif", statement: "Menurut saya, bahasa Indonesia tidak kalah modern dibandingkan bahasa asing." },
  { id: 5, dimension: "Kesetiaan penggunaan", statement: "Saya memilih menggunakan bahasa Indonesia saat menulis tugas sekolah meskipun teman-teman banyak menggunakan istilah asing." },
  { id: 6, dimension: "Kesetiaan penggunaan", statement: "Saya tetap menggunakan bahasa Indonesia dalam diskusi kelompok meskipun ada teman yang menyelipkan bahasa Inggris." },
  { id: 7, dimension: "Kesetiaan penggunaan", statement: "Saya berusaha menghindari penggunaan singkatan tidak baku (misal: \"yg\", \"dg\", \"pdhl\") dalam komunikasi formal." },
  { id: 8, dimension: "Kesetiaan penggunaan", statement: "Saya lebih memilih menulis caption Indonesia yang baik daripada menulis dalam bahasa Inggris agar terlihat keren." },
  { id: 9, dimension: "Kesadaran norma", statement: "Saya dapat membedakan kapan harus menggunakan bahasa Indonesia formal dan kapan boleh menggunakan bahasa santai." },
  { id: 10, dimension: "Kesadaran norma", statement: "Saya menyadari bahwa bahasa gaul tidak selalu tepat digunakan di lingkungan sekolah." },
  { id: 11, dimension: "Kesadaran norma", statement: "Menurut saya, menggunakan campur kode Indonesia-Inggris secara berlebihan dapat mengurangi kualitas komunikasi." },
  { id: 12, dimension: "Kesadaran norma", statement: "Saya memahami bahwa pemilihan kata perlu disesuaikan dengan siapa saya berbicara (guru, teman, atau orang tua)." },
  { id: 13, dimension: "Kebanggaan bahasa", statement: "Saya bangga ketika mampu menulis atau berbicara dalam bahasa Indonesia yang baik dan benar." },
  { id: 14, dimension: "Kebanggaan bahasa", statement: "Saya merasa senang ketika ada teman yang memuji cara saya berbahasa Indonesia." },
  { id: 15, dimension: "Kebanggaan bahasa", statement: "Saya percaya diri menggunakan bahasa Indonesia dalam presentasi di kelas." },
  { id: 16, dimension: "Kebanggaan bahasa", statement: "Menurut saya, mampu berbahasa Indonesia dengan baik adalah sesuatu yang patut dibanggakan." },
  { id: 17, dimension: "Pemilihan ragam", statement: "Saya menyesuaikan bahasa yang saya gunakan saat berbicara dengan guru berbeda dengan saat berbicara dengan teman." },
  { id: 18, dimension: "Pemilihan ragam", statement: "Saya memilih kata yang lebih formal saat menulis pengumuman sekolah daripada saat menulis status WhatsApp." },
  { id: 19, dimension: "Pemilihan ragam", statement: "Saya mampu mengubah kalimat tidak baku menjadi kalimat baku tanpa mengubah maksudnya." },
  { id: 20, dimension: "Pemilihan ragam", statement: "Saya mempertimbangkan konteks dan lawan bicara sebelum memilih ragam bahasa yang akan digunakan." },
];

export interface ScenarioOption {
  key: string;
  text: string;
  correct: boolean;
}

export interface Scenario {
  id: number;
  construct: string;
  caseType: string;
  task: string;
  situation: string;
  options: ScenarioOption[];
  feedback: string;
}

// Kuis PRIMA+ (CHOOSE) — 8 game sesuai Rancangan_Isi_PRIMA_Plus_Detail bagian E.
// Setiap game menilai aspek tertentu; sistem tidak menganggap "formal selalu terbaik",
// melainkan kesesuaian konteks, kejelasan, dan kesantunan.
export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    construct: "Context Switch — kesesuaian konteks, kesantunan, kejelasan",
    caseType: "Game 1 — Context Switch",
    task: "Pesan berikut harus diubah untuk disampaikan kepada guru (mengajak diskusi kelompok). Pilih bentuk yang paling tepat.",
    situation: "Pesan awal ke teman: \"Nanti main ke rumah gue ya!\"",
    options: [
      { key: "a", text: "\"Bu, nanti boleh main ke rumah Bu?\"", correct: false },
      { key: "b", text: "\"Ibu, apakah Bapak/Ibu berkenan jika kami mengadakan diskusi kelompok di rumah saya?\"", correct: true },
      { key: "c", text: "\"Nanti gathering kelompok di rumah gue, Bu ikut ya?\"", correct: false },
    ],
    feedback: "Berganti lawan bicara (teman → guru) menuntut perubahan ragam: lebih formal, sopan, dan jelas. Bahasa efektif bergantung relasi dan tujuan, bukan sekadar 'bahasa Indonesia selalu terbaik'.",
  },
  {
    id: 2,
    construct: "Chat Detective — kejelasan, maksud, tanda baca, pilihan kata",
    caseType: "Game 2 — Chat Detective",
    task: "Temamu membalas pesan singkatmu dengan \"kok bengong? marah ya?\". Pilih revisi pesan awalmu agar tidak salah tafsir.",
    situation: "Pesan awalmu ke teman: \"ok\". (Padahal maksudmu hanya setuju.)",
    options: [
      { key: "a", text: "\"ok\"", correct: false },
      { key: "b", text: "\"oke, setuju kok. santai aja, aku nggak marah\"", correct: true },
      { key: "c", text: "\"ok.\"", correct: false },
    ],
    feedback: "Tanpa nada dan ekspresi, pesan singkat mudah salah tafsir. Menambahkan konteks singkat ('setuju, santai aja') menjaga kejelasan dan maksud pesan.",
  },
  {
    id: 3,
    construct: "Code-Mixing Mirror — kesadaran code-mixing",
    caseType: "Game 3 — Code-Mixing Mirror",
    task: "Tentukan pernyataan yang paling tepat tentang percakapan berikut.",
    situation: "Percakapan: \"Guys, meetingnya di kafe jam 4 ya, nanti aku bring materinya.\"",
    options: [
      { key: "a", text: "Itu salah karena tidak boleh pakai bahasa asing sama sekali.", correct: false },
      { key: "b", text: "Itu wajar sebagai campur kode, asalkan lawan bicara dan konteksnya mendukung serta pesan tetap jelas.", correct: true },
      { key: "c", text: "Itu selalu menunjukkan pengguna tidak bisa bahasa Indonesia.", correct: false },
    ],
    feedback: "Campur kode lazim di kalangan remaja dan tidak otomatis salah. Yang penting: sadari alasannya (kebiasaan/tren/ekspresif) dan pastikan pesan tetap efektif untuk konteksnya.",
  },
  {
    id: 4,
    construct: "Caption Lab — tujuan komunikasi & kesesuaian audiens",
    caseType: "Game 4 — Caption Lab",
    task: "Pilih caption yang paling sesuai untuk audiens resmi (akun sekolah).",
    situation: "Kamu membuat pengumuman kegiatan sekolah di akun resmi sekolah.",
    options: [
      { key: "a", text: "\"Yuk ikut lomba, seru banget guys! DM aja ya\"", correct: false },
      { key: "b", text: "\"Diberitahukan kepada seluruh siswa: pendaftaran lomba dibuka hingga Jumat. Silakan hubungi panitia.\"", correct: true },
      { key: "c", text: "\"Our competition is open, join now guys!\"", correct: false },
    ],
    feedback: "Caption untuk audiens resmi menuntut ragam baku dan informasi jelas. Media sosial boleh santai, tetapi tujuan komunikasi resmi menuntut keformalan.",
  },
  {
    id: 5,
    construct: "Meaning Matters — pragmatik: maksud, konteks, implikasi",
    caseType: "Game 5 — Meaning Matters",
    task: "Kalimat berikut kemungkinan besar bermaksud...",
    situation: "Seseorang berkata: \"Wah, rapi sekali mejamu.\" (Padahal mejamu biasanya berantakan.)",
    options: [
      { key: "a", text: "Pujian bahwa meja selalu rapi.", correct: false },
      { key: "b", text: "Komentar bahwa meja biasanya berantakan, sehingga hari ini terlihat berbeda (bisa sindiran).", correct: true },
      { key: "c", text: "Perintah untuk merapikan meja.", correct: false },
    ],
    feedback: "Pragmatik mengajarkan bahwa makna bergantung konteks. Kalimat bisa bersifat sindiran, bukan pujian harfiah. Memahami maksud tersembunyi penting agar komunikasi tidak salah paham.",
  },
  {
    id: 6,
    construct: "Language Under Pressure — keputusan spontan & kebiasaan bahasa",
    caseType: "Game 6 — Language Under Pressure",
    task: "Guru menelepon mendadak: \"Nak, tolong ingatkan teman-teman, besok dikumpulkan.\" Pilih balasan singkat yang paling tepat.",
    situation: "Situasi mendesak melalui telepon dari guru.",
    options: [
      { key: "a", text: "\"siap Bu, nanti saya ingatkan semuanya\"", correct: true },
      { key: "b", text: "\"ok\"", correct: false },
      { key: "c", text: "\"ya nanti lah\"", correct: false },
    ],
    feedback: "Dalam situasi mendesak, kebiasaan bahasa tetap menuntut kejelasan dan kesopanan. Balasan singkat yang jelas dan santun lebih efektif daripada sekadar 'ok'.",
  },
  {
    id: 7,
    construct: "Identity Choice — alasan pilihan & sikap terhadap bahasa",
    caseType: "Game 7 — Identity Choice",
    task: "Di media sosial banyak yang menulis 'slay', 'bestie', atau istilah asing, tetapi untuk pengumuman kelas kamu perlu menulis info. Pilihan yang paling mencerminkan sikap loyalitas berbahasa yang sadar adalah...",
    situation: "Dilema: tren bahasa asing/slang vs bahasa Indonesia vs bahasa daerah dalam konteks berbeda.",
    options: [
      { key: "a", text: "Selalu pakai bahasa asing agar terlihat keren di semua situasi.", correct: false },
      { key: "b", text: "Gunakan bahasa Indonesia yang jelas untuk pengumuman kelas, dan bebas pakai slang di obrolan pribadi bila tetap sopan.", correct: true },
      { key: "c", text: "Tolak semua bahasa daerah dan asing karena dianggap musuh.", correct: false },
    ],
    feedback: "Loyalitas berbahasa bukan menolak bahasa asing/daerah, melainkan memilih bahasa secara sadar sesuai konteks dan tujuan. Bahasa Indonesia yang tepat untuk pengumuman resmi.",
  },
  {
    id: 8,
    construct: "PRIMA Mission — rubrik gabungan: konteks, kejelasan, kesantunan",
    caseType: "Game 8 — PRIMA Mission",
    task: "Misi menggabungkan tiga situasi. Urutan pilihan ragam yang paling tepat adalah...",
    situation: "Tugas: (1) meminta izin ke guru lewat chat, (2) mengumumkan kegiatan di grup kelas, (3) menulis caption kegiatan di akun sekolah.",
    options: [
      { key: "a", text: "Pengumuman santai → chat ke guru santai → caption asing", correct: false },
      { key: "b", text: "Chat ke guru sopan & jelas → pengumuman kelas baku & runtut → caption sekolah baku & informatif", correct: true },
      { key: "c", text: "Semua pakai bahasa asing karena lebih modern", correct: false },
    ],
    feedback: "PRIMA Mission menggabungkan situasi sekolah hingga media sosial. Penilaian gabungan: kesesuaian konteks, kejelasan, dan kesantunan harus konsisten di setiap situasi.",
  },
];

// Refleksi terstruktur (D.6) — ditanyakan setelah semua game selesai.
export const GAME_REFLECTION_QUESTIONS: string[] = [
  "Apa alasan pilihanmu dalam mengerjakan game PRIMA+ tadi?",
  "Apakah pilihanmu dipengaruhi tren atau lingkungan sekitar?",
  "Apakah pesan yang kamu pilih mudah dipahami oleh lawan bicara?",
  "Apakah kamu akan memilih cara berbahasa yang sama di situasi lain? Mengapa?",
];

export interface ResponseItem {
  id: number;
  statement: string;
}

export const RESPONSE_ITEMS: ResponseItem[] = [
  { id: 1, statement: "PRIMA+ mudah saya akses dan gunakan." },
  { id: 2, statement: "Tampilan PRIMA+ menarik dan tidak membosankan." },
  { id: 3, statement: "Soal-soal di PRIMA+ membantu saya memahami konteks bahasa." },
  { id: 4, statement: "Saya mendapat wawasan baru tentang penggunaan bahasa Indonesia yang tepat." },
  { id: 5, statement: "Saya merasa lebih percaya diri memilih ragam bahasa setelah menggunakan PRIMA+." },
  { id: 6, statement: "Saya akan merekomendasikan PRIMA+ kepada teman-teman saya." },
];

export interface EduModule {
  title: string;
  dimension: string;
  body: string;
}

// Materi edukasi PRIMA+ — disusun mengikuti model Rancangan_Isi_PRIMA_Plus_Detail:
// topik bagian F (12 topik konten), prinsip KNOW ("mengapa", bukan cuma "bentuk benar"),
// dan satu pertanyaan refleksi di tiap modul (gaya REALIZE/REFLECT).
// Disimpan ke tabel edu_modules saat DB pertama dibuat; bisa ditambah/ubah/hapus via admin.
export const EDU_SEED: EduModule[] = [
  {
    title: "Bahasa Indonesia sebagai Identitas dan Pemersatu",
    dimension: "Kebanggaan bahasa",
    body: "Bahasa Indonesia bukan sekadar kumpulan kata, melainkan lambang identitas nasional dan alat pemersatu beragam suku di Indonesia.\n\nMengapa kita memilikinya? Bahasa ini dipilih agar warga dari berbagai daerah dapat berkomunikasi setara tanpa ada yang merasa bahasanya diunggulkan. Itulah sebabnya menggunakannya dengan tepat adalah bentuk penghargaan terhadap sesama warga negara.\n\nKesadaran ini bukan soal 'bahasa asing itu buruk', melainkan menyadari bahwa bahasa Indonesia punya peran sosial: menyatukan dan menunjukkan siapa kita sebagai bangsa.\n\nRefleksi: Apa satu momen di mana kamu merasa 'ini bahasa Indonesiaku'? Mengapa momen itu terasa penting bagimu?",
  },
  {
    title: "Language Awareness: Fungsi, Struktur, dan Konteks",
    dimension: "Kesadaran norma",
    body: "Language awareness berarti menyadari fungsi, struktur, konteks, dan peran sosial dari bahasa yang kita pakai—bukan sekadar hafal bentuk baku.\n\nMengapa ini penting? Bahasa yang sama bisa berubah makna tergantung situasi. Kalimat untuk teman belum tentu cocok untuk guru. Maka yang dinilai bukan 'benar atau salah' secara mutlak, melainkan 'tepat atau tidak untuk konteks ini'.\n\nDengan kesadaran ini, kamu mulai memilih bahasa secara sadar, bukan karena kebiasaan semata.\n\nRefleksi: Pernahkah kamu menggunakan kalimat berbeda untuk orang berbeda dalam satu hari? Kapan dan mengapa kamu mengubahnya?",
  },
  {
    title: "Ragam Bahasa: Baku, Santai, dan Sesuai Konteks",
    dimension: "Pemilihan ragam",
    body: "Bahasa memiliki ragam: baku untuk situasi resmi (tulis, presentasi, pengumuman), dan santai untuk pergaulan akrab (obrolan, media pribadi).\n\nMengapa ada ragam? Setiap situasi punya tuntutan relasi dan tujuan yang berbeda. Pesan ke guru menuntut kesantunan formal; pesan ke teman boleh santai. Memilih ragam berarti mempertimbangkan siapa lawan bicara dan apa tujuan pesan.\n\nBefore-after: 'Bsk jm 7 kumpul d ruang kelas yaa' (santai) → 'Besok jam 7 kita kumpul di ruang kelas ya' (jelas, sopan, tetap santai namun runtut).\n\nRefleksi: Kapan terakhir kamu mengubah ragam bahasamu agar lebih pantas untuk lawan bicara tertentu?",
  },
  {
    title: "Code-Mixing dan Code-Switching pada Remaja",
    dimension: "Kesadaran norma",
    body: "Campur kode (code-mixing) adalah mencampur kata asing dalam kalimat Indonesia; alih kode (code-switching) adalah berganti ke bahasa lain sepenuhnya. Keduanya lazim di kalangan remaja, terutama di media sosial.\n\nMengapa terjadi? Bukan selalu karena 'tidak bisa bahasa Indonesia'. Sering kali karena kebiasaan, tren, lingkungan, atau sekadar lebih ekspresif. Fenomena ini wajar—yang penting menyadari kapan penggunaannya tetap efektif dan kapan sebaiknya dihindari.\n\nPRIMA+ tidak melarang campur kode, tetapi mengajak mengenali alasannya.\n\nRefleksi: Dalam percakapan terakhirmu, apakah ada kata asing? Mengapa kamu memilihnya: kebiasaan, tren, atau tidak tahu padanannya?",
  },
  {
    title: "Mengapa Kita Pakai Bahasa Asing dan Slang?",
    dimension: "Sikap positif",
    body: "Bahasa asing dan slang sering dipakai remaja karena terasa 'keren', singkat, atau bagian dari budaya populer. Itu sebabnya fenomena ini sulit dihentikan dengan larangan.\n\nMengapa memahami alasannya penting? Karena bahasa asing bukan musuh. Masalahnya bukan pemakaiannya, melainkan ketidaksadaran: memakainya di situasi yang justru menuntut bahasa Indonesia. Sikap positif berarti bangga berbahasa Indonesia sekaligus tetap bebas menyerap unsur lain secara sadar.\n\nPrinsip PRIMA+: pilih bahasa sesuai tujuan, bukan karena terpaksa menolak yang asing.\n\nRefleksi: Apa padanan bahasa Indonesia dari satu slang atau kata asing yang sering kamu pakai? Pernahkah kamu menggunakannya di situasi formal?",
  },
  {
    title: "Bahasa di Media Sosial: Caption, Chat, Komentar",
    dimension: "Pemilihan ragam",
    body: "Media sosial mengubah kebiasaan berbahasa: caption, komentar, chat, dan video menuntut bahasa singkat dan santai, namun mudah salah tafsir.\n\nMengapa mudah salah paham? Tanpa nada suara dan ekspresi, pesan singkat bisa dianggap kasar atau ambigu. Maka kejelasan dan kesantunan tetap perlu, meski mediumnya santai.\n\nBefore-after: caption 'Happy weekend guys! Let's hangout yuk!' → 'Selamat akhir pekan, teman-teman! Ayo kita jalan-jalan bersama!' (tetap ceria, namun menggunakan bahasa Indonesia).\n\nRefleksi: Pernahkah caption atau chat kamu salah dipahami orang lain? Bagaimana kamu memperbaikinya?",
  },
  {
    title: "Bahasa dan Relasi Sosial: Teman, Guru, Orang Tua",
    dimension: "Kesadaran norma",
    body: "Bahasa mencerminkan relasi: dengan teman boleh santai, dengan guru atau orang tua menuntut ragam lebih hormat, dengan orang yang belum dikenal butuh kehati-hatian.\n\nMengapa konteks relasi menentukan? Karena kesantunan dan kejelasan bergantung pada siapa lawan bicara. Kalimat untuk teman dekat bisa dianggap kurang sopan bila ditujukan pada guru.\n\nMemilih bahasa berarti mempertimbangkan relasi penutur, tujuan pesan, dan tingkat kesantunan yang diharapkan.\n\nRefleksi: Apa perbedaan cara kamu menyapa guru dan menyapa teman? Mengapa kamu membedakannya?",
  },
  {
    title: "Bahasa Daerah: Kekayaan Keberagaman Indonesia",
    dimension: "Kebanggaan bahasa",
    body: "Bahasa daerah adalah bagian dari kekayaan kebahasaan Indonesia. Menggunakannya justru menunjukkan cinta pada budaya sendiri, selain bangga berbahasa Indonesia.\n\nMengapa ini relevan dengan loyalitas berbahasa? Karena loyalitas tidak berarti menolak semua bahasa lain, termasuk daerah. Bahasa Indonesia dan bahasa daerah saling melengkapi sebagai identitas bangsa.\n\nMenyadari hal ini memperkuat sikap bahwa berbahasa yang baik adalah soal konteks dan kebanggaan, bukan penggunaan satu bahasa tertentu secara eksklusif.\n\nRefleksi: Apakah kamu bisa atau sering menggunakan bahasa daerah? Kapan kamu menggunakannya dengan bangga?",
  },
  {
    title: "Globalisasi, Budaya Populer, dan Kebiasaan Digital",
    dimension: "Kesadaran norma",
    body: "Globalisasi dan budaya populer membuat bahasa asing dan tren mudah masuk ke kebiasaan harian remaja melalui film, musik, dan media sosial.\n\nMengapa pengaruh ini kuat? Karena lingkungan digital menempatkan bahasa asing di depan mata setiap hari, sehingga terasa wajar. Kesadaran berbahasa membantumu mengenali pengaruh tersebut tanpa menolaknya.\n\nKuncinya: sadari kapan serapan asing membantu komunikasi dan kapan bahasa Indonesia lebih tepat.\n\nRefleksi: Satu pengaruh medsos atau hiburan apa yang paling mengubah cara kamu berbahasa? Apakah kamu menyadarinya?",
  },
  {
    title: "Refleksi Identitas Berbahasa",
    dimension: "Sikap positif",
    body: "Langkah terakhir: renungkan kebiasaan bahasamu sendiri. Pertanyaan kuncinya adalah 'Bahasa apa yang paling sering kupilih, kapan, dan mengapa?'\n\nMengapa refleksi penting? Karena perubahan dari 'menggunakan bahasa karena terbiasa' menjadi 'memilih bahasa karena sadar' baru terjadi bila kamu mengenali polamu sendiri.\n\nSetelah membaca materi ini, lanjut ke kuis PRIMA+ untuk melatih pilihan ragam dalam berbagai situasi.\n\nRefleksi: Bahasa apa yang paling sering kamu pilih dalam sehari? Kapan dan mengapa kamu memilihnya?",
  },
];

export function scoreResponses(answerMap: Record<string, string>): {
  total: number;
  perDimension: Record<string, { sum: number; count: number }>;
} {
  let total = 0;
  const perDimension: Record<string, { sum: number; count: number }> = {};
  for (const item of LOYALTY_ITEMS) {
    const val = answerMap[String(item.id)];
    if (!val) continue;
    const opt = LIKERT_OPTIONS.find((o) => o.value === val);
    if (!opt) continue;
    total += opt.score;
    const dim = perDimension[item.dimension] ?? { sum: 0, count: 0 };
    dim.sum += opt.score;
    dim.count += 1;
    perDimension[item.dimension] = dim;
  }
  return { total, perDimension };
}

// ============================================================================
// PRIMA+ MASTER BLUEPRINT — konten dunia PRIMA WORLD
// (Sumber: PRIMA_PLUS_MASTER_BLUEPRINT, Agustus 2026)
// ============================================================================

export interface PrimaCharacter {
  key: string;
  name: string;
  role: string;
  trait: string;
  educative: string;
  color: string;
}

export const CHARACTERS: PrimaCharacter[] = [
  { key: "KARA", name: "KARA", role: "Protagonis / avatar", trait: "Remaja digital, ekspresif, awalnya mudah mengikuti tren.", educative: "Cermin pengguna.", color: "#ef4444" },
  { key: "NARA", name: "NARA", role: "Mentor", trait: "Tenang, kritis, tidak menggurui.", educative: "Menjelaskan konsep & mengajukan pertanyaan.", color: "#0ea5e9" },
  { key: "RAKA", name: "RAKA", role: "Teman trend-driven", trait: "Cepat mengikuti tren, sering memakai campur kode.", educative: "Memunculkan konflik sosial.", color: "#f59e0b" },
  { key: "SENA", name: "SENA", role: "Context expert", trait: "Praktis, peka terhadap situasi.", educative: "Menunjukkan pentingnya konteks.", color: "#10b981" },
  { key: "MAYA", name: "MAYA", role: "Content creator", trait: "Memikirkan engagement & audiens.", educative: "Menghubungkan bahasa dengan media sosial.", color: "#a855f7" },
  { key: "BIMA", name: "BIMA", role: "Culture explorer", trait: "Tertarik pada bahasa & budaya Indonesia.", educative: "Menghubungkan bahasa dengan identitas.", color: "#14b8a6" },
  { key: "AUTO", name: "AUTO-PILOT", role: "Boss simbolik", trait: "Selalu menjawab 'karena semua orang begitu'.", educative: "Representasi kebiasaan tanpa kesadaran.", color: "#64748b" },
];

export interface SkillNode {
  key: string;
  name: string;
  meaning: string;
}

export const SKILLS: SkillNode[] = [
  { key: "context_sense", name: "Context Sense", meaning: "Mampu membaca situasi dan audiens." },
  { key: "clarity", name: "Clarity", meaning: "Mampu menyampaikan maksud dengan jelas." },
  { key: "courtesy", name: "Courtesy", meaning: "Mampu menyesuaikan kesantunan." },
  { key: "digital_awareness", name: "Digital Awareness", meaning: "Sadar terhadap pengaruh lingkungan digital." },
  { key: "language_identity", name: "Language Identity", meaning: "Memahami nilai Bahasa Indonesia & hubungannya dengan identitas." },
  { key: "critical_choice", name: "Critical Choice", meaning: "Mampu menjelaskan alasan pilihan bahasa." },
  { key: "creative_expression", name: "Creative Expression", meaning: "Mampu menggunakan Bahasa Indonesia secara kreatif." },
];

export interface FeedbackLayers {
  observation: string;
  context: string;
  languageEffect: string;
  alternative: string;
  reflection: string;
  transfer: string;
}

export interface EpisodeOption {
  key: string;
  text: string;
  best: boolean;
  feedback: FeedbackLayers;
}

export interface Episode {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  panels: { speaker: string; text: string }[];
  decisionPrompt: string;
  options: EpisodeOption[];
  cardReward: string;
  skillReward: string;
}

export const EPISODES: Episode[] = [
  {
    id: 1,
    slug: "satu-pesan-banyak-orang",
    title: "Satu Pesan, Banyak Orang",
    subtitle: "Episode 1 — Bahasa & Konteks",
    panels: [
      { speaker: "KARA", text: `Gue baru aja kirim ke grup kelas: "besok pada dateng ga? wkwk". Terus Bu Guru masuk grup dan bilang "tolong agak sopan". Gue bingung, kan emang lagi ngomong ke temen.` },
      { speaker: "NARA", text: `Nah, itu dia. Pesan yang SAMA, kalau dibaca temen itu santai. Tapi pas Bu Guru baca, dia baca sebagai muridnya. Konteksnya beda, maknanya jadi beda.` },
      { speaker: "SENA", text: `Iya. Di grup kelas kan isinya campur: ada temen, ada guru. Kadang kita lupa ada "pendengar ekstra" yang nggak kita tuju.` },
      { speaker: "NARA", text: `Bahasa yang baik bukan yang paling formal. Tapi yang PAS buat siapa kita ngomong.` },
      { speaker: "KARA", text: `Jadi salahnya bukan di isinya, tapi di siapa yang baca?` },
    ],
    decisionPrompt: `NARA: "Menurutmu, kenapa pesan yang sama bisa dianggap santai oleh teman, tapi kurang sopan oleh guru?"`,
    options: [
      {
        key: "a",
        text: "Karena siapa yang baca beda. Teman nyambung karena kita sesama anak muda; guru baca sebagai murid yang harusnya lebih hormat.",
        best: true,
        feedback: {
          observation: "Kamu sadar pesan itu bergantung pada yang membaca, bukan cuma isinya.",
          context: "Grup kelas isinya campur: teman DAN guru. Selalu ada pendengar yang nggak kita sangka.",
          languageEffect: "Satu kalimat bisa 'aman' buat satu orang, tapi 'kurang ajar' buat orang lain.",
          alternative: `Coba ubah "besok pada dateng ga? wkwk" jadi "Bu, teman-teman, besok kita kumpul ya?" — pesan sama, rasanya beda.`,
          reflection: "Pernah nggak kamu nge-chat santai tapi dibaca orang yang nggak kamu tuju?",
          transfer: "Kalau ini pengumuman sekolah, masih pas pakai 'wkwk'?",
        },
      },
      {
        key: "b",
        text: "Emang salah guru nyambungnya, kan dia yang kebaca.",
        best: false,
        feedback: {
          observation: "Kamu nyalahin guru karena dia yang 'salah tangkap'.",
          context: "Tapi guru baca pesan itu sebagai muridnya — wajar dia expect kesopanan.",
          languageEffect: "Nyalahin pendengar bikin kita lewat dari belajar: cara kita nulis ikut nimbrung.",
          alternative: "Coba lihat dari kacamata Bu Guru: apa yang dia baca?",
          reflection: "Pernah kamu merasa 'dia yang lebay', padahal cara kamu nulis kurang jelas?",
          transfer: "Di ruang publik, siapa yang paling bertanggung jawab atas maksud pesan?",
        },
      },
      {
        key: "c",
        text: "Berarti harus selalu pakai bahasa baku ke semua orang.",
        best: false,
        feedback: {
          observation: "Kamu generalize jadi 'baku selalu'.",
          context: "Ke temen dekat malah jadi kaku dan menjaga jarak.",
          languageEffect: "Satu ragam nggak cocok untuk semua relasi. Yang dicari: PAS, bukan paling formal.",
          alternative: "Pakai santai-yang-jelas ke temen, baku ke situasi resmi.",
          reflection: "Apakah formal selalu berarti tepat?",
          transfer: "Di obrolan pribadi, apakah baku masih enak didengar?",
        },
      },
    ],
    cardReward: "Pembaca Tak Terduga",
    skillReward: "context_sense",
  },
  {
    id: 2,
    slug: "ibu-nggak-paham",
    title: "Ibu Nggak Paham",
    subtitle: "Episode 2 — Code-Mixing",
    panels: [
      { speaker: "RAKA", text: `Tadi aku bilang ke ibu: "nanti aku share link meeting-nya, Bu tinggal join jam 7". Ibu malah bingung, "meeting apa, join apa". Padahal buat gue itu biasa banget.` },
      { speaker: "NARA", text: `Itu namanya campur kode: nyampur kata asing karena kebiasaan. Tapi nggak semua orang di sekitar kita nyambung.` },
      { speaker: "KARA", text: `Berarti salah ya kalau aku sering bilang "file", "deadline", "share"?` },
      { speaker: "NARA", text: `Bukan salah. Tapi sadari: ibu kamu nggak paham bukan karena 'kudet', tapi karena kata itu nggak ada di dunianya. Kita yang harus jaga.` },
      { speaker: "SENA", text: `Betul. Campur kode wajar, asal kita tau kapan lawan bicara kita nyambung dan kapan nggak.` },
    ],
    decisionPrompt: `NARA: "Pas kamu bilang ke orang tua 'kita meeting online ya', apa yang sebenarnya terjadi?"`,
    options: [
      {
        key: "a",
        text: "Aku kebiasaan pakai kata asing, tapi orang tua belum tentu nyambung. Tugasnya bukan nyalahin mereka, tapi jelasin pakai kata yang mereka paham.",
        best: true,
        feedback: {
          observation: "Kamu lihat campur kode sebagai kebiasaan, bukan kesalahan orang tua.",
          context: "Orang tua punya dunia kata yang beda; itu wajar, bukan kekurangan.",
          languageEffect: "Sadar konteks = kita yang menyesuaikan biar pesan sampai, bukan memaksa mereka 'upgrade'.",
          alternative: `Ganti "share link meeting" jadi "kirim tautan, nanti kumpul online" — tetap jelas, nggak nge-judge.`,
          reflection: "Pernah kamu jelasin sesuatu ke orang tua pakai kata simpel? Gimana rasanya?",
          transfer: "Di grup yang isinya beda-beda usia, apa yang kamu ubah?",
        },
      },
      {
        key: "b",
        text: "Ibu ku kurang update, itu salah dia.",
        best: false,
        feedback: {
          observation: "Kamu nyalahin orang tua karena nggak 'update'.",
          context: "Padahal mereka tumbuh di dunia bahasa yang beda; wajar nggak nyambung.",
          languageEffect: "Men-judge pendengar nutup pintu komunikasi, bukan mbuka.",
          alternative: "Coba jelasin pelan-pelan tanpa ngerasa dia 'kudet'.",
          reflection: "Pernah kamu disimpulkan dari cara kamu bicara?",
          transfer: "Gimana menyikapi teman yang nggak paham istilahmu?",
        },
      },
      {
        key: "c",
        text: "Berarti nggak boleh pakai kata asing sama sekali.",
        best: false,
        feedback: {
          observation: "Kamu larang campur kode sepenuhnya.",
          context: "Larangan total justru bikin komunikasi kaku dan nggak fleksibel.",
          languageEffect: "Campur kode lazim dan nggak otomatis salah bila pesan jelas bagi lawan bicara.",
          alternative: "Pisahkan: asing bila fungsional, Indonesia di ruang yang butuh kejelasan.",
          reflection: "Apakah melarang bikin orang lebih sadar?",
          transfer: "Kapan campur kode sebaiknya dihindari?",
        },
      },
    ],
    cardReward: "Jembatan Kata",
    skillReward: "context_sense",
  },
  {
    id: 3,
    slug: "takut-kudet",
    title: "Takut Kudet",
    subtitle: "Episode 3 — Asing & Citra",
    panels: [
      { speaker: "MAYA", text: `Coba lihat caption lu: "such a vibe, bestie!" Keren? Iya. Tapi jujur, lu pakai Inggris karena emang nyambung, atau takut keliatan kudet?` },
      { speaker: "KARA", text: `Hmm... jujur sih takut keliatan kudet.` },
      { speaker: "NARA", text: `Wajar. Kita sering diajarin diam-diam: bahasa asing = keren, sukses, gaul. Padahal itu cuma perasaan yang dibentuk iklan dan medsos.` },
      { speaker: "MAYA", text: `Coba deh: tulis caption yang sama, tapi pakai Indonesia. Masih keren nggak?` },
      { speaker: "KARA", text: `Kayaknya... masih bisa, asal gue yang nulis.` },
    ],
    decisionPrompt: `MAYA: "Kalau kamu pakai istilah asing di caption, alasanmu yang bener-bener jujur apa?"`,
    options: [
      {
        key: "a",
        text: "Kalau emang lebih tepat/singkat dan aku tau kenapa — oke. Tapi kalau cuma takut keliatan kudet, itu bukan pilihan, itu ketakutan.",
        best: true,
        feedback: {
          observation: "Kamu bedain antara pilihan fungsional dan ketakutan sosial.",
          context: "Kesan 'keren' dibentuk lingkungan & media, bukan dari kata itu sendiri.",
          languageEffect: "Pakai asing karena fungsi = sadar. Pakai asing karena takut = dikuasai tren.",
          alternative: `Tulis caption yang sama tanpa kata asing, tetap ceria & relevan. Lihat bedanya?`,
          reflection: "Apa yang bikin kata asing terasa 'keren' bagimu sebenarnya?",
          transfer: "Di pengumuman sekolah, apakah istilah asing itu masih tepat?",
        },
      },
      {
        key: "b",
        text: "Karena terlihat lebih keren dan semua orang pakai.",
        best: false,
        feedback: {
          observation: "Alasanmu murni persepsi sosial & tren, bukan kebutuhan.",
          context: "Kesan 'keren' dibentuk lingkungan; kalau tren berubah, 'keren'-mu ikut berubah.",
          languageEffect: "Kalau cuma ikut tren, kamu kehilangan kendali atas pilihan bahasa.",
          alternative: "Cobalah tulis caption yang sama tanpa kata asing, tetap ceria & relevan.",
          reflection: "Apa yang bikin kata asing terasa 'keren' bagimu?",
          transfer: "Jika tren berubah, apakah pilihan bahasamu ikut berubah?",
        },
      },
      {
        key: "c",
        text: "Aku hapus semua bahasa asing, bahasa Indonesia harus murni.",
        best: false,
        feedback: {
          observation: "Kamu menolak bahasa asing sepenuhnya.",
          context: "Menguasai bahasa asing adalah kemampuan bernilai, bukan musuh bahasa sendiri.",
          languageEffect: "Menghapus semua asing justru kurangi fleksibilitas komunikasimu.",
          alternative: "Pisahkan: asing bila fungsional, Indonesia sebagai pilihan utama di ruang publik.",
          reflection: "Apakah menolak asing bikinmu lebih 'loyal' pada bahasa sendiri?",
          transfer: "Di diskusi global, apakah kamu tetap menolak istilah asing?",
        },
      },
    ],
    cardReward: "Mitos: Keren Itu Pilihan",
    skillReward: "digital_awareness",
  },
  {
    id: 4,
    slug: "bukan-robot",
    title: "Bukan Robot",
    subtitle: "Episode 4 — Ragam & Diri",
    panels: [
      { speaker: "KARA", text: `Orang bilang 'loyal berbahasa' berarti bicara kayak penyiar berita. Gue nggak sanggup tiap hari 'selamat pagi bapak ibu'.` },
      { speaker: "BIMA", text: `Itu salah tangkap. Loyal bukan berarti jadi robot baku. Bahasa Indonesia itu luas: bisa becanda, santai, sampai jadi puisi.` },
      { speaker: "NARA", text: `Yang penting kamu pegang kendali. Ke temen santai, ke guru hormat, ke publik jelas. Satu bahasa, banyak wajah.` },
      { speaker: "KARA", text: `Jadi boleh santai tapi tetep 'aku'?` },
      { speaker: "BIMA", text: `Boleh banget. Yang nggak boleh cuma pasrah sama kebiasaan tanpa ngeh.` },
    ],
    decisionPrompt: `BIMA: "Bisa nggak bahasa Indonesia tetap LU punya — santai, asli — tanpa ninggalin bahasamu sendiri?"`,
    options: [
      {
        key: "a",
        text: "Bisa. Santai bukan berarti nggak sayang bahasa sendiri. Aku bisa becanda pakai Indonesia dan tetep bangga.",
        best: true,
        feedback: {
          observation: "Kamu lihat bahasa Indonesia sebagai bahasa yang hidup, bukan aturan kaku.",
          context: "Ragam beda untuk relasi & tujuan beda — semua sah asal sadar.",
          languageEffect: "Sikap ini bangun rasa memiliki, bukan rasa dihakimi.",
          alternative: `Bikin caption kegiatan sekolah yang ceria tapi tetep bahasa Indonesia.` ,
          reflection: "Kapan terakhir kamu bangga pakai bahasa Indonesia secara santai?",
          transfer: "Bisakah kamu pakai bahasa Indonesia di konten digital tanpa terasa 'kuno'?",
        },
      },
      {
        key: "b",
        text: "Nggak lah, bahasa Indonesia emang kaku buat anak muda.",
        best: false,
        feedback: {
          observation: "Kamu anggap bahasa Indonesia sebagai bahasa 'kuno'.",
          context: "Itu persepsi, bukan sifat bahasa; bahasa berkembang lewat pemakainya.",
          languageEffect: "Menjauhi bahasa sendiri justru lemahkan rasa memiliki.",
          alternative: "Lihat kreator yang pakai bahasa Indonesia dengan gaya kekinian & tetap jelas.",
          reflection: "Apa yang bikinmu merasa bahasa ini kuno?",
          transfer: "Apakah konten lokal bisa terasa modern di matamu?",
        },
      },
      {
        key: "c",
        text: "Loyal = cuma pakai bahasa baku di semua situasi.",
        best: false,
        feedback: {
          observation: "Kamu samain loyalitas dengan kekakuan ragam.",
          context: "Bahasa baku bukan satu-satunya ukuran kualitas komunikasi.",
          languageEffect: "Maksa baku di semua situasi justru terasa seperti 'pelajaran'.",
          alternative: "Pakai santai-yang-jelas untuk pergaulan; baku untuk resmi.",
          reflection: "Apakah kaku sama dengan 'benar'?",
          transfer: "Di chat dengan temen, apakah baku masih tepat?",
        },
      },
    ],
    cardReward: "Banyak Wajah Satu Bahasa",
    skillReward: "language_identity",
  },
  {
    id: 5,
    slug: "logatku-bukan-salah",
    title: "Logatku Bukan Salah",
    subtitle: "Episode 5 — Identitas & Daerah",
    panels: [
      { speaker: "BIMA", text: `Temen gue dari luar pulau pernah diketawain gara-gara logatnya pas presentasi. Padahal dia jago banget.` },
      { speaker: "KARA", text: `Sedih. Logat kan bukan bobot nilai.` },
      { speaker: "NARA", text: `Persis. Bahasa Indonesia lahir justru buat nyambungin orang dari bermacam daerah, bukan buat nyamain semua jadi satu.` },
      { speaker: "BIMA", text: `Daerah + Indonesia = kita. Bukan lawan.` },
      { speaker: "KARA", text: `Jadi kalau ada yang ketawa, aku harus bela dia?` },
    ],
    decisionPrompt: `BIMA: "Pas temenmu diketawain karena logatnya, apa yang kamu lakuin?"`,
    options: [
      {
        key: "a",
        text: "Bela dia. Logat bukan cermin kecerdasan. Bahasa Indonesia justru tempat semua suara punya tempat.",
        best: true,
        feedback: {
          observation: "Kamu lihat bahasa daerah & Indonesia sebagai satu kesatuan, bukan lawan.",
          context: "Bahasa Indonesia menyatukan tanpa menghilangkan akar daerah.",
          languageEffect: "Sikap inklusif kuatin kebanggaan sekaligus persatuan.",
          alternative: `Coba pakai satu istilah daerah dalam obrolan sehari-hari dengan bangga.`,
          reflection: "Bahasa daerah apa yang kamu banggakan?",
          transfer: "Di acara antardaerah, ragam apa yang paling pantas?",
        },
      },
      {
        key: "b",
        text: "Biarin aja, dia harus bisa 'normal' kayak orang lain.",
        best: false,
        feedback: {
          observation: "Kamu anggap keberagaman sebagai hal yang harus 'dihilangkan'.",
          context: "Menyamakan justru hapus kekayaan budaya yang kita punya.",
          languageEffect: "Bahasa Indonesia justru lahir untuk merangkul perbedaan, bukan menyeragamkan.",
          alternative: "Lihat betapa banyak istilah daerah yang memperkaya bahasa nasional.",
          reflection: "Apa yang hilang bila bahasa daerah punah?",
          transfer: "Gimana menjaga bahasa daerah di sekolah?",
        },
      },
      {
        key: "c",
        text: "Suruh dia buang bahasa daerah, cukup pakai Indonesia.",
        best: false,
        feedback: {
          observation: "Kamu nolak peran bahasa daerah.",
          context: "Tanpa bahasa daerah, sebagian identitas dia hilang.",
          languageEffect: "Bahasa Indonesia adalah jembatan, bukan pengganti daerah.",
          alternative: "Bayangkan bertemu teman dari pulau lain tanpa bahasa bersama.",
          reflection: "Mengapa kita butuh bahasa bersama?",
          transfer: "Apa fungsi bahasa Indonesia di tingkat nasional?",
        },
      },
    ],
    cardReward: "Suara Serumpun",
    skillReward: "language_identity",
  },
  {
    id: 6,
    slug: "salah-tangkap-di-dm",
    title: "Salah Tangkap di DM",
    subtitle: "Episode 6 — Ruang Digital",
    panels: [
      { speaker: "MAYA", text: `Gue pernah balas "oh" ke temen, dia ngira gue marah. Padahal gue emang cuma 'oh'. Di DM, satu kata bisa jadi drama.` },
      { speaker: "NARA", text: `Tanpa nada dan muka, chat gampang meleset. Makanya kejelasan penting, meski mediumnya santai.` },
      { speaker: "KARA", text: `Berarti gue harus mikir dua kali tiap ngetik?` },
      { speaker: "MAYA", text: `Nggak harus kaku. Cukup tau: apa yang kubikin bisa dibaca beda sama orang lain.` },
      { speaker: "NARA", text: `Pakai bahasa lain bila perlu. Pakai Indonesia bila itu pilihanmu. Yang penting: sadari alasannya.` },
    ],
    decisionPrompt: `MAYA: "Kalau tren dan algoritma terus ngebentuk cara kamu nulis di digital, apa yang bisa kamu lakuin?"`,
    options: [
      {
        key: "a",
        text: "Sadari pengaruhnya, terus pilih: sebelum kirim, tanya 'ini buat siapa & tujuannya apa?'.",
        best: true,
        feedback: {
          observation: "Kamu akui pengaruh digital sekaligus jaga kendali.",
          context: "Chat, komentar, caption, video punya konteks berbeda.",
          languageEffect: "Kesadaran cegah bahasa terbawa tren tanpa arah.",
          alternative: `Sebelum posting, tanya: ini untuk siapa & tujuannya apa?`,
          reflection: "Tren mana yang paling memengaruhi bahasamu?",
          transfer: "Di komentar publik, apakah nada kasar masih pantas?",
        },
      },
      {
        key: "b",
        text: "Ikut aja apa pun trennya, yang penting viral.",
        best: false,
        feedback: {
          observation: "Kamu serahin pilihan ke algoritma & tren.",
          context: "Virality nggak jamin kejelasan atau kesantunan.",
          languageEffect: "Tanpa kendali, pesan mudah salah tafsir atau nyudutin orang.",
          alternative: "Coba buat konten yang tetap relevan tanpa ikut arus kasar.",
          reflection: "Pernah 'viraldrive' bikinmu nyesel?",
          transfer: "Gimana jaga sopan di ruang publik digital?",
        },
      },
      {
        key: "c",
        text: "Tutup semua media sosial saja.",
        best: false,
        feedback: {
          observation: "Kamu hindari ruang digital sepenuhnya.",
          context: "Media digital adalah bagian nyata dari komunikasi remaja.",
          languageEffect: "Menjauhi bukan solusi; kesadaranlah yang penting.",
          alternative: "Pakai media dengan niat: belajar, berkarya, berhubung.",
          reflection: "Manfaat media apa yang mau kamu pertahankan?",
          transfer: "Gimana manfaatin digital secara sehat?",
        },
      },
    ],
    cardReward: "Niat Sebelum Kirim",
    skillReward: "digital_awareness",
  },
];


export interface LanguageCard {
  id: number;
  category: string;
  title: string;
  body: string;
}

export const LANGUAGE_CARDS: LanguageCard[] = [
  { id: 1, category: "Fenomena", title: "Code-Mixing", body: "Menyisipkan kata asing dalam kalimat Indonesia. Lazim, bukan otomatis salah — asal sadari alasannya." },
  { id: 2, category: "Fenomena", title: "Slang & Serapan", body: "Bentuk tidak baku & serapan asing. Bagian dari bahasa yang hidup, perlu konteks tepat." },
  { id: 3, category: "Konteks", title: "Teman vs Guru", body: "Ragam santai untuk teman, ragam hormat untuk guru. Satu maksud, banyak wajah." },
  { id: 4, category: "Konteks", title: "Publik vs Pribadi", body: "Pengumuman publik menuntut kejelasan & ragam baku; obrolan pribadi boleh santai." },
  { id: 5, category: "Identitas", title: "Bahasa & Persatuan", body: "Bahasa Indonesia menyatukan beragam daerah setara, tanpa mengunggulkan satu bahasa." },
  { id: 6, category: "Identitas", title: "Bahasa & Budaya", body: "Bahasa daerah & Indonesia saling melengkapi sebagai identitas bangsa." },
  { id: 7, category: "Digital", title: "Caption & Komentar", body: "Medium santai tetap menuntut kejelasan; tanpa nada, pesan singkat mudah salah tafsir." },
  { id: 8, category: "Digital", title: "Tren & Algoritma", body: "Tren membentuk kebiasaan bahasa; sadari pengaruhnya tanpa menolaknya." },
  { id: 9, category: "Communication", title: "Kejelasan", body: "Tujuan pesan tercapai bila lawan bicara paham maksudmu sebagaimana dimaksud." },
  { id: 10, category: "Communication", title: "Kesantunan", body: "Kesantunan bergantung relasi & situasi; bukan sekadar 'baku'." },
  { id: 11, category: "Communication", title: "Ambiguitas", body: "Pesan singkat tanpa konteks rawan ambigu; tambahkan maksud singkat." },
  { id: 12, category: "Nusantara", title: "Jembatan Antardaerah", body: "Bahasa Indonesia memungkinkan warga lintas daerah berkomunikasi setara." },
  { id: 13, category: "Nusantara", title: "Istilah Lokal", body: "Kekayaan istilah daerah adalah kekuatan, bukan lawan Bahasa Indonesia." },
  { id: 14, category: "Myth", title: "Inggris Selalu Lebih Keren", body: "Mitos. Kesan 'keren' dibentuk lingkungan & media, bukan kata itu sendiri." },
  { id: 15, category: "Myth", title: "Indonesia Harus Formal", body: "Mitos. Bahasa Indonesia punya ragam; formal bukan satu-satunya ukuran." },
];

export interface BossRound {
  round: number;
  situation: string;
  tested: string;
  claim: string;
  trained: string;
  options: { key: string; text: string; best: boolean }[];
}

export const BOSS_ROUNDS: BossRound[] = [
  { round: 1, situation: "Chat teman", tested: "Ragam informal & naturalness", claim: "Semua orang ngomong begitu.", trained: "Kesadaran pengaruh lingkungan", options: [
    { key: "a", text: "Aku sadar gaya ini kebiasaan, tapi aku yang memilih untuk tetap sopan.", best: true },
    { key: "b", text: "Ya udah, semua orang gitu kok.", best: false },
  ] },
  { round: 2, situation: "Pesan kepada guru", tested: "Kesantunan & konteks", claim: "Bahasa Inggris lebih keren.", trained: "Kritis thd persepsi sosial", options: [
    { key: "a", text: "Untuk guru, aku pakai bahasa hormat & jelas dalam Bahasa Indonesia.", best: true },
    { key: "b", text: "Pake Inggris aja biar keliatan smart.", best: false },
  ] },
  { round: 3, situation: "Caption publik", tested: "Audiens & kejelasan", claim: "Yang penting orang paham.", trained: "Kejelasan & konteks", options: [
    { key: "a", text: "Caption publik butuh pesan jelas & ragam pas — bukan cuma 'paham'.", best: true },
    { key: "b", text: "Asal orang paham, terserah.", best: false },
  ] },
  { round: 4, situation: "Organisasi", tested: "Tujuan & profesionalitas", claim: "Indonesia harus formal.", trained: "Pemahaman ragam bahasa", options: [
    { key: "a", text: "Untuk organisasi aku pakai bahasa jelas & pantas — bisa baku, bisa santai yang runtut.", best: true },
    { key: "b", text: "Semua harus baku kaku.", best: false },
  ] },
  { round: 5, situation: "Konten tren", tested: "Pengaruh sosial & alasan memilih", claim: "Di internet bebas saja.", trained: "Tanggung jawab komunikasi digital", options: [
    { key: "a", text: "Di internet tetap ada tanggung jawab: aku pilih kata yang jelas & tak menyudutkan.", best: true },
    { key: "b", text: "Di internet bebas, nggak peduli.", best: false },
  ] },
  { round: 6, situation: "Situasi multikultural", tested: "Identitas & fungsi Bahasa Indonesia", claim: "Bahasa daerah lawan Indonesia.", trained: "Bahasa sebagai jembatan", options: [
    { key: "a", text: "Bahasa daerah & Indonesia saling melengkapi; keduanya identitas kita.", best: true },
    { key: "b", text: "Tolak bahasa daerah, cuma Indonesia.", best: false },
  ] },
];

// Mini-game PRIMA CIRCUIT — konten khusus (selain SCENARIOS utama)
export const GAME_CODE_MIX: Scenario[] = [
  {
    id: 1,
    construct: "Code-Mixing Mirror",
    caseType: "Code-Mix Mirror",
    task: "Apakah kalimat ini mengandung campur kode? Pilih penilaian yang tepat.",
    situation: "\"Aku udah submit file-nya lewat email tadi.\"",
    options: [
      { key: "a", text: "Bukan campur kode, murni bahasa Indonesia.", correct: false },
      { key: "b", text: "Ya, ada campur kode ('submit', 'file', 'email') — wajar asal pesan jelas bagi lawan bicara.", correct: true },
      { key: "c", text: "Salah karena pakai kata asing.", correct: false },
    ],
    feedback: "Campur kode terjadi saat kata asing disisipkan dalam kalimat Indonesia. Ini lazim, bukan otomatis salah — asal kamu sadar alasannya dan pesan tetap jelas.",
  },
  {
    id: 2,
    construct: "Code-Mixing Mirror",
    caseType: "Code-Mix Mirror",
    task: "Mana yang merupakan contoh campur kode yang MASIH menjaga kejelasan?",
    situation: "Pilih satu kalimat.",
    options: [
      { key: "a", text: "\"Tolong share link meeting-nya ya.\"", correct: true },
      { key: "b", text: "\"Tolong share link meeting-nya ya bunga mawar mekar.\"", correct: false },
      { key: "c", text: "\"ASDF ghjk meeting link share.\"", correct: false },
    ],
    feedback: "Campur kode tetap harus menjaga kejelasan maksud. Menyisipkan kata asing wajar bila pendengar paham; kalimat acak tidak.",
  },
  {
    id: 3,
    construct: "Code-Mixing Mirror",
    caseType: "Code-Mix Mirror",
    task: "Kapan campur kode SEBAIKNYA dihindari?",
    situation: "Pilih situasi yang paling tepat untuk menghindari campur kode.",
    options: [
      { key: "a", text: "Saat chat santai dengan teman dekat.", correct: false },
      { key: "b", text: "Saat menulis surat resmi/undangan formal ke instansi.", correct: true },
      { key: "c", text: "Saat membuat caption pribadi yang ceria.", correct: false },
    ],
    feedback: "Teks formal menuntut ragam baku; campur kode di sini bisa mengurangi kewibawaan dan kejelasan. Di situasi santai, campur kode biasanya tak masalah.",
  },
  {
    id: 4,
    construct: "Code-Mixing Mirror",
    caseType: "Code-Mix Mirror",
    task: "Apa alasan terbaik menggunakan istilah asing?",
    situation: "Pilih alasan yang menunjukkan kesadaran berbahasa.",
    options: [
      { key: "a", text: "Karena semua orang pakai, biar nggak kudet.", correct: false },
      { key: "b", text: "Karena maknanya lebih tepat/singkat/lazim dan aku tahu alasannya.", correct: true },
      { key: "c", text: "Agar terlihat lebih pintar dari teman.", correct: false },
    ],
    feedback: "Menggunakan bahasa asing dengan alasan fungsional (tepat, singkat, lazim) adalah bentuk kesadaran berbahasa, bukan sekadar ikut tren.",
  },
];

export const GAME_CONTEXT_SWITCH: Scenario[] = [
  {
    id: 1,
    construct: "Context Switch",
    caseType: "Context Switch",
    task: "Ubah pesan berikut untuk disampaikan kepada kepala sekolah (undangan rapat).",
    situation: "Pesan ke teman: \"Bro, nanti kumpul di ruang guru ya, jam 2.\"",
    options: [
      { key: "a", text: "\"Pak, mohon maaf, apakah Bapak berkenan hadir rapat di ruang guru pukul 14.00?\"", correct: true },
      { key: "b", text: "\"Pak, nanti kumpul di ruang guru ya jam 2.\"", correct: false },
      { key: "c", text: "\"Bro, meeting di ruang guru jam 2, Pak ikut ya.\"", correct: false },
    ],
    feedback: "Pergantian lawan bicara (teman → pimpinan) menuntut pergeseran ragam: lebih formal, santun, dan jelas. Kesadaran konteks = memilih ragam sebelum bicara.",
  },
  {
    id: 2,
    construct: "Context Switch",
    caseType: "Context Switch",
    task: "Mana balasan yang paling tepat untuk komentar netizen di media sosial sekolah?",
    situation: "Netizen: \"Kegiatannya membosankan.\"",
    options: [
      { key: "a", text: "\"Terima kasih atas masukannya, kami akan terus berusaha menyajikan kegiatan yang bermanfaat.\"", correct: true },
      { key: "b", text: "\"Jangan nyinyir lah.\"", correct: false },
      { key: "c", text: "\"Bosan? gitu aja ngomel.\"", correct: false },
    ],
    feedback: "Di ruang publik, menjaga kesantunan dan respon yang solutif lebih efektif daripada menyerang balik. Ragam berubah sesuai audiens dan platform.",
  },
  {
    id: 3,
    construct: "Context Switch",
    caseType: "Context Switch",
    task: "Untuk pengumuman di grup kelas, pilih bentuk yang paling tepat.",
    situation: "Info: besok ada pengumpulan tugas.",
    options: [
      { key: "a", text: "\"Yth teman-teman, diinformasikan pengumpulan tugas besok. Mohon disiapkan. Terima kasih.\"", correct: true },
      { key: "b", text: "\"wkwk besok kumpul tugas, gak ngumpul gue lapor Bu.\"", correct: false },
      { key: "c", text: "\"submit tugas tmrw or else.\"", correct: false },
    ],
    feedback: "Grup kelas adalah ruang semi-formal: cukup santai tapi tetap runtut dan jelas. Kesantunan dan kejelasan menjaga komunikasi efektif.",
  },
  {
    id: 4,
    construct: "Context Switch",
    caseType: "Context Switch",
    task: "Kapan kamu BOLEH menggunakan bahasa sangat santai?",
    situation: "Pilih situasi yang paling pas untuk ragam santai.",
    options: [
      { key: "a", text: "Saat presentasi di depan juri lomba.", correct: false },
      { key: "b", text: "Saat obrolan pribadi dengan teman dekat.", correct: true },
      { key: "c", text: "Saat wawancara dengan kepala sekolah.", correct: false },
    ],
    feedback: "Ragam santai tepat untuk pergaulan akrab; ragam baku untuk situasi formal. Satu bahasa, banyak wajah — asal kamu yang memilih.",
  },
];

// 5 game sisa (PRIMA CIRCUIT & NUSANTARA) — melengkapi 8 game blueprint
export const GAME_CHAT_CRASH: Scenario[] = [
  {
    id: 1,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: "Pesan singkat ini rawan salah tafsir. Pilih revisi terbaik.",
    situation: "Kamu menulis ke teman: \"wkkk besok liat aja\" (maksud: tunggu kabar besok).",
    options: [
      { key: "a", text: "\"besok aku kabari ya, tunggu info ya\"", correct: true },
      { key: "b", text: "\"wkkk besok liat aja\"", correct: false },
      { key: "c", text: "\"besok.\"", correct: false },
    ],
    feedback: "Tanpa nada & ekspresi, singkatan ambigu mudah salah paham. Menambah konteks singkat menyelamatkan maksud pesan.",
  },
  {
    id: 2,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: "Teman membalas \"sok sibuk amat\" setelah kamu telat membalas. Respons mana yang tak memperkeruh?",
    situation: "Pilih balasan yang menjaga kejelasan & kesantunan.",
    options: [
      { key: "a", text: "\"maaf ya tadi lagi sibuk, bukan sok. ada yang bisa dibantu?\"", correct: true },
      { key: "b", text: "\"eh kamu ngatur-ngatur mulu sih\"", correct: false },
      { key: "c", text: "\"capel\"", correct: false },
    ],
    feedback: "Chat crash terjadi karena pesan singkat kehilangan nada. Klarifikasi santun mencegah salah paham berlanjut.",
  },
  {
    id: 3,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: "Untuk pesan penting ke grup kelas, mana yang paling aman?",
    situation: "Info: tugas dikumpul besok pukul 08.00.",
    options: [
      { key: "a", text: "\"info: kumpul tugas besok 08.00. tolong sebarkan, makasih\"", correct: true },
      { key: "b", text: "\"besok kumpul ya wkwk\"", correct: false },
      { key: "c", text: "\"08.00.\"", correct: false },
    ],
    feedback: "Pesan penting butuh kejelasan waktu & tindakan. Singkatan tanpa konteks berisiko tak sampai ke penerima.",
  },
  {
    id: 4,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: "Kapan sebaiknya menghindari singkatan tidak baku ('yg','dg','pdhl')?",
    situation: "Pilih situasi yang tepat.",
    options: [
      { key: "a", text: "Dalam pesan ke guru atau pengumuman resmi.", correct: true },
      { key: "b", text: "Saat chat santai dengan teman dekat.", correct: false },
      { key: "c", text: "Saat menulis status pribadi.", correct: false },
    ],
    feedback: "Singkatan tak baku cocok untuk pergaulan akrab, tapi mengurangi kewibawaan & kejelasan di ruang formal.",
  },
];

export const GAME_CAPTION_GARAGE: Scenario[] = [
  {
    id: 1,
    construct: "Caption Garage",
    caseType: "Caption Garage",
    task: "Tulis ulang caption agar cocok untuk akun resmi sekolah.",
    situation: "Draft: \"yuk ikut lomba seru banget guys!! dm aja\"",
    options: [
      { key: "a", text: "\"Diberitahukan: pendaftaran lomba dibuka. Silakan hubungi panitia. Terima kasih.\"", correct: true },
      { key: "b", text: "\"yuk ikut lomba seru banget guys!! dm aja\"", correct: false },
      { key: "c", text: "\"our competition is open, join now!\"", correct: false },
    ],
    feedback: "Audiens resmi menuntut ragam baku & informatif. Media sosial boleh ceria, tapi tujuan komunikasi resmi menuntut keformalan.",
  },
  {
    id: 2,
    construct: "Caption Garage",
    caseType: "Caption Garage",
    task: "Caption untuk promosi kegiatan santai ke teman, pilih yang tetap jelas.",
    situation: "Pilih caption yang ceria tapi pesan sampai.",
    options: [
      { key: "a", text: "\"Ayo ikut latihan bersama Sabtu ini! Kumpul di lapangan jam 3. Seru loh :)\"", correct: true },
      { key: "b", text: "\"wkwk sabtu yok\"", correct: false },
      { key: "c", text: "\"3pm sat\"", correct: false },
    ],
    feedback: "Caption santai boleh ceria asal waktu & tempat tetap jelas. Kejelasan tak hilang meski nada akrab.",
  },
  {
    id: 3,
    construct: "Caption Garage",
    caseType: "Caption Garage",
    task: "Mana caption yang membangun citra positif Bahasa Indonesia?",
    situation: "Pilih caption kampanye.",
    options: [
      { key: "a", text: "\"Bahasa Indonesia itu keren kalau kita pakai dengan bangga & tepat.\"", correct: true },
      { key: "b", text: "\"bhs indo kuno sih\"", correct: false },
      { key: "c", text: "\"pake inggris aja biar ga kudet\"", correct: false },
    ],
    feedback: "Caption bisa jadi ajang membangun kebanggaan berbahasa. Pilihan kata membentuk persepsi audiens.",
  },
  {
    id: 4,
    construct: "Caption Garage",
    caseType: "Caption Garage",
    task: "Untuk caption berita, hindari...",
    situation: "Pilih yang sebaiknya dihindari.",
    options: [
      { key: "a", text: "Judul clickbait provokatif tanpa fakta.", correct: true },
      { key: "b", text: "Kalimat baku yang runtut.", correct: false },
      { key: "c", text: "Sumber yang jelas.", correct: false },
    ],
    feedback: "Caption berita menuntut akurasi & nada netral. Clickbait provokatif merusak kejelasan dan kepercayaan.",
  },
];

export const GAME_BATTLE_CARD: Scenario[] = [
  {
    id: 1,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Lawan argumen 'bahasa Indonesia kuno'. Pilih kartu balasan terbaik.",
    situation: "Teman: \"bahasa Indonesia kan kuno buat anak muda.\"",
    options: [
      { key: "a", text: "\"Bahasa Indonesia punya ragam: bisa santai, kreatif, dan modern. Kuno itu persepsi, bukan sifat bahasa.\"", correct: true },
      { key: "b", text: "\"nggak lah, kamu aja yang norak\"", correct: false },
      { key: "c", text: "\"ya udah pake inggris sana\"", correct: false },
    ],
    feedback: "Argumen terbaik menjelaskan fakta (ragam bahasa) tanpa menyerang. Ini melatih Critical Choice & Language Identity.",
  },
  {
    id: 2,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Lawan mitos 'bahasa asing selalu lebih keren'. Pilih kartu terbaik.",
    situation: "Teman: \"pake Inggris itu otomatis keren.\"",
    options: [
      { key: "a", text: "\"Kesan keren dibentuk lingkungan & media, bukan kata itu sendiri. Asing boleh kalau fungsional.\"", correct: true },
      { key: "b", text: "\"kamu lebay\"", correct: false },
      { key: "c", text: "\"emang iya\"", correct: false },
    ],
    feedback: "Menghadapi mitos butuh penjelasan rasional tentang pengaruh sosial, bukan sekadar membantah.",
  },
  {
    id: 3,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Pilih alasan mempertahankan bahasa daerah di samping Indonesia.",
    situation: "Teman: \"bahasa daerah itu nggak penting.\"",
    options: [
      { key: "a", text: "\"Bahasa daerah & Indonesia saling melengkapi sebagai identitas bangsa.\"", correct: true },
      { key: "b", text: "\"ya udah buang aja\"", correct: false },
      { key: "c", text: "\"kamu nggak nasionalis\"", correct: false },
    ],
    feedback: "Bahasa daerah dan Indonesia bukan lawan. Keduanya memperkuat identitas, bukan mengurangi.",
  },
  {
    id: 4,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Kartu terbaik menanggapi 'yang penting paham'",
    situation: "Teman: \"asal orang paham, terserah bahasanya.\"",
    options: [
      { key: "a", text: "\"Paham itu penting, tapi ragam & kesantunan menentukan apakah pesan sampai dengan baik.\"", correct: true },
      { key: "b", text: "\"ya udah terserah\"", correct: false },
      { key: "c", text: "\"kamu bodoh\"", correct: false },
    ],
    feedback: "Menjawab dengan menjelaskan batas 'yang penting paham' membangun kesadaran tanpa konflik.",
  },
];

export const GAME_MEANING_DETECTIVE: Scenario[] = [
  {
    id: 1,
    construct: "Meaning Detective",
    caseType: "Meaning Detective",
    task: "Kalimat ini kemungkinan besar bermaksud...",
    situation: "\"Wah, rapi sekali mejamu.\" (Padahal mejamu biasanya berantakan.)",
    options: [
      { key: "a", text: "Komentar bahwa meja biasanya berantakan — bisa sindiran.", correct: true },
      { key: "b", text: "Pujian bahwa meja selalu rapi.", correct: false },
      { key: "c", text: "Perintah merapikan meja.", correct: false },
    ],
    feedback: "Pragmatik: makna bergantung konteks. Kalimat bisa sindiran, bukan pujian harfiah.",
  },
  {
    id: 2,
    construct: "Meaning Detective",
    caseType: "Meaning Detective",
    task: "Apa maksud tersirat \"Terima kasih sudah datang\" di akhir surat minta maaf?",
    situation: "Pilih penafsiran paling tepat.",
    options: [
      { key: "a", text: "Penutup sopan yang menjaga hubungan, bukan ajakan datang.", correct: true },
      { key: "b", text: "Ajakan sungguhan untuk datang ke rumah.", correct: false },
      { key: "c", text: "Sindiran marah.", correct: false },
    ],
    feedback: "Ungkapan penutup punya fungsi sosial, bukan harfiah. Memahami maksud tersirat cegah salah paham.",
  },
  {
    id: 3,
    construct: "Meaning Detective",
    caseType: "Meaning Detective",
    task: "\"Seandainya saja aku diberi tahu lebih awal.\" Maksudnya...",
    situation: "Pilih yang paling mungkin.",
    options: [
      { key: "a", text: "Menyatakan keberatan secara halus karena baru tahu terlambat.", correct: true },
      { key: "b", text: "Benar-benar ingin diberi tahu di masa depan.", correct: false },
      { key: "c", text: "Pujian atas informasinya.", correct: false },
    ],
    feedback: "Konstruksi 'seandainya' sering menyiratkan ketidakpuasan secara santun. Detektif makna membaca antara baris.",
  },
  {
    id: 4,
    construct: "Meaning Detective",
    caseType: "Meaning Detective",
    task: "Apa implikasi \"Kami sudah berusaha semaksimal mungkin\"?",
    situation: "Dalam permintaan maaf resmi.",
    options: [
      { key: "a", text: "Menunjukkan upaya sungguh-sungguh, sekaligus membatasi ekspektasi lebih.", correct: true },
      { key: "b", text: "Mengakui sepenuhnya bersalah tanpa syarat.", correct: false },
      { key: "c", text: "Mengalihkan salah sepenuhnya.", correct: false },
    ],
    feedback: "Bahasa resmi sering membungkus makna secara hati-hati. Memahami implikasi penting agar tak salah tafsir.",
  },
];

export const GAME_NUSANTARA_QUEST: Scenario[] = [
  {
    id: 1,
    construct: "Nusantara Quest",
    caseType: "Nusantara Quest",
    task: "Fungsi Bahasa Indonesia bagi daerah berbeda adalah...",
    situation: "Pilih pernyataan yang paling tepat.",
    options: [
      { key: "a", text: "Jembatan komunikasi antardaerah yang setara.", correct: true },
      { key: "b", text: "Menggantikan seluruh bahasa daerah.", correct: false },
      { key: "c", text: "Bahasa khusus elite saja.", correct: false },
    ],
    feedback: "Bahasa Indonesia menyatukan warga lintas daerah secara setara, tanpa men submerged bahasa daerah.",
  },
  {
    id: 2,
    construct: "Nusantara Quest",
    caseType: "Nusantara Quest",
    task: "Sikap terbaik terhadap istilah daerah dalam Bahasa Indonesia?",
    situation: "Pilih yang mencerminkan kesadaran Nusantara.",
    options: [
      { key: "a", text: "Menghargai & bisa memasukkan istilah daerah sebagai kekayaan bersama.", correct: true },
      { key: "b", text: "Menolak istilah daerah karena dianggap rendah.", correct: false },
      { key: "c", text: "Mengganti semua istilah daerah dengan asing.", correct: false },
    ],
    feedback: "Istilah daerah adalah kekuatan bahasa Indonesia, bukan lawannya. Kesadaran Nusantara = inklusif.",
  },
  {
    id: 3,
    construct: "Nusantara Quest",
    caseType: "Nusantara Quest",
    task: "Di acara antardaerah, ragam bahasa yang paling pantas adalah...",
    situation: "Pilih untuk presentasi bersama peserta dari berbagai provinsi.",
    options: [
      { key: "a", text: "Bahasa Indonesia baku yang jelas dan hormat.", correct: true },
      { key: "b", text: "Bahasa daerah satu pihak saja eksklusif.", correct: false },
      { key: "c", text: "Bahasa asing sepenuhnya.", correct: false },
    ],
    feedback: "Bahasa Indonesia baku menjembatani peserta lintas daerah secara netral & sopan.",
  },
  {
    id: 4,
    construct: "Nusantara Quest",
    caseType: "Nusantara Quest",
    task: "Apa makna 'Bahasa Indonesia sebagai identitas bangsa'?",
    situation: "Pilih penafsiran yang utuh.",
    options: [
      { key: "a", text: "Pemersatu yang hidup berdampingan dengan bahasa daerah & budaya.", correct: true },
      { key: "b", text: "Alat penghapus keragaman daerah.", correct: false },
      { key: "c", text: "Sekadar mata pelajaran di sekolah.", correct: false },
    ],
    feedback: "Identitas bangsa dibangun dari kebersamaan lintas daerah, bukan penyeragaman yang menghilangkan akar.",
  },
];