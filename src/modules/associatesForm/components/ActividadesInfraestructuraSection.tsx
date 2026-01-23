import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { actividadCultivoSchema } from "../schemas/associateApply"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"
import { Input } from "@/components/ui/input"

interface ActividadesInfraestructuraSectionProps {
  form: FormLike
  showErrors?: boolean
}

export function ActividadesInfraestructuraSection({ form }: ActividadesInfraestructuraSectionProps) {
  const existentes = (form as any).state?.values?.actividadesInfraestructura || {}

  const [actividades, setActividades] = useState<string[]>(existentes.cultivos || [])
  const [cultivo, setCultivo] = useState<string>("")
  const [cultivoError, setCultivoError] = useState<string | null>(null)

  const [apartos, setApartos] = useState<string>(existentes.apartos?.toString() || "0")
  const [comederos, setComederos] = useState<string>(existentes.comederos?.toString() || "0")
  const [bebederos, setBebederos] = useState<string>(existentes.bebederos?.toString() || "0")
  const [saleros, setSaleros] = useState<string>(existentes.saleros?.toString() || "0")

  useEffect(() => {
    ;(form as any).setFieldValue("actividadesInfraestructura", {
      cultivos: actividades,
      apartos: parseInt(apartos, 10) || 0,
      comederos: parseInt(comederos, 10) || 0,
      bebederos: parseInt(bebederos, 10) || 0,
      saleros: parseInt(saleros, 10) || 0,
    })
  }, [actividades, apartos, comederos, bebederos, saleros, form])

  const agregarActividad = () => {
    const trimmed = cultivo.trim()

    if (!trimmed) {
      setCultivoError("La actividad es requerida")
      return
    }

    const parsed = actividadCultivoSchema.safeParse(trimmed)
    if (!parsed.success) {
      setCultivoError(parsed.error.issues[0]?.message ?? "Actividad inválida")
      return
    }

    if (actividades.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setCultivoError("Esta actividad ya fue agregada")
      return
    }

    setActividades((prev) => [...prev, trimmed])
    setCultivo("")
    setCultivoError(null)
  }

  const eliminarActividad = (item: string) => {
    setActividades((prev) => prev.filter((a) => a !== item))
  }

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned === "") return setter("0")
    setter(String(parseInt(cleaned, 10)))
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          7
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Otras Actividades e Infraestructura de Producción *
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Actividades */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            ¿Qué cultivos o actividades tiene en su finca? *
          </label>

          {/* Callout */}
          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3 mb-3">
            <div className="flex items-start gap-3">
              <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
                i
              </span>
              <p className="text-sm text-[#4A4A4A]">
                Después de ingresar la actividad/cultivo, presiona{" "}
                <span className="font-semibold text-[#708C3E]">Agregar</span>. También puedes usar Enter.
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                value={cultivo}
                onChange={(e) => {
                  setCultivo(e.target.value)
                  if (cultivoError) setCultivoError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    agregarActividad()
                  }
                }}
                placeholder="Ej: Maíz, Huerta, Porcicultura..."
                maxLength={75}
                aria-invalid={!!cultivoError}
                className={[
                  "bg-white",
                  cultivoError
                    ? "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                    : "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0",
                ].join(" ")}
              />
              {cultivoError && <p className="mt-1 text-sm text-red-600">{cultivoError}</p>}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={agregarActividad}
              className={`${btn.outlineGreen} h-9 px-4 text-sm`}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {actividades.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actividades.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-white border border-[#DCD6C9] rounded-lg px-3 py-1.5"
                >
                  <span className="text-sm text-[#4A4A4A]">{item}</span>

                  <button
                    type="button"
                    onClick={() => eliminarActividad(item)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#B85C4C] hover:text-[#8C3A33] hover:bg-[#E6C3B4]/40 transition-colors"
                    aria-label={`Eliminar ${item}`}
                    title="Eliminar"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apartos */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Ingrese la cantidad de apartos en los que está dividida su finca *
          </label>

          <Input
            type="text"
            inputMode="numeric"
            value={apartos}
            onChange={(e) => handleNumericInput(e.target.value, setApartos)}
            onFocus={(e) => e.target.select()}
            className="bg-white w-full md:w-1/3 border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
          />
        </div>

        {/* Equipo */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipo de equipo para la producción posee? Escriba la cantidad *
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: "Comederos", value: comederos, set: setComederos },
              { label: "Bebederos", value: bebederos, set: setBebederos },
              { label: "Saleros", value: saleros, set: setSaleros },
            ].map((it) => (
              <div key={it.label}>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">{it.label}</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={it.value}
                  onChange={(e) => handleNumericInput(e.target.value, it.set)}
                  onFocus={(e) => e.target.select()}
                  className="bg-white border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
