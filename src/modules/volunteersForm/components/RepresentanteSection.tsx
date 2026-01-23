import { useMemo, useRef, useState } from "react"
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { normalizeLookupToPersona } from "@/shared/utils/helpersForms"
import { validateRepresentanteCedula } from "../services/volunteerFormService"

export function RepresentanteSection({
  form,
  lookup,
  showErrors = false,
}: {
  form: any
  lookup?: (id: string) => Promise<any>
  showErrors?: boolean
}) {
  const personaSchema = useMemo(
    () => volunteerOrganizacionSchema.shape.organizacion.shape.representante.shape.persona,
    []
  )
  const representanteSchema = useMemo(
    () => volunteerOrganizacionSchema.shape.organizacion.shape.representante,
    []
  )

  const validatePersonaField =
    (key: keyof typeof personaSchema.shape) => (arg: any) => {
      const schema = (personaSchema.shape as any)[key]
      if (!schema) return undefined
      const value = arg && typeof arg === "object" && "value" in arg ? arg.value : arg
      const r = schema.safeParse(value)
      return r.success ? undefined : r.error.issues?.[0]?.message || "Campo inválido"
    }

  const validateCargo = (arg: any) => {
    const schema = (representanteSchema.shape as any).cargo
    const value = arg && typeof arg === "object" && "value" in arg ? arg.value : arg
    const r = schema.safeParse(value)
    return r.success ? undefined : r.error.issues?.[0]?.message || "Campo inválido"
  }

  // ✅ helpers calendario
  const parseISOToDate = (iso?: string) => {
    if (!iso) return undefined
    const [y, m, d] = iso.split("-").map(Number)
    if (!y || !m || !d) return undefined
    const dt = new Date(y, m - 1, d)
    dt.setHours(0, 0, 0, 0)
    return dt
  }

  const toISODate = (d: Date) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const maxBirthDateObj = useMemo(() => {
    const t = new Date()
    t.setFullYear(t.getFullYear() - 18)
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const disabledBirthDate = (date: Date) => {
    const dt = new Date(date)
    dt.setHours(0, 0, 0, 0)
    return dt > maxBirthDateObj
  }

  const toYear = maxBirthDateObj.getFullYear()
  const fromYear = 1950

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const [buscandoCedula, setBuscandoCedula] = useState(false)

  // ✅ NUEVO: estado de validación representante
  const [repValidation, setRepValidation] = useState<{ ok: boolean; message?: string } | null>(null)
  const repErrorMsg = repValidation && repValidation.ok === false ? repValidation.message : ""

  const debounceRef = useRef<number | null>(null)
  const lastLookupRef = useRef<string>("")

  const setIfDefined = (path: string, val: any) => {
    if (val === undefined || val === null) return
    const v = String(val).trim()
    if (!v) return
    form?.setFieldValue?.(path, v)
  }

  // ✅ NUEVO: valida contra /representantes/validate-cedula antes de hacer lookup/llenar
  const validateRepFirst = async (digits: string) => {
    try {
      const r = await validateRepresentanteCedula(digits)
      if (r?.ok === false) {
        setRepValidation({ ok: false, message: r.message || "Esta cédula ya está registrada como representante." })
        return false
      }
      setRepValidation({ ok: true })
      return true
    } catch {
      // Si falla la validación por red, no bloqueamos pero limpiamos mensaje
      setRepValidation(null)
      return true
    }
  }

  // ✅ lookup (DB->TSE), normaliza, y rellena (pero SOLO si pasa la validación)
  const lookupAndFill = async (cedulaRaw: string) => {
    const digits = String(cedulaRaw ?? "").replace(/\D/g, "")
    if (!digits || digits.length < 9) return
    if (!lookup) return

    // ✅ 1) validar
    const allowed = await validateRepFirst(digits)
    if (!allowed) return

    // ✅ 2) evitar duplicados
    if (lastLookupRef.current === digits) return
    lastLookupRef.current = digits

    setBuscandoCedula(true)
    try {
      const res = await lookup(digits)

      const p = normalizeLookupToPersona(res)
      if (!p) return

      // siempre nombres
      setIfDefined("organizacion.representante.persona.nombre", p.nombre)
      setIfDefined("organizacion.representante.persona.apellido1", p.apellido1)
      setIfDefined("organizacion.representante.persona.apellido2", p.apellido2)

      // si viene de DB: completa todo lo demás
      if (p.source === "DB") {
        setIfDefined("organizacion.representante.persona.telefono", p.telefono)
        setIfDefined("organizacion.representante.persona.email", p.email)
        setIfDefined("organizacion.representante.persona.fechaNacimiento", p.fechaNacimiento)
        setIfDefined("organizacion.representante.persona.direccion", p.direccion)
      }
    } finally {
      setBuscandoCedula(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          2
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Persona de Contacto (Representante)</h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Cédula */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula o Pasaporte*</label>

          <form.Field
            name="organizacion.representante.persona.cedula"
            validators={{ onSubmit: validatePersonaField("cedula") }}
          >
            {(field: any) => (
              <>
                <Input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={(e) => {
                    const raw = e.target.value
                    field.handleChange(raw)

                    const digits = raw.replace(/\D/g, "")

                    // reset visual si aún no llega a 9
                    if (digits.length < 9) {
                      setRepValidation(null)
                      lastLookupRef.current = ""
                      if (debounceRef.current) window.clearTimeout(debounceRef.current)
                      return
                    }

                    // debounce: valida + lookup
                    if (debounceRef.current) window.clearTimeout(debounceRef.current)
                    debounceRef.current = window.setTimeout(() => {
                      lookupAndFill(digits)
                    }, 350)
                  }}
                  onBlur={async (e) => {
                    const digits = e.target.value.trim().replace(/\D/g, "")
                    if (digits.length >= 9) {
                      if (debounceRef.current) window.clearTimeout(debounceRef.current)
                      await lookupAndFill(digits)
                    }
                  }}
                  placeholder="Número de cédula"
                  className={`${
                    repErrorMsg || (showErrors && field.state.meta.errors?.length > 0) ? inputError : inputBase
                  } pr-10 bg-white`}
                />

                {buscandoCedula && (
                  <div className="absolute right-3 top-[34px]">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12h4a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                    </svg>
                  </div>
                )}

                {/* ✅ Mensaje backend representante */}
                {!!repErrorMsg && (
                  <>
                    <p className="text-sm text-[#9c1414] mt-1">{repErrorMsg}</p>
                    <div className="mt-2 rounded-md border border-[#e6c3b4] bg-[#fff1f1] p-3">
                      <p className="text-sm text-[#8C3A33]">
                        No puedes continuar con esta cédula porque ya está asignada como representante.
                      </p>
                    </div>
                  </>
                )}

                {/* Errores del schema (si aplica) */}
                {!repErrorMsg && showErrors && field.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-[#9c1414] mt-1">{field.state.meta.errors[0]}</p>
                )}
              </>
            )}
          </form.Field>
        </div>

        {/* Nombre y Apellidos */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <form.Field
              name="organizacion.representante.persona.nombre"
              validators={{ onSubmit: validatePersonaField("nombre") }}
            >
              {(field: any) => (
                <Input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tu nombre"
                  className={`${inputBase} bg-[#ECECEC]`}
                />
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
            <form.Field
              name="organizacion.representante.persona.apellido1"
              validators={{ onSubmit: validatePersonaField("apellido1") }}
            >
              {(field: any) => (
                <Input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tu primer apellido"
                  className={`${inputBase} bg-[#ECECEC]`}
                />
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
            <form.Field
              name="organizacion.representante.persona.apellido2"
              validators={{ onSubmit: validatePersonaField("apellido2") }}
            >
              {(field: any) => (
                <Input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={60}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Tu segundo apellido"
                  className={`${inputBase} bg-[#ECECEC]`}
                />
              )}
            </form.Field>
          </div>
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo/Posición *</label>
          <form.Field name="organizacion.representante.cargo" validators={{ onSubmit: validateCargo }}>
            {(field: any) => (
              <Input
                type="text"
                value={field.state.value || ""}
                maxLength={100}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Ej: Director, Coordinador, Presidente, etc."
                className={`${inputBase} bg-white`}
              />
            )}
          </form.Field>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono del representante *</label>
          <form.Field
            name="organizacion.representante.persona.telefono"
            validators={{ onSubmit: validatePersonaField("telefono") }}
          >
            {(field: any) => (
              <Input
                type="tel"
                value={field.state.value || ""}
                maxLength={12}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Número de teléfono"
                className={`${inputBase} bg-white`}
              />
            )}
          </form.Field>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo del representante *</label>
          <form.Field
            name="organizacion.representante.persona.email"
            validators={{ onSubmit: validatePersonaField("email") }}
          >
            {(field: any) => (
              <Input
                type="email"
                value={field.state.value || ""}
                maxLength={60}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="correo@ejemplo.com"
                className={`${inputBase} bg-white`}
              />
            )}
          </form.Field>
        </div>

        {/* Información adicional */}
        <div className="bg-[#f7faf2] border border-[#DCD6C9] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#708C3E] mb-3">Información adicional *</h4>

          <div className="space-y-4">
            {/* Fecha de nacimiento */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Fecha de nacimiento</label>

              <form.Field
                name="organizacion.representante.persona.fechaNacimiento"
                validators={{ onSubmit: validatePersonaField("fechaNacimiento") }}
              >
                {(field: any) => {
                  const selectedDate = parseISOToDate(field.state.value || "")
                  const display = selectedDate
                    ? selectedDate.toLocaleDateString("es-CR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : ""

                  return (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-between shadow-sm hover:bg-[#E6EDC8]/40 border-[#DCD6C9]`}
                        >
                          <span className={field.state.value ? "text-[#4A4A4A]" : "text-gray-400"}>
                            {field.state.value ? display : "Seleccione una fecha"}
                          </span>
                          <CalendarIcon className="h-4 w-4 text-[#708C3E]" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-3 rounded-xl border border-[#DCD6C9] shadow-md">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(d) => {
                            if (!d) return
                            if (disabledBirthDate(d)) return
                            field.handleChange(toISODate(d))
                          }}
                          locale={es}
                          captionLayout="dropdown"
                          fromYear={fromYear}
                          toYear={toYear}
                          disabled={disabledBirthDate}
                          defaultMonth={selectedDate ?? maxBirthDateObj}
                          className="rounded-lg"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Debe ser mayor de <span className="font-medium text-[#6F8C1F]">18 años</span>.
                        </p>
                      </PopoverContent>
                    </Popover>
                  )
                }}
              </form.Field>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Dirección del representante</label>
              <form.Field name="organizacion.representante.persona.direccion">
                {(field: any) => (
                  <Textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={2}
                    maxLength={200}
                    placeholder="Dirección de residencia (opcional)"
                    className={`${inputBase} bg-white resize-none`}
                  />
                )}
              </form.Field>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
