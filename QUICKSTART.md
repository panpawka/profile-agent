# Quick Start Guide - ProfileAgent Web App

## 🚀 Get Started in 3 Minutes

### Prerequisites
- Node.js 18+ installed
- Git installed
- AI API key (Gemini or OpenAI)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/profileagent/profileagent.git
cd profileagent/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

## Configuration

Edit `web/.env` and add your API keys:

```bash
# Required: At least one AI provider
GEMINI_API_KEY=your_gemini_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here

# Optional: For database features (coming soon)
DATABASE_URL=postgresql://...
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Run the App

```bash
# Development mode (with hot reload)
npm run dev

# Open your browser
# http://localhost:3000
```

## Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

---

## 📱 Using the App

### Step 1: Navigate to Create
Click "Create Your Profile" on the homepage or go to `/create`

### Step 2: Upload Your CV
- Drag and drop your resume/CV (PDF, DOCX, or TXT)
- Max file size: 10MB
- Supported formats: `.pdf`, `.docx`, `.doc`, `.txt`

### Step 3: AI Extraction
- (Optional) Enter your GitHub username for stats
- Click "Extract with AI"
- Wait for AI to process your information (~10-30 seconds)

### Step 4: Customize
- Review and edit extracted information
- Update your name, headline, and bio
- Click "Continue"

### Step 5: Choose Template
- Select from 6 professional templates:
  - minimal-dark
  - minimal-light
  - portfolio-grid
  - stats-heavy
  - narrative
  - modern-visualist

### Step 6: Preview & Download
- See live preview of your README
- Click "Download README" to save
- Copy content to your GitHub profile repository

---

## 🎯 What You Get

After downloading your README:

1. **Copy to GitHub:**
   ```bash
   # Create a repository with your username
   # e.g., github.com/yourusername/yourusername
   
   # Add the README.md to the root
   # Commit and push
   ```

2. **Your Profile is Live!**
   - Visit `github.com/yourusername`
   - See your beautiful new profile

---

## 🛠 Troubleshooting

### "Module not found" errors
```bash
cd web
rm -rf node_modules package-lock.json
npm install
```

### "API key not found"
- Make sure `.env` file exists in `/web` directory
- Check that `GEMINI_API_KEY` or `OPENAI_API_KEY` is set
- Restart the dev server after adding keys

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm run dev
```

### Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 📚 Additional Resources

- **Full Documentation:** See `web/README.md`
- **Development Guide:** See `web/DEVELOPMENT.md`
- **Setup Guide:** See `SETUP.md`
- **API Documentation:** Visit `/docs` in the running app

---

## 🎉 You're Ready!

The web app is now running and ready to generate beautiful GitHub profiles!

**Next:** Try uploading your resume and see the magic happen! ✨
