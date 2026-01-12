import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  icon: React.ReactNode
  title: string
  description: string
}

export function AboutUsCard({ icon, title, description }: Props) {
  const safeDescription = description?.trim()

  return (
    <Card
      className="
        group
        border-muted/60
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
      "
    >
      {/* Línea superior reactiva */}
      <div
        className="
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#D9E2B6]
          to-transparent
          transition-all
          duration-300
          group-hover:h-[3px]
          group-hover:via-[#8FAF3C]
        "
      />

      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div
          className="
            flex h-10 w-10 items-center justify-center rounded-xl
            border border-[#D9E2B6]
            bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]
            transition-colors duration-300
            group-hover:border-[#8FAF3C]
          "
        >
          {icon}
        </div>

        <CardTitle className="text-lg text-[#2E321B]">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
          {safeDescription || "Sin información disponible por el momento."}
        </p>
      </CardContent>
    </Card>
  )
}
