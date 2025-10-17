import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { socket } from '../../../shared/lib/socket'
import { getInformativeServices } from '../services/servicesInformativeService'
import { queryKeys } from '../../../shared/types/queryKey'
import type { Service } from '../models/ServicesType'

type ServicePayload = {
  action: "created" | "updated" | "deleted"
  data?: Service
  id?: number | string
}

export function useServices() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.services,
    queryFn: getInformativeServices,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    const handler = (payload: ServicePayload) => {
      console.log('🔥 service:updated recibido:', payload)
      
      const currentData = queryClient.getQueryData<Service[]>(queryKeys.services) || []

      if (payload.action === "created" && payload.data) {
        queryClient.setQueryData(queryKeys.services, [payload.data, ...currentData])
      }

      if (payload.action === "updated" && payload.data) {
        queryClient.setQueryData(
          queryKeys.services,
          currentData.map(s => s.id === payload.data!.id ? payload.data! : s)
        )
      }

      if (payload.action === "deleted" && payload.id != null) {
        const idNum = Number(payload.id)
        queryClient.setQueryData(
          queryKeys.services,
          currentData.filter(s => s.id !== idNum)
        )
      }

      // FORZAR actualización
      queryClient.invalidateQueries({ queryKey: queryKeys.services })
    }

    socket.on("service:updated", handler)
    return () => {
      socket.off("service:updated", handler)
      return;
    }
  }, [queryClient])

  return {
    services: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}