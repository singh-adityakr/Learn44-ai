
import { useState, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"

interface CommandBarProps {
  onNavigate: (page: string) => void
}

interface Command {
  id: string
  title: string
  description: string
  page: string
  category: string
}

const commands: Command[] = [
  {
    id: "1",
    title: "Dashboard",
    description: "View your onboarding overview",
    page: "dashboard",
    category: "Navigation",
  },
  {
    id: "2",
    title: "Chat with Oracle",
    description: "Ask questions to the AI assistant",
    page: "oracle",
    category: "Navigation",
  },
  { id: "3", title: "Video Training", description: "Browse video tutorials", page: "tutor", category: "Navigation" },
  {
    id: "4",
    title: "Upload Document",
    description: "Analyze documents with The Analyst",
    page: "analyst",
    category: "Navigation",
  },
  {
    id: "5",
    title: "Resources",
    description: "Access all documentation and tools",
    page: "resources",
    category: "Navigation",
  },
  { id: "6", title: "Checklist", description: "View Day 1 to Day 30 checklist", page: "checklist", category: "Pages" },
  { id: "7", title: "Glossary", description: "Learn company terminology", page: "glossary", category: "Pages" },
  { id: "8", title: "Organization Chart", description: "Explore team structure", page: "org-chart", category: "Pages" },
  {
    id: "9",
    title: "Environment Setup",
    description: "Configure your development environment",
    page: "setup",
    category: "Pages",
  },
]

export default function CommandBar({ onNavigate }: CommandBarProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Command[]>([])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  useEffect(() => {
    if (search.trim()) {
      const filtered = commands.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(search.toLowerCase()) ||
          cmd.description.toLowerCase().includes(search.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults(commands)
    }
  }, [search])

  const handleSelect = (page: string) => {
    onNavigate(page)
    setOpen(false)
    setSearch("")
  }

  return (
    <>
      {/* Command Bar Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-40 hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search...</span>
        <span className="text-xs font-mono bg-background px-2 py-0.5 rounded">⌘K</span>
      </button>

      {/* Command Bar Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20 p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* Command Bar */}
          <div className="relative w-full max-w-xl bg-background rounded-lg border border-border shadow-lg">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pages, commands..."
                autoFocus
                className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
              />
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No results found</p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {results.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.page)}
                      className="w-full flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{cmd.title}</p>
                        <p className="text-xs text-muted-foreground">{cmd.description}</p>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground bg-background px-2 py-1 rounded">
                        {cmd.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground flex items-center justify-between bg-muted/50">
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
