import { useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { ZodError } from "zod"
import { associateApplySchema } from "../schemas/associateApply"
import { NavigationButtons } from "../components/NavigationButtons"
import { NucleoFamiliarSection } from "../components/FamilyNucleusSection"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, UserRound, MapPin } from "lucide-react"
import {
  existsCedula,
  lookupPersonaByCedulaForForms,
  validateSolicitudAsociado,
} from "../services/associatesFormService"
import { BirthDatePicker } from "@/components/ui/birthDatePicker"
import { useCedulaLookupController } from "@/shared/hooks/useCedulaLookupController"

interface Step1Props {
  form: FormLike
  lookup: (id: string) => Promise<any> // TSE
  onNext: () => void
  canProceed: boolean
}

export function Step1({ form, lookup, onNext }: Step1Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false)
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({})
  const [personaFromDB, setPersonaFromDB] = useState(false)

  const values = (form as any).state?.values || {}

  const [fechaNacimientoLocal, setFechaNacimientoLocal] = useState<string>(
    values.fechaNacimiento ?? ""
  )

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const disabledBase = "bg-[#ECECEC] opacity-70 cursor-not-allowed"

  const checkboxBase =
    "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const getErr = (name: string, fieldErr?: any) =>
    erroresValidacion[name] || (Array.isArray(fieldErr) && fieldErr.length ? String(fieldErr[0]) : "")

  const clearErr = (name: string) =>
    setErroresValidacion((prev) => {
      const { [name]: _, ...rest } = prev
      return rest
    })

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema.shape as any)[name]
      if (fieldSchema) fieldSchema.parse(value)
      return undefined
    } catch (error) {
      if (error instanceof ZodError) return error.issues[0]?.message || "Error de validación"
      return "Error de validación"
    }
  }

  // ===== lookup DB -> TSE (tu lógica) =====
  const lookupCombined = async (id: string) => {
    const ced = (id ?? "").trim()
    if (!ced) return null

    const db = await lookupPersonaByCedulaForForms(ced)

    if (db?.found) {
      return {
        source: "DB",
        ...(db.legacy ?? {}),
        volunteerIndividual: db.volunteerIndividual,
        persona: db.persona,
      }
    }

    if (db?.cedula && db?.nombre && db?.apellido1) {
      return {
        source: "DB",
        firstname: db.nombre ?? "",
        lastname1: db.apellido1 ?? "",
        lastname2: db.apellido2 ?? "",
        volunteerIndividual: {
          idNumber: db.cedula ?? "",
          name: db.nombre ?? "",
          lastName1: db.apellido1 ?? "",
          lastName2: db.apellido2 ?? "",
          phone: db.telefono ?? "",
          email: db.email ?? "",
          birthDate: db.fechaNacimiento ?? "",
          address: db.direccion ?? "",
        },
        persona: db,
      }
    }

    const tse = await lookup(ced)
    return tse ? { source: "TSE", ...tse } : null
  }

  // ===== Unicidad cédula (tu lógica) =====
  const validarCedulaUnica = async (cedula: string): Promise<string | undefined> => {
    const v = (cedula ?? "").trim()
    if (!v || v.length < 8) return undefined
    try {
      const existe = await existsCedula(v)
      if (existe) return "Esta cédula ya está registrada en el sistema"
      return undefined
    } catch {
      return undefined
    }
  }

  const resetPersona = () => {
    form.setFieldValue("nombre", "")
    form.setFieldValue("apellido1", "")
    form.setFieldValue("apellido2", "")
    form.setFieldValue("telefono", "")
    form.setFieldValue("email", "")
    form.setFieldValue("fechaNacimiento", "")
    form.setFieldValue("direccion", "")

    setFechaNacimientoLocal("")
    setPersonaFromDB(false)

    // limpiamos errores que dependen de la persona
    setErroresValidacion((prev) => {
      const { nombre, apellido1, apellido2, telefono, email, fechaNacimiento, direccion, ...rest } = prev
      return rest
    })
  }

  const fillFromLookup = (r: any) => {
    if (!r) return

    form.setFieldValue("nombre", r.firstname || "")
    form.setFieldValue("apellido1", r.lastname1 || "")
    form.setFieldValue("apellido2", r.lastname2 || "")

    if (r.source === "DB") {
      const vi = r.volunteerIndividual ?? {}

      if (vi.phone != null) form.setFieldValue("telefono", String(vi.phone))
      if (vi.email != null) form.setFieldValue("email", String(vi.email))

      if (vi.birthDate != null) {
        const b = String(vi.birthDate)
        form.setFieldValue("fechaNacimiento", b)
        setFechaNacimientoLocal(b)
      }

      if (vi.address != null) form.setFieldValue("direccion", String(vi.address))

      setPersonaFromDB(true)
    } else {
      setPersonaFromDB(false)
    }

    // limpiar error de cédula si ok
    clearErr("cedula")
  }

  const cedulaCtrl = useCedulaLookupController({
    minLen: 9,
    debounceMs: 350,
    lookup: async (digits: string) => lookupCombined(digits),
    isFromDB: (res: any) => res?.source === "DB",
    onReset: resetPersona,
    onFill: fillFromLookup,
    precheck: async (digits: string) => {
      // 1) precheck pendiente/409
      await validateSolicitudAsociado(digits)

      // 2) opcional: unicidad (si querés bloquear desde ya)
      const msg = await validarCedulaUnica(digits)
      if (msg) throw new Error(msg)
    },
  })

  const bloquearPorCedula = cedulaCtrl.loading || !!cedulaCtrl.error || !!erroresValidacion["cedula"]
  const bloquearCamposPersona = bloquearPorCedula // nombre/apellidos mientras valida
  const bloquearCamposDB = bloquearPorCedula || personaFromDB // contacto + fecha + dirección si viene DB

  const handleNext = async () => {
    setIntentoAvanzar(true)
    const valuesNow = (form as any).state?.values || {}
    const errores: Record<string, string> = {}

    const camposObligatorios = [
      { name: "cedula", label: "Cédula", minLength: 8 },
      { name: "nombre", label: "Nombre", minLength: 1 },
      { name: "apellido1", label: "Primer Apellido", minLength: 1 },
      { name: "apellido2", label: "Segundo Apellido", minLength: 1 },
      { name: "fechaNacimiento", label: "Fecha de Nacimiento" },
      { name: "telefono", label: "Teléfono", minLength: 8 },
      { name: "email", label: "Email" },
      { name: "marcaGanado", label: "Marca de Ganado", minLength: 1 },
      { name: "CVO", label: "CVO", minLength: 1 },
    ]

    for (const { name, label, minLength } of camposObligatorios) {
      const valor = valuesNow[name]

      if (!valor || (typeof valor === "string" && valor.trim().length === 0)) {
        errores[name] = `${label} es obligatorio`
      } else if (minLength && String(valor).length < minLength) {
        errores[name] = `${label} debe tener al menos ${minLength} caracteres`
      } else {
        const errorZod = validateField(name, valor)
        if (errorZod) errores[name] = errorZod
      }
    }

    // re-chequeo cedula
    if (valuesNow.cedula && !errores.cedula) {
      const errorCedula = await validarCedulaUnica(valuesNow.cedula)
      if (errorCedula) errores.cedula = errorCedula

      if (!errores.cedula) {
        const digits = String(valuesNow.cedula ?? "").replace(/\D/g, "")
        try {
          await validateSolicitudAsociado(digits)
        } catch (err: any) {
          const status = err?.response?.status
          const payload = err?.response?.data
          if (status === 409) {
            errores.cedula =
              payload?.message ||
              "Ya enviaste una solicitud y está en revisión. No puedes enviar otra con esta cédula."
          }
        }
      }
    }

    const viveEnFinca = valuesNow.viveEnFinca ?? true
    if (!viveEnFinca) {
      const distancia = valuesNow.distanciaFinca
      if (!distancia || distancia === "" || Number(distancia) <= 0) {
        errores["distanciaFinca"] = "La distancia debe ser mayor a 0"
      } else {
        const errorZod = validateField("distanciaFinca", distancia)
        if (errorZod) errores["distanciaFinca"] = errorZod
      }
    }

    setErroresValidacion(errores)

    if (Object.keys(errores).length > 0) {
      const primerCampoError = Object.keys(errores)[0]
      const elemento = document.querySelector(`[name="${primerCampoError}"]`)
      if (elemento) (elemento as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    onNext()
  }

  return (
    <div className="space-y-8">
      {/* ================== Tarjeta 1: Información Personal ================== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <UserRound className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
            <p className="text-xs text-gray-500">
              Todos los campos son obligatorios, a menos que indiquen <span className="font-medium">(Opcional)</span>.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cédula */}
            <form.Field name="cedula" validators={{ onChange: ({ value }: any) => validateField("cedula", value) }}>
              {(f: any) => {
                const err = getErr("cedula", f.state.meta.errors)
                return (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula/Número de Pasaporte
                    </label>

                    <Input
                      name="cedula"
                      value={f.state.value}
                      disabled={cedulaCtrl.loading}
                      onChange={(e) => {
                        const v = e.target.value
                        f.handleChange(v)
                        clearErr("cedula")
                        cedulaCtrl.onKeyChange(v)
                      }}
                      onBlur={async (e) => {
                        f.handleBlur()
                        await cedulaCtrl.onKeyBlur(e.target.value)

                        const cedula = e.target.value.trim()
                        if (cedula.length >= 8) {
                          const errorUnicidad = await validarCedulaUnica(cedula)
                          if (errorUnicidad) setErroresValidacion((prev) => ({ ...prev, cedula: errorUnicidad }))
                        }
                      }}
                      className={`${err ? inputError : inputBase} pr-10 bg-white`}
                    />

                    {cedulaCtrl.loading && (
                      <div className="absolute right-3 top-[34px]">
                        <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                        </svg>
                      </div>
                    )}

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Ejemplo: 504550789</p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            {/* Nombre */}
            <form.Field name="nombre" validators={{ onChange: ({ value }: any) => validateField("nombre", value) }}>
              {(f: any) => {
                const err = getErr("nombre", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre 
                    </label>

                    <Input
                      name="nombre"
                      value={f.state.value}
                      disabled={bloquearCamposPersona}
                      onChange={(e) => {
                        if (bloquearCamposPersona) return
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("nombre")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} ${bloquearCamposPersona ? disabledBase : "bg-[#ECECEC]"}`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Tu nombre</p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>

          {/* Apellidos */}
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="apellido1" validators={{ onChange: ({ value }: any) => validateField("apellido1", value) }}>
              {(f: any) => {
                const err = getErr("apellido1", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primer Apellido
                    </label>

                    <Input
                      name="apellido1"
                      value={f.state.value}
                      disabled={bloquearCamposPersona}
                      onChange={(e) => {
                        if (bloquearCamposPersona) return
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("apellido1")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} ${bloquearCamposPersona ? disabledBase : "bg-[#ECECEC]"}`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Tu primer apellido</p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            <form.Field name="apellido2" validators={{ onChange: ({ value }: any) => validateField("apellido2", value) }}>
              {(f: any) => {
                const err = getErr("apellido2", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Segundo Apellido 
                    </label>

                    <Input
                      name="apellido2"
                      value={f.state.value}
                      disabled={bloquearCamposPersona}
                      onChange={(e) => {
                        if (bloquearCamposPersona) return
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("apellido2")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} ${bloquearCamposPersona ? disabledBase : "bg-[#ECECEC]"}`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Tu segundo apellido</p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>

          {/* Fecha de nacimiento */}
          <div className={bloquearCamposDB ? "pointer-events-none opacity-70" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>

            <BirthDatePicker
              value={fechaNacimientoLocal}
              onChange={(iso) => {
                if (bloquearCamposDB) return
                setFechaNacimientoLocal(iso)
                form.setFieldValue("fechaNacimiento", iso)
                if (intentoAvanzar) clearErr("fechaNacimiento")
              }}
              minAge={18}
              placeholder="Seleccione una fecha"
              error={erroresValidacion["fechaNacimiento"]}
            />

            {erroresValidacion["fechaNacimiento"] ? null : personaFromDB ? (
              <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">Debe ser mayor a 18 años.</p>
            )}
          </div>
        </div>
      </div>

      {/* ================== Tarjeta 2: Información de Contacto ================== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
            <p className="text-xs text-gray-500">
              Todos los campos son obligatorios, a menos que indiquen <span className="font-medium">(Opcional)</span>.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <form.Field name="telefono" validators={{ onChange: ({ value }: any) => validateField("telefono", value) }}>
              {(f: any) => {
                const err = getErr("telefono", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Teléfono 
                    </label>

                    <Input
                      name="telefono"
                      value={f.state.value}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        const value = e.target.value.replace(/\D/g, "")
                        f.handleChange(value)
                        if (intentoAvanzar) clearErr("telefono")
                      }}
                      onBlur={f.handleBlur}
                      maxLength={12}
                      className={`${err ? inputError : inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Ejemplo: +506 2222-2222</p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            {/* Email */}
            <form.Field name="email" validators={{ onChange: ({ value }: any) => validateField("email", value) }}>
              {(f: any) => {
                const err = getErr("email", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Correo electrónico
                    </label>

                    <Input
                      name="email"
                      type="email"
                      value={f.state.value}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("email")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Ejemplo: contacto@dominio.email</p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>

          {/* Dirección */}
          <form.Field name="direccion" validators={{ onChange: ({ value }: any) => validateField("direccion", value) }}>
            {(f: any) => {
              const err = getErr("direccion", f.state.meta.errors)
              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Dirección completa <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
                  </label>

                  <Input
                    name="direccion"
                    value={f.state.value}
                    disabled={bloquearCamposDB}
                    onChange={(e) => {
                      if (bloquearCamposDB) return
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) clearErr("direccion")
                    }}
                    onBlur={f.handleBlur}
                    className={`${err ? inputError : inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                  />

                  {err ? (
                    <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                  ) : personaFromDB ? (
                    <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Provincia, cantón, distrito y señas.</p>
                  )}
                </div>
              )
            }}
          </form.Field>
        </div>
      </div>

      {/* ================== Tarjeta 3: Información de la Finca y Ganado ================== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca y Ganado</h3>
            <p className="text-xs text-gray-500">
              Todos los campos son obligatorios, a menos que indiquen <span className="font-medium">(Opcional)</span>.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Vive en finca */}
            <form.Field name="viveEnFinca">
              {(f: any) => (
                <div className="mt-1">
                  <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30">
                    <Checkbox
                      checked={f.state.value ?? true}
                      onCheckedChange={(checked) => {
                        const isChecked = !!checked
                        f.handleChange(isChecked)

                        if (isChecked && f.form?.setFieldValue) {
                          f.form.setFieldValue("distanciaFinca", "")
                          clearErr("distanciaFinca")
                        }
                      }}
                      className={checkboxBase}
                    />
                    <span className="text-sm text-gray-700">¿Vive en la finca?</span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Si no vive en la finca, indique la distancia aproximada.
                  </p>
                </div>
              )}
            </form.Field>

            {/* Distancia si NO vive en finca */}
            <form.Field name="viveEnFinca">
              {(v: any) => {
                const viveEnFinca = (v.state.value ?? true) as boolean
                if (viveEnFinca) return <div />

                return (
                  <form.Field
                    name="distanciaFinca"
                    validators={{ onChange: ({ value }: any) => validateField("distanciaFinca", value) }}
                  >
                    {(f: any) => {
                      const err = getErr("distanciaFinca", f.state.meta.errors)
                      return (
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                            Distancia entre la finca y su vivienda (en kilómetros)
                          </label>

                          <Input
                            name="distanciaFinca"
                            inputMode="decimal"
                            value={f.state.value}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^\d.]/g, "")
                              const parts = value.split(".")
                              const filtered =
                                parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : value

                              if (filtered === "" || filtered === "0" || parseFloat(filtered) === 0) {
                                f.handleChange("")
                                return
                              }

                              f.handleChange(filtered)
                              if (intentoAvanzar) clearErr("distanciaFinca")
                            }}
                            onBlur={f.handleBlur}
                            className={`${err ? inputError : inputBase} bg-white`}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e" || (e.key === "0" && !f.state.value)) {
                                e.preventDefault()
                              }
                            }}
                          />

                          {err ? (
                            <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">Ejemplo: 12.5</p>
                          )}
                        </div>
                      )
                    }}
                  </form.Field>
                )
              }}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Marca de Ganado */}
            <form.Field name="marcaGanado" validators={{ onChange: ({ value }: any) => validateField("marcaGanado", value) }}>
              {(f: any) => {
                const err = getErr("marcaGanado", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Marca de Ganado
                    </label>

                    <Input
                      name="marcaGanado"
                      value={f.state.value}
                      onChange={(e) => {
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("marcaGanado")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} bg-white`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Ingrese la marca registrada.</p>
                    )}
                  </div>
                )
              }}
            </form.Field>

            {/* CVO */}
            <form.Field name="CVO" validators={{ onChange: ({ value }: any) => validateField("CVO", value) }}>
              {(f: any) => {
                const err = getErr("CVO", f.state.meta.errors)
                return (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      CVO (Certificado Veterinario de Operación)
                    </label>

                    <Input
                      name="CVO"
                      value={f.state.value}
                      onChange={(e) => {
                        f.handleChange(e.target.value)
                        if (intentoAvanzar) clearErr("CVO")
                      }}
                      onBlur={f.handleBlur}
                      className={`${err ? inputError : inputBase} bg-white`}
                    />

                    {err ? (
                      <p className="text-sm text-[#9c1414] mt-1">{err}</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Código de la unidad productiva.</p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>
        </div>
      </div>

      {/* Núcleo familiar */}
      <NucleoFamiliarSection form={form} />

      <NavigationButtons showPrev={false} onNext={handleNext} />
    </div>
  )
}