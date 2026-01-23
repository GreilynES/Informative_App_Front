import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

interface AccesoSectionProps {
  form: FormLike
  showErrors?: boolean
}

const checkboxBase =
  "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
const checkRow = "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30"

export function AccesoSection({ form, showErrors = false }: AccesoSectionProps) {
  const existentes = (form as any).state?.values?.viasAcceso || {}

  const [accesos, setAccesos] = useState<string[]>(existentes.accesos || [])
  const [otroAcceso, setOtroAcceso] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    ;(form as any).setFieldValue("viasAcceso", { accesos })

    if (showErrors && accesos.length === 0) setError("Debe seleccionar al menos una vía de acceso")
    else setError("")
  }, [accesos, form, showErrors])

  const toggleAcceso = (acceso: string) => {
    setAccesos((prev) => (prev.includes(acceso) ? prev.filter((a) => a !== acceso) : [...prev, acceso]))
  }

  const agregarOtroAcceso = () => {
    const trimmed = (otroAcceso ?? "").trim()
    if (!trimmed) return
    if (trimmed.length > 75) return alert("El texto es muy largo (máx. 75 caracteres).")

    const exists = accesos.some((a) => a.toLowerCase() === trimmed.toLowerCase())
    if (exists) return alert("Este tipo de acceso ya fue agregado")

    setAccesos((prev) => [...prev, trimmed])
    setOtroAcceso("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          10
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Vías de Acceso</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A]">Vías de acceso: *</label>

        {/* Callout */}
        <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="text-sm text-[#4A4A4A]">
              Selecciona una o varias vías. Para agregar otra, escríbela y presiona{" "}
              <span className="font-semibold text-[#708C3E]">Agregar</span>.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {["Externas", "Internas"].map((acceso) => (
            <label key={acceso} className={checkRow}>
              <Checkbox
                checked={accesos.includes(acceso)}
                onCheckedChange={() => toggleAcceso(acceso)}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">{acceso}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 items-start">
          <Input
            value={otroAcceso}
            onChange={(e) => setOtroAcceso(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                agregarOtroAcceso()
              }
            }}
            placeholder="Otras vías de acceso."
            maxLength={75}
            className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
          />

          <Button type="button" variant="outline" onClick={agregarOtroAcceso} className={`${btn.outlineGreen} h-10 px-4 text-sm`}>
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {accesos.length > 0 && (
          <div className="mt-2 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
            <p className="text-xs text-[#8B6C2E] font-medium mb-2">Vías de acceso seleccionadas:</p>
            <div className="flex flex-wrap gap-2">
              {accesos.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center bg-white border border-[#F5E6C5] rounded-full px-3 py-1 text-xs text-[#8B6C2E]"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
