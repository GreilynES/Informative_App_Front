import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { socket } from '../../../shared/lib/socket'
import { fetchSinglePrincipal, updatePrincipal, createPrincipal } from '../services/principalService'
import { queryKeys } from '../../../shared/types/queryKey'
import type { PrincipalEdition, PrincipalUpdate } from '../models/PrincipalType'

type PrincipalRT = {
  action: 'created' | 'updated' | 'deleted'
  data?: PrincipalEdition
  id?: number | string
}

export function usePrincipalEdit() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: queryKeys.principal,
    queryFn: fetchSinglePrincipal,
    staleTime: 5 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: PrincipalUpdate }) => 
      updatePrincipal(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.principal })
    },
  })

  const createMutation = useMutation({
    mutationFn: (input: PrincipalUpdate) => createPrincipal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.principal })
    },
  })

  useEffect(() => {
    const handler = (payload: PrincipalRT) => {
      console.log('🔥 principal:updated recibido:', payload)
      
      if (payload?.data) {
        queryClient.setQueryData(queryKeys.principal, payload.data)
      }
      
      // FORZAR actualización
      queryClient.invalidateQueries({ queryKey: queryKeys.principal })
    }

    socket.on('principal:updated', handler)
    return () => {
      socket.off('principal:updated', handler)
    }
  }, [queryClient])

  return {
    data: query.data || null,
    loading: query.isLoading,
    saving: updateMutation.isPending || createMutation.isPending,
    error: query.error?.message || updateMutation.error?.message || createMutation.error?.message || null,
    save: (input: PrincipalUpdate) => {
      if (query.data) {
        updateMutation.mutate({ id: query.data.id, input })
      }
    },
    create: (input: PrincipalUpdate) => createMutation.mutate(input),
    reload: () => queryClient.invalidateQueries({ queryKey: queryKeys.principal }),
  }
}