
import { BenefitsSection } from "../components/Associates/BenefitsSection"
import { DownloadSection } from "../components/Associates/DownloadSection"
import { HeaderSection } from "../components/Associates/HeaderSection"
import { RequirementsSection } from "../components/Associates/RequerimentsSection"
import { Stepper } from "../components/Associates/Stepper"
import { Steps } from "../components/Associates/Steps"
import { TermsAndSubmit } from "../components/Associates/TermsAndSubmit"
import { useCedulaLookup } from "../hooks/IdApiHook"
import { useAssociatesForm } from "../hooks/useAssociatesForm"

export default function AssociatesForm() {
  const {
    formData,
    setFormData,
    step,
    nextStep,
    prevStep,
    showForm,
    setShowForm,
    handleInputChange,
    isStepValid,
  } = useAssociatesForm()

  const { lookup } = useCedulaLookup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <HeaderSection />

      <BenefitsSection />

      <RequirementsSection
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {showForm && (
        <div className="py-16 px-4 bg-gradient-to-br from-[#F5F7EC] via-[#EEF4D8] to-[#E7EDC8]">
          <div className="max-w-4xl mx-auto">
            <DownloadSection />

            <Stepper step={step} />

            <form onSubmit={handleSubmit} className="space-y-8">
              <Steps
                step={step}
                formData={formData}
                setFormData={setFormData}
                handleInputChange={handleInputChange}
                nextStep={nextStep}
                prevStep={prevStep}
                isStepValid={isStepValid}
                lookup={lookup}
              />

              {step === 5 && (
                <TermsAndSubmit
                  formData={formData}
                  handleInputChange={handleInputChange}
                  prevStep={prevStep}
                />
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
