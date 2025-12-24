
import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SummaryCard from "@/components/summary-card"

interface Summary {
  fileName: string
  keyTakeaways: string[]
  actionItems: string[]
  apiEndpoints: string[]
  isLoading: boolean
}

export default function DocumentAnalyzer() {
  const [isDragActive, setIsDragActive] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await analyzeFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      await analyzeFile(files[0])
    }
  }

  const analyzeFile = async (file: File) => {
    setSummary({
      fileName: file.name,
      keyTakeaways: [],
      actionItems: [],
      apiEndpoints: [],
      isLoading: true,
    })

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSummary({
      fileName: file.name,
      keyTakeaways: [
        "The document outlines key architectural patterns for microservices",
        "Event-driven architecture is recommended for scalability",
        "API rate limiting should be implemented at gateway level",
        "Database sharding strategy is detailed in Section 3",
      ],
      actionItems: [
        "Review and approve the proposed API design",
        "Set up monitoring for distributed tracing",
        "Configure message queue for event handling",
        "Update documentation with new endpoints",
        "Schedule team training on new architecture",
      ],
      apiEndpoints: [
        "/api/v1/documents/upload",
        "/api/v1/documents/{id}/analyze",
        "/api/v1/summaries/{id}",
        "/api/v1/metrics/performance",
        "/api/v1/health/status",
      ],
      isLoading: false,
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">The Analyst</h1>
          <p className="text-muted-foreground">Upload documents or code snippets for intelligent summarization</p>
        </div>

        {!summary ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Document or Code</CardTitle>
              <CardDescription>Drag and drop or click to select files (.pptx, .pdf, .json, .ts, .jsx)</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center
                  transition-all duration-200 cursor-pointer
                  ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                `}
              >
                <input
                  type="file"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pptx,.pdf,.json,.ts,.tsx,.jsx,.js,.py,.go"
                />

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Drag files here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse your computer</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Supported: PowerPoint, PDF, JSON, Code files</p>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {["PowerPoint", "PDF", "JSON", "TypeScript", "Python", "Go", "JavaScript", "Code"].map((format) => (
                  <div
                    key={format}
                    className="flex items-center justify-center p-3 rounded-lg bg-muted border border-border"
                  >
                    <span className="text-xs font-medium text-muted-foreground">{format}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Upload Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{summary.fileName}</CardTitle>
                  <CardDescription>Document analysis complete</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSummary(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
            </Card>

            {summary.isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="space-y-4 text-center">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <p className="text-muted-foreground">Analyzing document...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SummaryCard title="Key Takeaways" items={summary.keyTakeaways} icon="lightbulb" />
                <SummaryCard title="Action Items" items={summary.actionItems} icon="checkCircle" />
                <div className="md:col-span-2">
                  <SummaryCard title="API Endpoints" items={summary.apiEndpoints} icon="code" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
