import { useCedulaLookup } from "../../shared/hooks/IdApiHook";
import { Stepper } from "../volunteersForm/components/Stepper";
import { useVolunteersForm } from "../volunteersForm/hooks/useVolunteersForm";
import { useVolunteerApply } from "../volunteersForm/hooks/useVolunteerApply";
import { useVolunteerIndividual } from "../volunteersForm/hooks/useVolunteerIndividual";
import { BenefitsSection } from "./components/BenefitsSection";
import { HeaderSection } from "./components/HeaderSection";
import { useVolunteersPage } from "./hooks/useVolunteersPage";
import { RequirementsSection } from "./components/RequerimentsSection";
import { Steps } from "../volunteersForm/components/Steps";
import { useNavigate } from "@tanstack/react-router";

export default function VolunteersPage() {
  const {
  formData,
  setFormData,
  step,
  nextStep,
  prevStep,
  resetToFirstStep,
  showForm,
  setShowForm,
  tipoSolicitante,
  setTipoSolicitante,
  handleInputChange,
  isStepValid,
  files,
  setFiles,
} = useVolunteersForm();

  const { lookup } = useCedulaLookup();
  const { data, loading, error, reload } = useVolunteersPage();
  const navigate = useNavigate();

  const { 
    form: formOrganizacion, 
    isLoading: isSubmittingOrg,
    submitWithFiles: submitOrganizacion,
  } = useVolunteerApply(() => {
    console.log(" Solicitud de organización enviada con éxito");
    nextStep();
  });


  const { submitIndividual, isLoading: isSubmittingInd } = useVolunteerIndividual(() => {
    console.log(" Solicitud individual enviada con éxito");
    nextStep();
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
        console.log("[Page] Enviando individual con files:", files);
        await submitIndividual({ 
          formData: data, 
          files: {
            cv: files.cv || undefined,
            cedula: files.cedula || undefined,
            carta: files.carta || undefined,
          }
        });
      }
    : undefined;

  const handleSubmitOrganizacion = tipoSolicitante === 'ORGANIZACION'
    ? async () => {
        const values = formOrganizacion.state.values;
        console.log("[Page] Enviando organización con files:", files);
        console.log("[Page] Values:", values);
        
        try {
          await submitOrganizacion({ 
            values, 
            files: {
              cv: files.cv || undefined,
              cedula: files.cedula || undefined,
              carta: files.carta || undefined,
            }
          });
        } catch (error) {
          console.error("[Page] Error al enviar organización:", error);
        }
      }
    : undefined;

  const handleInputChangeWrapper = (field: string, value: any) => {
    handleInputChange(field, value);
  };

  const resetStepsToFirst = () => {
    const go = () => {
      if (step > 1) {
        prevStep();
        requestAnimationFrame(go);
      }
    };
    requestAnimationFrame(go);
  };

  const handleAfterSubmit = () => {
  resetToFirstStep();
  setShowForm(false);

  setTimeout(() => {
    document.getElementById("requisitos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    navigate({ to: "/" });
  }, 300);
};

  return (
    <div className="min-h-screen bg-[#FAF9F5] pt-14">
      <HeaderSection title={data.headerTitle} description={data.headerDescription} />

      <div className="max-w-6xl mx-auto">
        <BenefitsSection items={[...data.benefits].sort((a, b) => a.order - b.order)} />

        <section id="requisitos">
          <RequirementsSection
            requirements={[...data.requirements].sort((a, b) => a.order - b.order).map(r => r.text)}
            showForm={showForm}
            setShowForm={(v: boolean) => {
              if (v) resetStepsToFirst();
              setShowForm(v);
            }}
            setTipoSolicitante={setTipoSolicitante}
          />
        </section>
      </div>

      {showForm && (
        <div className="py-16 px-4 bg-gradient-to-br from-[#FAF9F5] via-[#f6f9ea] to-[#ecf0d5]">
          <div className="max-w-4xl mx-auto">

            {(tipoSolicitante === 'INDIVIDUAL' || (tipoSolicitante === 'ORGANIZACION' && formOrganizacion)) ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <Stepper step={step} tipoSolicitante={tipoSolicitante} />
                <Steps
                  step={step}
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChangeWrapper}
                  nextStep={nextStep}
                  prevStep={prevStep}
                  isStepValid={isStepValid}
                  lookup={lookup}
                  tipoSolicitante={tipoSolicitante}
                  form={formToUse}
                  isSubmitting={tipoSolicitante === 'ORGANIZACION' ? isSubmittingOrg : isSubmittingInd}
                  submitIndividual={handleSubmitIndividual}
                  submitOrganizacion={handleSubmitOrganizacion} 
                  files={files}
                  setFiles={setFiles}
                  onAfterSubmit={handleAfterSubmit}
                />
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
