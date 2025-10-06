import { DownloadSection } from "./components/DownloadSection";
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

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <HeaderSection title={data.headerTitle} description={data.headerDescription} />

      <div className="max-w-6xl mx-auto">
        <BenefitsSection items={[...data.benefits].sort((a, b) => a.order - b.order)} />
        <RequirementsSection
          requirements={[...data.requirements].sort((a, b) => a.order - b.order).map(r => r.text)}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </div>

      {showForm && (
        <div className="py-16 px-4 bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
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
