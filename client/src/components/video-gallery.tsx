
import { useState } from "react"
import { Play, X, Sparkles, Send } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ChatMessage from "@/components/chat-message"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
}

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
    thumbnail: "/runway-training-video.svg",
    duration: "12:45",
    category: "Tools & Setup",
    description: "Learn how to navigate the Runway portal and set up your first testing environment.",
    transcript: `Welcome to the Runway Portal tutorial. In this comprehensive guide, we'll walk you through everything you need to know about using Runway for your development and testing needs.

First, let's start with logging in. Navigate to runway.project44.com and use your company credentials - that's your @project44.com email address. Make sure you're using SSO authentication for secure access.

Once you're logged in, you'll see the main dashboard. This is your central hub for all environments. You'll notice several key sections:

The Environments panel shows all your available testing environments. Each environment represents a different stage - development, staging, and production-like setups. Click on any environment to view its details.

The Deployment section allows you to deploy your applications. You can select which version to deploy, configure environment variables, and monitor the deployment process in real-time.

The Monitoring tab provides real-time metrics and logs. Here you can see CPU usage, memory consumption, request rates, and error rates. This is crucial for understanding how your application performs.

The Configuration panel lets you manage environment variables, secrets, and service connections. Always remember to never commit secrets to version control - use the Runway portal to manage them securely.

When deploying, you'll see a step-by-step wizard. First, select your application. Then choose the version or branch you want to deploy. Configure any necessary environment variables, review your settings, and click deploy.

The deployment process typically takes a few minutes. You can watch the progress in real-time. Once complete, you'll receive a notification and can access your deployed application through the provided URL.

Troubleshooting tips: If you encounter issues, check the logs first. Most problems are visible in the application logs. Also verify your environment variables are set correctly. If problems persist, contact the DevOps team through the helpdesk.

Remember, Runway is designed to make your development workflow smoother. Use it regularly to test your changes before pushing to production.`,
  },
  {
    id: "2",
    title: "Docker Setup Guide",
    thumbnail: "/docker-container-tutorial.svg",
    duration: "18:30",
    category: "Development",
    description: "Complete guide to setting up Docker for local development and containerization.",
    transcript: `Welcome to Docker Setup for project44. Docker is essential for containerizing our applications and ensuring consistent environments across development, testing, and production.

Let's start with installation. If you're on macOS, download Docker Desktop from docker.com. For Windows, you can use Docker Desktop or WSL2. Once installed, verify the installation by opening your terminal and running: docker --version. You should see Docker version 20.10 or higher.

Next, start Docker Desktop and ensure it's running. You'll see the Docker icon in your system tray. Click it to open the dashboard where you can monitor containers, images, and volumes.

Now, let's set up your first container. Clone the project44 repository using git clone. Navigate to the project directory and look for the Dockerfile. This file contains all the instructions Docker needs to build your container image.

To build the image, run: docker build -t project44-app . The -t flag tags your image with a name. The dot at the end tells Docker to use the current directory.

Once built, you can run your container with: docker run -p 8080:8080 project44-app. The -p flag maps port 8080 from the container to port 8080 on your host machine.

For development, you'll often use docker-compose. This tool allows you to define multi-container applications. Look for docker-compose.yml in your project. Run docker-compose up to start all services defined in the file.

Common Docker commands you'll use:
- docker ps: List running containers
- docker images: List all images
- docker logs [container-id]: View container logs
- docker stop [container-id]: Stop a running container
- docker rm [container-id]: Remove a container

Best practices: Always use .dockerignore to exclude unnecessary files. Keep your Dockerfile minimal and use multi-stage builds for production. Never run containers as root in production.

Troubleshooting: If you encounter permission errors, ensure Docker Desktop has proper permissions. On macOS, check System Preferences > Security & Privacy. If containers won't start, check the logs with docker logs.`,
  },
  {
    id: "3",
    title: "API Integration Best Practices",
    thumbnail: "/api-integration-development.svg",
    duration: "22:15",
    category: "Development",
    description: "Learn best practices for integrating with project44 APIs securely and efficiently.",
    transcript: `API Integration Best Practices for project44. This guide covers everything you need to know about securely and efficiently integrating with our APIs.

First, authentication. All project44 APIs require authentication tokens. Never use API keys directly in your code. Instead, use environment variables or a secrets management system. Store your credentials securely and rotate them regularly.

To get started, visit api.project44.com for complete API documentation. You'll find endpoint specifications, request/response examples, and SDK references. The documentation includes interactive examples you can try directly in your browser.

When making API calls, always include proper headers. Use Content-Type: application/json for JSON payloads. Include your Authorization header with a Bearer token. Rate limiting is enforced, so implement proper retry logic with exponential backoff.

Error handling is crucial. Always check HTTP status codes. 2xx means success, 4xx indicates client errors like invalid requests or authentication issues, and 5xx means server errors. Implement proper error handling and logging.

For production applications, use connection pooling and keep-alive connections. This reduces overhead and improves performance. Set appropriate timeouts - we recommend 30 seconds for most operations.

Versioning: Always specify the API version in your requests. Our APIs are versioned, so use the correct version path like /api/v1/ or /api/v2/. Check the changelog regularly for updates and deprecations.

Security best practices: Use HTTPS for all API calls. Validate all input data before sending requests. Implement request signing for sensitive operations. Never log sensitive data or API keys.

Testing: Use our sandbox environment for testing. It mirrors production but uses test data. Write comprehensive tests for your API integrations, including error scenarios and edge cases.

Monitoring: Track your API usage and monitor for errors. Set up alerts for unusual patterns or high error rates. Use our API analytics dashboard to understand your usage patterns.

Common pitfalls to avoid: Don't make synchronous calls in user-facing code - use async/await or promises. Don't ignore rate limits - implement proper queuing. Don't hardcode endpoints - use configuration files.`,
  },
  {
    id: "4",
    title: "SSH Key Configuration",
    thumbnail: "/ssh-security-keys-setup.svg",
    duration: "8:20",
    category: "Security",
    description: "Step-by-step guide to generating and configuring SSH keys for GitHub and servers.",
    transcript: `SSH Key Configuration Guide. SSH keys provide secure, password-less authentication for GitHub, servers, and other services. Let's set them up properly.

First, check if you already have SSH keys. Open your terminal and run: ls -al ~/.ssh. Look for files named id_rsa, id_ed25519, or similar. If you see these files, you may already have keys.

To generate a new SSH key pair, use: ssh-keygen -t ed25519 -C "your_email@project44.com". Ed25519 is recommended as it's more secure and faster than RSA. When prompted, choose a location (default is fine) and enter a strong passphrase.

Your passphrase adds an extra layer of security. Choose something memorable but secure. You'll need to enter this passphrase when using your key, unless you use an SSH agent.

Now, start the SSH agent: eval "$(ssh-agent -s)". Then add your key: ssh-add ~/.ssh/id_ed25519. You'll be prompted for your passphrase.

To add your public key to GitHub, first copy it: pbcopy < ~/.ssh/id_ed25519.pub on macOS, or cat ~/.ssh/id_ed25519.pub on Linux. Then go to GitHub.com, navigate to Settings > SSH and GPG keys, click New SSH key, paste your key, and save.

For project44 servers, you'll need to add your public key to the authorized_keys file. Contact your system administrator or use the provided onboarding script.

Test your GitHub connection: ssh -T git@github.com. You should see a success message. If you get a permission denied error, check that your public key is correctly added to GitHub.

Best practices: Use different keys for different purposes if needed. Never share your private key. Keep your passphrase secure. Regularly rotate your keys - we recommend annually.

Troubleshooting: If authentication fails, verify your public key is correctly added. Check file permissions: chmod 600 ~/.ssh/id_ed25519 and chmod 644 ~/.ssh/id_ed25519.pub. Ensure your SSH agent is running and has your key loaded.`,
  },
  {
    id: "5",
    title: "Database Connection & Queries",
    thumbnail: "/database-sql-queries.svg",
    duration: "25:00",
    category: "Development",
    description: "Understanding database connections, query optimization, and migration strategies.",
    transcript: `Database Connection and Query Optimization. project44 uses PostgreSQL as our primary database. This guide covers everything from basic connections to advanced optimization.

First, understand your database type. We use PostgreSQL version 14 or higher. Connection strings follow this format: postgresql://username:password@host:port/database. Never hardcode these - always use environment variables.

To connect, you'll need the connection string from your environment configuration. In development, this is usually in your .env file. For production, use our secrets management system.

Connection pooling is essential for production. Use a library like pgBouncer or implement connection pooling in your application. This prevents connection exhaustion and improves performance. Set appropriate pool sizes - typically 10-20 connections per application instance.

When writing queries, always use parameterized queries to prevent SQL injection. Never concatenate user input directly into SQL strings. Use prepared statements or ORM methods that handle this automatically.

Query optimization tips: Use EXPLAIN ANALYZE to understand query performance. Create indexes on frequently queried columns. Avoid SELECT * - only select columns you need. Use LIMIT for large result sets. Join tables efficiently - avoid N+1 query problems.

For migrations, use a migration tool like Flyway or Liquibase. Always test migrations in a development environment first. Write reversible migrations when possible. Document schema changes in your pull requests.

Monitoring: Set up query performance monitoring. Track slow queries - anything over 100ms should be investigated. Use database monitoring tools to track connection counts, query rates, and error rates.

Backup and recovery: Understand our backup schedule. Know how to restore from backups if needed. Test your recovery procedures regularly. Never run destructive operations without backups.

Security: Use least-privilege principles for database users. Application users should only have necessary permissions. Never use admin accounts for application connections. Encrypt connections using SSL/TLS.

Common issues: Connection timeouts usually mean pool exhaustion or network issues. Slow queries often need indexing or query optimization. Deadlocks can occur with concurrent transactions - use proper transaction isolation levels.`,
  },
  {
    id: "6",
    title: "Monitoring and Logging",
    thumbnail: "/monitoring-logging-observability.svg",
    duration: "19:45",
    category: "Operations",
    description: "Set up comprehensive monitoring and logging for your applications.",
    transcript: `Monitoring and Logging Best Practices. Comprehensive monitoring is crucial for production readiness and troubleshooting. project44 uses CloudWatch and DataDog for monitoring and observability.

Let's start with logging. Use appropriate log levels: DEBUG for detailed diagnostic information during development, INFO for general informational messages, WARN for warning conditions, and ERROR for error conditions. In production, set your log level to INFO or higher to reduce noise.

Structured logging is essential. Use JSON format for logs so they can be easily parsed and searched. Include contextual information like request IDs, user IDs, and timestamps. Never log sensitive information like passwords, API keys, or personal data.

For application monitoring, we use DataDog. Set up the DataDog agent in your application. Configure custom metrics for business logic - track things like API call counts, processing times, and error rates. Create dashboards to visualize your application's health.

CloudWatch is used for AWS resource monitoring. Set up CloudWatch alarms for critical metrics like CPU usage, memory consumption, and error rates. Configure SNS notifications so you're alerted when thresholds are breached.

Distributed tracing helps you understand request flows across services. Use correlation IDs to track requests through your system. This is invaluable for debugging issues in microservices architectures.

Error tracking: Set up error tracking with tools like Sentry or DataDog's error tracking. Capture stack traces, user context, and request details. This helps you quickly identify and fix issues.

Performance monitoring: Track key performance indicators like response times, throughput, and error rates. Set up Service Level Objectives (SLOs) and Service Level Indicators (SLIs). Monitor these continuously and alert when they're at risk.

Log aggregation: Centralize your logs in a log aggregation system. This makes searching and analysis much easier. Use log rotation to prevent disk space issues. Retain logs according to compliance requirements.

Best practices: Log at the right level - don't over-log or under-log. Include enough context to understand what happened. Use correlation IDs for distributed systems. Monitor your monitoring - ensure your monitoring systems themselves are working.

Alerting: Set up alerts for critical issues but avoid alert fatigue. Use different severity levels. Test your alerts regularly. Document runbooks for common alerts so team members know how to respond.`,
  },
]

