import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Github, Sparkles, Zap, Layout, RefreshCw } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">ProfileAgent</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/templates">
              <Button variant="ghost" className="text-white/80 hover:text-white">
                Templates
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" className="text-white/80 hover:text-white">
                Docs
              </Button>
            </Link>
            <Link href="/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI-Powered GitHub Profile
            <span className="block text-blue-400">Made Simple</span>
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Transform your CV, LinkedIn, and GitHub repos into a stunning profile README in minutes.
            No installation required.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/templates">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 text-lg px-8">
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <FileText className="h-10 w-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">Smart Parsing</CardTitle>
              <CardDescription className="text-white/60">
                Upload your CV, LinkedIn export, or connect GitHub. We extract everything automatically.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <Sparkles className="h-10 w-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">AI Extraction</CardTitle>
              <CardDescription className="text-white/60">
                Powered by Gemini & GPT-4o, we identify skills, achievements, and create compelling narratives.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <Layout className="h-10 w-10 text-green-400 mb-2" />
              <CardTitle className="text-white">Beautiful Templates</CardTitle>
              <CardDescription className="text-white/60">
                Choose from 6 professionally designed themes. Customize colors, sections, and style.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <Github className="h-10 w-10 text-orange-400 mb-2" />
              <CardTitle className="text-white">Direct Deploy</CardTitle>
              <CardDescription className="text-white/60">
                Push directly to your GitHub profile repository with one click.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <RefreshCw className="h-10 w-10 text-cyan-400 mb-2" />
              <CardTitle className="text-white">Auto-Updates</CardTitle>
              <CardDescription className="text-white/60">
                Set up GitHub Actions to automatically refresh your stats and projects.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <Zap className="h-10 w-10 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Cost Efficient</CardTitle>
              <CardDescription className="text-white/60">
                ~$0.001 per profile generation using the latest cost-efficient AI models.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Stand Out?
          </h2>
          <p className="text-white/70 mb-6">
            Join thousands of developers using ProfileAgent to create stunning GitHub profiles.
          </p>
          <Link href="/create">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-white/50">
          <p>Built with ❤️ by the ProfileAgent team</p>
          <p className="mt-2 text-sm">
            <Link href="https://github.com/profileagent/profileagent" className="hover:text-white/80">
              GitHub
            </Link>
            {" · "}
            <Link href="/docs" className="hover:text-white/80">
              Documentation
            </Link>
            {" · "}
            <Link href="/templates" className="hover:text-white/80">
              Templates
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
