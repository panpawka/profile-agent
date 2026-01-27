// Shared utilities for parsing files - reuses CLI logic
import { PDFParser } from '@cli/src/parsers/pdf';
import { DOCXParser } from '@cli/src/parsers/docx';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedFile {
  content: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'text';
}

/**
 * Parse PDF buffer
 */
async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
}

/**
 * Parse DOCX buffer
 */
async function parseDOCXBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .trim();
}

/**
 * Parse uploaded file buffer
 */
export async function parseFile(
  buffer: Buffer,
  fileName: string
): Promise<ParsedFile> {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      const pdfContent = await parsePDFBuffer(buffer);
      return { content: pdfContent, fileName, fileType: 'pdf' };

    case 'docx':
    case 'doc':
      const docxContent = await parseDOCXBuffer(buffer);
      return { content: docxContent, fileName, fileType: 'docx' };

    case 'txt':
      return {
        content: buffer.toString('utf-8'),
        fileName,
        fileType: 'text',
      };

    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

/**
 * Validate file size and type
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF, DOCX, and TXT files are allowed' };
  }

  return { valid: true };
}
