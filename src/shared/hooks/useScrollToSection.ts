import { useEffect } from 'react'
import { useSearch } from '@tanstack/react-router'

const SECTION_MAP: Record<string, string> = {
  principal: 'PrincipalPage',
  about: 'AboutUsPage',
  events: 'EventsPage',
  services: 'ServicesPage',
  forms: 'FormsPage',
  faq: 'FAQPage',   
}

export function useScrollToSection() {
  const search = useSearch({ strict: false }) as { section?: string }

  useEffect(() => {
    if (search.section) {
      const elementId = SECTION_MAP[search.section]
      if (elementId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(elementId)
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        
        return () => clearTimeout(timer)
      }
    }
  }, [search.section])
}