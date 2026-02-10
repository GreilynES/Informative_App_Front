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

import { PageState } from "@/shared/ui/PageState"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

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

  const nextStep = () => setStep((s) => Math.min(7, s + 1))
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  const benefits =
    data?.benefits ? [...data.benefits].sort((a, b) => a.order - b.order) : []

  const requirements =
    data?.requirements
      ? [...data.requirements]
          .sort((a, b) => a.order - b.order)
          .map((r) => r.text)
      : []

  const isEmpty = !loading && !error && !data

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#FAF9F5] pt-14 relative">
      <PageState
        isLoading={loading}
        isEmpty={isEmpty}
        withContainer={false}
        emptyTitle="No hay información publicada"
        emptyDescription="Cuando publiquemos esta sección, aparecerá aquí."
        skeleton={
          <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
            {/* Header skeleton */}
            <Card className="p-6 sm:p-8">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-4 h-5 w-full" />
              <Skeleton className="mt-2 h-5 w-11/12" />
              <Skeleton className="mt-2 h-5 w-9/12" />
              <div className="mt-6 flex gap-3">
                <Skeleton className="h-10 w-40 rounded-full" />
                <Skeleton className="h-10 w-40 rounded-full" />
              </div>
            </Card>

            {/* Benefits skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-5">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-10/12" />
                </Card>
              ))}
            </div>

            {/* Requirements skeleton */}
            <Card className="p-6 sm:p-8">
              <Skeleton className="h-7 w-52" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Skeleton className="h-11 w-44 rounded-full" />
              </div>
            </Card>
          </div>
        }
      >
        {/* Error state (uniforme, shadcn) */}
        {error ? (
          <div className="max-w-3xl mx-auto px-4 py-10">
            <Card className="p-6 sm:p-8">
              <p className="text-base font-medium text-[#2E321B]">
                No pudimos cargar la información
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {typeof error === "string" ? error : "Intenta nuevamente."}
              </p>
              <div className="mt-5">
                <Button className="rounded-full" onClick={reload}>
                  Reintentar
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <>
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

            {/* Overlay mientras carga (si recargas data) */}
            {loading && (
              <div className="pointer-events-none absolute inset-0 bg-[#FAF9F5]/90" />
            )}
          </>
        )}
      </PageState>
    </div>
  )
}
