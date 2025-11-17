import { CalendarDays, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import type { EventData } from "../../events/models/EventType"
import { RippleButton } from "../../../shared/animations/Buttons"
import { formatDateToWords } from "../../../shared/utils/formatDate"

export function PrincipalCard({ event }: { event: EventData }) {
  if (!event) {
    return null
  }

  const handleScrollToEvents = (e: React.MouseEvent) => {
    e.preventDefault()
    const eventsSection = document.getElementById('EventsPage')
    if (eventsSection) {
      eventsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
      })
    }
  }

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
      {/* Tarjeta - Animaciones de Framer Motion con balanceo inicial más sutil */}
      <motion.div
        className="w-[430px] bg-white shadow-2xl rounded-lg relative flex flex-col group"
        style={{ transformOrigin: "4px 0px" }}
        initial={{ rotate: -30 }}
        animate={{ rotate: 5 }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 8,
          mass: 1,
        }}
        whileHover={{ rotate: 8 }}
      >
        {/* Sección del título con etiqueta en columna */}
        <div className="p-4 pb-2">
          <div className="flex flex-col items-start">
            {/* Etiqueta "Destacado" */}
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full mb-1">
              Destacado
            </span>
            {/* Título del evento */}
            <h3 className="text-lg font-bold text-[#2E321B] w-full break-words">{event.title}</h3>
          </div>
        </div>

        {/* Contenedor de la imagen y la fecha superpuesta */}
        <div className="relative px-4 pb-4 overflow-hidden rounded-b-lg">
          <img
            src={event.illustration || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-60 object-cover rounded-lg transition-transform duration-300"
          />
          {/* Fecha del evento sobre la foto - POSICIONADO EN LA PARTE INFERIOR */}
          <div className="absolute bottom-6 left-6 text-white px-3 py-1 rounded-md flex items-center space-x-2">
            <CalendarDays className="w-5 h-5" />
            <span className="text-2xl font-extrabold">
              {formatDateToWords(event.date, {
                locale: "es-CR",
                capitalize: true,
                commaBeforeYear: false,
              })}
            </span>
          </div>
        </div>

        {/* Sección "Saber más" como botón */}
        <div className="px-4 pb-4 pt-2 flex justify-end">
          <button onClick={handleScrollToEvents}>
            <RippleButton
              size="sm"
              className="bg-[#6F8C1F] text-white hover:bg-[#475C1D] transition-colors duration-200"
            >
              <span>Saber más</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </RippleButton>
          </button>
        </div>
      </motion.div>
    </div>
  )
}