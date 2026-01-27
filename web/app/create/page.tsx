"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import type { ProfileData } from "@cli/src/types/profile";

type WizardStep = 'upload' | 'extract' | 'customize' | 'template' | 'preview';

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('minimal-dark');
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [githubUsername, setGithubUsername] = useState<string>('');

  // Step 1: Upload file
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setFileContent(result.data.content);
        setCurrentStep('extract');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Extract profile data
  const handleExtract = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: fileContent,
          provider: 'gemini',
          githubUsername,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProfileData(result.data);
        setCurrentStep('customize');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Extraction error:', error);
      alert('Failed to extract profile data');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 3: Generate README
  const handleGenerate = async () => {
    if (!profileData) return;

    setIsProcessing(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileData,
          templateId: selectedTemplate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedMarkdown(result.data.markdown);
        setCurrentStep('preview');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate README');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'upload', label: 'Upload' },
      { id: 'extract', label: 'Extract' },
      { id: 'customize', label: 'Customize' },
      { id: 'template', label: 'Template' },
      { id: 'preview', label: 'Preview' },
    ];

    const stepIndex = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index <= stepIndex
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {index < stepIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 transition-colors ${
                  index < stepIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/')} className="text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">Create Profile</span>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {renderStepIndicator()}

        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Upload Your CV or Resume</CardTitle>
              <CardDescription className="text-white/60">
                Upload your CV, resume, or LinkedIn export to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={() => setSelectedFile(null)}
                selectedFile={selectedFile}
                isUploading={isProcessing}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 2: Extract */}
        {currentStep === 'extract' && (
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">AI Extraction</CardTitle>
              <CardDescription className="text-white/60">
                Let AI extract your professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="github" className="text-white">GitHub Username (Optional)</Label>
                <Input
                  id="github"
                  placeholder="octocat"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-white/50 mt-1">
                  We'll fetch your GitHub stats and repositories
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('upload')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleExtract}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Extract with AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Customize */}
        {currentStep === 'customize' && profileData && (
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Customize Your Profile</CardTitle>
              <CardDescription className="text-white/60">
                Review and edit the extracted information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="headline" className="text-white">Headline</Label>
                <Input
                  id="headline"
                  value={profileData.headline}
                  onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('extract')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('template')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Template Selection */}
        {currentStep === 'template' && (
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Choose a Template</CardTitle>
              <CardDescription className="text-white/60">
                Select a design for your GitHub profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {['minimal-dark', 'minimal-light', 'portfolio-grid', 'stats-heavy', 'narrative', 'modern-visualist'].map((template) => (
                  <Card
                    key={template}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template
                        ? 'ring-2 ring-primary bg-primary/10'
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium text-white capitalize">
                        {template.replace('-', ' ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('customize')}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate README
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Preview */}
        {currentStep === 'preview' && (
          <div className="space-y-4">
            <MarkdownPreview markdown={generatedMarkdown} />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('template')}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => {
                  // Download README
                  const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'README.md';
                  a.click();
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Download README
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
