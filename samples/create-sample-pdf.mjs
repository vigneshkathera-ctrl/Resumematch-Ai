import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read resume text
const resumeTextPath = path.join(__dirname, 'sample-resume.txt');
const resumeText = fs.readFileSync(resumeTextPath, 'utf-8');

/**
 * Minimal pure-Node script to generate a standard compliant PDF file
 * without external dependencies, so users can test immediately.
 */
function createSimplePdf(lines, outputPath) {
  const contentStreams = [];
  contentStreams.push('BT');
  contentStreams.push('/F1 10 Tf');
  contentStreams.push('12 TL');
  contentStreams.push('40 760 Td');

  for (const rawLine of lines) {
    const line = rawLine
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

    if (!line.trim()) {
      contentStreams.push('T*');
    } else if (line.toUpperCase() === line && line.length > 3) {
      contentStreams.push('/F2 12 Tf');
      contentStreams.push(`(${line}) Tj`);
      contentStreams.push('T*');
      contentStreams.push('/F1 9 Tf');
    } else {
      contentStreams.push(`(${line}) Tj`);
      contentStreams.push('T*');
    }
  }
  contentStreams.push('ET');

  const streamBody = contentStreams.join('\n');
  const streamLength = Buffer.byteLength(streamBody, 'utf-8');

  const pdfChunks = [];
  const offsets = [];

  function addChunk(str) {
    const buffer = Buffer.from(str, 'utf-8');
    offsets.push(pdfChunks.reduce((acc, c) => acc + c.length, 0));
    pdfChunks.push(buffer);
  }

  // Header
  pdfChunks.push(Buffer.from('%PDF-1.4\n', 'utf-8'));

  // Object 1: Catalog
  addChunk('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2: Pages
  addChunk('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');

  // Object 3: Page
  addChunk(
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n'
  );

  // Object 4: Content Stream
  addChunk(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamBody}\nendstream\nendobj\n`);

  // Object 5: Font Helvetica
  addChunk('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n');

  // Object 6: Font Helvetica-Bold
  addChunk('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n');

  // XRef
  const startXref = pdfChunks.reduce((acc, c) => acc + c.length, 0);
  let xref = `xref\n0 7\n0000000000 65535 f \n`;
  for (let i = 0; i < offsets.length; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;
  pdfChunks.push(Buffer.from(xref, 'utf-8'));

  const finalPdfBuffer = Buffer.concat(pdfChunks);
  fs.writeFileSync(outputPath, finalPdfBuffer);
  console.log(`[Sample PDF Generated] ${outputPath} (${finalPdfBuffer.length} bytes)`);
}

const lines = resumeText.split('\n').map((l) => l.trimEnd());
createSimplePdf(lines, path.join(__dirname, 'sample-resume.pdf'));

