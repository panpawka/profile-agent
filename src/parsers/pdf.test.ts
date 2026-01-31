import { describe, it, expect, vi, beforeEach } from "vitest";
import { PDFParser } from "./pdf";
import { PDFParse } from "pdf-parse";

vi.mock("pdf-parse");
vi.mock("fs");

describe("PDFParser", () => {
  let parser: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
    vi.clearAllMocks();
  });

  describe("parse", () => {
    it("should parse PDF and return text content", async () => {
      const mockGetText = vi.fn().mockResolvedValue({
        text: "John Doe\nSoftware Engineer\nExperience with TypeScript",
        total: 2,
      });
      const mockGetInfo = vi.fn().mockResolvedValue({
        info: { Title: "Resume" },
      });
      const mockDestroy = vi.fn().mockResolvedValue(undefined);

      (PDFParse as unknown as ReturnType<typeof vi.fn>).mockImplementation(
        () => ({
          getText: mockGetText,
          getInfo: mockGetInfo,
          destroy: mockDestroy,
        }),
      );

      const fs = await import("fs");
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from("mock pdf data"));

      const result = await parser.parse("/path/to/resume.pdf");

      expect(result.text).toContain("John Doe");
      expect(result.pages).toBe(2);
      expect(result.info).toEqual({ Title: "Resume" });
      expect(mockDestroy).toHaveBeenCalled();
    });

    it("should throw error if file not found", async () => {
      const fs = await import("fs");
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await expect(parser.parse("/nonexistent.pdf")).rejects.toThrow(
        "PDF file not found",
      );
    });

    it("should throw error if file is not PDF", async () => {
      const fs = await import("fs");
      vi.mocked(fs.existsSync).mockReturnValue(true);

      await expect(parser.parse("/file.txt")).rejects.toThrow(
        "File must be a PDF",
      );
    });
  });

  describe("extractEmails", () => {
    it("should extract email addresses from text", () => {
      const text = "Contact me at john@example.com or jane@company.org";
      const emails = parser.extractEmails(text);

      expect(emails).toHaveLength(2);
      expect(emails).toContain("john@example.com");
      expect(emails).toContain("jane@company.org");
    });

    it("should return empty array if no emails found", () => {
      const text = "No emails here";
      const emails = parser.extractEmails(text);

      expect(emails).toHaveLength(0);
    });
  });

  describe("extractPhones", () => {
    it("should extract phone numbers from text", () => {
      const text = "Call me at 555-123-4567 or (555) 987-6543";
      const phones = parser.extractPhones(text);

      expect(phones).toHaveLength(2);
    });
  });
});
