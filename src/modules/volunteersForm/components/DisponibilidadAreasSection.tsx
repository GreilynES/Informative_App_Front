import { Calendar as CalendarIcon, Target, Heart } from "lucide-react"
import {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { z } from "zod"
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { es } from "date-fns/locale"


interface DisponibilidadAreasProps {
  form?: any
  formData?: any
  handleInputChange?: (field: string, value: any) => void
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION"
}

export type DisponibilidadAreasSectionHandle = {
  validateAndShowErrors: () => boolean
  isValid: () => boolean
  clearErrors: () => void
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function parseISODateToLocal(iso: string) {
  // iso: YYYY-MM-DD → Date local (00:00)
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return undefined
  const dt = new Date(y, m - 1, d)
  dt.setHours(0, 0, 0, 0)
  return dt
}

export const DisponibilidadAreasSection = forwardRef<
  DisponibilidadAreasSectionHandle,
  DisponibilidadAreasProps
>(function DisponibilidadAreasSection(
  { form, handleInputChange, tipoSolicitante }: DisponibilidadAreasProps,
  ref
) {
  // ── Estado original (sin cambios de intención)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([])
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<string[]>([])
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<string[]>([])
  const [razonSocial, setRazonSocial] = useState("")
  const [otraArea, setOtraArea] = useState("")

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const horarios = [
    { label: "Mañana (8:00 AM - 12:00 PM)", value: "mañana" },
    { label: "Tarde (1:00 PM - 4:30 PM)", value: "tarde" },
    { label: "Flexible", value: "flexible" },
  ]
  const areas = [
    "Eventos y actividades",
    "Educación ambiental",
    "Apoyo administrativo",
    "Comunicación y redes sociales",
    "Trabajo de campo/fincas",
    "Capacitación y talleres",
    "Mejora y mantenimiento de Infraestructura",
  ]

  // Hoy (YYYY-MM-DD)
  // const _today = useMemo(() => {
  //   const t = new Date()
  //   return toISODate(t)
  // }, [])

  const todayDate = useMemo(() => startOfDay(new Date()), [])

  // 📌 estado del calendario (rango)
  const [dateRange, _setDateRange] = useState<DateRange | undefined>(() => {
    const from = fechaInicio ? parseISODateToLocal(fechaInicio) : undefined
    const to = fechaFin ? parseISODateToLocal(fechaFin) : undefined
    if (!from && !to) return undefined
    return { from, to }
  })

  // Errores UI mostrados bajo los campos
  const [errors, setErrors] = useState<{
    fechaInicio?: string
    fechaFin?: string
    dias?: string
    horarios?: string
    areasInteres?: string
  }>({})

  const [showErrors, setShowErrors] = useState(false)

  const orgShape = volunteerOrganizacionSchema.shape.organizacion.shape

  const disponibilidadArraySchema =
    (orgShape.disponibilidades as z.ZodOptional<any>).unwrap?.() ?? orgShape.disponibilidades
  const disponibilidadItemSchema: z.ZodTypeAny = (disponibilidadArraySchema as z.ZodArray<any>).element

  const areasInteresArraySchema =
    (orgShape.areasInteres as z.ZodOptional<any>).unwrap?.() ?? orgShape.areasInteres

  // Helpers de validación → generan mensajes (sin mostrarlos todavía)
  const buildDisponibilidadPayload = () => ({
    fechaInicio,
    fechaFin,
    dias: diasSeleccionados,
    horarios: horariosSeleccionados,
  })

  const buildAreasPayload = () =>
    areasSeleccionadas
      .map((area) => ({ nombreArea: area === "Otro" ? otraArea : area }))
      .filter((a) => a.nombreArea)

  const getDisponibilidadErrors = (payload: {
    fechaInicio: string
    fechaFin: string
    dias: string[]
    horarios: string[]
  }) => {
    const res = disponibilidadItemSchema.safeParse(payload)
    const base = { fechaInicio: "", fechaFin: "", dias: "", horarios: "" }

    if (!res.success) {
      for (const issue of res.error.issues) {
        const key = (issue.path[0] as string) || ""
        if (key === "fechaInicio") base.fechaInicio = issue.message
        if (key === "fechaFin") base.fechaFin = issue.message
        if (key === "dias") base.dias = issue.message
        if (key === "horarios") base.horarios = issue.message
      }
    }
    return base
  }

  const getAreasErrors = (list: { nombreArea: string }[]) => {
    const res = (areasInteresArraySchema as z.ZodArray<any>).safeParse(list)
    return {
      areasInteres: res.success
        ? ""
        : res.error.issues[0]?.message || "Seleccione al menos un área de interés",
    }
  }

  const isEmptyErrors = (e: typeof errors) =>
    !e.fechaInicio && !e.fechaFin && !e.dias && !e.horarios && !e.areasInteres

  useImperativeHandle(ref, () => ({
    validateAndShowErrors: () => {
      const disp = buildDisponibilidadPayload()
      const areas = buildAreasPayload()
      const e1 = getDisponibilidadErrors(disp)
      const e2 = getAreasErrors(areas)
      const merged = { ...e1, ...e2 }
      setErrors(merged)
      setShowErrors(true)
      return isEmptyErrors(merged)
    },
    isValid: () => {
      const disp = buildDisponibilidadPayload()
      const areas = buildAreasPayload()
      const merged = { ...getDisponibilidadErrors(disp), ...getAreasErrors(areas) }
      return isEmptyErrors(merged)
    },
    clearErrors: () => {
      setShowErrors(false)
      setErrors({})
    },
  }))

  const formRef = useRef(form)
  const handleRef = useRef(handleInputChange)

  useEffect(() => {
    formRef.current = form
  }, [form])
  useEffect(() => {
    handleRef.current = handleInputChange
  }, [handleInputChange])

  // ✅ sincroniza dateRange -> fechaInicio/fechaFin (string)
  useEffect(() => {
    const from = dateRange?.from ? startOfDay(dateRange.from) : undefined
    const to = dateRange?.to ? startOfDay(dateRange.to) : undefined

    // Si solo elige "from", guardamos inicio y vaciamos fin (igual que antes: fin depende de selección)
    setFechaInicio(from ? toISODate(from) : "")
    setFechaFin(to ? toISODate(to) : "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.from, dateRange?.to])

  useEffect(() => {
    const disponibilidad = buildDisponibilidadPayload()
    const areasPayload = buildAreasPayload()

    if (tipoSolicitante === "ORGANIZACION" && formRef.current) {
      formRef.current.setFieldValue("organizacion.disponibilidades", [disponibilidad])
      formRef.current.setFieldValue("organizacion.areasInteres", areasPayload)
      if (razonSocial.trim()) {
        formRef.current.setFieldValue("organizacion.razonesSociales", [{ razonSocial }])
      }
    } else if (tipoSolicitante === "INDIVIDUAL" && handleRef.current) {
      handleRef.current("disponibilidades", [disponibilidad])
      handleRef.current("areasInteres", areasPayload)
    }

    if (showErrors) {
      const e1 = getDisponibilidadErrors(disponibilidad)
      const e2 = getAreasErrors(areasPayload)
      setErrors((prev) => {
        const next = { ...e1, ...e2 }
        const same =
          prev.fechaInicio === next.fechaInicio &&
          prev.fechaFin === next.fechaFin &&
          prev.dias === next.dias &&
          prev.horarios === next.horarios &&
          prev.areasInteres === next.areasInteres
        return same ? prev : next
      })
    }
  }, [
    fechaInicio,
    fechaFin,
    diasSeleccionados,
    horariosSeleccionados,
    areasSeleccionadas,
    otraArea,
    razonSocial,
    tipoSolicitante,
    showErrors,
  ])

  // Handlers originales
  const handleDiaChange = (dia: string) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    )
  }

  const handleHorarioChange = (horario: string) => {
    setHorariosSeleccionados((prev) =>
      prev.includes(horario) ? prev.filter((h) => h !== horario) : [...prev, horario]
    )
  }

  const handleAreaChange = (area: string) => {
    setAreasSeleccionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }


const today = toISODate(todayDate)

const parseISOToDate = (iso: string) => {
  // iso: YYYY-MM-DD -> Date local
  const [y, m, d] = iso.split("-").map(Number)
  if (!y || !m || !d) return undefined
  const dt = new Date(y, m - 1, d)
  dt.setHours(0, 0, 0, 0)
  return dt
}

// Mantiene tu regla: fin >= hoy y fin >= inicio
const minFechaFin = fechaInicio && fechaInicio > today ? fechaInicio : today
const minFechaFinDate = parseISOToDate(minFechaFin) || new Date()

const fechaInicioDate = fechaInicio ? parseISOToDate(fechaInicio) : undefined
const fechaFinDate = fechaFin ? parseISOToDate(fechaFin) : undefined

const disabledInicio = (date: Date) => {
  const dt = new Date(date)
  dt.setHours(0, 0, 0, 0)
  const min = parseISOToDate(today) || new Date()
  min.setHours(0, 0, 0, 0)
  return dt < min
}

const disabledFin = (date: Date) => {
  const dt = new Date(date)
  dt.setHours(0, 0, 0, 0)
  const min = new Date(minFechaFinDate)
  min.setHours(0, 0, 0, 0)
  return dt < min
}
  return (
    <div className="space-y-6">
      {/* ========== DISPONIBILIDAD ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Disponibilidad</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Calendario rango */}
          <div className="grid md:grid-cols-2 gap-4">
  {/* Fecha inicio */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Periodo de disponibilidad de inicio *
    </label>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full justify-between border shadow-sm hover:bg-[#E6EDC8]/40 ${
            showErrors && errors.fechaInicio ? "border-red-500" : "border-[#DCD6C9]"
          }`}
        >
          <span className={fechaInicio ? "text-[#4A4A4A]" : "text-gray-400"}>
            {fechaInicio || "Seleccione una fecha"}
          </span>
          <CalendarIcon className="h-4 w-4 text-[#708C3E]" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 rounded-xl border border-[#DCD6C9] shadow-md">
        <Calendar
  mode="single"
  selected={fechaInicioDate}
  locale={es} // ✅ Español
  onSelect={(d) => {
    if (!d) return
    const next = toISODate(d)
    setFechaInicio(next)

    // si ya había fin y quedó inválido, lo limpiamos
    if (fechaFin && fechaFin < (next > today ? next : today)) {
      setFechaFin("")
    }
  }}
  disabled={disabledInicio}
  className="rounded-lg"
  classNames={{
    caption: "flex justify-center pt-1 relative items-center text-[#708C3E] font-semibold",
    head_cell: "text-[#708C3E] w-9 font-semibold text-[0.8rem]",
    day_selected:
      "bg-[#708C3E] text-white hover:bg-[#5d7334] hover:text-white focus:bg-[#708C3E] focus:text-white",
    day_today: "border border-[#A3853D]",
    day_range_middle: "bg-[#E6EDC8] text-[#4A4A4A]",
  }}
/>

      </PopoverContent>
    </Popover>

    {showErrors && errors.fechaInicio && (
      <p className="text-sm text-red-600 mt-1">{errors.fechaInicio}</p>
    )}
  </div>

  {/* Fecha fin */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Periodo de disponibilidad fin *
    </label>

    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`w-full justify-between border shadow-sm hover:bg-[#E6EDC8]/40 ${
            showErrors && errors.fechaFin ? "border-red-500" : "border-[#DCD6C9]"
          }`}
        >
          <span className={fechaFin ? "text-[#4A4A4A]" : "text-gray-400"}>
            {fechaFin || "Seleccione una fecha"}
          </span>
          <CalendarIcon className="h-4 w-4 text-[#708C3E]" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 rounded-xl border border-[#DCD6C9] shadow-md">
        <Calendar
  mode="single"
  selected={fechaFinDate}
  locale={es} // ✅ Español
  onSelect={(d) => {
    if (!d) return
    setFechaFin(toISODate(d))
  }}
  disabled={disabledFin}
  className="rounded-lg"
  classNames={{
    caption: "flex justify-center pt-1 relative items-center text-[#708C3E] font-semibold",
    head_cell: "text-[#708C3E] w-9 font-semibold text-[0.8rem]",
    day_selected:
      "bg-[#708C3E] text-white hover:bg-[#5d7334] hover:text-white focus:bg-[#708C3E] focus:text-white",
    day_today: "border border-[#A3853D]",
    day_range_middle: "bg-[#E6EDC8] text-[#4A4A4A]",
  }}
/>

        <p className="mt-2 text-xs text-gray-500">
          Mínimo: <span className="font-medium text-[#708C3E]">{minFechaFin}</span>
        </p>
      </PopoverContent>
    </Popover>

    {showErrors && errors.fechaFin && (
      <p className="text-sm text-red-600 mt-1">{errors.fechaFin}</p>
    )}
  </div>
</div>

          {/* Días disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días disponibles <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dias.map((dia) => (
                <label key={dia} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                    className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-gray-700">{dia}</span>
                </label>
              ))}
            </div>
            {showErrors && errors.dias && <p className="text-sm text-red-600 mt-1">{errors.dias}</p>}
          </div>

          {/* Horario preferido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario preferido <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="space-y-2">
              {horarios.map((horario) => (
                <label key={horario.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={horariosSeleccionados.includes(horario.value)}
                    onChange={() => handleHorarioChange(horario.value)}
                    className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-gray-700">{horario.label}</span>
                </label>
              ))}
            </div>
            {showErrors && errors.horarios && (
              <p className="text-sm text-red-600 mt-1">{errors.horarios}</p>
            )}
          </div>
        </div>
      </div>

      {/* ========== ÁREAS DE INTERÉS ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Áreas de interés</h3>
          <span className="text-sm text-gray-500">(checkboxes múltiples, requerido al menos 1)</span>
        </div>

        <div className="p-6 space-y-3">
          {areas.map((area) => (
            <label key={area} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={areasSeleccionadas.includes(area)}
                onChange={() => handleAreaChange(area)}
                className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
              />
              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={areasSeleccionadas.includes("Otro")}
              onChange={() => handleAreaChange("Otro")}
              className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
            />
            <span className="text-sm text-gray-700">Otro (especificar)</span>
          </label>

          {areasSeleccionadas.includes("Otro") && (
            <div className="ml-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Si seleccionó "Otro", especifique{" "}
                <span className="text-gray-500 text-xs">(text, condicional)</span>
              </label>
              <input
                type="text"
                value={otraArea}
                onChange={(e) => setOtraArea(e.target.value)}
                placeholder="Especifique el área de interés"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          )}

          {showErrors && errors.areasInteres && (
            <p className="text-sm text-red-600 mt-1">{errors.areasInteres}</p>
          )}
        </div>
      </div>

      {/* ========== RAZÓN SOCIAL (Solo para Organización) ========== */}
      {tipoSolicitante === "ORGANIZACION" && (
        <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Razón Social / Objetivos</h3>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describa los objetivos o razón social de su organización *
            </label>
            <textarea
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              rows={4}
              placeholder="Ej: Promover la conservación del medio ambiente mediante educación y participación comunitaria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
          </div>
        </div>
      )}
    </div>
  )
})
