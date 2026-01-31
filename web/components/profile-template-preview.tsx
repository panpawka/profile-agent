"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Eye, Code, Loader2, ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ProfileData } from "@cli/src/types/profile";
import { cn } from "@/lib/utils";

// Custom sanitize schema that allows HTML elements commonly used in GitHub READMEs
const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      ...(defaultSchema.attributes?.["*"] || []),
      "className",
      "align",
      "style",
      "width",
      "height",
    ],
    div: ["align", "className", "style"],
    img: ["src", "alt", "title", "width", "height", "align"],
    a: ["href", "title", "target", "rel"],
    td: ["align", "colspan", "rowspan"],
    th: ["align", "colspan", "rowspan"],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "div",
    "span",
    "br",
    "hr",
    "center",
  ],
};

const TEMPLATES = [
  { id: "minimal-dark", name: "Minimal Dark" },
  { id: "minimal-light", name: "Minimal Light" },
  { id: "portfolio-grid", name: "Portfolio Grid" },
  { id: "stats-heavy", name: "Stats Heavy" },
  { id: "narrative", name: "Narrative" },
  { id: "modern-visualist", name: "Modern Visualist" },
  { id: "panpawka", name: "Pan Pawka" },
];

interface ProfileTemplatePreviewProps {
  profileData: ProfileData;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onStartOver: () => void;
  onBack: () => void;
}

