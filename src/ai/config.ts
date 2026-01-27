import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import fs from 'fs';
import path from 'path';

export interface AIConfig {
  provider: 'gemini' | 'openai';
  apiKey?: string;
  model?: string;
}

export class AIProvider {
  private provider: 'gemini' | 'openai';
  private model: any;

  constructor(config: AIConfig) {
    this.provider = config.provider;

    if (config.provider === 'gemini') {
      const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not provided');
      }
      const google = createGoogleGenerativeAI({ apiKey });
      // Use Gemini 1.5 Flash for cost-efficient extraction
      this.model = google('gemini-1.5-flash');
    } else {
      const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not provided');
      }
      const openaiClient = createOpenAI({ apiKey });
      // Use GPT-4o-mini for better prose
      this.model = openaiClient('gpt-4o-mini');
    }
  }

  /**
   * Generate text using the configured AI model
   * @param prompt System prompt
   * @param userMessage User message
   * @param temperature Temperature setting (0-1)
   * @returns Generated text
   */
  async generate(
    prompt: string,
    userMessage: string,
    temperature: number = 0.3
  ): Promise<string> {
    try {
      const { text } = await generateText({
        model: this.model,
        system: prompt,
        prompt: userMessage,
        temperature,
        maxTokens: 2000,
      });

      return text;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`AI generation failed: ${message}`);
    }
  }

  /**
   * Generate JSON output from AI
   * @param prompt System prompt
   * @param userMessage User message
   * @returns Parsed JSON object
   */
  async generateJSON<T>(
    prompt: string,
    userMessage: string
  ): Promise<T> {
    const text = await this.generate(prompt, userMessage, 0.3);

    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      return JSON.parse(jsonText.trim());
    } catch (error) {
      throw new Error(`Failed to parse AI response as JSON: ${text.substring(0, 200)}`);
    }
  }

  /**
   * Load a prompt template from file
   * @param promptName Name of the prompt file (without .md extension)
   * @returns Prompt content
   */
  static loadPrompt(promptName: string): string {
    const promptPath = path.join(__dirname, 'prompts', `${promptName}.md`);
    
    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file not found: ${promptPath}`);
    }

    return fs.readFileSync(promptPath, 'utf-8');
  }
}
