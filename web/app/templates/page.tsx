import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { TemplateEngine } from "@/lib/templates";

export default async function TemplatesPage() {
  const engine = new TemplateEngine();
  const templates = engine.listTemplates();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white">Templates</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Perfect Template
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Select from {templates.length} professionally designed templates for your GitHub profile
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition-all"
            >
              <CardHeader>
                <CardTitle className="text-white capitalize">
                  {template.name}
                </CardTitle>
                <CardDescription className="text-white/60">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                  <span className="text-white/40 text-sm">Preview</span>
                </div>

                {/* Features */}
                {template.features && Object.keys(template.features).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-white/80 uppercase">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(template.features).map(([key, value]) => (
                        value && (
                          <div
                            key={key}
                            className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded"
                          >
                            <Check className="h-3 w-3 text-green-400" />
                            <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/create?template=${template.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Use This Template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/create">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
