import type { VolunteersFormData } from "@/modules/volunteersInformation/models/VolunteersType"
import { StepPersonalInformation } from "./stepPersonalInformation"


export function Step1Individual(props: {
  formData: VolunteersFormData
  handleInputChange: (field: string, value: any) => void
  isStepValid: () => boolean
  lookup: (id: string) => Promise<any>
  onNext: () => void
}) {
  const { formData, handleInputChange, isStepValid, lookup, onNext } = props

  return (
    <StepPersonalInformation
      formData={formData}
      handleInputChange={handleInputChange as any}
      onNextCombined={onNext}
      isStepValid={isStepValid}
      lookup={lookup}
    />
  )
}
