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
  education: Education[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  githubStats: GitHubStats;
  templateId: string;
  templateConfig?: Record<string, any>;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  icon?: string;
}

export interface Achievement {
  id: string;
  text: string;
  source: 'cv' | 'linkedin' | 'github' | 'manual';
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
  isCareerPivot?: boolean;
}

export interface Project {
  name: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies: string[];
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
  totalContributions: number;
  topLanguages: { language: string; percentage: number }[];
  contributionStreak?: number;
  lastUpdated: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  displayText?: string;
}
