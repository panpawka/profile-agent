import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export interface PDFParseResult {
  text: string;
  pages: number;
  info?: Record<string, any>;
}

export class PDFParser {
  /**
   * Parse a PDF file and extract text content
   * @param filePath Path to the PDF file
   * @returns Parsed text content and metadata
   */
  async parse(filePath: string): Promise<PDFParseResult> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.pdf') {
      throw new Error(`File must be a PDF. Received: ${ext}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      text: this.cleanText(data.text),
      pages: data.numpages,
      info: data.info,
    };
  }

  /**
   * Clean and normalize extracted text
   * @param text Raw text from PDF
   * @returns Cleaned text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();
  }

  /**
   * Extract potential email addresses from text
   * @param text Text to search
   * @returns Array of email addresses found
   */
  extractEmails(text: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return text.match(emailRegex) || [];
  }

  /**
   * Extract potential phone numbers from text
   * @param text Text to search
   * @returns Array of phone numbers found
   */
  extractPhones(text: string): string[] {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    return text.match(phoneRegex) || [];
  }
}
