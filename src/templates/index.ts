import { TemplateEngine } from './loader';
import type { ProfileData } from '../types/profile';

export { TemplateEngine };

export class TemplateRenderer {
  private engine: TemplateEngine;

  constructor() {
    this.engine = new TemplateEngine();
  }

  /**
   * Render a README using a template
   * @param templateId Template identifier
   * @param profileData Profile data
   * @returns Rendered README markdown
   */
  async render(templateId: string, profileData: ProfileData): Promise<string> {
    return this.engine.render(templateId, profileData);
  }

  /**
   * List available templates
   * @returns Array of template configurations
   */
  listTemplates() {
    return this.engine.listTemplates();
  }

  /**
   * Get template information
   * @param templateId Template identifier
   * @returns Template configuration
   */
  getTemplateInfo(templateId: string) {
    const template = this.engine.loadTemplate(templateId);
    return template.config;
  }
}

