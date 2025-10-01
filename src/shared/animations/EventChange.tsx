import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EventCard } from "../../modules/events/components/EventCard"

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

export function AnimatedEventWrapper({
  event,
  onPrev,
  onNext,
  currentIndex,
  total,
  setCurrentIndex,
  direction,
}: any) {
  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16">
      {/* Contenedor principal para las flechas y el card, ahora con max-width y centrado */}
      <div className="relative max-w-6xl mx-auto">
        {/* Flecha izquierda - FIJA y más a la izquierda */}
        <motion.button
          onClick={onPrev}
          className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md hover:shadow-lg hidden md:flex" // Ocultar en móviles pequeños
          whileHover={{ scale: 1.1, x: -2 }}
          // Eliminado whileTap para evitar el movimiento hacia abajo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>

        {/* Card con animaciones */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 40 },
                opacity: { duration: 0.15 },
              }}
            >
              <EventCard
                event={event}
                onPrev={onPrev}
                onNext={onNext}
                currentIndex={currentIndex}
                total={total}
                setCurrentIndex={setCurrentIndex}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Flecha derecha - FIJA y más a la derecha */}
        <motion.button
          onClick={onNext}
          className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-md hover:shadow-lg hidden md:flex" // Ocultar en móviles pequeños
          whileHover={{ scale: 1.1, x: 2 }}
          // Eliminado whileTap para evitar el movimiento hacia abajo
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>
      {/* Pagination Dots - Fuera del card */}
      <motion.div
        className="flex justify-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Array.from({ length: total }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] w-8"
                : "bg-gray-300 hover:bg-gray-400 w-3"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }} // Mantengo el whileTap para los puntos, ya que no causan desplazamiento visual
            animate={{
              scale: index === currentIndex ? [1, 1.1, 1] : 1,
            }}
            transition={{
              scale: index === currentIndex ? { duration: 0.3 } : { duration: 0.2 },
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
