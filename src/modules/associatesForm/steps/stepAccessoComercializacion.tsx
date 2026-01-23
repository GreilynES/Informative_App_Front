import { useEffect, useMemo, useRef, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { AccesoSection } from "../../fincaForm/components/AccesoSection"
import { ComercializacionSection } from "../../fincaForm/components/ComercializacionSection"
import { NecesidadesSection } from "../../fincaForm/components/NecesidadesSection"
import { NavigationButtons } from "../components/NavigationButtons"

interface Step5Props {
  form: FormLike
  onNext: () => void
  onPrev: () => void
}

export function Step5({ form, onNext, onPrev }: Step5Props) {
  const [intentado, setIntentado] = useState(false)
  const [, setTick] = useState(0)

  const accesoRef = useRef<HTMLDivElement>(null)
  const comercializacionRef = useRef<HTMLDivElement>(null)
  const necesidadesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = (form as any).subscribe?.(() => setTick((t) => t + 1))
    if (!unsubscribe) {
      const interval = setInterval(() => setTick((t) => t + 1), 500)
      return () => clearInterval(interval)
    }
    return () => unsubscribe?.()
  }, [form])

  const valores = (form as any).state?.values || {}

  const accesos = valores.viasAcceso?.accesos || []
  const canales = valores.comercializacion?.canales || []
  const necesidades = (valores.necesidadesObservaciones?.necesidades || []).filter(
    (n: string) => n && n.trim() !== ""
  )

  const faltan = useMemo(
    () => ({
      accesos: accesos.length === 0,
      canales: canales.length === 0,
      necesidades: necesidades.length === 0,
    }),
    [accesos.length, canales.length, necesidades.length]
  )

  const disableNext = faltan.accesos || faltan.canales || faltan.necesidades

  const scrollToFirstError = (errors: typeof faltan) => {
    if (errors.accesos && accesoRef.current) {
      accesoRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    } else if (errors.canales && comercializacionRef.current) {
      comercializacionRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    } else if (errors.necesidades && necesidadesRef.current) {
      necesidadesRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
    }
  }

  const handleNext = () => {
    setIntentado(true)
    if (!disableNext) onNext()
    else setTimeout(() => scrollToFirstError(faltan), 100)
  }

  return (
    <div className="space-y-6">
      <div ref={accesoRef} className="scroll-mt-24">
        <AccesoSection form={form} showErrors={intentado} />
      </div>

      <div ref={comercializacionRef} className="scroll-mt-24">
        <ComercializacionSection form={form} showErrors={intentado} />
      </div>

      <div ref={necesidadesRef} className="scroll-mt-24">
        <NecesidadesSection form={form} showErrors={intentado} />
      </div>

      <NavigationButtons onPrev={onPrev} onNext={handleNext} disableNext={disableNext} />
    </div>
  )
}
