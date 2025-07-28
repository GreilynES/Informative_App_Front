import { useState } from "react"
import { useServicesCarousel } from "../hooks/useServicesCarousel"
import { ServicesCard } from "../components/Services/serviceCard"
import { ServicesModal } from "../components/Services/serviceModal"


export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    image: "",
  })

  const {
    isTransitioning,
    goToPrev,
    goToNext,
    getVisibleServices,
    getRealSlideIndex,
    setCurrentSlide,
    originalLength,
  } = useServicesCarousel(3)

  const openModal = (title: string, description: string, image: string) => {
    setModalContent({ title, description, image })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-[#F5F7EC] text-[#2E321B] py-20">
      <div className="container mx-auto px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E321B] text-center mb-6">Nuestros Servicios</h1>
        <p className="text-center text-lg text-[#475C1D] mb-12">
          Desde capacitación técnica hasta innovación rural: apoyamos a nuestros asociados en cada paso.
        </p>

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
            {getVisibleServices().map((service) => (
              <ServicesCard key={service.key} service={service} openModal={openModal} />
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

        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: originalLength }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => !isTransitioning && setCurrentSlide(originalLength + idx)}
              className={`w-3 h-3 rounded-full ${idx === getRealSlideIndex() ? "bg-[#d8b769]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {isModalOpen && <ServicesModal content={modalContent} onClose={closeModal} />}
    </div>
  )
}
