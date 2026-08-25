"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Msg { from: string; side: "l" | "r"; text: string; }
interface Choice { text: string; fb: string; tone: "good" | "mid" | "bad"; }
interface Scenario {
  id: string;
  place: string;
  title: string;
  domain: string;
  msgs: Msg[];
  ask: string;
  choices: Choice[];
  reflect: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "grup",
    place: "Grup WhatsApp Kelas · 23:40",
    title: "Pesan untuk Dua Jenis Pembaca",
    domain: "CONTEXT AWARENESS",
    msgs: [
      { from: "Bu Guru", side: "l", text: "Selamat malam anak-anak, besok jangan lupa bawa surat izin study tour ya." },
      { from: "Bu Guru", side: "l", text: "Ibu juga ikut di grup ini, kalau ada yang mau ditanyakan silakan." },
      { from: "Raka", side: "l", text: "siap bu 🙏" },
      { from: "Kamu", side: "r", text: "(Kamu punya usulan jadwal rapat OSIS. Grup ini isinya teman sekelas — tapi Bu Guru baru saja ikut membaca. Momen ini menentukan...)" },
    ],
    ask: "Tiga cara ini sama-sama ' sopan'. Tapi mana yang paling tepat untuk grup yang pembacanya campur?",
    reflect: "Kalau pesan yang sama kamu kirim ke grup sahabatmu saja, tanpa guru, apakah pilihanmu masih sama? Kenapa?",
    choices: [
      {
        text: "Bu, izin menambahkan agenda ya. Besok setelah jam terakhir kami ingin mengusulkan jadwal rapat OSIS. Mohon arahan dan izinnya 🙏",
        fb: "Pilihan ini membaca situasi dengan tepat — dan bukan karena 'paling formal'. Perhatikan: nadanya tetap hangat khas grup teman (ada emoji, ada kata 'kami'), tetapi kalimat pembukanya 'Bu, izin...' menunjukkan kamu sadar ada pembaca baru yang berbeda kedudukannya. Kesadaran konteks justru terlihat dari kemampuan MENYEIMBANGKAN dua audiens dalam satu pesan, bukan memilih salah satunya.",
        tone: "good",
      },
      {
        text: "guys besok rapat osis jam 3 di ruang osis ya. yang lewat aja dulu bacanya, ntar aku konfirm ulang",
        fb: "Menarik — kamu bahkan sudah sadar ada masalah ('yang lewat aja dulu bacanya') tapi solusinya menunda, bukan menyesuaikan. Pesan ini tidak kasar dan wajar antara teman. Tetapi coba pikirkan: Bu Guru tetap sudah membacanya sebelum kamu konfirmasi ulang. Kesan pertama tidak bisa 'dikonfirmasi ulang'. Kalau sadar pembacanya campur sejak awal, kenapa tidak langsung menyesuaikan?",
        tone: "mid",
      },
      {
        text: "Assalamualaikum warahmatullahi wabarakatuh. Dengan ini kami menginformasikan bahwa akan dilaksanakan rapat evaluasi OSIS pada hari besok pukul 15.00 WIB di ruang OSIS. Demikian informasi ini kami sampaikan. Atas perhatian Bapak/Ibu dan rekan-rekan, kami ucapkan terima kasih.",
        fb: "Ini jebakan yang paling halus: terdengar sangat sopan, tapi justru kurang sadar konteks. Grup ini bukan wadah resmi sekolah — ini grup teman yang biasa saling kirim 'wkwk' dan 'otw'. Bahasa resmi penuh di ruang akrab justru menciptakan jarak: teman bisa merasa canggung membalas, dan pesanmu berhenti terasa sebagai ajakan. Kesadaran berbahasa bukan 'selalu formal saat ada guru', melainkan 'menemukan nada yang tepat untuk campuran audiens ini'.",
        tone: "mid",
      },
    ],
  },
  {
    id: "caption",
    place: "Instagram · Unggahan Kegiatan Sekolah",
    title: "Caption untuk Publik",
    domain: "CODE-MIXING AWARENESS",
    msgs: [
      { from: "Kamu", side: "r", text: "(Baru pulang dari bakti sosial di panti asuhan. Fotonya bagus-bagus, mau diunggah...)" },
      { from: "Kamu", side: "r", text: "(Pengikutmu: teman sekolah, adik kelas, beberapa guru, dan akun sekolah yang suka membagikan ulang.)" },
    ],
    ask: "Semua caption ini 'kamu banget'. Mana yang paling pantas untuk audiens campur seperti ini?",
    reflect: "Apakah kamu memilih kata itu karena memang dibutuhkan — atau karena terdengar lebih keren?",
    choices: [
      {
        text: "Hari ini kami berbagi waktu di Panti Asuhan Harapan. Terima kasih sudah menyambut kami dengan hangat — cerita mereka lebih berharga daripada fotonya.",
        fb: "Caption ini tetap terdengar seperti kamu — tidak kaku, tidak seperti pengumuman sekolah. Bedanya, setiap pembaca (termasuk akun sekolah yang mungkin membagikan ulang) menangkap pesanmu utuh. Dan coba perhatikan kalimat terakhirnya: itu yang membuat orang berhenti scroll. Gaya personal dan jangkauan luas ternyata tidak harus saling mengalahkan.",
        tone: "good",
      },
      {
        text: "blessed banget hari ini, giving back ke panti 🙏 #blessed #givingback",
        fb: "Tidak ada yang salah dengan kata asing — 'blessed' memang terasa jujur untuk perasaanmu, dan di kalangan tertentu caption ini sangat wajar. Tapi coba hitung: berapa dari pengikutmu yang menangkap makna penuhnya? Adik kelas? Guru? Akun sekolah? Caption seperti ini bekerja bagus di circle yang sama bahasa — untuk audiens campur, sebagian pesanmu berhenti di orang-orang yang tidak ikut memakai kata itu.",
        tone: "mid",
      },
      {
        text: "Hari ini giving back ke panti asuhan, blessed banget, semoga menginspirasi kalian semua ya!",
        fb: "Ini contoh nyata gaya yang sedang populer: Indonesia sebagai rangka, Inggris sebagai bumbu. Dan jujur, tidak ada yang rusak di sini — pesannya sampai. Tapi coba uji satu hal: kata 'menginspirasi' di posisi itu justru terdengar lebih kuat daripada 'inspiring', karena kalimatnya memang berbahasa Indonesia. Kadang yang menentukan bukan asal kata, tapi kata mana yang paling kuat di posisinya. Itu pertanyaan yang layak diajukan ke setiap caption sebelum diunggah.",
        tone: "mid",
      },
    ],
  },
  {
    id: "presentasi",
    place: "Kelas · Jam Pelajaran Ke-7",
    title: "Tiga Puluh Detik Persiapan",
    domain: "NORM VS CONTEXT",
    msgs: [
      { from: "Bu Guru", side: "l", text: "Kelompok Raka, hasil pengamatan kalian menarik. Raka, jelaskan di depan sekarang." },
      { from: "Bu Guru", side: "l", text: "Oh iya, Kepala Sekolah sedang berkunjung. Silakan, Raka." },
      { from: "Kamu", side: "r", text: "(Tiga puluh detik lagi giliranmu. Biasanya kamu menjelaskan ke teman dengan santai — dan sekarang kepala sekolah duduk di barisan kedua...)" },
    ],
    ask: "Kalimat pembuka mana yang akan kamu pilih dalam tiga puluh detik ini?",
    reflect: "Kalau kepala sekolah tidak hadir dan hanya Bu Guru yang mendengar, apakah pilihanmu akan tetap sama?",
    choices: [
      {
        text: "Terima kasih, Bu. Berdasarkan pengamatan kami selama tiga hari, tanaman di dekat jendela tumbuh lebih cepat. Dugaan kami, cahaya memengaruhi pertumbuhannya.",
        fb: "Perhatikan sesuatu yang penting: isi dan alur berpikirmu sama persis dengan cara kamu bercerita ke teman. Yang berubah hanya pilihan kata dan struktur kalimatnya. Itulah tanda kesadaran berbahasa yang sudah otomatis — kamu tidak perlu 'menyusun ulang otak', cukup mengganti pakaian bahasanya. Kemampuan ini hanya muncul kalau dilatih justru di kondisi santai, bukan dihafal semalam sebelumnya.",
        tone: "good",
      },
      {
        text: "Jadi gini Bu, hasilnya basically tanaman yang deket jendela tumbuhnya lebih cepat. Terus dugaan kami sih gara-gara cahaya.",
        fb: "Isimu benar dan runtutan logikanya jelas — itu bagian terpenting dan tidak hilang. Tapi dengar ulang kata 'basically' di situ: dia tidak menambah makna apa pun, dia hanya membawa suasana obrolan warung ke ruang kelas yang sedang diawasi kepala sekolah. Pertanyaannya bukan 'boleh tidak sih?' — boleh saja. Pertanyaannya: apakah kamu SADAR memilihnya, atau dia keluar sendiri karena kebiasaan?",
        tone: "mid",
      },
      {
        text: "Anu... jadi hasilnya, how to say ya, tanaman deket jendela lebih cepat tumbuhnya. Ya sudah, itu saja mungkin.",
        fb: "'Anu' dan 'how to say' di sini bukan pilihan bahasa — itu tempat berlindung saat gugup. Dan itu sangat manusiawi; hampir semua orang pernah di posisi ini. Tapi justru karena itu polanya penting diamati: saat saraf, yang keluar adalah kebiasaan, bukan kemampuan. Orang yang melatih peralihan ragam setiap hari akan tetap terpeleset sedikit saat gugup — tapi dia punya jalan pulang. Orang yang tidak pernah melatih, tersesat lebih lama.",
        tone: "mid",
      },
    ],
  },
  {
    id: "adik",
    place: "Kantin · Istirahat",
    title: "Adik Kelas yang Sedang Rendah Diri",
    domain: "LANGUAGE ATTITUDE",
    msgs: [
      { from: "Adik Kelas", side: "l", text: "Kak, aku tuh ngerasa aneh kalau nulis caption pakai bahasa Indonesia yang beneran." },
      { from: "Adik Kelas", side: "l", text: "Kayak... norak gitu. Temen-temenku semua pakai bahasa campur, keliatan lebih keren." },
      { from: "Kamu", side: "r", text: "(Kamu ingat data yang pernah kamu baca: penerimaan tinggi, pemahaman rendah. Tapi adikmu tidak sedang bertanya data — dia sedang cerita soal rasa percaya dirinya.)" },
    ],
    ask: "Respons mana yang benar-benar membantu dia — bukan cuma terdengar bijak?",
    reflect: "Bahasa yang sedang tren tidak otomatis lebih bernilai. Menurutmu, apa yang sebenarnya membuat sebuah bahasa terasa 'lebih bernilai'?",
    choices: [
      {
        text: "Boleh banget pakai bahasa campur, itu gaya kalian. Tapi coba sesekali tulis sesuatu yang benar-benar kamu rasakan pakai bahasa Indonesia penuh — lalu bandingkan sendiri mana yang terasa lebih 'kamu'. Jangan biarkan tren yang memilih untukmu.",
        fb: "Kamu tidak melarang, tidak menakut-nakuti, dan tidak menggurui — kamu mengajaknya bereksperimen dengan bahasanya sendiri dan memberi dia hak memutuskan. Ini persis cara kerja kesadaran berbahasa: bukan mengganti satu kebiasaan dengan kebiasaan lain, tapi menanamkan kebiasaan MEMBANDINGKAN. Orang yang pernah membandingkan dengan sungguh-sungguh tidak akan bisa tidak sadar lagi.",
        tone: "good",
      },
      {
        text: "Ya terserah sih, yang penting kamu nyaman. Namanya juga gaya masing-masing.",
        fb: "Menghormati pilihan orang lain itu sikap yang bagus — di konteks yang tepat. Tapi coba dengar lagi kalimat adikmu: dia bilang bahasanya sendiri 'norak'. Dia tidak sedang menyatakan pilihan, dia sedang melaporkan rasa malu pada bahasanya sendiri. Di momen seperti ini, 'terserah' terdengar sebagai 'bukan urusanku' — dan keyakinan yang tidak pernah dibantah siapa pun cenderung jadi keyakinan yang paling lama bertahan.",
        tone: "mid",
      },
      {
        text: "Iya ya, aku juga kadang mikir gitu. Makanya aku sekarang lebih sering campur aja biar nggak dibilang aneh.",
        fb: "Jujur saja: ini respons yang paling manusiawi — ikut merasakan tekanan yang sama. Tapi perhatikan apa yang baru saja terjadi: adikmu datang dengan keraguan, dan pulang dengan keyakinan. Kamu baru saja menjadi bukti hidup bahwa 'semua orang merasa begitu' — padahal datamu sendiri berkata lain: fenomena ini banyak ditemukan, tapi banyak pula yang mempertanyakannya. Keraguan itu mungkin justru paling perlu dibicarakan, bukan disamakan.",
        tone: "mid",
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
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "linear-gradient(180deg, #6ec6ff 0%, #9fe0b8 100%)", padding: "clamp(14px,3vmin,40px) clamp(12px,3vmin,32px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
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

          <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(19px,3.4vmin,27px)", color: "#0e2a45", margin: "0 0 18px", textShadow: "0 2px 0 rgba(255,255,255,0.7)" }}>
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
                  <div style={{ background: left ? "rgba(255,255,255,0.97)" : "linear-gradient(135deg,#8b5cf6,#ec4899)", borderRadius: left ? "4px 18px 18px 18px" : "18px 4px 18px 18px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 2px 8px rgba(20,40,70,0.12)" }}>
                    <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 9.5, color: "rgba(255,255,255,0.42)", margin: "0 0 3px" }}>{left ? m.from : ""}</p>
                    <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: left ? "#1c2430" : "white", margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

            <div style={{ background: "rgba(255,255,255,0.94)", borderRadius: 16, padding: "13px 17px", border: "2px solid #facc15", boxShadow: "0 3px 12px rgba(20,40,70,0.15)", marginBottom: 14, animation: "bubbleIn 0.4s 0.5s ease both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, color: "#facc15", letterSpacing: "0.12em" }}>KEPUTUSAN</span>
                <span style={{ fontFamily: "'Righteous',sans-serif", fontSize: 9, letterSpacing: "0.1em", color: "#0b0d22", background: "#facc15", borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>{s.domain}</span>
              </div>
              <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "#16324a", margin: 0, lineHeight: 1.5, fontWeight: 600 }}>{s.ask}</p>
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
                      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>HASIL</p>
                      <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.9)", margin: "0 0 10px", lineHeight: 1.5, fontStyle: "italic" }}>
                        {c.tone === "good" ? "Pilihanmu bekerja dengan baik di konteks ini." : c.tone === "mid" ? "Pesan terkirim — dengan satu hal yang layak kamu perhatikan." : "Pesan terkirim, tapi efeknya berbeda dari yang mungkin kamu niatkan."}
                      </p>
                      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#c084fc", margin: "0 0 5px" }}>MENGAPA BEGITU</p>
                      <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.85)", margin: "0 0 12px", lineHeight: 1.65 }}>{c.fb}</p>
                      <div style={{ padding: "10px 13px", borderRadius: 10, background: "rgba(250,204,21,0.07)", border: "1px dashed rgba(250,204,21,0.45)" }}>
                        <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 10, letterSpacing: "0.14em", color: "#facc15", margin: "0 0 4px" }}>COBA PIKIR LAGI</p>
                        <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.55, fontStyle: "italic" }}>{s.reflect}</p>
                      </div>
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
              {stage === SCENARIOS.length - 1 ? "Refleksi Diri →" : "SITUASI BERIKUTNYA →"}
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
