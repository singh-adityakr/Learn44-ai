
import { CheckCircle2, Circle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SetupStep {
  title: string
  description: string
  steps: { title: string; completed: boolean; link?: string }[]
}

const setupSteps: SetupStep[] = [
  {
    title: "Essential Tools",
    description: "Core development tools required for all team members",
    steps: [
      { title: "Install Node.js 18+", completed: false, link: "https://nodejs.org" },
      { title: "Install Git", completed: false, link: "https://git-scm.com" },
      { title: "Install Docker Desktop", completed: false, link: "https://docker.com" },
      { title: "Install VS Code or IDE", completed: false, link: "https://code.visualstudio.com" },
    ],
  },
  {
    title: "Environment Configuration",
    description: "Configure your development environment",
    steps: [
      { title: "Generate SSH keys", completed: false },
      { title: "Add SSH key to GitHub", completed: false },
      { title: "Configure git credentials", completed: false },
      { title: "Set environment variables", completed: false },
    ],
  },
  {
    title: "Project Setup",
    description: "Clone and configure project repositories",
    steps: [
      { title: "Clone main repository", completed: false },
      { title: "Install dependencies", completed: false },
      { title: "Configure local environment", completed: false },
      { title: "Run local development server", completed: false },
    ],
  },
  {
    title: "Verification",
    description: "Verify everything is working correctly",
    steps: [
      { title: "Run test suite", completed: false },
      { title: "Start development server", completed: false },
      { title: "Verify database connection", completed: false },
      { title: "Complete first pull request", completed: false },
    ],
  },
]

export default function EnvironmentSetup() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Environment Setup</h1>
          <p className="text-muted-foreground">Configure your development environment step by step</p>
        </div>

        {/* Setup Sections */}
        <div className="space-y-6">
          {setupSteps.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-start gap-3">
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${step.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {step.title}
                        </p>
                        {step.link && (
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            View Guide <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-mono text-primary">npm install</p>
                <p className="text-xs text-muted-foreground">Install project dependencies</p>
              </div>
              <div>
                <p className="text-sm font-mono text-primary">npm run dev</p>
                <p className="text-xs text-muted-foreground">Start development server</p>
              </div>
              <div>
                <p className="text-sm font-mono text-primary">docker compose up</p>
                <p className="text-xs text-muted-foreground">Start Docker services</p>
              </div>
              <div>
                <p className="text-sm font-mono text-primary">npm test</p>
                <p className="text-xs text-muted-foreground">Run test suite</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
