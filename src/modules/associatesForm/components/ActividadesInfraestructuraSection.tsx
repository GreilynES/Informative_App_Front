import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { actividadCultivoSchema } from "../schemas/associateApply"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

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

    if (actividades.includes(trimmed)) {
      setCultivoError("Esta actividad ya fue agregada")
      return
    }

    setActividades([...actividades, trimmed])
    setCultivo("")
    setCultivoError(null)
  }

  const eliminarActividad = (item: string) => {
    setActividades(actividades.filter((a) => a !== item))
  }

  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned === "") {
      setter("0")
      return
    }
    const parsed = parseInt(cleaned, 10)
    setter(parsed.toString())
  }

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          7
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Otras Actividades e Infraestructura de Producción *
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            ¿Qué cultivos o actividades tiene en su finca? *
          </label>

          <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
            <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Después de ingresar la actividad o cultivo y presiona{" "}
              <span className="font-semibold text-[#708C3E]">Agregar</span> para registrarlo.
              También puedes usar la tecla Enter.
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
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
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
                  cultivoError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]",
                ].join(" ")}
              />
              {cultivoError && <p className="mt-1 text-sm text-red-600">{cultivoError}</p>}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={agregarActividad}
              className={btn.outlineGreen}
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>

          {actividades.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actividades.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-white border border-[#CFCFCF] rounded-full px-3 py-1"
                >
                  <span className="text-sm text-[#4A4A4A]">{item}</span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => eliminarActividad(item)}
                    className="text-[#B85C4C] hover:text-[#8C3A33] hover:bg-[#E6C3B4]/40"
                    aria-label={`Eliminar ${item}`}
                    title="Eliminar"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            Ingrese la cantidad de apartos en los que está dividido su finca *
          </label>

          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={apartos}
            onChange={(e) => handleNumericInput(e.target.value, setApartos)}
            onFocus={(e) => e.target.select()}
            className="w-full md:w-1/3 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipo de equipo para la producción posee? Escriba la cantidad *
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Comederos</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={comederos}
                onChange={(e) => handleNumericInput(e.target.value, setComederos)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Bebederos</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={bebederos}
                onChange={(e) => handleNumericInput(e.target.value, setBebederos)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Saleros</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={saleros}
                onChange={(e) => handleNumericInput(e.target.value, setSaleros)}
                onFocus={(e) => e.target.select()}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
