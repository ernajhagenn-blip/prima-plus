import fs from "node:fs/promises";
import ExcelJS from "exceljs";

const outputDir = "outputs/opsi_prima_rab";
const outputPath = `${outputDir}/RAB_PRIMA_OPSI_2026_Rinci.xlsx`;

const items = [
  // 1. BIAYA ALAT DAN BAHAN
  ["1", "a", "Biaya Alat dan Bahan", "Domain name (.id) selama 1 tahun (prima-plus.id)", 150000],
  ["1", "b", "Biaya Alat dan Bahan", "Hosting Vercel Pro selama 6 bulan (deploy aplikasi PRIMA+)", 0],
  ["1", "c", "Biaya Alat dan Bahan", "Firebase Spark Plan (database + autentikasi, gratis tier)", 0],
  ["1", "d", "Biaya Alat dan Bahan", "Google Gemini API Free Tier (fitur AI dalam aplikasi)", 0],
  ["1", "e", "Biaya Alat dan Bahan", "Kertas HVS A4 80 gsm untuk cetak instrumen (2 rim)", 112000],
  ["1", "f", "Biaya Alat dan Bahan", "Tinta printer hitam refill (1 botol)", 62500],
  ["1", "g", "Biaya Alat dan Bahan", "Tinta printer warna refill (1 botol)", 78500],
  ["1", "h", "Biaya Alat dan Bahan", "Map plastik/snelhecter untuk berkas responden (35 lembar)", 52500],
  ["1", "i", "Biaya Alat dan Bahan", "Label kode responden (2 pak)", 24000],
  ["1", "j", "Biaya Alat dan Bahan", "Pulpen untuk pengisian instrumen (2 lusin)", 48000],
  ["1", "k", "Biaya Alat dan Bahan", "Binder clip, staples, dan isolasi arsip (1 paket)", 35750],
  ["1", "l", "Biaya Alat dan Bahan", "Flashdisk 32 GB untuk cadangan data penelitian (1 unit)", 44850],
  ["1", "m", "Biaya Alat dan Bahan", "Materai Rp10.000 untuk berkas izin/validasi (4 lembar)", 40000],
  ["1", "n", "Biaya Alat dan Bahan", "Amplop cokelat arsip dokumen (10 lembar)", 18500],

  // 2. BIAYA JASA
  ["2", "a", "Biaya Jasa", "Honorarium validator ahli bahasa (2 orang x Rp300.000)", 600000],
  ["2", "b", "Biaya Jasa", "Honorarium validator ahli teknologi pendidikan (1 orang)", 300000],
  ["2", "c", "Biaya Jasa", "Fotokopi/cetak kuesioner pretest-posttest (60 set)", 210000],
  ["2", "d", "Biaya Jasa", "Cetak lembar validasi dan angket respons (40 set)", 137500],
  ["2", "e", "Biaya Jasa", "Cetak kartu skenario kasus bahasa PRIMA+ (30 set)", 185000],
  ["2", "f", "Biaya Jasa", "Jilid laporan proposal/lampiran (3 eksemplar)", 90000],

  // 3. BIAYA SEWA
  ["3", "a", "Biaya Sewa", "Paket data internet 25 GB untuk koordinasi dan uji coba (1 nomor)", 135000],
  ["3", "b", "Biaya Sewa", "Modem Wi-Fi portabel saat uji coba (1 hari)", 85000],
  ["3", "c", "Biaya Sewa", "Tripod HP untuk dokumentasi kegiatan (1 hari)", 45000],

  // 4. AKOMODASI DAN TRANSPORTASI
  ["4", "a", "Akomodasi dan Transportasi", "Transport lokal ke sekolah, validator, dan percetakan (4 kali)", 245000],
  ["4", "b", "Akomodasi dan Transportasi", "Konsumsi ringan validator dan siswa uji coba (35 paket)", 280000],
  ["4", "c", "Akomodasi dan Transportasi", "Air mineral gelas untuk kegiatan validasi/uji coba (2 dus)", 58000],
];

const budgetLimit = 15000000;
const total = items.reduce((s, i) => s + i[4], 0);

await fs.mkdir(outputDir, { recursive: true });

const wb = new ExcelJS.Workbook();
wb.creator = "PRIMA+ OPSI 2026";

// ===== SHEET 1: RAB Rinci =====
const ws = wb.addWorksheet("RAB Rinci", { properties: { tabColor: { argb: "2E7D32" } } });

ws.mergeCells("A1:F1");
const titleCell = ws.getCell("A1");
titleCell.value = "RANCANGAN ANGGARAN BIAYA (RAB) — Media Digital PRIMA+ OPSI 2026";
titleCell.font = { bold: true, color: { argb: "FFFFFF" }, size: 13 };
titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1B5E20" } };
titleCell.alignment = { horizontal: "center", vertical: "center" };
ws.getRow(1).height = 30;

const headers = ["No.", "Sub", "Jenis Pengeluaran", "Komponen Pengeluaran", "Jumlah (Rp)", "Keterangan"];
const headerRow = ws.addRow(headers);
headerRow.height = 22;
headerRow.eachCell((cell) => {
  cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 11 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2E7D32" } };
  cell.alignment = { horizontal: "center", vertical: "center", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "C8E6C9" } },
    bottom: { style: "thin", color: { argb: "C8E6C9" } },
    left: { style: "thin", color: { argb: "C8E6C9" } },
    right: { style: "thin", color: { argb: "C8E6C9" } },
  };
});

