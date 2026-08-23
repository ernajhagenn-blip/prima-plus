export type LikertOption = "SS" | "S" | "TS" | "STS";

export const LIKERT_OPTIONS: { value: string; label: string; score: number }[] = [
  { value: "SS", label: "SS", score: 4 },
  { value: "S", label: "S", score: 3 },
  { value: "TS", label: "TS", score: 2 },
  { value: "STS", label: "STS", score: 1 },
];

export const LOYALTY_DIMENSIONS = [
  "Sikap Positif",
  "Kesetiaan Penggunaan",
  "Kesadaran Norma",
  "Kebanggaan",
  "Refleksi Kritis",
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

// 15 items Likert — 3 per dimensi, dirancang research-valid
export const LOYALTY_ITEMS: QuestionnaireItem[] = [
  // ── Sikap Positif (3) ──
  {
    id: 1,
    dimension: "Sikap Positif",
    statement:
      "Aku lebih nyaman menyampaikan pendapat formal dalam Bahasa Indonesia daripada bahasa lain.",
  },
  {
    id: 2,
    dimension: "Sikap Positif",
    statement:
      "Menurutku, Bahasa Indonesia punya kekuatan ekspresi yang sama dengan bahasa asing kalau dipakai dengan tepat.",
  },
  {
    id: 3,
    dimension: "Sikap Positif",
    statement:
      "Aku merasa bahasa Indonesia yang baik bukan cuma soal aturan, tapi juga soal rasa memiliki.",
  },

  // ── Kesetiaan Penggunaan (3) ──
  {
    id: 4,
    dimension: "Kesetiaan Penggunaan",
    statement:
      "Aku tetap memilih Bahasa Indonesia saat menulis caption Instagram meskipun teman-temanku lebih banyak pakai bahasa Inggris.",
  },
  {
    id: 5,
    dimension: "Kesetiaan Penggunaan",
    statement:
      "Dalam obrolan grup, aku berusaha tetap menggunakan Bahasa Indonesia yang runtut meski yang lain pakai campur kode.",
  },
  {
    id: 6,
    dimension: "Kesetiaan Penggunaan",
    statement:
      "Aku menghindari singkatan tidak baku (yg, dg, pdhl) saat menulis pesan ke guru atau pengumuman.",
  },

  // ── Kesadaran Norma (3) ──
  {
    id: 7,
    dimension: "Kesadaran Norma",
    statement:
      "Aku sadar ketika memilih kata yang tepat untuk audiens yang berbeda — guru, teman, orang tua.",
  },
  {
    id: 8,
    dimension: "Kesadaran Norma",
    statement:
      "Aku bisa membedakan kapan bahasa gaul wajar dipakai dan kapan sebaiknya tidak.",
  },
  {
    id: 9,
    dimension: "Kesadaran Norma",
    statement:
      "Menurutku, penggunaan bahasa gaul di media sosial tetap punya batasan yang perlu disadari.",
  },

  // ── Kebanggaan (3) ──
  {
    id: 10,
    dimension: "Kebanggaan",
    statement:
      "Aku bangga kalau bisa menulis atau berbicara dengan Bahasa Indonesia yang baik dan jelas.",
  },
  {
    id: 11,
    dimension: "Kebanggaan",
    statement:
      "Aku merasa percaya diri memakai Bahasa Indonesia di depan orang asing atau di kompetisi internasional.",
  },
  {
    id: 12,
    dimension: "Kebanggaan",
    statement:
      "Menurutku, bangga berbahasa Indonesia itu bukan kuno, tapi justru menunjukkan kedewasaan.",
  },

  // ── Refleksi Kritis (3) ──
  {
    id: 13,
    dimension: "Refleksi Kritis",
    statement:
      "Penggunaan bahasa gaul di media sosial tidak mempengaruhi kemampuan menulis formal aku.",
  },
  {
    id: 14,
    dimension: "Refleksi Kritis",
    statement:
      "Aku pernah sadar bahwa kebiasaan pakai kata asing ternyata lebih karena tren, bukan kebutuhan.",
  },
  {
    id: 15,
    dimension: "Refleksi Kritis",
    statement:
      "Aku sering mengevaluasi pilihan bahasaku sendiri — apakah sudah sesuai konteks atau cuma ikut kebiasaan.",
  },
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

// 8 SCENARIOS — kasus nyata, 4 opsi, 1 benar (paling sadar bahasa)
export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    construct: "Konteks & Audiens",
    caseType: "Game 1 — Grup Chat",
    task: "Kamu diminta mengumumkan pertemuan kelompok di grup kelas yang isinya teman dan guru. Pilih pengumuman yang paling tepat.",
    situation:
      "Grup kelas: ada 30 siswa + Bu Hartati (guru Bahasa Indonesia).",
    options: [
      {
        key: "a",
        text: '"Yuk kumpul besok jam 4 di perpustakaan ya guys! Jangan lupa bawa laptop 😄"',
        correct: true,
      },
      {
        key: "b",
        text: '"besok kumpul yaaa wkwk jgn lupa"',
        correct: false,
      },
      {
        key: "c",
        text: '"ATTENTION: All group members are required to attend the meeting tomorrow at 16:00. Bring your laptop."',
        correct: false,
      },
      {
        key: "d",
        text: '"Kepada Yth. rekan-rekan kelompok, dengan ini diinformasikan bahwa pertemuan akan dilaksanakan besok pukul 16.00 di perpustakaan. Terima kasih."',
        correct: false,
      },
    ],
    feedback:
      "Grup kelas itu semi-formal: ada teman, ada guru. Opsi (a) pas — tetap hangat dan jelas, tapi nggak terlalu kasar. Opsi (b) terlalu santai untuk campuran audiens. Opsi (c) bahasa Inggris di grup Indonesia? Opsi (d) kaku banget, kayak surat dinas. Yang penting: sesuaikan ragam dengan SIAPA yang baca, bukan cuma isinya.",
  },
  {
    id: 2,
    construct: "Kesadaran Ragam",
    caseType: "Game 2 — DM ke Guru",
    task: "Kirim pesan ke Bu Guru tentang deadline tugas yang mendesak. Pilih yang paling tepat.",
    situation:
      "Kamu tahu Bu Hartati aktif di WhatsApp dan biasanya fast response.",
    options: [
      {
        key: "a",
        text: '"Bu, selamat pagi. Mohon maaf mengganggu. Apakah boleh saya kumpulkan tugasnya besok siang? Hari ini saya ada kegiatan lain. Terima kasih, Bu."',
        correct: true,
      },
      {
        key: "b",
        text: '"Bu, besok ya kumpulnya, iya kan? 😅"',
        correct: false,
      },
      {
        key: "c",
        text: '"hey Bu, can I submit tomorrow? something came up 🙏"',
        correct: false,
      },
      {
        key: "d",
        text: '"Bu Hartati yang terhormat, dengan hormat saya bermaksud menanyakan mengenai kemungkinan perpanjangan waktu pengumpulan tugas. Atas perhatiannya saya ucapkan terima kasih."',
        correct: false,
      },
    ],
    feedback:
      "DM ke guru itu situasi semi-formal: sopan tapi nggak perlu se-formal surat resmi. Opsi (a) pas — ada salam, alasan singkat, dan terima kasih. Opsi (b) terlalu casual. Opsi (c) bahasa Inggris ke guru Indonesia? Opsi (d) berlebihan, kayak nulis surat dinas. Yang diharapkan: jelas, sopan, dan manusiawi.",
  },
  {
    id: 3,
    construct: "Kesadaran Audiens",
    caseType: "Game 3 — Caption Instagram",
    task: "Kamu mau posting foto kegiatan sekolah di Instagram. Pilih caption yang paling sesuai untuk akun publikmu.",
    situation:
      "Foto: kamu dan teman-teman sedang presentasi di kelas. Akun Instagram kamu diikuti teman, keluarga, dan beberapa guru.",
    options: [
      {
        key: "a",
        text: '"Hari yang produktif! Presentasi pertamaku di kelas XII. Terima kasih Bu Hartati atas bimbingannya 🙏✨"',
        correct: true,
      },
      {
        key: "b",
        text: '"slay periodt 💅 besties kita slain today 🫶"',
        correct: false,
      },
      {
        key: "c",
        text: '"Our first presentation went so well! Can\'t wait for the next one 🥳"',
        correct: false,
      },
      {
        key: "d",
        text: '"Diinformasikan bahwa pada hari ini telah dilaksanakan kegiatan presentasi kelas XII dengan lancar. Demikian informasi ini, terima kasih."',
        correct: false,
      },
    ],
    feedback:
      "Caption Instagram itu publik: dibaca teman, keluarga, guru. Opsi (a) tetap personal dan hangat, tapi jelas dan pakai Bahasa Indonesia. Opsi (b) terlalu slang untuk akun publik campuran. Opsi (c) bahasa Inggris — fine kalau memang targetnya internasional, tapi di sini audiensnya lokal. Opsi (d) kayak pengumuman kantor. Caption yang baik = personal tapi tetap sopan.",
  },
  {
    id: 4,
    construct: "Konteks & Prestasi",
    caseType: "Game 4 — Presentasi",
    task: "Kamu presentasi di depan juri lomba penelitian. Pilih cara membuka presentasi yang paling tepat.",
    situation:
      "Juri: 3 orang dewasa, profesor dari universitas. Tema: penelitian tentang bahasa.",
    options: [
      {
        key: "a",
        text: '"Selamat pagi, Bapak/Ibu Juri yang saya hormati. Perkenalkan, kami dari MAN Kotawaringin Timur akan memaparkan hasil penelitian kami tentang kesadaran berbahasa remaja."',
        correct: true,
      },
      {
        key: "b",
        text: '"Hi guys! So today we\'re gonna talk about our research. Let\'s go!"',
        correct: false,
      },
      {
        key: "c",
        text: '"Yo, jadi gini ceritanya… kita udah riset nih soal bahasa anak muda."',
        correct: false,
      },
      {
        key: "d",
        text: '"Dengan memohon rahmat Tuhan Yang Maha Esa, kami dari tim peneliti MAN Kotawaringin Timur dengan ini menyampaikan hasil kegiatan penelitian yang telah kami laksanakan."',
        correct: false,
      },
    ],
    feedback:
      "Presentasi di depan juri lomba itu situasi formal tinggi. Opsi (a) tepat: formal tapi nggak kaku, jelas, langsung ke poin. Opsi (b) dan (c) terlalu santai untuk juri. Opsi (d) terlalu panjang dan berbelit — juri wants you to get to the point. Kunci: tunjukkan kualitas tanpa berlebihan.",
  },
  {
    id: 5,
    construct: "Kesadaran Relasi",
    caseType: "Game 5 — Chat Teman",
    task: "Teman baru pindahan dari Jakarta chat kamu: 'Eh, kayaknya kita satu kelas deh. Boleh kenalan?' Pilih balasan yang paling tepat.",
    situation:
      "Kamu belum kenal orang ini. Chat pertama.",
    options: [
      {
        key: "a",
        text: '"Halo! Senang kenalan. Aku [namamu]. Kelas XII IPA 1, kan? Kalau butuh bantuan tanya aja ya!"',
        correct: true,
      },
      {
        key: "b",
        text: '"Siapa lu?"',
        correct: false,
      },
      {
        key: "c",
        text: '"Hey! Welcome to our school 🙌 Feel free to ask anything!"',
        correct: false,
      },
      {
        key: "d",
        text: '"Halo, terima kasih sudah menghubungi. Perkenalkan, saya adalah siswa kelas XII IPA 1. Silakan apabila ada yang perlu ditanyakan."',
        correct: false,
      },
    ],
    feedback:
      "Chat pertama dengan orang baru itu hangat tapi sopan. Opsi (a) pas — ramah, jelas, dan menawarkan bantuan. Opsi (b) terlalu kasar. Opsi (c) bahasa Inggris ke sesama lokal — bisa, tapi nggak perlu. Opsi (d) kayak customer service. Yang penting: bikin orang baru merasa diterima.",
  },
  {
    id: 6,
    construct: "Pemilihan Ragam",
    caseType: "Game 6 — Surat vs Chat",
    task: "Kamu harus menyampaikan dua hal: (1) izin tidak masuk sekolah ke wali kelas, dan (2) info jadwal ulang ke grup kelas. Pilih pasangan yang paling tepat.",
    situation:
      "Izin ke wali kelas via WhatsApp pribadi. Info ke grup kelas.",
    options: [
      {
        key: "a",
        text: 'Izin: "Pak, selamat pagi. Saya [namamu] izin tidak masuk hari ini karena sakit. Mohon doanya. Terima kasih." — Info grup: "Halo teman-teman, jadwal ulang besok jam 8 ya. Siapkan yang terbaik! 💪"',
        correct: true,
      },
      {
        key: "b",
        text: 'Izin: "Pak, gue sakit ga masuk ya" — Info grup: "besok ulangan jam 8 jgn lupa"',
        correct: false,
      },
      {
        key: "c",
        text: 'Izin: "Good morning Sir, I would like to inform you that I cannot attend school today due to illness." — Info grup: "Dear classmates, please be informed that the remedial test will be conducted tomorrow at 8 AM."',
        correct: false,
      },
      {
        key: "d",
        text: 'Izin: "Dengan hormat, bersama ini saya sampaikan ketidakhadiran saya pada hari ini dikarenakan kondisi kesehatan yang kurang memadai." — Info grub: "Yuk kumpul besok jam 8 buat ulangan, seru ga tuh wkwk"',
        correct: false,
      },
    ],
    feedback:
      "Situasi berbeda = ragam berbeda. Izin ke guru: sopan, jelas, personal. Info ke teman: hangat, jelas, tapi santai. Opsi (a) pas untuk keduanya. Opsi (b) terlalu casual ke guru. Opsi (c) bahasa Inggris — nggak perlu. Opsi (d) berlebihan ke guru, tapi terlalu santai ke grup. Kunci: SATU ORANG bisa pakai DUA RAGAM dalam SATU HARI — dan itu BAIK.",
  },
  {
    id: 7,
    construct: "Refleksi Kritis",
    caseType: "Game 7 — Bahasa Kampungan",
    task: "Temanmu bilang: 'Jangan pakai bahasa daerah di sini, kampungan banget!' Pilih respons yang paling menunjukkan kesadaran berbahasa.",
    situation:
      "Kamu dan teman sedang di ruang kelas. Teman baru itu dari kota.",
    options: [
      {
        key: "a",
        text: '"Bahasa daerah itu bagian dari siapa kita. Bahasa Indonesia aja lahir dari bahasa-bahasa daerah. Nggak ada yang kampungan dari punya akar."',
        correct: true,
      },
      {
        key: "b",
        text: '"Iya juga sih, mending pakai bahasa Indonesia aja ya."',
        correct: false,
      },
      {
        key: "c",
        text: '"Lu yang kampungan, nggak punya budaya!"',
        correct: false,
      },
      {
        key: "d",
        text: '"Ya udah terserah lu deh."',
        correct: false,
      },
    ],
    feedback:
      "Komentar 'bahasa daerah kampungan' itu cermin ketidaksadaran, bukan fakta. Opsi (a) — menjelaskan dengan tenang, tanpa menyerang, tapi tegas. Opsi (b) malah menyerah. Opsi (c) menyerang balik, justru memperkeruh. Opsi (d) apatis. Yang penting: bela keberagaman tanpa harus marah. Bahasa daerah itu KEKAYAAN, bukan aib.",
  },
  {
    id: 8,
    construct: "Komitmen Identitas",
    caseType: "Game 8 — Kompetisi",
    task: "Kamu ikut lomba penelitian tingkat nasional. Juri internasional akan membaca abstrakmu. Pilih cara menulis abstrak yang paling tepat.",
    situation:
      "Abstrak: 250 kata, harus jelas, ilmiah, tapi bisa dibaca siapa saja.",
    options: [
      {
        key: "a",
        text: 'Tulis dalam Bahasa Indonesia yang jelas dan ilmiah. Sertakan terjemahan Bahasa Inggris jika diperlukan. Nama penulis dan institusi tetap pakai format Indonesia.',
        correct: true,
      },
      {
        key: "b",
        text: 'Tulis sepenuhnya dalam Bahasa Inggris supaya terlihat profesional.',
        correct: false,
      },
      {
        key: "c",
        text: 'Tulis dengan campur kode Indonesia-Inggris supaya "global" tapi tetap lokal.',
        correct: false,
      },
      {
        key: "d",
        text: 'Tulis pakai bahasa Indonesia seadanya, yang penting isinya.',
        correct: false,
      },
    ],
    feedback:
      "Di kompetisi internasional, Bahasa Indonesia tetap punya tempat. Opsi (a) — pakai Bahasa Indonesia yang baik, dengan terjemahan jika diperlukan. Ini menunjukkan kebanggaan sekaligus profesionalisme. Opsi (b) meninggalkan identitas. Opsi (c) campur kode di abstrak ilmiah? Opsi (d) 'seadanya' tidak profesional. Kunci: bangga berbahasa Indonesia TIDAK berarti menolak bahasa lain — tapi MEMILIH yang tepat.",
  },
];

