"use client";

import { useRouter } from "next/navigation";

const T = {
  judul: "🌐 Ruang Edukasi PRIMA+: Dinamika Bahasa dan Identitas Digital",
  p1: "Selamat datang di platform PRIMA+. Di era digital saat ini, perkembangan teknologi informasi telah mengubah lanskap komunikasi remaja secara masif. Berdasarkan kajian sosiolinguistik, ruang siber sering kali menjadi wadah subur bagi masifnya penggunaan ragam bahasa informal, campur kode (code-mixing), hingga adopsi istilah asing.",
  p2: "Meskipun fenomena ini mencerminkan kreativitas digital generasi muda, penting bagi kita untuk memahami bagaimana dinamika tersebut memengaruhi eksistensi bahasa nasional. Mari telusuri pembahasan ilmiahnya berikut ini.",
  s1: "1. Fenomena Campur Kode di Ruang Siber: Antara Ekspresi dan Loyalitas Bahasa",
  p3: "Dalam kajian sosiolinguistik, campur kode didefinisikan sebagai penggunaan dua bahasa atau lebih secara bersamaan dalam suatu tindak tutur tanpa adanya tuntutan situasi formal yang mengharuskannya. Di media sosial, kebiasaan memadukan bahasa Indonesia dengan unsur bahasa asing atau ragam gaul sangat lumrah ditemukan pada kolom komentar, caption, maupun unggahan harian.",
  p4: "Kendati di satu sisi mempermudah keakraban dan ekspresi diri, adopsi berlebihan ini memicu tantangan tersendiri. Sosiolinguis Abdul Chaer (2014) menegaskan bahwa loyalitas berbahasa—sebagai sikap positif untuk mempertahankan dan menghargai bahasa nasional—dapat terkikis apabila penutur mulai mengabaikan kaidah baku demi mengejar prestise modernitas.",
  s2: "2. Urgensi Pendekatan Language Awareness (Kesadaran Berbahasa)",
  p5: "Untuk merespons pergeseran pola berbahasa tersebut, pendekatan Language Awareness hadir sebagai kerangka edukatif yang esensial. Menurut Fairclough (1992) dan Carter (2023), kesadaran berbahasa bukan berarti melarang inovasi atau penggunaan bahasa asing, melainkan melatih kemampuan krisis individu agar memahami struktur, fungsi, serta konteks sosial bahasa. Melalui pemahaman ini, remaja diharapkan mampu:",
  li1: "Menempatkan bahasa secara kontekstual, baik dalam ranah akademik/formal maupun ruang digital.",
  li2: "Menjaga kesantunan dan keteraturan tata bahasa tanpa kehilangan ruang berekspresi secara kreatif.",
  s3: "3. Tiga Pilar Utama Sikap Bahasa",
  p6: "Mengacu pada kerangka teoretis klasik yang dikemukakan oleh Garvin dan Mathiot (1968), sikap dan loyalitas berbahasa seseorang dibangun atas tiga dimensi fundamental:",
  pillar1: "Kebanggaan Bahasa (Language Pride): Dorongan afektif untuk merasa bangga menggunakan bahasa Indonesia sebagai identitas kebangsaan.",
  pillar2: "Kesadaran Norma Bahasa (Awareness of the Norm): Kepekaan kognitif terhadap aturan kebahasaan, termasuk kemampuan membedakan bentuk kata baku dan tidak baku secara konsisten.",
  pillar3: "Perilaku Penggunaan Bahasa (Language Behavior): Konsistensi nyata dalam memprioritaskan penggunaan bahasa Indonesia yang baik dan benar dalam kehidupan sehari-hari.",
};

export default function EdukasiPage() {
  const router = useRouter();

  return (
    <main style={{ width: "100vw", minHeight: "100vh", margin: 0, background: "radial-gradient(ellipse at 50% -10%, #1d3a5f 0%, #0b0d22 60%)", padding: "clamp(16px,4vmin,48px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontFamily: "'Righteous',sans-serif", fontSize: 12, letterSpacing: "0.25em", color: "#38bdf8", margin: "0 0 10px", textAlign: "center" }}>
        MEMAHAMI KONSEPNYA
      </p>
      <h1 style={{ fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(19px,3.6vmin,30px)", color: "white", margin: "0 0 26px", textAlign: "center", textShadow: "0 3px 16px rgba(56,189,248,0.4)", maxWidth: 720, lineHeight: 1.3 }}>
        {T.judul}
      </h1>

      <div style={{ width: "100%", maxWidth: 700, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "18px 22px", border: "1px solid rgba(255,255,255,0.09)", animation: "rise 0.5s ease both" }}>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.7 }}>{T.p1}</p>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: "12px 0 0", lineHeight: 1.7 }}>{T.p2}</p>
        </div>

        <div style={{ background: "rgba(124,58,237,0.1)", borderRadius: 18, padding: "18px 22px", border: "1px solid rgba(124,58,237,0.4)", animation: "rise 0.5s 0.12s ease both" }}>
          <h2 style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(15px,2.8vmin,19px)", color: "#c084fc", margin: "0 0 12px" }}>{T.s1}</h2>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.7 }}>{T.p3}</p>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: "12px 0 0", lineHeight: 1.7 }}>{T.p4}</p>
        </div>

        <div style={{ background: "rgba(14,165,233,0.09)", borderRadius: 18, padding: "18px 22px", border: "1px solid rgba(14,165,233,0.4)", animation: "rise 0.5s 0.24s ease both" }}>
          <h2 style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(15px,2.8vmin,19px)", color: "#38bdf8", margin: "0 0 12px" }}>{T.s2}</h2>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.7 }}>{T.p5}</p>
          <div style={{ margin: "12px 0 0", display: "flex", flexDirection: "column", gap: 9 }}>
            {[T.li1, T.li2].map((li, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "rgba(56,189,248,0.25)", color: "#7dd3fc", fontFamily: "'Righteous',sans-serif", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>✓</span>
                <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>{li}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(250,204,21,0.07)", borderRadius: 18, padding: "18px 22px", border: "1px solid rgba(250,204,21,0.4)", animation: "rise 0.5s 0.36s ease both" }}>
          <h2 style={{ fontFamily: "'Righteous',sans-serif", fontSize: "clamp(15px,2.8vmin,19px)", color: "#facc15", margin: "0 0 12px" }}>{T.s3}</h2>
          <p style={{ fontFamily: "Arial,sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.88)", margin: "0 0 14px", lineHeight: 1.7 }}>{T.p6}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { n: "1", t: T.pillar1, c: "#f472b6" },
              { n: "2", t: T.pillar2, c: "#a78bfa" },
              { n: "3", t: T.pillar3, c: "#4ade80" },
            ].map((p) => (
              <div key={p.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "rgba(0,0,0,0.25)", borderRadius: 14, padding: "12px 15px" }}>
                <span style={{ flexShrink: 0, width: 30, height: 30, borderRadius: "50%", background: p.c, color: "#0b0d22", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 15, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.n}</span>
                <p style={{ fontFamily: "Arial,sans-serif", fontSize: 13.5, color: "rgba(255,255,255,0.9)", margin: 0, lineHeight: 1.6 }}>{p.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/chat")}
        style={{ marginTop: 28, marginBottom: 10, padding: "15px 44px", borderRadius: 999, background: "linear-gradient(135deg,#0ea5e9,#22d3ee)", border: "none", color: "#06283d", fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 6px 24px rgba(34,211,238,0.4)" }}
      >
        Lihat dalam Kehidupan Sehari-hari →
      </button>

      <style>{`@keyframes rise { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
    </main>
  );
}
