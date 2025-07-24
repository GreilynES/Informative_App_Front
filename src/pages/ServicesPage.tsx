import React, { useState } from "react";
import { services, type ModalContent } from "../models/Services";




export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    description: "",
  });

  const openModal = (title: string, description: string) => {
    setModalContent({ title, description });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);


  return (
    <div className="min-h-screen px-6 py-16 bg-gradient-to-br from-[#e7fef4] to-[#d9f4fa]">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-14 tracking-tight">
        Nuestros Servicios
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            {/* Imagen */}
            <div className="h-64 w-full overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Título */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
                {service.title}
              </h3>

              {/* Botón */}
              <button
                onClick={() => openModal(service.title, service.description)}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 w-full shadow-md flex items-center justify-center gap-2"
              >
                Ver Más
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl p-8 max-w-xl w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              {modalContent.title}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {modalContent.description}
            </p>
            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
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