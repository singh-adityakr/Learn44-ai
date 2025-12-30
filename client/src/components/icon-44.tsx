import { cn } from "@/lib/utils"

interface Icon44Props {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function Icon44({ className, size = "md" }: Icon44Props) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  }

  return (
    <div
      className={cn(
        "rounded-xl bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold",
        sizeClasses[size],
        className
      )}
    >
      <span>44</span>
    </div>
  )
}

