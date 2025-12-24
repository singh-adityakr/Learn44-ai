import { useState } from "react"
import Sidebar from "@/components/sidebar"
import CommandBar from "@/components/command-bar"
import Dashboard from "@/components/dashboard"
import ChatInterface from "@/components/chat-interface"
import VideoGallery from "@/components/video-gallery"
import DocumentAnalyzer from "@/components/document-analyzer"
import ResourceHub from "@/components/resource-hub"
import Checklist from "@/components/checklist"
import Glossary from "@/components/glossary"
import OrgChart from "@/components/org-chart"
import EnvironmentSetup from "@/components/environment-setup"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case "oracle":
        return <ChatInterface />
      case "tutor":
        return <VideoGallery />
      case "analyst":
        return <DocumentAnalyzer />
      case "resources":
        return <ResourceHub />
      case "checklist":
        return <Checklist />
      case "glossary":
        return <Glossary />
      case "org-chart":
        return <OrgChart />
      case "setup":
        return <EnvironmentSetup />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <CommandBar onNavigate={setCurrentPage} />
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 overflow-auto">{renderPage()}</main>
    </div>
  )
}

export default App

