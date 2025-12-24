
import { Lightbulb, CheckCircle2, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryCardProps {
  title: string
  items: string[]
  icon: "lightbulb" | "checkCircle" | "code"
}

const iconMap = {
  lightbulb: Lightbulb,
  checkCircle: CheckCircle2,
  code: Code,
}

export default function SummaryCard({ title, items, icon }: SummaryCardProps) {
  const Icon = iconMap[icon]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2"></div>
              <span className="text-sm text-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
