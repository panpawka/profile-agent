import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SettingsIcon,
  FolderIcon,
  CircleCheckIcon,
  LightbulbIcon,
} from "lucide-react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TEMPLATES = [
  { id: "minimal-dark", name: "Minimal Dark" },
  { id: "minimal-light", name: "Minimal Light" },
  { id: "portfolio-grid", name: "Portfolio Grid" },
  { id: "stats-heavy", name: "Stats Heavy" },
  { id: "narrative", name: "Narrative" },
  { id: "modern-visualist", name: "Modern Visualist" },
];

const ProfileTemplatePreview = () => {
  const [projectName, setProjectName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    TEMPLATES[0].id,
  );
  const [memorySetting, setMemorySetting] = useState<
    "default" | "project-only"
  >("default");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    "var(--foreground)",
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>
          Start a new project to keep chats, files, and custom instructions in
          one place.
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                />
              }>
              <SettingsIcon />
              <span className="sr-only">Memory</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuRadioGroup
                  value={memorySetting}
                  onValueChange={(value) => {
                    setMemorySetting(value as "default" | "project-only");
                  }}>
                  <DropdownMenuRadioItem value="default">
                    <Item size="xs">
                      <ItemContent>
                        <ItemTitle>Default</ItemTitle>
                        <ItemDescription className="text-xs">
                          Project can access memories from outside chats, and
                          vice versa.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="project-only">
                    <Item size="xs">
                      <ItemContent>
                        <ItemTitle>Project Only</ItemTitle>
                        <ItemDescription className="text-xs">
                          Project can only access its own memories. Its memories
                          are hidden from outside chats.
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  Note that this setting can&apos;t be changed later.
                </DropdownMenuLabel>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel
              htmlFor="project-name"
              className="sr-only">
              Project Name
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="project-name"
                placeholder="Copenhagen Trip"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
              <InputGroupAddon>
                <Popover>
                  <PopoverTrigger
                    render={
                      <InputGroupButton
                        variant="ghost"
                        size="icon-xs"
                      />
                    }>
                    <FolderIcon
                      style={
                        { "--color": selectedColor } as React.CSSProperties
                      }
                      className="text-(--color)"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-60 p-3">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "var(--foreground)",
                        "#fa423e",
                        "#f59e0b",
                        "#8b5cf6",
                        "#ec4899",
                        "#10b981",
                        "#6366f1",
                        "#14b8a6",
                        "#f97316",
                        "#fbbc04",
                      ].map((color) => (
                        <Button
                          key={color}
                          size="icon"
                          variant="ghost"
                          className="rounded-full p-1"
                          style={{ "--color": color } as React.CSSProperties}
                          data-checked={selectedColor === color}
                          onClick={() => {
                            setSelectedColor(color);
                          }}>
                          <span className="group-data-[checked=true]/button:ring-offset-background size-5 rounded-full bg-(--color) ring-2 ring-transparent ring-offset-2 ring-offset-(--color) group-data-[checked=true]/button:ring-(--color)" />
                          <span className="sr-only">{color}</span>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription className="flex flex-wrap gap-2">
              {TEMPLATES.map((template) => (
                <Badge
                  key={template.id}
                  variant={
                    selectedCategory === template.id ? "default" : "outline"
                  }
                  data-checked={selectedCategory === template.id}
                  render={
                    <button
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === template.id ? null : template.id,
                        );
                      }}
                    />
                  }>
                  <CircleCheckIcon
                    data-icon="inline-start"
                    className="hidden group-data-[checked=true]/badge:inline"
                  />
                  {template.name}
                </Badge>
              ))}
            </FieldDescription>
          </Field>
          <Field>
            <Alert className="bg-muted">
              <LightbulbIcon />
              <AlertDescription className="text-xs">
                Projects keep chats, files, and custom instructions in one
                place. Use them for ongoing work, or just to keep things tidy.
              </AlertDescription>
            </Alert>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
};

export default ProfileTemplatePreview;