items.forEach((item) => {
  const row = ws.addRow([
    item[0],
    item[1],
    item[2],
    item[3],
    item[4],
    item[4] === 0 ? "Gratis (free tier)" : "",
  ]);
  row.eachCell((cell, colNumber) => {
    cell.border = {
      top: { style: "thin", color: { argb: "C8E6C9" } },
      bottom: { style: "thin", color: { argb: "C8E6C9" } },
      left: { style: "thin", color: { argb: "C8E6C9" } },
      right: { style: "thin", color: { argb: "C8E6C9" } },
    };
    if (colNumber <= 3) cell.alignment = { horizontal: "center", vertical: "center" };
    if (colNumber === 4) { cell.alignment = { wrapText: true, vertical: "center" }; }
    if (colNumber === 5) { cell.numFmt = '"Rp" #,##0'; cell.alignment = { horizontal: "right", vertical: "center" }; }
    if (colNumber === 6) cell.alignment = { wrapText: true, vertical: "center" };
  });
});

// Total row
const totalRowNum = items.length + 3;
const totalRow = ws.addRow(["TOTAL ANGGARAN", "", "", "", total, `Maks. Rp15.000.000`]);
ws.mergeCells(`A${totalRowNum}:D${totalRowNum}`);
totalRow.eachCell((cell) => {
  cell.font = { bold: true, size: 12 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F5E9" } };
  cell.border = {
    top: { style: "medium", color: { argb: "81C784" } },
    bottom: { style: "medium", color: { argb: "81C784" } },
    left: { style: "medium", color: { argb: "81C784" } },
    right: { style: "medium", color: { argb: "81C784" } },
  };
});
ws.getCell(`E${totalRowNum}`).numFmt = '"Rp" #,##0';
ws.getCell(`E${totalRowNum}`).alignment = { horizontal: "right", vertical: "center" };

ws.getColumn(1).width = 6;
ws.getColumn(2).width = 5;
ws.getColumn(3).width = 24;
ws.getColumn(4).width = 58;
ws.getColumn(5).width = 18;
ws.getColumn(6).width = 22;
ws.views = [{ state: "frozen", ySplit: 3 }];

// ===== SHEET 2: Ringkasan =====
const ws2 = wb.addWorksheet("Ringkasan", { properties: { tabColor: { argb: "1B5E20" } } });

ws2.mergeCells("A1:C1");
const sTitle = ws2.getCell("A1");
sTitle.value = "RINGKASAN RAB PRIMA+ OPSI 2026";
sTitle.font = { bold: true, color: { argb: "FFFFFF" }, size: 14 };
sTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1B5E20" } };
sTitle.alignment = { horizontal: "center", vertical: "center" };
ws2.getRow(1).height = 28;

const sHeaders = ["Jenis Pengeluaran", "Jumlah (Rp)", "Persentase"];
const sHeaderRow = ws2.addRow(sHeaders);
sHeaderRow.eachCell((cell) => {
  cell.font = { bold: true, color: { argb: "FFFFFF" } };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "2E7D32" } };
  cell.alignment = { horizontal: "center" };
  cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
});

const catNames = ["Biaya Alat dan Bahan", "Biaya Jasa", "Biaya Sewa", "Akomodasi dan Transportasi"];
const catTotals = catNames.map((cat) => items.filter((i) => i[2] === cat).reduce((s, i) => s + i[4], 0));

catNames.forEach((cat, i) => {
  const row = ws2.addRow([cat, catTotals[i], catTotals[i] / total]);
  row.getCell(1).font = { bold: true };
  row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8F5E9" } };
  row.getCell(2).numFmt = '"Rp" #,##0';
  row.getCell(3).numFmt = "0.0%";
  row.eachCell((cell) => {
    cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
  });
});

const sTotalRow = ws2.addRow(["TOTAL", total, 1]);
sTotalRow.eachCell((cell) => {
  cell.font = { bold: true, size: 11 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "C8E6C9" } };
  cell.border = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "medium" }, right: { style: "medium" } };
});
sTotalRow.getCell(2).numFmt = '"Rp" #,##0';
sTotalRow.getCell(3).numFmt = "0.0%";

ws2.addRow([]);
ws2.addRow(["Total RAB", total]).getCell(2).numFmt = '"Rp" #,##0';
ws2.addRow(["Batas maksimal OPSI", budgetLimit]).getCell(2).numFmt = '"Rp" #,##0';
ws2.addRow(["Sisa anggaran", budgetLimit - total]).getCell(2).numFmt = '"Rp" #,##0';
ws2.addRow(["Status", total <= budgetLimit ? "SESUAI BATAS" : "PERLU REVISI"]);

ws2.getColumn(1).width = 32;
ws2.getColumn(2).width = 20;
ws2.getColumn(3).width = 14;

await wb.xlsx.writeFile(outputPath);
console.log(`saved=${outputPath}`);
console.log(`total=Rp${total.toLocaleString("id-ID")}`);
console.log(`items=${items.length}`);
