import { NextRequest, NextResponse } from "next/server";
import { extractProfileData } from "@/lib/ai";
import { parseFile } from "@/lib/parsers";
import type { ProfileData, TechStackItem, Skill } from "@cli/src/types/profile";
import { getTechColor, getTechLogo } from "@/lib/tech-database";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Encodes a string for shields.io badge labels
 */
function encodeShieldsLabel(text: string): string {
  if (!text) return '';

  return text
    // 1. Double up dashes first (Shields.io syntax)
    .replace(/-/g, '--') 
    // 2. Replace spaces with underscores
    .replace(/ /g, '_')
    // 3. URL encode special chars (like # to %23, + to %2B)
    .replace(/[^\w\s\-\_]/g, (char) => encodeURIComponent(char));
}

/**
 * Creates a Skill object with badge fields
 */
function createSkill(skillName: string): Skill {
  return {
    name: skillName,
    encoded: encodeShieldsLabel(skillName),
    color: getTechColor(skillName),
    logo: getTechLogo(skillName),
  };
}

/**
 * Creates a TechStackItem from a technology name
 */
function createTechStackItem(techName: string): TechStackItem {
  return {
    name: techName,
    encoded: encodeShieldsLabel(techName),
    color: getTechColor(techName),
    logo: getTechLogo(techName),
  };
}

// AI extraction response type (different from ProfileData)
interface AIExtractionResponse {
  name?: string;
  title?: string;
  bio?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  skills?: {
    languages?: string[];
    frameworks?: string[];
    tools?: string[];
    other?: string[];
  };
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    url?: string;
    technologies?: string[];
  }>;
  experience?: Array<{
    company?: string;
    position?: string;
    duration?: string;
    description?: string;
  }>;
  education?: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
}

/**
 * POST /api/extract
 * Extract profile data from content without generating templates
 * Accepts: FormData (files) or JSON (text content)
 * Returns: Extracted ProfileData
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let content = "";
    let githubUsername = "";
    let provider: "gemini" | "openai" = "gemini";

    // Handle both JSON and FormData
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("files") as File[];
      const textContent = formData.get("content") as string | null;
      githubUsername = (formData.get("githubUsername") as string) || "";
      provider = ((formData.get("provider") as string) || "gemini") as
        | "gemini"
        | "openai";

      // Parse all files and combine content
      if (files && files.length > 0) {
        for (const file of files) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          console.log(JSON.stringify(file));
          const parsed = await parseFile(buffer, file.name);
          content += "\n\n" + parsed.content;
        }
      }

      // Add text content if provided
      if (textContent) {
        content = textContent + "\n\n" + content;
      }
    } else {
      // Handle JSON
      const body = await request.json();
      content = body.content || "";
      githubUsername = body.githubUsername || "";
      provider = body.provider || "gemini";
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 },
      );
    }

    // Step 1: Extract profile data using AI
    const aiResponse = (await extractProfileData(
      content,
      provider,
    )) as any as AIExtractionResponse;

    // Step 2: Transform to proper ProfileData format
    const transformedData: ProfileData = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      name: aiResponse.name || "",
      headline: aiResponse.title || "",
      bio: aiResponse.bio || "",
      location: aiResponse.location,
      email: aiResponse.email,
      templateId: "minimal-dark", // Default template

      // Transform skills from flat structure to categorized
      skills: aiResponse.skills
        ? [
            {
              category: "Languages",
              skills: (aiResponse.skills.languages || []).map(createSkill),
            },
            {
              category: "Frameworks",
              skills: (aiResponse.skills.frameworks || []).map(createSkill),
            },
            {
              category: "Tools",
              skills: (aiResponse.skills.tools || []).map(createSkill),
            },
            {
              category: "Other",
              skills: (aiResponse.skills.other || []).map(createSkill),
            },
          ].filter((cat) => cat.skills.length > 0)
        : [],

      // Transform achievements
      achievements: (aiResponse.achievements || []).map((ach, idx: number) => ({
        id: `ach-${idx}`,
        text: ach.title || ach.description || "",
        source: "cv" as const,
        isHighlighted: idx < 3, // Highlight first 3
      })),

      // Transform experience
      experience: (aiResponse.experience || []).map((exp) => ({
        company: exp.company || "",
        title: exp.position || "",
        startDate: exp.duration?.split(" - ")[0] || "",
        endDate:
          exp.duration?.split(" - ")[1] !== "Present"
            ? exp.duration?.split(" - ")[1]
            : undefined,
        description: exp.description || "",
        achievements: [],
      })),

      // Transform projects
      projects: (aiResponse.projects || []).map((proj, idx: number) => ({
        name: proj.name || "",
        description: proj.description || "",
        repoUrl: proj.url,
        technologies: (proj.technologies || []).map(createTechStackItem),
        isFeatured: idx < 3, // Feature first 3
      })),

      certifications: [],

      // Transform social links
      socialLinks: [
        aiResponse.github && {
          platform: "GitHub",
          url: `https://github.com/${aiResponse.github}`,
        },
        aiResponse.linkedin && {
          platform: "LinkedIn",
          url: aiResponse.linkedin,
        },
        aiResponse.website && {
          platform: "Website",
          url: aiResponse.website,
        },
      ].filter(Boolean) as any[],

      // Initialize GitHub stats
      githubStats: {
        username: githubUsername || aiResponse.github || "",
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        topLanguages: [],
        lastUpdated: new Date().toISOString(),
      },

      // Initialize tech stack (will be populated from skills or manually)
      techStack: [],
    };

    // Extract tech stack from skills and projects
    const techSet = new Set<string>();
    
    // Add from skills
    if (aiResponse.skills) {
      [
        ...(aiResponse.skills.languages || []),
        ...(aiResponse.skills.frameworks || []),
        ...(aiResponse.skills.tools || []),
      ].forEach(tech => techSet.add(tech));
    }
    
    // Add from projects
    (aiResponse.projects || []).forEach(proj => {
      (proj.technologies || []).forEach(tech => techSet.add(tech));
    });
    
    // Convert to TechStackItem array (limit to top 15)
    transformedData.techStack = Array.from(techSet)
      .slice(0, 15)
      .map(createTechStackItem);

    // Step 3: Enrich with GitHub stats if username provided
    const finalUsername = githubUsername || aiResponse.github;
    if (finalUsername) {
      try {
        const response = await fetch(
          `https://api.github.com/users/${finalUsername}`,
        );
        if (response.ok) {
          const userData = await response.json();
          const reposResponse = await fetch(
            `https://api.github.com/users/${finalUsername}/repos?per_page=100`,
          );
          const repos = reposResponse.ok ? await reposResponse.json() : [];

          const totalStars = repos.reduce(
            (sum: number, repo: any) => sum + repo.stargazers_count,
            0,
          );
          const totalForks = repos.reduce(
            (sum: number, repo: any) => sum + repo.forks_count,
            0,
          );

          const languages: Record<string, number> = {};
          repos.forEach((repo: any) => {
            if (repo.language) {
              languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
          });

          const total = Object.values(languages).reduce(
            (sum, count) => sum + count,
            0,
          );
          const topLanguages = Object.entries(languages)
            .map(([language, count]) => ({
              language,
              percentage: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);

          transformedData.githubStats = {
            username: finalUsername,
            totalRepos: userData.public_repos,
            totalStars,
            totalForks,
            topLanguages,
            lastUpdated: new Date().toISOString(),
          };
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stats:", error);
      }
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Profile extraction error:", error);
    const message =
      error instanceof Error
        ? error.message.length > 200
          ? error.message.substring(0, 200) + "..."
          : error.message
        : "Failed to extract profile";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
