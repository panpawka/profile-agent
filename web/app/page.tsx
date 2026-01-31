"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Loader2,
  Download,
  Upload,
  FileText,
  Github,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ProfileData } from "@cli/src/types/profile";
import ProfileInputForm from "@/components/profile-input-form";
import ProfileTemplatePreview from "@/components/profile-template-preview";
import ExtractionUpdateForm from "@/components/multi-step-configuration";
import Footer from "@/components/footer";

const TEMPLATES = [
  { id: "minimal-dark", name: "Minimal Dark" },
  { id: "minimal-light", name: "Minimal Light" },
  { id: "portfolio-grid", name: "Portfolio Grid" },
  { id: "stats-heavy", name: "Stats Heavy" },
  { id: "narrative", name: "Narrative" },
  { id: "modern-visualist", name: "Modern Visualist" },
];

export default function HomePage() {
  const [content, setContent] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<
    Record<string, string>
  >({});
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-dark");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGenerate = async () => {
    if (!content.trim() && files.length === 0) {
      setError("Please add some content or upload files");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Step 1: Parse files if any (send to special parse endpoint)
      let finalContent = content;

      if (files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const parseResponse = await fetch("/api/oneshot", {
              method: "POST",
              body: formData,
            });
            const parseResult = await parseResponse.json();

            if (parseResult.success && parseResult.data?.content) {
              finalContent += "\n\n" + parseResult.data.content;
            }
          } catch (err) {
            console.error("File parsing error:", err);
            setError(`Failed to parse ${file.name}`);
            setIsGenerating(false);
            return;
          }
        }
      }

      // Step 2: Generate for all templates in parallel
      const generatePromises = TEMPLATES.map(async (template) => {
        const response = await fetch("/api/oneshot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: finalContent,
            githubUsername,
            templateId: template.id,
            provider: "gemini",
          }),
        });

        const result = await response.json();
        return { templateId: template.id, result };
      });

      const results = await Promise.all(generatePromises);

      const markdowns: Record<string, string> = {};
      let savedProfileData: ProfileData | null = null;

      for (const { templateId, result } of results) {
        if (result.success) {
          markdowns[templateId] = result.data.markdown;
          if (!savedProfileData) {
            savedProfileData = result.data.profileData;
          }
        } else {
          setError(result.error || "Failed to generate README");
          setIsGenerating(false);
          return;
        }
      }

      if (
        savedProfileData &&
        Object.keys(markdowns).length === TEMPLATES.length
      ) {
        setProfileData(savedProfileData);
        setGeneratedMarkdown(markdowns);
        setSelectedTemplate(TEMPLATES[0].id);
      } else {
        setError("Some templates failed to generate");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const markdown = generatedMarkdown[selectedTemplate];
    if (!markdown) return;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [currentStep, setCurrentStep] = useState<
    "user-input" | "validation" | "preview"
  >("user-input");

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            AI GitHub Profile Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Drop files, paste content, or write directly. Generate instantly.
          </p>
        </div>

        {currentStep === "user-input" && (
          /* Input Stage */
          <div className="max-w-3xl mx-auto">
            <ProfileInputForm />
          </div>
        )}

        {currentStep === "validation" && (
          /* Validation Stage */
          <div className="max-w-3xl mx-auto">
            <ExtractionUpdateForm />
          </div>
        )}

        {currentStep === "preview" && (
          /* Preview Stage with Template Switching */
          <div className="space-y-4">
            <ProfileTemplatePreview />
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your README</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setProfileData(null);
                    setGeneratedMarkdown({});
                    setContent("");
                    setFiles([]);
                  }}
                  variant="outline"
                  className="text-white border-white/20">
                  Start Over
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <Tabs
                  value={selectedTemplate}
                  onValueChange={setSelectedTemplate}>
                  <TabsList className="bg-white/10 mb-4 w-full">
                    {TEMPLATES.map((template) => (
                      <TabsTrigger
                        key={template.id}
                        value={template.id}
                        className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-600 flex-1">
                        {template.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {TEMPLATES.map((template) => (
                    <TabsContent
                      key={template.id}
                      value={template.id}>
                      <div className="bg-white rounded-lg p-8 overflow-auto max-h-[700px] prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {generatedMarkdown[template.id] || "Loading..."}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
