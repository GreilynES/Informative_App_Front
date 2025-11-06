import { useState } from "react"
import { Calendar, X } from "lucide-react"
import { formatDateToWords } from "../../../shared/utils/formatDate"

export function EventCard({ event }: any) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
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
          <div className="p-8 lg:p-12 flex flex-col justify-between">
            <div className="flex flex-col items-start gap-3 text-[#6F8C1F] mb-4">
              <div className="flex  items-start gap-3 text-[#6F8C1F] ">
                <Calendar className="h-6 w-6" />
                <p className="font-bold text-lg">{formatDateToWords(event.date)}</p>
              </div>
           

              <h3 className="text-3xl font-bold text-[#2E321B] mb-4 leading-tight">
                {event.title}
              </h3>
          </div>
            {/* Botón para abrir modal */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 w-fit ml-auto"
            >
              Ver detalles del evento
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header del modal */}
            <div className="relative h-64 bg-gradient-to-br from-[#F2F7D8] to-[#DDE9BB]">
              <img
                src={event.illustration || "/placeholder.svg"}
                alt={event.title}
                className="object-cover w-full h-full opacity-70"
              />
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              >
                <X className="h-6 w-6 text-[#2E321B]" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-8">
              <div className="flex items-center gap-3 text-[#6F8C1F] mb-4">
                <Calendar className="h-6 w-6" />
                <p className="font-bold text-lg">{formatDateToWords(event.date)}</p>
              </div>

              <div className="prose max-w-none">
                <p className="text-[#2E321B] text-lg leading-relaxed mb-6 break-words whitespace-normal">
                  {event.description}
                </p>
              </div>

              {/* Botón de cerrar */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}