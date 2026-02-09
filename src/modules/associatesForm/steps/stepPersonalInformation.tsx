import { useRef, useState } from "react"
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

interface Step1Props {
  form: FormLike
  lookup: (id: string) => Promise<any> // TSE
  onNext: () => void
  canProceed: boolean
}

export function Step1({ form, lookup, onNext }: Step1Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false)
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({})
  const [verificandoCedula, setVerificandoCedula] = useState(false)

  const debounceRef = useRef<number | null>(null)
  const lastLookupRef = useRef<string>("")

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const checkboxBase =
    "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  const values = (form as any).state?.values || {}

  // 👉 Estado local para la fecha (para re-render inmediato aunque el form no notifique)
  const [fechaNacimientoLocal, setFechaNacimientoLocal] = useState<string>(values.fechaNacimiento ?? "")

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

  const lookupCombined = async (id: string) => {
    const ced = (id ?? "").trim()
    if (!ced) return null

    const db = await lookupPersonaByCedulaForForms(ced)

    // Caso 1: PersonaFormLookupDto
    if (db?.found) {
      return {
        source: "DB",
        ...(db.legacy ?? {}),
        volunteerIndividual: db.volunteerIndividual,
        persona: db.persona,
      }
    }

    // Caso 2: por si devuelve entity directo
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

  const validarCedulaUnica = async (cedula: string): Promise<string | undefined> => {
    const v = (cedula ?? "").trim()
    if (!v || v.length < 8) return undefined

    setVerificandoCedula(true)
    try {
      const existe = await existsCedula(v)
      if (existe) return "Esta cédula ya está registrada en el sistema"
      return undefined
    } catch {
      // no bloquear por error de red
      return undefined
    } finally {
      setVerificandoCedula(false)
    }
  }

  // ===== Precheck + Autofill =====
  const precheckAndAutofill = async (digits: string) => {
    if (!digits || digits.length < 9) return
    if (lastLookupRef.current === digits) return
    lastLookupRef.current = digits

    setVerificandoCedula(true)
    try {
      await validateSolicitudAsociado(digits)

      // lookup (DB -> TSE)
      const r = await lookupCombined(digits)
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
          // 👇 también el estado local, para que se vea de inmediato
          setFechaNacimientoLocal(b)
        }
        if (vi.address != null) form.setFieldValue("direccion", String(vi.address))
      }

      // limpiar error cédula si todo ok
      setErroresValidacion((prev) => {
        const { cedula, ...rest } = prev
        return rest
      })
    } catch (err: any) {
      const status = err?.response?.status
      const payload = err?.response?.data

      if (status === 409) {
        const msg =
          payload?.message ||
          "Ya enviaste una solicitud y está en revisión. No puedes enviar otra con esta cédula."
        setErroresValidacion((prev) => ({ ...prev, cedula: msg }))
        return
      }

      setErroresValidacion((prev) => ({
        ...prev,
        cedula: "No se pudo validar la cédula. Intenta de nuevo.",
      }))
    } finally {
      setVerificandoCedula(false)
    }
  }

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
          <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Cédula */}
            <form.Field name="cedula" validators={{ onChange: ({ value }: any) => validateField("cedula", value) }}>
              {(f: any) => (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula o Pasaporte *</label>

                  <Input
                    name="cedula"
                    value={f.state.value}
                    onChange={(e) => {
                      const v = e.target.value
                      f.handleChange(v)

                      // limpiar error cédula
                      setErroresValidacion((prev) => {
                        const { cedula, ...rest } = prev
                        return rest
                      })

                      const digits = v.replace(/\D/g, "")
                      if (digits.length >= 9) {
                        if (debounceRef.current) window.clearTimeout(debounceRef.current)
                        debounceRef.current = window.setTimeout(() => precheckAndAutofill(digits), 350)
                      } else {
                        lastLookupRef.current = ""
                      }
                    }}
                    onBlur={async (e) => {
                      f.handleBlur()
                      const cedula = e.target.value.trim()
                      const digits = cedula.replace(/\D/g, "")

                      if (digits.length >= 9) {
                        if (debounceRef.current) window.clearTimeout(debounceRef.current)
                        await precheckAndAutofill(digits)
                      }

                      if (cedula.length >= 8) {
                        const errorUnicidad = await validarCedulaUnica(cedula)
                        if (errorUnicidad) setErroresValidacion((prev) => ({ ...prev, cedula: errorUnicidad }))
                      }
                    }}
                    placeholder="Número de cédula"
                    disabled={verificandoCedula}
                    className={`${erroresValidacion["cedula"] ? inputError : inputBase} pr-10 bg-white`}
                  />

                  {verificandoCedula && (
                    <div className="absolute right-3 top-[34px]">
                      <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" />
                      </svg>
                    </div>
                  )}

                  {(f.state.meta.errors?.length > 0 || erroresValidacion["cedula"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">{erroresValidacion["cedula"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Nombre */}
            <form.Field name="nombre" validators={{ onChange: ({ value }: any) => validateField("nombre", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <Input
                    name="nombre"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { nombre, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Tu nombre"
                    className={`${erroresValidacion["nombre"] ? inputError : inputBase} bg-[#ECECEC]`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["nombre"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">{erroresValidacion["nombre"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Apellidos */}
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="apellido1" validators={{ onChange: ({ value }: any) => validateField("apellido1", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                  <Input
                    name="apellido1"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { apellido1, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Tu primer apellido"
                    className={`${erroresValidacion["apellido1"] ? inputError : inputBase} bg-[#ECECEC]`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["apellido1"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {erroresValidacion["apellido1"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="apellido2" validators={{ onChange: ({ value }: any) => validateField("apellido2", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                  <Input
                    name="apellido2"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { apellido2, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Tu segundo apellido"
                    className={`${erroresValidacion["apellido2"] ? inputError : inputBase} bg-[#ECECEC]`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["apellido2"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {erroresValidacion["apellido2"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Fecha de nacimiento - FUERA DEL form.Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>

            <BirthDatePicker
              value={fechaNacimientoLocal}
              onChange={(iso) => {
                // Estado local para re-render inmediato
                setFechaNacimientoLocal(iso)
                // También persistimos en el form
                form.setFieldValue("fechaNacimiento", iso)

                if (intentoAvanzar) {
                  setErroresValidacion((prev) => {
                    const { fechaNacimiento, ...rest } = prev
                    return rest
                  })
                }
              }}
              minAge={18}
              placeholder="Seleccione una fecha"
              error={erroresValidacion["fechaNacimiento"]}
            />
          </div>
        </div>
      </div>

      {/* ================== Tarjeta 2: Información de Contacto ================== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Teléfono */}
            <form.Field name="telefono" validators={{ onChange: ({ value }: any) => validateField("telefono", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                  <Input
                    name="telefono"
                    value={f.state.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      f.handleChange(value)

                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { telefono, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Número de teléfono"
                    maxLength={12}
                    className={`${erroresValidacion["telefono"] ? inputError : inputBase} bg-white`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["telefono"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {erroresValidacion["telefono"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field name="email" validators={{ onChange: ({ value }: any) => validateField("email", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      setErroresValidacion((prev) => {
                        const { email, ...rest } = prev
                        return rest
                      })
                    }}
                    onBlur={f.handleBlur}
                    placeholder="correo@ejemplo.com"
                    className={`${erroresValidacion["email"] ? inputError : inputBase} bg-white`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["email"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">{erroresValidacion["email"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Dirección */}
          <form.Field name="direccion" validators={{ onChange: ({ value }: any) => validateField("direccion", value) }}>
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección Completa</label>
                <Input
                  name="direccion"
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  placeholder="Tu dirección completa"
                  className={`${f.state.meta.errors?.length > 0 ? inputError : inputBase} bg-white`}
                />
                {f.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-[#9c1414] mt-1">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* ================== Tarjeta 3: Información de la Finca y Ganado ================== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca y Ganado</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Vive en finca (Checkbox estilo tuyo) */}
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
                          setErroresValidacion((prev) => {
                            const { distanciaFinca, ...rest } = prev
                            return rest
                          })
                        }
                      }}
                      className={checkboxBase}
                    />
                    <span className="text-sm text-gray-700">¿Vive en la finca?</span>
                  </label>
                </div>
              )}
            </form.Field>

            {/* Distancia si NO vive en finca */}
            <form.Field name="viveEnFinca">
              {(v: any) => {
                const viveEnFinca = (v.state.value ?? true) as boolean
                if (viveEnFinca) return <div /> // mantiene grid parejo

                return (
                  <form.Field
                    name="distanciaFinca"
                    validators={{ onChange: ({ value }: any) => validateField("distanciaFinca", value) }}
                  >
                    {(f: any) => (
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                          Distancia de su residencia a la finca (km) *
                        </label>

                        <Input
                          name="distanciaFinca"
                          inputMode="decimal"
                          value={f.state.value}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d.]/g, "")
                            const parts = value.split(".")
                            const filtered = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : value

                            if (filtered === "" || filtered === "0" || parseFloat(filtered) === 0) {
                              f.handleChange("")
                              return
                            }

                            f.handleChange(filtered)

                            if (intentoAvanzar) {
                              setErroresValidacion((prev) => {
                                const { distanciaFinca, ...rest } = prev
                                return rest
                              })
                            }
                          }}
                          onBlur={f.handleBlur}
                          placeholder="Ej: 12.50"
                          className={`${erroresValidacion["distanciaFinca"] ? inputError : inputBase} bg-white`}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e" || (e.key === "0" && !f.state.value)) {
                              e.preventDefault()
                            }
                          }}
                        />

                        {(f.state.meta.errors?.length > 0 || erroresValidacion["distanciaFinca"]) && (
                          <p className="text-sm text-[#9c1414] mt-1">
                            {erroresValidacion["distanciaFinca"] || f.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                )
              }}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Marca de Ganado */}
            <form.Field name="marcaGanado" validators={{ onChange: ({ value }: any) => validateField("marcaGanado", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Marca de Ganado *</label>
                  <Input
                    name="marcaGanado"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { marcaGanado, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Ej: MG-2025"
                    className={`${erroresValidacion["marcaGanado"] ? inputError : inputBase} bg-white`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["marcaGanado"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {erroresValidacion["marcaGanado"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* CVO */}
            <form.Field name="CVO" validators={{ onChange: ({ value }: any) => validateField("CVO", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">CVO *</label>
                  <Input
                    name="CVO"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value)
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
                          const { CVO, ...rest } = prev
                          return rest
                        })
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Ej: CVO-123456"
                    className={`${erroresValidacion["CVO"] ? inputError : inputBase} bg-white`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["CVO"]) && (
                    <p className="text-sm text-[#9c1414] mt-1">
                      {erroresValidacion["CVO"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      {/* Núcleo familiar (se mantiene) */}
      <NucleoFamiliarSection form={form} />

      <NavigationButtons showPrev={false} onNext={handleNext} />
    </div>
  )
}