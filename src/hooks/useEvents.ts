import { useEffect, useState } from "react"
import { getEventsData } from "../services/eventsService"
import type { EventData } from "../models/EventType"



export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEventsData()
        setEvents(data)
      } catch (error) {
        console.error("Error al cargar eventos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { events, isLoading }
}
