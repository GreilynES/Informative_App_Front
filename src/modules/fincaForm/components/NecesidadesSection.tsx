import { useEffect, useMemo, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Input } from "@/components/ui/input"

interface NecesidadesSectionProps {
  form: FormLike
  showErrors?: boolean
}

export function NecesidadesSection({ form, showErrors = false }: NecesidadesSectionProps) {
  const existentes = (form as any).state?.values?.necesidadesObservaciones || {}

  const [necesidades, setNecesidades] = useState<string[]>(existentes.necesidades || ["", "", "", "", ""])
  const [error, setError] = useState<string>("")

  const filledCount = useMemo(
    () => necesidades.filter((n) => n && n.trim() !== "").length,
    [necesidades]
  )

  useEffect(() => {
    ;(form as any).setFieldValue("necesidadesObservaciones", { necesidades })

    if (showErrors && filledCount === 0) setError("Debe ingresar al menos una necesidad o mejora")
    else setError("")
  }, [necesidades, form, showErrors, filledCount])

  const handleNecesidadChange = (index: number, value: string) => {
    const v = value.length > 255 ? value.slice(0, 255) : value
    setNecesidades((prev) => {
      const next = prev.slice()
      next[index] = v
      return next
    })
  }

  const firstHasError = showErrors && !String(necesidades[0] ?? "").trim()

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          12
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Necesidades y Observaciones</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A]">
          Mencione las necesidades o mejoras que su finca requiere actualmente (Al menos una): *
        </label>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((num) => {
            const idx = num - 1
            const isFirst = num === 1

            return (
              <div key={num}>


                <Input
                  value={necesidades[idx]}
                  onChange={(e) => handleNecesidadChange(idx, e.target.value)}
                  placeholder={`Ingrese la necesidad/mejora ${num}.`}
                  maxLength={255}
                  className={[
                    "bg-white",
                    isFirst && firstHasError
                      ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                      : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0",
                  ].join(" ")}
                />
              </div>
            )
          })}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
