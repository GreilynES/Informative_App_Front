import { useMemo, useRef, useState } from "react"
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { normalizeLookupToPersona } from "@/shared/utils/helpersForms"
import { validateRepresentanteCedula } from "../services/volunteerFormService"
import { BirthDatePicker } from "@/components/ui/birthDatePicker"

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

  // ✅ Validadores comunes (onChange + onBlur + onSubmit)
  const commonPersonaValidators = (key: keyof typeof personaSchema.shape) => ({
    onChange: validatePersonaField(key),
    onBlur: validatePersonaField(key),
    onSubmit: validatePersonaField(key),
  })
  const cargoValidators = {
    onChange: validateCargo,
    onBlur: validateCargo,
    onSubmit: validateCargo,
  }

  // ✅ Helpers UI de errores
  const shouldShowFieldError = (field: any) =>
    showErrors && Array.isArray(field.state.meta.errors) && field.state.meta.errors.length > 0

  const fieldErrorMsg = (field: any) => {
    const e = field?.state?.meta?.errors?.[0]
    return e ? String(e) : ""
  }

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const [buscandoCedula, setBuscandoCedula] = useState(false)
  const [tocoNombres, setTocoNombres] = useState(false)

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

  // ✅ bloquea Nombre/Apellidos mientras busca o si la cédula es inválida (ya asignada)
  const bloquearNombreApellidos = buscandoCedula || !!repErrorMsg

  // ✅ valida contra /representantes/validate-cedula antes de hacer lookup/llenar
  const validateRepFirst = async (digits: string) => {
    try {
      const r = await validateRepresentanteCedula(digits)
      if (r?.ok === false) {
        setRepValidation({
          ok: false,
          message: r.message || "Esta cédula ya está registrada como representante.",
        })
        return false
      }
      setRepValidation({ ok: true })
      return true
    } catch {
      // si falla por red, no bloqueamos (y limpiamos)
      setRepValidation(null)
      return true
    }
  }

  // ✅ lookup (DB->TSE), normaliza, y rellena (pero SOLO si pasa la validación)
  const lookupAndFill = async (cedulaRaw: string) => {
    const digits = String(cedulaRaw ?? "").replace(/\D/g, "")
    if (!digits || digits.length < 9) return
    if (!lookup) return

    const allowed = await validateRepFirst(digits)
    if (!allowed) return

    if (lastLookupRef.current === digits) return
    lastLookupRef.current = digits

    setBuscandoCedula(true)
    try {
      const res = await lookup(digits)

      const p = normalizeLookupToPersona(res)
      if (!p) return

      // ✅ solo setear nombre/apellidos si el usuario NO los ha tocado
      if (!tocoNombres) {
        setIfDefined("organizacion.representante.persona.nombre", p.nombre)
        setIfDefined("organizacion.representante.persona.apellido1", p.apellido1)
        setIfDefined("organizacion.representante.persona.apellido2", p.apellido2)
      }

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Cédula/Número de pasaporte</label>

          <form.Field
            name="organizacion.representante.persona.cedula"
            validators={commonPersonaValidators("cedula")}
          >
            {(field: any) => {
              const hasErr = !!repErrorMsg || shouldShowFieldError(field)
              return (
                <>
                  <Input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={50}
                    onChange={(e) => {
                      const raw = e.target.value
                      field.handleChange(raw)
                      setTocoNombres(false)

                      const digits = raw.replace(/\D/g, "")

                      if (digits.length < 9) {
                        setRepValidation(null)
                        lastLookupRef.current = ""
                        if (debounceRef.current) window.clearTimeout(debounceRef.current)
                        return
                      }

                      if (debounceRef.current) window.clearTimeout(debounceRef.current)
                      debounceRef.current = window.setTimeout(() => {
                        lookupAndFill(digits)
                      }, 350)
                    }}
                    onBlur={async (e) => {
                      field.handleBlur?.()
                      const digits = e.target.value.trim().replace(/\D/g, "")
                      if (digits.length >= 9) {
                        if (debounceRef.current) window.clearTimeout(debounceRef.current)
                        await lookupAndFill(digits)
                      }
                    }}
                    className={`${hasErr ? inputError : inputBase} pr-10 bg-white`}
                  />

                  {buscandoCedula && (
                    <div className="absolute right-3 top-[34px]">
                      <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12h4a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                        />
                      </svg>
                    </div>
                  )}

                  {!!repErrorMsg && <p className="text-sm text-[#9c1414] mt-1">{repErrorMsg}</p>}

                  {!repErrorMsg && shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}

                  <p className="mt-1 text-xs text-gray-500">Ejemplo: 504550789</p>
                </>
              )
            }}
          </form.Field>
        </div>

        {/* Nombre y Apellidos */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <form.Field
              name="organizacion.representante.persona.nombre"
              validators={commonPersonaValidators("nombre")}
            >
              {(field: any) => (
                <>
                  <Input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={50}
                    disabled={bloquearNombreApellidos}
                    onChange={(e) => {
                      setTocoNombres(true)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    className={`${
                      shouldShowFieldError(field) ? inputError : inputBase
                    } ${bloquearNombreApellidos ? "bg-[#ECECEC] opacity-70 cursor-not-allowed" : "bg-white"}`}
                  />
                  {shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Tu nombre</p>
                </>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido</label>
            <form.Field
              name="organizacion.representante.persona.apellido1"
              validators={commonPersonaValidators("apellido1")}
            >
              {(field: any) => (
                <>
                  <Input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={40}
                    disabled={bloquearNombreApellidos}
                    onChange={(e) => {
                      setTocoNombres(true)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    className={`${
                      shouldShowFieldError(field) ? inputError : inputBase
                    } ${bloquearNombreApellidos ? "bg-[#ECECEC] opacity-70 cursor-not-allowed" : "bg-white"}`}
                  />
                  {shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Tu primer apellido</p>
                </>
              )}
            </form.Field>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido</label>
            <form.Field
              name="organizacion.representante.persona.apellido2"
              validators={commonPersonaValidators("apellido2")}
            >
              {(field: any) => (
                <>
                  <Input
                    type="text"
                    value={field.state.value || ""}
                    maxLength={40}
                    disabled={bloquearNombreApellidos}
                    onChange={(e) => {
                      setTocoNombres(true)
                      field.handleChange(e.target.value)
                    }}
                    onBlur={field.handleBlur}
                    className={`${
                      shouldShowFieldError(field) ? inputError : inputBase
                    } ${bloquearNombreApellidos ? "bg-[#ECECEC] opacity-70 cursor-not-allowed" : "bg-white"}`}
                  />
                  {shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Tu segundo apellido</p>
                </>
              )}
            </form.Field>
          </div>
        </div>

        {/* Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo/Posición dentro de la organización</label>
          <form.Field name="organizacion.representante.cargo" validators={cargoValidators}>
            {(field: any) => (
              <>
                <Input
                  type="text"
                  value={field.state.value || ""}
                  maxLength={100}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`${shouldShowFieldError(field) ? inputError : inputBase} bg-white`}
                />
                {shouldShowFieldError(field) && (
                  <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Ejemplo: Director, Coordinador, Presidente, etc.</p>
              </>
            )}
          </form.Field>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono del representante</label>
          <form.Field
            name="organizacion.representante.persona.telefono"
            validators={commonPersonaValidators("telefono")}
          >
            {(field: any) => (
              <>
                <Input
                  type="tel"
                  value={field.state.value || ""}
                  maxLength={20}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`${shouldShowFieldError(field) ? inputError : inputBase} bg-white`}
                />
                {shouldShowFieldError(field) && (
                  <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Ejemplo: +506 2222-2222</p>
              </>
            )}
          </form.Field>
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo del representante</label>
          <form.Field
            name="organizacion.representante.persona.email"
            validators={commonPersonaValidators("email")}
          >
            {(field: any) => (
              <>
                <Input
                  type="email"
                  value={field.state.value || ""}
                  maxLength={80}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className={`${shouldShowFieldError(field) ? inputError : inputBase} bg-white`}
                />
                {shouldShowFieldError(field) && (
                  <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Ejemplo: contacto@dominio.email</p>
              </>
            )}
          </form.Field>
        </div>

        {/* Información adicional */}
        <div className="space-y-4">
          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>

            <form.Field
              name="organizacion.representante.persona.fechaNacimiento"
              validators={commonPersonaValidators("fechaNacimiento")}
            >
              {(field: any) => (
                <>
                  <BirthDatePicker
                    value={field.state.value || ""}
                    onChange={(iso) => field.handleChange(iso)}
                    minAge={18}
                    placeholder="Seleccione una fecha"
                    error={showErrors ? field.state.meta.errors?.[0] : undefined}
                    className=""
                  />
                  {shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Debe ser mayor a 16 años.</p>
                </>
              )}
            </form.Field>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección del representante (opcional)
            </label>
            <form.Field
              name="organizacion.representante.persona.direccion"
              validators={commonPersonaValidators("direccion")}
            >
              {(field: any) => (
                <>
                  <Textarea
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={2}
                    maxLength={255}
                    className={`${shouldShowFieldError(field) ? inputError : inputBase} bg-white resize-none`}
                  />
                  {shouldShowFieldError(field) && (
                    <p className="text-sm text-[#9c1414] mt-1">{fieldErrorMsg(field)}</p>
                  )}
                  <p className="text-xs text-gray-500">Ejemplo: Provincia, Cantón, Distrito. Señas extra.</p>
                </>
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </div>
  )
}
