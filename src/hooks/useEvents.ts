import { useEffect, useRef, useState } from "react"
import { getEventsData } from "../services/eventsService"
import type { EventData } from "../models/EventType"
import { socket } from "../lib/socket"


export type EventPayload<T> = {
  action: "created" | "updated" | "deleted";
  data?: T;
  id?: number | string;
};

export function useEventRealtime<T>(onChange: (p: EventPayload<T>) => void) {
  const cbRef = useRef(onChange);
  useEffect(() => { cbRef.current = onChange; }, [onChange]);

  useEffect(() => {
    const handler = (payload: EventPayload<T>) => {
      if (payload.action === "created" && payload.data) return cbRef.current(payload);
      if (payload.action === "updated" && payload.data) return cbRef.current(payload);
      if (payload.action === "deleted" && payload.id != null) {
        const idNum = Number(payload.id);
        if (!Number.isNaN(idNum)) return cbRef.current({ ...payload, id: idNum });
      }
    };
  
    socket.on("event:updated", handler);
return () => { socket.off("event:updated", handler); };
  }, []); 
}

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
