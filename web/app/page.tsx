"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import type { ProfileData } from "@cli/src/types/profile";
import ProfileInputForm from "@/components/profile-input-form";
import ProfileTemplatePreview from "@/components/profile-template-preview";
import ExtractionUpdateForm from "@/components/multi-step-configuration";
import Footer from "@/components/footer";
import { useProfilePersistence } from "@/hooks/use-profile-persistence";

export default function HomePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-dark");
  const [currentStep, setCurrentStep] = useState<
    "input" | "validation" | "preview"
  >("input");
  const [isLoading, setIsLoading] = useState(true);

  // Get persistence functions
  const { loadProfileData, saveProfileData, clearProfileData, hasExistingData } =
    useProfilePersistence();

  // Load data on mount
  useEffect(() => {
    const { data, step } = loadProfileData();
    if (data) {
      setProfileData(data);
      setCurrentStep(step);
    }
    setIsLoading(false);
  }, [loadProfileData]);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading && profileData) {
      saveProfileData(profileData, currentStep);
    }
  }, [profileData, currentStep, saveProfileData, isLoading]);

  // Handle extraction completion
  const handleExtracted = (data: ProfileData) => {
    console.log("Extracted data:", data);
    setProfileData(data);
    setCurrentStep("validation");
  };

  // Handle validation/update completion
  const handleValidationComplete = (updatedData: ProfileData) => {
    setProfileData(updatedData);
    setCurrentStep("preview");
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Handle starting over
  const handleStartOver = () => {
    clearProfileData();
    setProfileData(null);
    setSelectedTemplate("minimal-dark");
    setCurrentStep("input");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            AI GitHub Profile Generator
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Drop files, paste content, or write directly. Generate instantly.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 gap-2">
          <StepIndicator
            label="Upload"
            active={currentStep === "input"}
            completed={
              currentStep === "validation" || currentStep === "preview"
            }
          />
          <div className="h-[2px] w-16 bg-muted" />
          <StepIndicator
            label="Validate"
            active={currentStep === "validation"}
            completed={currentStep === "preview"}
          />
          <div className="h-[2px] w-16 bg-muted" />
          <StepIndicator
            label="Preview"
            active={currentStep === "preview"}
            completed={false}
          />
        </div>

        {/* Input Stage */}
        {currentStep === "input" && (
          <div className="max-w-3xl mx-auto">
            <ProfileInputForm onExtracted={handleExtracted} />
          </div>
        )}

        {/* Validation Stage */}
        {currentStep === "validation" && profileData && (
          <div className="max-w-3xl mx-auto">
            <ExtractionUpdateForm
              profileData={profileData}
              onComplete={handleValidationComplete}
              onBack={() => setCurrentStep("input")}
            />
          </div>
        )}

        {/* Preview Stage */}
        {currentStep === "preview" && profileData && (
          <div className="space-y-4">
            <ProfileTemplatePreview
              profileData={profileData}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
              onStartOver={handleStartOver}
              onBack={() => setCurrentStep("validation")}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Step Indicator Component
function StepIndicator({
  label,
  active,
  completed,
}: {
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
          completed
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
              : "bg-muted text-muted-foreground"
        }`}>
        {completed ? "✓" : label[0]}
      </div>
      <span
        className={`text-xs font-medium ${
          active ? "text-primary" : "text-muted-foreground"
        }`}>
        {label}
      </span>
    </div>
  );
}
