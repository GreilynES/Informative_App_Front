import { useState } from "react"
import { events } from "../models/EventType"
import { AnimatedEventWrapper } from "../animations/EventChange"

export default function EventsPage() {
  const [currentEvent, setCurrentEvent] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextEvent = () => {
    setDirection(1)
    setCurrentEvent((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setDirection(-1)
    setCurrentEvent((prev) => (prev - 1 + events.length) % events.length)
  }

  const goToEvent = (index: number) => {
    setDirection(index > currentEvent ? 1 : -1)
    setCurrentEvent(index)
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
            event={events[currentEvent]}
            onPrev={prevEvent}
            onNext={nextEvent}
            currentIndex={currentEvent}
            total={events.length}
            setCurrentIndex={goToEvent}
            direction={direction}
          />
        </div>
      </div>
    </div>
  )
}
