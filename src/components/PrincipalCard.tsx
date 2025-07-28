// components/EventCard.tsx
import { Calendar } from "lucide-react"
import type { PrincipalType } from "../models/PrincipalType"

export function PrincipalCard({ event }: { event: PrincipalType }) {
  return (
    <div className="relative">
      {/* Pin decorativo */}
      <div className="absolute -top-4 left-2 z-30">
        <div className="relative">
          <div className="w-4 h-8 bg-gradient-to-br from-[#475C1D] to-[#6F8C1F] rounded-full shadow-lg relative">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-[#475C1D] to-[#6F8C1F] rounded-full shadow-md border border-[#6F8C1F]">
              <div className="absolute top-1 left-1 w-2 h-2 bg-[#F5F7EC] rounded-full opacity-70"></div>
            </div>
            <div className="absolute z-0 -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-[#99997f] rounded-b-full"></div>
          </div>
        </div>
      </div>

      {/* Tarjeta */}
      <div
        className="w-[430px] h-[360px] bg-white shadow-2xl transform rounded-lg rotate-3 hover:rotate-0 transition-transform duration-500 ease-in-out relative"
        style={{ transformOrigin: "top left" }}
      >
        <div className="p-4">
          <img
            src={
              event.illustration ||
              "/placeholder.svg?height=180&width=350&query=cattle auction event"
            }
            alt="Subasta de ganado"
            className="w-full h-60 object-cover rounded-lg"
          />
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center space-x-2 text-[#6F8C1F] text-base font-medium mb-2">
            <Calendar className="w-5 h-5" />
            <span>{event.date}</span>
          </div>
          <h3 className="text-base font-bold text-[#2E321B] mb-1">{event.title}</h3>
          <p className="text-xs text-[#475C1D]">{event.description}</p>
        </div>
      </div>
    </div>
  )
}
