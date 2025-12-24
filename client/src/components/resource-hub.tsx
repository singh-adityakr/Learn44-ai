
import { useState } from "react"
import { Copy, ExternalLink, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  title: string
  category: "Confluence" | "GitHub" | "Tools" | "External"
  description: string
  link: string
  lastUpdated: string
  icon: string
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Engineering Handbook",
    category: "Confluence",
    description: "Complete technical guidelines, coding standards, and best practices for development.",
    link: "https://confluence.example.com/engineering",
    lastUpdated: "2 days ago",
    icon: "📚",
  },
  {
    id: "2",
    title: "HR Policies",
    category: "Confluence",
    description: "Human resources policies, benefits information, and employee guidelines.",
    link: "https://confluence.example.com/hr",
    lastUpdated: "1 week ago",
    icon: "👥",
  },
  {
    id: "3",
    title: "Product Specifications",
    category: "Confluence",
    description: "Detailed product specifications, feature documentation, and roadmaps.",
    link: "https://confluence.example.com/product",
    lastUpdated: "3 days ago",
    icon: "📋",
  },
  {
    id: "4",
    title: "SDK Repository",
    category: "GitHub",
    description: "Official SDK for integrating project44 services into your applications.",
    link: "https://github.com/project44/sdk",
    lastUpdated: "6 hours ago",
    icon: "⚙️",
  },
  {
    id: "5",
    title: "project44-docs",
    category: "GitHub",
    description: "Complete API documentation, code examples, and integration guides.",
    link: "https://github.com/project44/docs",
    lastUpdated: "1 day ago",
    icon: "📖",
  },
  {
    id: "6",
    title: "Infrastructure-as-Code",
    category: "GitHub",
    description: "Terraform and CloudFormation templates for infrastructure setup.",
    link: "https://github.com/project44/infrastructure",
    lastUpdated: "4 days ago",
    icon: "🏗️",
  },
  {
    id: "7",
    title: "MyApps (Okta)",
    category: "Tools",
    description: "Single sign-on portal for accessing all internal applications.",
    link: "https://okta.project44.com",
    lastUpdated: "Updated daily",
    icon: "🔐",
  },
  {
    id: "8",
    title: "HelpCenter",
    category: "Tools",
    description: "FAQ, troubleshooting guides, and support documentation.",
    link: "https://help.project44.com",
    lastUpdated: "1 day ago",
    icon: "❓",
  },
  {
    id: "9",
    title: "Runway Portal",
    category: "Tools",
    description: "Testing environments and deployment management for your applications.",
    link: "https://runway.project44.com",
    lastUpdated: "Real-time",
    icon: "🚀",
  },
  {
    id: "10",
    title: "Security Guidelines",
    category: "External",
    description: "Industry best practices and security standards for enterprise development.",
    link: "https://owasp.org",
    lastUpdated: "External source",
    icon: "🔒",
  },
  {
    id: "11",
    title: "API Rate Limits",
    category: "External",
    description: "Understanding and managing API rate limiting in your integrations.",
    link: "https://docs.project44.com/api/limits",
    lastUpdated: "2 weeks ago",
    icon: "⚡",
  },
  {
    id: "12",
    title: "Community Forum",
    category: "External",
    description: "Community discussions, Q&A, and best practices from other users.",
    link: "https://forum.project44.com",
    lastUpdated: "Updated hourly",
    icon: "💬",
  },
]

const categoryColors: Record<string, { bg: string; text: string }> = {
  Confluence: { bg: "bg-blue-100", text: "text-blue-700" },
  GitHub: { bg: "bg-gray-100", text: "text-gray-700" },
  Tools: { bg: "bg-green-100", text: "text-green-700" },
  External: { bg: "bg-purple-100", text: "text-purple-700" },
}

export default function ResourceHub() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = ["All", "Confluence", "GitHub", "Tools", "External"]
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredResources =
    selectedCategory === "All" ? resources : resources.filter((r) => r.category === selectedCategory)

  const copyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resources</h1>
          <p className="text-muted-foreground">
            Centralized access to all documentation, tools, and external resources
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {resources.filter((r) => r.category === "Confluence").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Confluence</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {resources.filter((r) => r.category === "GitHub").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">GitHub</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {resources.filter((r) => r.category === "Tools").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{resources.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{resource.icon}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[resource.category].bg} ${categoryColors[resource.category].text}`}
                      >
                        {resource.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="mt-2">{resource.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3" />
                  <span>Updated: {resource.lastUpdated}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => copyLink(resource.id, resource.link)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copiedId === resource.id ? "Copied" : "Copy"}
                  </Button>
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="default" size="sm" className="w-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-muted-foreground mb-4">No resources found in this category.</p>
            <Button variant="outline" onClick={() => setSelectedCategory("All")}>
              View All Resources
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
