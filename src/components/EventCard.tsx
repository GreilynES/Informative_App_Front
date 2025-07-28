import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

export function EventCard({ event, onPrev, onNext }: any) {
  return (
    <div className="overflow-hidden shadow-xl border border-[#DDE9BB] bg-white/90 relative rounded-xl">
      <div className="grid lg:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-80 lg:h-96 bg-gradient-to-br from-[#F2F7D8] to-[#DDE9BB]">
          <img
            src={event.illustration || "/placeholder.svg"}
            alt={event.title}
            className="object-cover w-full h-full opacity-60"
          />
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-[#6F8C1F] mb-6">
            <Calendar className="h-6 w-6" />
            <p className="font-bold text-lg">{event.date}</p>
          </div>

          <h3 className="text-3xl font-bold text-[#2E321B] mb-6 leading-tight">{event.title}</h3>

          <p className="text-[#475C1D] text-base leading-relaxed mb-8">{event.description}</p>
        </div>
      </div>
    </div>
  )
}
