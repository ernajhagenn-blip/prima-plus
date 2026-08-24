const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const buf = fs.readFileSync('Panduan OPSI SMA Sederajat 2026.pdf');

async function main() {
  const parser = new PDFParse();
  const result = await parser.parseBuffer(buf);
  const text = result.text || '';
  
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    const l = line.trim();
    if (l.length > 5 && (/RAB|anggaran|biaya|Rincian|alat|Inovasi|Informatika|pembuatan|pengembangan/i.test(l))) {
      console.log(`L${i}: ${l}`);
    }
  });
  
  console.log('\n=== FULL TEXT (first 8000 chars) ===');
  console.log(text.substring(0, 8000));
}

main().catch(e => console.error(e));
