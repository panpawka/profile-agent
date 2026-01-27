import path from 'path';
import { PDFParser, PDFParseResult } from './pdf';
import { DOCXParser, DOCXParseResult } from './docx';

export interface ParsedSource {
  type: 'cv' | 'linkedin' | 'text';
  content: string;
  metadata?: Record<string, any>;
}

export class ParserEngine {
  private pdfParser: PDFParser;
  private docxParser: DOCXParser;

  constructor() {
    this.pdfParser = new PDFParser();
    this.docxParser = new DOCXParser();
  }

  /**
   * Parse multiple files and return combined results
   * @param files Array of file paths to parse
   * @returns Array of parsed sources
   */
  async parse(files: string[]): Promise<ParsedSource[]> {
    const results: ParsedSource[] = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();

      try {
        if (ext === '.pdf') {
          const result = await this.pdfParser.parse(file);
          results.push({
            type: 'cv', // Assume PDFs are CVs for now
            content: result.text,
            metadata: {
              pages: result.pages,
              info: result.info,
            },
          });
        } else if (ext === '.docx') {
          const result = await this.docxParser.parse(file);
          results.push({
            type: 'cv',
            content: result.text,
          });
        } else {
          throw new Error(`Unsupported file type: ${ext}`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to parse ${file}: ${message}`);
      }
    }

    return results;
  }

  /**
   * Parse a single file
   * @param filePath Path to the file
   * @returns Parsed source
   */
  async parseFile(filePath: string): Promise<ParsedSource> {
    const results = await this.parse([filePath]);
    return results[0];
  }
}

export { PDFParser, DOCXParser };
