
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle, Zap } from "lucide-react"

export default function Dashboard() {
  const onboardingProgress = 35
  const tasksCompleted = 7
  const tasksTotal = 20

  const recentActivities = [
    { title: "Completed Docker Setup", time: "2 hours ago", icon: CheckCircle2, color: "text-green-500" },
    { title: "Viewed Runway Portal Guide", time: "4 hours ago", icon: Clock, color: "text-blue-500" },
    { title: "SSH Keys Pending", time: "1 day ago", icon: AlertCircle, color: "text-amber-500" },
  ]

  const upcomingTasks = [
    { title: "Setup Development Environment", priority: "high", daysLeft: 1 },
    { title: "Attend Team Onboarding Meeting", priority: "high", daysLeft: 1 },
    { title: "Review Engineering Handbook", priority: "medium", daysLeft: 3 },
    { title: "Complete Security Training", priority: "medium", daysLeft: 5 },
  ]

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, New Voyager</h1>
          <p className="text-muted-foreground">Your onboarding journey at project44 starts here</p>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Onboarding Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-primary">{onboardingProgress}%</div>
                <Progress value={onboardingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {tasksCompleted} of {tasksTotal} tasks completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">2</div>
                <p className="text-sm text-muted-foreground">Tasks due in next 24 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">5 days</div>
                <p className="text-sm text-muted-foreground">Keep it up! Keep learning</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Next steps in your onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              task.priority === "high" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {task.priority === "high" ? "High" : "Medium"}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.daysLeft} days left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, idx) => {
                    const Icon = activity.icon
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${activity.color}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Start Resources</CardTitle>
            <CardDescription>Common resources you might need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Handbook", "GitHub", "Confluence", "Okta"].map((resource) => (
                <button
                  key={resource}
                  className="p-4 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground transition-colors text-center font-medium"
                >
                  {resource}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
