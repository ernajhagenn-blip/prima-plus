const fs = require('fs');
const PDFParser = require('pdf2json');
const parser = new PDFParser();

parser.on('pdfParser_dataError', err => console.error('Error:', err.parserError));
parser.on('pdfParser_dataReady', data => {
  let text = '';
  const pages = data.Pages || [];
  pages.forEach((page, pi) => {
    const texts = page.Texts || [];
    texts.forEach(t => {
      const decoded = decodeURIComponent(t.R?.[0]?.T || '');
      text += decoded + ' ';
    });
    text += '\n';
  });
  
  console.log('=== FULL TEXT (first 10000 chars) ===');
  console.log(text.substring(0, 10000));
});

const buf = fs.readFileSync('Panduan OPSI SMA Sederajat 2026.pdf');
parser.loadPDF(buf);
