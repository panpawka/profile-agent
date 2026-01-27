"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, Loader2, Download, Upload, FileText, Github } from "lucide-react";
import type { ProfileData } from "@cli/src/types/profile";

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
  const [generatedMarkdown, setGeneratedMarkdown] = useState<Record<string, string>>({});
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
    // Build content from text + files
    let finalContent = content;
    
    if (files.length > 0) {
      // Upload files first
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/oneshot', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result.success) {
            finalContent += "\n\n" + result.data.content;
          }
        } catch (err) {
          console.error('File upload error:', err);
        }
      }
    }

    if (!finalContent.trim()) {
      setError("Please add some content or upload files");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch('/api/oneshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: finalContent,
          githubUsername,
          templateId: selectedTemplate,
          provider: 'gemini',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProfileData(result.data.profileData);
        // Generate for all templates
        const markdowns: Record<string, string> = {};
        for (const template of TEMPLATES) {
          const templateResponse = await fetch('/api/oneshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: finalContent,
              githubUsername,
              templateId: template.id,
              provider: 'gemini',
            }),
          });
          const templateResult = await templateResponse.json();
          if (templateResult.success) {
            markdowns[template.id] = templateResult.data.markdown;
          }
        }
        setGeneratedMarkdown(markdowns);
        setSelectedTemplate(TEMPLATES[0].id);
      } else {
        setError(result.error || 'Failed to generate README');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const markdown = generatedMarkdown[selectedTemplate];
    if (!markdown) return;
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">ProfileAgent</span>
          </div>
          <a 
            href="https://github.com/profileagent/profileagent" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            AI GitHub Profile Generator
          </h1>
          <p className="text-lg text-white/70">
            Drop files, paste content, or write directly. Generate instantly.
          </p>
        </div>

        {!profileData ? (
          /* Input Stage */
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  Your Professional Information
                </CardTitle>
                <CardDescription className="text-white/60">
                  Paste CV, upload files, or type directly. We support everything.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Drop Zone */}
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 transition-colors",
                    dragActive ? "border-blue-400 bg-blue-400/10" : "border-white/20",
                    files.length > 0 && "bg-green-500/10 border-green-500/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto text-white/40 mb-2" />
                    <p className="text-white/70 mb-2">
                      {files.length > 0 ? `${files.length} file(s) selected` : 'Drag & drop files here'}
                    </p>
                    <p className="text-sm text-white/50 mb-3">or</p>
                    <label htmlFor="file-upload" className="inline-block">
                      <Button variant="outline" className="text-white border-white/20" type="button">
                        <FileText className="mr-2 h-4 w-4" />
                        Choose Files
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {files.length > 0 && (
                      <div className="mt-3 text-sm text-white/60">
                        {files.map((f, i) => (
                          <div key={i}>{f.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Input */}
                <div>
                  <Label htmlFor="content" className="text-white">
                    Or Paste Content Directly
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your CV, resume, LinkedIn profile, or write about yourself..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 font-mono text-sm"
                  />
                  <p className="text-xs text-white/50 mt-1">{content.length} characters</p>
                </div>

                {/* GitHub Username */}
                <div>
                  <Label htmlFor="github" className="text-white">
                    GitHub Username (Optional)
                  </Label>
                  <Input
                    id="github"
                    placeholder="octocat"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-white/50 mt-1">We'll fetch your stats and repos</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || (!content.trim() && files.length === 0)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate README
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Preview Stage with Template Switching */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your README</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
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
                  className="text-white border-white/20"
                >
                  Start Over
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <Tabs value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <TabsList className="bg-white/10 mb-4">
                    {TEMPLATES.map((template) => (
                      <TabsTrigger
                        key={template.id}
                        value={template.id}
                        className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-blue-600"
                      >
                        {template.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {TEMPLATES.map((template) => (
                    <TabsContent key={template.id} value={template.id}>
                      <div className="bg-slate-900 rounded-lg p-6 overflow-auto max-h-[600px]">
                        <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                          {generatedMarkdown[template.id] || 'Loading...'}
                        </pre>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          <p>Built with ❤️ using Next.js, React 19, and Vercel AI SDK</p>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
