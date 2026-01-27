import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TemplateEngine } from './loader';
import fs from 'fs';
import path from 'path';

vi.mock('fs');

describe('TemplateEngine', () => {
  let engine: TemplateEngine;

  beforeEach(() => {
    engine = new TemplateEngine();
    vi.clearAllMocks();
  });

  describe('loadTemplate', () => {
    it('should load template with config and partials', () => {
      const mockConfig = {
        id: 'test-template',
        name: 'Test Template',
        version: '1.0.0',
      };

      const mockMainTemplate = 'Hello {{name}}!';
      const mockPartial = 'Partial content';

      vi.mocked(fs.existsSync).mockImplementation((filePath) => {
        return true;
      });

      vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr.includes('config.json')) {
          return JSON.stringify(mockConfig);
        }
        if (pathStr.includes('main.mustache')) {
          return mockMainTemplate;
        }
        if (pathStr.includes('header.mustache')) {
          return mockPartial;
        }
        return '';
      });

      vi.mocked(fs.readdirSync).mockReturnValue(['header.mustache'] as any);

      const template = engine.loadTemplate('test-template');

      expect(template.config.id).toBe('test-template');
      expect(template.mainTemplate).toBe(mockMainTemplate);
      expect(template.partials).toHaveProperty('header');
    });

    it('should throw error if template not found', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      expect(() => engine.loadTemplate('nonexistent')).toThrow(
        'Template not found: nonexistent'
      );
    });
  });

  describe('listTemplates', () => {
    it('should return empty array if no templates exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const templates = engine.listTemplates();

      expect(templates).toEqual([]);
    });
  });

  describe('validateTemplate', () => {
    it('should validate template structure', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
        const pathStr = filePath.toString();
        if (pathStr.includes('config.json')) {
          return JSON.stringify({
            id: 'test',
            name: 'Test',
            version: '1.0.0',
          });
        }
        return '{{name}}';
      });
      vi.mocked(fs.readdirSync).mockReturnValue([] as any);

      const result = engine.validateTemplate('test');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
