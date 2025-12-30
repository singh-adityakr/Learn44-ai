
import { LayoutDashboard, MessageCircle, Play, BarChart3, Link2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Icon44 from "@/components/icon-44"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "oracle", label: "The Oracle", icon: MessageCircle },
  { id: "tutor", label: "The Tutor", icon: Play },
  { id: "analyst", label: "The Analyst", icon: BarChart3 },
  { id: "resources", label: "Resources", icon: Link2 },
]

export default function Sidebar({ currentPage, setCurrentPage, open, setOpen }: SidebarProps) {
  // const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  return (
    <>
      {/* Mobile Toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="bg-sidebar text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen z-40
          bg-sidebar border-r border-sidebar-border
          transition-transform duration-300 lg:translate-x-0
          w-64 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Icon44 size="md" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Learn44.ai</h1>
              <p className="text-xs text-slate-gray">Enterprise Onboarding</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id)
                    setOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/10">
            <Icon44 size="md" className="rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">New Voyager</p>
              <p className="text-xs text-muted-foreground">Day 1</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
