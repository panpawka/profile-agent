"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Download, Github } from "lucide-react";
import { MarkdownPreview } from "@/components/markdown-preview";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [templateId, setTemplateId] = useState("minimal-dark");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please paste your CV, resume, or professional information");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedMarkdown("");

    try {
      const response = await fetch('/api/oneshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          githubUsername,
          templateId,
          provider: 'gemini',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedMarkdown(result.data.markdown);
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
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
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
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/profileagent/profileagent" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              AI-Powered GitHub Profile
              <span className="block text-blue-400 mt-2">In One Shot</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Paste your CV, resume, or LinkedIn content. Get a beautiful GitHub README instantly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-400" />
                  Your Information
                </CardTitle>
                <CardDescription className="text-white/60">
                  Paste everything - CV, resume, LinkedIn export, or just write about yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="content" className="text-white">
                    Professional Content
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Paste your CV, resume, LinkedIn export, or write about your experience, skills, projects..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 font-mono text-sm"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    {content.length} characters
                  </p>
                </div>

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
                  <p className="text-xs text-white/50 mt-1">
                    We'll fetch your GitHub stats and repos
                  </p>
                </div>

                <div>
                  <Label htmlFor="template" className="text-white">
                    Template
                  </Label>
                  <select
                    id="template"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="w-full h-9 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-white"
                  >
                    <option value="minimal-dark">Minimal Dark</option>
                    <option value="minimal-light">Minimal Light</option>
                    <option value="portfolio-grid">Portfolio Grid</option>
                    <option value="stats-heavy">Stats Heavy</option>
                    <option value="narrative">Narrative</option>
                    <option value="modern-visualist">Modern Visualist</option>
                  </select>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !content.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating with AI...
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

            {/* Preview Section */}
            <div className="space-y-4">
              {generatedMarkdown ? (
                <>
                  <Card className="bg-white/5 border-white/10 backdrop-blur">
                    <CardHeader>
                      <CardTitle className="text-white">Preview</CardTitle>
                      <CardDescription className="text-white/60">
                        Your generated GitHub profile README
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-slate dark:prose-invert max-w-none overflow-auto max-h-[500px]">
                      <div className="text-white text-sm">
                        <pre className="whitespace-pre-wrap">{generatedMarkdown}</pre>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download README.md
                  </Button>
                </>
              ) : (
                <Card className="bg-white/5 border-white/10 backdrop-blur h-[600px] flex items-center justify-center">
                  <div className="text-center text-white/40 p-8">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your README will appear here</p>
                    <p className="text-sm mt-2">Paste your content and click Generate</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
            <div className="text-white/80">
              <div className="text-3xl font-bold text-blue-400 mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Instant Generation</h3>
              <p className="text-sm text-white/60">No forms, no steps. Just paste and generate.</p>
            </div>
            <div className="text-white/80">
              <div className="text-3xl font-bold text-purple-400 mb-2">🤖</div>
              <h3 className="font-semibold mb-1">AI-Powered</h3>
              <p className="text-sm text-white/60">Gemini Flash extracts your professional story.</p>
            </div>
            <div className="text-white/80">
              <div className="text-3xl font-bold text-green-400 mb-2">🎨</div>
              <h3 className="font-semibold mb-1">6 Templates</h3>
              <p className="text-sm text-white/60">Choose from professionally designed themes.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          <p>Built with ❤️ using Next.js, React, and Vercel AI SDK</p>
          <p className="mt-2">
            <a href="https://github.com/profileagent/profileagent" className="hover:text-white/80">
              Open Source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
