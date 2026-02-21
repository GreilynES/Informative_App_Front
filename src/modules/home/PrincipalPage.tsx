import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePrincipalEdit } from "./hooks/usePrincipal"
import { useSubastaEvent } from "../events/hooks/useSubastaEvent"
import { FirstVisitNotice } from "./components/FirstVisitNotice"
import { PageState } from "@/shared/ui/PageState"
import { useEffect, useState } from "react"

type Props = { noticeVisible?: boolean }

export default function PrincipalPage({ noticeVisible = true }: Props) {
  const { data: principal, loading, error } = usePrincipalEdit()
  const { subastaEvent } = useSubastaEvent()

  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setShowVideo(!isMobile && !reducedMotion)
  }, [])

  const poster =
    "https://res.cloudinary.com/dyigmavwq/video/upload/so_1,f_webp,q_auto,w_1920/v1771529238/vide5s_z8uetq.webp"

  const videoSrc =
    "https://res.cloudinary.com/dyigmavwq/video/upload/q_auto:best,br_3000k,w_1920,f_mp4,vc_h264,fl_progressive/v1771529238/vide5s_z8uetq.mp4"

  return (
    <PageState
      isLoading={!!loading && !principal}
      isEmpty={!loading && !principal && !error}
      withContainer={false}
      emptyTitle="No hay información para mostrar"
      emptyDescription="Aún no se ha publicado contenido para esta sección."
    >
      {error ? (
        <div className="min-h-full flex items-center justify-center px-6 py-20">
          <p className="text-center text-muted-foreground">No pudimos cargar la información.</p>
        </div>
      ) : principal ? (
        <div
          data-page="principal"
          className="relative min-h-full overflow-hidden text-white pt-14"
        >
          <FirstVisitNotice
            event={subastaEvent}
            durationMs={12000}
            closeDelayMs={300}
            storage="session"
            visible={noticeVisible}  
            onViewMore={() => {
              document.getElementById("EventsPage")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }}
          />

          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          {showVideo && (
            <video
              className="absolute inset-0 -z-20 h-full w-full object-cover pointer-events-none"
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={poster}
              aria-hidden="true"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute inset-0 bg-[#0B0B0B]/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/35 via-transparent to-[#0B0B0B]/55" />
            <div className="absolute inset-0 [box-shadow:inset_0_0_120px_rgba(11,11,11,0.45)]" />
          </div>

          <main className="relative z-10">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-24">
              <section className="py-12 sm:py-16 lg:py-24">
                <div className="max-w-2xl">
                  <div className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] uppercase text-[#FAFDF4]/80 animate-in fade-in slide-in-from-left-4 duration-600 delay-100">
                    Eventos &amp; Subastas
                  </div>

                  <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-[#FAFDF4] font-semibold leading-[0.95] animate-in fade-in slide-in-from-left-6 duration-700 delay-200">
                    ASOCIACIÓN CÁMARA
                    <br />
                    DE GANADEROS
                    <br />
                    HOJANCHA
                  </h1>

                  <p className="mt-6 text-base sm:text-lg text-[#FAFDF4]/85 leading-relaxed animate-in fade-in slide-in-from-left-5 duration-700 delay-300">
                    {principal.description}
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-left-5 duration-700 delay-400">
  <Button
    asChild
    size="lg"
    className="w-full sm:w-auto rounded-xl bg-[#1B2A10] text-[#FAFDF4] border border-[#A7C4A0]/25 shadow-md shadow-[#0B0B0B]/35 transition-all duration-200 hover:bg-[#2C3F18] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B0B0B]/45 active:translate-y-0 active:shadow-lg focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]/30"
  >
    <a
      href="#Footer"
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        document.getElementById("Footer")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }}
    >
      Contáctanos
    </a>
  </Button>

  <Button
    asChild
    variant="outline"
    size="lg"
    className="w-full sm:w-auto rounded-xl border border-[#A7C4A0]/45 bg-[#F2ED9A]/15 text-[#FAFDF4] backdrop-blur-md shadow-md shadow-[#0B0B0B]/20 transition-all duration-200 hover:bg-[#FAF7C6]/55 hover:border-[#D6E5C8]/45 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0B0B0B]/30 active:translate-y-0 active:shadow-md focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0B]/30"
  >
    <a
      href="#AboutUsPage"
      className="inline-flex items-center gap-2"
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        document.getElementById("AboutUsPage")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }}
    >
      Conocer más <ChevronRight className="h-4 w-4" />
    </a>
  </Button>
</div>

                  <div className="mt-6 flex items-center gap-3 text-xs text-[#FAFDF4]/70 animate-in fade-in slide-in-from-left-4 duration-700 delay-500">
                    <span className="h-px w-10 bg-[#FAFDF4]/35" />
                    <span>Al servicio de la comunidad</span>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      ) : null}
    </PageState>
  )
}
