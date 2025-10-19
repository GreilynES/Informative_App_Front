import { HeaderSection } from "./components/HeaderSection";
import { RequirementsSection } from "./components/RequerimentsSection";
import { Stepper } from "../associatesForm/components/Stepper";
import { useState } from "react";
import { useAssociatesPage } from "./hooks/useAssociatesPage";
import { BenefitsSection } from "./components/BenefitsSection";
import { Steps } from "../associatesForm/components/Steps";
import { useAssociateApply } from "../associatesForm/hooks/useAssociateApply";
import { useCedulaLookup } from "../../shared/hooks/IdApiHook";

export default function AssociatesPage() {
  const { lookup } = useCedulaLookup();
  const { data, loading, error, reload } = useAssociatesPage();
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(1);

  const { form, mutation } = useAssociateApply(() => {
    setStep(1);
    setShowForm(false);
  });

  if (loading) return <div className="p-8 text-center">Cargando contenido…</div>;
  if (error || !data)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error ?? "Sin datos"}
        <div className="mt-4">
          <button onClick={reload} className="px-4 py-2 rounded border">Reintentar</button>
        </div>
      </div>
    );

  const nextStep = () => setStep((s) => Math.min(7, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // Función para abrir el modal antes de mostrar el formulario
  const handleOpenFormClick = () => {
    setShowModal(true);
    setIsVisible(true);
  };

  // Función para cerrar el modal y abrir el formulario
  const handleModalClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setShowForm(true);
      setIsVisible(true);
      // Scroll hacia el formulario
      setTimeout(() => {
        const formElement = document.getElementById('associate-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* Modal de aviso importante */}
      {showModal && (
        <div
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
                    <span><strong>Copia del acta de finca o contrato de arriendo de finca</strong></span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-800 mb-1">Comisión de Asociado</p>
                    <p className="text-amber-700">
                      Si su solicitud es aceptada, deberá pagar una comisión única de <strong>₡5,000 colones</strong> para completar su registro como asociado.
                    </p>
                  </div>
                </div>
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

      <HeaderSection title={data.headerTitle} description={data.headerDescription} />

      <div className="max-w-6xl mx-auto">
        <BenefitsSection items={[...data.benefits].sort((a, b) => a.order - b.order)} />
        <RequirementsSection
          requirements={[...data.requirements].sort((a, b) => a.order - b.order).map(r => r.text)}
          showForm={showForm}
          setShowForm={handleOpenFormClick} // Ahora abre el modal en lugar de abrir directamente el formulario
        />
      </div>

      {showForm && (
        <div id="associate-form" className="py-16 px-4 bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8] scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <Stepper step={step} />

            <form
              onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
              className="space-y-8"
            >
              <Steps
                step={step}
                form={form as any}
                lookup={lookup}
                nextStep={nextStep}
                prevStep={prevStep}
                isSubmitting={mutation.isPending}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}