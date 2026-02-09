import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import { usePrincipalEdit } from "./hooks/usePrincipal"
import { useSubastaEvent } from "../events/hooks/useSubastaEvent"
import { FirstVisitNotice } from "./components/FirstVisitNotice"

export default function PrincipalPage() {
  const { data: principal } = usePrincipalEdit()
  const { subastaEvent } = useSubastaEvent()

  if (!principal) {
    return (
      <div className="min-h-full flex items-center justify-center text-black text-xl">
        Cargando información...
      </div>
    )
  }

  return (
    <div className="relative min-h-full overflow-hidden text-white pt-14">
      <FirstVisitNotice
        event={subastaEvent}
        durationMs={12000}
        closeDelayMs={300}
        storage="session"
        onViewMore={() => {
          document
            .getElementById("EventsPage")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }}
      />

      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
        src="https://res.cloudinary.com/dyigmavwq/video/upload/v1768080154/Video_Project2_fguidi.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#0B0B0B]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/35 via-transparent to-[#0B0B0B]/55" />
        <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(11,11,11,0.45)]" />
      </div>

      {/* HERO CONTENT */}
      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-24">
          <section className="py-12 sm:py-16 lg:py-24">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#FAFDF4]/80">
                Eventos &amp; Subastas
              </div>

              {/* Headline */}
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-[#FAFDF4] font-semibold leading-[0.95]">
                ASOCIACIÓN CÁMARA
                <br />
                DE GANADEROS
                <br />
                HOJANCHA
              </h1>

              {/* Description */}
              <p className="mt-6 text-base sm:text-lg text-[#FAFDF4]/85 leading-relaxed">
                {principal.description}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="
                  w-full sm:w-auto rounded-xl
                  bg-[#1B2A10] text-[#FAFDF4]
                  border border-[#A7C4A0]/25
                  shadow-md shadow-[#0B0B0B]/35
                  transition-all duration-200
                  hover:bg-[#2C3F18]
                  hover:-translate-y-0.5
                  hover:shadow-xl hover:shadow-[#0B0B0B]/45
                  active:translate-y-0 active:shadow-lg
                  focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70
                  focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]/30
                "
              >
                <a href="#Footer">Contáctanos</a>
              </Button>

              <Button
    asChild
    variant="outline"
    size="lg"
    className="
      w-full sm:w-auto rounded-xl
      border border-[#A7C4A0]/45
      bg-[#F2ED9A]/15
      text-[#FAFDF4]
      backdrop-blur-md
      shadow-md shadow-[#0B0B0B]/20
      transition-all duration-200
      hover:bg-[#FAF7C6]/55
      hover:border-[#D6E5C8]/45
      hover:-translate-y-0.5
      hover:shadow-lg hover:shadow-[#0B0B0B]/30
      active:translate-y-0 active:shadow-md
      focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70
      focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]/30
    "
  >
    <a href="#AboutUsPage" className="inline-flex items-center gap-2">
      Conocer más <ChevronRight className="h-4 w-4" />
    </a>
  </Button>
            </div>


              {/* línea fina + texto inferior */}
              <div className="mt-6 flex items-center gap-3 text-xs text-[#FAFDF4]/70">
                <span className="h-px w-10 bg-[#FAFDF4]/35" />
                <span>Al servicio de la comunidad</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
