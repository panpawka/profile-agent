# ProfileAgent Web App

Web application for ProfileAgent - AI-powered GitHub Profile README generator.

## Setup

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Neon PostgreSQL connection string
- `GEMINI_API_KEY` or `OPENAI_API_KEY`: AI provider API keys
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: For GitHub OAuth

### 3. Database Setup

```bash
npm run db:push  # Push schema to database
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
web/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── create/            # Profile creation flow
│   ├── templates/         # Template gallery
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities and helpers
│   ├── db.ts            # Database client
│   └── utils.ts         # Helper functions
└── db/                  # Database schema and migrations
    └── schema.ts        # Drizzle ORM schema
```

## Features

- 🎨 Modern UI with Next.js 16 and React 19
- 🌙 Dark/Light mode with next-themes
- 📝 File uploads (CV, LinkedIn exports)
- 🤖 AI-powered profile extraction
- 🎭 6 professional templates
- 🔐 Secure user authentication
- 💾 PostgreSQL database with Neon
- 🚀 Deploy directly to GitHub

## API Routes

- `POST /api/upload` - Upload CV/LinkedIn files
- `POST /api/extract` - AI extraction from uploaded content
- `GET /api/templates` - List available templates
- `POST /api/generate` - Generate README from profile data
- `POST /api/deploy` - Deploy to GitHub profile

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Neon PostgreSQL with Drizzle ORM
- **AI**: Vercel AI SDK (Gemini & OpenAI)
- **Auth**: GitHub OAuth
- **Deployment**: Vercel (recommended)

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/profileagent/profileagent/tree/main/web)

1. Click the button above
2. Set environment variables
3. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your Vercel dashboard or deployment platform.

## License

MIT © ProfileAgent Team
