// src/modules/volunteersInformation/components/RequirementsSection.tsx

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface RequirementsSectionProps {
  requirements: string[];
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  setTipoSolicitante: (tipo: 'INDIVIDUAL' | 'ORGANIZACION') => void; // ✅ NUEVO
}

export function RequirementsSection({ 
  requirements, 
  showForm, 
  setShowForm,
  setTipoSolicitante  // ✅ NUEVO
}: RequirementsSectionProps) {

  // ✅ Estado para el modal y su animación
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Abre el modal y define el tipo antes de mostrar el formulario
  const openModalFor = (tipo: 'INDIVIDUAL' | 'ORGANIZACION') => {
    setTipoSolicitante(tipo);
    setShowModal(true);
    // pequeña espera para que aplique la animación (scale/opacity)
    setTimeout(() => setIsVisible(true), 15);
  };

  // ✅ Cerrar modal y continuar con el formulario
  const handleModalClose = () => {
    setIsVisible(false);
    // espera a que termine la animación (debe coincidir con duration-250)
    setTimeout(() => {
      setShowModal(false);
      setShowForm(true); // ← aquí recién se despliega el formulario
    }, 250);
  };

  // Limpieza si el componente se desmonta durante animación
  useEffect(() => {
    return () => {
      setShowModal(false);
      setIsVisible(false);
    };
  }, []);

  // Handlers originales ahora abren el modal
  const handleOrganizacion = () => openModalFor('ORGANIZACION');
  const handleIndividual = () => openModalFor('INDIVIDUAL');

  return (
    <div className="bg-white/80 rounded-xl p-8 shadow-md border border-[#DCD6C9] max-w-6xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center mb-8">Requisitos</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {requirements.map((req, i) => (
          <div key={i} className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-[#708C3E] mt-1 flex-shrink-0" />
            <p className="text-gray-700">{req}</p>
          </div>
        ))}
      </div>

      {!showForm && (
        <div className="text-center mt-10">
          <div className="inline-flex gap-20">
            <button
              onClick={handleOrganizacion}  // ✅ ACTUALIZADO
              className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium px-6 py-3 text-lg transition"
            >
              Desplegar Formulario Para Organización
            </button>

            <button
              onClick={handleIndividual}  // ✅ ACTUALIZADO
              className="bg-gradient-to-r from-[#6F8C1F] to-[#475C1D] hover:from-[#5d741c] hover:to-[#384c17] text-white rounded-md font-medium px-6 py-3 text-lg transition"
            >
              Desplegar Formulario Para Individual
            </button>
          </div>
        </div>
      )}

      {/* Modal de aviso importante */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          className={`
            fixed inset-0 flex items-center justify-center z-50
            bg-black/40 backdrop-blur-sm
            transition-all duration-250
            ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        >
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg mx-4 transition-all duration-250">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#708C3E] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-center text-[#708C3E]">
              Documentos Requeridos
            </h2>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700 text-lg">
                Antes de continuar, asegúrese de tener disponibles los siguientes documentos:
              </p>
              
              <div className="bg-[#F5F7EC] p-4 rounded-lg border-l-4 border-[#708C3E]">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#708C3E] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Fotocopia de la cédula</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#708C3E] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Currículum vitae</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-[#708C3E] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Carta de motivación</strong></span>
                  </li>
                </ul>
              </div>

            </div>

            <button
              onClick={handleModalClose}
              className="w-full px-6 py-3 bg-[#708C3E] text-white rounded-lg hover:bg-[#5d7334] transition-colors text-lg font-semibold shadow-md hover:shadow-lg"
            >
              Entendido, continuar con el formulario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
