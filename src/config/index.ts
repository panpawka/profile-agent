import fs from 'fs';
import path from 'path';
import { ConfigSchema, ProfileAgentConfig } from './schema';

export class ConfigManager {
  private configPath: string;
  private config: ProfileAgentConfig | null = null;

  constructor() {
    this.configPath = path.join(process.cwd(), '.profile-agent', 'config.json');
  }

  load(): ProfileAgentConfig {
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Config file not found. Run "profile-agent init" first.');
    }
    const raw = fs.readFileSync(this.configPath, 'utf-8');
    const json = JSON.parse(raw);
    this.config = ConfigSchema.parse(json);
    return this.config;
  }

  get(): ProfileAgentConfig {
    if (!this.config) return this.load();
    return this.config;
  }
}
