
import { useState } from "react"
import { Play, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  category: string
  description: string
  transcript: string
}

const videos: Video[] = [
  {
    id: "1",
    title: "Getting Started with Runway",
    thumbnail: "/runway-training-video.jpg",
    duration: "12:45",
    category: "Tools & Setup",
    description: "Learn how to navigate the Runway portal and set up your first testing environment.",
    transcript:
      "In this video, we'll walk through the Runway portal interface. First, log in with your company credentials. You'll see the main dashboard with your environments listed. Click on any environment to view deployment options...",
  },
  {
    id: "2",
    title: "Docker Setup Guide",
    thumbnail: "/docker-container-tutorial.jpg",
    duration: "18:30",
    category: "Development",
    description: "Complete guide to setting up Docker for local development and containerization.",
    transcript:
      "Docker allows us to containerize our applications. First, ensure Docker Desktop is installed. Open your terminal and run docker --version. Then, clone the repository and navigate to the Docker configuration...",
  },
  {
    id: "3",
    title: "API Integration Best Practices",
    thumbnail: "/api-integration-development.jpg",
    duration: "22:15",
    category: "Development",
    description: "Learn best practices for integrating with project44 APIs securely and efficiently.",
    transcript:
      "When integrating with our APIs, always use authentication tokens. Never commit API keys to version control. Use environment variables instead. Start with the API documentation at api.project44.com...",
  },
  {
    id: "4",
    title: "SSH Key Configuration",
    thumbnail: "/ssh-security-keys-setup.jpg",
    duration: "8:20",
    category: "Security",
    description: "Step-by-step guide to generating and configuring SSH keys for GitHub and servers.",
    transcript:
      "SSH keys provide secure authentication. Generate a new key pair using ssh-keygen. When prompted, enter a secure passphrase. Add the public key to your GitHub account in settings...",
  },
  {
    id: "5",
    title: "Database Connection & Queries",
    thumbnail: "/database-sql-queries.jpg",
    duration: "25:00",
    category: "Development",
    description: "Understanding database connections, query optimization, and migration strategies.",
    transcript:
      "First, understand your database type. project44 uses PostgreSQL. Connection strings are stored in environment variables. Always use connection pooling for production. Test your queries...",
  },
  {
    id: "6",
    title: "Monitoring and Logging",
    thumbnail: "/monitoring-logging-observability.jpg",
    duration: "19:45",
    category: "Operations",
    description: "Set up comprehensive monitoring and logging for your applications.",
    transcript:
      "Monitoring is crucial for production readiness. We use CloudWatch and DataDog. Log levels should be configured appropriately. Debug in development, info in production...",
  },
]

const categories = ["All", "Tools & Setup", "Development", "Security", "Operations"]

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredVideos = selectedCategory === "All" ? videos : videos.filter((v) => v.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">The Tutor</h1>
          <p className="text-muted-foreground">Video training library for your onboarding journey</p>
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

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card
              key={video.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedVideo(video)}
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden bg-muted h-40">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase">{video.category}</p>
                  <h3 className="text-sm font-bold text-foreground mt-1 line-clamp-2">{video.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-background rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{selectedVideo.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedVideo(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <div className="bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                  <img
                    src={selectedVideo.thumbnail || "/placeholder.svg"}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground uppercase">{selectedVideo.category}</p>
                  <p className="text-foreground">{selectedVideo.description}</p>
                </div>
              </div>

              {/* Transcript */}
              <div className="lg:col-span-1 bg-muted rounded-lg p-4 h-fit max-h-96 overflow-y-auto">
                <h3 className="text-sm font-bold text-foreground mb-3">Transcript</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedVideo.transcript}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
