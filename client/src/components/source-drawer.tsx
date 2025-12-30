
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SourceDrawerProps {
  source: string
  onClose: () => void
}

export default function SourceDrawer({ source, onClose }: SourceDrawerProps) {
  const sourceContent: Record<string, { title: string; content: string; link: string }> = {
    "Confluence: Engineering Handbook": {
      title: "Engineering Handbook",
      content:
        "The Engineering Handbook contains all technical guidelines, best practices, and architectural decisions for project44. It covers coding standards, deployment procedures, and troubleshooting guides. Access the full documentation on Confluence.",
      link: "https://project44.atlassian.net/wiki/spaces/FDNENG/overview",
    },
    "GitHub: project44": {
      title: "project44 GitHub Organization",
      content:
        "The official project44 GitHub organization hosts all repositories including the design system (manifest), SDKs, documentation, infrastructure templates, and open source projects. Explore repositories, contribute to projects, and access code examples.",
      link: "https://github.com/project44",
    },
    "GitHub: project44-docs": {
      title: "Project44 Documentation",
      content:
        "The official GitHub repository documentation includes SDK references, API documentation, and code examples for integrating with project44 services.",
      link: "https://github.com/project44/docs",
    },
    "Runway Portal": {
      title: "Runway Portal",
      content:
        "The Runway Portal is your gateway to testing environments, deployments, and real-time monitoring of your project44 implementations.",
      link: "https://runway.project44.com",
    },
  }

  const current = sourceContent[source] || sourceContent["Confluence: Engineering Handbook"]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">{current.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground">{current.content}</p>
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View Full Document
          </a>
        </div>
      </Card>
    </div>
  )
}
