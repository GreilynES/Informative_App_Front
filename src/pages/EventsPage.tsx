import { useState } from "react"
import { events } from "../models/EventType"

export default function EventsPage() {
  const [currentEvent, setCurrentEvent] = useState(0)

  const nextEvent = () => {
    setCurrentEvent((prev) => (prev + 1) % events.length)
  }

  const prevEvent = () => {
    setCurrentEvent((prev) => (prev - 1 + events.length) % events.length)
  }

  return (
    <div className="min-h-screen bg-white-600 flex items-center justify-center">

      {/* Main Event Card */}
      <div className="max-w-5xl w-full p-0 rounded-2xl " >
        <div className="bg-white border border-gray-300 rounded-2xl relative">
          {/* Event Content */}
          <div className="p-8 shadow-lg">
            {/* Header */}
            <div className="text-center mb-8 border-b border-gray-200 pb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {events[currentEvent].title} 
              </h1>
              <h3>
                {events[currentEvent].date}
              </h3>
              <p className="text-gray-600 text-sm">{events[currentEvent].description}</p>
            </div>

            {/* Illustration Area */}
            <div className="flex justify-center items-center mb-8">
              {/* Simple cow illustration using CSS */}
              <div className="relative flex justify-center rounded-2xl items-center bg-gray-200 object-cover h-74 w-220 overflow-hidden">
                <img
                    src={events[currentEvent].illustration || "/placeholder.svg"} // Now uses the image path
                    alt={events[currentEvent].title}
                    width={384} // Adjusted width for the smaller card
                    height={256} // Adjusted height for the smaller card
                    className="object-cover w-full h-full"
                  />
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevEvent}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-2xl font-bold"
            aria-label="Evento anterior"
          >
            {"<"}
          </button>

          <button
            onClick={nextEvent}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors text-2xl font-bold"
            aria-label="Siguiente evento"
          >
            {">"}
          </button>
        </div>

        {/* Event Indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentEvent(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentEvent ? "bg-gray-800 w-6" : "bg-gray-300"
              }`}
              aria-label={`Ir al evento ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
