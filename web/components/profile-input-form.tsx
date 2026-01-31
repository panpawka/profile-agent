import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddAttachmentsButton,
  PromptInputActionButton,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import { MicIcon } from "lucide-react";
import { useState } from "react";
import { SiGithub } from "@icons-pack/react-simple-icons";

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    chef: "OpenAI",
    chefSlug: "openai",
    providers: ["openai", "azure"],
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude 4 Opus",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    chef: "Anthropic",
    chefSlug: "anthropic",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    chef: "Google",
    chefSlug: "google",
    providers: ["google"],
  },
];

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

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

const ProfileInputForm = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");

  const selectedModelData = models.find((m) => m.id === model);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    // eslint-disable-next-line no-console
    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);
  };

  return (
    <div className="size-full">
      <PromptInputProvider>
        <PromptInput
          globalDrop
          multiple
          onSubmit={handleSubmit}>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Paste CV, upload files, or type directly. We support
                  everything. Include everything that matters for you in terms of your GitHub profile - current GitHub profile url, projects, repos, blog posts, resume, etc."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionAddAttachmentsButton
                variant="ghost"
                size="icon-sm"
              />

              <PromptInputActionButton
                onClick={() => setGithubUsername(githubUsername || "")}
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
    </div>
  );
};

//   <Field>
//     <FieldLabel
//       htmlFor="input-form"
//       className="sr-only">
//       Input form
//     </FieldLabel>

//     <InputGroup>
//       <InputGroupTextarea
//         id="input-form"
//         placeholder="Paste CV, upload files, or type directly. We support
//                 everything. Include everything that matters for you in terms of your GitHub profile - current GitHub profile url, projects, repos, blog posts, resume, etc."
//       />
//       <InputGroupAddon align="block-end">
//         <DropdownMenu>
//           <Tooltip>
//             <TooltipTrigger
//               render={
//                 <DropdownMenuTrigger
//                   render={
//                     <InputGroupButton
//                       variant="ghost"
//                       size="icon-sm"
//                       onClick={() => setDictateEnabled(!dictateEnabled)}
//                     />
//                   }
//                 />
//               }>
//               <PlusIcon />
//             </TooltipTrigger>
//             <TooltipContent>Add files and more</TooltipContent>
//           </Tooltip>
//           <DropdownMenuContent className="w-fit">
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <PaperclipIcon />
//                 Add photos & files
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <SiGithub />
//                 Add GitHub profile
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Tooltip>
//           <TooltipTrigger
//             render={
//               <InputGroupButton
//                 variant="ghost"
//                 onClick={() => setDictateEnabled(!dictateEnabled)}
//                 className="ml-auto"
//               />
//             }>
//             <AudioLinesIcon />
//           </TooltipTrigger>
//           <TooltipContent>Dictate</TooltipContent>
//         </Tooltip>
//         <InputGroupButton
//           variant="default"
//           className="text-sm h-6 px-3">
//           Generate
//         </InputGroupButton>
//       </InputGroupAddon>
//     </InputGroup>
//   </Field>
// );
// }

export default ProfileInputForm;
