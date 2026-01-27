import { pgTable, text, timestamp, uuid, jsonb, varchar } from 'drizzle-orm/pg-core';

// Users table - stores user information
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  githubId: varchar('github_id', { length: 255 }).unique(),
  username: varchar('username', { length: 255 }),
  email: varchar('email', { length: 255 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Profiles table - stores generated profile data
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }),
  title: varchar('title', { length: 255 }),
  bio: text('bio'),
  profileData: jsonb('profile_data'), // Full ProfileData JSON
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Uploads table - stores uploaded files (CV, LinkedIn)
export const uploads = pgTable('uploads', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  profileId: uuid('profile_id').references(() => profiles.id),
  fileName: varchar('file_name', { length: 255 }),
  fileType: varchar('file_type', { length: 50 }), // 'cv', 'linkedin', 'custom'
  fileUrl: text('file_url'), // Could be S3 URL or base64 data
  extractedContent: text('extracted_content'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Generated READMEs table - stores generated README versions
export const readmes = pgTable('readmes', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id').references(() => profiles.id),
  templateId: varchar('template_id', { length: 100 }),
  content: text('content'),
  githubUrl: text('github_url'), // URL to deployed GitHub README
  createdAt: timestamp('created_at').defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Upload = typeof uploads.$inferSelect;
export type NewUpload = typeof uploads.$inferInsert;
export type Readme = typeof readmes.$inferSelect;
export type NewReadme = typeof readmes.$inferInsert;
