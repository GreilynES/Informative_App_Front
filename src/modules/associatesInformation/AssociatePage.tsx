import { HeaderSection } from "./components/HeaderSection"
import { RequirementsSection } from "./components/RequerimentsSection"
import { Stepper } from "../associatesForm/components/Stepper"
import { useState } from "react"
import { useAssociatesPage } from "./hooks/useAssociatesPage"
import { BenefitsSection } from "./components/BenefitsSection"
import { Steps } from "../associatesForm/components/Steps"
import { useAssociateApply } from "../associatesForm/hooks/useAssociateApply"
import { useCedulaLookup } from "../../shared/hooks/IdApiHook"
import { useNavigate } from "@tanstack/react-router"

export default function AssociatesPage() {
  const navigate = useNavigate()
  const { lookup } = useCedulaLookup()
  const { data, loading, error, reload } = useAssociatesPage()

  const [showForm, setShowForm] = useState(false)
  const [step, setStep] = useState(1)

  const { form, mutation } = useAssociateApply(() => {
    setStep(1)
    setShowForm(false)
    navigate({ to: "/" })
  })

  // ✅ mantenemos error, pero ya NO hacemos return por loading
  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Error: {error ?? "Sin datos"}
        <div className="mt-4">
          <button onClick={reload} className="px-4 py-2 rounded border">
            Reintentar
          </button>
        </div>
      </div>
    )

  const nextStep = () => setStep((s) => Math.min(7, s + 1))
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  const benefits =
    data?.benefits ? [...data.benefits].sort((a, b) => a.order - b.order) : []

  const requirements =
    data?.requirements
      ? [...data.requirements].sort((a, b) => a.order - b.order).map((r) => r.text)
      : []

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#FAF9F5] pt-14 relative">
      <HeaderSection
        title={data?.headerTitle ?? ""}
        description={data?.headerDescription ?? ""}
      />

      <div className="max-w-6xl mx-auto">
        <BenefitsSection items={benefits} />

        <RequirementsSection
          requirements={requirements}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </div>

      {showForm && (
        <div
          id="associate-form"
          className="py-16 px-4 bg-gradient-to-br from-[#FAF9F5] via-[#f6f9ea] to-[#ecf0d5]"
        >
          <div className="max-w-4xl mx-auto">
            <Stepper step={step} />

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
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

      {loading && (
        <div className="pointer-events-none absolute inset-0 bg-[#FAF9F5]/90" />
      )}
    </div>
  )
}
