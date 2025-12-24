
import { ExternalLink } from "lucide-react"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "ai"
    content: string
    sources?: string[]
  }
  onSourceClick: (source: string) => void
}

export default function ChatMessage({ message, onSourceClick }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-md bg-primary text-primary-foreground rounded-xl p-4">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-2xl">
        <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-foreground">{message.content}</p>

          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
              {message.sources.map((source) => (
                <button
                  key={source}
                  onClick={() => onSourceClick(source)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-xs font-medium transition-colors"
                >
                  <span>Source:</span>
                  <span>{source}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
