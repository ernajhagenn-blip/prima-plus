"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Msg { from: string; side: "l" | "r"; text: string; }
interface Choice { text: string; fb: string; tone: "good" | "mid" | "bad"; }
interface Scenario {
  id: string;
  place: string;
  title: string;
  msgs: Msg[];
  ask: string;
  choices: Choice[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "grup",
    place: "Grup WhatsApp Kelas · 23:40",
    title: "Pesan untuk Dua Pendengar",
    msgs: [
      { from: "Bu Guru", side: "l", text: "Selamat malam anak-anak, besok jangan lupa bawa surat izin study tour ya." },
      { from: "Bu Guru", side: "l", text: "Ibu juga ada di grup ini kalau ada yang mau ditanyakan." },
      { from: "Raka", side: "l", text: "siap bu 🙏" },
      { from: "Kamu", side: "r", text: "(Ada ide untuk rapat OSIS besok. Mau menyampaikan di grup ini...)" },
    ],
    ask: "Bagaimana kamu menyampaikan ide rapat di grup yang isinya teman sekelas DAN wali kelas?",
    choices: [
      {
        text: "Bu, izin menambahkan agenda. Besok setelah jam pelajaran terakhir, kami ingin mengusulkan jadwal rapat OSIS. Mohon arahan dan izinnya 🙏",
        tone: "good",
        fb: "Pilihan ini membaca situasi dengan tepat. Di grup yang sama ada dua jenis pembaca: teman yang biasa membalas santai, dan wali kelas yang mengenalmu sebagai murid. Pesanmu tetap ramah dan hangat, tetapi pilihan katamu menghormati kedudukan Bu Guru. Ini bukan soal kaku atau tidak — ini soal sadar siapa yang akan membaca.",
      },
      {
        text: "guys besok rapat yuk, jam 3 di ruang osis. yang mana aja dateng ya",
        tone: "mid",
        fb: "Pesan ini wajar kalau hanya teman yang membaca — santai, jelas, keakraban terjaga. Tetapi Bu Guru tadi bilang beliau ikut membaca grup ini. Pesan yang sama bisa terdengar berbeda tergantung siapa yang membacanya, dan kamu sudah tahu informasi itu sejak tadi malam.",
      },
      {
        text: "woi semua, besok wajib dateng rapat osis. no alasan, later nyesel",
        tone: "bad",
        fb: "Di sini ada dua hal sekaligus: nadanya memerintah ke teman sendiri, dan ada penyisipan 'later' yang tidak menambah makna apa pun — 'nanti' lebih singkat. Kalau tujuanmu ditaati dan dihormati, nada seperti ini justru membuat teman menjauh. Coba bandingkan dengan pilihan pertama: isi sama, rasa beda jauh.",
      },
    ],
  },
  {
    id: "caption",
    place: "Instagram · Unggahan Kegiatan Sekolah",
    title: "Caption untuk Publik",
    msgs: [
      { from: "Kamu", side: "r", text: "(Baru pulang dari kegiatan bakti sosial di panti asuhan. Fotonya bagus-bagus, mau diunggah...)" },
      { from: "Kamu", side: "r", text: "(Pengikutmu: teman-teman sekolah, adik kelas, beberapa guru, dan akun sekolah yang suka membagikan ulang.)" },
    ],
    ask: "Caption seperti apa yang paling mewakili kegiatanmu sekaligus pantas dibaca siapa pun?",
    choices: [
      {
        text: "Hari ini kami berbagi waktu di Panti Asuhan Harapan. Terima kasih sudah menyambut kami dengan hangat — cerita mereka lebih berharga daripada fotonya.",
        tone: "good",
        fb: "Caption ini tetap terasa personal, tetapi setiap pembaca — termasuk akun sekolah dan para guru — bisa membagikan ulangnya dengan bangga. Kamu tidak kehilangan gaya; kamu hanya memilih kata yang bisa dibaca siapa pun tanpa kehilangan makna. Itu kekuatan, bukan kekakuan.",
      },
      {
        text: "blessed banget hari ini, giving back ke panti 🙏 #blessed #givingback #socialproject",
        tone: "mid",
        fb: "Tidak ada yang salah dengan kata asing — 'blessed' memang terasa jujur untuk perasaanmu. Tapi coba perhatikan: pembaca yang tidak biasa bahasa Inggris kehilangan separuh pesanmu. Dan untuk kegiatan sekolah yang mungkin dibagikan ulang akun resmi, caption ini mengunci jangkauanmu pada satu kelompok pembaca saja.",
      },
      {
        text: "Hari ini giving back ke panti asuhan, blessed banget, semoga inspiring buat kalian semua ya guyss!",
        tone: "mid",
        fb: "Menarik — pilihan ini mencampur dua ragam dalam satu napas. Hasilnya terasa hangat dan khas generasimu, tetapi 'inspiring' di posisi itu punya padanan yang justru lebih kuat: 'menginspirasi'. Kadang kata asing dipilih bukan karena lebih baik, tapi karena kebiasaan. Coba baca ulang dua kalimat itu pelan-pelan — mana yang benar-benar kamu rasakan?",
      },
    ],
  },
  {
    id: "presentasi",
    place: "Kelas · Jam Pelajaran Ke-7",
    title: "Tiga Puluh Detik Persiapan",
    msgs: [
      { from: "Bu Guru", side: "l", text: "Kelompok Raka, hasil pengamatan kelompokmu menarik. Raka, coba jelaskan di depan sekarang." },
      { from: "Bu Guru", side: "l", text: "Oh ya, Kepala Sekolah sedang berkunjung. Silakan, Raka." },
      { from: "Kamu", side: "r", text: "(Tiga puluh detik lagi giliranmu bicara. Biasanya kamu menjelaskan ke teman pakai bahasa santai...)" },
    ],
    ask: "Bagaimana kamu membuka penjelasan tiga puluh detik ini?",
    choices: [
      {
        text: "Terima kasih, Bu. Berdasarkan pengamatan kami selama tiga hari, tanaman di dekat jendela tumbuh lebih cepat. Dugaan kami, cahaya memengaruhi pertumbuhannya.",
        tone: "good",
        fb: "Perhatikan: isimu sama persis dengan cara kamu cerita ke teman, tetapi pilihan katamu menyesuaikan tempat dan hadirnya Kepala Sekolah. Kemampuan beralih ragam seperti ini adalah tanda kesadaran berbahasa yang sudah otomatis — dan justru situasi mendadak seperti inilah yang mengujinya.",
      },
      {
        text: "Jadi gini Bu, hasilnya basically tanaman yang deket jendela lebih cepat gede. Terus kami nyangkinya si cahaya sih.",
        tone: "mid",
        fb: "Isimu benar dan alur berpikirmu jelas — itu yang paling penting. Tetapi coba dengar ulang: 'basically' dan 'gede' tidak menambah makna, hanya membawa suasana obrolan ke ruang yang sedang formal. Kepala Sekolah mungkin tetap paham, tapi kesan pertama tentang ketelitianmu ikut terbentuk dari kata yang kamu pilih.",
      },
      {
        text: "Anu... jadi hasilnya, how to say ya, tanaman deket jendela lebih cepat. Ya gitu deh, paham kan?",
        tone: "bad",
        fb: "Ketika gugup, penyisipan 'how to say' dan 'anu' jadi tempat berlindung. Wajar — semua orang pernah di situ. Tetapi perhatikan polanya: justru saat saraf, kebiasaan mengambil alih. Kebiasaan beralih ke ragam formal perlu dilatih justru di kondisi santai, supaya otomatis saat dibutuhkan.",
      },
    ],
  },
  {
    id: "adik",
    place: "Kantin · Istirahat",
    title: "Adik Kelas yang Rendah Diri",
    msgs: [
      { from: "Adik Kelas", side: "l", text: "Kak, aku ngerasa aneh kalau nulis caption pakai bahasa Indonesia beneran." },
      { from: "Adik Kelas", side: "l", text: "Kayak... kampungan gitu. Temen-temenku semua pakai bahasa Inggris, keren-keren." },
      { from: "Kamu", side: "r", text: "(Kamu ingat pernah membaca penelitian: kebiasaan campur kode di media sosial memang paling sering berupa penyisipan kata. Tapi ini bukan soal data — ini soal rasa percaya diri adikmu.)" },
    ],
    ask: "Bagaimana kamu merespons tanpa menggurui?",
    choices: [
      {
        text: "Boleh banget pakai bahasa Inggris kok. Tapi coba deh sesekali tulis sesuatu yang benar-benar kamu rasakan dalam bahasa Indonesia — lalu bandingkan mana yang terasa lebih 'kamu'.",
        tone: "good",
        fb: "Kamu tidak melarang, tidak menakut-nakuti, dan tidak menggurui. Kamu mengajaknya bereksperimen dengan bahasanya sendiri. Kebanggaan berbahasa tidak tumbuh dari nasihat — dia tumbuh dari pengalaman merasakan bahwa bahasa sendiri mampu terdengar keren, dalam, dan personal.",
      },
      {
        text: "Ya terserah sih, yang penting kamu nyaman. Namanya juga gaya masing-masing.",
        tone: "mid",
        fb: "Menghormati pilihan orang lain itu bagus. Tapi adikmu sedang bilang dia TIDAK nyaman — dia merasa bahasanya sendiri 'kampungan'. Di titik ini, diam sama saja membiarkan dia tumbuh dengan keyakinan itu. Kadang 'terserah' terdengar seperti 'tidak penting buatku'.",
      },
      {
        text: "Iya sih, bahasa Indonesia memang kurang keren buat caption. Mending ikutin tren aja biar nggak dibilang aneh.",
        tone: "bad",
        fb: "Coba dengar pesan yang tanpa sengaja kamu kirim: bahasa yang kamu pakai setiap hari — bahasa yang mempersatukan ratusan juta orang — kamu sebut kurang keren di depan adik yang sedang mencari teladan. Padahal kamu sendiri tahu: yang menentukan keren atau tidak adalah idenya, bukan asal kata-katanya.",
      },
    ],
  },
];

