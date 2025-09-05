import { useEffect, useState } from "react"
import { getEventsData } from "../services/eventsService"
import type { EventData } from "../models/EventType"

export function useSubastaEvent() {
  const [subastaEvent, setSubastaEvent] = useState<EventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubastaEvent() {
      try {
        setIsLoading(true)
        setError(null)
        
        const events = await getEventsData()
        
        // Buscar evento que contenga "subasta" en el título (case insensitive)
        const subasta = events.find((event: EventData) => 
          event.title.toLowerCase().includes('subasta')
        )
        
        setSubastaEvent(subasta || null)
      } catch (err: any) {
        console.error("Error al cargar evento de subasta:", err)
        setError(err?.message ?? "Error cargando evento de subasta")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubastaEvent()
  }, [])

  return { subastaEvent, isLoading, error }
}
