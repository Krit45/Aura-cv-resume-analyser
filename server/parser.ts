import * as pdfParseModule from 'pdf-parse';
import mammoth from 'mammoth';

const pdfParse = (pdfParseModule as any).default || pdfParseModule;

export async function extractTextFromBuffer(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  const isPdf = mimeType === 'application/pdf' || filename.toLowerCase().endsWith('.pdf');
  const isDocx = mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 mimeType === 'application/msword' || 
                 filename.toLowerCase().endsWith('.docx') || 
                 filename.toLowerCase().endsWith('.doc');

  if (isPdf) {
    try {
      const data = await pdfParse(buffer);
      if (data.text && data.text.trim().length > 20) {
        return data.text.trim();
      }
    } catch (e) {
      console.warn('pdf-parse failed, attempting fallback text extraction:', e);
    }
  }

  if (isDocx) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result.value && result.value.trim().length > 20) {
        return result.value.trim();
      }
    } catch (e) {
      console.warn('mammoth parsing failed:', e);
    }
  }

  // Fallback for raw text files or UTF-8 decode
  const rawText = buffer.toString('utf-8');
  if (rawText && rawText.trim().length > 10) {
    return rawText.trim();
  }

  throw new Error('Unable to extract readable text from uploaded file. Please paste your resume text directly or upload a valid PDF/DOCX file.');
}
