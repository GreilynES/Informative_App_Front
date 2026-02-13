import React from "react"
import { useCedulaLookup } from "../../shared/hooks/IdApiHook"
import { Stepper } from "../volunteersForm/components/Stepper"
import { useVolunteersForm } from "../volunteersForm/hooks/useVolunteersForm"
import { useVolunteerApply } from "../volunteersForm/hooks/useVolunteerApply"
import { useVolunteerIndividual } from "../volunteersForm/hooks/useVolunteerIndividual"
import { BenefitsSection } from "./components/BenefitsSection"
import { HeaderSection } from "./components/HeaderSection"
import { useVolunteersPage } from "./hooks/useVolunteersPage"
import { RequirementsSection } from "./components/RequerimentsSection"
import { Steps } from "../volunteersForm/components/Steps"
import { useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { PageState } from "@/shared/ui/PageState"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

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
  } = useVolunteersForm()

  const { lookup } = useCedulaLookup()
  const { data, loading, error, reload } = useVolunteersPage()
  const navigate = useNavigate()

  const {
    form: formOrganizacion,
    submitWithFiles: submitOrganizacion,
  } = useVolunteerApply(() => {
    console.log(" Solicitud de organización enviada con éxito")
    nextStep()
  })

  const goBackToForms = () => {
  navigate({ to: "/", hash: "form" })

  // Por si tu home no hace scroll automático con hash:
  setTimeout(() => {
    document.getElementById("formularios")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, 50)
}

  const { submitIndividual, isLoading: isSubmittingInd } =
    useVolunteerIndividual(() => {
      console.log(" Solicitud individual enviada con éxito")
      nextStep()
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const formToUse = tipoSolicitante === "ORGANIZACION" ? formOrganizacion : undefined

  const handleSubmitIndividual =
    tipoSolicitante === "INDIVIDUAL"
      ? async (data: any) => {
          console.log("[Page] Enviando individual con files:", files)
          await submitIndividual({
            formData: data,
            files: {
              cv: files.cv || undefined,
              cedula: files.cedula || undefined,
              carta: files.carta || undefined,
            },
          })
        }
      : undefined

  const handleSubmitOrganizacion =
    tipoSolicitante === "ORGANIZACION"
      ? async () => {
          const values = formOrganizacion.state.values
          console.log("[Page] Enviando organización con files:", files)
          console.log("[Page] Values:", values)

          try {
            await submitOrganizacion({
              values,
              files: {
                cv: files.cv || undefined,
                cedula: files.cedula || undefined,
                carta: files.carta || undefined,
              },
            })
          } catch (error) {
            console.error("[Page] Error al enviar organización:", error)
          }
        }
      : undefined

  const handleInputChangeWrapper = (field: string, value: any) => {
    handleInputChange(field, value)
  }

  const resetStepsToFirst = () => {
    const go = () => {
      if (step > 1) {
        prevStep()
        requestAnimationFrame(go)
      }
    }
    requestAnimationFrame(go)
  }

  const handleAfterSubmit = () => {
    resetToFirstStep()
    setShowForm(false)

    setTimeout(() => {
      document.getElementById("requisitos")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      navigate({ to: "/" })
    }, 300)
  }

  const benefits = data?.benefits
    ? [...data.benefits].sort((a, b) => a.order - b.order)
    : []

  const requirements = data?.requirements
    ? [...data.requirements].sort((a, b) => a.order - b.order).map((r) => r.text)
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
                {Array.from({ length: 6 }).map((_, i) => (
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
        {/* Error state */}
        {error ? (
          <div className="max-w-3xl mx-auto px-4 py-10">
            <Card className="p-6 sm:p-8">
              <p className="text-base font-medium text-[#2E321B]">
                No pudimos cargar la información
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {typeof error === "string" ? error : "Intenta nuevamente."}
              </p>
              {reload ? (
                <div className="mt-5">
                  <Button className="rounded-full" onClick={reload}>
                    Reintentar
                  </Button>
                </div>
              ) : null}
            </Card>
          </div>
        ) : (
          <>


            <HeaderSection
              title={data?.headerTitle ?? ""}
              description={data?.headerDescription ?? ""}
            />

              {/* Botón volver */}
              <div className="absolute left-4 top-20 sm:top-24 z-40">
                <Button
                  type="button"
                  onClick={goBackToForms}
                  aria-label="Volver a formularios"
                  className="
                    h-11 w-11 rounded-full p-0
                    bg-[#6D8B37] text-white
                    shadow-md
                    hover:bg-[#2F5F0B]
                    active:scale-95
                    transition-all duration-300
                  "
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
              </div>


            <div className="max-w-6xl mx-auto">
              <BenefitsSection items={benefits} />

              <section id="requisitos">
                <RequirementsSection
                  requirements={requirements}
                  showForm={showForm}
                  setShowForm={(v: boolean) => {
                    if (v) resetStepsToFirst()
                    setShowForm(v)
                  }}
                  setTipoSolicitante={setTipoSolicitante}
                />
              </section>
            </div>

            {showForm && (
              <div className="py-16 px-4 bg-gradient-to-br from-[#FAF9F5] via-[#f6f9ea] to-[#ecf0d5]">
                <div className="max-w-4xl mx-auto">
                  {tipoSolicitante === "INDIVIDUAL" ||
                  (tipoSolicitante === "ORGANIZACION" && formOrganizacion) ? (
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
                        isSubmitting={
                          tipoSolicitante === "ORGANIZACION"
                            ? false
                            : isSubmittingInd
                        }
                        submitIndividual={handleSubmitIndividual}
                        submitOrganizacion={handleSubmitOrganizacion}
                        files={files}
                        setFiles={setFiles}
                        onAfterSubmit={handleAfterSubmit}
                      />
                    </form>
                  ) : null}
                </div>
              </div>
            )}

            {/* Overlay mientras carga (si refresca data) */}
            {loading && (
              <div className="pointer-events-none absolute inset-0 bg-[#FAF9F5]/90" />
            )}
          </>
        )}
      </PageState>
    </div>
  )
}
