# ProfileAgent API Documentation

> Programmatic interface for generating GitHub profile READMEs

## Installation

```bash
npm install profile-agent
```

## Quick Start

```typescript
import { ProfileAgent } from 'profile-agent';

const agent = new ProfileAgent({
  aiProvider: 'gemini',
  aiApiKey: process.env.GEMINI_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
});

// Add data sources
await agent.addSource({ type: 'cv', path: './resume.pdf' });
await agent.addSource({ type: 'github', username: 'johndoe' });

// Extract profile data with AI
const profileData = await agent.extract();

// Edit if needed
profileData.bio = "Custom bio here";

// Generate README
const readme = await agent.generate({ templateId: 'minimal-dark' });

console.log(readme);
```

## API Reference

### ProfileAgent Class

#### Constructor

```typescript
new ProfileAgent(config: ProfileAgentConfig)
```

**Parameters:**

- `config.aiProvider` - AI provider: `'gemini'` or `'openai'`
- `config.aiApiKey` - API key for AI provider
- `config.githubToken` - GitHub personal access token (optional)
- `config.defaultTemplate` - Default template ID (optional)

**Example:**

```typescript
const agent = new ProfileAgent({
  aiProvider: 'gemini',
  aiApiKey: 'your-api-key',
  githubToken: 'ghp_...',
  defaultTemplate: 'minimal-dark',
});
```

#### addSource()

Add a data source for profile generation.

```typescript
await agent.addSource(source: SourceInput): Promise<void>
```

**Source Types:**

```typescript
// CV/Resume (PDF or DOCX)
await agent.addSource({
  type: 'cv',
  path: './resume.pdf'
});

// LinkedIn Export (PDF)
await agent.addSource({
  type: 'linkedin',
  path: './linkedin.pdf'
});

// GitHub Profile
await agent.addSource({
  type: 'github',
  username: 'johndoe'  // Optional if token provided
});

// Custom Text
await agent.addSource({
  type: 'text',
  content: "I'm passionate about open source..."
});
```

#### extract()

Extract and structure profile data using AI.

```typescript
await agent.extract(): Promise<ProfileData>
```

**Returns:** `ProfileData` object containing:
- Personal info (name, bio, headline)
- Skills (categorized by type)
- Achievements (with metrics)
- Projects (from GitHub)
- GitHub stats

**Example:**

```typescript
const profileData = await agent.extract();

console.log(profileData.bio);
console.log(profileData.skills.length);
console.log(profileData.achievements);
```

#### generate()

Generate README markdown from profile data.

```typescript
await agent.generate(options?: GenerateOptions): Promise<string>
```

**Options:**
- `templateId` - Template to use (optional, defaults to config)
- `outputPath` - File path to write README (optional)

**Example:**

```typescript
// Generate with default template
const readme = await agent.generate();

// Generate with specific template
const readme = await agent.generate({
  templateId: 'portfolio-grid'
});

// Generate and save to file
const readme = await agent.generate({
  templateId: 'minimal-dark',
  outputPath: './README.md'
});
```

#### saveProfile()

Save profile data to JSON file.

```typescript
agent.saveProfile(data: ProfileData, outputPath?: string): void
```

**Example:**

```typescript
const profileData = await agent.extract();
agent.saveProfile(profileData, './profile-data.json');
```

#### loadProfile()

Load profile data from JSON file.

```typescript
agent.loadProfile(inputPath: string): ProfileData
```

**Example:**

```typescript
const profileData = agent.loadProfile('./profile-data.json');
```

#### listTemplates()

Get list of available templates.

```typescript
agent.listTemplates(): TemplateConfig[]
```

**Example:**

```typescript
const templates = agent.listTemplates();

templates.forEach(template => {
  console.log(`${template.name}: ${template.description}`);
});
```

#### getProfileData()

Get currently loaded profile data.

```typescript
agent.getProfileData(): ProfileData | undefined
```

## Types

### ProfileData

```typescript
interface ProfileData {
  version: string;
  generatedAt: string;
  lastEditedAt?: string;
  
  name: string;
  headline: string;
  bio: string;
  location?: string;
  email?: string;
  
  skills: SkillCategory[];
  achievements: Achievement[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  
  socialLinks: SocialLink[];
  githubStats: GitHubStats;
  
  templateId: string;
  templateConfig?: Record<string, any>;
}
```

### SkillCategory

```typescript
interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;
}
```

### Achievement

```typescript
interface Achievement {
  id: string;
  text: string;
  source: 'cv' | 'linkedin' | 'github' | 'manual';
  metrics?: string[];
  isHighlighted: boolean;
}
```

### Project

```typescript
interface Project {
  name: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies: string[];
  stars?: number;
  isFeatured: boolean;
}
```

## Advanced Usage

### Editing Profile Data

```typescript
const agent = new ProfileAgent(config);

await agent.addSource({ type: 'cv', path: './resume.pdf' });
const profileData = await agent.extract();

// Edit bio
profileData.bio = "Custom professional summary";

// Highlight specific achievements
profileData.achievements[0].isHighlighted = true;

// Feature specific projects
profileData.projects.forEach(p => {
  p.isFeatured = p.stars! > 100;
});

// Save changes
agent.saveProfile(profileData);

// Generate with edited data
const readme = await agent.generate();
```

### Multiple Templates

```typescript
const agent = new ProfileAgent(config);
const profileData = await agent.extract();

// Generate multiple versions
const minimal = await agent.generate({ templateId: 'minimal-dark' });
const portfolio = await agent.generate({ templateId: 'portfolio-grid' });
const stats = await agent.generate({ templateId: 'stats-heavy' });

// Save each version
fs.writeFileSync('./README-minimal.md', minimal);
fs.writeFileSync('./README-portfolio.md', portfolio);
fs.writeFileSync('./README-stats.md', stats);
```

### Error Handling

```typescript
try {
  const agent = new ProfileAgent(config);
  await agent.addSource({ type: 'cv', path: './resume.pdf' });
  const profileData = await agent.extract();
  const readme = await agent.generate();
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('File not found');
  } else if (error.message.includes('API key')) {
    console.error('Invalid API key');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Examples

See the [examples/](./examples/) directory for:
- Basic usage
- Batch processing
- Custom templates
- CI/CD integration
- Error handling patterns

## Support

- [GitHub Issues](https://github.com/profileagent/profileagent/issues)
- [Documentation](https://profileagent.dev/docs)
- [Discord Community](https://discord.gg/profileagent)
