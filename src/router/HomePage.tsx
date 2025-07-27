
import { ScrollReveal } from '../animations/Scroll'
import AboutUsPage from '../pages/AboutUsPage'
import EventsPage from '../pages/EventsPage'
import FAQPage from '../pages/FAQPage'
import FormsPage from '../pages/FormsPage'
import PrincipalPage from '../pages/PrincipalPage'
import ServicesPage from '../pages/ServicesPage'

export default function HomePage() {
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
