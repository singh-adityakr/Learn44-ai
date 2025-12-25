
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import SourceDrawer from "@/components/source-drawer"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  sources?: string[]
}

const quickActions = [
  "How to use Runway?",
  "What is LTL?",
  "Request JIRA access",
  "Docker setup guide",
  "SSH key configuration",
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Welcome to The Oracle, your AI-powered assistant for navigating project44. I can help you with onboarding questions, documentation, and more. What would you like to know?",
      sources: ["Confluence: Engineering Handbook"],
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [conversationId] = useState(() => `conv_${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // API base URL - adjust if your backend runs on a different port
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

  // Test backend connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`)
        if (response.ok) {
          console.log("✅ Backend connection successful")
        } else {
          console.warn("⚠️ Backend responded but may have issues")
        }
      } catch (error) {
        console.error("❌ Backend connection failed:", error)
        console.log(`Make sure the backend is running at ${API_BASE_URL}`)
      }
    }
    testConnection()
  }, [API_BASE_URL])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Call FastAPI backend
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation_id: conversationId,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response,
        sources: data.sources || [],
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Sorry, I'm having trouble connecting to the server at ${API_BASE_URL}. Please make sure the backend is running on port 8000. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sources: [],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    handleSendMessage(action)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-2xl font-bold text-foreground">The Oracle</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered onboarding assistant</p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} onSourceClick={(source) => setSelectedSource(source)} />
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-md bg-muted rounded-xl p-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-card p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(input)
              }
            }}
            placeholder="Ask me anything about your onboarding..."
            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Source Drawer */}
      {selectedSource && <SourceDrawer source={selectedSource} onClose={() => setSelectedSource(null)} />}
    </div>
  )
}
