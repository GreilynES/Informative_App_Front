import { useEffect, useRef, useState } from "react"
import { getEventsData } from "../services/eventsService"
import type { EventData } from "../models/EventType"
import { socket } from "../lib/socket"

export type EventPayload<T> = {
  action: "created" | "updated" | "deleted";
  data?: T;
  id?: number | string;
};

/** Prioriza el evento que contenga “subasta” en el título (case-insensitive). */
export function orderSubastaFirst(arr: EventData[]): EventData[] {
  if (!Array.isArray(arr) || arr.length === 0) return arr
  const idx = arr.findIndex(e => (e?.title ?? "").toLowerCase().includes("subasta"))
  if (idx <= 0) return arr
  const copy = arr.slice()
  const [subasta] = copy.splice(idx, 1)
  return [subasta, ...copy]
}

/** Socket realtime genérico (se mantiene igual para compatibilidad). */
export function useEventRealtime<T>(onChange: (p: EventPayload<T>) => void) {
  const cbRef = useRef(onChange)
  useEffect(() => { cbRef.current = onChange }, [onChange])

  useEffect(() => {
    function onCreated(data: T) { cbRef.current({ action: "created", data }) }
    function onUpdated(data: T) { cbRef.current({ action: "updated", data }) }
    function onDeleted(id: number | string) { cbRef.current({ action: "deleted", id }) }

    socket.on("event:created", onCreated)
    socket.on("event:updated", onUpdated)
    socket.on("event:deleted", onDeleted)

    return () => {
      socket.off("event:created", onCreated)
      socket.off("event:updated", onUpdated)
      socket.off("event:deleted", onDeleted)
    }
  }, [])
}

/** Fetch simple (HTTP) — sin ordenar (compatibilidad). */
export function useEvents() {
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
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

/**
 * Hook listo para UI: devuelve eventos ya ORDENADOS con “Subasta” al inicio
 * y expone un setter seguro para actualizaciones en tiempo real también ordenadas.
 */
export function useEventsSubastaFirst() {
  const { events, isLoading } = useEvents()
  const [ordered, setOrdered] = useState<EventData[]>([])

  // Seed inicial con la subasta primero
  useEffect(() => {
    setOrdered(orderSubastaFirst(events))
  }, [events])

  // Helper para aplicar orden ante cambios (útil desde realtime)
  const applyRealtime = (payload: EventPayload<EventData>) => {
    setOrdered(prev => {
      let base = prev
      switch (payload.action) {
        case "created":
          if (payload.data) base = [payload.data, ...prev]
          break
        case "updated":
          if (payload.data) {
            base = prev.map(e => e.id === payload.data!.id ? payload.data! : e)
          }
          break
        case "deleted":
          if (payload.id != null) {
            const idNum = Number(payload.id)
            base = prev.filter(e => e.id !== idNum)
          }
          break
      }
      return orderSubastaFirst(base)
    })
  }

  return { events: ordered, isLoading, applyRealtime }
}
