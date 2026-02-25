import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { usePropietarioSection } from "../hooks/usePropietario"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "lucide-react"
import { BirthDatePicker } from "@/components/ui/birthDatePicker"

interface PropietarioSectionProps {
  form: FormLike
}

export function PropietarioSection({ form }: PropietarioSectionProps) {
  const {
    isLoadingCedula,
    cedulaError,
    searchMessage,
    personaFromDB,
    bloquearCamposDB,
    onCedulaChange,
    onCedulaBlur,
    resetPropietario,
  } = usePropietarioSection({ form })

  const [esPropietario, setEsPropietario] = useState(true)
  const [emailError, setEmailError] = useState<string>("")

  useEffect(() => {
    const formValue = (form as any).state?.values?.esPropietario
    if (formValue !== undefined && formValue !== esPropietario) setEsPropietario(formValue)
  }, [(form as any).state?.values?.esPropietario, esPropietario])

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
  const disabledBase = "bg-[#ECECEC] opacity-70 cursor-not-allowed"

  const checkboxBase =
    "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]"

  function handleEmailChange(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) setEmailError("Por favor ingrese un email válido")
    else setEmailError("")
  }

  const cedulaValue = String((form as any).state?.values?.propietarioCedula ?? "").replace(/\D/g, "")

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-[#708C3E]">Propietario de la Finca</h3>
          <p className="text-xs text-gray-500">
            Todos los campos son obligatorios, a menos que indiquen <span className="font-medium">(Opcional)</span>.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <form.Field name="esPropietario">
          {(f: any) => (
            <label className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[#E6EDC8]/30">
              <Checkbox
                checked={!!f.state.value}
                onCheckedChange={(checked) => {
                  const newValue = !!checked
                  f.handleChange(newValue)
                  setEsPropietario(newValue)

                  // si pasa a "sí soy", limpiamos propietario extra
                  if (newValue) resetPropietario()
                }}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Soy el propietario de esta finca</span>
            </label>
          )}
        </form.Field>

        {esPropietario ? (
          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
            <p className="text-sm text-[#4A4A4A]">Como usted es el propietario, se usarán sus datos personales.</p>
          </div>
        ) : (
          <div className="space-y-4 border-t border-[#DCD6C9] pt-4">
            <p className="text-sm font-semibold text-[#4A4A4A]">Datos del Propietario</p>

            {/* Cédula */}
            <form.Field name="propietarioCedula">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Cédula del Propietario 
                  </label>

                  <div className="flex gap-2">
                    <Input
                      value={fprop.state.value ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "")
                        fprop.handleChange(raw)
                        setEmailError("")

                        onCedulaChange(raw)
                      }}
                      onBlur={async (e) => {
                        fprop.handleBlur()
                        const ced = String(e.target.value ?? "").replace(/\D/g, "")
                        await onCedulaBlur(ced)
                      }}
                      maxLength={12}
                      className={`${cedulaError ? inputError : inputBase} bg-white`}
                    />

                      {isLoadingCedula && (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      )}

                  </div>

                  {cedulaError ? (
                    <p className="text-sm text-[#9c1414] mt-1">{cedulaError}</p>
                  ) : searchMessage ? (
                    <p className={`text-sm mt-1 ${searchMessage.includes("✓") ? "text-[#708C3E]" : "text-gray-600"}`}>
                      {searchMessage}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Ejemplo: 504550789</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Nombre + Apellidos */}
            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioNombre">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Nombre 
                    </label>
                    <Input
                      value={fprop.state.value ?? ""}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        fprop.handleChange(e.target.value)
                      }}
                      onBlur={fprop.handleBlur}
                      maxLength={50}
                      className={`${inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />
                    {personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Nombre del propietario.</p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioApellido1">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Primer Apellido 
                    </label>
                    <Input
                      value={fprop.state.value ?? ""}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        fprop.handleChange(e.target.value)
                      }}
                      onBlur={fprop.handleBlur}
                      maxLength={50}
                      className={`${inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />
                    {personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Primer apellido del propietario.</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioApellido2">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Segundo Apellido 
                    </label>
                    <Input
                      value={fprop.state.value ?? ""}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        fprop.handleChange(e.target.value)
                      }}
                      onBlur={fprop.handleBlur}
                      maxLength={50}
                      className={`${inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />
                    {personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Segundo apellido del propietario.</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Teléfono */}
              <form.Field name="propietarioTelefono">
                {(fprop: any) => {
                  const v = String(fprop.state.value ?? "")
                  const hasError = v.length > 0 && v.length < 8
                  return (
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Teléfono 
                      </label>
                      <Input
                        value={fprop.state.value ?? ""}
                        disabled={bloquearCamposDB}
                        onChange={(e) => {
                          if (bloquearCamposDB) return
                          fprop.handleChange(e.target.value.replace(/\D/g, ""))
                        }}
                        onBlur={fprop.handleBlur}
                        maxLength={12}
                        className={`${hasError ? inputError : inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                      />
                      {hasError ? (
                        <p className="text-sm text-[#9c1414] mt-1">El teléfono debe tener al menos 8 dígitos.</p>
                      ) : personaFromDB ? (
                        <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">Ejemplo: +506 2222-2222</p>
                      )}
                    </div>
                  )
                }}
              </form.Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Email */}
              <form.Field name="propietarioEmail">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Email 
                    </label>
                    <Input
                      type="email"
                      value={fprop.state.value ?? ""}
                      disabled={bloquearCamposDB}
                      onChange={(e) => {
                        if (bloquearCamposDB) return
                        fprop.handleChange(e.target.value)
                        handleEmailChange(e.target.value)
                      }}
                      onBlur={fprop.handleBlur}
                      className={`${emailError ? inputError : inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                    />
                    {emailError ? (
                      <p className="text-sm text-[#9c1414] mt-1">{emailError}</p>
                    ) : personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Ejemplo: contacto@dominio.email</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Fecha Nacimiento */}
              <form.Field name="propietarioFechaNacimiento">
                {(fprop: any) => (
                  <div className={bloquearCamposDB ? "pointer-events-none opacity-70" : ""}>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Fecha de Nacimiento
                    </label>

                    <BirthDatePicker
                      value={fprop.state.value ?? ""}
                      onChange={(iso) => {
                        if (bloquearCamposDB) return
                        fprop.handleChange(iso)
                      }}
                      minAge={18}
                      placeholder="Seleccione una fecha"
                      error={undefined}
                      className=""
                    />

                    {personaFromDB ? (
                      <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">Debe ser mayor a 18 años.</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Dirección */}
            <form.Field name="propietarioDireccion">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Dirección <span className="text-xs text-gray-500 font-normal">(Opcional)</span>
                  </label>
                  <Input
                    value={fprop.state.value ?? ""}
                    disabled={bloquearCamposDB}
                    onChange={(e) => {
                      if (bloquearCamposDB) return
                      fprop.handleChange(e.target.value)
                    }}
                    onBlur={fprop.handleBlur}
                    className={`${inputBase} ${bloquearCamposDB ? disabledBase : "bg-white"}`}
                  />
                  {personaFromDB ? (
                    <p className="mt-1 text-xs text-gray-500">Este dato fue recuperado del sistema y no puede modificarse.</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">Provincia, cantón, distrito y señas.</p>
                  )}
                </div>
              )}
            </form.Field>

            {/* hint si viene de DB */}
            {personaFromDB && cedulaValue.length >= 9 && (
              <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
                <p className="text-sm text-[#4A4A4A]">
                  Los datos fueron recuperados del sistema y no pueden modificarse.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}