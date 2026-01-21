import { useRef } from "react"
import { DisponibilidadAreasSection, type DisponibilidadAreasSectionHandle } from "../../components/DisponibilidadAreasSection"
import { NavigationButtons } from "../../components/NavigationButtons"

export function Step2Organization(props: {
  form: any
  formData?: any
  handleInputChange?: (field: string, value: any) => void
  goPrev: () => void
  onNext: () => void
}) {
  const { form, formData, handleInputChange, goPrev, onNext } = props
  const dispRef = useRef<DisponibilidadAreasSectionHandle>(null)

  const handleNext = () => {
    const ok = dispRef.current?.validateAndShowErrors() ?? false
    if (!ok) return
    onNext()
  }

  return (
    <div className="space-y-6">
      <DisponibilidadAreasSection
        ref={dispRef}
        formData={formData}
        handleInputChange={handleInputChange}
        tipoSolicitante="ORGANIZACION"
        form={form}
      />

      <NavigationButtons onPrev={goPrev} onNext={handleNext} disableNext={false} />
    </div>
  )
}
