
import { ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

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
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-3xl">
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown
              components={{
                // Style code blocks
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "")
                  return !inline && match ? (
                    <div className="my-4">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        customStyle={{
                          margin: 0,
                          borderRadius: "0.5rem",
                          padding: "1rem",
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                      {children}
                    </code>
                  )
                },
                // Style headings
                h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3 text-foreground">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
                // Style lists
                ul: ({ children }) => <ul className="list-disc list-outside my-3 ml-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside my-3 ml-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-foreground">{children}</li>,
                // Style paragraphs
                p: ({ children }) => <p className="my-3 leading-relaxed text-foreground">{children}</p>,
                // Style blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground bg-muted/50 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                // Style links
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                // Style strong/bold
                strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                // Style emphasis/italic
                em: ({ children }) => <em className="italic">{children}</em>,
                // Style horizontal rules
                hr: () => <hr className="my-4 border-border" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

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
