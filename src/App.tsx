import AboutUsPage from './pages/AboutUsPage'
import EventsPage from './pages/EventsPage'
import Navbar from './pages/Navbar'
import PrincipalPage from './pages/PrincipalPage'
import FormsPage from './pages/FormsPage'
import ServicesPage from './pages/ServicesPage'
import FAQPage from './pages/FAQPage'
import Footer from './pages/Footer'
import { ScrollReveal } from './animations/Scroll'
import FloatingWhatsapp from './components/FloatingWhatsapp'


function App() {

  return (
    <> 
    <ScrollReveal direction="fade" duration={800}>
      <Navbar />

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

      <div id="FooterPage">
        <ScrollReveal direction="fade" delay={100} duration={600}>
          <Footer />
        </ScrollReveal>
      </div>

      <FloatingWhatsapp />
    </>
  )
}

export default App