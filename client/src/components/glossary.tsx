
import { useState } from "react"
import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface GlossaryItem {
  term: string
  definition: string
  category: string
}

const glossaryItems: GlossaryItem[] = [
  {
    term: "Dwell Time",
    definition: "The amount of time a shipment spends stationary at a location.",
    category: "Logistics",
  },
  {
    term: "ELD",
    definition: "Electronic Logging Device - records hours of service for drivers.",
    category: "Logistics",
  },
  {
    term: "API v4",
    definition: "The latest version of our REST API with enhanced features and performance.",
    category: "Technology",
  },
  {
    term: "Runway",
    definition: "Our testing environment portal for deploying and validating changes.",
    category: "Tools",
  },
  {
    term: "Microservices",
    definition: "Architectural approach using small, independent services.",
    category: "Technology",
  },
  {
    term: "Rate Limiting",
    definition: "Controlling the number of API requests per time period.",
    category: "Technology",
  },
  {
    term: "RLS",
    definition: "Row-Level Security - database-level access control.",
    category: "Security",
  },
  {
    term: "SSH",
    definition: "Secure Shell Protocol for secure remote server access.",
    category: "Security",
  },
  {
    term: "Docker",
    definition: "Containerization platform for packaging applications.",
    category: "Tools",
  },
  {
    term: "Load Balancing",
    definition: "Distributing network traffic across multiple servers.",
    category: "Technology",
  },
]

const categories = ["All", "Logistics", "Technology", "Tools", "Security"]

export default function Glossary() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filtered = glossaryItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Glossary</h1>
          <p className="text-muted-foreground">Understanding company terminology and concepts</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No terms found.</p>
          ) : (
            filtered.map((item) => (
              <Card key={item.term}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground">{item.term}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{item.category}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.definition}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
