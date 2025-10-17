import { useEventsSubastaFirst } from './useEvents'

export function useSubastaEvent() {
  const { events, isLoading, error } = useEventsSubastaFirst()
  
  const subastaEvent = events.find(event => 
    event.title.toLowerCase().includes('subasta')
  ) || null

  return { subastaEvent, isLoading, error }
}