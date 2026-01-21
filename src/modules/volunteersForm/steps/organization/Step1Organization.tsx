import { NavigationButtons } from "../../components/NavigationButtons"
import { OrganizacionSection } from "../../components/OrganizacionSection"
import { RepresentanteSection } from "../../components/RepresentanteSection"
import { validateOrgStep1Required } from "../../services/volunteerOrgStep1Validation"

export function Step1Organization(props: {
  form: any
  lookup?: (id: string) => Promise<any>
  showErrors: boolean
  setShowErrors: (v: boolean) => void
  onNext: () => void
}) {
  const { form, lookup, showErrors, setShowErrors, onNext } = props

  const handleNext = () => {
    const { anyEmpty } = validateOrgStep1Required(form)
    if (anyEmpty) {
      setShowErrors(true)
      return
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <OrganizacionSection form={form} showErrors={showErrors} />
      <RepresentanteSection form={form} lookup={lookup} showErrors={showErrors} />

      <NavigationButtons onPrev={() => {}} onNext={handleNext} disableNext={false} hidePrev />
    </div>
  )
}
