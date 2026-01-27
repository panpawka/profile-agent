import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-white hover:text-white/80">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-white">Documentation</h1>

          <h2 className="text-white">Getting Started</h2>
          <p className="text-white/70">
            ProfileAgent makes it easy to create stunning GitHub profile READMEs. Follow these simple steps:
          </p>

          <ol className="text-white/70">
            <li>Upload your CV, resume, or LinkedIn export</li>
            <li>Let AI extract your professional information</li>
            <li>Customize the extracted data to your liking</li>
            <li>Choose a template that fits your style</li>
            <li>Download your generated README</li>
          </ol>

          <h2 className="text-white">Supported File Types</h2>
          <ul className="text-white/70">
            <li>PDF (.pdf)</li>
            <li>Word Documents (.docx, .doc)</li>
            <li>Plain Text (.txt)</li>
          </ul>

          <h2 className="text-white">Templates</h2>
          <p className="text-white/70">
            We offer 6 professionally designed templates:
          </p>
          <ul className="text-white/70">
            <li><strong>minimal-dark</strong> - Clean, professional dark theme</li>
            <li><strong>minimal-light</strong> - Bright, airy design</li>
            <li><strong>portfolio-grid</strong> - Project-focused layout</li>
            <li><strong>stats-heavy</strong> - Emphasis on GitHub statistics</li>
            <li><strong>narrative</strong> - Story-driven layout</li>
            <li><strong>modern-visualist</strong> - Contemporary design with bold visuals</li>
          </ul>

          <h2 className="text-white">API Reference</h2>
          <p className="text-white/70">
            For developers who want to integrate ProfileAgent into their own tools:
          </p>
          
          <h3 className="text-white">POST /api/upload</h3>
          <p className="text-white/70">Upload a file for processing</p>

          <h3 className="text-white">POST /api/extract</h3>
          <p className="text-white/70">Extract profile data from content using AI</p>

          <h3 className="text-white">POST /api/generate</h3>
          <p className="text-white/70">Generate README from profile data</p>

          <h3 className="text-white">GET /api/templates</h3>
          <p className="text-white/70">List all available templates</p>

          <h2 className="text-white">Need Help?</h2>
          <p className="text-white/70">
            Visit our{" "}
            <a href="https://github.com/profileagent/profileagent" className="text-blue-400 hover:text-blue-300">
              GitHub repository
            </a>{" "}
            for more information and support.
          </p>
        </div>
      </main>
    </div>
  );
}
