// src/modules/volunteersInformation/VolunteersPage.tsx

import { useCedulaLookup } from "../../shared/hooks/IdApiHook";
import { Stepper } from "../volunteersForm/components/Stepper";
import { TermsAndSubmit } from "../volunteersForm/components/TermsAndSubmit";
import { useVolunteersForm } from "../volunteersForm/hooks/useVolunteersForm";
import { useVolunteerApply } from "../volunteersForm/hooks/useVolunteerApply";
import { useVolunteerIndividual } from "../volunteersForm/hooks/useVolunteerIndividual";
import { BenefitsSection } from "./components/BenefitsSection";
import { HeaderSection } from "./components/HeaderSection";
import { useVolunteersPage } from "./hooks/useVolunteersPage";
import { RequirementsSection } from "./components/RequerimentsSection";
import { Steps } from "../volunteersForm/components/Steps";


export default function VolunteersPage() {
  const {
    formData,
    setFormData,
    step,
    nextStep,
    prevStep,
    showForm,
    setShowForm,
    tipoSolicitante,
    setTipoSolicitante,
    handleInputChange,
    isStepValid,
  } = useVolunteersForm();

  const { lookup } = useCedulaLookup();
  const { data, loading, error, reload } = useVolunteersPage();

  // Hook para Organización
  const { form: formOrganizacion, isLoading: isSubmittingOrg } = useVolunteerApply();

  // Hook para Individual
  const { submitIndividual, isLoading: isSubmittingInd } = useVolunteerIndividual(() => {
    console.log("✅ Solicitud individual enviada con éxito");
  });

  if (loading) return <div className="p-8 text-center">Cargando contenido…</div>;
  if (error || !data) return (
    <div className="p-8 text-center text-red-600">
      Error: {error ?? "Sin datos"}
      <div className="mt-4">
        <button onClick={reload} className="px-4 py-2 rounded border">Reintentar</button>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const formToUse = tipoSolicitante === 'ORGANIZACION' ? formOrganizacion : undefined;

  const handleSubmitIndividual = tipoSolicitante === 'INDIVIDUAL' 
    ? async (data: any) => {
        await submitIndividual(data);
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <HeaderSection title={data.headerTitle} description={data.headerDescription} />

      <div className="max-w-6xl mx-auto">
        <BenefitsSection items={[...data.benefits].sort((a, b) => a.order - b.order)} />
        <RequirementsSection
          requirements={[...data.requirements].sort((a, b) => a.order - b.order).map(r => r.text)}
          showForm={showForm}
          setShowForm={setShowForm}
          setTipoSolicitante={setTipoSolicitante}
        />
      </div>

      {showForm && (
        <div className="py-16 px-4 bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
          <div className="max-w-4xl mx-auto">
            <Stepper step={step} tipoSolicitante={tipoSolicitante} />

            {(tipoSolicitante === 'INDIVIDUAL' || (tipoSolicitante === 'ORGANIZACION' && formOrganizacion)) ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <Steps
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange as any} // ✅ CAST temporal
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isStepValid={isStepValid}
                  lookup={lookup}
                  tipoSolicitante={tipoSolicitante}
                  form={formToUse}
                  isSubmitting={tipoSolicitante === 'ORGANIZACION' ? isSubmittingOrg : isSubmittingInd}
                  submitIndividual={handleSubmitIndividual}
                />

                {step === 5 && tipoSolicitante === 'INDIVIDUAL' && (
                  <TermsAndSubmit
                    formData={formData}
                    handleInputChange={handleInputChange}
                    prevStep={prevStep}
                  />
                )}
              </form>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600">Cargando formulario...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}