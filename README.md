# ProfileAgent

> AI-powered GitHub Profile README generator

ProfileAgent is an open-source CLI tool that transforms your professional context (CVs, GitHub repos, LinkedIn) into polished, auto-updating GitHub profile READMEs using cost-efficient AI models.

## Features

- 📄 **Smart Parsing**: Extract content from CVs (PDF/DOCX) and LinkedIn exports
- 🤖 **AI-Powered Extraction**: Use Gemini Flash or GPT-4o-mini to identify skills, achievements, and career narratives
- 🎨 **Beautiful Templates**: Choose from professionally designed themes
- 🔄 **Easy Customization**: Review and edit all AI-generated content before publishing
- ⚡ **Cost-Efficient**: ~$0.001 per profile generation

## Installation

```bash
npm install -g profile-agent
```

## Quick Start

### 1. Initialize

```bash
profile-agent init
```

This creates a `.profile-agent/` directory in your current folder.

### 2. Add Sources

Add your CV, LinkedIn export, or connect GitHub:

```bash
# Add CV (PDF or DOCX)
profile-agent add --cv ./resume.pdf

# Add LinkedIn export
profile-agent add --linkedin ./linkedin-export.pdf

# Connect GitHub account (requires GITHUB_TOKEN env var)
profile-agent add --github

# Add custom text
profile-agent add --text "I'm passionate about open source..."
```

### 3. Extract Profile Data

Run AI extraction on your sources:

```bash
# Set your AI provider API key
export GEMINI_API_KEY=your_key_here
# or
export OPENAI_API_KEY=your_key_here

# Run extraction
profile-agent extract
```

This generates `.profile-agent/profile-data.json` with extracted skills, achievements, bio, and projects.

### 4. Generate README

```bash
# Generate with default template (minimal-dark)
profile-agent generate

# Or choose a specific theme
profile-agent generate --theme portfolio-grid

# Preview without saving
profile-agent generate --preview
```

Your `README.md` is now ready! 🎉

## Available Templates

- **minimal-dark**: Clean, professional dark theme with subtle gradients
- **portfolio-grid**: Project-focused layout with visual cards

More templates coming soon!

## Configuration

The `.profile-agent/config.json` file stores your preferences:

```json
{
  "aiProvider": "gemini",
  "defaultTemplate": "minimal-dark",
  "updateFrequency": "weekly",
  "includeEmail": false,
  "includeLocation": true
}
```

## Environment Variables

```bash
GITHUB_TOKEN=ghp_...          # GitHub personal access token
GEMINI_API_KEY=...            # Google Gemini API key
OPENAI_API_KEY=...            # OpenAI API key
```

## Development

```bash
# Clone the repository
git clone https://github.com/profileagent/profileagent.git
cd profileagent

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## Architecture

```
src/
  ├── ai/             # AI extraction engine & prompts
  ├── cli/            # CLI commands
  ├── config/         # Configuration management
  ├── github/         # GitHub API client
  ├── parsers/        # PDF/DOCX parsers
  ├── templates/      # Template engine & renderer
  └── types/          # TypeScript types

templates/            # Mustache templates
  ├── minimal-dark/
  └── portfolio-grid/
```

## Project Status

**Current Version**: v0.1.0 (MVP)

### ✅ Implemented (MVP)

- ✅ CV/PDF parsing
- ✅ GitHub repository scanning
- ✅ AI extraction with Gemini Flash
- ✅ 2 starter templates (minimal-dark, portfolio-grid)
- ✅ CLI-based generation and local output
- ✅ Basic README generation

### 🚧 Coming Next (Beta - v0.5.0)

- LinkedIn PDF import
- GitHub OAuth integration
- Direct GitHub push
- GitHub Actions generation
- Interactive content editor
- All 5 V1 templates

### 🔮 Future (v1.0.0)

- Full programmatic API
- Template preview system
- Community template guidelines
- Test coverage >80%

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT © ProfileAgent Team

## Acknowledgments

- Built with [Vercel AI SDK](https://sdk.vercel.ai)
- Powered by Google Gemini and OpenAI
- Templates inspired by awesome GitHub profiles

---

<div align="center">
Made with ❤️ by the ProfileAgent team
</div>
