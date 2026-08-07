import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/opsi_prima_rab";
const outputPath = `${outputDir}/RAB_PRIMA_OPSI_2026_Rinci.xlsx`;

const items = [
  ["Barang", "Kertas HVS A4 80 gsm (2 rim)", 112000],
  ["Barang", "Tinta printer hitam refill (1 botol)", 62500],
  ["Barang", "Tinta printer warna refill (1 botol)", 78500],
  ["Barang", "Map plastik/snelhecter untuk berkas responden (35 lembar)", 52500],
  ["Barang", "Label kode responden (2 pak)", 24000],
  ["Barang", "Pulpen untuk pengisian instrumen (2 lusin)", 48000],
  ["Barang", "Binder clip, staples, dan isolasi arsip (1 paket)", 35750],
  ["Barang", "Flashdisk 32 GB untuk cadangan data penelitian (1 unit)", 44850],
  ["Barang", "Materai Rp10.000 untuk berkas izin/validasi (4 lembar)", 40000],
  ["Barang", "Amplop cokelat arsip dokumen (10 lembar)", 18500],
  ["Jasa", "Fotokopi/cetak kuesioner pretest-posttest (60 set)", 210000],
  ["Jasa", "Cetak lembar validasi dan angket respons (40 set)", 137500],
  ["Jasa", "Cetak kartu skenario kasus bahasa PRIMA+ (30 set)", 185000],
  ["Jasa", "Jilid laporan proposal/lampiran (3 eksemplar)", 90000],
  ["Sewa/akses", "Paket data internet 25 GB untuk koordinasi dan uji coba (1 nomor)", 135000],
  ["Sewa", "Modem Wi-Fi portabel saat uji coba (1 hari)", 85000],
  ["Sewa", "Tripod HP untuk dokumentasi kegiatan (1 hari)", 45000],
  ["Lainnya", "Transport lokal ke sekolah, validator, dan percetakan (4 kali perjalanan)", 245000],
  ["Lainnya", "Konsumsi ringan validator dan siswa uji coba (35 paket)", 280000],
  ["Lainnya", "Air mineral gelas untuk kegiatan validasi/uji coba (2 dus)", 58000],
];

const proposalLimit = 2000000;
const reviewerNote = "Anggaran kurang realistis dan komponen belum rinci.";

await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const summary = workbook.worksheets.add("Ringkasan");
const detail = workbook.worksheets.add("RAB Rinci");
const reviewerSheet = workbook.worksheets.add("Catatan Reviewer");

for (const sheet of [summary, detail, reviewerSheet]) {
  sheet.showGridLines = false;
}

