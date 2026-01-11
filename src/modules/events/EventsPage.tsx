import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

import type { EventData } from "./models/EventType"
import { useEventsSubastaFirst } from "./hooks/useEvents"
import { EventCard } from "./components/EventCard"
import { Button } from "@/components/ui/button"

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.75,
    rotateY: direction > 0 ? 25 : -25,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1.2,
    rotateY: 0,
    zIndex: 10,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1] as const,
      opacity: { duration: 0.4 },
    },
  },
  left: {
    x: "-70%",
    scale: 0.7,
    opacity: 0.3,
    rotateY: 20,
    zIndex: 0,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
  right: {
    x: "70%",
    scale: 0.7,
    opacity: 0.3,
    rotateY: -20,
    zIndex: 0,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.75,
    rotateY: direction < 0 ? 25 : -25,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  }),
}

const ANIM_MS = 800

export default function EventsPage() {
  const { events, isLoading } = useEventsSubastaFirst()

  const [rtEvents, setRtEvents] = useState<EventData[]>([])
  const seeded = useRef(false)

  // ✅ page es “infinito”: 0,1,2,3... o negativo
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const animTimerRef = useRef<number | null>(null)
  const autoTimerRef = useRef<number | null>(null)

  // Mantén flags frescos para auto-advance sin re-render loops
  const isAnimatingRef = useRef(false)
  useEffect(() => {
    isAnimatingRef.current = isAnimating
  }, [isAnimating])

  useEffect(() => {
    if (!seeded.current && events.length > 0) {
      setRtEvents(events)
      setPage(0)
      seeded.current = true
      return
    }
    if (seeded.current) {
      setRtEvents(events)
      // NOTA: no reseteamos page a 0 porque eso sí “resetea”
      // Solo aseguramos que si se queda sin items, no explote
      if (events.length === 0) setPage(0)
    }
  }, [events])

  const total = rtEvents.length
  const hasEvents = total > 0

  const index = useMemo(() => (hasEvents ? mod(page, total) : 0), [page, total, hasEvents])
  const prevIndex = useMemo(() => (hasEvents ? mod(index - 1, total) : 0), [index, total, hasEvents])
  const nextIndex = useMemo(() => (hasEvents ? mod(index + 1, total) : 0), [index, total, hasEvents])

  const lockAnimation = useCallback(() => {
    setIsAnimating(true)
    if (animTimerRef.current) window.clearTimeout(animTimerRef.current)
    animTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false)
    }, ANIM_MS)
  }, [])

  const paginate = useCallback(
    (dir: -1 | 1) => {
      if (!hasEvents || isAnimatingRef.current) return
      setDirection(dir)
      lockAnimation()
      setPage((p) => p + dir)
    },
    [hasEvents, lockAnimation]
  )

  const goPrev = () => paginate(-1)
  const goNext = () => paginate(1)

  // ✅ Auto-advance estable (sin depender de index/page y sin reinicios raros)
  useEffect(() => {
    if (!hasEvents || total <= 1) return

    const schedule = () => {
      autoTimerRef.current = window.setTimeout(() => {
        if (!isAnimatingRef.current) {
          setDirection(1)
          lockAnimation()
          setPage((p) => p + 1)
        }
        schedule()
      }, 10000)
    }

    schedule()

    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current)
    }
  }, [hasEvents, total, lockAnimation])

  useEffect(() => {
    return () => {
      if (animTimerRef.current) window.clearTimeout(animTimerRef.current)
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1208] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#BFD76F] border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-white/80">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  if (!hasEvents) {
    return (
      <div className="min-h-screen bg-[#0B1208] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-xl font-medium text-white/80">No hay eventos disponibles.</p>
        </div>
      </div>
    )
  }

  const current = rtEvents[index]
  const left = rtEvents[prevIndex]
  const right = rtEvents[nextIndex]

  return (
    <div className="min-h-screen text-white justify-center">
      <div className="relative min-h-screen overflow-hidden bg-[#FFFCE6]">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1F3D2B] via-[#162D20] to-[#0F1E14]" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_32%,rgba(191,215,111,0.14),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(1200px_680px_at_50%_40%,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-10 md:py-12">
          <div className="mx-auto max-w-3xl text-center mb-8 sm:mb-10 md:mb-12 lg:mb-0">
            <div className="mx-auto inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm shadow-lg">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BFD76F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BFD76F]"></span>
              </span>
              Eventos en vivo
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight sm:leading-tight md:leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Próximos eventos
              </span>
            </h2>
          </div>

          <div className="relative">
  {/* MOBILE/TABLET: flecha | card | flecha */}
  <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 sm:gap-3 lg:block">
    {/* Flecha izquierda (MOBILE) */}
    <div className="flex justify-center lg:hidden">
      <Button
        type="button"
        variant="ghost"
        onClick={goPrev}
        disabled={!hasEvents}
        className="
          h-10 w-10 rounded-full p-0
          border-2 border-white/20 bg-white/10 text-white
          hover:bg-white/20 hover:border-white/30
          disabled:opacity-30 disabled:cursor-not-allowed
          backdrop-blur-md shadow-xl
          transition-all duration-300 hover:scale-110
        "
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
    </div>

    {/* Contenedor del carrusel */}
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-6xl">
        <div className="relative h-[520px] sm:h-[540px] md:h-[560px] lg:h-[580px] flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="sync">
            {/* LEFT CARD */}
            <motion.div
              key={`left-${page - 1}`}
              className="absolute hidden md:block w-[75%] md:w-[65%] lg:w-[60%] pointer-events-none"
              variants={cardVariants}
              initial="enter"
              animate="left"
              exit="exit"
              custom={direction}
              style={{ transformOrigin: "center center" }}
            >
              <div className="opacity-50 brightness-75 transition-all duration-300">
                <EventCard event={left} />
              </div>
            </motion.div>

            {/* CENTER CARD (✅ ahora más pequeño en mobile) */}
            <motion.div
              key={`center-${page}`}
              className="
                absolute
                w-[88%] sm:w-[80%] md:w-[75%] lg:w-[72%]
                mx-auto
              "
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              style={{ transformOrigin: "center center" }}
            >
              <EventCard event={current} />
            </motion.div>

            {/* RIGHT CARD */}
            <motion.div
              key={`right-${page + 1}`}
              className="absolute hidden md:block w-[75%] md:w-[65%] lg:w-[60%] pointer-events-none"
              variants={cardVariants}
              initial="enter"
              animate="right"
              exit="exit"
              custom={direction}
              style={{ transformOrigin: "center center" }}
            >
              <div className="opacity-50 brightness-75 transition-all duration-300">
                <EventCard event={right} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* dots */}
        <div className="mt-6 sm:mt-16 md:mt-16 lg:mt-0 flex justify-center gap-1.5">
          {rtEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (isAnimatingRef.current) return
                const dir = i > index ? 1 : -1
                setDirection(dir)
                lockAnimation()
                setPage((p) => p - mod(p, total) + i)
              }}
              className={[
                "rounded-full transition-all duration-300",
                i === index
                  ? "h-2.5 w-10 bg-gradient-to-r from-[#ffffff] to-[#b7bea4] shadow-lg shadow-[#BFD76F]/50"
                  : "h-2.5 w-2.5 bg-white/30 hover:bg-white/50 hover:w-6",
              ].join(" ")}
              aria-label={`Ir al evento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Flecha derecha (MOBILE) */}
    <div className="flex justify-center lg:hidden">
      <Button
        type="button"
        variant="ghost"
        onClick={goNext}
        disabled={!hasEvents}
        className="
          h-10 w-10 rounded-full p-0
          border-2 border-white/20 bg-white/10 text-white
          hover:bg-white/20 hover:border-white/30
          disabled:opacity-30 disabled:cursor-not-allowed
          backdrop-blur-md shadow-xl
          transition-all duration-300 hover:scale-110
        "
        aria-label="Siguiente"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  </div>

  {/* DESKTOP: si quieres mantener tus flechas flotantes como antes */}
  <Button
    type="button"
    variant="ghost"
    onClick={goPrev}
    disabled={!hasEvents}
    className="
      hidden lg:flex
      absolute left-0 top-1/2 -translate-y-1/2 z-30
      -translate-x-12
      h-12 w-12 rounded-full p-0
      border-2 border-white/20 bg-white/10 text-white
      hover:bg-white/20 hover:border-white/30
      disabled:opacity-30 disabled:cursor-not-allowed
      backdrop-blur-md shadow-xl
      transition-all duration-300 hover:scale-110
    "
    aria-label="Anterior"
  >
    <ChevronLeft className="h-6 w-6" />
  </Button>

  <Button
    type="button"
    variant="ghost"
    onClick={goNext}
    disabled={!hasEvents}
    className="
      hidden lg:flex
      absolute right-0 top-1/2 -translate-y-1/2 z-30
      translate-x-12
      h-12 w-12 rounded-full p-0
      border-2 border-white/20 bg-white/10 text-white
      hover:bg-white/20 hover:border-white/30
      disabled:opacity-30 disabled:cursor-not-allowed
      backdrop-blur-md shadow-xl
      transition-all duration-300 hover:scale-110
    "
    aria-label="Siguiente"
  >
    <ChevronRight className="h-6 w-6" />
  </Button>
</div>

        </div>
      </div>
    </div>
  )
}
