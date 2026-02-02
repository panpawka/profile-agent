import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputActionButton,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
  PromptInputActionAddAttachmentsButton,
} from "@/components/ai-elements/prompt-input";
import { MicIcon, InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import type { ProfileData } from "@cli/src/types/profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfilePersistence } from "@/hooks/use-profile-persistence";

const SUBMITTING_TIMEOUT = 200;

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}>
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

interface ProfileInputFormProps {
  onExtracted: (profileData: ProfileData) => void;
}

const ProfileInputForm = ({ onExtracted }: ProfileInputFormProps) => {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [showGithubDialog, setShowGithubDialog] = useState(false);
  const [tempGithubUsername, setTempGithubUsername] = useState("");
  const [error, setError] = useState("");
  const [showExistingDataBanner, setShowExistingDataBanner] = useState(false);

  const { hasExistingData, loadProfileData } = useProfilePersistence();

  // Check for existing data on mount
  useEffect(() => {
    const check = async () => {
      if (hasExistingData()) {
        setShowExistingDataBanner(true);
      }
    };
    check();
  }, [hasExistingData]);

  const handleRestoreData = () => {
    const { data } = loadProfileData();
    if (data) {
      onExtracted(data);
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");
    setError("");

    try {
      // Create FormData for multipart upload
      const formData = new FormData();

      // Add text content
      if (message.text) {
        formData.append("content", message.text);
      }

      // Add files
      if (message.files) {
        for (const file of message.files) {
          // Convert FileUIPart to File/Blob
          const blob = await fetch(file.url).then((r) => r.blob());
          const fileName = (file as any).filename || "file.bin";
          const actualFile = new File([blob], fileName, {
            type: file.type || "application/octet-stream",
          });
          formData.append("files", actualFile);
        }
      }

      // Add GitHub username if provided
      if (githubUsername) {
        formData.append("githubUsername", githubUsername);
      }

      // Add provider preference
      formData.append("provider", "gemini");

      setTimeout(() => {
        setStatus("streaming");
      }, SUBMITTING_TIMEOUT);

      // Call extraction API
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        setStatus("ready");
        onExtracted(result.data);
      } else {
        setStatus("error");
        setError(result.error || "Failed to extract profile data");
        setTimeout(() => setStatus("ready"), 2000);
      }
    } catch (err) {
      console.error("Extraction error:", err);
      setStatus("error");
      setError("An error occurred. Please try again.");
      setTimeout(() => setStatus("ready"), 2000);
    }
  };

  const handleGithubButtonClick = () => {
    setTempGithubUsername(githubUsername);
    setShowGithubDialog(true);
  };

  const handleGithubSave = () => {
    setGithubUsername(tempGithubUsername);
    setShowGithubDialog(false);
  };

  return (
    <div className="size-full">
      {/* Existing data banner */}
      {showExistingDataBanner && (
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-500">
                Existing data found
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You have previously saved profile data. Would you like to continue
                editing it?
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExistingDataBanner(false)}
            >
              Dismiss
            </Button>
            <Button size="sm" onClick={handleRestoreData}>
              Restore
            </Button>
          </div>
        </div>
      )}

      <PromptInputProvider>
        <PromptInput
          globalDrop
          multiple
          onSubmit={handleSubmit}>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Paste CV, upload files, or type directly. We support everything. Include everything that matters for you in terms of your GitHub profile - current GitHub profile url, projects, repos, blog posts, resume, etc." />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionAddAttachmentsButton
                variant="ghost"
                size="icon-sm"
              />

              <PromptInputActionButton
                onClick={handleGithubButtonClick}
                variant={githubUsername ? "default" : "ghost"}
                size="icon-sm"
                icon={<SiGithub className="size-4" />}
              />

              <PromptInputActionButton
                onClick={() => setUseMicrophone(!useMicrophone)}
                variant={useMicrophone ? "default" : "ghost"}
                size="icon-sm"
                icon={<MicIcon className="size-4" />}
              />
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* GitHub username dialog */}
      <Dialog
        open={showGithubDialog}
        onOpenChange={setShowGithubDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add GitHub Username</DialogTitle>
            <DialogDescription>
              Enter your GitHub username to enrich your profile with repository
              stats
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github-username">GitHub Username</Label>
              <Input
                id="github-username"
                placeholder="e.g., octocat"
                value={tempGithubUsername}
                onChange={(e) => setTempGithubUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowGithubDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGithubSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileInputForm;
