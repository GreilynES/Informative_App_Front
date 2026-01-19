import { useEffect, useState } from "react"
import type { FormLike } from "../../../shared/types/form-lite"
import { usePropietarioSection } from "../hooks/usePropietario"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

interface PropietarioSectionProps {
  form: FormLike
}

export function PropietarioSection({ form }: PropietarioSectionProps) {
  const { isLoadingCedula, cedulaError, searchMessage,  handleCedulaLookup } =
    usePropietarioSection({ form })

  const [esPropietario, setEsPropietario] = useState(true)

  useEffect(() => {
    const formValue = (form as any).state?.values?.esPropietario
    if (formValue !== undefined && formValue !== esPropietario) {
      setEsPropietario(formValue)
    }
  }, [(form as any).state?.values?.esPropietario, esPropietario])

  const [emailError, setEmailError] = useState<string>("")

  function handleEmailChange(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      setEmailError("Por favor ingrese un email válido")
    } else {
      setEmailError("")
    }
  }

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Propietario de la Finca</h3>
      </div>

      <div className="p-6 space-y-4">
        <form.Field name="esPropietario">
          {(f: any) => (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <input
                id="esPropietario"
                type="checkbox"
                checked={!!f.state.value}
                onChange={(e) => {
                  const newValue = e.target.checked
                  f.handleChange(newValue)
                  setEsPropietario(newValue)
                }}
                onBlur={f.handleBlur}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="esPropietario" className="text-sm font-medium text-[#4A4A4A]">
                Soy el propietario de esta finca
              </label>
            </div>
          )}
        </form.Field>

        {esPropietario ? (
          <div className="text-sm text-gray-600 italic">Como usted es el propietario, se usarán sus datos personales.</div>
        ) : (
          <div className="space-y-4 border-t pt-4">
            <p className="text-sm font-medium text-[#4A4A4A]">Datos del Propietario:</p>

            <form.Field name="propietarioCedula">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Cédula del Propietario *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={fprop.state.value || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        fprop.handleChange(value)
                      }}
                      onBlur={fprop.handleBlur}
                      className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Número de cédula"
                      maxLength={12}
                    />

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCedulaLookup(fprop.state.value)}
                      disabled={isLoadingCedula || !fprop.state.value}
                      className={`${btn.primary} ${btn.disabledSoft} h-10 w-10 p-0`}
                      aria-label="Buscar cédula"
                      title="Buscar"
                    >
                      {isLoadingCedula ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <Search className="size-5" />
                      )}
                    </Button>
                  </div>

                  {searchMessage && (
                    <p className={`text-sm mt-1 ${searchMessage.includes("✓") ? "text-green-600" : "text-gray-600"}`}>
                      {searchMessage}
                    </p>
                  )}
                  {cedulaError && <p className="text-sm text-red-600 mt-1">{cedulaError}</p>}
                </div>
              )}
            </form.Field>

            {/* Nombre y Primer Apellido */}
            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioNombre">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={fprop.state.value || ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Nombre del propietario"
                      maxLength={50}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioApellido1">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Primer Apellido *
                    </label>
                    <input
                      type="text"
                      value={fprop.state.value || ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Primer apellido"
                      maxLength={50}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Segundo Apellido y Teléfono */}
            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioApellido2">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                      Segundo Apellido *
                    </label>
                    <input
                      type="text"
                      value={fprop.state.value || ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      placeholder="Segundo apellido"
                      maxLength={50}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioTelefono">
                {(fprop: any) => {
                  const hasError = fprop.state.value && fprop.state.value.length > 0 && fprop.state.value.length < 8;
                  
                  return (
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                      <input
                        type="text"
                        value={fprop.state.value || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          fprop.handleChange(value);
                        }}
                        onBlur={fprop.handleBlur}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F] ${
                          hasError ? "border-red-500" : "border-[#CFCFCF]"
                        }`}
                        placeholder="Teléfono (mínimo 8 dígitos)"
                        maxLength={12}
                        minLength={8}
                      />
                      {hasError && (
                        <p className="text-sm text-red-600 mt-1">
                          El teléfono debe tener al menos 8 dígitos
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            {/* Email y Fecha de Nacimiento */}
            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioEmail">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                    <input
                      type="email"
                      value={fprop.state.value || ""}
                      onChange={(e) => {
                        fprop.handleChange(e.target.value);
                        handleEmailChange(e.target.value);
                      }}
                      onBlur={fprop.handleBlur}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C3E] ${
                        emailError ? "border-red-500" : "border-[#CFCFCF]"
                      }`}
                      placeholder="correo@ejemplo.com"
                      inputMode="email"
                      autoComplete="email"
                    />
                    {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioFechaNacimiento">
                {(fprop: any) => {
                  const today = new Date();
                  const year = today.getFullYear();
                  const month = String(today.getMonth() + 1).padStart(2, '0');
                  const day = String(today.getDate()).padStart(2, '0');
                  
                  // Fecha máxima: hace 18 años desde hoy
                  const maxYear = year - 18;
                  const maxDate = `${maxYear}-${month}-${day}`;
                  
                  // Validar edad mínima
                  const validarEdad = (fecha: string): boolean => {
                    if (!fecha) return false;
                    
                    const fechaNacimiento = new Date(fecha);
                    const hoy = new Date();
                    
                    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
                    const mesActual = hoy.getMonth();
                    const mesNacimiento = fechaNacimiento.getMonth();
                    
                    if (mesActual < mesNacimiento || 
                        (mesActual === mesNacimiento && hoy.getDate() < fechaNacimiento.getDate())) {
                      edad--;
                    }
                    
                    return edad >= 18;
                  };
                  
                  const esMenorDeEdad = fprop.state.value && !validarEdad(fprop.state.value);
                  
                  return (
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={fprop.state.value || ""}
                        onChange={(e) => fprop.handleChange(e.target.value)}
                        onBlur={fprop.handleBlur}
                        max={maxDate}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F] ${
                          esMenorDeEdad ? "border-red-500" : "border-[#CFCFCF]"
                        }`}
                      />
                      {esMenorDeEdad && (
                        <p className="text-sm text-red-600 mt-1">
                          El propietario debe ser mayor de 18 años
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            {/* Dirección (opcional) */}
            <form.Field name="propietarioDireccion">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Dirección (opcional)
                  </label>
                  <input
                    type="text"
                    value={fprop.state.value || ""}
                    onChange={(e) => fprop.handleChange(e.target.value)}
                    onBlur={fprop.handleBlur}
                    className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    placeholder="Dirección completa"
                  />
                </div>
              )}
            </form.Field>
          </div>
        )}
      </div>
    </div>
  );
}