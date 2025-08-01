import { useState } from "react"
import { initialStateService, type Service } from "../models/ServicesType"
import { useServicesCarousel } from "../hooks/useServicesCarousel"
import ServicesCarouselButton from "../components/Services/serviceCarouselButton"
import { ServicesCard } from "../components/Services/serviceCard"
import ServicesCarouselIndicator from "../components/Services/serviceCarouselIndicator"
import { ServicesModal } from "../components/Services/serviceModal"

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
    setModalContent({ title, cardDescription: "", modalDescription, image })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-[#F5F7EC] text-[#2E321B] py-20">
      <div className="container mx-auto px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E321B] text-center mb-6">
          Nuestros Servicios
        </h1>
        <p className="text-center text-lg text-[#475C1D] mb-12 max-w-3xl mx-auto">
          Desde capacitación técnica hasta innovación rural: apoyamos a nuestros asociados en cada paso.
        </p>

        <div className="relative">
          <ServicesCarouselButton direction="left" onClick={goToPrev} disabled={isTransitioning} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {getVisibleServices().map((service, index) => (
              <ServicesCard key={index} service={service} openModal={openModal} />
            ))}
          </div>

          <ServicesCarouselButton direction="right" onClick={goToNext} disabled={isTransitioning} />
        </div>

        <ServicesCarouselIndicator
          count={originalLength}
          current={getRealSlideIndex()}
          isTransitioning={isTransitioning}
          onClick={(i: number) => setCurrentSlide(originalLength + i)}
        />
      </div>

      {isModalOpen && <ServicesModal content={modalContent} onClose={closeModal} />}
    </div>
  )
}
