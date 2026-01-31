export interface ProfileData {
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
  certifications: Certification[];
  socialLinks: SocialLink[];
  githubStats: GitHubStats;
  techStack: TechStackItem[];
  templateId: string;
  templateConfig?: Record<string, any>;
}

export interface TechStackItem {
  name: string;           // Original name: "C#", "Tailwind CSS"
  encoded: string;        // Encoded for shields.io: "C%23", "Tailwind_CSS"
  color: string;          // Hex color without #: "239120"
  logo: string;           // Logo identifier: "csharp"
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;           // Original name: "C#", "Tailwind CSS"
  encoded: string;        // Encoded for shields.io: "C%23", "Tailwind_CSS"
  color: string;          // Hex color without #: "239120"
  logo: string;           // Logo identifier: "csharp"
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

export interface Achievement {
  id: string;
  text: string;
  source: "cv" | "linkedin" | "github" | "manual";
  metrics?: string[];
  isHighlighted: boolean;
}

export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies: TechStackItem[];  // Changed from string[] to TechStackItem[]
  stars?: number;
  isFeatured: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface GitHubStats {
  username: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { language: string; percentage: number }[];
  lastUpdated: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  displayText?: string;
}
