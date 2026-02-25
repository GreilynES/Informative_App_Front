import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { socket } from '../../../shared/lib/socket'
import { getAboutUs } from '../services/aboutUsService'
import { queryKeys } from '../../../shared/types/queryKey'
import type { AboutUsSection } from '../models/AboutUsType'

type AboutUsPayload = {
  action: "created" | "updated" | "deleted"
  data?: AboutUsSection
  id?: number | string
}

export const useAboutUs = () => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.aboutUs,
    queryFn: getAboutUs,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    const handler = (payload: AboutUsPayload) => {      
      const currentData = queryClient.getQueryData<AboutUsSection[]>(queryKeys.aboutUs) || []

      if (payload.action === "created" && payload.data) {
        queryClient.setQueryData(queryKeys.aboutUs, [payload.data, ...currentData])
      }

      if (payload.action === "updated" && payload.data) {
        queryClient.setQueryData(
          queryKeys.aboutUs,
          currentData.map(item => item.id === payload.data!.id ? payload.data! : item)
        )
      }

      if (payload.action === "deleted" && payload.id != null) {
        const idNum = Number(payload.id)
        queryClient.setQueryData(
          queryKeys.aboutUs,
          currentData.filter(item => item.id !== idNum)
        )
      }

      // FORZAR actualización
      queryClient.invalidateQueries({ queryKey: queryKeys.aboutUs })
    }

    socket.on("aboutUs:updated", handler)
    return () => { socket.off("aboutUs:updated", handler) }
  }, [queryClient])

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}