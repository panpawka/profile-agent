// Template utilities for web app
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import type { ProfileData, Skill } from '@cli/src/types/profile';
import { getTechColor, getTechLogo } from './tech-database';

/**
 * Encodes a string for shields.io badge labels
 */
function encodeShieldsLabel(text: string): string {
  if (!text) return '';

  return text
    // 1. Double up dashes first (Shields.io syntax)
    .replace(/-/g, '--') 
    // 2. Replace spaces with underscores
    .replace(/ /g, '_')
    // 3. URL encode special chars (like # to %23, + to %2B)
    .replace(/[^\w\s\-\_]/g, (char) => encodeURIComponent(char));
}

/**
 * Ensures a skill has all required badge fields
 */
function ensureSkillBadgeFields(skill: Skill): Skill {
  return {
    ...skill,
    encoded: skill.encoded || encodeShieldsLabel(skill.name),
    color: skill.color || getTechColor(skill.name),
    logo: skill.logo || getTechLogo(skill.name),
  };
}

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
    // For web app, templates are in the parent directory
    this.templatesDir = path.join(process.cwd(), '..', 'templates');
  }

  /**
   * Load a template by ID
   */
  loadTemplate(templateId: string): Template {
    const templateDir = path.join(this.templatesDir, templateId);

    if (!fs.existsSync(templateDir)) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Load config
    const configPath = path.join(templateDir, 'config.json');
    if (!fs.existsSync(configPath)) {
      throw new Error(`Template config not found: ${templateId}/config.json`);
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    // Load main template
    const mainPath = path.join(templateDir, 'main.mustache');
    if (!fs.existsSync(mainPath)) {
      throw new Error(`Template main file not found: ${templateId}/main.mustache`);
    }
    const mainTemplate = fs.readFileSync(mainPath, 'utf-8');

    // Load partials
    const partials: Record<string, string> = {};
    const partialsDir = path.join(templateDir, 'partials');
    if (fs.existsSync(partialsDir)) {
      const partialFiles = fs.readdirSync(partialsDir);
      partialFiles.forEach((file) => {
        if (file.endsWith('.mustache')) {
          const partialName = file.replace('.mustache', '');
          const partialPath = path.join(partialsDir, file);
          partials[partialName] = fs.readFileSync(partialPath, 'utf-8');
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
   */
  async render(templateId: string, profileData: ProfileData): Promise<string> {
    const template = this.loadTemplate(templateId);

    // Ensure all skills have badge fields
    const enrichedProfileData = {
      ...profileData,
      skills: profileData.skills?.map(category => ({
        ...category,
        skills: category.skills.map(ensureSkillBadgeFields)
      })) || []
    };

    // Prepare view data
    const viewData = {
      ...enrichedProfileData,
      ...template.config.variables,
    };

    // Render template with partials
    const rendered = Mustache.render(
      template.mainTemplate,
      viewData,
      template.partials
    );

    return this.cleanRenderedOutput(rendered);
  }

  /**
   * List all available templates
   */
  listTemplates(): TemplateConfig[] {
    if (!fs.existsSync(this.templatesDir)) {
      console.error('Templates directory not found:', this.templatesDir);
      return [];
    }

    const templateDirs = fs.readdirSync(this.templatesDir);
    const templates: TemplateConfig[] = [];

    templateDirs.forEach((dir) => {
      const configPath = path.join(this.templatesDir, dir, 'config.json');
      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          templates.push(config);
        } catch (error) {
          console.error(`Failed to load template ${dir}:`, error);
        }
      }
    });

    return templates;
  }

  /**
   * Clean rendered markdown output
   */
  private cleanRenderedOutput(output: string): string {
    return output
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .trim();
  }
}
