# ProfileAgent

> AI-powered GitHub Profile README generator

ProfileAgent is an open-source tool that transforms your professional context (CVs, GitHub repos, LinkedIn) into polished, auto-updating GitHub profile READMEs using cost-efficient AI models.

**🚀 Currently available as CLI • Web app coming soon!**

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

All 6 templates are now available:

- **minimal-dark**: Clean, professional dark theme with subtle gradients
- **minimal-light**: Bright, airy design for corporate environments
- **portfolio-grid**: Project-focused layout with visual cards
- **stats-heavy**: Emphasis on GitHub statistics and activity graphs
- **narrative**: Story-driven layout highlighting career journey
- **modern-visualist**: Contemporary design with bold visuals and animations

Use `profile-agent templates` to see all templates!

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

**Current Version**: v0.5.0 (Beta)

### ✅ Implemented (MVP - v0.1.0)

- ✅ CV/PDF parsing (PDF & DOCX support)
- ✅ GitHub repository scanning
- ✅ AI extraction with Gemini Flash & GPT-4o-mini
- ✅ 2 starter templates (minimal-dark, portfolio-grid)
- ✅ CLI-based generation and local output
- ✅ Basic README generation

### ✅ Implemented (Beta - v0.5.0)

- ✅ **LinkedIn PDF import** with structured extraction
- ✅ **6 professional templates** (minimal-dark, minimal-light, portfolio-grid, stats-heavy, narrative, modern-visualist)
- ✅ **GitHub OAuth integration** (Personal Access Token flow)
- ✅ **Direct GitHub push** to profile repository
- ✅ **GitHub Actions generation** for auto-updates
- ✅ **Interactive content editor** for profile data
- ✅ **Profile data editing** (CLI and file-based)
- ✅ **Templates list command**
- ✅ **Update command** for refreshing GitHub stats
- ✅ **Test coverage**: 15 tests passing across parsers, templates, and core logic

### 🚧 In Progress (v0.6.0 - Web App)

- 🔄 **Web application interface** - Moving from CLI to full web app
- 🔄 **Online profile generation** - No installation required
- 🔄 **Live template preview** - See changes in real-time
- 🔄 **User authentication** - Save and manage multiple profiles
- 🔄 **Template marketplace** - Browse and customize templates online

### 🔮 Future (v1.0.0+)

- Full REST API for integrations
- Community template marketplace
- One-click deploy to GitHub Pages
- Advanced analytics and insights
- Multi-language support
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
