import { useEffect, useRef } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../types/queryKey'

const SECTION_MAP: Record<string, string> = {
  principal: 'PrincipalPage',
  about: 'AboutUsPage',
  events: 'EventsPage',
  services: 'ServicesPage',
  forms: 'FormsPage',
  faq: 'FAQPage'
}

const SECTION_TO_QUERIES: Record<string, readonly string[]> = {
  principal: [queryKeys.principal[0]],
  about: [queryKeys.aboutUs[0]],
  events: [queryKeys.events[0]],
  services: [queryKeys.services[0]],
  forms: [],
  faq: [queryKeys.faqs[0]],
}

export function useAutoRefreshSection() {
  const search = useSearch({ strict: false }) as { section?: string }
  const queryClient = useQueryClient()
  const previousSection = useRef<string | undefined>(undefined)

  useEffect(() => {
    const currentSection = search.section

    if (currentSection && currentSection !== previousSection.current) {
      const elementId = SECTION_MAP[currentSection]
      if (elementId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(elementId)
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)

        const queriesToInvalidate = SECTION_TO_QUERIES[currentSection] || []
        queriesToInvalidate.forEach(queryKey => {
          queryClient.invalidateQueries({ queryKey: [queryKey] })
        })

        previousSection.current = currentSection
        return () => clearTimeout(timer)
      }
    }
  }, [search.section, queryClient])
}