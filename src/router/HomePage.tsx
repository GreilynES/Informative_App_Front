import AboutUsPage from '../modules/about-us/AboutUsPage'
import EventsPage from '../modules/events/EventsPage'
import FormsPage from '../modules/home/FormsPage'
import PrincipalPage from '../modules/home/PrincipalPage'
import ServicesPage from '../modules/services/ServicesPage'
import { ScrollReveal } from '../shared/animations/Scroll'
import FAQPage from '../modules/faq/FAQPage'
import { useAutoRefreshSection } from '../shared/hooks/useAutoRefreshSection'
import { useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const search = useSearch({ from: '/' });
  const [showPrincipal, setShowPrincipal] = useState(false);
  useAutoRefreshSection()

  useEffect(() => {
    // Revelar la página principal al cargar
    setShowPrincipal(true);
  }, []);

  useEffect(() => {
    if (!search.section || search.section === 'PrincipalPage') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(search.section as string);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }, [search.section]);

  return (
    <>
      <div 
        id="PrincipalPage"
        style={{
          opacity: showPrincipal ? 1 : 0,
          transition: 'opacity 1000ms cubic-bezier(0.28, 0.11, 0.32, 1)',
          willChange: 'opacity',
        }}
      >
        <PrincipalPage />
      </div>

      <div id="AboutUsPage">
        <ScrollReveal duration={800} distance={30}>
          <AboutUsPage />
        </ScrollReveal>
      </div>

      <div id="EventsPage">
        <ScrollReveal duration={800} distance={30}>
          <EventsPage />
        </ScrollReveal>
      </div>

      <div id="ServicesPage">
        <ScrollReveal duration={800} distance={30}>
          <ServicesPage />
        </ScrollReveal>
      </div>

      <div id="FormsPage">
        <ScrollReveal duration={800} distance={30}>
          <FormsPage />
        </ScrollReveal>
      </div>

      <div id="FAQPage">
        <ScrollReveal duration={800} distance={30}>
          <FAQPage />
        </ScrollReveal>
      </div>
    </>
  )
}