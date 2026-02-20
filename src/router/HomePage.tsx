import AboutUsPage from '../modules/about-us/AboutUsPage'
import EventsPage from '../modules/events/EventsPage'
import FormsPage from '../modules/home/FormsPage'
import PrincipalPage from '../modules/home/PrincipalPage'
import ServicesPage from '../modules/services/ServicesPage'
import { ScrollReveal } from '../shared/animations/Scroll'
import FAQPage from '../modules/faq/FAQPage'
import { useAutoRefreshSection } from '../shared/hooks/useAutoRefreshSection'
import { useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Seo } from '@/shared/seo/Seo'

export default function HomePage() {
  const search = useSearch({ from: '/' });
  const [showPrincipal, setShowPrincipal] = useState(false);
  
  const principalRef = useRef<HTMLDivElement | null>(null)
  const [isPrincipalInView, setIsPrincipalInView] = useState(true)

  useAutoRefreshSection()

  useEffect(() => {
    // Revelar la página principal al cargar
    setShowPrincipal(true);
  }, []);

   useEffect(() => {
    if (!principalRef.current) return

    const el = principalRef.current

    const obs = new IntersectionObserver(
      ([entry]) => {
        // true cuando el hero está visible en pantalla
        setIsPrincipalInView(entry.isIntersecting)
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -30% 0px",
      }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

    useEffect(() => {
    if (!search.section || search.section === "PrincipalPage") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
      return
    }

    setTimeout(() => {
      const element = document.getElementById(search.section as string)
      if (element) element.scrollIntoView({ behavior: "smooth", block: "start" })
      else window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }, [search.section])

  return (
    <>
      <Seo
        title="Cámara de Ganaderos de Hojancha | Inicio"
        description="Información, eventos, servicios y gestión de la Cámara de Ganaderos de Hojancha."
        canonical="https://TU-DOMINIO.com/"
        image="https://TU-DOMINIO.com/og/home.jpg"
      />

       <div
        id="PrincipalPage"
        ref={principalRef}
        style={{
          opacity: showPrincipal ? 1 : 0,
          transition: "opacity 1000ms cubic-bezier(0.28, 0.11, 0.32, 1)",
          willChange: showPrincipal ? "auto" : "opacity",
        }}
      >
        <PrincipalPage noticeVisible={isPrincipalInView} />
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