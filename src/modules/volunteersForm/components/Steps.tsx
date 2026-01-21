import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType"
import { useState } from "react"
import { useStepsNavigation } from "../hooks/useStepsNavigation"
import { Step1Individual } from "../steps/individual/Step1Individual"
import { Step2Individual } from "../steps/individual/Step2Individual"
import { Step3Individual } from "../steps/individual/Step3Individual"
import { Step4Individual } from "../steps/individual/Step4Individual"
import { Step5Individual } from "../steps/individual/Step5Individual"
import { Step1Organization } from "../steps/organization/Step1Organization"
import { Step2Organization } from "../steps/organization/Step2Organization"
import { Step3Organization } from "../steps/organization/Step3Organization"
import { Step4Organization } from "../steps/organization/Step4Organization"

interface StepsProps {
  step: number
  formData?: VolunteersFormData
  setFormData?: (data: VolunteersFormData) => void
  handleInputChange?: (field: string, value: any) => void
  nextStep: () => void
  prevStep: () => void
  isStepValid?: () => boolean
  lookup?: (id: string) => Promise<any>
  submitIndividual?: (data: any) => Promise<any>
  submitOrganizacion?: () => Promise<void>
  tipoSolicitante?: "INDIVIDUAL" | "ORGANIZACION"
  form?: any
  isSubmitting?: boolean
  files?: any
  setFiles?: (files: any) => void
  onAfterSubmit?: () => void
}

export function Steps({
  step,
  formData,
  handleInputChange,
  nextStep,
  prevStep,
  isStepValid,
  lookup,
  tipoSolicitante = "INDIVIDUAL",
  form,
  submitIndividual,
  submitOrganizacion,
  files,
  setFiles,
  onAfterSubmit,
}: StepsProps) {
  const { formTopRef, goNext, goPrev } = useStepsNavigation(nextStep, prevStep)
  const [showOrgStep1Errors, setShowOrgStep1Errors] = useState(false)

  // ===================== INDIVIDUAL =====================
  if (tipoSolicitante === "INDIVIDUAL") {
    return (
      <div ref={formTopRef} className="scroll-mt-[120px]">
        {step === 1 && (
          <Step1Individual
            formData={formData!}
            handleInputChange={handleInputChange!}
            isStepValid={isStepValid!}
            lookup={lookup!}
            onNext={goNext}
          />
        )}

        {step === 2 && (
          <Step2Individual formData={formData} handleInputChange={handleInputChange!} goPrev={goPrev} onNext={goNext} />
        )}

        {step === 3 && (
          <Step3Individual formData={formData} handleInputChange={handleInputChange!} goPrev={goPrev} onNext={goNext} />
        )}

        {step === 4 && (
          <Step4Individual files={files!} setFiles={setFiles!} goPrev={goPrev} goNext={goNext} isStepValid={isStepValid!} />
        )}

        {step === 5 && (
          <Step5Individual
            formData={formData!}
            files={files}
            goPrev={goPrev}
            handleInputChange={handleInputChange!}
            submitIndividual={submitIndividual}
            submitOrganizacion={submitOrganizacion}
            onAfterSubmit={onAfterSubmit}
          />
        )}
      </div>
    )
  }

  // ===================== ORGANIZACION =====================
  if (tipoSolicitante === "ORGANIZACION") {
    if (!form) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Error: Formulario no inicializado</p>
        </div>
      )
    }

    return (
      <div ref={formTopRef} className="scroll-mt-[120px]">
        {step === 1 && (
          <Step1Organization
            form={form}
            lookup={lookup}
            showErrors={showOrgStep1Errors}
            setShowErrors={setShowOrgStep1Errors}
            onNext={goNext}
          />
        )}

        {step === 2 && (
          <Step2Organization
            form={form}
            formData={formData}
            handleInputChange={handleInputChange}
            goPrev={goPrev}
            onNext={goNext}
          />
        )}

        {step === 3 && (
          <Step3Organization files={files!} setFiles={setFiles!} goPrev={goPrev} goNext={goNext} isStepValid={isStepValid!} />
        )}

        {step === 4 && (
          <Step4Organization
            form={form}
            formData={formData!}
            files={files}
            goPrev={goPrev}
            handleInputChange={handleInputChange!}
            submitIndividual={submitIndividual}
            submitOrganizacion={submitOrganizacion}
            onAfterSubmit={onAfterSubmit}
          />
        )}
      </div>
    )
  }

  return null
}