// Refleksi terstruktur (D.6) — 6 pertanyaan deeper, bukan surface-level
export const GAME_REFLECTION_QUESTIONS: string[] = [
  "Pernahkah kamu merasa terpaksa menggunakan bahasa tertentu agar dianggap keren? Apa yang sebenarnya terjadi saat itu?",
  "Kalau semua orang di sekitarmu tiba-tiba berhenti menggunakan Bahasa Indonesia, apa yang akan hilang dari hidupmu?",
  "Coba ingat: kapan terakhir kali kamu memilih kata dengan sadar karena tahu siapa yang akan membaca atau mendengar? Apa yang membuatmu waktu itu?",
  "Menurutmu, apakah anak muda Indonesia punya kekuatan untuk 'mengembalikan' bahasa Indonesia ke tempat yang lebih dihormati? Bagaimana caranya?",
  "Pernahkah kamu mendengar seseorang berbicara dengan Bahasa Indonesia yang sangat baik dan tiba-tiba merasa bangga? Apa yang kamu rasakan?",
  "Jika kamu harus menjelaskan kepada turis asing mengapa Bahasa Indonesia itu istimewa dalam satu kalimat, apa yang akan kamu katakan?",
];

export interface ResponseItem {
  id: number;
  statement: string;
}

export const RESPONSE_ITEMS: ResponseItem[] = [
  { id: 1, statement: "PRIMA+ membantu aku lebih sadar tentang pilihan bahasa dalam kehidupan sehari-hari." },
  { id: 2, statement: "Setelah menggunakan PRIMA+, aku lebih memperhatikan ragam bahasa yang aku pakai untuk orang yang berbeda." },
  { id: 3, statement: "Kuis dan skenario di PRIMA+ terasa relevan dengan situasi yang benar-benar aku alami." },
  { id: 4, statement: "Aku jadi lebih mengerti bahwa campur kode itu tidak selalu salah, tapi perlu disadari alasannya." },
  { id: 5, statement: "PRIMA+ membuat aku merasa lebih percaya diri berbahasa Indonesia, termasuk di media sosial." },
  { id: 6, statement: "Materi edukasi di PRIMA+ mudah dipahami dan tidak menggurui." },
  { id: 7, statement: "Aku akan merekomendasikan PRIMA+ ke teman-teman karena isinya bermanfaat." },
  { id: 8, statement: "Setelah bermain PRIMA+, aku lebih sering mengevaluasi apakah bahasaku sudah sesuai konteks." },
  { id: 9, statement: "PRIMA+ mengubah cara pandangku tentang Bahasa Indonesia — dari 'sekadar bahasa sekolah' menjadi 'bagian dari identitasku'." },
  { id: 10, statement: "Aku merasa lebih bangga menggunakan Bahasa Indonesia setelah melalui pengalaman PRIMA+." },
];

