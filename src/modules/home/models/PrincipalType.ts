import type { ReactNode } from "react"
import type { EventData } from "../../events/models/EventType"

export type PrincipalType = {
  date: ReactNode
  illustration: string
  title: string
  description: string
  event: EventData
}

// API types for service operations
export type PrincipalEdition = {
  id: number
  title: string
  description: string
  illustration?: string
  event?: EventData
  createdAt?: string
  updatedAt?: string
}

export type PrincipalUpdate = {
  title: string
  description: string
  illustration?: string
}
