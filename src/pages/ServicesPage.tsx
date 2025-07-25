import React, { useState } from "react";
import { services, type ModalContent } from "../models/Services";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    description: "",
    image: ""
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(services.length / cardsPerSlide);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const openModal = (title: string, description: string, image: string) => {
    setModalContent({ title, description, image });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen px-6 py-20 bg-[#f9f9f6] text-gray-800">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 text-center mb-4">
          Nuestros Servicios
        </h1>
        <p className="text-center text-lg text-neutral-600 mb-12">
          Desde capacitación técnica hasta innovación rural: apoyamos a nuestros asociados en cada paso.
        </p>

        <div className="relative">
          {/* Botón izquierdo */}
          <button
            onClick={goToPrev}
            className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-lg hover:scale-105 transition z-10 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services
              .slice(currentSlide * cardsPerSlide, currentSlide * cardsPerSlide + cardsPerSlide)
              .map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white border-t-4 border-[#d8b769] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col min-h-[320px] max-h-[320px] px-6 py-8"
                >
                  <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 flex-grow">
                    {service.cardDescription}
                  </p>
                  <button
                    onClick={() =>
                      openModal(service.title, service.modalDescription, service.image)
                    }
                    className="text-[#007f5f] font-medium text-sm hover:underline flex items-center gap-1 mt-auto"
                  >
                    Más información
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </div>

          {/* Botón derecho */}
          <button
            onClick={goToNext}
            className="absolute right-[-1.5rem] top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full shadow-lg hover:scale-105 transition z-10 flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-10 space-x-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentSlide ? "bg-[#007f5f]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl p-8 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalContent.image}
              alt={modalContent.title}
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h3 className="text-2xl font-bold mb-4 text-neutral-900">
              {modalContent.title}
            </h3>
            <p className="text-neutral-700 mb-6 leading-relaxed whitespace-pre-line">
              {modalContent.description}
            </p>
            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-[#e7c78d] to-[#d8b769] text-neutral-900 font-semibold px-6 py-2 rounded-lg shadow hover:brightness-110 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
