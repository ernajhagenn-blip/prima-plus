"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useLogGameResult } from "@/lib/useLogGameResult";

const FLOORS = [
  {
    floor: 1,
    title: "Dasar Bahasa",
    desc: "Uji pemahamanmu tentang tata bahasa dasar Indonesia.",
    icon: "📖",
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
    questions: [
      {
        q: "Kalimat \"Dia bilang bahwa dia nggak bisa datang\" mengandung fenomena linguistik apa?",
        options: [" Pleonasme (pengulangan makna)", "Endapan bahasa daerah pada kata \"bilang\"", "Register informal yang menggeser fungsi \"mengatakan\"", "Metafora komunikatif"],
        answer: 2,
        explanation: "\"Bilang\" adalah register informal yang secara pragmatis menggeser fungsi \"mengatakan/menyatakan\". Ini bukan pleonasme atau endapan daerah, melainkan pergeseran register dalam komunikasi sehari-hari.",
      },
      {
        q: "Frasa \"lebih bagus\" dalam kalimat \"Hasilnya lebih bagus dari yang kusangka\" secara normatif baku harus diganti dengan...",
        options: ["Lebih baik", "Lebih elok", "Lebih unggul", "Lebih cemerlang"],
        answer: 0,
        explanation: "Menurut KBBI, \"bagus\" tidak memiliki bentuk perbandingan \"lebih bagus\" dalam ragam baku. Padanan baku yang tepat adalah \"lebih baik\". Namun dalam penggunaan populer, \"lebih bagus\" sudah sangat umum.",
      },
      {
        q: "Dalam kalimat \"Mereka sudah berdiskusi tentang rencana itu\", kata \"tentu\" yang tepat secara baku adalah...",
        options: ["Sudah benar seperti itu", "\"tentang\" memang bentuk baku", "\"tentu\" harusnya \"mengenai\"", "Tidak ada masalah karena ini ragam lisan"],
        answer: 1,
        explanation: "\"Tentang\" adalah bentuk baku sesuai KBBI untuk preposisi yang menunjukkan topik. \"Mengenai\" juga benar, tapi \"tentang\" sudah sesuai ejaan yang berlaku.",
      },
      {
        q: "Fenomena \"ganti bahasa guru\" (code-switching) dalam dunia pendidikan Indonesia menunjukkan...",
        options: ["Kegagalan sistem pendidikan dalam mengajar bahasa asing", "Interferensi linguistik yang wajar dalam situasi bilingual", "Bukti bahwa bahasa Indonesia tidak mampu menampung konsep akademik", "Ketidakmampuan siswa menggunakan bahasa Indonesia"],
        answer: 1,
        explanation: "Code-switching guru Indonesia-Inggris adalah interferensi linguistik wajar dalam konteks bilingual. Ini bukan kegagalan atau ketidakmampuan, melainkan fenomena alamiah komunikasi dwibahasa.",
      },
      {
        q: "Kalimat \"Dia yang paling rajin di antara mereka semua\" mengandung redundansi. Bagian mana yang seharusnya dihilangkan?",
        options: ["\"yang paling\"", "\"di antara\"", "\"semua\"", "\"Dia\""],
        answer: 2,
        explanation: "\"Di antara mereka\" sudah mencakup makna \"semua\". Penambahan \"semua\" setelah \"mereka\" adalah pleonasme (pengulangan makna) yang tidak perlu dalam bahasa baku.",
      },
    ],
  },
  {
    floor: 2,
    title: "Konteks Komunikasi",
    desc: "Pahami bagaimana situasi mempengaruhi pilihan bahasamu.",
    icon: "🗣️",
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.3)",
    questions: [
      {
        q: "Seorang dokter mengatakan \"Anda harus kontrol lagi minggu depan\" kepada pasien. Dalam konteks ini, \"kontrol\" berfungsi sebagai...",
        options: ["Kata baku bahasa Indonesia untuk \"memeriksa\"", "Serapan dari bahasa Belanda \"controle\" yang sudah diterima", "Singkatan tidak resmi dari \"kontrol diri\"", "Bahasa gaul yang tidak pantas digunakan dokter"],
        answer: 1,
        explanation: "\"Kontrol\" dalam konteks medis adalah serapan dari bahasa Belanda \"controle\" yang sudah mapan dalam bahasa Indonesia. Istilah ini diterima secara luas dan bukan bahasa gaul.",
      },
      {
        q: "Seorang guru bahasa Indonesia menggunakan istilah \"aku\" saat berbicara dengan siswa SMA. Analisis linguistik yang paling tepat adalah...",
        options: ["Guru tersebut tidak profesional karena tidak menggunakan \"saya\"", "Pergeseran register menuju kesetaraan untuk membangun kedekatan emosional", "Kesalahan penggunaan bahasa dalam konteks formal pendidikan", "Guru tersebut berasal dari daerah yang menggunakan \"aku\" sebagai bahasa baku"],
        answer: 1,
        explanation: "Penggunaan \"aku\" oleh guru kepada siswa adalah strategi pergeseran register (register shifting) untuk membangun kedekatan. Ini bukan kesalahan, melainkan kompetensi pragmatik yang baik.",
      },
      {
        q: "Ketika dua orang penutur Jawa berbicara bahasa Indonesia di kantor, terjadi \"gaya bahasa campuran\". Fenomena ini disebut...",
        options: ["Interferensi bahasa", "Diglosia", "Multilingualism", "Kode campur (code-mixing) dengan substrat bahasa daerah"],
        answer: 3,
        explanation: "Campuran bahasa Indonesia dengan unsur Jawa dalam percakapan formal menunjukkan code-mixing dengan substrat bahasa daerah. Ini berbeda dari interferensi (yang bersifat tidak disengaja) karena sering dilakukan secara sadar.",
      },
      {
        q: "Seorang anak muda mengirim pesan: \"Gue lagi di café nih, mau join gue nggak?\" Pilihan ragam ini paling tepat untuk konteks...",
        options: ["Percakapan formal dengan atasan", "Chat antarteman sebaya yang akrab", "Surat resmi ke instansi pemerintah", "Presentasi akademik di kelas"],
        answer: 1,
        explanation: "Penggunaan \"gue\", \"nih\", dan \"join\" adalah ciri ragam informal akrab yang tepat untuk percakapan antarteman sebaya. Konteks ini membenarkan penggunaan bahasa gaul.",
      },
      {
        q: "Istilah \"quiet book\" yang digunakan oleh guru PAUD untuk merujuk pada buku aktivitas menunjukkan...",
        options: ["Penetrasi bahasa Inggris yang merusak bahasa Indonesia", "Adaptasi kreatif istilah asing untuk kebutuhan spesifik lokal", "Ketidakmampuan guru mencari padanan Indonesia", "Bukti bahwa bahasa Indonesia kurang kaya"],
        answer: 1,
        explanation: "\"Quiet book\" adalah adaptasi kreatif istilah spesifik yang belum memiliki padanan populer di Indonesia. Ini menunjukkan fleksibilitas bahasa dalam menyerap kebutuhan terminologi baru.",
      },
    ],
  },
  {
    floor: 3,
    title: "Adaptasi Media",
    desc: "Tunjukkan kemampuanmu menyesuaikan bahasa untuk platform berbeda.",
    icon: "📱",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.3)",
    questions: [
      {
        q: "Sebuah akun Instagram resmi pemerintah menulis: \"Hayo siapa yang udah vaksin? Jangan lupa ya guys!\" Analisis yang paling tepat adalah...",
        options: ["Sudah tepat karena media sosial harus santai", "Penggunaan \"guys\" tidak tepat untuk akun resmi pemerintah karena register tidak sesuai", "Perlu ditambah emoji agar lebih menarik", "Sudah benar karena target audiens adalah anak muda"],
        answer: 1,
        explanation: "Akun resmi pemerintah seharusnya menggunakan register formal-profesional. Penggunaan \"guys\" adalah register informal yang tidak sesuai dengan identitas lembaga pemerintah, meskipun targetnya anak muda.",
      },
      {
        q: "Seorang jurnalis menulis: \"Korban selamat mengungkapkan bahwa ia melihat pelaku kabur menggunakan motor hitam.\" Kalimat ini menggunakan...",
        options: ["Bahasa jurnalistik yang baik dengan Reported Speech", "Bahasa percakapan yang tidak sesuai untuk berita", "Bahasa ilmiah yang terlalu kaku", "Bahasa Indonesia campuran yang tidak baku"],
        answer: 0,
        explanation: "Kalimat ini menggunakan Reported Speech (kalimat tidak langsung) yang merupakan ciri khas bahasa jurnalistik. Struktur \"mengungkapkan bahwa...\" menunjukkan kutipan tidak langsung yang tepat.",
      },
      {
        q: "Seorang content creator menulis caption: \"Yuk, kita bedah strategi marketing yang bikin brand kamu go global!\" Target audiens dan register yang digunakan adalah...",
        options: ["Audiens umum, register semi-formal yang persuasif", "Audiens bisnis profesional, register formal", "Audiens anak-anak, register sangat santai", "Audiens akademik, register ilmiah"],
        answer: 0,
        explanation: "Caption ini menggunakan register semi-formal yang persuasif dengan campuran bahasa Indonesia dan istilah bisnis populer. Targetnya adalah audiens umum yang tertarik dengan bisnis/marketing.",
      },
      {
        q: "Dalam sebuah email bisnis, frasa \"Please find attached the document\" lebih tepat digantikan dengan bahasa Indonesia baku...",
        options: ["\"Dokumen terlampir\"", "\"Tolong lihat dokumen yang saya lampirkan\"", "\"Ini dokumennya ya\"", "\"Berkat dokumen yang sudah saya kirim\""],
        answer: 1,
        explanation: "\"Tolong lihat dokumen yang saya lampirkan\" adalah terjemahan yang tepat dan sopan dari \"Please find attached the document\" dalam konteks email bisnis formal Indonesia.",
      },
      {
        q: "Sebuah portal berita online menggunakan headline: \"Viral! Bocah SD Temukan Cara Unik Belajar Matematika\" Penggunaan kata \"viral\" dalam headline menunjukkan...",
        options: ["Bahasa Indonesia sudah kehabisan kata untuk \"menyebar luas\"", "Adaptasi bahasa digital yang sudah diterima secara luas dalam jurnalisme online", "Kesalahan redaksi karena harus menggunakan bahasa baku", "Pengaruh bahasa Inggris yang merusak integritas berita"],
        answer: 1,
        explanation: "\"Viral\" sudah menjadi bagian dari kosakata digital Indonesia dan diterima dalam jurnalisme online. Kata ini memiliki makna spesifik (menyebar luas secara daring) yang sulit digantikan satu kata padanan.",
      },
    ],
  },
  {
    floor: 4,
    title: "Kesadaran Norma",
    desc: "Uji kesadaranmu tentang etika dan norma berbahasa Indonesia.",
    icon: "⚖️",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    questions: [
      {
        q: "Seorang pejabat publik berbicara di televisi nasional: \"Intinya kita harus gas pol aja buat recover ekonomi kita.\" Analisis norma berbahasanya adalah...",
        options: ["Sudah tepat karena bahasa harus mengikuti zaman", "Register tidak sesuai — pejabat publik di media nasional seharusnya menggunakan ragam formal", "Tidak masalah karena semua orang mengerti", "Perlu ditambah bahasa daerah agar lebih inklusif"],
        answer: 1,
        explanation: "Pejabat publik di media nasional berada dalam konteks formal-kenegaraan. Penggunaan register informal (\"gas pol\", \"recover\") menunjukkan ketidaksesuaian dengan norma situasi komunikasi resmi.",
      },
      {
        q: "Ketika seorang siswa menulis esai: \"Gue rasa topik ini interesting banget dan kita harus explore lebih jauh\", guru memberikan nilai rendah. Kritik guru tersebut...",
        options: ["Tepat karena esai akademik harus menggunakan bahasa Indonesia baku", "Kurang tepat karena bahasa gaul lebih ekspresif", "Tepat karena topiknya tidak relevan", "Kurang tepat karena siswa sudah menulis dengan benar"],
        answer: 0,
        explanation: "Esai akademik memiliki norma register formal-baku. Guru berhak memberikan nilai rendah karena siswa menggunakan campuran bahasa gaul-Inggris yang tidak sesuai dengan register akademik.",
      },
      {
        q: "Fenomena \"bahasa prokem\" (bahasa gaul jalanan Jakarta) yang menyebar ke seluruh Indonesia melalui media menunjukkan...",
        options: ["Dominasi budaya Jakarta yang merusak keberagaman bahasa daerah", "Proses naturalisasi kosakata daerah ke dalam bahasa nasional", "Bukti bahwa bahasa daerah sudah mati", "Pengaruh negatif teknologi terhadap bahasa"],
        answer: 1,
        explanation: "\"Bahasa prokem\" yang menyebar nasional menunjukkan proses naturalisasi kosakata daerah (Jakarta) ke dalam bahasa nasional. Ini bukan perusakan, melainkan dinamika alamiah bahasa.",
      },
      {
        q: "Dalam konteks UU No. 24 Tahun 2009 tentang Bendera, Bahasa, dan Lambang Negara, penggunaan bahasa Indonesia yang baik dan benar merupakan...",
        options: ["Hak pribadi setiap warga negara", "Kewajiban konstitusional dalam konteks kenegaraan", "Saran saja, tidak ada sanksi", "Pilihan opsional tergantung situasi"],
        answer: 1,
        explanation: "UU No. 24 Tahun 2009 menegaskan bahwa bahasa Indonesia adalah bahasa negara yang wajib digunakan dalam konteks kenegaraan. Ini bukan sekadar hak atau pilihan, melainkan kewajiban konstitusional.",
      },
      {
        q: "Seorang penulis novel menggunakan bahasa daerah dalam dialog karakter. Keputusan sastrawi ini...",
        options: ["Melanggar kaidah bahasa Indonesia dan harus dihapus", "Valid secara artistik untuk membangun autentisitas karakter dan setting", "Membuat novel sulit dipahami pembaca luar daerah", "Tidak sesuai dengan norma penulisan Indonesia"],
        answer: 1,
        explanation: "Penggunaan bahasa daerah dalam dialog sastra adalah teknik artistik yang valid untuk membangun autentisitas karakter dan setting. Ini bukan pelanggaran, melainkan pilihan sastrawi yang diakui.",
      },
    ],
  },
  {
    floor: 5,
    title: "Refleksi Kritis",
    desc: "Analisis dan evaluasi penggunaan bahasa dalam konteks nyata.",
    icon: "🔍",
    color: "#f43f5e",
    glow: "rgba(244,63,94,0.3)",
    questions: [
      {
        q: "Seorang akademisi menulis: \"The impact of globalization on local languages is significant.\" Tulisan ini dalam konteks jurnal Indonesia seharusnya...",
        options: ["Sudah benar karena istilah akademik sering bahasa Inggris", "Diterjemahkan ke bahasa Indonesia kecuali istilah teknis yang belum ada padanannya", "Dibiarkan campur karena pembaca akademik pasti bisa bahasa Inggris", "Dihapus dan diganti sepenuhnya dengan bahasa Indonesia"],
        answer: 1,
        explanation: "Dalam penulisan akademik Indonesia, kalimat sebaiknya diterjemahkan ke bahasa Indonesia. Istilah teknis spesifik boleh mempertahankan bahasa asing jika belum ada padanan, tapi struktur kalimat harus Indonesia.",
      },
      {
        q: "Dampak jangka panjang dari dominasi platform digital berbahasa Inggris terhadap kosakata bahasa Indonesia adalah...",
        options: ["Tidak ada dampak karena bahasa Indonesia sudah kuat", "Penurunan penggunaan kosakata Indonesia untuk konsep teknologi dan bisnis", "Pengayaan kosakata melalui serapan yang terstruktur", "Perubahan total struktur bahasa Indonesia"],
        answer: 1,
        explanation: "Dominasi platform digital Inggris berpotensi menurunkan penggunaan kosakata Indonesia untuk konsep teknologi/bisnis. Ini tantangan nyata yang membutuhkan kesadaran aktif untuk mengembangkan padanan.",
      },
      {
        q: "Seorang guru bahasa Indonesia memulai kelas dengan \"Okay guys, hari ini kita belajar tentang kalimat efektif.\" Sikap linguistik yang ditunjukkan adalah...",
        options: ["Fleksibilitas berbahasa yang baik dalam konteks pendidikan modern", "Modeling campuran bahasa yang bisa melemahkan norma baku di kelas", "Tidak ada masalah karena semua siswa mengerti", "Strategi pengajaran yang kreatif dan inovatif"],
        answer: 1,
        explanation: "Meskipun fleksibel, guru bahasa Indonesia seharusnya menjadi model penggunaan bahasa Indonesia yang baik. Mengawali kelas dengan campuran bahasa bisa melemahkan ekspektasi norma baku di kelas.",
      },
      {
        q: "Konsep \"language loyalty\" (loyalitas berbahasa) dalam konteks Indonesia merujuk pada...",
        options: ["Kebiasaan menggunakan bahasa daerah saja", "Komitmen sadar untuk menggunakan bahasa Indonesia sesuai konteks dan menjaga kualitasnya", "Penolakan terhadap semua bahasa asing", "Kebanggaan berlebihan terhadap bahasa Indonesia"],
        answer: 1,
        explanation: "Loyalitas berbahasa adalah komitmen sadar untuk menggunakan bahasa Indonesia dengan baik sesuai konteks, menjaga kualitas, dan mengembangkannya. Ini bukan penolakan bahasa asing atau fanatisme buta.",
      },
      {
        q: "Sebuah penelitian menunjukkan bahwa remaja Indonesia menggunakan rata-rata 3-4 code-switching per menit saat berbicara. Implikasi terhadap kesadaran berbahasa adalah...",
        options: ["Remaja sudah tidak bisa bahasa Indonesia dengan baik", "Perlu edukasi tentang kapan code-switching tepat dan tidak tepat digunakan", "Code-switching adalah tanda kecerdasan linguistik", "Tidak perlu dikhawatirkan karena itu normal"],
        answer: 1,
        explanation: "Frekuensi code-switching yang tinggi menunjukkan perlunya edukasi tentang kesadaran situasional — kapan code-switching efektif dan kapan justru mengurangi efektivitas komunikasi.",
      },
    ],
  },
  {
    floor: 6,
    title: "Loyalitas Berbahasa",
    desc: "Buktikan komitmenmu terhadap penggunaan bahasa Indonesia yang berkualitas.",
    icon: "🏆",
    color: "#f59e0b",
    glow: "rgba(251,191,36,0.4)",
    questions: [
      {
        q: "Seorang influencer dengan 1 juta followers menulis caption campur bahasa Indonesia-Inggris secara konsisten. Dampak linguistik jangka panjangnya...",
        options: ["Tidak berpengaruh karena hanya caption media sosial", "Mempengaruhi pola bahasa pengikutnya melalui efek model bahasa", "Justru memperkaya bahasa Indonesia", "Hanya berpengaruh pada followers luar negeri"],
        answer: 1,
        explanation: "Influencer berfungsi sebagai bahasa model bagi pengikutnya. Pola code-switching konsisten di platform massal berpotensi mempengaruhi norma berbahasa audiens, terutama remaja.",
      },
      {
        q: "Dalam konteks Kurikulum Merdeka, kompetensi \"kesadaran berbahasa\" mencakup kemampuan untuk...",
        options: ["Menulis tanpa kesalahan ejaan saja", "Menganalisis, memilih, dan menggunakan ragam bahasa yang tepat sesuai situasi dan tujuan komunikasi", "Menguasai bahasa Inggris dengan baik", "Menggunakan bahasa baku dalam semua situasi"],
        answer: 1,
        explanation: "Kesadaran berbahasa dalam Kurikulum Merdeka mencakup kemampuan analisis, pemilihan ragam, dan penggunaan bahasa yang kontekstual — bukan sekadar benar ejaan atau selalu formal.",
      },
      {
        q: "Seorang penutur bilingual (Indonesia-Sunda) menggunakan bahasa Indonesia yang terpengaruh kosakata Sunda saat berbicara dengan teman sehari-hari. Fenomena ini...",
        options: ["Menunjukkan ketidakmampuan berbahasa Indonesia", "Adalah substrat linguistik wajar dalam komunikasi dwibahasa sehari-hari", "Harus dikoreksi agar tidak menyebar", "Bukti bahwa bahasa Sunda lebih kuat dari Indonesia"],
        answer: 1,
        explanation: "Substrat bahasa daerah dalam bahasa Indonesia sehari-hari adalah fenomena linguistik wajar. Ini bukan ketidakmampuan, melainkan interaksi alami dua sistem bahasa dalam diri penutur dwibahasa.",
      },
      {
        q: "Sebuah kamus besar bahasa Indonesia edisi terbaru memasukkan kata \"google\" (verba). Keputusan ini...",
        options: ["Merusak integritas bahasa Indonesia", "Mencerminkan dinamika bahasa dalam menyerap teknologi baru", "Harus ditolak karena bukan bahasa Indonesia", "Tepat karena semua orang sudah menggunakannya"],
        answer: 1,
        explanation: "Pemasukan kata serapan teknologi ke dalam kamus mencerminkan dinamika bahasa yang adaptif. KBBI memang menyerap kata baru yang sudah mapan penggunaannya, termasuk dari teknologi.",
      },
      {
        q: "Tantangan terbesar menjaga loyalitas bahasa Indonesia di era digital adalah...",
        options: ["Bahasa daerah yang semakin kuat", "Kurangnya kesadaran untuk menggunakan bahasa Indonesia yang baik dan kontekstual di platform digital", "Bahasa Inggris yang sudah menaklukkan dunia", "Tidak ada tantangan karena bahasa Indonesia sudah kuat"],
        answer: 1,
        explanation: "Tantangan terbesar adalah kurangnya kesadaran kontekstual — banyak penutur tidak mempertimbangkan kapan harus menggunakan bahasa Indonesia baku versus campuran di platform digital.",
      },
    ],
  },
];

