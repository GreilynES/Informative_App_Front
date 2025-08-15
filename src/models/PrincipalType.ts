import type { ReactNode } from "react"
import type { EventData } from "./EventType"

export type PrincipalType = {
  date: ReactNode
  illustration: string
  title: string
  description: string
  event: EventData
}
