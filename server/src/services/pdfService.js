import pdfParse from 'pdf-parse';

/**
 * Extracts and sanitizes text from a PDF buffer.
 * Detects scanned/empty PDFs that contain no legible text.
 * @param {Buffer} buffer - The PDF file buffer.
 * @returns {Promise<{ text: string, numPages: number }>}
 */
export const extractTextFromPdf = async (buffer) => {
  if (!buffer || buffer.length === 0) {
    const error = new Error('PDF file is empty');
    error.statusCode = 400;
    throw error;
  }

  let data;
  try {
    data = await pdfParse(buffer);
  } catch (err) {
    const error = new Error(`Failed to parse PDF document: ${err.message}`);
    error.statusCode = 400;
    throw error;
  }

  const rawText = data.text || '';
  // Normalize whitespace: collapse multiple newlines and carriage returns
  const cleanedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Count alphanumeric characters to detect scanned or blank PDFs
  const alphanumericCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length;

  if (alphanumericCount < 40) {
    const error = new Error(
      'The uploaded PDF appears to be empty or contains scanned images with no extractable text. Please upload a text-selectable PDF resume.'
    );
    error.statusCode = 400;
    error.isScannedPdf = true;
    throw error;
  }

  return {
    text: cleanedText,
    numPages: data.numpages || 1
  };
};

/**
 * Safely truncates input strings to keep them within LLM token budget.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 15000) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '\n\n[...Resume text truncated for processing...]';
};

