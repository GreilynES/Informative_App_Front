import type { VolunteersFormData } from "../../../volunteersInformation/models/VolunteersType"
import { UserRound, Mail } from "lucide-react"
import { NavigationButtons } from "../../components/NavigationButtons"
import { useRef, useState } from "react"
import { volunteerOrganizacionSchema } from "../../schemas/volunteerSchema"
import { existsEmail, validateSolicitudVoluntariado } from "../../services/volunteerFormService"
import { Input } from "@/components/ui/input"
import {  stopLoadingWithError } from "@/modules/utils/alerts"
import { BirthDatePicker } from "@/components/ui/birthDatePicker"

interface StepPersonalInformationProps {
  formData: VolunteersFormData
  handleInputChange: (field: keyof VolunteersFormData, value: string | boolean) => void
  onNextCombined: () => void
  isStepValid: () => boolean
  lookup: (id: string) => Promise<any>
}

export function StepPersonalInformation({
  formData,
  handleInputChange,
  onNextCombined,
  isStepValid,
  lookup,
}: StepPersonalInformationProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [limitReached, setLimitReached] = useState<Record<string, boolean>>({})
  const [verificandoCedula, setVerificandoCedula] = useState(false)
  const [verificandoEmail, setVerificandoEmail] = useState(false)

  const personaSchema = volunteerOrganizacionSchema.shape.organizacion.shape.representante.shape.persona
  const [personaFromDB, setPersonaFromDB] = useState(false)
  const debounceRef = useRef<number | null>(null)
  const lastCheckedCedulaRef = useRef<string>("")

  const updateLimitFlag = (field: keyof VolunteersFormData, value: string, maxLen?: number) => {
    if (!maxLen) return
    setLimitReached((prev) => ({
      ...prev,
      [field as string]: value.length >= maxLen,
    }))
  }

  const validateField = (field: keyof VolunteersFormData, value: any) => {
    const mapped = mapFormToPersona({ ...formData, [field]: value })
    const single = personaSchema.pick({ [mapField(field)]: true } as any)
    const key = mapField(field)
    const result = single.safeParse({ [key]: (mapped as Record<string, any>)[key] })
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? "" : result.error.issues[0]?.message || "",
    }))
  }

  const validateAll = () => {
    const persona = mapFormToPersona(formData)
    const result = personaSchema.safeParse(persona)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = reverseMapField(issue.path[0] as string)
        if (field) newErrors[field] = issue.message
      })
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  const validarEmailUnico = async (email: string): Promise<string | undefined> => {
    const v = (email || "").trim()
    if (!v) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(v)) return
    try {
      setVerificandoEmail(true)
      const existe = await existsEmail(v)
      if (existe) return "Este email ya está registrado en el sistema"
    } finally {
      setVerificandoEmail(false)
    }
  }

  // ✅ PRECHECK + LOOKUP (DB/TSE)
  const precheckAndLookup = async (cedulaRaw: string) => {
    const cedula = (cedulaRaw ?? "").trim()
    if (!cedula || cedula.length < 9) return

    // si ya validamos esta misma cédula, no repetimos
    if (lastCheckedCedulaRef.current === cedula) return

    setVerificandoCedula(true)
    try {
      // 1) PRECHECK (pendiente / ya activo)
      await validateSolicitudVoluntariado({
        tipoSolicitante: "INDIVIDUAL",
        cedula,
      })

      lastCheckedCedulaRef.current = cedula

      // 2) LOOKUP (DB primero, si no → TSE)
      const result = await lookup(cedula)
      console.log("[lookup result]", result)

      if (result) {
        const nameVal = result.firstname || ""
        const last1Val = result.lastname1 || ""
        const last2Val = result.lastname2 || ""

        handleInputChange("name", nameVal)
        handleInputChange("lastName1", last1Val)
        handleInputChange("lastName2", last2Val)

        validateField("name", nameVal)
        validateField("lastName1", last1Val)
        validateField("lastName2", last2Val)

        updateLimitFlag("name", nameVal, 60)
        updateLimitFlag("lastName1", last1Val, 60)
        updateLimitFlag("lastName2", last2Val, 60)

        const fromDB = result.source === "DB"
        setPersonaFromDB(fromDB)

        // ✅ si viene de DB, autollenamos el resto también
        if (fromDB) {
          const vi = result.volunteerIndividual ?? {}

          const setIfDefined = (field: keyof VolunteersFormData, val: any, max?: number) => {
            if (val === undefined || val === null) return
            const v = String(val)
            handleInputChange(field, v)
            validateField(field, v)
            if (max) updateLimitFlag(field, v, max)
          }

          setIfDefined("phone", vi.phone, 20)
          setIfDefined("email", vi.email, 60)
          setIfDefined("birthDate", vi.birthDate)
          setIfDefined("address", vi.address, 200)
        }
      } else {
        setPersonaFromDB(false)
      }

      setErrors((prev) => ({ ...prev, idNumber: "" }))
    } catch (err: any) {
      // Si el backend dice 409, mostramos mensaje YA y no hacemos lookup
      const status = err?.response?.status
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "No se pudo validar la cédula."

      if (status === 409) {
        setErrors((prev) => ({ ...prev, idNumber: msg }))
        return
      }

      // otros errores (500, red, etc.)
      setErrors((prev) => ({ ...prev, idNumber: "No se pudo validar la cédula. Intenta de nuevo." }))
      await stopLoadingWithError("No se pudo validar la cédula. Intenta de nuevo.")
    } finally {
      setVerificandoCedula(false)
    }
  }

  const handleNext = async () => {
    const ok = validateAll() && isStepValid()
    if (!ok) return

    // Si aún no se hizo precheck para la cédula actual, lo hacemos aquí también
    if (formData.idNumber?.trim() && formData.idNumber.trim().length >= 9) {
      await precheckAndLookup(formData.idNumber.trim())
      if (errors.idNumber) return
    }

    // email único: si querés dejarlo, ok (pero ojo: si DB ya trae email, esto podría bloquear)
    // vos antes estabas saltándote validaciones si viene de DB; lo mantenemos igual:
    if (!personaFromDB) {
      if (!errors.email && formData.email?.trim()) {
        const m = await validarEmailUnico(formData.email.trim())
        if (m) {
          setErrors((p) => ({ ...p, email: m }))
          return
        }
      }
    }

    onNextCombined()
  }

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"

  return (
    <div className="space-y-8">
      {/* ───────── Tarjeta 1: Información Personal ───────── */}
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
            <div className="relative">
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Cédula o Pasaporte *
              </label>

              <Input
                id="idNumber"
                type="text"
                placeholder="Número de cédula"
                value={formData.idNumber}
                onChange={(e) => {
                  const value = e.target.value
                  handleInputChange("idNumber", value)
                  validateField("idNumber", value)
                  updateLimitFlag("idNumber", value, 60)
                  setErrors((prev) => ({ ...prev, idNumber: "" }))

                  // ✅ debounce: cuando tenga 9+, validamos y luego lookup
                  if (value.trim().length >= 9) {
                    if (debounceRef.current) window.clearTimeout(debounceRef.current)
                    debounceRef.current = window.setTimeout(() => {
                      precheckAndLookup(value)
                    }, 350)
                  } else {
                    setPersonaFromDB(false)
                    lastCheckedCedulaRef.current = ""
                  }
                }}
                onBlur={async (e) => {
                  const ced = e.target.value.trim()
                  if (ced.length >= 9) await precheckAndLookup(ced)
                }}
                required
                maxLength={60}
                className={`${errors.idNumber ? inputError : inputBase} pr-10 bg-white`}
              />

              {verificandoCedula && (
                <div className="absolute right-3 top-[34px]">
                  <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                </div>
              )}

              {errors.idNumber && <p className="text-sm text-[#9c1414] mt-1">{errors.idNumber}</p>}
              {limitReached["idNumber"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nameId" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>

              <Input
                id="nameId"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => {
                  handleInputChange("name", e.target.value)
                  validateField("name", e.target.value)
                  updateLimitFlag("name", e.target.value, 60)
                }}
                required
                maxLength={60}
                className={`${errors.name ? inputError : inputBase} bg-[#ECECEC]`}
              />

              {errors.name && <p className="text-sm text-[#9c1414] mt-1">{errors.name}</p>}
              {limitReached["name"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
              )}
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>

              <Input
                type="text"
                placeholder="Tu primer apellido"
                value={formData.lastName1}
                onChange={(e) => {
                  handleInputChange("lastName1", e.target.value)
                  validateField("lastName1", e.target.value)
                  updateLimitFlag("lastName1", e.target.value, 60)
                }}
                required
                maxLength={60}
                className={`${errors.lastName1 ? inputError : inputBase} bg-[#ECECEC]`}
              />

              {errors.lastName1 && <p className="text-sm text-[#9c1414] mt-1">{errors.lastName1}</p>}
              {limitReached["lastName1"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>

              <Input
                type="text"
                placeholder="Tu segundo apellido"
                value={formData.lastName2}
                onChange={(e) => {
                  handleInputChange("lastName2", e.target.value)
                  validateField("lastName2", e.target.value)
                  updateLimitFlag("lastName2", e.target.value, 60)
                }}
                required
                maxLength={60}
                className={`${errors.lastName2 ? inputError : inputBase} bg-[#ECECEC]`}
              />

              {errors.lastName2 && <p className="text-sm text-[#9c1414] mt-1">{errors.lastName2}</p>}
              {limitReached["lastName2"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
              )}
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento *
          </label>

          <BirthDatePicker
            value={formData.birthDate}
            onChange={(iso) => {
              handleInputChange("birthDate", iso)
              validateField("birthDate", iso)
            }}
            minAge={16}
            placeholder="Seleccione una fecha"
            error={errors.birthDate}
          />
        </div>

          {/* Nacionalidad */}
          <div>
            <label htmlFor="nacionalidad" className="block text-sm font-medium text-gray-700 mb-1">
              Nacionalidad
            </label>

            <Input
              id="nacionalidad"
              type="text"
              value={formData.nacionalidad || ""}
              onChange={(e) => {
                handleInputChange("nacionalidad" as any, e.target.value)
                validateField("nacionalidad" as any, e.target.value)
                updateLimitFlag("nacionalidad" as any, e.target.value, 60)
              }}
              placeholder="Ej: Costarricense"
              maxLength={60}
              className={`${errors.nacionalidad ? inputError : inputBase} bg-white`}
            />

            {errors.nacionalidad && <p className="text-sm text-[#9c1414] mt-1">{errors.nacionalidad}</p>}
            {limitReached["nacionalidad"] && (
              <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Tarjeta 2: Información de Contacto ───────── */}
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
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Teléfono *
              </label>

              <Input
                id="phone"
                type="tel"
                placeholder="Número de teléfono"
                value={formData.phone}
                onChange={(e) => {
                  handleInputChange("phone", e.target.value)
                  validateField("phone", e.target.value)
                  updateLimitFlag("phone", e.target.value, 20)
                }}
                required
                minLength={8}
                maxLength={12}
                className={`${errors.phone ? inputError : inputBase} bg-white`}
              />

              {errors.phone && <p className="text-sm text-[#9c1414] mt-1">{errors.phone}</p>}
              {limitReached["phone"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 20 caracteres.</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Email *
              </label>

              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange("email", e.target.value)
                  validateField("email", e.target.value)
                  updateLimitFlag("email", e.target.value, 60)
                  setErrors((prev) => ({ ...prev, email: "" }))
                }}
                onBlur={async (e) => {
                  // ✅ si vino de DB, NO bloqueamos por existsEmail (para no chocar con el email ya registrado)
                  if (personaFromDB) return

                  const em = e.target.value.trim()
                  if (!em) return
                  const msg = await validarEmailUnico(em)
                  if (msg) setErrors((prev) => ({ ...prev, email: msg }))
                }}
                required
                maxLength={60}
                className={`${errors.email ? inputError : inputBase} pr-10 bg-white`}
              />

              {verificandoEmail && (
                <div className="absolute right-3 top-[34px]">
                  <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                    />
                  </svg>
                </div>
              )}

              {errors.email && <p className="text-sm text-[#9c1414] mt-1">{errors.email}</p>}
              {limitReached["email"] && (
                <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 60 caracteres.</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Dirección Completa
            </label>

            <Input
              id="address"
              type="text"
              placeholder="Tu dirección completa"
              value={formData.address}
              onChange={(e) => {
                handleInputChange("address", e.target.value)
                validateField("address", e.target.value)
                updateLimitFlag("address", e.target.value, 200)
              }}
              maxLength={200}
              className={`${errors.address ? inputError : inputBase} bg-white`}
            />

            {errors.address && <p className="text-sm text-[#9c1414] mt-1">{errors.address}</p>}
            {limitReached["address"] && (
              <p className="text-sm text-orange-600 mt-1">Has alcanzado el límite de 200 caracteres.</p>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Botón siguiente ───────── */}
      <div className="text-right">
        <NavigationButtons showPrev={false} onNext={handleNext} disableNext={!isStepValid()} />
      </div>
    </div>
  )
}

function mapFormToPersona(data: VolunteersFormData) {
  return {
    cedula: data.idNumber,
    nombre: data.name,
    apellido1: data.lastName1,
    apellido2: data.lastName2,
    telefono: data.phone,
    email: data.email,
    fechaNacimiento: data.birthDate,
    direccion: data.address || "",
    nacionalidad: data.nacionalidad || "",
  }
}

function mapField(field: keyof VolunteersFormData): string {
  const map: Record<string, string> = {
    idNumber: "cedula",
    name: "nombre",
    lastName1: "apellido1",
    lastName2: "apellido2",
    phone: "telefono",
    email: "email",
    birthDate: "fechaNacimiento",
    address: "direccion",
    nacionalidad: "nacionalidad",
  }
  return map[field] || (field as string)
}

function reverseMapField(field: string): keyof VolunteersFormData | null {
  const reverse: Record<string, keyof VolunteersFormData> = {
    cedula: "idNumber",
    nombre: "name",
    apellido1: "lastName1",
    apellido2: "lastName2",
    telefono: "phone",
    email: "email",
    fechaNacimiento: "birthDate",
    direccion: "address",
    nacionalidad: "nacionalidad" as any,
  }
  return reverse[field] || null
}
