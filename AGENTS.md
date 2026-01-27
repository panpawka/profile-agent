# AGENTS.md - ProfileAgent Development Guide

Project-specific coding guidelines and conventions for the ProfileAgent repository.

---

## Build, Test & Development Commands

### Build
```bash
npm run build          # Compile TypeScript to dist/
```

### Run & Development
```bash
npm run dev           # Run with ts-node (development)
npm start             # Run compiled CLI (production)
```

### Testing
```bash
npm test              # Run all Vitest tests
npm test -- path/to/file.test.ts  # Run single test file
npm test -- --watch   # Watch mode
npm test -- --coverage # Generate coverage report
```

### CLI Commands (Once Built)
```bash
./dist/cli/index.js init          # Initialize ProfileAgent
./dist/cli/index.js add --cv <path>  # Add context sources
./dist/cli/index.js extract       # Run AI extraction
./dist/cli/index.js generate      # Generate README
```

---

## Code Style & Conventions

### Imports
- Use **named imports** for clarity: `import { ConfigManager } from './config'`
- Order: Node built-ins → External packages → Internal modules
- Use `import type` for type-only imports when appropriate

**Example:**
```typescript
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ConfigManager } from './config';
import type { ProfileData } from './types/profile';
```

### TypeScript Configuration
- **Strict mode enabled** - all strict checks are enforced
- **Target:** ES2020, **Module:** CommonJS
- **No implicit any** - always type your variables and parameters
- Use `z.infer<typeof Schema>` for deriving types from Zod schemas

### Naming Conventions
- **Classes:** PascalCase (e.g., `ConfigManager`, `AIExtractor`)
- **Functions/Variables:** camelCase (e.g., `initCommand`, `configPath`)
- **Types/Interfaces:** PascalCase (e.g., `ProfileData`, `SkillCategory`)
- **Constants:** camelCase or UPPER_SNAKE_CASE for true constants
- **Files:** kebab-case for multi-word files (e.g., `init.ts`)

### File Organization
```
src/
  ├── ai/           # AI/LLM integrations
  ├── cli/          # CLI commands and entry points
  │   └── commands/ # Individual command implementations
  ├── config/       # Configuration management
  ├── github/       # GitHub API integrations
  ├── parsers/      # Document parsers (PDF, DOCX)
  ├── templates/    # Mustache template engine
  └── types/        # Shared TypeScript types
```

### Class Structure
- Use **class-based architecture** for core modules
- Keep constructors minimal - prefer lazy initialization
- Public methods first, then private/protected methods
- Example pattern:

```typescript
export class ServiceName {
  private configPath: string;
  private data: SomeType | null = null;

  constructor() {
    this.configPath = path.join(process.cwd(), 'config');
  }

  public async mainMethod(): Promise<ReturnType> {
    // Implementation
  }

  private helperMethod(): void {
    // Implementation
  }
}
```

### Error Handling
- **Throw meaningful errors** with context:
  ```typescript
  throw new Error('Config file not found. Run "profile-agent init" first.');
  ```
- Use try-catch for async operations that may fail
- Validate inputs with **Zod schemas** before processing
- For CLI: Use `chalk.red()` for error messages

### Types & Validation
- Define schemas in `src/types/` or alongside modules
- Use **Zod** for runtime validation (see `src/config/schema.ts`)
- Export both schema and inferred type:
  ```typescript
  export const ConfigSchema = z.object({ ... });
  export type ProfileAgentConfig = z.infer<typeof ConfigSchema>;
  ```
- Prefer interfaces for pure TypeScript types
- Use optional chaining and nullish coalescing (`?.` and `??`)

### Async/Await
- Always use `async/await` over raw promises
- Return promises explicitly typed: `async function foo(): Promise<Type>`
- Handle errors appropriately in async functions

### CLI Output
- Use **chalk** for colored terminal output:
  - `chalk.blue()` - Info messages
  - `chalk.green()` - Success messages
  - `chalk.yellow()` - Warnings
  - `chalk.red()` - Errors
- Use `console.log()` for user-facing output
- Keep messages concise and actionable

### Comments & Documentation
- Use JSDoc comments for public APIs and complex logic
- Prefer self-documenting code over comments
- Comment "why", not "what"
- Document non-obvious behavior or edge cases

---

## Project-Specific Patterns

### Configuration Management
- Config lives in `.profile-agent/config.json`
- Use `ConfigManager` class to load/access config
- Validate with `ConfigSchema` on load
- Check config existence before operations

### Path Handling
- Always use `path.join()` for file paths
- Use `process.cwd()` for current working directory
- Prefer absolute paths over relative paths

### JSON Files
- Pretty-print with 2-space indentation: `JSON.stringify(data, null, 2)`
- Validate JSON structure with Zod schemas

### GitHub Integration
- Use `octokit` package for GitHub API calls
- Store tokens in config, never in code
- Handle rate limiting gracefully

### AI Provider Abstraction
- Support multiple providers (Gemini, OpenAI)
- Use `ai` SDK from Vercel for unified interface
- Keep provider logic in `src/ai/`

---

## Testing Guidelines

- Place tests adjacent to source files: `module.test.ts`
- Use **Vitest** for all testing
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies (file system, APIs)
- Test error cases and edge conditions

**Example Test Structure:**
```typescript
import { describe, it, expect } from 'vitest';
import { ConfigManager } from './config';

describe('ConfigManager', () => {
  it('should throw error when config not found', () => {
    const manager = new ConfigManager();
    expect(() => manager.load()).toThrow('Config file not found');
  });
});
```

---

## Git & Commits

- Write clear, descriptive commit messages
- Use conventional commits format: `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- Keep commits atomic - one logical change per commit
- Reference issues in commits when applicable

---

## Dependencies

### Core Dependencies
- **commander** - CLI framework
- **inquirer** - Interactive prompts
- **chalk** - Terminal colors
- **zod** - Schema validation
- **ai** - Vercel AI SDK for LLM interactions
- **octokit** - GitHub API client
- **mustache** - Template rendering
- **dotenv** - Environment variables
- **mammoth** - DOCX parsing
- **pdf-parse** - PDF parsing

### Development Dependencies
- **typescript** - TypeScript compiler
- **ts-node** - TypeScript execution
- **vitest** - Testing framework

---

## Environment Variables

Store in `.env` file (never commit):
```bash
GITHUB_TOKEN=ghp_...
GEMINI_API_KEY=...
OPENAI_API_KEY=...
```

Access with `process.env.VAR_NAME` after `dotenv.config()`

---

## Common Tasks

### Adding a New CLI Command
1. Create file in `src/cli/commands/command-name.ts`
2. Export async command function
3. Register in `src/cli/index.ts` with `.command()` and `.action()`

### Adding a New Type
1. Define in `src/types/` directory
2. Export interface or type
3. Consider Zod schema if runtime validation needed

### Adding AI Provider
1. Add to `aiProvider` enum in `src/config/schema.ts`
2. Implement provider logic in `src/ai/`
3. Update documentation

---

## Code Reference Format

When discussing code, reference with `file:line` format:
- Example: `src/config/index.ts:14` (config load function)
- Example: `src/types/profile.ts:1-20` (ProfileData interface)

---

## Notes for AI Agents

- This is a **CLI tool** - user experience matters!
- Validate all user input before processing
- Provide helpful error messages with next steps
- Keep the CLI fast - lazy-load heavy dependencies
- Test file system operations carefully
- Remember: users may not have all config/tokens set up yet
