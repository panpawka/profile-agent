import fs from "fs";
import path from "path";
import Mustache from "mustache";
import type { ProfileData } from "../types/profile";

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  preview: string;
  variables: Record<string, string>;
  features: Record<string, any>;
}

export interface Template {
  config: TemplateConfig;
  mainTemplate: string;
  partials: Record<string, string>;
}

export class TemplateEngine {
  private templatesDir: string;

  constructor() {
    this.templatesDir = path.join(__dirname, "../../templates");
  }

  /**
   * Load a template by ID
   * @param templateId Template identifier
   * @returns Template with config and content
   */
  loadTemplate(templateId: string): Template {
    const templateDir = path.join(this.templatesDir, templateId);

    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Load config
    const configPath = path.join(templateDir, "config.json");
    if (!fs.existsSync(configPath)) {
      throw new Error(`Template config not found: ${templateId}/config.json`);
    }
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Load main template
    const mainPath = path.join(templateDir, "main.mustache");
    if (!fs.existsSync(mainPath)) {
      throw new Error(
        `Template main file not found: ${templateId}/main.mustache`,
      );
    }
    const mainTemplate = fs.readFileSync(mainPath, "utf-8");

    // Load partials
    const partials: Record<string, string> = {};
    const partialsDir = path.join(templateDir, "partials");
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs.readdirSync(partialsDir);
      partialFiles.forEach((file) => {
        if (file.endsWith(".mustache")) {
          const partialName = file.replace(".mustache", "");
          const partialPath = path.join(partialsDir, file);
          partials[partialName] = fs.readFileSync(partialPath, "utf-8");
        }
      });
    }

    return {
      config,
      mainTemplate,
      partials,
    };
  }

  /**
   * Render a template with profile data
   * @param templateId Template identifier
   * @param profileData Profile data to render
   * @returns Rendered markdown string
   */
  async render(templateId: string, profileData: ProfileData): Promise<string> {
    const template = this.loadTemplate(templateId);

    // Prepare view data (merge profile data with template variables)
    const viewData = {
      ...profileData,
      ...template.config.variables,
    };

    // Render template with partials
    const rendered = Mustache.render(
      template.mainTemplate,
      viewData,
      template.partials,
    );

    return this.cleanRenderedOutput(rendered);
  }

  /**
   * List all available templates
   * @returns Array of template configs
   */
  listTemplates(): TemplateConfig[] {
    if (!fs.existsSync(this.templatesDir)) {
      return [];
    }

    const templateDirs = fs.readdirSync(this.templatesDir);
    const templates: TemplateConfig[] = [];

    templateDirs.forEach((dir) => {
      const configPath = path.join(this.templatesDir, dir, "config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        templates.push(config);
      }
    });

    return templates;
  }

  /**
   * Clean rendered markdown output
   * @param output Raw rendered output
   * @returns Cleaned markdown
   */
  private cleanRenderedOutput(output: string): string {
    return output
      .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
      .trim();
  }

  /**
   * Validate template structure
   * @param templateId Template identifier
   * @returns Validation result
   */
  validateTemplate(templateId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const template = this.loadTemplate(templateId);

      // Check required fields in config
      if (!template.config.id) errors.push("Missing config.id");
      if (!template.config.name) errors.push("Missing config.name");
      if (!template.config.version) errors.push("Missing config.version");

      // Check main template has required sections
      if (!template.mainTemplate.includes("{{name}}")) {
        errors.push("Main template missing {{name}} variable");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      errors.push(message);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
