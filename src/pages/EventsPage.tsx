import { useState } from "react"
import { events } from "../models/EventType"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { button } from "motion/react-client"

export default function EventsPage() {
  const [currentEvent, setCurrentEvent] = useState(0)

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev - 1 + events.length) % events.length)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Navega entre nuestros eventos y encuentra el perfecto para ti</p>
        </div>

        {/* Event Card */}
        <div className="max-w-6xl mx-auto">
          
          <div className="overflow-hidden shadow-lg border-0 bg-white relative rounded-lg">
           
            <div className="grid lg:grid-cols-2 gap-0">
               
                
              {/* Event Image */}
              <div className="relative h-80 lg:h-96 bg-gradient-to-br from-green-100 to-emerald-200">
                <img
                  src={events[currentEvent].illustration || "/placeholder.svg"}
                  alt={events[currentEvent].title}
                  width={384}
                  height={256}
                  className="object-cover w-full h-full opacity-60"
                />
                 <button
                  onClick={prevEvent}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md hover:shadow-lg"
                  aria-label="Evento anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>

              {/* Event Details */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                {/* Date */}
                <div className="flex items-center gap-3 text-green-600 mb-6">
                  <Calendar className="h-6 w-6" />
                  <div>
                    <p className="font-bold text-lg">{events[currentEvent].date}</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{events[currentEvent].title}</h3>

                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed mb-8">{events[currentEvent].description}</p>
              </div>
            </div>
              <button
                  onClick={nextEvent}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md hover:shadow-lg"
                  aria-label="Siguiente evento"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
          </div>
          

          {/* Event Indicators */}
          <div className="flex justify-center mt-8 gap-3">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentEvent(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentEvent
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 w-8"
                    : "bg-gray-300 hover:bg-gray-400 w-3"
                }`}
                aria-label={`Ir al evento ${index + 1}`}
              />
            ))}
          </div>
          
        </div>
      </div>
    </div>
  )
}
