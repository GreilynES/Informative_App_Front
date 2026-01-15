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
    scale: 1.4,
    rotateY: 0,
    zIndex: 10,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      opacity: { duration: 0.3 },
    },
  },
  left: {
    x: "-70%",
    scale: 0.7,
    opacity: 0.3,
    rotateY: 20,
    zIndex: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  right: {
    x: "70%",
    scale: 0.7,
    opacity: 0.3,
    rotateY: -20,
    zIndex: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.75,
    rotateY: direction < 0 ? 25 : -25,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

const ANIM_MS = 600
const AUTO_MS = 15000

export default function EventsPage() {
  const { events, isLoading } = useEventsSubastaFirst()

  const [rtEvents, setRtEvents] = useState<EventData[]>([])
  const seeded = useRef(false)

  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const isModalOpenRef = useRef(false)
  useEffect(() => {
    isModalOpenRef.current = isModalOpen
  }, [isModalOpen])

  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    animTimerRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, ANIM_MS)
  }, [])

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current)
      autoTimerRef.current = null
    }
  }, [])

  const scheduleAuto = useCallback(() => {
    stopAuto()

    if (!hasEvents || total <= 1) return
    if (isModalOpenRef.current) return

    autoTimerRef.current = setTimeout(() => {
      if (!isModalOpenRef.current && !isAnimatingRef.current) {
        setDirection(1)
        lockAnimation()
        setPage((p) => p + 1)
      }
      scheduleAuto()
    }, AUTO_MS)
  }, [hasEvents, total, lockAnimation, stopAuto])

  const paginate = useCallback(
    (dir: -1 | 1) => {
      if (!hasEvents || isAnimatingRef.current) return
      
      stopAuto()
      
      setDirection(dir)
      lockAnimation()
      setPage((p) => p + dir)

      setTimeout(() => {
        if (!isModalOpenRef.current) {
          scheduleAuto()
        }
      }, ANIM_MS + 100)
    },
    [hasEvents, lockAnimation, stopAuto, scheduleAuto]
  )

  const goPrev = () => paginate(-1)
  const goNext = () => paginate(1)

  useEffect(() => {
    if (!hasEvents || total <= 1) {
      stopAuto()
      return
    }

    if (isModalOpen) {
      stopAuto()
      return
    }

    scheduleAuto()

    return () => stopAuto()
  }, [hasEvents, total, isModalOpen, scheduleAuto, stopAuto])

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current)
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
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
    <div className="min-h-screen justify-center text-[#1F3D2B] bg-gradient-to-b from-[#F5F7EC] via-[#DCECB8] to-[#9BAF6A]/90">
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-24 py-8 sm:py-10 md:py-12">
          <div className="mx-auto max-w-3xl text-center mb-6 sm:mb-8 md:mb-12 lg:mb-2">
            {/* CHIP */}
            <div className="mx-auto inline-flex items-center rounded-full border border-[#A7C4A0] bg-white/70 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#1F3D2B] backdrop-blur-sm shadow-lg">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8FAE5A] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F5F0B]"></span>
              </span>
              <span>Eventos presenciales</span>
            </div>

            {/* TITLE */}
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight px-4">
              <span className="text-[#1F3D2B] drop-shadow-[0_1px_0_rgba(250,253,244,0.9)]">
                Próximos eventos
              </span>
            </h2>
          </div>

          <div className="relative">
            {/* Flechas MOBILE - Posicionadas absolutamente */}
            <div className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30">
              <Button
                type="button"
                variant="ghost"
                onClick={goPrev}
                disabled={!hasEvents}
                className="
                  h-10 w-10 rounded-full p-0
                  border-2 border-[#A7C4A0] bg-white/70 text-[#1F3D2B]
                  hover:bg-[#D6E5C8] hover:border-[#8FAE5A]
                  disabled:opacity-30 disabled:cursor-not-allowed
                  backdrop-blur-md shadow-xl
                  transition-all duration-300 hover:scale-110
                "
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30">
              <Button
                type="button"
                variant="ghost"
                onClick={goNext}
                disabled={!hasEvents}
                className="
                  h-10 w-10 rounded-full p-0
                  border-2 border-[#A7C4A0] bg-white/70 text-[#1F3D2B]
                  hover:bg-[#D6E5C8] hover:border-[#8FAE5A]
                  disabled:opacity-30 disabled:cursor-not-allowed
                  backdrop-blur-md shadow-xl
                  transition-all duration-300 hover:scale-110
                "
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Contenedor del carrusel */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-6xl lg:px-24">
                <div className="relative h-[480px] sm:h-[500px] md:h-[520px] lg:h-[580px] flex items-center justify-center">
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
                      <div className="brightness-90 saturate-90 transition-all duration-300">
                        <EventCard event={left} />
                      </div>
                    </motion.div>

                    {/* CENTER CARD */}
                    <motion.div
                      key={`center-${page}`}
                      className="
                        absolute
                        w-[92%] sm:w-[85%] md:w-[75%] lg:w-[72%]
                        mx-auto
                      "
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      custom={direction}
                      style={{ transformOrigin: "center center" }}
                    >
                      <EventCard
                        event={current}
                        onModalChange={(open: boolean) => setIsModalOpen(open)}
                      />
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
                      <div className="brightness-90 saturate-90 transition-all duration-300">
                        <EventCard event={right} />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* dots */}
                <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-0 flex justify-center gap-1.5">
                  {rtEvents.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (isAnimatingRef.current) return
                        
                        stopAuto()
                        
                        const dir = i > index ? 1 : -1
                        setDirection(dir)
                        lockAnimation()
                        setPage((p) => p - mod(p, total) + i)

                        setTimeout(() => {
                          if (!isModalOpenRef.current) {
                            scheduleAuto()
                          }
                        }, ANIM_MS + 100)
                      }}
                      className={[
                        "rounded-full transition-all duration-300",
                        i === index
                          ? "h-2.5 w-10 bg-gradient-to-r from-[#2F5F0B] to-[#6D8B37] shadow-lg shadow-[#8FAE5A]/30"
                          : "h-2.5 w-2.5 bg-[#1F3D2B]/18 hover:bg-[#1F3D2B]/28 hover:w-6",
                      ].join(" ")}
                      aria-label={`Ir al evento ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* DESKTOP flechas */}
            <Button
              type="button"
              variant="ghost"
              onClick={goPrev}
              disabled={!hasEvents}
              className="
                hidden lg:flex
                absolute left-0 top-1/2 -translate-y-1/2 z-30
                -translate-x-24
                h-12 w-12 rounded-full p-0
                border-2 border-[#A7C4A0] bg-white/70 text-[#1F3D2B]
                hover:bg-[#D6E5C8] hover:border-[#8FAE5A]
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
                translate-x-24
                h-12 w-12 rounded-full p-0
                border-2 border-[#A7C4A0] bg-white/70 text-[#1F3D2B]
                hover:bg-[#D6E5C8] hover:border-[#8FAE5A]
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