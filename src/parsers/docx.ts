import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

export interface DOCXParseResult {
  text: string;
  html?: string;
}

export class DOCXParser {
  /**
   * Parse a DOCX file and extract text content
   * @param filePath Path to the DOCX file
   * @returns Parsed text content
   */
  async parse(filePath: string): Promise<DOCXParseResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`DOCX file not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.docx') {
      throw new Error(`File must be a DOCX. Received: ${ext}`);
    }

    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }

    return {
      text: this.cleanText(result.value),
    };
  }

  /**
   * Parse DOCX and extract HTML (preserves formatting)
   * @param filePath Path to the DOCX file
   * @returns HTML content
   */
  async parseToHTML(filePath: string): Promise<DOCXParseResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`DOCX file not found: ${filePath}`);
    }

    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.convertToHtml({ buffer });

    return {
      text: this.cleanText(result.value),
      html: result.value,
    };
  }

  /**
   * Clean and normalize extracted text
   * @param text Raw text from DOCX
   * @returns Cleaned text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/<[^>]*>/g, '') // Remove HTML tags if present
      .trim();
  }
}
