import { useState } from "react"
import { motion } from "framer-motion"
import { useServicesCarousel } from "../hooks/useServicesCarousel"
import { ServicesCard } from "../components/Services/serviceCard"
import { ServicesModal } from "../components/Services/serviceModal"
import { initialStateService, type Service } from "../models/ServicesType"

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Service>(initialStateService)

  const {
    isTransitioning,
    goToPrev,
    goToNext,
    getVisibleServices,
    getRealSlideIndex,
    setCurrentSlide,
    originalLength,
  } = useServicesCarousel(3)

  const openModal = (title: string, modalDescription: string, image: string) => {
    setModalContent({
      title,
      cardDescription: "",
      modalDescription,
      image,
    })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-[#F5F7EC] text-[#2E321B] py-20">
      <div className="container mx-auto px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2E321B] mb-6">Nuestros Servicios</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] mx-auto mb-4" />
          <p className="text-xl text-[#475C1D] max-w-2xl mx-auto">
            Navega entre nuestros servicios y encuentra el perfecto para ti
          </p>
        </div>
        <div className="relative">
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-lg hover:scale-105 transition z-10 flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-[#2E321B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getVisibleServices().map((service, index) => (
              <ServicesCard key={index} service={service} openModal={openModal} />
            ))}
          </div>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="absolute right-[-1.5rem] top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-lg hover:scale-105 transition z-10 flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-[#2E321B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* PUNTOS DE NAVEGACIÓN ANIMADOS */}
        <motion.div
          className="flex justify-center gap-3 mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.001 }}
        >
          {Array.from({ length: originalLength }).map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => !isTransitioning && setCurrentSlide(originalLength + idx)}
              className={`h-3 rounded-full transition-all duration-300 ${
                idx === getRealSlideIndex()
                  ? "bg-gradient-to-r from-[#BFD76F] to-[#6F8C1F] w-8"
                  : "bg-gray-300 hover:bg-gray-400 w-3"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: idx === getRealSlideIndex() ? [1, 1.1, 1] : 1,
              }}
              transition={{
                scale: idx === getRealSlideIndex() ? { duration: 0.3 } : { duration: 0.2 },
              }}
            />
          ))}
        </motion.div>
      </div>

      {isModalOpen && <ServicesModal content={modalContent} onClose={closeModal} />}
    </div>
  )
}
