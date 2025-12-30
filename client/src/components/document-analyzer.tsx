import type React from "react"

import { useState } from "react"
import { Upload, X, Send, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ChatMessage from "@/components/chat-message"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
}

interface UploadedDocument {
  document_id: string
  filename: string
}

export default function DocumentAnalyzer() {
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

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
      await uploadFile(files[0])
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      await uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    setUploading(true)
    setUploadError(null)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${API_BASE_URL}/api/analyst/upload`, {
        method: "POST",
        body: formData,
    })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Upload failed" }))
        throw new Error(errorData.detail || `Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      setUploadedDoc({
        document_id: data.document_id,
        filename: data.filename,
      })

      // Add welcome message
      setMessages([
        {
          id: "1",
          role: "ai",
          content: `✅ **Document uploaded successfully!**\n\nI've analyzed **${data.filename}**. You can now ask me questions about this document. For example:\n\n- "Summarize this document"\n- "What are the key points?"\n- "Explain [specific topic] from the document"\n- "What does this document say about [topic]?"\n\nWhat would you like to know?`,
        },
      ])
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || !uploadedDoc || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyst/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          document_id: uploadedDoc.document_id,
          message: messageText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Chat request failed" }))
        throw new Error(errorData.detail || `Request failed: ${response.statusText}`)
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleClearDocument = () => {
    setUploadedDoc(null)
    setMessages([])
    setInput("")
    setUploadError(null)
  }

  const handleSourceClick = (source: string) => {
    // For analyst, sources might be document sections
    console.log("Source clicked:", source)
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">The Analyst</h1>
          <p className="text-muted-foreground">Upload documents and ask questions for intelligent analysis and summarization</p>
        </div>

        {!uploadedDoc ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Drag and drop or click to select files (.pdf, .docx, .txt, .md, .json, .ts, .jsx, etc.)</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadError && (
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{uploadError}</p>
                </div>
              )}
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center
                  transition-all duration-200 cursor-pointer
                  ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                  ${uploading ? "opacity-50 pointer-events-none" : ""}
                `}
              >
                <input
                  type="file"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pptx,.pdf,.docx,.doc,.json,.ts,.tsx,.jsx,.js,.py,.go,.txt,.md"
                  disabled={uploading}
                />

                <div className="space-y-4">
                  {uploading ? (
                    <>
                      <div className="flex justify-center">
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-foreground">Uploading document...</p>
                    </>
                  ) : (
                    <>
                  <div className="flex justify-center">
                    <Upload className="w-12 h-12 text-primary/60" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">Drag files here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse your computer</p>
                  </div>
                      <p className="text-xs text-muted-foreground">Supported: PDF, DOCX, TXT, Markdown, Code files</p>
                    </>
                  )}
                </div>
              </div>

              {/* Supported Formats */}
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {["PDF", "DOCX", "Markdown", "Text", "TypeScript", "Python", "JavaScript", "JSON"].map((format) => (
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
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Document Header */}
            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                <div>
                    <CardTitle className="text-lg">{uploadedDoc.filename}</CardTitle>
                    <CardDescription>Ask questions about this document</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClearDocument}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
            </Card>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <p>Start a conversation by asking a question about the document.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onSourceClick={handleSourceClick}
                  />
                ))
              )}
              {loading && (
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
            <div className="flex gap-2">
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
                placeholder="Ask a question about this document..."
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
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
        )}
      </div>
    </div>
  )
}