export interface EduModule {
  title: string;
  dimension: string;
  body: string;
}

// 6 EDU_SEED — modul edukasi dengan kasus nyata, bukan teori kosong
export const EDU_SEED: EduModule[] = [
  {
    title: "Bahasa dan Identitas",
    dimension: "Sikap Positif",
    body: `Bayangkan ini: kamu di rumah ngomong Javanese sama ibu, di sekolah pakai Bahasa Indonesia, dan di grup WhatsApp pakai campuran Indonesia-Inggris. Satu hari, tiga bahasa. Pertanyaannya: mana yang "kamu" yang asli?

Sebenarnya, semua itu kamu. Bahasa adalah cerminan konteks — bukan kepalsuan. Ketika kamu beralih dari Javanese ke Bahasa Indonesia ke English, itu bukan berarti kamu "berubah orang". Itu berarti kamu punya kemampuan luar biasa untuk menyesuaikan diri.

Tapi di sinilah masalahnya: ketika kita beralih tanpa sadar, kita bisa kehilangan kendali. Kita pakai bahasa karena kebiasaan, bukan karena pilihan. Dan ketika kebiasaan itu terbawa ke situasi yang tidak tepat — misalnya pakai bahasa gaul ke guru, atau pakai bahasa formal ke teman dekat — komunikasi jadi terasa kaku atau tidak sopan.

**Refleksi:** Coba ingat satu momen hari ini di mana kamu berganti bahasa tanpa berpikir panjang. Apa yang terjadi? Apakah pesanmu sampai dengan baik?`,
  },
  {
    title: "Konteks dan Audiens",
    dimension: "Kesadaran Norma",
    body: `"Guys, meetingnya di kafe jam 4 ya, nanti aku bring materinya." — Kalimat ini wajar di grup teman. Tapi coba bayangkan kalimat ini dikirim ke kepala sekolah via email. Rasanya beda, kan?

Ini yang disebut kesadaran konteks: kemampuan membaca SIAPA yang akan menerima pesanmu, dan menyesuaikan ragam bahasa sesuai situasi. Bukan soal "formal selalu benar" atau "santai selalu salah" — tapi soal KESESUAIAN.

Studi linguistik menunjukkan bahwa remaja yang punya kesadaran konteks lebih baik dalam membangun hubungan sosial. Mereka tahu kapan harus "naik ragam" (lebih formal) dan kapan boleh "turun ragam" (lebih santai). Kemampuan ini bukan bakat lahir — bisa dilatih.

Contoh nyata: DM ke guru tentang deadline. Kamu nggak perlu nulis kayak surat dinas, tapi juga nggak bisa bilang "Bu, gue telat ya 😅". Cukup: "Bu, selamat pagi. Mohon maaf, boleh saya kumpulkan besok? Hari ini ada kegiatan mendadak. Terima kasih." Sopan, jelas, manusiawi.

**Refleksi:** Pernahkah kamu mengirim pesan yang salah ragam — terlalu formal ke teman, atau terlalu santai ke guru? Apa yang terjadi setelahnya?`,
  },
  {
    title: "Code-Mixing dan Code-Switching",
    dimension: "Kesadaran Norma",
    body: `"Gue udah finish tugasnya, tapi deadline-nya masih lama kan?" — Kalimat ini mengandung apa yang linguists sebut CODE-MIXING: menyisipkan kata asing (finish, deadline) dalam kalimat Indonesia.

Ada juga CODE-SWITCHING: berpindah ke bahasa lain sepenuhnya. Misalnya, awalnya ngomong Bahasa Indonesia, tiba-tiba lanjut pakai Bahasa Inggris di pertengahan kalimat.

Keduanya WAJAR di kalangan remaja. Bukan berarti kamu "tidak bisa Bahasa Indonesia". Sering kali, code-mixing terjadi karena:
1. **Kebiasaan** — kata itu sudah jadi bagian dari kosakata harianmu
2. **Ketepatan** — tidak ada padanan Indonesia yang sama singkatnya
3. **Tren** — semua orang pakai, jadi ikut pakai
4. **Ekspresi** — terasa lebih "pass" dalam bahasa tertentu

Yang perlu disadari: ADAKAH padanan Indonesianya? Dan apakah lawan bicaramu paham kata asing yang kamu pakai?

Contoh: kalau kamu bilang ke ibu "nanti aku share link meeting-nya", ibu mungkin bingung. Bukan karena ibu "kudet", tapi karena kata itu belum masuk dunianya. Di sinilah kesadaran berbahasa bekerja: kita yang menyesuaikan, bukan mereka yang harus "update".

**Refleksi:** Dalam percakapan terakhirmu, adakah kata asing yang kamu pakai tanpa berpikir? Apakah ada padanan Indonesianya yang sama efektifnya?`,
  },
  {
    title: "Dampak Bahasa Digital",
    dimension: "Refleksi Kritis",
    body: `Ketik: "gw lg dk rmh, lu kpn dtg? gpp gpp bgt" — Kamu masih bisa baca, kan? Tapi coba bayangkan kalimat ini ditulis di surat lamaran kerja atau ujian nasional.

Bahasa digital — singkatan seperti gw, lu, bgt, gpp, FYI, btw — membentuk kebiasaan menulis kita. Penelitian dari Universitas Indonesia (2023) menunjukkan bahwa 78% pelajar SMA mengaku lebih sering menulis singkatan tidak baku di chat daripada kalimat lengkap. Dan yang menarik: 62% dari mereka mengaku kesulitan beralih ke bahasa formal saat menulis tugas sekolah.

Ini bukan soal singkatan itu "salah". Di chat dengan teman, "gw" dan "lu" efisien. Tapi masalah muncul ketika kebiasaan itu TIDAK BISA DIMATIKAN — ketika kamu menulis email ke guru dengan "gw mau izin ya", atau menulis caption sekolah dengan "yuk guys kita kumpul bgt nih".

Kemampuan untuk beralih antara ragam digital dan ragam formal adalah SKILL, bukan bakat. Dan seperti semua skill, ini bisa dilatih.

**Refleksi:** Apakah kamu pernah menulis sesuatu di chat, lalu sadar bahwa kamu menulis dengan cara yang sama saat menulis tugas sekolah? Apa dampaknya terhadap kualitas tulisanmu?`,
  },
  {
    title: "Loyalitas Bahasa Indonesia",
    dimension: "Kebanggaan",
    body: `Loyalitas bukan berarti menolak semua bahasa lain. Loyalitas berarti MEMILIH Bahasa Indonesia ketika itu adalah pilihan yang tepat — dan bangga melakukannya.

Lihat para kreator Indonesia di YouTube, TikTok, atau Instagram. Banyak dari mereka menggunakan Bahasa Indonesia untuk konten yang ditonton oleh jutaan orang — termasuk penonton internasional. Mereka membuktikan bahwa Bahasa Indonesia bisa kreatif, modern, dan global tanpa harus "berganti" ke bahasa Inggris.

Contoh nyata: YouTuber seperti Deddy Corbuzier, Atta Halilintar, atau-content creator seperti Agnez Mo — mereka semua menggunakan Bahasa Indonesia dengan bangga dalam konteks global. Mereka tidak menolak bahasa Inggris, tapi mereka MEMILIH Indonesia sebagai bahasa utama ekspresi.

Loyalitas juga berarti: ketika kamu menulis caption Instagram dalam Bahasa Indonesia yang baik, kamu sedang menunjukkan kepada 270 juta orang Indonesia bahwa bahasa kita punya tempat di dunia digital. Ketika kamu berpidato dalam Bahasa Indonesia yang jelas di depan juri internasional, kamu sedang membuktikan bahwa "bahasa nasional" bukan berarti "bahasa kampungan".

Yang terpenting: loyalitas bukan kewajiban — itu PILIHAN yang lahir dari kesadaran.

**Refleksi:** Pernahkah kamu merasa bangga menggunakan Bahasa Indonesia di situasi yang biasanya didominasi bahasa Inggris? Apa yang kamu rasakan?`,
  },
  {
    title: "Refleksi dan Aksi",
    dimension: "Refleksi Kritis",
    body: `Sekarang kamu sudah memahami konsepnya. Tapi pemahaman tanpa aksi hanya akan menjadi pengetahuan yang terlupakan. Jadi, apa yang bisa kamu lakukan mulai hari ini?

**1. Language Journal (Jurnal Bahasa)**
Setiap malam, tulis 3 kalimat tentang pengalaman bahasamu hari ini. Contoh: "Hari ini aku pakai bahasa Indonesia yang formal saat presentasi, tapi campur kode saat chat teman. Aku sadar akan perbedaannya."

**2. Code-Switching Tracker (Pelacak Alih Kode)**
Selama seminggu, catat setiap kali kamu beralih bahasa. Tanyakan: "Kenapa aku beralih? Karena kebiasaan, kebutuhan, atau tren?" Kamu akan kaget betapa sering kita beralih tanpa sadar.

**3. Caption Challenge**
Posting satu konten di media sosial minggu ini sepenuhnya dalam Bahasa Indonesia yang baik dan kreatif. Lihat: apakah orang masih merespons dengan positif? (Spoiler: biasanya iya, dan malah lebih dihargai.)

**4. Bahasa Daerah Reclaim**
Gunakan satu kata dari bahasa daerahmu dalam percakapan harian. Bangga dengan akarmu.

**5. Language Awareness Conversation**
Ajak temanmu bicara tentang kebiasaan bahasa kalian. diskusi ini sendiri sudah adalah latihan kesadaran berBahasa.

**Refleksi:** Dari lima aksi di atas, mana yang paling menantang bagimu? Mengapa? Dan mana yang akan kamu coba mulai minggu ini?`,
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

// 6 EPISODES — dialogue yang di-humanize, natural teen speech
export const EPISODES: Episode[] = [
  {
    id: 1,
    slug: "satu-pesan-banyak-orang",
    title: "Satu Pesan, Banyak Orang",
    subtitle: "Episode 1 — Bahasa & Konteks",
    panels: [
      {
        speaker: "KARA",
        text: "Gue baru aja kirim ke grup kelas: 'besok pada dateng ga? wkwk'. Terus Bu Guru masuk grup dan bilang 'tolong agak sopan'. Gue bingung, kan emang lagi ngomong ke temen.",
      },
      {
        speaker: "NARA",
        text: "Nah, itu dia. Pesan yang SAMA, kalau dibaca temen itu santai. Tapi pas Bu Guru baca, dia baca sebagai muridnya. Konteksnya beda, maknanya jadi beda.",
      },
      {
        speaker: "SENA",
        text: "Iya. Di grup kelas kan isinya campur: ada temen, ada guru. Kadang kita lupa ada 'pendengar ekstra' yang nggak kita tuju.",
      },
      {
        speaker: "NARA",
        text: "Bahasa yang baik bukan yang paling formal. Tapi yang PAS buat siapa kita ngomong.",
      },
      {
        speaker: "KARA",
        text: "Jadi salahnya bukan di isinya, tapi di siapa yang baca?",
      },
    ],
    decisionPrompt:
      'NARA: "Menurutmu, kenapa pesan yang sama bisa dianggap santai oleh teman, tapi kurang sopan oleh guru?"',
    options: [
      {
        key: "a",
        text: "Karena siapa yang baca beda. Teman nyambung karena kita sesama anak muda; guru baca sebagai murid yang harusnya lebih hormat.",
        best: true,
        feedback: {
          observation: "Kamu sadar pesan itu bergantung pada yang membaca, bukan cuma isinya.",
          context: "Grup kelas isinya campur: teman DAN guru. Selalu ada pendengar yang nggak kita sangka.",
          languageEffect: "Satu kalimat bisa 'aman' buat satu orang, tapi 'kurang ajar' buat orang lain.",
          alternative: 'Coba ubah "besok pada dateng ga? wkwk" jadi "Bu, teman-teman, besok kita kumpul ya?" — pesan sama, rasanya beda.',
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
      {
        speaker: "RAKA",
        text: "Tadi aku bilang ke ibu: 'nanti aku share link meeting-nya, Bu tinggal join jam 7'. Ibu malah bingung, 'meeting apa, join apa'. Padahal buat gue itu biasa banget.",
      },
      {
        speaker: "NARA",
        text: "Itu namanya campur kode: nyampur kata asing karena kebiasaan. Tapi nggak semua orang di sekitar kita nyambung.",
      },
      {
        speaker: "KARA",
        text: "Berarti salah ya kalau aku sering bilang 'file', 'deadline', 'share'?",
      },
      {
        speaker: "NARA",
        text: "Bukan salah. Tapi sadari: ibu kamu nggak paham bukan karena 'kudet', tapi karena kata itu nggak ada di dunianya. Kita yang harus jaga.",
      },
      {
        speaker: "SENA",
        text: "Betul. Campur kode wajar, asal kita tau kapan lawan bicara kita nyambung dan kapan nggak.",
      },
    ],
    decisionPrompt:
      'NARA: "Pas kamu bilang ke orang tua \'kita meeting online ya\', apa yang sebenarnya terjadi?"',
    options: [
      {
        key: "a",
        text: "Aku kebiasaan pakai kata asing, tapi orang tua belum tentu nyambung. Tugasnya bukan nyalahin mereka, tapi jelasin pakai kata yang mereka paham.",
        best: true,
        feedback: {
          observation: "Kamu lihat campur kode sebagai kebiasaan, bukan kesalahan orang tua.",
          context: "Orang tua punya dunia kata yang beda; itu wajar, bukan kekurangan.",
          languageEffect: "Sadar konteks = kita yang menyesuaikan biar pesan sampai, bukan memaksa mereka 'upgrade'.",
          alternative: 'Ganti "share link meeting" jadi "kirim tautan, nanti kumpul online" — tetap jelas, nggak nge-judge.',
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
      {
        speaker: "MAYA",
        text: "Coba lihat caption lu: 'such a vibe, bestie!' Keren? Iya. Tapi jujur, lu pakai Inggris karena emang nyambung, atau takut keliatan kudet?",
      },
      {
        speaker: "KARA",
        text: "Hmm... jujur sih takut keliatan kudet.",
      },
      {
        speaker: "NARA",
        text: "Wajar. Kita sering diajarin diam-diam: bahasa asing = keren, sukses, gaul. Padahal itu cuma perasaan yang dibentuk iklan dan medsos.",
      },
      {
        speaker: "MAYA",
        text: "Coba deh: tulis caption yang sama, tapi pakai Indonesia. Masih keren nggak?",
      },
      {
        speaker: "KARA",
        text: "Kayaknya... masih bisa, asal gue yang nulis.",
      },
    ],
    decisionPrompt:
      'MAYA: "Kalau kamu pakai istilah asing di caption, alasanmu yang bener-bener jujur apa?"',
    options: [
      {
        key: "a",
        text: "Kalau emang lebih tepat/singkat dan aku tau kenapa — oke. Tapi kalau cuma takut keliatan kudet, itu bukan pilihan, itu ketakutan.",
        best: true,
        feedback: {
          observation: "Kamu bedain antara pilihan fungsional dan ketakutan sosial.",
          context: "Kesan 'keren' dibentuk lingkungan & media, bukan dari kata itu sendiri.",
          languageEffect: "Pakai asing karena fungsi = sadar. Pakai asing karena takut = dikuasai tren.",
          alternative: "Tulis caption yang sama tanpa kata asing, tetap ceria & relevan. Lihat bedanya?",
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
      {
        speaker: "KARA",
        text: "Orang bilang 'loyal berbahasa' berarti bicara kayak penyiar berita. Gue nggak sanggup tiap hari 'selamat pagi bapak ibu'.",
      },
      {
        speaker: "BIMA",
        text: "Itu salah tangkap. Loyal bukan berarti jadi robot baku. Bahasa Indonesia itu luas: bisa becanda, santai, sampai jadi puisi.",
      },
      {
        speaker: "NARA",
        text: "Yang penting kamu pegang kendali. Ke temen santai, ke guru hormat, ke publik jelas. Satu bahasa, banyak wajah.",
      },
      {
        speaker: "KARA",
        text: "Jadi boleh santai tapi tetep 'aku'?",
      },
      {
        speaker: "BIMA",
        text: "Boleh banget. Yang nggak boleh cuma pasrah sama kebiasaan tanpa ngeh.",
      },
    ],
    decisionPrompt:
      'BIMA: "Bisa nggak bahasa Indonesia tetap LU punya — santai, asli — tanpa ninggalin bahasamu sendiri?"',
    options: [
      {
        key: "a",
        text: "Bisa. Santai bukan berarti nggak sayang bahasa sendiri. Aku bisa becanda pakai Indonesia dan tetep bangga.",
        best: true,
        feedback: {
          observation: "Kamu lihat bahasa Indonesia sebagai bahasa yang hidup, bukan aturan kaku.",
          context: "Ragam beda untuk relasi & tujuan beda — semua sah asal sadar.",
          languageEffect: "Sikap ini bangun rasa memiliki, bukan rasa dihakimi.",
          alternative: "Bikin caption kegiatan sekolah yang ceria tapi tetep bahasa Indonesia.",
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
      {
        speaker: "BIMA",
        text: "Temen gue dari luar pulau pernah diketawain gara-gara logatnya pas presentasi. Padahal dia jago banget.",
      },
      {
        speaker: "KARA",
        text: "Sedih. Logat kan bukan bobot nilai.",
      },
      {
        speaker: "NARA",
        text: "Persis. Bahasa Indonesia lahir justru buat nyambungin orang dari bermacam daerah, bukan buat nyamain semua jadi satu.",
      },
      {
        speaker: "BIMA",
        text: "Daerah + Indonesia = kita. Bukan lawan.",
      },
      {
        speaker: "KARA",
        text: "Jadi kalau ada yang ketawa, aku harus bela dia?",
      },
    ],
    decisionPrompt:
      'BIMA: "Pas temenmu diketawain karena logatnya, apa yang kamu lakuin?"',
    options: [
      {
        key: "a",
        text: "Bela dia. Logat bukan cermin kecerdasan. Bahasa Indonesia justru tempat semua suara punya tempat.",
        best: true,
        feedback: {
          observation: "Kamu lihat bahasa daerah & Indonesia sebagai satu kesatuan, bukan lawan.",
          context: "Bahasa Indonesia menyatukan tanpa menghilangkan akar daerah.",
          languageEffect: "Sikap inklusif kuatin kebanggaan sekaligus persatuan.",
          alternative: "Coba pakai satu istilah daerah dalam obrolan sehari-hari dengan bangga.",
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
      {
        speaker: "MAYA",
        text: "Gue pernah balas 'oh' ke temen, dia ngira gue marah. Padahal gue emang cuma 'oh'. Di DM, satu kata bisa jadi drama.",
      },
      {
        speaker: "NARA",
        text: "Tanpa nada dan muka, chat gampang meleset. Makanya kejelasan penting, meski mediumnya santai.",
      },
      {
        speaker: "KARA",
        text: "Berarti gue harus mikir dua kali tiap ngetik?",
      },
      {
        speaker: "MAYA",
        text: "Nggak harus kaku. Cukup tau: apa yang kubikin bisa dibaca beda sama orang lain.",
      },
      {
        speaker: "NARA",
        text: "Pakai bahasa lain bila perlu. Pakai Indonesia bila itu pilihanmu. Yang penting: sadari alasannya.",
      },
    ],
    decisionPrompt:
      'MAYA: "Kalau tren dan algoritma terus ngebentuk cara kamu nulis di digital, apa yang bisa kamu lakuin?"',
    options: [
      {
        key: "a",
        text: "Sadari pengaruhnya, terus pilih: sebelum kirim, tanya 'ini buat siapa & tujuannya apa?'.",
        best: true,
        feedback: {
          observation: "Kamu akui pengaruh digital sekaligus jaga kendali.",
          context: "Chat, komentar, caption, video punya konteks berbeda.",
          languageEffect: "Kesadaran cegah bahasa terbawa tren tanpa arah.",
          alternative: "Sebelum posting, tanya: ini untuk siapa & tujuannya apa?",
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
    situation: '"Aku udah submit file-nya lewat email tadi."',
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
      { key: "a", text: '"Tolong share link meeting-nya ya."', correct: true },
      { key: "b", text: '"Tolong share link meeting-nya ya bunga mawar mekar."', correct: false },
      { key: "c", text: '"ASDF ghjk meeting link share."', correct: false },
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
    situation: 'Pesan ke teman: "Bro, nanti kumpul di ruang guru ya, jam 2."',
    options: [
      { key: "a", text: '"Pak, mohon maaf, apakah Bapak berkenan hadir rapat di ruang guru pukul 14.00?"', correct: true },
      { key: "b", text: '"Pak, nanti kumpul di ruang guru ya jam 2."', correct: false },
      { key: "c", text: '"Bro, meeting di ruang guru jam 2, Pak ikut ya."', correct: false },
    ],
    feedback: "Pergantian lawan bicara (teman → pimpinan) menuntut pergeseran ragam: lebih formal, santun, dan jelas. Kesadaran konteks = memilih ragam sebelum bicara.",
  },
  {
    id: 2,
    construct: "Context Switch",
    caseType: "Context Switch",
    task: "Mana balasan yang paling tepat untuk komentar netizen di media sosial sekolah?",
    situation: 'Netizen: "Kegiatannya membosankan."',
    options: [
      { key: "a", text: '"Terima kasih atas masukannya, kami akan terus berusaha menyajikan kegiatan yang bermanfaat."', correct: true },
      { key: "b", text: '"Jangan nyinyir lah."', correct: false },
      { key: "c", text: '"Bosan? gitu aja ngomel."', correct: false },
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
      { key: "a", text: '"Yth teman-teman, diinformasikan pengumpulan tugas besok. Mohon disiapkan. Terima kasih."', correct: true },
      { key: "b", text: '"wkwk besok kumpul tugas, gak ngumpul gue lapor Bu."', correct: false },
      { key: "c", text: '"submit tugas tmrw or else."', correct: false },
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

export const GAME_CHAT_CRASH: Scenario[] = [
  {
    id: 1,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: "Pesan singkat ini rawan salah tafsir. Pilih revisi terbaik.",
    situation: 'Kamu menulis ke teman: "wkkk besok liat aja" (maksud: tunggu kabar besok).',
    options: [
      { key: "a", text: '"besok aku kabari ya, tunggu info ya"', correct: true },
      { key: "b", text: '"wkkk besok liat aja"', correct: false },
      { key: "c", text: '"besok."', correct: false },
    ],
    feedback: "Tanpa nada & ekspresi, singkatan ambigu mudah salah paham. Menambah konteks singkat menyelamatkan maksud pesan.",
  },
  {
    id: 2,
    construct: "Chat Crash",
    caseType: "Chat Crash",
    task: 'Teman membalas "sok sibuk amat" setelah kamu telat membalas. Respons mana yang tak memperkeruh?',
    situation: "Pilih balasan yang menjaga kejelasan & kesantunan.",
    options: [
      { key: "a", text: '"maaf ya tadi lagi sibuk, bukan sok. ada yang bisa dibantu?"', correct: true },
      { key: "b", text: '"eh kamu ngatur-ngatur mulu sih"', correct: false },
      { key: "c", text: '"capel"', correct: false },
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
      { key: "a", text: '"info: kumpul tugas besok 08.00. tolong sebarkan, makasih"', correct: true },
      { key: "b", text: '"besok kumpul ya wkwk"', correct: false },
      { key: "c", text: '"08.00."', correct: false },
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
    situation: 'Draft: "yuk ikut lomba seru banget guys!! dm aja"',
    options: [
      { key: "a", text: '"Diberitahukan: pendaftaran lomba dibuka. Silakan hubungi panitia. Terima kasih."', correct: true },
      { key: "b", text: '"yuk ikut lomba seru banget guys!! dm aja"', correct: false },
      { key: "c", text: '"our competition is open, join now!"', correct: false },
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
      { key: "a", text: '"Ayo ikut latihan bersama Sabtu ini! Kumpul di lapangan jam 3. Seru loh :)"', correct: true },
      { key: "b", text: '"wkwk sabtu yok"', correct: false },
      { key: "c", text: '"3pm sat"', correct: false },
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
      { key: "a", text: '"Bahasa Indonesia itu keren kalau kita pakai dengan bangga & tepat."', correct: true },
      { key: "b", text: '"bhs indo kuno sih"', correct: false },
      { key: "c", text: '"pake inggris aja biar ga kudet"', correct: false },
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
    situation: 'Teman: "bahasa Indonesia kan kuno buat anak muda."',
    options: [
      { key: "a", text: '"Bahasa Indonesia punya ragam: bisa santai, kreatif, dan modern. Kuno itu persepsi, bukan sifat bahasa."', correct: true },
      { key: "b", text: '"nggak lah, kamu aja yang norak"', correct: false },
      { key: "c", text: '"ya udah pake inggris sana"', correct: false },
    ],
    feedback: "Argumen terbaik menjelaskan fakta (ragam bahasa) tanpa menyerang. Ini melatih Critical Choice & Language Identity.",
  },
  {
    id: 2,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Lawan mitos 'bahasa asing selalu lebih keren'. Pilih kartu terbaik.",
    situation: 'Teman: "pake Inggris itu otomatis keren."',
    options: [
      { key: "a", text: '"Kesan keren dibentuk lingkungan & media, bukan kata itu sendiri. Asing boleh kalau fungsional."', correct: true },
      { key: "b", text: '"kamu lebay"', correct: false },
      { key: "c", text: '"emang iya"', correct: false },
    ],
    feedback: "Menghadapi mitos butuh penjelasan rasional tentang pengaruh sosial, bukan sekadar membantah.",
  },
  {
    id: 3,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Pilih alasan mempertahankan bahasa daerah di samping Indonesia.",
    situation: 'Teman: "bahasa daerah itu nggak penting."',
    options: [
      { key: "a", text: '"Bahasa daerah & Indonesia saling melengkapi sebagai identitas bangsa."', correct: true },
      { key: "b", text: '"ya udah buang aja"', correct: false },
      { key: "c", text: '"kamu nggak nasionalis"', correct: false },
    ],
    feedback: "Bahasa daerah dan Indonesia bukan lawan. Keduanya memperkuat identitas, bukan mengurangi.",
  },
  {
    id: 4,
    construct: "Language Battle Card",
    caseType: "Battle Card",
    task: "Kartu terbaik menanggapi 'yang penting paham'",
    situation: 'Teman: "asal orang paham, terserah bahasanya."',
    options: [
      { key: "a", text: '"Paham itu penting, tapi ragam & kesantunan menentukan apakah pesan sampai dengan baik."', correct: true },
      { key: "b", text: '"ya udah terserah"', correct: false },
      { key: "c", text: '"kamu bodoh"', correct: false },
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
    situation: '"Wah, rapi sekali mejamu." (Padahal mejamu biasanya berantakan.)',
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
    task: 'Apa maksud tersirat "Terima kasih sudah datang" di akhir surat minta maaf?',
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
    task: '"Seandainya saja aku diberi tahu lebih awal." Maksudnya...',
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
    task: 'Apa implikasi "Kami sudah berusaha semaksimal mungkin"?',
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
    feedback: "Bahasa Indonesia menyatukan warga lintas daerah secara setara, tanpa menenggelamkan bahasa daerah.",
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
