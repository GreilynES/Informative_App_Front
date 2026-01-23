import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"
import { Input } from "@/components/ui/input"

interface CaracteristicasFisicasSectionProps {
  form: FormLike
  showErrors?: boolean
}

const checkboxBase =
  "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
const checkRow =
  "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30"

export function CaracteristicasFisicasSection({ form }: CaracteristicasFisicasSectionProps) {
  const existentes = (form as any).state?.values?.caracteristicasFisicas || {}

  const [tiposCerca, setTiposCerca] = useState<string[]>(existentes.tiposCerca || [])
  const [equipos, setEquipos] = useState<string[]>(existentes.equipos || [])
  const [otraCerca, setOtraCerca] = useState<string>("")
  const [otroEquipo, setOtroEquipo] = useState<string>("")

  useEffect(() => {
    ;(form as any).setFieldValue("caracteristicasFisicas", { tiposCerca, equipos })
  }, [tiposCerca, equipos, form])

  const toggleCerca = (cerca: string) => {
    setTiposCerca((prev) => (prev.includes(cerca) ? prev.filter((c) => c !== cerca) : [...prev, cerca]))
  }

  const toggleEquipo = (equipo: string) => {
    setEquipos((prev) => (prev.includes(equipo) ? prev.filter((e) => e !== equipo) : [...prev, equipo]))
  }

  const agregarOtraCerca = () => {
    const trimmed = otraCerca.trim()
    if (!trimmed) return
    if (trimmed.length > 75) return alert("El texto es muy largo (máx. 75 caracteres).")
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmed)) return alert("Solo se permiten letras y espacios")
    const exists = tiposCerca.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    if (exists) return alert("Este tipo de cerca ya fue agregado")

    setTiposCerca((prev) => [...prev, trimmed])
    setOtraCerca("")
  }

  const agregarOtroEquipo = () => {
    const trimmed = otroEquipo.trim()
    if (!trimmed) return
    if (trimmed.length > 75) return alert("El texto es muy largo (máx. 75 caracteres).")
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmed)) return alert("Solo se permiten letras y espacios")
    const exists = equipos.some((e) => e.toLowerCase() === trimmed.toLowerCase())
    if (exists) return alert("Este equipo ya fue agregado")

    setEquipos((prev) => [...prev, trimmed])
    setOtroEquipo("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          9
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Características Físicas</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Tipos de cerca */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Tipos de cerca:</label>

          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">
                Marca los tipos de cerca que aplican. Para otro tipo, escríbelo y presiona{" "}
                <span className="font-semibold text-[#708C3E]">Agregar</span>.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {["Alambre de púas", "Eléctrica", "Viva", "Muerta"].map((cerca) => {
              const checked = tiposCerca.includes(cerca)
              return (
                <label key={cerca} className={checkRow}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCerca(cerca)}
                    className={checkboxBase}
                  />
                  <span className="text-sm text-gray-700">{cerca}</span>
                </label>
              )
            })}
          </div>

          <div className="flex gap-2 mt-3 items-start">
            <Input
              value={otraCerca}
              onChange={(e) => setOtraCerca(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  agregarOtraCerca()
                }
              }}
              placeholder="Otro tipo de cerca"
              className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
              maxLength={75}
            />

            <Button
              type="button"
              variant="outline"
              onClick={agregarOtraCerca}
              className={`${btn.outlineGreen} h-9 px-4 text-sm`}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {tiposCerca.length > 0 && (
            <div className="mt-3 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
              <p className="text-xs text-[#8B6C2E] font-medium mb-2">Tipos de cerca seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {tiposCerca.map((cerca) => (
                  <span
                    key={cerca}
                    className="inline-flex items-center bg-white border border-[#F5E6C5] rounded-lg px-3 py-1 text-xs text-[#8B6C2E]"
                  >
                    {cerca}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Equipos */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Equipos disponibles:</label>

          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">
                Selecciona los equipos que tiene la finca. Para otro equipo, escríbelo y presiona{" "}
                <span className="font-semibold text-[#708C3E]">Agregar</span>.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {["Tractor", "Picadora", "Motobomba", "Bomba de agua"].map((equipo) => {
              const checked = equipos.includes(equipo)
              return (
                <label key={equipo} className={checkRow}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleEquipo(equipo)}
                    className={checkboxBase}
                  />
                  <span className="text-sm text-gray-700">{equipo}</span>
                </label>
              )
            })}
          </div>

          <div className="flex gap-2 mt-3 items-start">
            <Input
              value={otroEquipo}
              onChange={(e) => setOtroEquipo(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  agregarOtroEquipo()
                }
              }}
              placeholder="Otro equipo"
              className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
              maxLength={75}
            />

            <Button
              type="button"
              variant="outline"
              onClick={agregarOtroEquipo}
              className={`${btn.outlineGreen} h-9 px-4 text-sm`}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {equipos.length > 0 && (
            <div className="mt-3 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
              <p className="text-xs text-[#8B6C2E] font-medium mb-2">Equipos seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {equipos.map((equipo) => (
                  <span
                    key={equipo}
                    className="inline-flex items-center bg-white border border-[#F5E6C5] rounded-lg px-3 py-1 text-xs text-[#8B6C2E]"
                  >
                    {equipo}
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