type FloorState = "locked" | "active" | "completed";
type AnswerState = "unanswered" | "correct" | "wrong";

export default function ChallengeTowerPage() {
  const [currentFloor, setCurrentFloor] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [floorScores, setFloorScores] = useState<number[]>(new Array(FLOORS.length).fill(0));
  const [floorStates, setFloorStates] = useState<FloorState[]>(() => {
    const s: FloorState[] = ["active"];
    for (let i = 1; i < FLOORS.length; i++) s.push("locked");
    return s;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [gameComplete, setGameComplete] = useState(false);

  const floor = FLOORS[currentFloor];
  const question = floor?.questions[currentQ];
  const totalQuestions = FLOORS.reduce((a, f) => a + f.questions.length, 0);
  const totalAnswered = FLOORS.slice(0, currentFloor).reduce((a, f) => a + f.questions.length, 0) + currentQ;

  const handleAnswer = useCallback(
    (idx: number) => {
      if (selected !== null) return;
      setSelected(idx);
      const correct = idx === question.answer;
      setAnswerState(correct ? "correct" : "wrong");
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        if (currentQ < floor.questions.length - 1) {
          setCurrentQ((q) => q + 1);
          setSelected(null);
          setAnswerState("unanswered");
        } else {
          const fScore = floor.questions.filter((_, i) => {
            const wasCorrect = i === currentQ ? correct : selected === floor.questions[i].answer;
            return wasCorrect;
          }).length;
          setFloorScores((prev) => {
            const next = [...prev];
            next[currentFloor] = fScore;
            return next;
          });
          setFloorStates((prev) => {
            const next = [...prev];
            next[currentFloor] = "completed";
            if (currentFloor + 1 < FLOORS.length) next[currentFloor + 1] = "active";
            return next;
          });
          if (currentFloor + 1 < FLOORS.length) {
            setCurrentFloor((f) => f + 1);
            setCurrentQ(0);
            setSelected(null);
            setAnswerState("unanswered");
          } else {
            setGameComplete(true);
          }
        }
      }, 1500);
    },
    [selected, question, currentQ, floor, currentFloor]
  );

  const totalScore = floorScores.reduce((a, b) => a + b, 0);
  const maxScore = totalQuestions;

  useLogGameResult(
    "challenge-tower",
    "mini_game",
    gameComplete,
    {
      score: totalScore,
      accuracy: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0,
      correct: totalScore,
      total: maxScore,
      detail: { floorScores },
    },
  );

  if (gameComplete) {
    return (
      <div style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem", textAlign: "center", animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div style={{ fontSize: "4rem" }}>🏆</div>
          <h1 style={{ fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif", fontSize: "clamp(1.8rem, 6vw, 2.5rem)", fontWeight: 900, color: "white", margin: "16px 0 0", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Tower Selesai!</h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", margin: "8px 0 0" }}>
            Skor: <span style={{ color: "#fbbf24", fontSize: "1.2rem" }}>{totalScore}</span> / {maxScore}
          </p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {totalScore === maxScore ? "PERFECT! Kamu benar-benar paham bahasa!" : totalScore >= maxScore * 0.8 ? "Luar biasa! Kesadaran bahasamu tinggi!" : totalScore >= maxScore * 0.5 ? "Bagus! Masih bisa lebih baik lagi." : "Terus belajar ya! Bahasa itu butuh latihan."}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "24px" }}>
            <button onClick={() => window.location.reload()} style={{
              padding: "12px 24px", borderRadius: "14px", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
              color: "white", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #f59e0b, #f97316)", boxShadow: "0 4px 0 #b45309, 0 6px 16px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>🔄 Main Lagi</button>
            <Link href="/world" style={{
              padding: "12px 24px", borderRadius: "14px", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", fontWeight: 800,
              color: "rgba(255,255,255,0.6)", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)",
            }}>Kembali ke City</Link>
          </div>
        </div>
        <style>{`@keyframes scaleIn { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "1.5rem", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/world" style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#c084fc", textDecoration: "none" }}>← PRIMA CITY</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Skor: <span style={{ color: "#fbbf24" }}>{score}</span></span>
            <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{totalAnswered}/{totalQuestions}</span>
          </div>
        </div>

        {/* Floor progress bars */}
        <div style={{ display: "flex", gap: "4px", marginTop: "16px" }}>
          {FLOORS.map((f, i) => {
            const state = floorStates[i];
            const isActive = i === currentFloor;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{
                  width: "100%", height: "6px", borderRadius: "3px", overflow: "hidden",
                  background: state === "completed" ? "transparent" : isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                }}>
                  {state === "completed" && <div style={{ width: "100%", height: "100%", background: f.color, borderRadius: "3px" }} />}
                  {isActive && <div style={{ width: `${((currentQ + 1) / f.questions.length) * 100}%`, height: "100%", background: f.color, borderRadius: "3px", transition: "width 0.4s ease-out" }} />}
                </div>
                <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.55rem", fontWeight: 800, color: isActive ? "white" : state === "completed" ? f.color : "rgba(255,255,255,0.3)" }}>{f.floor}</span>
              </div>
            );
          })}
        </div>

        {/* Current floor info */}
        <div key={currentFloor} style={{ textAlign: "center", marginTop: "24px", animation: "slideUp 0.4s ease-out both" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px", margin: "0 auto",
            background: `linear-gradient(135deg, ${floor.color}20, ${floor.color}10)`,
            border: `1px solid ${floor.color}30`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
            boxShadow: `0 8px 32px ${floor.glow}`,
          }}>{floor.icon}</div>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", marginTop: "12px", textTransform: "uppercase" }}>Lantai {floor.floor}</p>
          <h2 style={{ fontFamily: "'Righteous', 'Arial Black', Impact, sans-serif", fontSize: "1.4rem", fontWeight: 900, color: "white", margin: "4px 0 0" }}>{floor.title}</h2>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>{floor.desc}</p>
        </div>

        {/* Question card */}
        <div key={`${currentFloor}-${currentQ}`} style={{
          marginTop: "24px", padding: "20px", borderRadius: "20px",
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          animation: "slideUp 0.4s ease-out both",
        }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", margin: 0 }}>Pertanyaan {currentQ + 1} / {floor.questions.length}</p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "clamp(0.85rem, 2.5vw, 1rem)", fontWeight: 700, color: "rgba(255,255,255,0.9)", margin: "12px 0 0", lineHeight: 1.7 }}>{question.q}</p>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.answer;
              let border = "1px solid rgba(255,255,255,0.08)";
              let bg = "rgba(255,255,255,0.03)";
              let textColor = "rgba(255,255,255,0.75)";

              if (answerState !== "unanswered") {
                if (isCorrect) { border = "2px solid #10b981"; bg = "rgba(16,185,129,0.12)"; textColor = "#34d399"; }
                else if (isSelected && !isCorrect) { border = "2px solid #f43f5e"; bg = "rgba(244,63,94,0.12)"; textColor = "#fb7185"; }
              }

              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    padding: "14px 16px", borderRadius: "14px", border, background: bg,
                    cursor: selected !== null ? "not-allowed" : "pointer", textAlign: "left",
                    transition: "all 0.2s", opacity: answerState !== "unanswered" && !isCorrect && !isSelected ? 0.5 : 1,
                  }}
                >
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                    background: answerState !== "unanswered" && isCorrect ? "rgba(16,185,129,0.2)" : answerState !== "unanswered" && isSelected && !isCorrect ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 900, color: textColor,
                  }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.8rem", fontWeight: 600, color: textColor, lineHeight: 1.6 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {answerState !== "unanswered" && (
            <div style={{
              marginTop: "14px", padding: "14px", borderRadius: "14px",
              background: answerState === "correct" ? "rgba(16,185,129,0.08)" : "rgba(244,63,94,0.08)",
              border: `1px solid ${answerState === "correct" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)"}`,
              animation: "fadeIn 0.3s ease-out both",
            }}>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.65rem", fontWeight: 800, color: answerState === "correct" ? "#34d399" : "#fb7185", margin: 0, letterSpacing: "0.05em" }}>
                {answerState === "correct" ? "✅ BENAR!" : "❌ SALAH"}
              </p>
              <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", margin: "6px 0 0", lineHeight: 1.6 }}>
                {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Floor badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "20px" }}>
          {FLOORS.map((f, i) => (
            <div key={i} style={{
              width: "32px", height: "32px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Righteous', sans-serif", fontSize: "0.7rem", fontWeight: 900,
              background: floorStates[i] === "completed" ? f.color : i === currentFloor ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              color: floorStates[i] === "completed" ? "white" : i === currentFloor ? "white" : "rgba(255,255,255,0.3)",
              boxShadow: floorStates[i] === "completed" ? `0 3px 12px ${f.glow}` : "none",
              border: i === currentFloor ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.04)",
            }}>{floorStates[i] === "completed" ? "✓" : f.floor}</div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
