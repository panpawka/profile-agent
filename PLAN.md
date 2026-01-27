# ProfileAgent Architecture

## Vision

An open-source tool where users provide "raw" context (CV, repo list, LinkedIn PDF, text blurbs), and an AI agent:

1. Extracts key achievements, tech stack, and career pivots.
2. Maps them to "Premium" GitHub README templates (themes).
3. Generates the `README.md`, `main.mustache`, and the GitHub Action script to keep it updated.

## Tech Stack (Proposed)

- **Engine:** Node.js / TypeScript
- **Templates:** Mustache / Handlebars
- **AI:** Gemini / OpenAI (via AI gateway + using the AI-SDK by vercel) - for the extraction of the context we should use cheap models, the same for the ganerations for the README etc, as we don't want to pay for the premium models as it will be open-source.
- **Deployment:** GitHub Actions

## Themes (V1)

- **The Architect:** Heavy on project tables and tech stack badges.
- **The Storyteller:** Narrative-driven, focus on career pivots.
- **The Minimalist:** Sharp, concise, and professional.

## Roadmap

- **Day 1:** Vision & Setup
- **Day 2:** The Template Parser (Mustache Integration)
- **Day 3:** AI Context Extractor (Parsing PDFs/Docs)
- **Day 4:** Theme System
- **Day 5:** GitHub Actions Generator
- **Day 6:** Landing Page / Demo
- **Day 7:** Public Launch on ProductHunt/X
