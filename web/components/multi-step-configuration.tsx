"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  X,
  Share2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxGroup,
  ComboboxLabel,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import type {
  ProfileData,
  Project,
  Experience,
  TechStackItem,
} from "@cli/src/types/profile";
import {
  TECH_CATEGORIES,
  getTechColor,
  getTechLogo,
} from "@/lib/tech-database";

/**
 * Formats a string to be URL-safe for Shields.io badge labels/messages.
 * Example: "C#" -> "C%23"
 * Example: "Tailwind CSS" -> "Tailwind_CSS"
 * Example: "Semi-Colon" -> "Semi--Colon"
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

/**
 * Generates a shields.io badge URL for a technology
 */
function generateBadgeUrl(tech: TechStackItem): string {
  return `https://img.shields.io/badge/-${tech.encoded}-${tech.color}?style=flat-square&logo=${tech.logo}&logoColor=white`;
}

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Experience" },
  { id: "projects", title: "Projects" },
];

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

interface ExtractionUpdateFormProps {
  profileData: ProfileData;
  onComplete: (data: ProfileData) => void;
  onBack: () => void;
}

const ExtractionUpdateForm = ({
  profileData,
  onComplete,
  onBack,
}: ExtractionUpdateFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const updateField = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step - complete
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  // Check if step is valid for next button
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "" && formData.headline.trim() !== "";
      case 1:
        return formData.skills.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Share link banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">
                Save your progress
              </p>
              <p className="text-sm text-muted-foreground">
                Your data is automatically saved. Copy the link to continue
                later or share it.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center gap-2">
            {showCopiedMessage ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              whileHover={{ scale: 1.1 }}>
              <motion.div
                className={cn(
                  "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep
                      ? "bg-primary ring-4 ring-primary/20"
                      : "bg-muted",
                )}
                onClick={() => {
                  if (index <= currentStep) {
                    setCurrentStep(index);
                  }
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className={cn(
                  "text-xs mt-1.5 hidden sm:block",
                  index === currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground",
                )}>
                {step.title}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="border shadow-md rounded-3xl overflow-hidden">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}>
                {/* Step 1: Personal Info */}
                {currentStep === 0 && (
                  <PersonalInfoStep
                    formData={formData}
                    updateField={updateField}
                  />
                )}

                {/* Step 2: Skills */}
                {currentStep === 1 && (
                  <SkillsStep
                    formData={formData}
                    updateField={updateField}
                  />
                )}

                {/* Step 3: Experience */}
                {currentStep === 2 && (
                  <ExperienceStep
                    formData={formData}
                    updateField={updateField}
                  />
                )}

                {/* Step 4: Projects */}
                {currentStep === 3 && (
                  <ProjectsStep
                    formData={formData}
                    updateField={updateField}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={currentStep === 0 ? onBack : prevStep}
                  className="flex items-center gap-1 transition-all duration-300 rounded-2xl">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={cn(
                    "flex items-center gap-1 transition-all duration-300 rounded-2xl",
                  )}>
                  {currentStep === steps.length - 1 ? "Complete" : "Next"}
                  {currentStep === steps.length - 1 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      {/* Step indicator */}
      <motion.div
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}>
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
};

// Personal Info Step
function PersonalInfoStep({
  formData,
  updateField,
}: {
  formData: ProfileData;
  updateField: <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => void;
}) {
  const anchor = useComboboxAnchor();
  
  // Get tech names from tech stack for the combobox
  const techStackNames = formData.techStack?.map((tech) => tech.name) || [];

  const handleTechStackChange = (newTechNames: string[]) => {
    // Map technology names to TechStackItem objects with encoded, color, and logo
    const techStackItems: TechStackItem[] = newTechNames.map((techName) => {
      // Check if we already have this tech in the stack to preserve its data
      const existingTech = formData.techStack?.find((t) => t.name === techName);
      if (existingTech) {
        return existingTech;
      }
      
      // Create new TechStackItem
      return createTechStackItem(techName);
    });
    
    updateField("techStack", techStackItems);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Review and update your basic profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline">Headline *</Label>
          <Input
            id="headline"
            value={formData.headline}
            onChange={(e) => updateField("headline", e.target.value)}
            placeholder="Full Stack Developer | Open Source Enthusiast"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="A brief description about yourself..."
            className="min-h-[100px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Tech Stack</Label>
          <p className="text-xs text-muted-foreground">
            Select your main technologies (these will appear as badges in your profile)
          </p>
          <Combobox
            multiple
            value={techStackNames}
            onValueChange={handleTechStackChange}>
            <ComboboxChips ref={anchor}>
              {techStackNames.map((tech) => (
                <ComboboxChip key={tech}>
                  <img
                    src={generateBadgeUrl(formData.techStack?.find(t => t.name === tech) || createTechStackItem(tech))}
                    alt={tech}
                    className="h-4"
                  />
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Select or type technologies..." />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxList>
                <ComboboxEmpty>No matching technologies</ComboboxEmpty>
                {TECH_CATEGORIES.map((category) => (
                  <ComboboxGroup key={category.name}>
                    <ComboboxLabel>{category.name}</ComboboxLabel>
                    {category.technologies.map((tech: string) => (
                      <ComboboxItem key={tech} value={tech}>
                        <img
                          src={generateBadgeUrl(createTechStackItem(tech))}
                          alt={tech}
                          className="h-4"
                        />
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </CardContent>
    </>
  );
}

// Skills Step
function SkillsStep({
  formData,
  updateField,
}: {
  formData: ProfileData;
  updateField: <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => void;
}) {
  const addSkillCategory = () => {
    updateField("skills", [...formData.skills, { category: "", skills: [] }]);
  };

  const updateCategory = (index: number, category: string) => {
    const updated = [...formData.skills];
    updated[index] = { ...updated[index], category };
    updateField("skills", updated);
  };

  const addSkill = (categoryIndex: number) => {
    const updated = [...formData.skills];
    updated[categoryIndex].skills.push(createTechStackItem(""));
    updateField("skills", updated);
  };

  const updateSkill = (
    categoryIndex: number,
    skillIndex: number,
    name: string,
  ) => {
    const updated = [...formData.skills];
    updated[categoryIndex].skills[skillIndex] = createTechStackItem(name);
    updateField("skills", updated);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = [...formData.skills];
    updated[categoryIndex].skills.splice(skillIndex, 1);
    updateField("skills", updated);
  };

  const removeCategory = (index: number) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    updateField("skills", updated);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Organize your skills into categories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {formData.skills.map((category, catIndex) => (
          <Card
            key={catIndex}
            className="p-4 border-2 border-primary/20 bg-primary/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold text-primary shrink-0">
                  Category:
                </Label>
                <Input
                  value={category.category}
                  onChange={(e) => updateCategory(catIndex, e.target.value)}
                  placeholder="Category name (e.g., Languages)"
                  className="flex-1 font-medium bg-background"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCategory(catIndex)}
                  className="shrink-0">
                  <X className="h-4 w-4 mr-1" />
                  Remove Category
                </Button>
              </div>
              <div className="space-y-2 pl-6 border-l-2 border-primary/30">
                <Label className="text-xs text-muted-foreground">
                  Skills in this category:
                </Label>
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) =>
                        updateSkill(catIndex, skillIndex, e.target.value)
                      }
                      placeholder="Skill name"
                      className="flex-1 bg-background"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(catIndex, skillIndex)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addSkill(catIndex)}
                  className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Skill
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={addSkillCategory}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Skill Category
        </Button>
      </CardContent>
    </>
  );
}

// Experience Step
function ExperienceStep({
  formData,
  updateField,
}: {
  formData: ProfileData;
  updateField: <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => void;
}) {
  const addExperience = () => {
    updateField("experience", [
      ...formData.experience,
      {
        company: "",
        title: "",
        startDate: "",
        description: "",
        achievements: [],
      },
    ]);
  };

  const updateExperience = <K extends keyof Experience>(
    index: number,
    field: K,
    value: Experience[K],
  ) => {
    const updated = [...formData.experience];
    updated[index] = { ...updated[index], [field]: value };
    updateField("experience", updated);
  };

  const removeExperience = (index: number) => {
    const updated = formData.experience.filter((_, i) => i !== index);
    updateField("experience", updated);
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements.push("");
    updateField("experience", updated);
  };

  const updateAchievement = (
    expIndex: number,
    achievementIndex: number,
    value: string,
  ) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements[achievementIndex] = value;
    updateField("experience", updated);
  };

  const removeAchievement = (expIndex: number, achievementIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].achievements.splice(achievementIndex, 1);
    updateField("experience", updated);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your professional experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {formData.experience.map((exp, index) => (
          <Card
            key={index}
            className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company"
                />
                <Input
                  value={exp.title}
                  onChange={(e) =>
                    updateExperience(index, "title", e.target.value)
                  }
                  placeholder="Job Title"
                />
                <Input
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                  placeholder="Start Date"
                />
                <Input
                  value={exp.endDate || ""}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "endDate",
                      e.target.value || undefined,
                    )
                  }
                  placeholder="End Date (or leave empty)"
                />
              </div>
              <Textarea
                value={exp.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
                placeholder="Description"
                className="min-h-[80px]"
              />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Achievements</Label>
                <div className="space-y-2 pl-4 border-l-2 border-muted">
                  {exp.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} className="flex items-start gap-2">
                      <Textarea
                        value={achievement}
                        onChange={(e) =>
                          updateAchievement(index, achIndex, e.target.value)
                        }
                        placeholder="Describe an achievement or key responsibility"
                        className="flex-1 min-h-[60px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(index, achIndex)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(index)}
                    className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Achievement
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
        <Button
          variant="outline"
          onClick={addExperience}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </CardContent>
    </>
  );
}

// Projects Step
function ProjectsStep({
  formData,
  updateField,
}: {
  formData: ProfileData;
  updateField: <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K],
  ) => void;
}) {
  const addProject = () => {
    updateField("projects", [
      ...formData.projects,
      { name: "", description: "", technologies: [], isFeatured: false },
    ]);
  };

  const updateProject = <K extends keyof Project>(index: number, field: K, value: Project[K]) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    updateField("projects", updated);
  };

  const removeProject = (index: number) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    updateField("projects", updated);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Showcase your notable projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
        {formData.projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            index={index}
            updateProject={updateProject}
            removeProject={removeProject}
          />
        ))}
        <Button
          variant="outline"
          onClick={addProject}
          className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </CardContent>
    </>
  );
}

// Separate component for project card to manage combobox state
function ProjectCard({
  project,
  index,
  updateProject,
  removeProject,
}: {
  project: Project;
  index: number;
  updateProject: <K extends keyof Project>(index: number, field: K, value: Project[K]) => void;
  removeProject: (index: number) => void;
}) {
  const anchor = useComboboxAnchor();
  
  // Get tech names from technologies for the combobox
  const techNames = project.technologies.map((tech) => tech.name);

  const handleTechChange = (newTechNames: string[]) => {
    // Map technology names to TechStackItem objects
    const techStackItems: TechStackItem[] = newTechNames.map((techName) => {
      // Check if we already have this tech to preserve its data
      const existingTech = project.technologies.find((t) => t.name === techName);
      if (existingTech) {
        return existingTech;
      }
      
      // Create new TechStackItem
      return createTechStackItem(techName);
    });
    
    updateProject(index, "technologies", techStackItems);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium">Project {index + 1}</h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeProject(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Input
          value={project.name}
          onChange={(e) => updateProject(index, "name", e.target.value)}
          placeholder="Project Name"
        />
        <Textarea
          value={project.description}
          onChange={(e) =>
            updateProject(index, "description", e.target.value)
          }
          placeholder="Description"
          className="min-h-[80px]"
        />
        <Input
          value={project.repoUrl || ""}
          onChange={(e) =>
            updateProject(index, "repoUrl", e.target.value || undefined)
          }
          placeholder="Repository URL"
        />
        
        <div className="space-y-2">
          <Label>Technologies</Label>
          <Combobox
            multiple
            value={techNames}
            onValueChange={handleTechChange}>
            <ComboboxChips ref={anchor}>
              {project.technologies.map((tech) => (
                <ComboboxChip key={tech.name}>
                  <img
                    src={generateBadgeUrl(tech)}
                    alt={tech.name}
                    className="h-4"
                  />
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder="Select or type technologies..." />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxList>
                <ComboboxEmpty>No matching technologies</ComboboxEmpty>
                {TECH_CATEGORIES.map((category) => (
                  <ComboboxGroup key={category.name}>
                    <ComboboxLabel>{category.name}</ComboboxLabel>
                    {category.technologies.map((tech: string) => (
                      <ComboboxItem key={tech} value={tech}>
                        <img
                          src={generateBadgeUrl(createTechStackItem(tech))}
                          alt={tech}
                          className="h-4"
                        />
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </div>
    </Card>
  );
}

// Education Step
// Education step removed - no longer needed for GitHub profiles


export default ExtractionUpdateForm;