const categories = ["All", "Tools & Setup", "Development", "Security", "Operations"]

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showAnalyst, setShowAnalyst] = useState(false)
  const [analystMessages, setAnalystMessages] = useState<Message[]>([])
  const [analystInput, setAnalystInput] = useState("")
  const [analystLoading, setAnalystLoading] = useState(false)
  const [documentId, setDocumentId] = useState<string | null>(null)

  const filteredVideos = selectedCategory === "All" ? videos : videos.filter((v) => v.category === selectedCategory)

  const handleSummarizeWithAnalyst = async () => {
    if (!selectedVideo) return

    setShowAnalyst(true)
    setAnalystMessages([])
    setAnalystInput("")

    // Create a text file from the transcript
    const transcriptText = `Video Title: ${selectedVideo.title}\nCategory: ${selectedVideo.category}\nDescription: ${selectedVideo.description}\n\nTranscript:\n${selectedVideo.transcript}`

    try {
      // Convert transcript to a File-like object
      const blob = new Blob([transcriptText], { type: "text/plain" })
      const file = new File([blob], `${selectedVideo.title.replace(/\s+/g, "-").toLowerCase()}-transcript.txt`, {
        type: "text/plain",
      })

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/analyst/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload transcript")
      }

      const data = await response.json()
      setDocumentId(data.document_id)

      // Add welcome message
      setAnalystMessages([
        {
          id: "1",
          role: "ai",
          content: `✅ **Video transcript uploaded!**\n\nI've analyzed the transcript for **"${selectedVideo.title}"**. You can now ask me questions about this video. For example:\n\n- "Summarize the key points"\n- "What are the main steps?"\n- "Explain [specific topic] from the video"\n- "What should I remember about [topic]?"\n\nWhat would you like to know?`,
        },
      ])
    } catch (error) {
      console.error("Error uploading transcript:", error)
      setAnalystMessages([
        {
          id: "1",
          role: "ai",
          content: `Sorry, I encountered an error uploading the transcript. Please try again.`,
        },
      ])
    }
  }

  const handleAnalystSend = async (messageText: string) => {
    if (!messageText.trim() || !documentId || analystLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setAnalystMessages((prev) => [...prev, userMessage])
    setAnalystInput("")
    setAnalystLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyst/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: documentId,
          message: messageText,
        }),
      })

      if (!response.ok) {
        throw new Error("Chat request failed")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response,
      }

      setAnalystMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      }
      setAnalystMessages((prev) => [...prev, errorMessage])
    } finally {
      setAnalystLoading(false)
    }
  }

  const handleSourceClick = (source: string) => {
    console.log("Source clicked:", source)
  }

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
              <div className="lg:col-span-1 flex flex-col">
                <div className="bg-muted rounded-lg p-4 flex-1 overflow-y-auto max-h-96 mb-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Transcript</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedVideo.transcript}
                  </p>
                </div>
                <Button
                  onClick={handleSummarizeWithAnalyst}
                  className="w-full bg-primary hover:bg-primary/90"
                  variant="default"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Summarize with The Analyst
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analyst Modal */}
      {showAnalyst && selectedVideo && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-background rounded-xl overflow-hidden flex flex-col h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold text-foreground">Analyze: {selectedVideo.title}</h2>
                <p className="text-sm text-muted-foreground">Ask questions about this video transcript</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAnalyst(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-muted/30">
              {analystMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p>Loading transcript...</p>
                </div>
              ) : (
                analystMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} onSourceClick={handleSourceClick} />
                ))
              )}
              {analystLoading && (
                <div className="flex justify-start">
                  <div className="max-w-3xl">
                    <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={analystInput}
                  onChange={(e) => setAnalystInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleAnalystSend(analystInput)
                    }
                  }}
                  placeholder="Ask a question about this video..."
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={analystLoading || !documentId}
                />
                <Button
                  onClick={() => handleAnalystSend(analystInput)}
                  disabled={analystLoading || !analystInput.trim() || !documentId}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
