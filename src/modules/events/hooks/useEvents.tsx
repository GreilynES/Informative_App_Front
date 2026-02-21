import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { socket } from '../../../shared/lib/socket'
import { getEventsData } from '../services/eventsService'
import { queryKeys } from '../../../shared/types/queryKey'
import type { EventData } from '../models/EventType'

export type EventPayload<T> = {
  action: "created" | "updated" | "deleted"
  data?: T
  id?: number | string
}

export function orderSubastaFirst(arr: EventData[]): EventData[] {
  if (!Array.isArray(arr) || arr.length === 0) return arr
  const idx = arr.findIndex(e => (e?.title ?? "").toLowerCase().includes("subasta"))
  if (idx <= 0) return arr
  const copy = arr.slice()
  const [subasta] = copy.splice(idx, 1)
  return [subasta, ...copy]
}

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

export function useEventsSubastaFirst() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.events,
    queryFn: async () => {
      const data = await getEventsData()
      return orderSubastaFirst(data)
    },
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    const applyRealtime = (payload: EventPayload<EventData>) => {
      
      const currentData = queryClient.getQueryData<EventData[]>(queryKeys.events) || []
      let newData = currentData

      switch (payload.action) {
        case "created":
          if (payload.data) newData = [payload.data, ...currentData]
          break
        case "updated":
          if (payload.data) {
            newData = currentData.map(e => e.id === payload.data!.id ? payload.data! : e)
          }
          break
        case "deleted":
          if (payload.id != null) {
            const idNum = Number(payload.id)
            newData = currentData.filter(e => e.id !== idNum)
          }
          break
      }

      queryClient.setQueryData(queryKeys.events, orderSubastaFirst(newData))
      // FORZAR actualización
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
    }

    function onCreated(data: EventData) { applyRealtime({ action: "created", data }) }
    function onUpdated(data: EventData) { applyRealtime({ action: "updated", data }) }
    function onDeleted(id: number | string) { applyRealtime({ action: "deleted", id }) }

    socket.on("event:created", onCreated)
    socket.on("event:updated", onUpdated)
    socket.on("event:deleted", onDeleted)

    return () => {
      socket.off("event:created", onCreated)
      socket.off("event:updated", onUpdated)
      socket.off("event:deleted", onDeleted)
    }
  }, [queryClient])

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}