export interface DataPoint {
  id: string;
  headline: string;
  big: string;
  desc: string;
  points?: string[];
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
    id: "faktor2",
    headline: "Faktor Pemicu Pergeseran Ragam Bahasa di Era Digital",
    big: "Analisis Sosiolinguistik",
    desc: "Analisis sosiolinguistik mengenai latar belakang terjadinya pergeseran pola komunikasi dan standar bahasa di masyarakat.",
    points: [
      "Intensitas Penggunaan Media Sosial: Ekosistem platform digital yang tinggi membentuk kebiasaan komunikasi baru serta mempercepat penyebaran ragam bahasa non-formal di kalangan pengguna muda.",
      "Pengaruh Budaya Populer Global: Masuknya unsur budaya luar dan tren global secara konstan menggeser porsi penggunaan tata bahasa yang baku dalam percakapan sehari-hari.",
      "Rendahnya Kesadaran Kontekstual: Kurangnya internalisasi fungsi ragam bahasa formal menyebabkan pudarnya batasan penggunaan bahasa yang baik dan benar sesuai situasi.",
    ],
    source: {
      author: "Nabilla Qorima, Ika Amelia, et al.",
      year: "2026",
      title: "Pergeseran Ragam Bahasa dalam Ekosistem Media Sosial: Kajian Sosiolinguistik dan Relevansinya terhadap Penguatan Bahasa Indonesia di Perguruan Tinggi",
      venue: "Jurnal Arjuna: Publikasi Ilmu Pendidikan, Bahasa dan Matematika, Vol. 4 No. 1 (2026)",
      link: "https://journal.aripi.or.id/index.php/Arjuna/article/view/2706",
    },
  },
  {
    id: "kosakata",
    headline: "Tingkat Penguasaan Kosakata Baku dan Faktor Penurunannya",
    big: "Kosakata Baku",
    desc: "Analisis data ilmiah mengenai penurunan penguasaan bahasa Indonesia baku beserta faktor pemicunya di lingkungan generasi muda.",
    points: [
      "Kategori Penguasaan Cukup: Berdasarkan kajian empiris terhadap tingkat penguasaan kosakata baku, kemampuan berbahasa formal generasi muda mayoritas berada pada kategori cukup.",
      "Faktor Minimnya Eksposur: Rendahnya frekuensi penggunaan kata baku dalam aktivitas harian disebabkan oleh interaksi yang dominan menggunakan ragam informal.",
      "Pengaruh Lingkungan dan Teknologi: Kebiasaan berinteraksi dengan paparan media dan gaya bahasa non-formal secara terus-menerus membuat individu menjadi kurang akrab dengan kaidah bahasa baku.",
    ],
    source: {
      author: "INNOVATIVE: Journal of Science Research",
      year: "2023",
      title: "Penguasaan Kosakata Baku Bahasa Indonesia Mahasiswa",
      venue: "INNOVATIVE: Journal of Science Research",
      link: "https://j-innovative.org/index.php/Innovative/article/view/14615",
    },
  },
  {
    id: "stigma",
    headline: "Stigma Kemuakan dan Anggapan Kaku pada Penggunaan Ragam Bahasa Baku",
    big: "Stigma & Sikap",
    desc: "Analisis sosiolinguistik mengenai hambatan psikologis dan sosial generasi muda dalam menggunakan bahasa Indonesia baku di luar situasi formal.",
    points: [
      "Ketidaknyamanan Penggunaan Formal: Berdasarkan kajian empiris, penggunaan bahasa Indonesia yang baku di luar situasi resmi sering kali membuat penutur muda merasa tidak nyaman dan kaku.",
      "Pengaruh Lingkungan Komunikasi: Kebiasaan berinteraksi menggunakan ragam kasual atau bahasa sehari-hari membentuk pola pikir bahwa ragam baku kurang sesuai dengan dinamika pergaulan masa kini.",
      "Urgensi Pendekatan Kontekstual: Kondisi ini memicu pudarnya keterbiasaan terhadap kaidah bahasa resmi sehingga memerlukan media edukasi agar nilai kebahasaan tetap terjaga.",
    ],
    source: {
      author: "Desi Julianti & Irwan Siagian",
      year: "2023",
      title: "Analisis Pengaruh Bahasa Daerah Terhadap Penggunaan Bahasa Indonesia",
      venue: "Innovative: Journal Of Social Science Research, Vol. 3 No. 2 (2023)",
      link: "https://j-innovative.org/index.php/Innovative/article/view/956",
    },
  },
  {
    id: "urgensi",
    headline: "Urgensi Kesadaran Berbahasa dan Sikap Positif Generasi Muda",
    big: "Kesadaran Berbahasa",
    desc: "Analisis peran kesadaran berbahasa (language awareness) dan sikap positif dalam mempertahankan eksistensi serta kualitas penggunaan bahasa Indonesia.",
    points: [
      "Peran Kunci Pendidikan: Lembaga pendidikan memegang peranan vital dalam memprioritaskan pemahaman siswa agar senantiasa menggunakan bahasa Indonesia secara baik dan benar sesuai kaidah.",
      "Tantangan Era Modern: Arus globalisasi serta dinamika perkembangan zaman menjadi faktor utama yang melemahkan tingkat kesadaran berbahasa di ruang publik.",
      "Dimensi Sikap Positif: Sikap positif terhadap bahasa nasional diwujudkan melalui tiga pilar utama, yaitu kesetiaan berbahasa, kebanggaan berbahasa, serta kesadaran terhadap norma kebahasaan.",
    ],
    source: {
      author: "Adelia Br Aritonang, et al.",
      year: "2025",
      title: "Pentingnya Kesadaran Berbahasa: Upaya Meningkatkan Penggunaan Bahasa Indonesia yang Benar di Era Digital",
      venue: "Guruku: Jurnal Pendidikan dan Sosial Humaniora, Vol. 3 No. 2 (2025)",
      link: "https://e-journal.poltek-kampar.ac.id/index.php/GURUKU/article/view/957",
    },
  },
];

export const REFLECTION_PROMPTS = [
  "Pernah nggak kamu menyisipkan kata asing tanpa sadar? Coba ingat kata apa dan kapan.",
  "Kenapa menurutmu kata itu terasa lebih nyaman dipakai dibanding padanan Indonesia?",
  "Kalau lawan bicaramu berubah dari teman ke guru, apakah pilihan bahasamu ikut berubah? Bagaimana caranya?",
];
