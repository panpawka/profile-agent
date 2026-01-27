# ProfileAgent — Product Requirements Document

> **AI-Powered GitHub Profile README Generator**

---

| Field | Value |
|-------|-------|
| **Version** | 1.0 (Draft) |
| **Date** | January 26, 2026 |
| **Author** | Pawel (Product Owner) |
| **Status** | Draft — Ready for Review |
| **License** | MIT (Open Source) |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [User Personas](#4-user-personas)
5. [User Flows](#5-user-flows)
6. [Functional Requirements](#6-functional-requirements)
7. [Technical Architecture](#7-technical-architecture)
8. [Data Models](#8-data-models)
9. [Template System](#9-template-system)
10. [AI Processing Pipeline](#10-ai-processing-pipeline)
11. [GitHub Integration](#11-github-integration)
12. [Project Structure](#12-project-structure)
13. [CLI & API Design](#13-cli--api-design)
14. [Security & Privacy](#14-security--privacy)
15. [Release Plan](#15-release-plan)
16. [Success Metrics](#16-success-metrics)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Executive Summary

### Vision Statement

> Enable every developer to have a professional, automatically-maintained GitHub profile that accurately represents their skills, achievements, and career journey—without requiring design skills or manual maintenance.

### What is ProfileAgent?

ProfileAgent is an open-source CLI tool and library that transforms raw professional context (CVs, LinkedIn exports, GitHub repositories, text blurbs) into polished, auto-updating GitHub profile READMEs. Using cost-efficient AI models, it:

1. **Extracts** key achievements, tech stacks, and career pivots from user-provided context
2. **Maps** extracted data to premium Mustache templates (themes)
3. **Generates** `README.md`, `main.mustache`, and GitHub Action scripts for automatic updates

### Key Value Propositions

| Value | Description |
|-------|-------------|
| **Zero-effort maintenance** | GitHub Actions automatically update your profile as your repositories evolve |
| **AI-powered intelligence** | Extracts meaningful achievements and career narratives from raw data |
| **Premium templates** | Professional designs that stand out from generic GitHub profiles |
| **Content control** | Review and edit all extracted content before publishing |
| **Cost-efficient** | Uses affordable AI models (Gemini Flash, GPT-4o-mini) — ~$0.001 per generation |

---

## 2. Problem Statement

### Current Pain Points

#### Time Investment
- Creating a polished README requires **2-4 hours** of initial setup
- Manual updates are tedious and often neglected
- Profile information quickly becomes stale and outdated

#### Design Skills Gap
- Most developers lack design expertise for visually appealing layouts
- Existing templates require significant customization knowledge
- Balancing aesthetics with information density is challenging

#### Content Quality
- Difficulty articulating achievements in compelling ways
- Inconsistent presentation of skills and experience
- Missing context about career pivots and growth trajectory

### Market Gap

While README generators exist, they typically offer only basic stat widgets or require extensive manual configuration. **No existing solution combines:**
- AI-powered content extraction
- Premium template design
- User content editing/approval
- Automated maintenance via GitHub Actions

---

## 3. Solution Overview

### Core Workflow (3 Phases)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   PHASE 1: INGESTION          PHASE 2: EXTRACTION        PHASE 3: GENERATION
│   ─────────────────          ─────────────────────       ─────────────────────
│                                                                         │
│   ┌─────────────┐            ┌─────────────────┐        ┌─────────────┐│
│   │ CV (PDF)    │───┐        │                 │        │ README.md   ││
│   └─────────────┘   │        │   AI Engine     │        └─────────────┘│
│   ┌─────────────┐   │        │   ───────────   │        ┌─────────────┐│
│   │ LinkedIn    │───┼───────▶│ • Skills        │───────▶│ main.mustache│
│   │ (PDF)       │   │        │ • Achievements  │  USER  └─────────────┘│
│   └─────────────┘   │        │ • Career Pivots │ REVIEW ┌─────────────┐│
│   ┌─────────────┐   │        │ • Bio           │   &    │ profile-    ││
│   │ GitHub      │───┤        │ • Projects      │  EDIT  │ data.json   ││
│   │ (API)       │   │        │                 │        └─────────────┘│
│   └─────────────┘   │        └─────────────────┘        ┌─────────────┐│
│   ┌─────────────┐   │                                   │ GitHub      ││
│   │ Text Blurbs │───┘                                   │ Action      ││
│   └─────────────┘                                       └─────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Phase Details

| Phase | Name | Description |
|-------|------|-------------|
| 1 | **Ingestion** | Parse and normalize raw inputs (CV PDF, LinkedIn PDF export, GitHub API, custom text) |
| 2 | **Extraction** | AI-powered analysis to identify skills, achievements, and career narrative |
| 3 | **Generation** | User reviews/edits extracted data → selects template → generates outputs |

### Output Artifacts

For each profile generation, ProfileAgent produces:

1. **`README.md`** — The compiled, ready-to-use profile README
2. **`main.mustache`** — The selected template with user data bindings
3. **`profile-data.json`** — Extracted and structured profile data (user can edit this)
4. **`update-profile.yml`** — GitHub Action workflow for auto-updates

---

## 4. User Personas

### Persona 1: Junior Developer (Sarah)

| Attribute | Details |
|-----------|---------|
| **Background** | Recent bootcamp graduate seeking first developer role |
| **Pain Points** | Wants to stand out among other job seekers; has limited professional experience to showcase; needs help articulating project achievements |
| **Goals** | Transform bootcamp projects into impressive portfolio items; highlight learning velocity and growth mindset; auto-update as she builds more projects |

### Persona 2: Career Pivoter (Marcus)

| Attribute | Details |
|-----------|---------|
| **Background** | 10-year finance professional transitioning to software development |
| **Pain Points** | Needs to reframe non-tech experience as relevant; has completed multiple certifications and courses; wants to demonstrate serious commitment to new career |
| **Goals** | Map transferable skills from finance to tech; showcase certifications and learning path; present career pivot as a strength, not a gap |

### Persona 3: Senior Engineer (Priya)

| Attribute | Details |
|-----------|---------|
| **Background** | Staff engineer at FAANG with 15 years of experience |
| **Pain Points** | Too busy to maintain profile manually; has extensive open-source contributions; wants professional presence for speaking and consulting |
| **Goals** | Aggregate achievements across multiple repos; maintain automatically without time investment; present thought leadership and expertise areas |

---

## 5. User Flows

### 5.1 Primary Flow: First-Time Setup (CLI)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Initialize                                                           │
│ $ profile-agent init                                                        │
│ → Creates .profile-agent/ directory                                         │
│ → Prompts for GitHub OAuth (opens browser)                                  │
│ → Stores token securely                                                      │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Add Context Sources                                                  │
│ $ profile-agent add --cv ./resume.pdf                                       │
│ $ profile-agent add --linkedin ./linkedin-export.pdf                        │
│ $ profile-agent add --github                    # Uses OAuth'd account       │
│ $ profile-agent add --text "I'm passionate about..."                        │
│ → Each source is parsed and stored locally                                  │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Extract & Review                                                     │
│ $ profile-agent extract                                                     │
│ → AI processes all sources                                                  │
│ → Generates profile-data.json                                               │
│ → Opens interactive editor (or outputs file for manual editing)             │
│ → User reviews: skills, achievements, bio, projects                         │
│ → User can edit any field before proceeding                                 │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Select Template & Preview                                            │
│ $ profile-agent templates list                  # Shows available themes     │
│ $ profile-agent generate --theme minimal-dark   # Generates README           │
│ → Renders README.md locally                                                 │
│ → Shows preview in terminal (or opens browser preview)                      │
│ → User confirms or goes back to edit                                        │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Deploy to GitHub                                                     │
│ $ profile-agent deploy                                                      │
│ → Creates {username}/{username} repo if not exists                          │
│ → Pushes README.md                                                          │
│ → Optionally sets up GitHub Action for auto-updates                         │
│ → Confirms success with link to profile                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Secondary Flow: Update Existing Profile

```
$ profile-agent update                    # Re-fetches GitHub data
$ profile-agent extract --refresh         # Re-runs AI extraction
$ profile-agent generate                  # Uses existing theme
$ profile-agent deploy                    # Pushes update
```

### 5.3 GitHub Action Flow (Automatic Updates)

```
┌─────────────────────────────────────────────────────────────┐
│ Trigger: Cron (weekly) or workflow_dispatch (manual)        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Checkout profile repo                                     │
│ 2. Run profile-agent with stored config                      │
│ 3. Re-fetch GitHub stats (no AI re-extraction by default)   │
│ 4. Re-render template with updated stats                     │
│ 5. Commit & push if changes detected                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Functional Requirements

### 6.1 Context Ingestion

| ID | Feature | User Story | Priority |
|----|---------|-----------|----------|
| FR-101 | CV Upload | As a user, I want to upload my CV (PDF/DOCX) so that the system can extract my experience and skills | **Must** |
| FR-102 | LinkedIn PDF Import | As a user, I want to import my LinkedIn PDF export so that professional history is captured accurately | **Must** |
| FR-103 | GitHub Connection | As a user, I want to connect my GitHub account via OAuth so that repo data and contributions are analyzed | **Must** |
| FR-104 | Text Blurbs | As a user, I want to paste custom text about myself so that unique achievements are included | **Should** |
| FR-105 | Portfolio Links | As a user, I want to add links to my portfolio/blog so that additional work is referenced | **Could** |

**LinkedIn Import Details (FR-102):**
- User downloads their LinkedIn data export (PDF format) from LinkedIn Settings
- ProfileAgent parses the PDF locally — no scraping, no API, no legal issues
- Extracts: headline, summary, work experience, education, certifications, skills

### 6.2 AI Extraction

| ID | Feature | User Story | Priority |
|----|---------|-----------|----------|
| FR-201 | Skill Extraction | As a user, I want the AI to identify my technical skills and categorize them by type/proficiency | **Must** |
| FR-202 | Achievement Identification | As a user, I want the AI to extract and rephrase my key achievements in impactful language | **Must** |
| FR-203 | Career Pivot Detection | As a user, I want the system to recognize and positively frame any career transitions | **Should** |
| FR-204 | Project Summarization | As a user, I want AI-generated summaries of my notable GitHub projects | **Must** |
| FR-205 | Bio Generation | As a user, I want an AI-written professional bio based on my combined context | **Should** |

### 6.3 Content Review & Editing

| ID | Feature | User Story | Priority |
|----|---------|-----------|----------|
| FR-301 | View Extracted Data | As a user, I want to see all AI-extracted data before it's used in generation | **Must** |
| FR-302 | Edit Skills | As a user, I want to add, remove, or modify extracted skills | **Must** |
| FR-303 | Edit Achievements | As a user, I want to rewrite or delete any extracted achievements | **Must** |
| FR-304 | Edit Bio | As a user, I want to modify the AI-generated bio | **Must** |
| FR-305 | Edit Projects | As a user, I want to select which projects to feature and edit their descriptions | **Should** |
| FR-306 | Save Edits | As a user, I want my edits to be saved and used in future regenerations | **Must** |

### 6.4 Template Selection & Generation

| ID | Feature | User Story | Priority |
|----|---------|-----------|----------|
| FR-401 | Browse Templates | As a user, I want to preview available themes before selecting one | **Must** |
| FR-402 | Select Theme | As a user, I want to choose a theme that matches my personal brand | **Must** |
| FR-403 | Preview Output | As a user, I want to preview the generated README before deploying | **Must** |
| FR-404 | Customize Colors | As a user, I want to adjust the color scheme of my selected template | **Could** |
| FR-405 | Regenerate | As a user, I want to regenerate with a different template without re-extracting | **Should** |

### 6.5 GitHub Publishing

| ID | Feature | User Story | Priority |
|----|---------|-----------|----------|
| FR-501 | GitHub OAuth | As a user, I want to authenticate with GitHub to enable publishing | **Must** |
| FR-502 | Create Profile Repo | As a user, I want the tool to create my `{username}/{username}` repo if it doesn't exist | **Must** |
| FR-503 | Push README | As a user, I want to push the generated README directly to my profile repository | **Must** |
| FR-504 | Setup GitHub Action | As a user, I want the system to configure GitHub Actions for automatic updates | **Should** |
| FR-505 | Manual Trigger | As a user, I want to manually trigger a profile refresh from the Action | **Should** |
| FR-506 | Update Frequency Config | As a user, I want to configure how often my profile auto-updates | **Could** |

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Runtime** | Node.js 20 LTS | Stable, wide ecosystem, GitHub Actions native support |
| **Language** | TypeScript 5.x | Type safety, better DX, self-documenting code |
| **Templates** | Mustache | Logic-less, secure, easy community contributions |
| **AI Gateway** | Vercel AI SDK | Unified API, easy provider switching, streaming support |
| **AI Models** | Gemini 1.5 Flash / GPT-4o-mini | Cost-efficient ($0.001-0.002 per generation) |
| **PDF Parsing** | pdf-parse | Pure JS, no native dependencies |
| **DOCX Parsing** | mammoth | Clean text extraction from Word docs |
| **CLI Framework** | Commander.js | Mature, well-documented, minimal overhead |
| **GitHub API** | Octokit | Official GitHub SDK, OAuth support |
| **Testing** | Vitest | Fast, TypeScript-native, Jest-compatible |

### 7.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ProfileAgent                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │    CLI      │    │   Parser    │    │     AI      │    │  Template   │  │
│  │  Controller │───▶│   Engine    │───▶│  Extractor  │───▶│   Engine    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                 │                   │                   │         │
│         │                 │                   │                   │         │
│         ▼                 ▼                   ▼                   ▼         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Config    │    │   Local     │    │   Vercel    │    │  Mustache   │  │
│  │   Store     │    │   Files     │    │   AI SDK    │    │  Renderer   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                    │                   │         │
│         │                                    │                   │         │
│         ▼                                    ▼                   ▼         │
│  ┌─────────────┐                      ┌─────────────┐    ┌─────────────┐  │
│  │   GitHub    │◀─────────────────────│   Gemini/   │    │   Output    │  │
│  │   Client    │                      │   OpenAI    │    │   Files     │  │
│  └─────────────┘                      └─────────────┘    └─────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **CLI Controller** | Parse commands, orchestrate workflow, handle user prompts, manage interactive editing |
| **Parser Engine** | Extract text from PDFs (CV, LinkedIn), parse DOCX, query GitHub API for repo data |
| **AI Extractor** | Send context to AI providers, parse structured JSON responses, validate output schema |
| **Template Engine** | Load Mustache templates, render with profile data, validate output markdown |
| **GitHub Client** | OAuth flow, create repos, push files, configure Actions |
| **Config Store** | Persist user settings, API keys, template preferences in `.profile-agent/` |

### 7.4 AI Model Selection

| Task | Primary Model | Fallback | Est. Cost/Call | Rationale |
|------|--------------|----------|----------------|-----------|
| Text Extraction | Gemini 1.5 Flash | GPT-4o-mini | $0.0003 | Fast, cheap, good at structured extraction |
| Skill Mapping | Gemini 1.5 Flash | GPT-4o-mini | $0.0002 | Simple categorization task |
| Achievement Rewrite | GPT-4o-mini | Gemini 1.5 Flash | $0.0004 | Better at creative rewording |
| Bio Generation | GPT-4o-mini | Gemini 1.5 Flash | $0.0003 | More natural prose |

**Total estimated cost per full profile generation: ~$0.0012**

---

## 8. Data Models

### 8.1 Profile Data Schema

```typescript
interface ProfileData {
  // Metadata
  version: string;                    // Schema version
  generatedAt: string;                // ISO timestamp
  lastEditedAt?: string;              // User edit timestamp
  
  // Personal Info
  name: string;
  headline: string;                   // e.g., "Full-Stack Developer | React & Node.js"
  bio: string;                        // 2-4 sentence professional summary
  location?: string;
  email?: string;                     // Only if user opts in
  
  // Professional Content
  skills: SkillCategory[];
  achievements: Achievement[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  
  // Social & Links
  socialLinks: SocialLink[];
  
  // GitHub-Specific
  githubStats: GitHubStats;
  
  // Template Config
  templateId: string;
  templateConfig?: Record<string, any>;
}

interface SkillCategory {
  category: string;                   // e.g., "Languages", "Frameworks", "Tools"
  skills: Skill[];
}

interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;                      // For template rendering
}

interface Achievement {
  id: string;
  text: string;                       // Impact-focused achievement statement
  source: 'cv' | 'linkedin' | 'github' | 'manual';
  metrics?: string[];                 // Quantifiable results
  isHighlighted: boolean;             // User can mark top achievements
}

interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;                   // Null = current
  description: string;
  achievements: string[];
  isCareerPivot?: boolean;            // AI-detected transition
}

interface Project {
  name: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies: string[];
  stars?: number;
  isFeatured: boolean;                // User selects top projects
}

interface GitHubStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalContributions: number;
  topLanguages: { language: string; percentage: number }[];
  contributionStreak?: number;
  lastUpdated: string;
}

interface SocialLink {
  platform: string;                   // 'twitter', 'linkedin', 'website', etc.
  url: string;
  displayText?: string;
}
```

### 8.2 Config Schema

```typescript
interface ProfileAgentConfig {
  // Authentication
  githubToken?: string;               // OAuth token (stored securely)
  aiProvider: 'gemini' | 'openai';
  aiApiKey?: string;                  // User's own key (optional)
  
  // Preferences
  defaultTemplate: string;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'manual';
  
  // Privacy
  includeEmail: boolean;
  includeLocation: boolean;
  
  // Sources
  sources: {
    cv?: string;                      // Path to CV file
    linkedin?: string;                // Path to LinkedIn PDF
    github: boolean;                  // Use connected GitHub
    customText?: string[];            // Array of text blurbs
  };
}
```

---

## 9. Template System

### 9.1 V1 Templates

| Template ID | Name | Description | Best For |
|-------------|------|-------------|----------|
| `minimal-dark` | Minimal Dark | Clean, professional dark theme with subtle gradients | Senior engineers, minimalist preferences |
| `minimal-light` | Minimal Light | Bright, airy design with soft shadows | Corporate environments, enterprise |
| `portfolio-grid` | Portfolio Grid | Project-focused layout with visual cards | Freelancers, portfolio-heavy profiles |
| `stats-heavy` | Stats Heavy | Emphasis on GitHub statistics and activity graphs | Active contributors, OSS maintainers |
| `narrative` | Narrative | Story-driven layout highlighting career journey | Career pivoters, unique backgrounds |

### 9.2 Template File Structure

```
/templates
  /minimal-dark
    main.mustache           # Primary template entry point
    partials/
      header.mustache       # Name, headline, social links
      skills.mustache       # Skills grid/badges
      projects.mustache     # Featured projects section
      stats.mustache        # GitHub stats widgets
      achievements.mustache # Key achievements list
      footer.mustache       # Contact & closing
    preview.png             # Template preview image
    config.json             # Template metadata & variables
  /minimal-light
    ...
  /portfolio-grid
    ...
```

### 9.3 Template Configuration

```json
// templates/minimal-dark/config.json
{
  "id": "minimal-dark",
  "name": "Minimal Dark",
  "description": "Clean, professional dark theme with subtle gradients",
  "version": "1.0.0",
  "author": "ProfileAgent Team",
  "preview": "./preview.png",
  "variables": {
    "primaryColor": "#58a6ff",
    "backgroundColor": "#0d1117",
    "textColor": "#c9d1d9",
    "accentColor": "#238636"
  },
  "features": {
    "showStats": true,
    "showProjects": true,
    "showAchievements": true,
    "maxProjects": 6,
    "maxAchievements": 5
  }
}
```

### 9.4 Mustache Variables Reference

| Variable | Type | Description |
|----------|------|-------------|
| `{{name}}` | string | User's full name |
| `{{headline}}` | string | Professional headline (1 line) |
| `{{bio}}` | string | AI-generated professional bio |
| `{{#skills}}` | array | Categorized skill groups |
| `{{#skills.category}}` | string | Skill category name |
| `{{#skills.items}}` | array | Skills in category |
| `{{#achievements}}` | array | Key achievements with impact metrics |
| `{{#projects}}` | array | Featured projects with descriptions |
| `{{#projects.name}}` | string | Project name |
| `{{#projects.description}}` | string | Project description |
| `{{#projects.technologies}}` | array | Tech stack used |
| `{{githubStats.username}}` | string | GitHub username |
| `{{githubStats.totalStars}}` | number | Total stars across repos |
| `{{#socialLinks}}` | array | Social media links |

---

## 10. AI Processing Pipeline

### 10.1 Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Raw       │    │   Parsed    │    │   AI        │    │   Profile   │
│   Inputs    │───▶│   Text      │───▶│   Prompts   │───▶│   Data      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                            │
                          ┌─────────────────┼─────────────────┐
                          ▼                 ▼                 ▼
                   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
                   │   Skills    │   │ Achievements│   │    Bio      │
                   │   Prompt    │   │   Prompt    │   │   Prompt    │
                   └─────────────┘   └─────────────┘   └─────────────┘
```

### 10.2 Extraction Prompts

| Prompt File | Purpose | Input | Output |
|-------------|---------|-------|--------|
| `extract-skills.md` | Identify and categorize technical skills | Combined parsed text | `SkillCategory[]` JSON |
| `extract-achievements.md` | Find quantifiable achievements, rewrite with impact | Combined parsed text | `Achievement[]` JSON |
| `detect-pivots.md` | Recognize career transitions, frame positively | Experience history | Pivot annotations |
| `generate-bio.md` | Create compelling professional summary | All extracted data | Bio string |
| `summarize-projects.md` | Generate concise project descriptions | Repo READMEs + metadata | `Project[]` JSON |

### 10.3 Example Prompt: Skill Extraction

```markdown
# Skill Extraction Prompt

You are analyzing a developer's professional background to extract their technical skills.

## Input Context
{context}

## Instructions
1. Identify all technical skills mentioned (languages, frameworks, tools, platforms)
2. Categorize them into logical groups
3. Estimate proficiency based on:
   - Years of experience mentioned
   - Depth of projects using the skill
   - Recency of use
4. Return ONLY valid JSON matching the schema below

## Output Schema
```json
{
  "skills": [
    {
      "category": "Languages",
      "skills": [
        { "name": "TypeScript", "proficiency": "expert", "yearsOfExperience": 5 }
      ]
    }
  ]
}
```

## Rules
- Only include skills with clear evidence
- Don't invent skills not mentioned
- Prefer specific technologies over vague terms
- Group related skills logically
```

### 10.4 AI Configuration (Vercel AI SDK)

```typescript
// src/ai/config.ts
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const aiProviders = {
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
  gemini: createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  }),
};

export const models = {
  extraction: 'gemini-1.5-flash',    // Fast, cheap extraction
  generation: 'gpt-4o-mini',          // Better prose quality
};

export const modelConfig = {
  temperature: 0.3,                   // Low for consistency
  maxTokens: 2000,
};
```

### 10.5 Cost Estimation

| Operation | Input Tokens (est.) | Output Tokens (est.) | Cost (USD) |
|-----------|-------------------|---------------------|------------|
| CV/LinkedIn parsing | ~2,000 | ~500 | $0.0003 |
| Skills extraction | ~1,000 | ~300 | $0.0002 |
| Achievement extraction | ~1,500 | ~500 | $0.0004 |
| Bio generation | ~1,000 | ~200 | $0.0003 |
| **Total per generation** | **~5,500** | **~1,500** | **~$0.0012** |

---

## 11. GitHub Integration

### 11.1 OAuth Flow

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   CLI        │         │   GitHub     │         │   User       │
│   (localhost)│         │   OAuth      │         │   Browser    │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │  1. Start OAuth        │                        │
       │───────────────────────▶│                        │
       │                        │  2. Redirect to auth   │
       │                        │───────────────────────▶│
       │                        │                        │
       │                        │  3. User authorizes    │
       │                        │◀───────────────────────│
       │  4. Callback with code │                        │
       │◀───────────────────────│                        │
       │                        │                        │
       │  5. Exchange for token │                        │
       │───────────────────────▶│                        │
       │                        │                        │
       │  6. Return access token│                        │
       │◀───────────────────────│                        │
       │                        │                        │
       │  7. Store token locally│                        │
       │                        │                        │
```

### 11.2 Required OAuth Scopes

| Scope | Purpose | Required |
|-------|---------|----------|
| `repo` (public) | Push README to profile repository | **Yes** |
| `read:user` | Fetch profile information, contribution data | **Yes** |
| `workflow` | Configure GitHub Actions | **Yes** (for auto-updates) |

### 11.3 Profile Repository Creation

```typescript
// src/github/client.ts
async function ensureProfileRepo(username: string): Promise<void> {
  const repoName = username; // {username}/{username} is GitHub's profile repo
  
  try {
    // Check if repo exists
    await octokit.repos.get({ owner: username, repo: repoName });
  } catch (error) {
    if (error.status === 404) {
      // Create the repo
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: `${username}'s GitHub Profile`,
        auto_init: false,
        private: false,
      });
    }
  }
}
```

### 11.4 Generated GitHub Action

```yaml
# .github/workflows/update-profile.yml
name: Update Profile README

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:      # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install ProfileAgent
        run: npm install -g profile-agent
      
      - name: Update Profile
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          profile-agent update --stats-only  # Only refresh GitHub stats
          profile-agent generate
      
      - name: Commit Changes
        run: |
          git config user.name "ProfileAgent Bot"
          git config user.email "bot@profile-agent.dev"
          git add README.md
          git diff --quiet && git diff --staged --quiet || git commit -m "📊 Update profile stats"
          git push
```

### 11.5 Update Frequency Options

| Frequency | Cron | Use Case |
|-----------|------|----------|
| Daily | `0 0 * * *` | Active contributors, job seekers |
| Weekly (default) | `0 0 * * 0` | Most users, balanced updates |
| Monthly | `0 0 1 * *` | Stable profiles, minimal changes |
| Manual only | N/A | Full control, on-demand only |

---

## 12. Project Structure

```
profile-agent/
├── src/
│   ├── cli/
│   │   ├── index.ts              # CLI entry point
│   │   ├── commands/
│   │   │   ├── init.ts           # Initialize project
│   │   │   ├── add.ts            # Add context sources
│   │   │   ├── extract.ts        # Run AI extraction
│   │   │   ├── generate.ts       # Generate README
│   │   │   ├── deploy.ts         # Push to GitHub
│   │   │   ├── update.ts         # Refresh & regenerate
│   │   │   └── templates.ts      # List/preview templates
│   │   └── ui/
│   │       ├── prompts.ts        # Interactive prompts
│   │       └── editor.ts         # Content editing UI
│   │
│   ├── parsers/
│   │   ├── index.ts              # Parser orchestrator
│   │   ├── pdf.ts                # PDF text extraction
│   │   ├── docx.ts               # Word doc parsing
│   │   ├── linkedin.ts           # LinkedIn PDF parser
│   │   └── github.ts             # GitHub API client
│   │
│   ├── ai/
│   │   ├── index.ts              # AI orchestrator
│   │   ├── config.ts             # Model configuration
│   │   ├── extractor.ts          # Extraction logic
│   │   └── prompts/
│   │       ├── extract-skills.md
│   │       ├── extract-achievements.md
│   │       ├── detect-pivots.md
│   │       ├── generate-bio.md
│   │       └── summarize-projects.md
│   │
│   ├── templates/
│   │   ├── index.ts              # Template engine
│   │   ├── loader.ts             # Load & validate templates
│   │   └── renderer.ts           # Mustache rendering
│   │
│   ├── github/
│   │   ├── index.ts              # GitHub integration
│   │   ├── oauth.ts              # OAuth flow
│   │   ├── client.ts             # Octokit wrapper
│   │   └── actions.ts            # Action file generator
│   │
│   ├── config/
│   │   ├── index.ts              # Config management
│   │   ├── schema.ts             # Config schema
│   │   └── store.ts              # Secure storage
│   │
│   └── types/
│       ├── profile.ts            # ProfileData types
│       └── config.ts             # Config types
│
├── templates/                    # Built-in Mustache templates
│   ├── minimal-dark/
│   ├── minimal-light/
│   ├── portfolio-grid/
│   ├── stats-heavy/
│   └── narrative/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── docs/
│   ├── getting-started.md
│   ├── templates.md
│   ├── contributing.md
│   └── api-reference.md
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

## 13. CLI & API Design

### 13.1 CLI Commands

```bash
# Initialize ProfileAgent in current directory
profile-agent init

# Add context sources
profile-agent add --cv ./resume.pdf
profile-agent add --linkedin ./linkedin-export.pdf
profile-agent add --github                    # Uses OAuth'd account
profile-agent add --text "Custom bio text"

# Run AI extraction (outputs profile-data.json)
profile-agent extract
profile-agent extract --edit                  # Opens editor after extraction

# Edit extracted data
profile-agent edit                            # Opens interactive editor
profile-agent edit --file                     # Opens profile-data.json in $EDITOR

# List and preview templates
profile-agent templates list
profile-agent templates preview minimal-dark

# Generate README
profile-agent generate --theme minimal-dark
profile-agent generate --preview              # Show preview without saving

# Deploy to GitHub
profile-agent deploy
profile-agent deploy --setup-action           # Also configures GitHub Action
profile-agent deploy --no-action              # Skip Action setup

# Update existing profile
profile-agent update                          # Refresh GitHub stats only
profile-agent update --full                   # Re-run AI extraction

# Configuration
profile-agent config set ai.provider gemini
profile-agent config set update.frequency weekly
profile-agent config get ai.provider
```

### 13.2 Programmatic API

```typescript
import { ProfileAgent } from 'profile-agent';

// Initialize
const agent = new ProfileAgent({
  aiProvider: 'gemini',
  aiApiKey: process.env.GEMINI_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,
});

// Add sources
await agent.addSource({ type: 'cv', path: './resume.pdf' });
await agent.addSource({ type: 'linkedin', path: './linkedin.pdf' });
await agent.addSource({ type: 'github', username: 'johndoe' });
await agent.addSource({ type: 'text', content: 'Custom bio...' });

// Extract profile data
const profileData = await agent.extract();

// Edit profile data programmatically
profileData.bio = 'Updated bio text';
profileData.achievements[0].isHighlighted = true;
await agent.saveProfile(profileData);

// Generate README
const readme = await agent.generate({
  templateId: 'minimal-dark',
  profileData,
});

// Preview (returns markdown string)
console.log(readme);

// Deploy
await agent.deploy({
  setupAction: true,
  frequency: 'weekly',
});
```

### 13.3 Interactive Editor

When `profile-agent edit` is run, users see a terminal-based editor:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ProfileAgent - Edit Profile Data                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ► Personal Info                                                            │
│    Bio                                                                      │
│  ► Skills (12)                                                              │
│  ► Achievements (8)                                                         │
│  ► Projects (15)                                                            │
│  ► Experience (4)                                                           │
│                                                                             │
│  [↑/↓] Navigate  [Enter] Edit  [Space] Toggle highlight  [S] Save  [Q] Quit │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Security & Privacy

### 14.1 Data Handling Principles

| Principle | Implementation |
|-----------|---------------|
| **Local-first processing** | All parsing and extraction runs on the user's machine |
| **No data persistence** | ProfileAgent does not store user data on any server |
| **Minimal API exposure** | Only extracted text (not raw files) sent to AI providers |
| **User-controlled secrets** | API keys stored in local `.profile-agent/config` only |
| **Transparent data flow** | User can inspect all data before it leaves their machine |

### 14.2 Sensitive Data Filtering

The extraction pipeline automatically filters:
- Email addresses (unless explicitly allowed via config)
- Phone numbers
- Physical addresses
- Salary/compensation information
- Social security numbers or national IDs

### 14.3 Token Storage

```typescript
// Tokens stored in user's home directory
// ~/.profile-agent/config (600 permissions)
{
  "githubToken": "gho_xxxx...",  // Encrypted at rest
  "aiApiKey": "sk-xxxx..."       // Encrypted at rest
}
```

### 14.4 AI Provider Privacy

| Provider | Data Retention | Notes |
|----------|---------------|-------|
| Google Gemini | No training on API data | Free tier available |
| OpenAI | No training on API data | Requires paid account |

Users can also use their own API keys, giving them full control over their AI provider relationship.

---

## 15. Release Plan

### 15.1 MVP (v0.1.0) — 4 Weeks

**Goals:** Prove core concept, gather early feedback

| Feature | Status |
|---------|--------|
| CV/PDF parsing (basic text extraction) | 🔲 |
| GitHub repository scanning | 🔲 |
| AI extraction with Gemini Flash | 🔲 |
| 2 starter templates (minimal-dark, portfolio-grid) | 🔲 |
| CLI-based generation and local output | 🔲 |
| Basic README generation | 🔲 |

**Not included in MVP:**
- LinkedIn import
- GitHub OAuth / push
- Content editing UI
- GitHub Actions

### 15.2 Beta (v0.5.0) — 6 Weeks

**Goals:** Feature-complete for early adopters

| Feature | Status |
|---------|--------|
| LinkedIn PDF import | 🔲 |
| All 5 V1 templates | 🔲 |
| GitHub OAuth integration | 🔲 |
| Direct GitHub push | 🔲 |
| GitHub Action generation | 🔲 |
| Interactive content editor | 🔲 |
| Profile data editing | 🔲 |

### 15.3 Stable (v1.0.0) — 10 Weeks

**Goals:** Production-ready, documented, community-ready

| Feature | Status |
|---------|--------|
| Full programmatic API | 🔲 |
| Template preview system | 🔲 |
| Comprehensive documentation | 🔲 |
| Community template guidelines | 🔲 |
| Error handling & recovery | 🔲 |
| Test coverage >80% | 🔲 |

### 15.4 Timeline

```
Week 1-2:   Project setup, Parser engine (PDF, GitHub API)
Week 3-4:   AI integration, Basic extraction prompts
Week 5:     Template engine, 2 starter templates
Week 6:     MVP release, gather feedback
Week 7-8:   LinkedIn parser, Content editor
Week 9-10:  GitHub OAuth, Push integration
Week 11:    GitHub Actions, Remaining templates
Week 12:    Beta release, documentation
Week 13-14: Bug fixes, API stabilization
Week 15:    v1.0.0 stable release
```

---

## 16. Success Metrics

### 16.1 Adoption Metrics

| Metric | 3 Months | 6 Months | 12 Months |
|--------|----------|----------|-----------|
| npm Downloads | 1,000 | 5,000 | 25,000 |
| GitHub Stars | 100 | 500 | 2,000 |
| Active Users (weekly) | 50 | 300 | 1,500 |
| Profile Generations | 500 | 3,000 | 15,000 |

### 16.2 Quality Metrics

| Metric | Target |
|--------|--------|
| User Satisfaction (survey) | >4.0/5 |
| Generation Success Rate | >95% |
| Average Generation Time | <45 seconds |
| Template Completion Rate | >80% |

### 16.3 Community Metrics

| Metric | 6 Months | 12 Months |
|--------|----------|-----------|
| GitHub Contributors | 10 | 30 |
| Community Templates | 5 | 20 |
| Documentation PRs | 15 | 50 |

---

## 17. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **AI costs exceed budget** | High | Medium | Implement token limits, caching, allow user API keys |
| **LinkedIn PDF format changes** | Medium | High | Abstract parser, monitor for changes, fallback to manual input |
| **GitHub API rate limits** | Medium | Medium | Implement caching, pagination, use GraphQL where possible |
| **AI extraction quality varies** | High | Medium | Prompt versioning, A/B testing, user editing fallback |
| **Template rendering bugs** | Medium | Low | Comprehensive template tests, preview before deploy |
| **OAuth security vulnerabilities** | High | Low | Security audit, follow GitHub best practices, minimal scopes |
| **User data privacy concerns** | High | Medium | Local-first architecture, clear privacy documentation |
| **Competition from GitHub Copilot** | Medium | Medium | Focus on template quality and customization |

---

## 18. Future Roadmap

### 18.1 Post v1.0 Features

#### v1.5 — Web Interface
- Browser-based wizard for non-CLI users
- Hosted version with free tier
- Real-time preview as you edit

#### v2.0 — Advanced Analytics
- Profile view tracking
- A/B testing for templates
- Engagement metrics dashboard

#### v2.5 — Multi-Platform
- GitLab profile support
- Bitbucket support
- dev.to profile generation
- Personal portfolio site generation

#### v3.0 — Team Profiles
- Organization profile management
- Consistent team branding
- Centralized template governance

### 18.2 Community Contributions

| Area | Description |
|------|-------------|
| **Template Marketplace** | Open submission process for community-designed templates |
| **Parser Plugins** | Extensible architecture for additional input sources (Stack Overflow, Dribbble, etc.) |
| **Localization** | Multi-language support for non-English profiles |
| **Integrations** | Plugins for CI/CD platforms beyond GitHub Actions |

### 18.3 Monetization Considerations (Future)

While ProfileAgent is open-source, potential revenue streams include:
- **Premium Templates**: Professionally designed templates for purchase
- **Hosted Service**: Managed version with advanced features
- **Enterprise**: Team management, SSO, audit logs

---

## Appendix A: LinkedIn PDF Export Guide

For users who need to export their LinkedIn data:

1. Log in to LinkedIn
2. Click your profile picture → **Settings & Privacy**
3. Go to **Data privacy** → **Get a copy of your data**
4. Select **Profile** (or full archive)
5. Choose **PDF** format
6. Wait for email with download link
7. Download and provide to ProfileAgent

---

## Appendix B: Example Generated README

```markdown
# Hi, I'm Sarah Chen 👋

**Full-Stack Developer | React & Node.js | Building for the Web**

I'm a passionate developer with 3 years of experience building scalable web applications. 
I love turning complex problems into elegant, user-friendly solutions.

## 🛠️ Tech Stack

**Languages:** TypeScript, JavaScript, Python, SQL  
**Frontend:** React, Next.js, Tailwind CSS  
**Backend:** Node.js, Express, PostgreSQL, Redis  
**Tools:** Docker, AWS, GitHub Actions, Figma

## 🏆 Achievements

- Built a real-time collaboration feature that increased user engagement by 40%
- Reduced API response times by 60% through strategic caching implementation
- Led migration of legacy codebase to TypeScript, improving developer velocity by 25%

## 📊 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=sarahchen...)

## 🚀 Featured Projects

### [TaskFlow](https://github.com/sarahchen/taskflow)
A modern task management app with real-time sync and team collaboration features.
`React` `Node.js` `WebSocket` `PostgreSQL`

### [DevBlog](https://github.com/sarahchen/devblog)
Personal tech blog built with Next.js and MDX, featuring syntax highlighting.
`Next.js` `MDX` `Tailwind`

## 📫 Let's Connect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-sarahchen-blue)](https://linkedin.com/in/sarahchen)
[![Twitter](https://img.shields.io/badge/Twitter-@sarahcodes-1DA1F2)](https://twitter.com/sarahcodes)
[![Website](https://img.shields.io/badge/Website-sarahchen.dev-green)](https://sarahchen.dev)
```

---

**Document End**

*Generated by ProfileAgent PRD v1.0*
