# Contributing Templates to ProfileAgent

Thank you for your interest in creating templates for ProfileAgent! Community templates help make ProfileAgent better for everyone.

## Template Guidelines

### Template Structure

A ProfileAgent template consists of:

```
my-template/
├── config.json           # Required: Template metadata
├── main.mustache         # Required: Main template file
├── partials/             # Optional: Reusable components
│   ├── header.mustache
│   ├── skills.mustache
│   ├── projects.mustache
│   └── footer.mustache
├── preview.png           # Required: Template screenshot
└── README.md             # Optional: Template documentation
```

### config.json Specification

```json
{
  "id": "my-template",
  "name": "My Awesome Template",
  "description": "A concise description of what makes this template special",
  "version": "1.0.0",
  "author": "Your Name",
  "license": "MIT",
  "preview": "./preview.png",
  "variables": {
    "primaryColor": "#6366f1",
    "secondaryColor": "#8b5cf6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937"
  },
  "features": {
    "showStats": true,
    "showProjects": true,
    "showAchievements": true,
    "maxProjects": 6,
    "maxAchievements": 5
  },
  "tags": ["modern", "colorful", "stats-focused"]
}
```

### Required Fields

- **id**: Unique kebab-case identifier (e.g., "my-awesome-template")
- **name**: Human-readable display name
- **description**: 1-2 sentence description (under 120 characters)
- **version**: Semantic version number
- **author**: Your name or GitHub username
- **preview**: Path to preview image (required, PNG recommended, 1200x600px)

### Mustache Variables Reference

Your template has access to these variables:

#### Personal Info
- `{{name}}` - User's full name
- `{{headline}}` - Professional headline
- `{{bio}}` - AI-generated bio (2-4 sentences)
- `{{location}}` - Location (optional)
- `{{email}}` - Email address (optional)

#### Skills
```mustache
{{#skills}}
  **{{category}}**
  {{#skills}}
    - {{name}} ({{proficiency}})
  {{/skills}}
{{/skills}}
```

#### Achievements
```mustache
{{#achievements}}
  {{#isHighlighted}}⭐{{/isHighlighted}} {{text}}
{{/achievements}}
```

#### Projects
```mustache
{{#projects}}
  {{#isFeatured}}
    ### [{{name}}]({{repoUrl}})
    {{description}}
    **Tech:** {{#technologies}}{{.}}, {{/technologies}}
    ⭐ {{stars}} stars
  {{/isFeatured}}
{{/projects}}
```

#### GitHub Stats
- `{{githubStats.username}}`
- `{{githubStats.totalRepos}}`
- `{{githubStats.totalStars}}`
- `{{githubStats.totalForks}}`
- `{{githubStats.lastUpdated}}`

#### Social Links
```mustache
{{#socialLinks}}
  [{{platform}}]({{url}})
{{/socialLinks}}
```

## Design Guidelines

### 1. Accessibility
- Use sufficient color contrast (WCAG AA minimum)
- Ensure text is readable on both light and dark mode GitHub
- Use semantic HTML when possible
- Provide alt text for images/badges

### 2. Mobile Responsiveness
- Test how your template renders on narrow screens
- Avoid fixed widths; use percentages or responsive layouts
- Consider how tables/grids collapse on mobile

### 3. Performance
- Minimize external dependencies
- Use optimized images (< 200KB for preview)
- Avoid excessive inline styles
- Limit badge requests to essential ones

### 4. GitHub Markdown Compatibility
- Test on GitHub's markdown renderer
- Avoid unsupported HTML/CSS
- Use GitHub-flavored markdown
- Test with different profile data sizes

## Template Categories

Templates should fit into one of these categories:

- **Minimal**: Clean, text-focused, professional
- **Stats-Heavy**: GitHub statistics and activity emphasis
- **Portfolio**: Project showcase, visual cards
- **Narrative**: Story-driven, career journey focus
- **Creative**: Unique layouts, artistic designs

## Preview Image Requirements

- **Dimensions**: 1200x600px (2:1 ratio)
- **Format**: PNG or JPG
- **Size**: < 200KB
- **Content**: Show actual template render with realistic data
- **Quality**: Clear, high-resolution screenshot

## Testing Your Template

Before submitting, test your template with:

### 1. Varied Data
- Short bio vs long bio
- Few skills (5) vs many skills (30+)
- 1-2 projects vs 10+ projects
- No achievements vs 10+ achievements

### 2. Edge Cases
- Empty optional fields
- Very long names or headlines
- Special characters in text
- Missing GitHub stats

### 3. Different Profiles
- Junior developer (limited experience)
- Senior engineer (extensive history)
- Career pivoter (mixed background)

## Submitting Your Template

1. **Fork** the ProfileAgent repository
2. **Create** your template in `templates/your-template-id/`
3. **Test** thoroughly with various profile data
4. **Document** any special features in a README
5. **Submit** a Pull Request with:
   - Template files
   - Preview image
   - Description of target audience
   - Test results/screenshots

### PR Checklist

- [ ] Template ID is unique and kebab-case
- [ ] config.json is valid and complete
- [ ] Preview image meets requirements
- [ ] Template renders correctly with test data
- [ ] No external dependencies (or well-justified)
- [ ] Follows design guidelines
- [ ] Tested on GitHub's markdown renderer
- [ ] README.md explains template purpose

## Template Examples

Check existing templates for inspiration:

- **minimal-dark**: Simple, professional, dark theme
- **minimal-light**: Clean, corporate-friendly
- **portfolio-grid**: Project-focused with visual cards
- **stats-heavy**: GitHub statistics emphasis
- **narrative**: Story-driven career journey

## Need Help?

- Check existing templates for patterns
- Ask questions in GitHub Discussions
- Review the ProfileAgent documentation
- Test with the ProfileAgent CLI

## License

All community templates must be MIT licensed or compatible open-source license.

---

Thank you for contributing to ProfileAgent! 🎉