const REFLECTIONS = [
  { q: "Pernah nggak kamu menyisipkan kata asing tanpa sadar? Kata apa, dan kapan biasanya itu terjadi?", ph: "Contoh: 'biasanya pas ngetik cepat di chat...'" },
  { q: "Kenapa menurutmu kata itu terasa lebih nyaman dipakai dibanding padanan Indonesia?", ph: "Tulis jujur, tidak ada yang menilai jawaban ini" },
  { q: "Kalau lawan bicaramu berubah dari teman ke guru, apa yang berubah dari pilihan bahasamu? Kenapa?", ph: "Ceritakan kebiasaanmu sendiri..." },
];

export default function ChatPage() {
  const [stage, setStage] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const router = useRouter();

  const s = SCENARIOS[stage];
  const allChatDone = stage >= SCENARIOS.length;
  const allReflected = answers.every((a) => a.trim().length > 2);

  const pick = (i: number) => { if (chosen === null) setChosen(i); };

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "radial-gradient(ellipse at 50% -10%, #22104a 0%, #0b0d22 55%)", padding: "clamp(14px,3vmin,40px) clamp(12px,3vmin,32px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {!allChatDone ? (
        <div style={{ width: "100%", maxWidth: 660, display: "flex", flexDirection: "column", minHeight: "80vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10 }}>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "#ec4899", margin: 0 }}>
              BAGIAN {stage + 1}/{SCENARIOS.length}
            </p>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {s.place}
            </p>
          </div>

          <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(19px,3.4vmin,27px)", color: "white", margin: "0 0 18px", textShadow: "0 2px 12px rgba(236,72,153,0.4)" }}>
            {s.title}
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 20 }}>
            {s.msgs.map((m, i) => {
              const left = m.side === "l";
              return (
                <div key={i} style={{ alignSelf: left ? "flex-start" : "flex-end", maxWidth: left ? "86%" : "80%", display: "flex", flexDirection: left ? "row" : "row-reverse", gap: 8, alignItems: "flex-end", animation: `bubbleIn 0.4s ${i * 0.12}s ease both` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: left ? "linear-gradient(135deg,#64748b,#94a3b8)" : "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Righteous',sans-serif", fontSize: 12, color: "white", fontWeight: 700 }}>
                    {left ? m.from.slice(0, 2).toUpperCase() : "AKU"}
                  </div>
                  <div style={{ background: left ? "rgba(255,255,255,0.09)" : "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(236,72,153,0.3))", borderRadius: left ? "4px 18px 18px 18px" : "18px 4px 18px 18px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.13)" }}>
                    <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 9.5, color: "rgba(255,255,255,0.42)", margin: "0 0 3px" }}>{left ? m.from : ""}</p>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.93)", margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "rgba(250,204,21,0.08)", borderRadius: 16, padding: "13px 17px", border: "1px solid rgba(250,204,21,0.35)", marginBottom: 14, animation: "bubbleIn 0.4s 0.5s ease both" }}>
            <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, color: "#facc15", letterSpacing: "0.12em", margin: "0 0 5px" }}>KEPUTUSAN</p>
            <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "white", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>{s.ask}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: "auto" }}>
            {s.choices.map((c, i) => {
              const isSel = chosen === i;
              const showFb = chosen !== null;
              const border = showFb && isSel ? (c.tone === "good" ? "#4ade80" : c.tone === "mid" ? "#facc15" : "#f87171") : "rgba(255,255,255,0.14)";
              const bg = showFb && isSel
                ? c.tone === "good" ? "rgba(74,222,128,0.1)" : c.tone === "mid" ? "rgba(250,204,21,0.08)" : "rgba(248,113,113,0.08)"
                : "rgba(255,255,255,0.05)";
              return (
                <div key={i} style={{ animation: `bubbleIn 0.35s ${0.55 + i * 0.08}s ease both` }}>
                  <button
                    onClick={() => pick(i)}
                    disabled={chosen !== null}
                    style={{ width: "100%", textAlign: "left", padding: "12px 15px", borderRadius: 14, background: bg, border: `1.5px solid ${border}`, color: "rgba(255,255,255,0.92)", fontFamily: "Arial,sans-serif", fontSize: 14, lineHeight: 1.5, cursor: chosen === null ? "pointer" : "default", transition: "all 0.2s" }}
                  >
                    {c.text}
                  </button>
                  {showFb && isSel && (
                    <div style={{ marginTop: 8, padding: "13px 16px", borderRadius: 14, background: "rgba(124,58,237,0.12)", border: "1px solid rgba(168,85,247,0.4)", animation: "bubbleIn 0.3s ease both" }}>
                      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 6px" }}>MENGAPA BEGITU</p>
                      <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.65 }}>{c.fb}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {chosen !== null && (
            <button
              onClick={() => { setChosen(null); setStage(stage + 1); }}
              style={{ marginTop: 14, padding: "14px 0", borderRadius: 14, background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "none", color: "white", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 15, fontWeight: 900, cursor: "pointer", animation: "bubbleIn 0.3s ease both" }}
            >
              {stage === SCENARIOS.length - 1 ? "Refleksi Diri →" : "Percakapan Berikutnya →"}
            </button>
          )}
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 620, display: "flex", flexDirection: "column", minHeight: "80vh" }}>
          <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 12, letterSpacing: "0.22em", color: "#4ade80", margin: "0 0 8px", textAlign: "center" }}>
            REFLEKSI
          </p>
          <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(20px,3.6vmin,28px)", color: "white", margin: "0 0 8px", textAlign: "center" }}>
            Sekarang giliranmu
          </h1>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.55)", margin: "0 0 22px", textAlign: "center", lineHeight: 1.55 }}>
            Tidak ada jawaban benar atau salah di bagian ini. Yang ada hanya kebiasaanmu sendiri — dan kesempatan untuk melihatnya lebih dekat.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 22 }}>
            {REFLECTIONS.map((r, i) => (
              <div key={i} style={{ background: "rgba(74,222,128,0.06)", borderRadius: 16, padding: "15px 18px", border: "1px solid rgba(74,222,128,0.3)" }}>
                <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 13.5, color: "#86efac", margin: "0 0 9px", lineHeight: 1.5 }}>{r.q}</p>
                <textarea
                  value={answers[i]}
                  onChange={(e) => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }}
                  placeholder={r.ph}
                  rows={2}
                  style={{ width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 13px", color: "white", fontFamily: "Arial,sans-serif", fontSize: 13.5, resize: "vertical", lineHeight: 1.5, outline: "none" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/world")}
            disabled={!allReflected}
            style={{ marginTop: "auto", padding: "15px 0", borderRadius: 14, background: allReflected ? "linear-gradient(135deg,#16a34a,#4ade80)" : "rgba(255,255,255,0.08)", border: "none", color: allReflected ? "white" : "rgba(255,255,255,0.4)", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 16, fontWeight: 900, cursor: allReflected ? "pointer" : "default", transition: "all 0.3s" }}
          >
            {allReflected ? "Buka PRIMA WORLD 🌍" : "Tulis dulu refleksimu untuk melanjutkan"}
          </button>
        </div>
      )}

      <style>{`
        @keyframes bubbleIn { 0% { opacity: 0; transform: translateY(12px) scale(0.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </main>
  );
}
