"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

export function MarkdownPreview({ markdown, className }: MarkdownPreviewProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          Live preview of your GitHub README
        </CardDescription>
      </CardHeader>
      <CardContent className="prose prose-slate dark:prose-invert max-w-none overflow-auto max-h-[600px]">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}
