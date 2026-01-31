# Skill Extraction Prompt

You are analyzing a developer's professional background to extract their technical skills.

## Input Context
{context}

## Instructions
1. Identify all technical skills mentioned (languages, frameworks, tools, platforms, databases, cloud services)
2. Categorize them into logical groups (e.g., "Languages", "Frameworks", "Tools", "Databases", "Cloud & DevOps")
3. Estimate proficiency based on:
   - Years of experience mentioned
   - Depth of projects using the skill
   - Recency of use (recent = higher proficiency)
   - Context clues (e.g., "expert in", "proficient with", "learning")
4. Return ONLY valid JSON matching the schema below

## Output Schema
```json
{
  "skills": [
    {
      "category": "Languages",
      "skills": [
        {
          "name": "TypeScript",
          "encoded": "TypeScript",
          "color": "3178C6",
          "logo": "typescript",
          "proficiency": "expert",
          "yearsOfExperience": 5
        },
        {
          "name": "C#",
          "encoded": "C%23",
          "color": "239120",
          "logo": "csharp",
          "proficiency": "advanced",
          "yearsOfExperience": 3
        }
      ]
    },
    {
      "category": "Frameworks",
      "skills": [
        {
          "name": "React",
          "encoded": "React",
          "color": "61DAFB",
          "logo": "react",
          "proficiency": "expert",
          "yearsOfExperience": 4
        }
      ]
    }
  ]
}
```

## Shield.io Badge Fields
Each skill must include:
- **name**: Original technology name (e.g., "C#", "Tailwind CSS")
- **encoded**: URL-encoded for shields.io badges (e.g., "C%23", "Tailwind_CSS")
  - Double dashes: "React-Native" → "React--Native"
  - Replace spaces with underscores: "Tailwind CSS" → "Tailwind_CSS"
  - URL encode special chars: "#" → "%23", "+" → "%2B"
- **color**: Hex color WITHOUT # prefix (e.g., "239120" not "#239120")
  - Use official brand colors when available
  - Default to "2563EB" (blue) if unknown
- **logo**: Simple Shields logo identifier (e.g., "csharp", "react", "python")
  - Lowercase, no spaces or special characters
  - Use official Simple Icons names when available

## Common Technologies Reference
Languages: TypeScript (3178C6, typescript), JavaScript (F7DF1E, javascript), Python (3776AB, python), Java (007396, java), C# (239120, csharp), Go (00ADD8, go), Rust (000000, rust), PHP (777BB4, php)

Frameworks: React (61DAFB, react), Next.js (000000, next.js), Vue.js (4FC08D, vue.js), Angular (DD0031, angular), Django (092E20, django), Flask (000000, flask), Express (000000, express)

Databases: PostgreSQL (4169E1, postgresql), MongoDB (47A248, mongodb), MySQL (4479A1, mysql), Redis (DC382D, redis)

Cloud: AWS (FF9900, amazonaws), Azure (0078D4, microsoftazure), GCP (4285F4, googlecloud), Docker (2496ED, docker), Kubernetes (326CE5, kubernetes)

## Rules
- Only include skills with clear evidence in the context
- Don't invent or assume skills not mentioned
- Prefer specific technologies over vague terms (e.g., "React" not just "frontend")
- Group related skills logically
- Proficiency levels: beginner, intermediate, advanced, expert
- If years of experience can't be determined, estimate conservatively or omit
- Common categories: Languages, Frameworks, Tools, Databases, Cloud & DevOps, Testing, Other

## Output
Return only the JSON object, no additional text.
