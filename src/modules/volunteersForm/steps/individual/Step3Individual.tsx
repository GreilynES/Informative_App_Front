import { useRef } from "react"
import { MotivacionHabilidadesSection, type MotivacionHabilidadesSectionHandle } from "../../components/MotivacionHabilidadesSection"
import { NavigationButtons } from "../../components/NavigationButtons"

export function Step3Individual(props: {
  formData: any
  handleInputChange: (field: string, value: any) => void
  goPrev: () => void
  onNext: () => void
}) {
  const { formData, handleInputChange, goPrev, onNext } = props
  const motivRef = useRef<MotivacionHabilidadesSectionHandle>(null)

  const handleNext = () => {
    const ok = motivRef.current?.validateAndShowErrors() ?? false
    if (!ok) return
    onNext()
  }

  return (
    <div className="space-y-6">
      <MotivacionHabilidadesSection ref={motivRef} formData={formData} handleInputChange={handleInputChange} />

      <NavigationButtons onPrev={goPrev} onNext={handleNext} disableNext={false} />
    </div>
  )
}
