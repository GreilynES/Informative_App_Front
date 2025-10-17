import { useState } from "react"
import { initialStateService, type Service } from "./models/ServicesType"
import { useServicesCarousel } from "./hooks/useServicesCarousel"
import ServicesCarouselButton from "./components/serviceCarouselButton"
import { ServicesCard } from "./components/serviceCard"
import ServicesCarouselIndicator from "./components/serviceCarouselIndicator"
import { ServicesModal } from "./components/serviceModal"


export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Service>(initialStateService)

  const {
    isTransitioning,
    goToPrev,
    goToNext,
    getRealSlideIndex,
    getTranslateX,
    setCurrentSlide,
    originalLength,
    cardsPerSlide,
    infiniteServices,
    getTotalSlides,
    getCardWidth, // Added new function from hook
  } = useServicesCarousel()

  const openModal = (id: number, title: string, modalDescription: string, image: string, cardDescription: string) => {
    setModalContent({ id, title, modalDescription, image, cardDescription })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const noData = originalLength === 0
  const showNavigation = originalLength > 3

  return (
    <div className="min-h-screen bg-[#F5F7EC] text-[#2E321B] py-20">
      <div className="container mx-auto px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E321B] text-center mb-6">Nuestros Servicios</h1>
        <p className="text-center text-lg text-[#475C1D] mb-12 max-w-3xl mx-auto">
          Desde capacitación técnica hasta innovación rural: apoyamos a nuestros asociados en cada paso.
        </p>

        <div className="relative max-w-6xl mx-auto">
          {showNavigation && (
            <ServicesCarouselButton direction="left" onClick={goToPrev} disabled={isTransitioning || noData} />
          )}

          <div className={`overflow-hidden ${showNavigation ? "mx-16" : "mx-0"}`}>
            <div
              className={`flex flex-nowrap gap-6 transition-transform duration-700 ease-in-out ${originalLength <= 3 ? "justify-center" : ""}`}
              style={{ transform: `translateX(${getTranslateX()}%)` }}
            >
              {infiniteServices.map((service: { id: any }, index: any) => (
                <div
                  key={`${service.id}-${index}`}
                  className="flex-none"
                  style={{ width: getCardWidth() }} // Use dynamic width
                >
                  <ServicesCard service={service} openModal={openModal} />
                </div>
              ))}
            </div>
          </div>

          {showNavigation && (
            <ServicesCarouselButton direction="right" onClick={goToNext} disabled={isTransitioning || noData} />
          )}
        </div>

        {!noData && showNavigation && (
          <ServicesCarouselIndicator
            count={getTotalSlides()}
            current={getRealSlideIndex()}
            isTransitioning={isTransitioning}
            onClick={(i: number) => setCurrentSlide(i + cardsPerSlide)}
          />
        )}
      </div>

      {isModalOpen && <ServicesModal content={modalContent} onClose={closeModal} />}
    </div>
  )
}