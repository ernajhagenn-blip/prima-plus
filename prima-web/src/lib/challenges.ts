export interface ChallengeOption {
  text: string;
  hasil: string;
  fb: string;
  quality: "best" | "ok" | "poor";
}

export interface Challenge {
  id: string;
  chapter: number;
  domain: "CONTEXT" | "NORM" | "CODE-MIXING" | "ATTITUDE" | "AGENCY";
  type: string;
  level: number;
  q: string;
  opts: ChallengeOption[];
  reflect: string;
  ans: number;
}

export const CHAPTERS = [
  "KITA NGOMONG GINI, KENAPA?",
  "KOK BAHASA INGGRIS KELIHATAN LEBIH KEREN?",
  "SEMUA TERGANTUNG TEMPATNYA",
  "BAHASA DAN SIAPA DIRI KITA?",
  "PILIHANMU, SUARAMU",
];

export const CHALLENGES: Challenge[] = [
  {
    id: "data",
    chapter: 0,
    domain: "CODE-MIXING",
    type: "EVIDENCE",
    level: 4,
    q: "Sebuah penelitian menemukan bentuk campur kode yang paling sering muncul adalah penyisipan kata (63,41%). Seorang komentator menyimpulkan: 'Berarti lebih dari separuh responden sudah tidak loyal terhadap bahasa Indonesia.' Apa masalah utama dari kesimpulan itu?",
    opts: [
      { text: "Datanya tidak penting karena campur kode memang hal biasa saja.", hasil: "Komentar ini menolak data sepenuhnya.", fb: "Menolak data bukanlah analisis. Fenomena ini memang banyak ditemukan — justru karena sering, kita perlu membaca datanya dengan benar, bukan membuangnya.", quality: "poor" },
      { text: "Kesimpulan itu melompat jauh: frekuensi bentuk campur kode belum cukup untuk menyimpulkan sikap atau loyalitas seseorang.", hasil: "Kamu menemukan lompatan logikanya.", fb: "Data itu mengukur BENTUK bahasa yang muncul, bukan SIKAP orang yang memakainya. Seseorang bisa menyisipkan kata karena kebiasaan, keakraban, atau kebutuhan ekspresi — sambil tetap bangga dan peduli pada bahasa Indonesia. Perilaku dan sikap adalah dua hal yang harus diukur terpisah.", quality: "best" },
      { text: "Angkanya terlalu kecil untuk dipercaya sebagai temuan penelitian.", hasil: "Kamu meragukan angkanya.", fb: "Ukuran angka bukan masalahnya di sini. 63,41% dari 41 tuturan tetap data yang sah tentang bentuk yang dominan. Masalahnya bukan angkanya, melainkan apa yang disimpulkan dari angka itu.", quality: "poor" },
    ],
    reflect: "Kalau begitu, data seperti apa yang dibutuhkan sebelum menyimpulkan loyalitas bahasa seseorang?",
    ans: 1,
  },
  {
    id: "aliran",
    chapter: 0,
    domain: "ATTITUDE",
    type: "SOCIAL PRESSURE",
    level: 2,
    q: "Sebuah ungkapan muncul dari seorang kreator konten, menyebar ke media sosial, dipakai teman sekelasmu, masuk grup chat — dan tanpa sadar kamu mulai memakainya juga. Apa penjelasan yang paling masuk akal?",
    opts: [
      { text: "Kamu tidak punya identitas bahasa sendiri.", hasil: "Kesimpulan ini terasa terlalu berat.", fb: "Tidak sesederhana itu. Punya identitas bahasa tidak berarti kebal terhadap lingkungan — justru penutur paling sadar pun ikut meminjam kata dari sekitarnya. Pertanyaannya bukan 'punya atau tidak', tapi seberapa sadar kamu memilih.", quality: "poor" },
      { text: "Media sosial memengaruhi kebiasaan bahasa lewat paparan berulang, peniruan sosial, dan lingkungan — bukan lewat paksaan.", hasil: "Kamu melihat mekanismenya.", fb: "Ini pola yang paling sering ditemukan penelitian: sesuatu yang terus kita lihat, dengar, dan pakai bersama lingkungan perlahan berubah jadi kebiasaan. Tidak ada yang memaksa — dan justru karena tidak ada paksaan, kita jarang menyadarinya. Kesadaran dimulai dari mengenali aliran ini.", quality: "best" },
      { text: "Semua kata yang berasal dari internet pasti berbahaya dan harus dihindari.", hasil: "Kamu memilih sikap menolak total.", fb: "Menolak total sama menyesuaikan diri tanpa sadar — keduanya bukan pilihan yang sadar. Kata dari internet bisa berguna, lucu, dan tepat di konteksnya. Yang perlu diwaspadai bukan asal katanya, tapi apakah kamu yang memilih, atau yang dipilihkan.", quality: "poor" },
    ],
    reflect: "Coba sebutkan satu kata yang kamu pakai sekarang tapi dulu tidak pernah kamu pakai. Dari mana asalnya?",
    ans: 1,
  },
  {
    id: "healing",
    chapter: 0,
    domain: "CODE-MIXING",
    type: "SELF-AWARENESS",
    level: 6,
    q: "Kamu baru saja mengetik 'aku mau healing dulu' alih-alih 'aku mau istirahat dulu'. Jujur saja — kenapa kamu memilih kata itu?",
    opts: [
      { text: "Karena lebih terbiasa — 'healing' sudah otomatis keluar duluan.", hasil: "Pengakuan yang jujur soal kebiasaan.", fb: "Kebiasaan adalah alasan paling umum dan paling sering terlewat. Menyadarinya bukan hal sepele: orang yang tahu 'aku keluar karena otomatis' berbeda dari orang yang merasa 'memang ini kata yang paling tepat'. Sekarang kamu bisa bertanya: kalau otomatis, apakah aku masih bisa memilih saat dibutuhkan?", quality: "ok" },
      { text: "Karena lebih ekspresif — 'healing' terasa menggambarkan perasaanku lebih tepat saat itu.", hasil: "Pilihan yang sadar alasan ekspresifnya.", fb: "Ini contoh pilihan yang sadar: kamu tahu kata itu membawa nuansa yang 'istirahat' tidak punya — proses memulihkan diri, bukan cuma berhenti. Bahasa campur yang dipilih karena alasan ekspresif justru tanda kepekaan bahasa yang baik. Beda dengan keluar otomatis tanpa pertimbangan.", quality: "ok" },
      { text: "Karena sering melihatnya dipakai orang-orang yang aku ikuti, jadi terasa natural.", hasil: "Kamu menelusuri sumber pengaruhnya.", fb: "Jujur dan tajam. Ini pola paparan → keakraban → kebiasaan yang paling sering ditemukan penelitian media sosial. Menariknya, pertanyaannya berubah sekarang: bukan 'kenapa aku pakai kata itu?', tapi 'siapa atau apa yang membuat pilihan itu terasa paling natural buat aku?'", quality: "ok" },
    ],
    reflect: "Tidak ada jawaban yang salah di sini. Tapi sekarang coba perhatikan: minggu ini, berapa kali kamu memilih kata karena terbiasa — dan berapa kali karena memang sengaja?",
    ans: -1,
  },
  {
    id: "keren",
    chapter: 1,
    domain: "ATTITUDE",
    type: "PRESTIGE TRAP",
    level: 4,
    q: "Temanmu berkata: 'Presentasi pakai istilah Inggris lebih profesional. Kalau full bahasa Indonesia malah kelihatan biasa.' Kamu melihat dua versi kalimat: (A) 'Berikut hasil evaluasi program yang telah kami lakukan.' (B) 'Berikut hasil evaluation program yang telah kami lakukan.' Apa pertimbangan yang paling kuat sebelum memilih?",
    opts: [
      { text: "Pilih B, karena istilah Inggris memang terdengar lebih profesional.", hasil: "Kamu mengikuti asumsi temanmu.", fb: "Coba uji asumsinya: apa yang membuat 'evaluation' lebih profesional dari 'evaluasi' yang berarti sama persis? Profesionalitas terasa dari kejelasan, struktur, dan kepercayaan diri penyampaian — bukan dari asal kata. Justru penyisipan yang tidak perlu bisa mengurangi kesan rapi.", quality: "poor" },
      { text: "Pilih A, karena semua bahasa asing harus dihindari dalam presentasi.", hasil: "Kamu memilih kebalikannya secara mutlak.", fb: "Kebalikan dari asumsi yang salah bukan otomatis benar. Ada istilah yang memang lebih lazim dalam bahasa asing atau belum punya padanan mapan. Melarang mutlak sama kaku dengan memakai mutlak — keduanya menutup ruang pertimbangan.", quality: "poor" },
      { text: "Pertimbangkan audiens, tujuan presentasi, dan apakah istilah asing itu memang diperlukan atau hanya menambah kesan.", hasil: "Kamu menolak kedua jebakan sekaligus.", fb: "Ini pertimbangan yang paling kuat: profesional bukan ditentukan oleh banyaknya istilah Inggris, melainkan oleh pesan yang jelas dan sesuai audiens. 'Evaluasi' dan 'evaluation' sama-sama benar secara makna — yang membedakan hanyalah kesengajaan pilihannya. Pilihan yang sadar selalu terlihat lebih rapi daripada pilihan yang ikut arus.", quality: "best" },
    ],
    reflect: "Pernahkah kamu menyisipkan kata asing dalam presentasi — dan bisa kah kamu jelaskan alasan fungsinya kalau ditanya?",
    ans: 2,
  },
  {
    id: "poster",
    chapter: 1,
    domain: "CONTEXT",
    type: "LANGUAGE DILEMMA",
    level: 5,
    q: "Poster acara sekolahmu memakai judul 'CAREER TALK: FIND YOUR FUTURE'. Panitia lain mengusulkan 'BINCANG KARIER: TEMUKAN MASA DEPANMU'. Keduanya punya daya tarik berbeda. Faktor apa yang paling menentukan pilihanmu?",
    opts: [
      { text: "Yang jelas lebih keren dan estetik di poster.", hasil: "Estetika jadi penentu tunggal.", fb: "Estetika memang penting untuk poster, tapi 'keren' itu relatif dan berubah-ubah mengikuti tren. Kalau estetika jadi satu-satunya alasan, judul bisa kalah penting dari siapa yang perlu membacanya.", quality: "poor" },
      { text: "Target audiens dan tujuan acara: siapa yang ingin diundang, dan kesan seperti apa yang ingin dibangun.", hasil: "Kamu menempatkan pembaca di pusat keputusan.", fb: "Ini faktor yang paling menentukan. Untuk siswa umum, judul Indonesia bisa terasa lebih akrab dan mengundang; untuk acara yang sengaja membangun citra global, campuran bisa jadi pilihan sadar yang tepat. Tidak ada yang salah di kedua judul — yang salah adalah memilih tanpa menjawab 'untuk siapa dan untuk apa'.", quality: "best" },
      { text: "Yang paling banyak dipakai acara sejenis di media sosial.", hasil: "Tren jadi penentu tunggal.", fb: "Melihat tren itu wajar dan berguna sebagai referensi. Tapi tren mencerminkan pilihan orang lain untuk konteks mereka — bukan jawaban untuk audiens dan tujuan acaramu. Ikut tren karena sadar itu berbeda dengan ikut tren karena tidak mau mikir.", quality: "poor" },
    ],
    reflect: "Kalau acaranya dihadiri tamu dari luar negeri, apakah pertimbanganmu berubah? Kenapa?",
    ans: 1,
  },
  {
    id: "hitungkata",
    chapter: 1,
    domain: "AGENCY",
    type: "CLAIM CHECK",
    level: 4,
    q: "Seorang kakak kelas menasihati: 'Mau loyal sama bahasa Indonesia? Gampang. Pakai bahasa Indonesia sebanyak-banyaknya, sisanya bahasa asing itu tanda kurang setia.' Setelah semua yang kamu pelajari, bagaimana penilaianmu atas klaim ini?",
    opts: [
      { text: "Benar — loyalitas memang dihitung dari jumlah kata Indonesia yang kita pakai.", hasil: "Kamu menerima klaim itu apa adanya.", fb: "Ini penyederhanaan yang paling sering muncul. Loyalitas berbahasa mencakup kebanggaan, kesadaran norma, dan keputusan penggunaan — hal-hal yang tidak bisa dihitung dengan menghitung kata. Seseorang bisa bicara 100% bahasa Indonesia sambil menganggap bahasanya sendiri rendah, dan itu bukan loyalitas.", quality: "poor" },
      { text: "Klaim itu terlalu sederhana: loyalitas bukan persentase kata, melainkan kesadaran dan sikap — termasuk kemampuan menjelaskan kenapa kita memilih.", hasil: "Kamu membedakan perilaku dari sikap.", fb: "Ini yang paling tepat. Menghitung kata itu mudah, tapi menutupi kompleksitas yang sesungguhnya: kebanggaan, kesadaran norma, dan keputusan sadar. Seseorang yang kadang memakai bahasa campur tapi tahu kenapa dan kapan, justru menunjukkan kesadaran yang lebih tinggi daripada yang memakai bahasa Indonesia secara otomatis tanpa pernah berpikir.", quality: "best" },
      { text: "Salah total — bahasa campur justru bukti paling jujur dari identitas generasi kita.", hasil: "Kamu menolak dengan mengganti klaim.", fb: "Menolak klaim satu arah dengan klaim satu arah sebaliknya tidak menyelesaikan apa-apa. Bahasa campur bukan 'bukti' apa pun secara otomatis — dia bisa kebiasaan, strategi, atau ekspresi. Setiap kemungkinan butuh dilihat konteksnya, bukan digeneralisasi.", quality: "poor" },
    ],
    reflect: "Kalau loyalitas bukan jumlah kata, coba rumuskan sendiri: menurutmu, apa satu tanda yang menunjukkan seseorang benar-benar bangga pada bahasanya?",
    ans: 1,
  },
  {
    id: "reschedule",
    chapter: 2,
    domain: "CONTEXT",
    type: "CONTEXT SWITCH",
    level: 3,
    q: "Kalimat yang sama: 'Guys, meeting-nya kita reschedule ya.' Kalimat ini kamu kirim ke empat tempat berbeda. Di situasi mana kalimat ini paling perlu diubah?",
    opts: [
      { text: "Grup sahabat — mereka terbiasa dengan gaya ini.", hasil: "Di sini kalimat itu memang pas.", fb: "Betul, di grup sahabat kalimat ini wajar, cepat, dan jelas. Tidak ada alasan mengubahnya — justru mengubahnya jadi kaku akan terasa aneh. Tapi ini bukan situasi yang paling menuntut perubahan.", quality: "poor" },
      { text: "Pesan ke ketua organisasi — sedikit perlu dirapikan, tapi masih wajar.", hasil: "Penilaianmu cukup tepat.", fb: "Benar bahwa perlu penyesuaian ringan — tambah alasan dan waktu baru misalnya. Tapi nada santai masih bisa diterima dalam komunikasi internal organisasi. Masih ada satu situasi yang menuntut perubahan paling besar.", quality: "ok" },
      { text: "Pengumuman resmi organisasi sekolah — di sanalah kalimat ini paling perlu diubah total.", hasil: "Kamu menemukan titik yang paling menuntut.", fb: "Tepat. Dalam pengumuman resmi, 'guys' dan 'reschedule' tanpa keterangan membuat pesan kehilangan wibawa dan kejelasan: siapa yang dituju, kapan, dan apa yang harus dilakukan. Perhatikan polanya — kalimatnya tidak berubah jadi salah; yang berubah adalah situasinya. Kesadaran konteks artinya tahu kapan sebuah kalimat perlu diganti pakaian.", quality: "best" },
    ],
    reflect: "Coba susun versi pengumuman resminya sendiri. Kata mana dari kalimat asli yang kamu pertahankan, dan kenapa?",
    ans: 2,
  },
  {
    id: "balasguru",
    chapter: 2,
    domain: "NORM",
    type: "DIGITAL COMMUNICATION",
    level: 3,
    q: "Bu pembina mengirim broadcast di grup: 'Anak-anak, laporan kegiatan dikumpulkan besok jam 12 siang ya.' Tiga balasan ini muncul di grup. Mana yang paling tepat sebagai balasanmu?",
    opts: [
      { text: "Siap bu, siap dikejar deadline-nya 💪", hasil: "Hangat, tapi ada yang terlewat.", fb: "Nadanya hangat dan wajar di grup kelas. Tapi balasan ini tidak mengonfirmasi hal yang paling penting: kamu benar-benar paham tenggatnya. Guru yang membaca mungkin bertanya-tanya — 'dia paham jam 12, atau cuma ikut senang?'", quality: "ok" },
      { text: "Baik Bu, laporan kegiatan kami kumpulkan besok sebelum jam 12. Terima kasih pengingatnya.", hasil: "Pendek, jelas, dan mengonfirmasi.", fb: "Balasan ini bekerja dengan baik karena tiga hal: mengonfirmasi tugas, mengulang tenggat (sebuah cara halus memastikan tidak ada salah paham), dan tetap hangat dengan ucapan terima kasih. Tidak perlu kaku — perhatikan tidak ada kata formal berlebihan di sini. Kesadaran norma itu tentang kesesuaian, bukan kekakuan.", quality: "best" },
      { text: "Noted bu 🙏", hasil: "Cepat, tapi tipis.", fb: "'Noted' efisien dan lazim di chat kerja. Tapi sebagai balasan kepada guru untuk sebuah tenggat, dia tidak mengonfirmasi pemahamanmu — hanya menandai pesan sudah dibaca. Efisiensi bagus untukmu, kurang menghibur untuk yang membaca.", quality: "poor" },
    ],
    reflect: "Kalau broadcast yang sama dikirim ketua panitia (temanmu sendiri), apakah balasanmu berubah? Mana bagian yang berubah, dan kenapa?",
    ans: 1,
  },
  {
    id: "akunsekolah",
    chapter: 2,
    domain: "NORM",
    type: "NORM VS CONTEXT",
    level: 3,
    q: "Kamu mengelola dua akun: akun pribadimu dan akun resmi sekolah. Kegiatan sama, foto sama. Untuk akun pribadi kamu menulis: 'seru banget hari ini, bakso abis itu nonton bareng 😭🤙'. Sekarang giliran akun sekolah. Yang paling tepat...",
    opts: [
      { text: "Tulis ulang dengan gaya yang sama persis — toh kegiatannya sama.", hasil: "Konteks akun terlewat.", fb: "Kegiatannya memang sama, tapi pembacanya tidak sama. Akun resmi dibaca siswa, guru, orang tua, bahkan dinas — dan setiap unggahan mewakili sekolah, bukan dirimu. Gaya warung kopi yang lucu di akun pribadi bisa terdengar tidak serius ketika berbicara atas nama institusi.", quality: "poor" },
      { text: "Tulis versi yang lebih tertata — 'Seru! Siswa-siswi menutup kegiatan dengan makan bersama dan menonton film' — tanpa kehilangan kehangatannya.", hasil: "Kamu menyesuaikan tanpa menjadi kaku.", fb: "Ini titik temu yang tepat: akun resmi menuntut kejelasan dan kesopanan, tapi tidak harus dingin. Perhatikan versimu masih memakai kata 'seru' — hangat dan manusiawi. Kesadaran norma bukan soal memilih kata paling formal, tapi kata yang paling sesuai untuk siapa yang membaca dan siapa yang berbicara.", quality: "best" },
      { text: "Tulis sangat formal dan panjang agar terlihat resmi dan dihormati.", hasil: "Formalitas berlebihan justru mengunci pembaca.", fb: "Niatnya benar, tapi hasilnya bisa berbalik: unggahan yang terlalu birokratis jarang dibaca sampai selesai, apalagi dibagikan ulang. Akun sekolah yang baik justru bisa tampil ramah — yang penting akurat, sopan, dan jelas. Formalitas maksimal bukan tujuan; kesesuaian maksimal yang jadi tujuan.", quality: "poor" },
    ],
    reflect: "Akun siapa lagi yang kamu kelola atau ikuti yang punya 'suara' berbeda untuk konteks berbeda? Coba identifikasi perbedaannya.",
    ans: 1,
  },
  {
    id: "adikkelas",
    chapter: 3,
    domain: "ATTITUDE",
    type: "SOCIAL PRESSURE",
    level: 5,
    q: "Adik kelasmu berkata pelan: 'Kak, aku ngerasa norak kalau nulis caption pakai bahasa Indonesia. Temen-temenku semua pakai bahasa campur, keliatan lebih keren.' Di dadamu ada beberapa respons yang bersaing. Mana yang benar-benar membantunya?",
    opts: [
      { text: "'Ya udah ikuti aja trennya, yang penting kamu nyaman.'", hasil: "Kamu memilih tidak ikut campur.", fb: "Niatnya baik — menghormati pilihan orang. Tapi dengar lagi kalimatnya: dia tidak sedang menyatakan pilihan, dia sedang melaporkan malu pada bahasanya sendiri. 'Ikuti aja' di momen ini sama dengan membiarkan keyakinan itu tumbuh tanpa pernah ditantang siapa pun.", quality: "poor" },
      { text: "'Boleh banget pakai bahasa campur — aku juga. Tapi coba sesekali tulis sesuatu yang beneran kamu rasakan full bahasa Indonesia, lalu bandingkan sendiri mana yang terasa lebih kamu. Jangan biarkan tren yang memilih untukmu.'", hasil: "Kamu memberi dia alat, bukan perintah.", fb: "Respons ini menolak dua jebakan sekaligus: tidak menghakimi bahasa campur (kamu pun memakainya) dan tidak membiarkan anggapan 'bahasa Indonesia = norak' berdiri tanpa diuji. Kamu mengajaknya bereksperimen dan memberi dia hak memutuskan. Bahasa yang tren tidak otomatis lebih bernilai — dan rasa 'keren' yang dipinjam dari tren bisa diganti dengan rasa percaya diri yang dimiliki sendiri.", quality: "best" },
      { text: "'Iya ya, aku juga kadang mikir gitu. Bahasa Indonesia emang agak susah bikin kesan modern.'", hasil: "Kamu ikut merasakan tekanan yang sama.", fb: "Ini respons paling manusiawi — solidaritas rasa. Tapi perhatikan konsekuensinya: adikmu datang dengan keraguan, pulang dengan keyakinan. Padahal data yang pernah kamu baca berkata lain: fenomenanya nyata, tapi banyak juga yang mempertanyakannya. Rendahnya rasa percaya diri berbahasa sering bukan karena bahasanya memang kalah — tapi karena tidak pernah ada yang mengajaknya mengujinya.", quality: "poor" },
    ],
    reflect: "Pernah nggak kamu merasa bahasa Indonesia 'kurang keren'? Coba ingat: dari mana perasaan itu pertama kali datang?",
    ans: 1,
  },
  {
    id: "identitas",
    chapter: 3,
    domain: "ATTITUDE",
    type: "IDENTITY",
    level: 5,
    q: "Seorang teman berkata: 'Kalau aku full bahasa Indonesia terus, apa gue keliatan kuno? Tapi kalau gue campur terus, apa gue kehilangan akarnya?' Pertanyaan ini menampar — dan paling dekat dengan jawaban yang jujur adalah...",
    opts: [
      { text: "'Full bahasa Indonesia aja, biar aman dan jelas identitasnya.'", hasil: "Jawaban aman yang menutup pertanyaan.", fb: "Aman, tapi tidak menjawab kegelisahannya. Identitas bukan pilihan biner antara 'kuno' dan 'kehilangan akar'. Menutup pertanyaan dengan aturan baru sama saja memindahkan masalah, bukan memahaminya.", quality: "poor" },
      { text: "'Identitasmu tidak ditentukan oleh persentase bahasa yang kamu pakai — tapi oleh seberapa sadar kamu memilihnya. Bisa saja kamu campur hari ini dan full Indonesia besok, dan tetap dirimu yang utuh.'", hasil: "Kamu melonggarkan bingkai pertanyaannya.", fb: "Ini yang paling dekat dengan intinya: identitas berbahasa bukan garis tetap, melainkan rangkaian pilihan yang sadar. Seseorang bisa memakai bahasa campur untuk bercanda, bahasa Indonesia untuk menulis, dan keduanya sama-sama jujur. Yang menghilangkan akar bukan bahasa campur — tapi lupa kenapa kita memilih.", quality: "best" },
      { text: "'Yang penting kan isi, bukan bahasanya. Overthinking aja.'", hasil: "Pertanyaannya dianggap sepele.", fb: "Isi memang penting — tapi bagi banyak orang, bahasa justru bagian dari isi: cara mereka menunjukkan siapa mereka. Menyebut pertanyaan identitas sebagai 'overthinking' menutup pintu untuk memahami diri sendiri, padahal itu pertanyaan yang layak diajukan setiap penutur.", quality: "poor" },
    ],
    reflect: "Kalau kamu menjelaskan dirimu ke orang asing lewat cara berbahasamu, apa yang ingin terlihat?",
    ans: 1,
  },
  {
    id: "menertawakan",
    chapter: 3,
    domain: "ATTITUDE",
    type: "SOCIAL PRESSURE",
    level: 4,
    q: "Di grup, teman-teman mulai menertawakan seorang siswa yang bicara dengan ragam sangat baku, menjulukinya 'duta bahasa' dengan nada mengejek. Kamu sedang membaca obrolan itu. Tindakan yang paling berdampak...",
    opts: [
      { text: "Ikut tertawa sebentar — toh ini cuma lelucon tanpa niat jahat.", hasil: "Lelucon itu terasa ringan, efeknya tidak.", fb: "Tanpa niat jahat memang. Tapi norma kelompok tidak dibentuk oleh niat — ia dibentuk oleh pola: apa yang ditertawakan, apa yang dipuji. Setiap 'haha' yang kamu kirim adalah suara kecil yang bilang 'ini benar'. Dikumpulkan dari banyak orang, suara-suara kecil itulah yang mengajari satu kelas bahwa ragam baku itu memalukan.", quality: "poor" },
      { text: "Kirim pesan pribadi ke siswa itu: 'Aku paham mereka cuma bercanda. Lanjut aja gaya bicaramu — justru itu yang jarang.'", hasil: "Kamu memilih mendukung secara diam.", fb: "Dukungan pribadi itu nyata dan berarti — banyak yang butuh sekali satu suara seperti ini. Tapi ada satu hal yang belum tersentuh: norma kelompoknya sendiri masih utuh, dan korban berikutnya sudah menunggu. Diam pada pola berarti membiarkan pola bekerja.", quality: "ok" },
      { text: "Tulis di grup dengan nada ringan: 'Wkwk tapi jujur dia jago sih. Gue aja gak berani nulis formal sebagus itu. Eh ngomong-ngomong, rapat besok jam berapa?'", hasil: "Kamu menggeser nada grup tanpa drama.", fb: "Ini yang paling berdampak: kamu tidak menceramahi, tidak melawan — kamu menambah suara baru ke dalam norma kelompok. 'Dia jago' mengubah label dari 'kutu buku yang aneh' jadi 'orang yang punya kemampuan'. Sering kali norma berubah bukan karena pidato, tapi karena satu orang berani bilang hal sebaliknya dengan santai.", quality: "best" },
    ],
    reflect: "Di kelasmu, ragam bicara seperti apa yang 'aman' dan yang 'ditertawakan'? Siapa yang sebenarnya menentukan daftar itu?",
    ans: 2,
  },
  {
    id: "empatpesan",
    chapter: 4,
    domain: "AGENCY",
    type: "LANGUAGE DECISION",
    level: 5,
    q: "Kamu bertugas mengurus acara sekolah dan harus menulis empat pesan: (1) caption Instagram acara, (2) pesan koordinasi di grup panitia, (3) undangan resmi untuk kepala sekolah, (4) pengumuman di mading. Pesan mana yang paling menuntut bahasa paling tertata?",
    opts: [
      { text: "Caption Instagram — karena paling banyak dilihat orang.", hasil: "Jangkauan bukan satu-satunya ukuran.", fb: "Benar bahwa caption dibaca banyak orang, tapi media sosial justru memberi ruang gaya paling longgar — caption yang hangat dan kreatif justru bekerja lebih baik di sana. Banyak dibaca bukan berarti paling menuntut ketataan.", quality: "poor" },
      { text: "Pesan grup panitia — karena semua keputusan lahir di sana.", hasil: "Penting, tapi bukan yang paling menuntut.", fb: "Pesan koordinasi memang penting untuk kejelasan, tapi pembacanya rekan sebaya dengan konteks sama — kesalahan kecil mudah dikoreksi langsung. Tingkat ketataan yang dibutuhkan berada di tengah.", quality: "ok" },
      { text: "Undangan resmi untuk kepala sekolah — karena mewakili panitia, menghadap pihak yang dihormati, dan menjadi dokumen yang tersimpan.", hasil: "Kamu membaca tuntutan tiap konteks.", fb: "Tepat. Undangan resmi menumpuk tiga tuntutan sekaligus: mewakili kolektif, menghadapi relasi yang berbeda kedudukan, dan bertahan sebagai dokumen. Bukan karena 'harus kaku' — tapi karena di sinilah kesalahan kecil paling sulit diperbaiki. Perhatikan polanya: kamu baru saja menilai empat konteks dan menentukan prioritasnya. Itulah keputusan bahasa yang sadar.", quality: "best" },
    ],
    reflect: "Coba bayangkan keempat pesan itu. Mana yang akan kamu tulis paling santai — dan apa batas 'santai' versimu?",
    ans: 2,
  },
  {
    id: "dilema",
    chapter: 4,
    domain: "AGENCY",
    type: "LANGUAGE DILEMMA",
    level: 5,
    q: "Kegiatan penting besok pagi, dan satu-satunya kanal yang pasti dibaca semua anggota adalah grup chat santai yang biasanya penuh meme. Pengumumannya bersifat resmi dan wajib dipatuhi. Tidak ada pilihan sempurna. Pilihan yang paling dapat dipertanggungjawabkan...",
    opts: [
      { text: "Tulis super formal lengkap dengan nomor dan poin-poin, biar jelas resminya.", hasil: "Resmi, tapi mungkin tenggelam.", fb: "Niatnya menjaga wibawa. Tapi di grup yang biasa dipenuhi meme, pengumuman yang terlalu birokratis justru berisiko dibaca sekilas — atau dibalas meme lagi. Formalitas maksimal di kanal yang salah bisa kehilangan justru hal yang paling penting: dibaca serius.", quality: "poor" },
      { text: "Tulis dengan struktur jelas — waktu, tempat, apa yang wajib dibawa — dalam nada netral yang sedikit lebih rapi dari biasanya, lalu minta dua orang membalas 'siap' sebagai konfirmasi.", hasil: "Kamu menyeimbangkan kanal, isi, dan kepastian.", fb: "Ini pilihan yang paling dewasa: kamu tidak berpura-pura grup itu adalah ruang resmi, tapi kamu menaikkan ketataan seperlunya dan menciptakan mekanisme kepastian (konfirmasi). Kesadaran berbahasa di dunia nyata sering seperti ini — bukan memilih gaya sempurna, tapi merancang gaya yang bekerja di kanal yang ada.", quality: "best" },
      { text: "Tulis santai total seperti biasa, biar tidak kaku dan semua merasa dekat.", hasil: "Hangat, tapi wajibnya bisa hilang.", fb: "Kedekatan memang terjaga, tapi ada risiko yang tidak boleh diabaikan: pesan wajib yang terdengar seperti obrolan biasa mudah dibaca sebagai opsional. Kehangatan bukan masalah — hilangnya sinyal 'ini wajib' itulah masalahnya.", quality: "poor" },
    ],
    reflect: "Kapan terakhir kamu harus mengumumkan sesuatu? Kanal apa yang kamu pakai, dan apa yang kamu korbankan dari gaya aslimu?",
    ans: 1,
  },
  {
    id: "pola",
    chapter: 4,
    domain: "AGENCY",
    type: "REFLECT",
    level: 6,
    q: "Perjalanan ini hampir selesai. Pertanyaan terakhir, dan tidak ada jawaban yang lebih benar: kapan kamu paling SADAR sedang memilih bahasa?",
    opts: [
      { text: "Saat menulis untuk orang yang kedudukannya berbeda — guru, kepala sekolah, orang tua.", hasil: "Konteks relasi adalah pemicu kesadaranmu.", fb: "Bagus — banyak orang justru paling sadar justru di situ, karena perbedaan kedudukan memaksa kita berpikir sebelum mengetik. Tantangannya ke depan: bisa kah kesadaran itu ikut terbawa ke ruang-ruang santai, tempat kita biasa mengetik tanpa mikir?", quality: "ok" },
      { text: "Saat memilih antara dua kata untuk hal yang sama — dan bertanya mana yang lebih jujur untuk perasaanku.", hasil: "Kesadaranmu tinggal di pemilihan kata.", fb: "Ini level yang halus: sadar pada skala kata. Orang yang terbiasa bertanya 'mana yang lebih jujur' sedang melatih selera bahasanya setiap hari. Itu fondasi dari gaya pribadi — dan gaya pribadi adalah tanda penutur yang dewasa.", quality: "ok" },
      { text: "Justru saat menyadari aku MENGETIK tanpa mikir — lalu berhenti, dan bertanya kenapa kata ini yang keluar.", hasil: "Kesadaranmu justru lahir dari kebiasaan.", fb: "Momen 'tunggu, kenapa aku nulis gini?' adalah momen paling berharga dari semuanya — karena dia terjadi tepat di wilayah kebiasaan, tempat kesadaran paling jarang masuk. Kalau kamu bisa menangkap momen itu lebih sering, kamu tidak sedang melawan bahasa campur atau membelanya: kamu cuma kembali jadi orang yang memilih.", quality: "ok" },
    ],
    reflect: "Ini bukan akhir — ini awal kebiasaan baru. Selama seminggu ke depan, tangkap satu momen 'kenapa aku nulis gini?' setiap hari. Lihat apa yang kamu temukan tentang dirimu sendiri.",
    ans: -1,
  },
];
