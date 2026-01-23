import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

interface ComercializacionSectionProps {
  form: FormLike
  showErrors?: boolean
}

const checkboxBase =
  "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
const checkRow = "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30"

export function ComercializacionSection({ form, showErrors = false }: ComercializacionSectionProps) {
  const existentes = (form as any).state?.values?.comercializacion || {}

  const [canales, setCanales] = useState<string[]>(existentes.canales || [])
  const [otroCanal, setOtroCanal] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    ;(form as any).setFieldValue("comercializacion", { canales })
    if (showErrors && canales.length === 0) setError("Debe seleccionar al menos un canal de comercialización")
    else setError("")
  }, [canales, form, showErrors])

  const toggleCanal = (canal: string) => {
    setCanales((prev) => (prev.includes(canal) ? prev.filter((c) => c !== canal) : [...prev, canal]))
  }

  const agregarOtroCanal = () => {
    const trimmed = (otroCanal ?? "").trim()
    if (!trimmed) return
    if (trimmed.length > 75) return alert("El texto es muy largo (máx. 75 caracteres).")

    const exists = canales.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    if (exists) return alert("Este canal ya fue agregado")

    setCanales((prev) => [...prev, trimmed])
    setOtroCanal("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          11
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Comercialización</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A]">Canales de comercialización: *</label>

        <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="text-sm text-[#4A4A4A]">
              Selecciona uno o varios canales. Para agregar otro, escríbelo y presiona{" "}
              <span className="font-semibold text-[#708C3E]">Agregar</span> o{" "}
              <span className="font-semibold">Enter</span>.
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {["Subastas", "Carnicerías", "Empacadoras", "Otras fincas"].map((canal) => (
            <label key={canal} className={checkRow}>
              <Checkbox
                checked={canales.includes(canal)}
                onCheckedChange={() => toggleCanal(canal)}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">{canal}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 items-start">
          <Input
            value={otroCanal}
            onChange={(e) => setOtroCanal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                agregarOtroCanal()
              }
            }}
            placeholder="Otro canal de comercialización."
            maxLength={75}
            className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
          />

          <Button
            type="button"
            variant="outline"
            onClick={agregarOtroCanal}
            className={`${btn.outlineGreen} h-10 px-4 text-sm`}
          >
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {canales.length > 0 && (
          <div className="mt-2 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
            <p className="text-xs text-[#8B6C2E] font-medium mb-2">Canales seleccionados:</p>
            <div className="flex flex-wrap gap-2">
              {canales.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center bg-white border border-[#F5E6C5] rounded-full px-3 py-1 text-xs text-[#8B6C2E]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
