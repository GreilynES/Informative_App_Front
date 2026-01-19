import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

interface ComercializacionSectionProps {
  form: FormLike
  showErrors?: boolean
}

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
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          11
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Comercialización</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Canales de comercialización: *</label>

        <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E]  text-white text-xs font-bold">
            i
          </span>
          <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Selecciona uno o varios canales. Para agregar otro, escríbelo y presiona{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span> o <span className="font-semibold">Enter</span>.
          </p>
        </div>

        <div className="space-y-2">
          {["Subastas", "Carnicerías", "Empacadoras", "Otras fincas"].map((canal) => (
            <div key={canal} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`canal-${canal}`}
                checked={canales.includes(canal)}
                onChange={() => toggleCanal(canal)}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor={`canal-${canal}`} className="text-sm text-[#4A4A4A]">
                {canal}
              </label>
            </div>
          ))}

          <div className="flex gap-2 mt-3 items-start">
            <input
              type="text"
              value={otroCanal}
              onChange={(e) => setOtroCanal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  agregarOtroCanal()
                }
              }}
              placeholder="Otro canal de comercialización."
              className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              maxLength={75}
            />

            <Button type="button" variant="outline" size="sm" onClick={agregarOtroCanal} className={btn.outlineGreen}>
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

          {canales.length > 0 && (
            <div className="mt-3 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
              <p className="text-xs text-[#8B6C2E] font-medium mb-2">Canales seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {canales.map((c, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white border border-[#F5E6C5] rounded-full px-3 py-1 text-xs text-[#8B6C2E]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
