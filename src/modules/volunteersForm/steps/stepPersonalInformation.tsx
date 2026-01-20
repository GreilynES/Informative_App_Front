import type { VolunteersFormData } from "../../volunteersInformation/models/VolunteersType"
import { UserRound, Mail, Calendar as CalendarIcon } from "lucide-react"
import { NavigationButtons } from "../components/NavigationButtons"
import { useMemo, useState } from "react"
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema"
import { existsCedula, existsEmail } from "../services/volunteerFormService"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { es } from "date-fns/locale"

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

  const validarCedulaUnica = async (cedula: string): Promise<string | undefined> => {
    const v = (cedula || "").trim()
    if (v.length < 8) return
    try {
      setVerificandoCedula(true)
      const existe = await existsCedula(v)
      if (existe) return "Esta cédula ya está registrada en el sistema"
    } finally {
      setVerificandoCedula(false)
    }
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

  const handleNext = async () => {
    const ok = validateAll() && isStepValid()
    if (!ok) return

    if (!errors.idNumber && formData.idNumber?.trim()) {
      const m = await validarCedulaUnica(formData.idNumber.trim())
      if (m) {
        setErrors((p) => ({ ...p, idNumber: m }))
        return
      }
    }

    if (!errors.email && formData.email?.trim()) {
      const m = await validarEmailUnico(formData.email.trim())
      if (m) {
        setErrors((p) => ({ ...p, email: m }))
        return
      }
    }

    onNextCombined()
  }

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
    t.setFullYear(t.getFullYear() - 16)
    t.setHours(0, 0, 0, 0)
    return t
  }, [])

  const birthDateDate = useMemo(() => parseISOToDate(formData.birthDate), [formData.birthDate])

  const birthDateDisplay = useMemo(() => {
    const d = birthDateDate
    if (!d) return ""
    return d.toLocaleDateString("es-CR", { day: "2-digit", month: "long", year: "numeric" })
  }, [birthDateDate])

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
                onChange={async (e) => {
                  const value = e.target.value
                  handleInputChange("idNumber", value)
                  validateField("idNumber", value)
                  updateLimitFlag("idNumber", value, 60)

                  if (value.length >= 9) {
                    const result = await lookup(value)
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
                    }
                  }

                  setErrors((prev) => ({ ...prev, idNumber: "" }))
                }}
                onBlur={async (e) => {
                  const ced = e.target.value.trim()
                  if (!ced) return
                  const msg = await validarCedulaUnica(ced)
                  if (msg) setErrors((prev) => ({ ...prev, idNumber: msg }))
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

          {/* ✅ Fecha de nacimiento (Calendar shadcn - dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full justify-between shadow-sm hover:bg-[#E6EDC8]/40 ${
                    errors.birthDate ? "border-[#9c1414]" : "border-[#DCD6C9]"
                  }`}
                >
                  <span className={formData.birthDate ? "text-[#4A4A4A]" : "text-gray-400"}>
                    {formData.birthDate ? birthDateDisplay : "Seleccione una fecha"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-[#708C3E]" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-3 rounded-xl border border-[#DCD6C9] shadow-md">
                <Calendar
                  mode="single"
                  selected={birthDateDate}
                  onSelect={(d) => {
                    if (!d) return
                    if (disabledBirthDate(d)) return
                    const iso = toISODate(d)
                    handleInputChange("birthDate", iso)
                    validateField("birthDate", iso)
                  }}
                  locale={es}
                  captionLayout="dropdown"
                  fromYear={fromYear}
                  toYear={toYear}
                  disabled={disabledBirthDate}
                  defaultMonth={birthDateDate ?? maxBirthDateObj}
                  className="rounded-lg"
                  classNames={{
                    caption: "flex justify-center pt-1 relative items-center text-[#708C3E] font-semibold",
                    head_cell: "text-[#708C3E] w-9 font-semibold text-[0.8rem]",
                    day_selected:
                      "bg-[#708C3E] text-white hover:bg-[#5d7334] hover:text-white focus:bg-[#708C3E] focus:text-white",
                    day_today: "border border-[#A3853D]",
                    day_disabled: "text-gray-300 opacity-50",
                  }}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Debe ser mayor de <span className="font-medium text-[#6F8C1F]">16 años</span>.
                </p>
              </PopoverContent>
            </Popover>

            {errors.birthDate && <p className="text-sm text-[#9c1414] mt-1">{errors.birthDate}</p>}
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
