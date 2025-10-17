import AboutUsPage from '../modules/about-us/AboutUsPage'
import EventsPage from '../modules/events/EventsPage'
import FormsPage from '../modules/home/FormsPage'
import PrincipalPage from '../modules/home/PrincipalPage'
import ServicesPage from '../modules/services/ServicesPage'
import { ScrollReveal } from '../shared/animations/Scroll'
import FAQPage from '../modules/faq/FAQPage'
import { useAutoRefreshSection } from '../shared/hooks/useAutoRefreshSection'

export default function HomePage() {
  useAutoRefreshSection()

  return (
    <>
      <ScrollReveal direction="fade" duration={800}>
        <div id="PrincipalPage">
          <PrincipalPage />
        </div>
      </ScrollReveal>

      <div id="AboutUsPage">
        <ScrollReveal direction="up" delay={100} duration={700}>
          <AboutUsPage />
        </ScrollReveal>
      </div>

      <div id="EventsPage">
        <ScrollReveal direction="left" delay={150} duration={700}>
          <EventsPage />
        </ScrollReveal>
      </div>

      <div id="ServicesPage">
        <ScrollReveal direction="up" delay={200} duration={700}>
          <ServicesPage />
        </ScrollReveal>
      </div>

      <div id="FormsPage">
        <ScrollReveal direction="right" delay={100} duration={700}>
          <FormsPage />
        </ScrollReveal>
      </div>

      <div id="FAQPage">
        <ScrollReveal direction="up" delay={150} duration={700}>
          <FAQPage />
        </ScrollReveal>
      </div>
    </>
  )
}