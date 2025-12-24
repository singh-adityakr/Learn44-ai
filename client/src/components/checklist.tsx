
import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChecklistItem {
  day: string
  title: string
  tasks: { title: string; completed: boolean }[]
}

const checklistItems: ChecklistItem[] = [
  {
    day: "Day 1",
    title: "Welcome & Orientation",
    tasks: [
      { title: "Complete security training", completed: true },
      { title: "Set up SSH keys", completed: true },
      { title: "Join team Slack channels", completed: false },
      { title: "Review handbook", completed: false },
    ],
  },
  {
    day: "Days 2-5",
    title: "Development Setup",
    tasks: [
      { title: "Install Docker & tools", completed: false },
      { title: "Clone repositories", completed: false },
      { title: "Configure IDE", completed: false },
      { title: "Run local environment", completed: false },
    ],
  },
  {
    day: "Days 6-10",
    title: "Onboarding Projects",
    tasks: [
      { title: "Complete first task", completed: false },
      { title: "Code review participation", completed: false },
      { title: "Attend standup meetings", completed: false },
      { title: "Document your setup", completed: false },
    ],
  },
  {
    day: "Days 11-20",
    title: "Integration & Learning",
    tasks: [
      { title: "API integration project", completed: false },
      { title: "Database query optimization", completed: false },
      { title: "Performance profiling", completed: false },
      { title: "Attend workshops", completed: false },
    ],
  },
  {
    day: "Days 21-30",
    title: "Independence & Contribution",
    tasks: [
      { title: "Lead a feature implementation", completed: false },
      { title: "Mentor code reviews", completed: false },
      { title: "Document best practices", completed: false },
      { title: "Complete onboarding survey", completed: false },
    ],
  },
]

export default function Checklist() {
  const completedCount = checklistItems.reduce(
    (acc, section) => acc + section.tasks.filter((t) => t.completed).length,
    0,
  )
  const totalCount = checklistItems.reduce((acc, section) => acc + section.tasks.length, 0)
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Launch44 Checklist</h1>
          <p className="text-muted-foreground">Your 30-day onboarding journey</p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checklist Sections */}
        <div className="space-y-6">
          {checklistItems.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">{section.day}</CardTitle>
                <CardDescription>{section.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.tasks.map((task, taskIdx) => (
                    <div key={taskIdx} className="flex items-center gap-3">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
