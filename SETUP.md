# ProfileAgent - Setup Guide

## Project Structure

This repository contains both the **CLI tool** and the **web application** in a monorepo structure:

```
profile-agent/
├── src/               # CLI tool source code
│   ├── ai/           # AI extraction logic
│   ├── cli/          # CLI commands
│   ├── parsers/      # PDF/DOCX parsers
│   ├── templates/    # Template engine
│   └── ...
├── templates/        # Mustache template files
├── web/              # Web application (NEW!)
│   ├── app/         # Next.js pages
│   ├── components/  # React components
│   ├── db/          # Database schema
│   └── lib/         # Utilities
├── dist/             # Compiled CLI output
└── package.json      # CLI dependencies
```

## Installation Options

### Option 1: CLI Tool Only

If you only want to use the CLI tool:

```bash
# Clone the repository
git clone https://github.com/profileagent/profileagent.git
cd profileagent

# Install dependencies
npm install

# Build the CLI
npm run build

# Use the CLI
./dist/cli/index.js init
```

Or install globally:

```bash
npm install -g profile-agent
profile-agent init
```

### Option 2: Web Application

To run the web application locally:

```bash
# Clone the repository
git clone https://github.com/profileagent/profileagent.git
cd profileagent/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Push database schema
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 3: Both CLI and Web

```bash
# Install CLI dependencies (from root)
npm install

# Install web dependencies
cd web
npm install
cd ..

# Build CLI
npm run build

# Run web app
cd web
npm run dev
```

## Environment Variables

### For CLI

Create a `.env` file in the root directory:

```bash
GITHUB_TOKEN=ghp_your_github_token
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### For Web App

Create a `web/.env` file:

```bash
DATABASE_URL=postgresql://user:password@host/database
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Database Setup (Web App Only)

The web app uses **Neon PostgreSQL**. Follow these steps:

1. **Create a Neon Database**:
   - Go to [neon.tech](https://neon.tech)
   - Sign up and create a new project
   - Copy the connection string

2. **Add to .env**:
   ```bash
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb
   ```

3. **Push schema**:
   ```bash
   cd web
   npm run db:push
   ```

4. **Optional: Open Drizzle Studio** (database GUI):
   ```bash
   npm run db:studio
   ```

## Quick Start

### CLI Workflow

```bash
# Initialize
profile-agent init

# Add your CV
profile-agent add --cv ./resume.pdf

# Run AI extraction
profile-agent extract

# Generate README
profile-agent generate

# Deploy to GitHub
profile-agent deploy
```

### Web App Workflow

1. Visit `http://localhost:3000`
2. Click "Create Your Profile"
3. Upload CV/LinkedIn export
4. Let AI extract your information
5. Choose a template
6. Preview and edit
7. Deploy to GitHub

## Development

### CLI Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build
npm run build
```

### Web App Development

```bash
cd web

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:generate  # Generate migrations
npm run db:push      # Push schema changes
npm run db:studio    # Open database GUI
```

## Deployment

### Deploy CLI as NPM Package

```bash
npm run build
npm publish
```

### Deploy Web App to Vercel

```bash
cd web
vercel deploy
```

Or use the Vercel button in the web/README.md.

## Tech Stack

### CLI Tool
- **Language**: TypeScript
- **Framework**: Commander.js
- **AI**: Vercel AI SDK (Gemini & OpenAI)
- **Parsing**: pdf-parse, mammoth
- **Templates**: Mustache

### Web Application
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Neon PostgreSQL + Drizzle ORM
- **AI**: Vercel AI SDK
- **Hosting**: Vercel (recommended)

## Troubleshooting

### CLI Issues

**"Command not found"**
- Make sure you've run `npm run build`
- Check that `./dist/cli/index.js` exists
- Make the file executable: `chmod +x ./dist/cli/index.js`

**"API key not found"**
- Create a `.env` file in the project root
- Add your `GEMINI_API_KEY` or `OPENAI_API_KEY`

### Web App Issues

**"Database connection failed"**
- Verify your `DATABASE_URL` in `web/.env`
- Run `npm run db:push` to sync the schema
- Check Neon dashboard for connection issues

**LSP/TypeScript errors**
- These are expected before running `npm install`
- Run `npm install` in the `web/` directory
- Restart your TypeScript language server

**Port 3000 already in use**
- Change the port: `PORT=3001 npm run dev`

## Need Help?

- **Documentation**: Check the `docs/` folder
- **Issues**: [GitHub Issues](https://github.com/profileagent/profileagent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/profileagent/profileagent/discussions)

## License

MIT © ProfileAgent Team
