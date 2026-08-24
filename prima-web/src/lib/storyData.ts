export interface DataPoint {
  id: string;
  headline: string;
  big: string;
  desc: string;
  chat?: { from: string; text: string; foreign?: string[] }[];
  source: {
    author: string;
    year: string;
    title: string;
    venue: string;
    link?: string;
  };
}

export const STORY_DATA: DataPoint[] = [
  {
    id: "insertion",
    headline: "Penyisipan Kata Mendominasi",
    big: "63,41%",
    desc: "Dari 41 tuturan yang mengandung alih kode dan campur kode dalam interaksi pembelajaran, campur kode penyisipan kata menjadi bentuk paling tinggi (26 tuturan), diikuti penyisipan frasa (19,51%) dan penyisipan klausa (2,43%).",
    chat: [
      { from: "Rani", text: "eh tugasnya nanti di {submit} ke mana?", foreign: ["submit"] },
      { from: "Dimas", text: "ke {link} yang dikirim Bu. jangan sampe kelewat {deadline}-nya", foreign: ["link", "deadline"] },
    ],
    source: {
      author: "Tim penulis Prosiding KIBAR UNINDRA",
      year: "2025",
      title: "Alih Kode dan Campur Kode dalam Interaksi Pembelajaran Bahasa Indonesia di SMK Al Fat-Hiyah Jakarta",
      venue: "Prosiding Seminar Nasional KIBAR, Universitas Indraprasta PGRI",
      link: "https://proceeding.unindra.ac.id/index.php/kibar",
    },
  },
  {
    id: "genz",
    headline: "Tiga Wajah Campur Kode Gen Z",
    big: "Inner · Outer · Hybrid",
    desc: "Kajian wacana TikTok menemukan tiga bentuk sekaligus: campur kode internal (dengan ragam akrab sehari-hari), eksternal (menyisipkan bahasa asing), dan hibrida (imbuhan Indonesia + kata asing). Contoh asli dari data: 'Ngedownload lagu viral di TikTok' — imbuhan 'nge-' bertemu kata 'download'.",
    chat: [
      { from: "@jesselyn", text: "Ide cemilan yang {next level}, yang di {level up}!", foreign: ["next level", "level up"] },
      { from: "@androidnyel", text: "Lagi {ngedownload} lagu viral, nanti aku {kabarin} ya", foreign: ["ngedownload"] },
    ],
    source: {
      author: "Budiana, N., Safitri, Ratnasari, H., & Mustofa, M.",
      year: "2025",
      title: "Fenomena Campur Kode pada Komunikasi Gen Z: Analisis Wacana di Media Sosial TikTok",
      venue: "ISOLEK: Jurnal Pendidikan, Pengajaran, Bahasa, dan Sastra, 3(2), 56-61",
      link: "https://doi.org/10.59638/isolek.v3i2.681",
    },
  },
  {
    id: "igstory",
    headline: "Satu Story, Dua Bahasa",
    big: "Campur tanpa sadar",
    desc: "Studi kasus mengamati unggahan seorang remaja: 'Kemarin hangout bareng temen-temen, dan kita totally have fun! Bener-bener best day ever!' Dalam satu kalimat pendek, empat unsur Inggris menyusup tanpa terasa sebagai pilihan — melainkan sebagai kebiasaan.",
    chat: [
      { from: "Juwita", text: "Kemarin {hangout} bareng temen-temen, dan kita {totally have fun}! Bener-bener {best day ever}!", foreign: ["hangout", "totally have fun", "best day ever"] },
    ],
    source: {
      author: "Purba, E. N., Togatorop, D. P., Simbolon, A., & Sari, Y.",
      year: "2024",
      title: "Analisis Pengaruh Media Sosial terhadap Keberagaman Bahasa: Campur Kode sebagai Tren Komunikasi Anak Muda",
      venue: "Atmosfer: Jurnal Pendidikan, Bahasa, Sastra, Seni, Budaya, dan Sosial Humaniora, 2(4)",
      link: "https://doi.org/10.59024/atmosfer.v2i4.1060",
    },
  },
  {
    id: "attitude",
    headline: "Menerima Tapi Belum Paham",
    big: "72,7% vs 65,5%",
    desc: "Survei pada mahasiswa kebahasaan menunjukkan penerimaan terhadap campur kode tergolong baik (72,7%), tetapi pemahaman tentang penggunaannya justru berkategori kurang baik (65,5%). Artinya, membiasakan bukan berarti memahami kapan dan mengapa digunakan.",
    source: {
      author: "Penulis Argopuro: Jurnal Ilmu Bahasa",
      year: "2025",
      title: "Persepsi Mahasiswa Program Studi Pendidikan Bahasa dan Sastra Indonesia Universitas Islam Riau terhadap Penggunaan Campur Kode di Media Sosial",
      venue: "Argopuro: Jurnal Ilmu Bahasa, 11(3), 91-100",
      link: "https://cibangsa.com/index.php/argopurojournal",
    },
  },
  {
    id: "persuasive",
    headline: "Bukan Gaya-Gayaan Belaka",
    big: "3 fungsi",
    desc: "Studi konten TikTok menemukan penyisipan unsur bahasa Inggris berfungsi sebagai strategi persuasif, afektif, dan informatif dalam komunikasi digital — ada alasan komunikatif di baliknya, bukan sekadar tren kosong.",
    source: {
      author: "Fauzi, M. R. & Rosalina, S.",
      year: "2023",
      title: "Analisis Penggunaan Campur Kode dalam Konten wanderlearn pada Akun TikTok eranitri",
      venue: "Bahtera Indonesia: Jurnal Penelitian Bahasa dan Sastra Indonesia, 8(2), 335-345",
      link: "https://doi.org/10.31943/bi.v8i2.394",
    },
  },
];

export const REFLECTION_PROMPTS = [
  "Pernah nggak kamu menyisipkan kata asing tanpa sadar? Coba ingat kata apa dan kapan.",
  "Kenapa menurutmu kata itu terasa lebih nyaman dipakai dibanding padanan Indonesia?",
  "Kalau lawan bicaramu berubah dari teman ke guru, apakah pilihan bahasamu ikut berubah? Bagaimana caranya?",
];
