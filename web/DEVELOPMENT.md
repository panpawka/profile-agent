# ProfileAgent Web App - Development Plan

## ✅ Completed Setup

### 1. Project Structure
- Created `web/` directory for Next.js 16 application
- Configured monorepo structure (CLI + Web App)
- Set up Tailwind CSS with shadcn/ui component library
- Configured TypeScript with strict mode

### 2. Core Files Created
- `web/package.json` - Dependencies and scripts
- `web/next.config.ts` - Next.js configuration
- `web/tsconfig.json` - TypeScript configuration
- `web/tailwind.config.ts` - Tailwind CSS setup
- `web/app/layout.tsx` - Root layout with theme provider
- `web/app/page.tsx` - Landing page with hero and features
- `web/app/globals.css` - Global styles with CSS variables

### 3. UI Components
- `components/ui/button.tsx` - Customizable button component
- `components/ui/card.tsx` - Card components for content
- `components/theme-provider.tsx` - Dark/light mode provider
- `lib/utils.ts` - Utility functions (cn helper)

### 4. Database Setup (Neon + Drizzle)
- `db/schema.ts` - Database schema with users, profiles, uploads, readmes tables
- `lib/db.ts` - Database client configuration
- `drizzle.config.ts` - Drizzle Kit configuration

### 5. API Routes
- `app/api/templates/route.ts` - Template listing endpoint

### 6. Documentation
- `web/README.md` - Web app specific documentation
- `SETUP.md` - Comprehensive setup guide for both CLI and Web
- `.env.example` - Environment variables template

## 🚧 Next Steps

### Phase 1: Core API Routes (Priority: High)
1. **File Upload API** (`app/api/upload/route.ts`)
   - Handle CV/LinkedIn PDF/DOCX uploads
   - Parse files using existing parsers
   - Store extracted content in database

2. **AI Extraction API** (`app/api/extract/route.ts`)
   - Integrate existing AI extraction logic
   - Process uploaded content
   - Generate ProfileData JSON

3. **README Generation API** (`app/api/generate/route.ts`)
   - Use existing template engine
   - Render templates with profile data
   - Return markdown output

4. **Deploy API** (`app/api/deploy/route.ts`)
   - GitHub OAuth integration
   - Push to user's profile repository
   - Set up GitHub Actions workflow

### Phase 2: Frontend Pages (Priority: High)
1. **Create Page** (`app/create/page.tsx`)
   - Step-by-step wizard
   - File upload interface
   - AI extraction feedback
   - Template selection
   - Live preview
   - Deploy button

2. **Templates Page** (`app/templates/page.tsx`)
   - Template gallery with previews
   - Template details view
   - Template customization options

3. **Dashboard** (`app/dashboard/page.tsx`)
   - User's saved profiles
   - Edit existing profiles
   - Deployment history

### Phase 3: Shared Logic Refactoring (Priority: Medium)
1. **Move Core Logic to Shared Package**
   - Extract AI logic from `src/ai/` to `shared/ai/`
   - Extract parsers to `shared/parsers/`
   - Extract template engine to `shared/templates/`
   - Make reusable for both CLI and Web

2. **Type Definitions**
   - Share ProfileData types
   - Share configuration types
   - Create unified validation schemas

### Phase 4: Additional Features (Priority: Low)
1. **Authentication**
   - GitHub OAuth for saving profiles
   - Session management
   - User profiles

2. **Template Marketplace**
   - Community templates
   - Template ratings
   - Template submissions

3. **Analytics**
   - Profile view tracking
   - Popular templates
   - User engagement metrics

## Installation & Running

### First Time Setup
```bash
# Install CLI dependencies (from root)
npm install

# Install web dependencies
cd web
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Push database schema
npm run db:push

# Run development server
npm run dev
```

### Development Workflow
```bash
# Terminal 1: Run web app
cd web
npm run dev

# Terminal 2: Watch for changes (optional)
npm run lint

# Terminal 3: Database studio (optional)
npm run db:studio
```

## Architecture Decisions

### Why Monorepo?
- Share code between CLI and Web
- Single version for core logic
- Easier dependency management
- Unified testing strategy

### Why Next.js 16 App Router?
- React Server Components for better performance
- Built-in API routes
- Server Actions for form handling
- Excellent TypeScript support
- Great developer experience

### Why Neon PostgreSQL?
- Serverless, auto-scaling
- Built-in connection pooling
- Generous free tier
- Perfect for Next.js
- Branch database feature for development

### Why Drizzle ORM?
- TypeScript-first
- Lightweight and fast
- Great DX with Drizzle Studio
- Flexible query builder
- Migration support

### Why shadcn/ui?
- Copy-paste components (not npm package)
- Full control over component code
- Built on Radix UI primitives
- Excellent accessibility
- Beautiful default styling
- Easy to customize

## File Structure Overview
```
profile-agent/
├── src/                      # CLI tool (existing)
│   ├── ai/                  # AI extraction
│   ├── cli/                 # Commands
│   ├── parsers/             # File parsers
│   └── templates/           # Template engine
├── templates/               # Mustache templates (shared)
├── web/                     # Web application (NEW)
│   ├── app/                # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── create/        # Profile creation
│   │   ├── templates/     # Template gallery
│   │   └── dashboard/     # User dashboard
│   ├── components/         # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── lib/               # Utilities
│   │   ├── db.ts         # Database client
│   │   └── utils.ts      # Helpers
│   └── db/                # Database
│       └── schema.ts     # Drizzle schema
├── SETUP.md                # Setup guide
└── package.json           # CLI dependencies
```

## Key Technical Considerations

### State Management
- **Server State**: React Query / SWR for API data
- **Client State**: React Context or Zustand (if needed)
- **Form State**: React Hook Form

### File Uploads
- Client-side file reading with FileReader API
- Parse on server using existing parsers
- Optional: Store in Neon Blob Storage or AWS S3

### Security
- Input validation with Zod
- Rate limiting on API routes
- Sanitize markdown output
- Secure GitHub token handling

### Performance
- Server Components for static content
- Client Components for interactivity
- Streaming for AI responses
- Edge runtime where possible

## Deployment

### Recommended: Vercel
- Zero-config Next.js deployment
- Automatic previews for PRs
- Edge network for global performance
- Environment variable management

### Alternative: Railway / Render
- Good PostgreSQL integration
- Automatic deployments
- Affordable pricing

## Next Immediate Actions

1. **Install dependencies**:
   ```bash
   cd web && npm install
   ```

2. **Test the setup**:
   ```bash
   npm run dev
   ```

3. **Create remaining API routes** (see Phase 1)

4. **Build the `/create` page** (see Phase 2)

5. **Test end-to-end workflow**

6. **Deploy to staging environment**

## Notes

- LSP errors are expected before `npm install`
- All code follows TypeScript strict mode
- Components use React 19 patterns
- Database schema is ready for production
- AI logic can be reused from CLI with minimal changes

---

**Status**: Foundation complete, ready for feature development
**Next Sprint**: API routes + Create page
**Target**: v0.6.0 (Web App Beta)
