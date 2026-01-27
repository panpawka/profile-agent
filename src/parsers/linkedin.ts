import { PDFParser } from './pdf';

export interface LinkedInProfile {
  headline?: string;
  summary?: string;
  experience: LinkedInExperience[];
  education: LinkedInEducation[];
  skills: string[];
  certifications: LinkedInCertification[];
}

export interface LinkedInExperience {
  company: string;
  title: string;
  duration: string;
  description?: string;
}

export interface LinkedInEducation {
  institution: string;
  degree: string;
  field?: string;
  duration: string;
}

export interface LinkedInCertification {
  name: string;
  issuer: string;
  date?: string;
}

export class LinkedInParser {
  private pdfParser: PDFParser;

  constructor() {
    this.pdfParser = new PDFParser();
  }

  /**
   * Parse LinkedIn PDF export and extract structured data
   * @param filePath Path to LinkedIn PDF
   * @returns Structured LinkedIn profile data
   */
  async parse(filePath: string): Promise<LinkedInProfile> {
    // Parse PDF to text
    const result = await this.pdfParser.parse(filePath);
    const text = result.text;

    return {
      headline: this.extractHeadline(text),
      summary: this.extractSummary(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      certifications: this.extractCertifications(text),
    };
  }

  /**
   * Extract headline from LinkedIn text
   */
  private extractHeadline(text: string): string | undefined {
    // LinkedIn PDFs typically have headline after the name
    const headlineMatch = text.match(/Contact\s*\n([^\n]+)/);
    return headlineMatch ? headlineMatch[1].trim() : undefined;
  }

  /**
   * Extract summary/about section
   */
  private extractSummary(text: string): string | undefined {
    const summaryMatch = text.match(/Summary\s*\n([\s\S]*?)(?=\n\n|Experience|Skills)/i);
    if (summaryMatch) {
      return summaryMatch[1].trim();
    }
    
    const aboutMatch = text.match(/About\s*\n([\s\S]*?)(?=\n\n|Experience|Skills)/i);
    return aboutMatch ? aboutMatch[1].trim() : undefined;
  }

  /**
   * Extract work experience
   */
  private extractExperience(text: string): LinkedInExperience[] {
    const experiences: LinkedInExperience[] = [];
    
    // Find Experience section
    const experienceSection = text.match(/Experience\s*\n([\s\S]*?)(?=\nEducation|Skills|$)/i);
    if (!experienceSection) return experiences;

    const content = experienceSection[1];
    
    // Split by company entries (heuristic: look for capitalized lines followed by job titles)
    const lines = content.split('\n').filter(l => l.trim());
    
    let currentExp: Partial<LinkedInExperience> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Company name (usually starts with capital, longer than 3 chars)
      if (!currentExp.company && line.length > 3 && /^[A-Z]/.test(line)) {
        currentExp.company = line;
      }
      // Job title
      else if (currentExp.company && !currentExp.title) {
        currentExp.title = line;
      }
      // Duration (contains dates or "months"/"years")
      else if (currentExp.title && !currentExp.duration && 
               (line.match(/\d{4}/) || line.match(/month|year/i))) {
        currentExp.duration = line;
        
        // Save current experience
        if (currentExp.company && currentExp.title && currentExp.duration) {
          experiences.push({
            company: currentExp.company,
            title: currentExp.title,
            duration: currentExp.duration,
          });
          currentExp = {};
        }
      }
    }

    return experiences;
  }

  /**
   * Extract education
   */
  private extractEducation(text: string): LinkedInEducation[] {
    const education: LinkedInEducation[] = [];
    
    const educationSection = text.match(/Education\s*\n([\s\S]*?)(?=\nSkills|Certifications|$)/i);
    if (!educationSection) return education;

    const content = educationSection[1];
    const lines = content.split('\n').filter(l => l.trim());
    
    let currentEdu: Partial<LinkedInEducation> = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (!currentEdu.institution && /^[A-Z]/.test(trimmed)) {
        currentEdu.institution = trimmed;
      } else if (currentEdu.institution && !currentEdu.degree) {
        currentEdu.degree = trimmed;
      } else if (currentEdu.degree && !currentEdu.duration && trimmed.match(/\d{4}/)) {
        currentEdu.duration = trimmed;
        
        if (currentEdu.institution && currentEdu.degree && currentEdu.duration) {
          education.push({
            institution: currentEdu.institution,
            degree: currentEdu.degree,
            duration: currentEdu.duration,
          });
          currentEdu = {};
        }
      }
    }

    return education;
  }

  /**
   * Extract skills list
   */
  private extractSkills(text: string): string[] {
    const skillsMatch = text.match(/Skills\s*\n([\s\S]*?)(?=\nCertifications|Education|Experience|$)/i);
    if (!skillsMatch) return [];

    const skillsText = skillsMatch[1];
    const skills = skillsText
      .split(/[•\n,·]/)
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 50)
      .filter(s => !s.match(/^\d+$/)); // Remove numbers

    return [...new Set(skills)]; // Remove duplicates
  }

  /**
   * Extract certifications
   */
  private extractCertifications(text: string): LinkedInCertification[] {
    const certifications: LinkedInCertification[] = [];
    
    const certsSection = text.match(/Certifications?\s*\n([\s\S]*?)(?=\nSkills|Education|$)/i);
    if (!certsSection) return certifications;

    const content = certsSection[1];
    const lines = content.split('\n').filter(l => l.trim());
    
    let currentCert: Partial<LinkedInCertification> = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (!currentCert.name) {
        currentCert.name = trimmed;
      } else if (!currentCert.issuer) {
        currentCert.issuer = trimmed;
        
        if (currentCert.name && currentCert.issuer) {
          certifications.push({
            name: currentCert.name,
            issuer: currentCert.issuer,
          });
          currentCert = {};
        }
      }
    }

    return certifications;
  }
}