const ProfileTemplatePreview = ({
  profileData,
  selectedTemplate,
  onTemplateSelect,
  onStartOver,
  onBack,
}: ProfileTemplatePreviewProps) => {
  const [renderedTemplates, setRenderedTemplates] = useState<
    Record<string, { markdown: string; config: any }>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copySuccess, setCopySuccess] = useState(false);

  // Render all templates when component mounts
  useEffect(() => {
    const renderTemplates = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/templates/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileData }),
        });

        const result = await response.json();

        if (result.success) {
          setRenderedTemplates(result.data);
        } else {
          setError(result.error || "Failed to render templates");
        }
      } catch (err) {
        console.error("Template rendering error:", err);
        setError("An error occurred while rendering templates");
      } finally {
        setIsLoading(false);
      }
    };

    renderTemplates();
  }, [profileData]);

  const handleCopy = async () => {
    const markdown = renderedTemplates[selectedTemplate]?.markdown;
    if (!markdown) return;

    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const markdown = renderedTemplates[selectedTemplate]?.markdown;
    if (!markdown) return;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentMarkdown = renderedTemplates[selectedTemplate]?.markdown || "";

  return (
    <div className="w-full space-y-6">
      {/* Add custom styles for HTML in markdown */}
      <style
        jsx
        global>{`
        .markdown-preview img {
          max-width: 100%;
          height: auto;
          display: inline-block;
        }
        .markdown-preview div[align="center"] {
          text-align: center;
          display: block;
          width: 100%;
        }
        .markdown-preview table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
        }
        .markdown-preview table td,
        .markdown-preview table th {
          padding: 0.5em;
          border: 1px solid #ddd;
        }
        /* Ensure markdown headings are styled */
        .markdown-preview h1 {
          font-size: 2.25em;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-preview h2 {
          font-size: 1.875em;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .markdown-preview h3 {
          font-size: 1.5em;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .markdown-preview h4 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        /* Lists */
        .markdown-preview ul,
        .markdown-preview ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .markdown-preview li {
          margin: 0.5rem 0;
        }
        /* Links */
        .markdown-preview a {
          color: #2563eb;
          text-decoration: none;
        }
        .markdown-preview a:hover {
          text-decoration: underline;
        }
        /* Dark mode links */
        @media (prefers-color-scheme: dark) {
          .markdown-preview a {
            color: #60a5fa;
          }
        }
        /* Paragraphs */
        .markdown-preview p {
          margin: 1rem 0;
          line-height: 1.75;
        }
        /* Blockquotes */
        .markdown-preview blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        /* Code blocks */
        .markdown-preview pre {
          margin: 1rem 0;
          border-radius: 0.375rem;
          overflow-x: auto;
        }
        .markdown-preview code {
          font-family:
            ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            "Liberation Mono", monospace;
        }
        .markdown-preview :not(pre) > code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        @media (prefers-color-scheme: dark) {
          .markdown-preview :not(pre) > code {
            background-color: #374151;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Preview Your README</h2>
          <p className="text-muted-foreground mt-1">
            Choose a template and preview your GitHub profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={onStartOver}>
            Start Over
          </Button>
        </div>
      </div>

      {/* Template Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Select Template</h3>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((template) => (
                <Badge
                  key={template.id}
                  variant={
                    selectedTemplate === template.id ? "default" : "outline"
                  }
                  className={cn(
                    "cursor-pointer px-4 py-2 text-sm transition-all",
                    selectedTemplate === template.id &&
                      "ring-2 ring-primary ring-offset-2",
                  )}
                  onClick={() => onTemplateSelect(template.id)}>
                  {template.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Rendering templates...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="py-6">
            <p className="text-destructive text-center">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {!isLoading && !error && (
        <Card>
          <CardContent className="p-0">
            {/* GitHub-style Header */}
            <div className="border-b bg-muted/50 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList className="h-8">
                    <TabsTrigger
                      value="preview"
                      className="text-xs gap-1">
                      <Eye className="h-3 w-3" />
                      Preview
                    </TabsTrigger>
                    <TabsTrigger
                      value="code"
                      className="text-xs gap-1">
                      <Code className="h-3 w-3" />
                      Code
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 text-xs">
                  {copySuccess ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleDownload}
                  className="h-8 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[600px] overflow-y-auto">
              {viewMode === "preview" ? (
                <div className="p-8 prose prose-slate dark:prose-invert max-w-none prose-img:mx-auto prose-table:w-full prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline markdown-preview">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                      rehypeRaw,
                      [rehypeSanitize, customSanitizeSchema],
                    ]}
                    components={{
                      code({ className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        const inline = !className;
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div">
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className={className}
                            {...props}>
                            {children}
                          </code>
                        );
                      },
                      h1: ({ children, ...props }) => (
                        <h1
                          className="text-4xl font-bold mb-4 mt-6"
                          {...props}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children, ...props }) => (
                        <h2
                          className="text-3xl font-bold mb-3 mt-5"
                          {...props}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children, ...props }) => (
                        <h3
                          className="text-2xl font-bold mb-2 mt-4"
                          {...props}>
                          {children}
                        </h3>
                      ),
                      h4: ({ children, ...props }) => (
                        <h4
                          className="text-xl font-semibold mb-2 mt-3"
                          {...props}>
                          {children}
                        </h4>
                      ),
                      ul: ({ children, ...props }) => (
                        <ul
                          className="list-disc pl-6 my-4 space-y-2"
                          {...props}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children, ...props }) => (
                        <ol
                          className="list-decimal pl-6 my-4 space-y-2"
                          {...props}>
                          {children}
                        </ol>
                      ),
                      li: ({ children, ...props }) => (
                        <li
                          className="leading-relaxed"
                          {...props}>
                          {children}
                        </li>
                      ),
                      a: ({ href, children, ...props }: any) => (
                        <a
                          href={href}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}>
                          {children}
                        </a>
                      ),
                      p: ({ children, ...props }) => (
                        <p
                          className="my-4 leading-relaxed"
                          {...props}>
                          {children}
                        </p>
                      ),
                      blockquote: ({ children, ...props }) => (
                        <blockquote
                          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4"
                          {...props}>
                          {children}
                        </blockquote>
                      ),
                    }}>
                    {currentMarkdown}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="relative">
                  <SyntaxHighlighter
                    language="markdown"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      maxHeight: "600px",
                    }}
                    showLineNumbers>
                    {currentMarkdown}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Add missing Check icon
function Check({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default ProfileTemplatePreview;
