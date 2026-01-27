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
          "proficiency": "expert",
          "yearsOfExperience": 5
        },
        {
          "name": "Python",
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
          "proficiency": "expert",
          "yearsOfExperience": 4
        }
      ]
    }
  ]
}
```

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
