import { useState } from "react"
import { initialStateService, type Service } from "./models/ServicesType"
import { useServices } from "./hooks/useServices"
import { ServicesCard } from "./components/serviceCard"
import { ServicesModal } from "./components/serviceModal"

export default function ServicesPage() {
  const { services, isLoading, error } = useServices()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<Service>(initialStateService)

  const openModal = (
    id: number,
    title: string,
    modalDescription: string,
    image: string,
    cardDescription: string
  ) => {
    setModalContent({ id, title, modalDescription, image, cardDescription })
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <section className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 md:px-20">
        <div className="text-center space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Te ofrecemos</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-[#2E321B] text-center mb-4">
          Nuestros servicios
        </h1>
        </div>

        <p className="text-center text-base md:text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
        
        </p>

        {/* Estados */}
        {isLoading && (
          <p className="text-center text-gray-500">Cargando servicios…</p>
        )}

        {error && (
          <p className="text-center text-red-500">
            Error al cargar los servicios.
          </p>
        )}

        {!isLoading && !error && services.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServicesCard
                  key={service.id}
                  service={service}
                  openModal={openModal}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ServicesModal content={modalContent} onClose={closeModal} />
      )}
    </section>
  )
}
