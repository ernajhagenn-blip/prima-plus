export interface Challenge {
  q: string;
  opts: string[];
  ans: number;
  tip: string;
}

export const CHALLENGES: Challenge[] = [
  {
    q: "Sebuah SMK menemukan campur kode penyisipan kata mendominasi (63,41%) dibanding penyisipan frasa (19,51%) dan klausa (2,43%). Seorang siswa menyimpulkan: 'Berarti 63% siswa tidak loyal pada bahasa Indonesia.' Penilaianmu terhadap kesimpulan itu...",
    opts: [
      "Benar, karena angkanya lebih dari setengah",
      "Keliru, karena data itu mengukur bentuk campur kode dalam tuturan, bukan sikap loyalitas; menyamakan frekuensi bentuk linguistik dengan sikap penutur adalah lompatan interpretasi",
      "Benar, karena penyisipan kata memang tanda kemunduran bahasa",
      "Keliru, karena seharusnya angkanya justru 19,51%",
    ],
    ans: 1,
    tip: "Data linguistik menjawab 'bentuk apa yang muncul', bukan 'sikap bagaimana yang dipegang'. Loyalitas berbahasa adalah konstruk sikap (Garvin & Mathiot) yang harus diukur dengan instrumen sikap — bukan dihitung dari persentase penyisipan kata. Inilah alasan PRIMA+ memisahkan pengukuran perilaku dan pengukuran sikap.",
  },
  {
    q: "Temanmu berkata: 'Kalau formal saya bisa kok. Lihat, pas presentasi kemarin saya pakai bahasa baku.' Tetapi pada sesi tanya jawab dadakan, dia otomatis kembali memakai 'basically' dan 'gitu loh'. Analisis yang paling tepat...",
    opts: [
      "Dia berbohong tentang kemampuannya",
      "Pengetahuan tentang ragam formal belum menjadi perilaku otomatis; dalam tekanan waktu, yang keluar adalah kebiasaan — inilah celah antara kesadaran norma dan perilaku berbahasa",
      "Presentasi formal sudah selesai, jadi tidak masalah",
      "Kata 'basically' memang tidak bisa dihindari siapa pun",
    ],
    ans: 1,
    tip: "Kerangka sikap bahasa membedakan tiga hal: kebanggaan, kesadaran norma, dan perilaku. Seseorang bisa sadar norma (tahu ragam baku) tetapi perilakunya belum konsisten karena belum terlatih otomatis. Kebiasaan hanya berganti pemilik saat dilatih justru dalam kondisi cepat dan menekan.",
  },
  {
    q: "Grup kelas menertawakan satu siswa karena kebiasaan berbicara ragam baku, lalu menjulukinya 'duta bahasa' secara mengejek. Menurut kerangka tiga pilar sikap bahasa, efek jangka panjang norma kelompok seperti ini...",
    opts: [
      "Tidak berdampak karena hanya lelucon tanpa niat jahat",
      "Membuat seluruh anggota kelompok mengasosiasikan ragam baku dengan rasa malu, sehingga kebanggaan bahasa dan perilaku penggunaannya menurun bersama-sama",
      "Justru mendorong siswa lain berlatih bahasa baku",
      "Hanya memengaruhi siswa yang diejek, tidak lebih",
    ],
    ans: 1,
    tip: "Sikap bahasa bersifat sosial: ia dibentuk oleh apa yang kelompok anggap 'keren' dan 'memalukan'. Ketika ragam baku ditempelkan pada rasa malu, dua pilar sekaligus tergerus — kebanggaan (malu pada identitas) dan perilaku (menghindari ragam itu). Ejekan 'kecil' yang berulang adalah mekanisme pembentukan sikap yang paling efektif.",
  },
  {
    q: "Kamu menjadi juri lomba caption antarkelas. Kriteria resminya: 'kreativitas bahasa'. Finalis A menulis penuh bahasa Inggris yang estetik; finalis B menulis bahasa Indonesia dengan majas yang kuat. Keputusan yang paling dapat dipertanggungjawabkan...",
    opts: [
      "A menang, karena bahasa Inggris secara visual lebih modern",
      "B menang, karena lomba di sekolah harus berbahasa Indonesia",
      "Menilai keduanya dengan rubrik kreativitas dan kesesuaian konteks, lalu menanyakan alasan pilihan bahasa masing-masing — pilihan bahasa tanpa alasan komunikatif kehilangan poin kesadaran",
      "Menggabungkan keduanya menjadi juara bersama agar adil",
    ],
    ans: 2,
    tip: "Kesadaran berbahasa bukan berarti memihak satu bahasa, melainkan menilai KENAPA sebuah bahasa dipilih. Bahasa Inggris bisa jadi pilihan sadar yang tepat untuk audiens tertentu; bahasa Indonesia bisa jadi sekadar default. Rubrik yang menanyakan alasan memaksa peserta berpikir — dan itulah keterampilan yang sesungguhnya dinilai.",
  },
  {
    q: "Survei pada mahasiswa kebahasaan menemukan pola aneh: penerimaan terhadap campur kode tinggi (72,7%, kategori baik), tetapi pemahaman tentang penggunaannya rendah (65,5%, kurang baik). Interpretasi paling tajam atas data ini...",
    opts: [
      "Data kontradiktif sehingga tidak dapat digunakan",
      "Menerima fenomena tidak otomatis disertai memahaminya; kesadaran berbahasa tidak tumbuh sendiri hanya karena seseorang sering memakainya — ia perlu dilatih secara eksplisit",
      "Mahasiswa seharusnya menolak campur kode",
      "Angka pemahaman pasti salah hitung",
    ],
    ans: 1,
    tip: "Inilah celah yang coba diisi PRIMA+: keakraban dengan fenomena tidak sama dengan pemahaman atasnya. Seseorang bisa hidup di tengah campur kode setiap hari tanpa pernah berpikir kapan ia tepat, kapan ia mengurangi kejelasan, dan kapan ia menjadi kebiasaan tanpa sadar. Paparan tanpa refleksi menghasilkan penerimaan, bukan kesadaran.",
  },
  {
    q: "Ayahmu bertanya: 'Kenapa kalian generasi sekarang suka banget nyelipin kata Inggris?' Jawaban yang paling jujur sekaligus paling menunjukkan kesadaran berbahasamu...",
    opts: [
      "Karena bahasa Indonesia tidak punya padanannya, Bu",
      "Karena bahasa Indonesia sudah tidak relevan lagi",
      "Sebagian besar karena kebiasaan lingkungan digital dan efek keakraban — dan setelah disadari polanya, kita jadi bisa memilih kapan menyisipkan dan kapan memakai padanan Indonesia",
      "Karena memang tidak sadar, cuma ikut-ikutan orang",
    ],
    ans: 2,
    tip: "Jawaban pertama dan kedua keliru secara faktual (padanan sering ada; bahasa Indonesia justru makin hidup di ruang digital). Jawaban keempat jujur tetapi berhenti di kepasifan. Jawaban ketiga menunjukkan dua lapis kesadaran sekaligus: mengakui pengaruh lingkungan DAN menunjukkan bahwa kesadaran membuat kita kembali memegang kendali pilihan.",
  },
  {
    q: "Kamu membuat konten kampanye sekolah berjudul 'Cinta Bahasa Indonesia'. Draf pertamamu berisi larangan dan peringatan. Menurut temanmu, konten itu 'terdengar seperti pengumuman sekolah'. Revisi yang paling selaras dengan prinsip language awareness...",
    opts: [
      "Tambahkan ancaman sanksi agar diperhatikan",
      "Menampilkan satu pesan yang sama dalam tiga ragam — santai, resmi, kreatif — lalu mengajak penonton merasakan sendiri perbedaan efeknya dan memilih konteks yang cocok",
      "Ganti seluruh isinya dengan bahasa gaul agar terasa dekat",
      "Hapus konten, ganti dengan poster aturan berbahasa",
    ],
    ans: 1,
    tip: "Language awareness tumbuh lewat pengalaman membandingkan dan merasakan konsekuensi pilihan bahasa — bukan lewat larangan (yang melahirkan penolakan) atau penyeragaman (yang menghapus konteks). Konten terbaik membuat penonton MENYADARI sesuatu, bukan sekadar diperintah.",
  },
  {
    q: "Menghadapi esai ujian yang menuntut ragam baku, kebiasaan chat-mu mulai bocor ke tulisan. Strategi persiapan yang paling efektif secara jangka panjang...",
    opts: [
      "Menghafal seperangkat kalimat baku siap pakai",
      "Berlatih menulis ulang pesan chat-mu sendiri ke dalam ragam baku setiap hari — melatih otot peralihan ragam sampai otomatis",
      "Mengubah semua chat menjadi baku mulai detik ini",
      "Menulis esai dengan bahasa gaul asal idenya benar",
    ],
    ans: 1,
    tip: "Opsi pertama menghasilkan jawaban kaku dan rapuh di soal yang berbeda. Opsi ketiga idealis tetapi tidak bertahan — lingkungan chat akan menarikmu kembali. Yang dilatih dalam opsi kedua adalah KEMAMPUAN BERALIH: kebiasaan yang sama tetapi dengan saklar konteks. Itulah keterampilan yang bekerja saat ujian, wawancara, dan presentasi dadakan.",
  },
  {
    q: "Temanmu berargumen: 'Yang penting maknanya sampai. Salah ragam atau tidak, tidak penting.' Bantahan yang paling tepat secara konsep komunikasi...",
    opts: [
      "Tidak perlu dibantah, dia benar",
      "Makna tidak berdiri sendiri: ketika ragam tidak sesuai konteks, makna bisa bergeser — niat sopan bisa terbaca sinis, pesan serius bisa terbaca bercanda; ketepatan ragam adalah bagian dari menjaga makna",
      "Salah ragam berarti orangnya tidak berpendidikan",
      "Semua bahasa sama saja, jadi argumennya sah",
    ],
    ans: 1,
    tip: "Argumen 'yang penting sampai' mengasumsikan makna melekat penuh pada kata. Kenyataannya, makna lahir dari pertemuan antara kata, konteks, dan harapan pembaca. Ragam adalah sinyal sosial yang ikut menentukan pembacaan — dan mengabaikannya berarti menyerahkan sebagian maknamu ke tangan kebetulan.",
  },
  {
    q: "Sintesis: setelah memahami data campur kode, tiga pilar sikap bahasa, dan konsep peralihan ragam — inti persoalan loyalitas berbahasa remaja yang coba dijawab PRIMA+ sebenarnya adalah...",
    opts: [
      "Remaja terlalu malas mempelajari tata bahasa",
      "Bahasa asing harus dibatasi penggunaannya di semua ruang",
      "Kesenjangan antara kebiasaan yang terbentuk lingkungan digital dan kesadaran untuk memilih; jembatannya adalah latihan kesadaran yang konsisten, bukan larangan",
      "Kurikulum bahasa Indonesia harus ditambah jamnya",
    ],
    ans: 2,
    tip: "Data menunjukkan fenomena campur kode itu wajar dan berfungsi sosial. Yang menjadi masalah bukan keberadaannya, melainkan hilangnya kendali: kebiasaan tanpa kesadaran. Karena itu solusinya bukan melarang (yang tidak pernah berhasil melawan kebiasaan sosial), melainkan membangun kesadaran memilih — persis seperti melatih otot: berulang, sadar, dan dalam konteks nyata.",
  },
];
