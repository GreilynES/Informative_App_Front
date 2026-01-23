import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"
import { Input } from "@/components/ui/input"

interface InfraestructuraSectionProps {
  form: FormLike
  showErrors?: boolean
}

const checkboxBase =
  "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"
const checkRow =
  "flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30"

export function InfraestructuraSection({ form }: InfraestructuraSectionProps) {
  const existentes = (form as any).state?.values?.infraestructuraDisponible || {}

  const [infraestructuras, setInfraestructuras] = useState<string[]>(existentes.infraestructuras || [])
  const [corrienteElectrica, setCorrienteElectrica] = useState({
    publica: existentes.corrienteElectrica?.publica || false,
    privada: existentes.corrienteElectrica?.privada || false,
  })
  const [otraInfraestructura, setOtraInfraestructura] = useState<string>("")

  useEffect(() => {
    ;(form as any).setFieldValue("infraestructuraDisponible", {
      infraestructuras,
      corrienteElectrica,
    })
  }, [infraestructuras, corrienteElectrica, form])

  const toggleInfraestructura = (infra: string) => {
    setInfraestructuras((prev) => (prev.includes(infra) ? prev.filter((i) => i !== infra) : [...prev, infra]))
  }

  const agregarOtraInfraestructura = () => {
    const trimmed = otraInfraestructura.trim()
    if (!trimmed) return

    if (trimmed.length > 75) return alert("El texto es muy largo (máx. 75 caracteres).")
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmed)) return alert("Solo se permiten letras y espacios")

    const exists = infraestructuras.some((i) => i.toLowerCase() === trimmed.toLowerCase())
    if (exists) return alert("Esta infraestructura ya fue agregada")

    setInfraestructuras((prev) => [...prev, trimmed])
    setOtraInfraestructura("")
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Infraestructura Disponible</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Infraestructura */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Infraestructura disponible en la finca:
          </label>

          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">
                Marca todas las infraestructuras que aplican. Para otra, escríbela y presiona{" "}
                <span className="font-semibold text-[#708C3E]">Agregar</span>.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            {[
              "Corral de manejo",
              "Bodega",
              "Sala de ordeño",
              "Reservorio de agua",
              "Biodigestor",
              "Sistema de tratamiento de aguas",
            ].map((infra) => {
              const checked = infraestructuras.includes(infra)
              return (
                <label key={infra} className={checkRow}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleInfraestructura(infra)}
                    className={checkboxBase}
                  />
                  <span className="text-sm text-gray-700">{infra}</span>
                </label>
              )
            })}
          </div>

          <div className="flex gap-2 mt-3 items-start">
            <Input
              value={otraInfraestructura}
              onChange={(e) => setOtraInfraestructura(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  agregarOtraInfraestructura()
                }
              }}
              placeholder="Otra infraestructura"
              className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
              maxLength={75}
            />

            <Button
              type="button"
              variant="outline"
              onClick={agregarOtraInfraestructura}
              className={`${btn.outlineGreen} h-9 px-4 text-sm`}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {infraestructuras.length > 0 && (
            <div className="mt-3 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
              <p className="text-xs text-[#8B6C2E] font-medium mb-2">Infraestructura seleccionada:</p>
              <div className="flex flex-wrap gap-2">
                {infraestructuras.map((infra) => (
                  <span
                    key={infra}
                    className="inline-flex items-center bg-white border border-[#F5E6C5] rounded-lg px-3 py-1 text-xs text-[#8B6C2E]"
                  >
                    {infra}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Corriente eléctrica */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">Corriente eléctrica:</label>

          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">Marca una o más opciones si aplican.</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className={checkRow}>
              <Checkbox
                checked={corrienteElectrica.publica}
                onCheckedChange={(v) => setCorrienteElectrica((p) => ({ ...p, publica: !!v }))}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Pública</span>
            </label>

            <label className={checkRow}>
              <Checkbox
                checked={corrienteElectrica.privada}
                onCheckedChange={(v) => setCorrienteElectrica((p) => ({ ...p, privada: !!v }))}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Privada</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
