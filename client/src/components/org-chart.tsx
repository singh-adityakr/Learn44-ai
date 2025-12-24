
import { Card } from "@/components/ui/card"

interface TeamMember {
  name: string
  role: string
  department: string
}

interface Department {
  name: string
  color: string
  members: TeamMember[]
}

const departments: Department[] = [
  {
    name: "Engineering",
    color: "bg-blue-50",
    members: [
      { name: "Alex Chen", role: "VP Engineering", department: "Engineering" },
      { name: "Sarah Johnson", role: "Frontend Lead", department: "Engineering" },
      { name: "Mike Davis", role: "Backend Lead", department: "Engineering" },
      { name: "Lisa Wong", role: "DevOps Engineer", department: "Engineering" },
    ],
  },
  {
    name: "Product",
    color: "bg-purple-50",
    members: [
      { name: "James Lee", role: "VP Product", department: "Product" },
      { name: "Emily Rodriguez", role: "Senior PM", department: "Product" },
      { name: "David Kim", role: "Product Designer", department: "Product" },
    ],
  },
  {
    name: "Sales & CS",
    color: "bg-green-50",
    members: [
      { name: "Rachel Smith", role: "VP Sales", department: "Sales & CS" },
      { name: "Tom Brown", role: "Account Manager", department: "Sales & CS" },
      { name: "Karen White", role: "Customer Success", department: "Sales & CS" },
    ],
  },
  {
    name: "Operations",
    color: "bg-amber-50",
    members: [
      { name: "Robert Taylor", role: "VP Operations", department: "Operations" },
      { name: "Nicole Garcia", role: "HR Manager", department: "Operations" },
      { name: "Chris Martinez", role: "Finance Manager", department: "Operations" },
    ],
  },
]

export default function OrgChart() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Organization Chart</h1>
          <p className="text-muted-foreground">Understand our team structure and departments</p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div key={dept.name} className={`${dept.color} rounded-xl p-6`}>
              <h2 className="text-lg font-bold text-foreground mb-4">{dept.name}</h2>
              <div className="space-y-4">
                {dept.members.map((member) => (
                  <Card key={member.name} className="p-3">
                    <p className="font-medium text-sm text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Company Structure Info */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Company Structure</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            project44 is organized into four main departments: Engineering handles all technical development and
            infrastructure. Product manages feature development and user experience. Sales & Customer Success focuses on
            clients and account growth. Operations handles HR, finance, and administrative functions. Each department
            has a VP-level leader reporting to the CEO.
          </p>
        </Card>
      </div>
    </div>
  )
}
