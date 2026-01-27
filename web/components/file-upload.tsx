"use client";

import * as React from "react";
import { useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number;
  selectedFile?: File | null;
  isUploading?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = ".pdf,.docx,.doc,.txt",
  maxSize = 10 * 1024 * 1024, // 10MB
  selectedFile,
  isUploading = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [maxSize]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [maxSize]
  );

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    // Validate file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const acceptedExtensions = accept.split(',').map(ext => ext.trim());
    if (!acceptedExtensions.includes(extension)) {
      alert(`File type not supported. Accepted: ${accept}`);
      return;
    }

    onFileSelect(file);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card className={cn("border-2 border-dashed transition-colors", dragActive && "border-primary bg-primary/5")}>
      <CardContent className="p-6">
        {selectedFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            {!isUploading && onFileRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFileRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 text-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              Drag and drop your file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <Button onClick={onButtonClick} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Select File"}
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported: {accept} (max {maxSize / 1024 / 1024}MB)
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