detail.getRange("A1:E1").merge();
detail.getRange("A1").values = [["Rancangan Anggaran Biaya PRIMA+ OPSI 2026"]];
detail.getRange("A1").format = {
  font: { bold: true, color: "#FFFFFF", size: 14 },
  fill: "#245B4F",
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
detail.getRange("A1").format.rowHeight = 28;

detail.getRange("A3:E3").values = [["No.", "Kategori", "Komponen Pengeluaran", "Jumlah (Rp)", "Catatan"]];
detail.getRange("A3:E3").format = {
  font: { bold: true, color: "#FFFFFF" },
  fill: "#386F63",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};

const detailRows = items.map((item, idx) => [
  idx + 1,
  item[0],
  item[1],
  item[2],
  item[2] <= proposalLimit ? "Rinci dan sesuai batas revisi <= Rp2.000.000" : "Perlu revisi",
]);
detail.getRange(`A4:E${items.length + 3}`).values = detailRows;
const totalRow = items.length + 4;
detail.getRange(`A${totalRow}:C${totalRow}`).merge();
detail.getRange(`A${totalRow}`).values = [["Total"]];
detail.getRange(`D${totalRow}`).formulas = [[`=SUM(D4:D${items.length + 3})`]];
detail.getRange(`E${totalRow}`).formulas = [[`=IF(D${totalRow}<=${proposalLimit},"Sesuai batas revisi < Rp2.000.000","Perlu cek total")`]];

detail.getRange(`A3:E${totalRow}`).format.borders = { preset: "all", style: "thin", color: "#D8DEE4" };
detail.getRange(`A4:A${totalRow}`).format.horizontalAlignment = "center";
detail.getRange(`D4:D${totalRow}`).format.numberFormat = '"Rp" #,##0';
detail.getRange(`D4:D${totalRow}`).format.horizontalAlignment = "right";
detail.getRange(`B4:C${totalRow}`).format.wrapText = true;
detail.getRange(`E4:E${totalRow}`).format.wrapText = true;
detail.getRange(`A${totalRow}:E${totalRow}`).format = {
  font: { bold: true },
  fill: "#E8F3EF",
  borders: { preset: "all", style: "thin", color: "#B9C8C2" },
};

detail.getRange("A:A").format.columnWidth = 7;
detail.getRange("B:B").format.columnWidth = 23;
detail.getRange("C:C").format.columnWidth = 62;
detail.getRange("D:D").format.columnWidth = 18;
detail.getRange("E:E").format.columnWidth = 34;
detail.freezePanes.freezeRows(3);
detail.tables.add(`A3:E${items.length + 3}`, true, "TabelRABPRIMA");

const categories = [...new Set(items.map((row) => row[0]))];
summary.getRange("A1:D1").merge();
summary.getRange("A1").values = [["Ringkasan RAB PRIMA+ OPSI 2026"]];
summary.getRange("A1").format = {
  font: { bold: true, color: "#FFFFFF", size: 14 },
  fill: "#245B4F",
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
summary.getRange("A1").format.rowHeight = 28;

summary.getRange("A3:B7").values = [
  ["Total RAB", null],
  ["Batas maksimal revisi", proposalLimit],
  ["Batas maksimal OPSI", 15000000],
  ["Jumlah item", items.length],
  ["Status", null],
];
summary.getRange("B3").formulas = [[`='RAB Rinci'!D${totalRow}`]];
summary.getRange("B7").formulas = [[`=IF(AND(B3<=B4,B3<>2000000),"Sesuai: rinci dan tidak bulat","Perlu revisi")`]];
summary.getRange("A3:B7").format.borders = { preset: "all", style: "thin", color: "#D8DEE4" };
summary.getRange("A3:A7").format = { font: { bold: true }, fill: "#E8F3EF" };
summary.getRange("B3:B5").format.numberFormat = '"Rp" #,##0';
summary.getRange("B6").format.numberFormat = "#,##0";

summary.getRange("A10:C10").values = [["Kategori", "Jumlah (Rp)", "Persentase"]];
summary.getRange("A10:C10").format = {
  font: { bold: true, color: "#FFFFFF" },
  fill: "#386F63",
  horizontalAlignment: "center",
};
const catRows = categories.map((category) => [category, null, null]);
summary.getRange(`A11:C${10 + categories.length}`).values = catRows;
for (let i = 0; i < categories.length; i++) {
  const row = 11 + i;
  summary.getRange(`B${row}`).formulas = [[`=SUMIF('RAB Rinci'!B4:B${items.length + 3},A${row},'RAB Rinci'!D4:D${items.length + 3})`]];
  summary.getRange(`C${row}`).formulas = [[`=B${row}/$B$3`]];
}
const catTotalRow = 11 + categories.length;
summary.getRange(`A${catTotalRow}:C${catTotalRow}`).values = [["Total", null, null]];
summary.getRange(`B${catTotalRow}`).formulas = [[`=SUM(B11:B${catTotalRow - 1})`]];
summary.getRange(`C${catTotalRow}`).formulas = [[`=SUM(C11:C${catTotalRow - 1})`]];
summary.getRange(`A10:C${catTotalRow}`).format.borders = { preset: "all", style: "thin", color: "#D8DEE4" };
summary.getRange(`A${catTotalRow}:C${catTotalRow}`).format = { font: { bold: true }, fill: "#E8F3EF" };
summary.getRange(`B11:B${catTotalRow}`).format.numberFormat = '"Rp" #,##0';
summary.getRange(`C11:C${catTotalRow}`).format.numberFormat = "0.0%";
summary.getRange("A:A").format.columnWidth = 28;
summary.getRange("B:B").format.columnWidth = 18;
summary.getRange("C:C").format.columnWidth = 14;
summary.freezePanes.freezeRows(10);

reviewerSheet.getRange("A1:E1").merge();
reviewerSheet.getRange("A1").values = [["Catatan Reviewer dan Penyesuaian RAB"]];
reviewerSheet.getRange("A1").format = {
  font: { bold: true, color: "#FFFFFF", size: 14 },
  fill: "#245B4F",
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
reviewerSheet.getRange("A1").format.rowHeight = 28;

reviewerSheet.getRange("A3:E3").values = [["No.", "Catatan Reviewer", "Perbaikan", "Letak Perbaikan", "Penjelasan"]];
reviewerSheet.getRange("A3:E3").format = {
  font: { bold: true, color: "#FFFFFF" },
  fill: "#386F63",
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
};
reviewerSheet.getRange("A4:E4").values = [[
  1,
  reviewerNote,
  "RAB direvisi menjadi Rp1.987.100, dibatasi di bawah Rp2.000.000, dan dipecah menjadi 20 item konkret barang, jasa, sewa, akses, dan lainnya.",
  "BAB 4.1 proposal, tabel revisi reviewer, dan workbook RAB.",
  "Komponen abstrak dihapus. RAB kini menyebut nama barang/sewa/jasa secara langsung, misalnya kertas HVS, tinta printer, jasa fotokopi, paket data internet, sewa modem, sewa tripod, transport lokal, konsumsi ringan, dan air mineral.",
]];
reviewerSheet.getRange("A3:E4").format.borders = { preset: "all", style: "thin", color: "#D8DEE4" };
reviewerSheet.getRange("A4:A4").format.horizontalAlignment = "center";
reviewerSheet.getRange("B4:E4").format.wrapText = true;
reviewerSheet.getRange("A7:B11").values = [
  ["Total RAB revisi", null],
  ["Batas maksimal revisi", proposalLimit],
  ["Sisa terhadap batas", null],
  ["Jumlah komponen", items.length],
  ["Status", null],
];
reviewerSheet.getRange("B7").formulas = [[`='RAB Rinci'!D${totalRow}`]];
reviewerSheet.getRange("B9").formulas = [["=B8-B7"]];
reviewerSheet.getRange("B11").formulas = [["=IF(AND(B7<=B8,B7<>2000000),\"Sesuai catatan reviewer\",\"Perlu revisi\")"]];
reviewerSheet.getRange("A7:B11").format.borders = { preset: "all", style: "thin", color: "#D8DEE4" };
reviewerSheet.getRange("A7:A11").format = { font: { bold: true }, fill: "#E8F3EF", wrapText: true };
reviewerSheet.getRange("B7:B9").format.numberFormat = '"Rp" #,##0';
reviewerSheet.getRange("A:A").format.columnWidth = 18;
reviewerSheet.getRange("B:B").format.columnWidth = 34;
reviewerSheet.getRange("C:C").format.columnWidth = 50;
reviewerSheet.getRange("D:D").format.columnWidth = 34;
reviewerSheet.getRange("E:E").format.columnWidth = 52;
reviewerSheet.freezePanes.freezeRows(3);
reviewerSheet.tables.add("A3:E4", true, "TabelCatatanReviewerRAB");

const inspectDetail = await workbook.inspect({
  kind: "table",
  sheetId: "RAB Rinci",
  range: `A3:E${totalRow}`,
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 6,
  maxChars: 6000,
});
console.log(inspectDetail.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({ sheetName: "RAB Rinci", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/preview_rab.png`, new Uint8Array(await preview.arrayBuffer()));
const previewReviewer = await workbook.render({ sheetName: "Catatan Reviewer", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(`${outputDir}/preview_reviewer_rab.png`, new Uint8Array(await previewReviewer.arrayBuffer()));

const inspectReviewer = await workbook.inspect({
  kind: "table",
  sheetId: "Catatan Reviewer",
  range: "A1:E11",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 5,
  maxChars: 5000,
});
console.log(inspectReviewer.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`saved=${outputPath}`);
