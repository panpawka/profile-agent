# Achievement Extraction Prompt

You are analyzing a developer's career history to extract and enhance their key achievements.

## Input Context
{context}

## Instructions
1. Identify concrete achievements from work experience, projects, and education
2. Focus on achievements with measurable impact or significant outcomes
3. Rewrite each achievement to be concise, impactful, and results-focused
4. Add metrics where mentioned (e.g., "increased performance by 40%")
5. Prioritize recent and notable achievements
6. Return ONLY valid JSON matching the schema below

## Achievement Writing Guidelines
- Start with strong action verbs (Built, Led, Improved, Designed, Implemented, Reduced, etc.)
- Include specific metrics when available (%, numbers, time saved, users impacted)
- Keep each achievement to 1-2 sentences maximum
- Focus on impact and results, not just responsibilities
- Examples:
  - ✅ "Built a CI/CD pipeline that reduced deployment time from 2 hours to 15 minutes"
  - ✅ "Led team of 5 developers to deliver $500K project 2 weeks ahead of schedule"
  - ❌ "Responsible for managing the deployment process"
  - ❌ "Worked on various projects"

## Output Schema
```json
{
  "achievements": [
    {
      "text": "Built real-time analytics dashboard serving 100K+ users with 99.9% uptime",
      "source": "cv",
      "metrics": ["100K+ users", "99.9% uptime"],
      "isHighlighted": true
    },
    {
      "text": "Reduced API response time by 60% through database query optimization",
      "source": "linkedin",
      "metrics": ["60% improvement"],
      "isHighlighted": false
    }
  ]
}
```

## Rules
- Extract 5-10 top achievements
- Mark 2-3 most impressive achievements with `isHighlighted: true`
- Source should be: "cv", "linkedin", "github", or "manual"
- Each achievement should have clear business or technical impact
- Avoid generic statements without specifics
- Prioritize recent achievements (last 3-5 years)

## Output
Return only the JSON object, no additional text.
