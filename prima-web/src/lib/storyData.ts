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
      { from: "Dimas", text: "ke {link} yang dikirim Bu, jangan {lupa} cek deadline", foreign: ["link", "lupa"] },
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
    id: "tiktok",
    headline: "Campur Kode Jadi Gaya di TikTok",
    big: "Beragam bentuk",
    desc: "Kajian kualitatif pada akun TikTok menemukan warganet memadukan bahasa Indonesia dengan unsur asing dalam berbagai tingkat bahasa, dipakai untuk memperkuat relasi interpersonal, mempercantik pesan, dan menghadirkan persona digital yang menarik.",
    chat: [
      { from: "@sabrina", text: "OOTD hari ini {simple} aja, semoga kalian {like} ya!", foreign: ["simple", "like"] },
      { from: "komentar", text: "keren banget kak, {vibes}-nya dapet!", foreign: ["vibes"] },
    ],
    source: {
      author: "Mustikarani, A. & Pratiwi, D. R.",
      year: "2025",
      title: "Penggunaan Campur Kode Warganet pada Akun TikTok @sabrinachairunnisa_: Kajian Kualitatif Deskriptif",
      venue: "Basastra: Jurnal Bahasa, Sastra, dan Pengajarannya, 13(1), 163-173",
      link: "https://doi.org/10.20961/basastra.v13i2.97728",
    },
  },
  {
    id: "twitter",
    headline: "Tiga Bahasa dalam Satu Kicauan",
    big: "ID + Jawa + Inggris",
    desc: "Pada kicauan remaja di Surakarta, kombinasi bahasa daerah, bahasa Indonesia, dan bahasa Inggris berfungsi menciptakan humor, membangun rasa kebersamaan, serta menunjukkan identitas linguistik yang terus berkembang.",
    chat: [
      { from: "Tika", text: "arep ngapune aku {overthinking}, yo wis lah", foreign: ["overthinking"] },
      { from: "Wulan", text: "santai {bro}, nanti juga kelar", foreign: ["bro"] },
    ],
    source: {
      author: "Melati, I. S. & Assidik, G. K.",
      year: "2022",
      title: "Alih Kode dan Campur Kode Bahasa Jawa dan Bahasa Indonesia pada Kicauan Twitter Remaja di Surakarta",
      venue: "Jurnal kajian sosiolinguistik (Neliti)",
      link: "https://www.neliti.com/publications/447538",
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
    headline: "Bahasa Inggris sebagai Strategi",
    big: "3 fungsi",
    desc: "Studi konten TikTok menemukan penyisipan unsur bahasa Inggris berfungsi sebagai strategi persuasif, afektif, dan informatif dalam komunikasi digital — bukan sekadar gaya-gayaan.",
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
