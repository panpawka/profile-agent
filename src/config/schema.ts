import { z } from 'zod';

export const ConfigSchema = z.object({
  githubToken: z.string().optional(),
  aiProvider: z.enum(['gemini', 'openai']),
  aiApiKey: z.string().optional(),
  defaultTemplate: z.string().default('minimal-dark'),
  updateFrequency: z.enum(['daily', 'weekly', 'monthly', 'manual']).default('weekly'),
  includeEmail: z.boolean().default(false),
  includeLocation: z.boolean().default(true),
  sources: z.object({
    cv: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.boolean().default(true),
    customText: z.array(z.string()).optional(),
  }).optional(),
});

export type ProfileAgentConfig = z.infer<typeof ConfigSchema>;
