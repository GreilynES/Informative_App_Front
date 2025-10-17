import { useState, useEffect, useRef } from "react"
import { AnimatedEventWrapper } from "../../shared/animations/EventChange"
import type { EventData } from "./models/EventType"
import { useEventsSubastaFirst } from "./hooks/useEvents" // ← IMPORTANTE: Este import

export default function EventsPage() {
  // ✅ Ahora useEventsSubastaFirst usa TanStack Query
  const { events, isLoading } = useEventsSubastaFirst()

  const [rtEvents, setRtEvents] = useState<EventData[]>([])
  const [currentEvent, setCurrentEvent] = useState(0)
  const [direction, setDirection] = useState(0)
  const seeded = useRef(false)

  // Seed inicial (mantiene subasta al frente)
  useEffect(() => {
    if (!seeded.current && events.length > 0) {
      setRtEvents(events)
      setCurrentEvent(0)
      seeded.current = true
    } else if (seeded.current) {
      setRtEvents(events)
      setCurrentEvent((idx) => Math.min(idx, events.length - 1))
    }
  }, [events])

  const nextEvent = () => {
    if (rtEvents.length === 0) return
    setDirection(1)
    setCurrentEvent((prev) => (prev + 1) % rtEvents.length)
  }

  const prevEvent = () => {
    if (rtEvents.length === 0) return
    setDirection(-1)
    setCurrentEvent((prev) => (prev - 1 + rtEvents.length) % rtEvents.length)
  }

  const goToEvent = (index: number) => {
    if (rtEvents.length === 0) return
    setDirection(index > currentEvent ? 1 : -1)
    setCurrentEvent(index)
  }

  if (isLoading || rtEvents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-[#2E321B]">
        Cargando eventos...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFDF4] px-12 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E321B] mb-6">Próximos Eventos</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] mx-auto mb-4" />
          <p className="text-xl text-[#475C1D] max-w-2xl mx-auto">
            Navega entre nuestros eventos y encuentra el perfecto para ti
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatedEventWrapper
            event={rtEvents[currentEvent]}
            onPrev={prevEvent}
            onNext={nextEvent}
            currentIndex={currentEvent}
            total={rtEvents.length}
            setCurrentIndex={goToEvent}
            direction={direction}
          />
        </div>
      </div>
    </div>
  )
}