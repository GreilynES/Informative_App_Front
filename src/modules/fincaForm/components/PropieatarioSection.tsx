import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { usePropietarioSection } from "../hooks/usePropietario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, User } from "lucide-react";
import { btn } from "@/shared/ui/buttonStyles";

interface PropietarioSectionProps {
  form: FormLike;
}

export function PropietarioSection({ form }: PropietarioSectionProps) {
  const {
    isLoadingCedula,
    cedulaError,
    searchMessage,
    handleCedulaLookup,
  } = usePropietarioSection({ form });

  const [esPropietario, setEsPropietario] = useState(true);

  useEffect(() => {
    const formValue = (form as any).state?.values?.esPropietario;
    if (formValue !== undefined && formValue !== esPropietario) setEsPropietario(formValue);
  }, [(form as any).state?.values?.esPropietario, esPropietario]);

  const [emailError, setEmailError] = useState<string>("");

  const inputBase =
    "border-[#DCD6C9] focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0";
  const inputError =
    "border-[#9c1414] focus-visible:ring-[#9c1414]/30 focus-visible:ring-2 focus-visible:ring-offset-0";

  const checkboxBase =
    "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E]";

  function handleEmailChange(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) setEmailError("Por favor ingrese un email válido");
    else setEmailError("");
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Propietario de la Finca</h3>
      </div>

      <div className="p-6 space-y-4">
        <form.Field name="esPropietario">
          {(f: any) => (
            <label className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[#E6EDC8]/30">
              <Checkbox
                checked={!!f.state.value}
                onCheckedChange={(checked) => {
                  const newValue = !!checked;
                  f.handleChange(newValue);
                  setEsPropietario(newValue);
                }}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Soy el propietario de esta finca</span>
            </label>
          )}
        </form.Field>

        {esPropietario ? (
          <div className="rounded-xl border border-[#DCD6C9] bg-[#F3F1EA] px-4 py-3">
            <p className="text-sm text-[#4A4A4A]">
              Como usted es el propietario, se usarán sus datos personales.
            </p>
          </div>
        ) : (
          <div className="space-y-4 border-t border-[#DCD6C9] pt-4">
            <p className="text-sm font-semibold text-[#4A4A4A]">Datos del Propietario</p>

            <form.Field name="propietarioCedula">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                    Cédula del Propietario *
                  </label>

                  <div className="flex gap-2">
                    <Input
                      value={fprop.state.value ?? ""}
                      onChange={(e) => fprop.handleChange(e.target.value.replace(/\D/g, ""))}
                      onBlur={async (e) => {
                        fprop.handleBlur();
                        const ced = String(e.target.value ?? "").replace(/\D/g, "");
                        if (ced.length >= 8) {
                          await handleCedulaLookup(ced);
                        }
                      }}
                      placeholder="Número de cédula"
                      maxLength={12}
                      className={`${cedulaError ? inputError : inputBase} bg-white`}
                    />

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleCedulaLookup(String(fprop.state.value ?? "").replace(/\D/g, ""))}
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
                    <p className={`text-sm mt-1 ${searchMessage.includes("✓") ? "text-[#708C3E]" : "text-gray-600"}`}>
                      {searchMessage}
                    </p>
                  )}
                  {cedulaError && <p className="text-sm text-[#9c1414] mt-1">{cedulaError}</p>}
                </div>
              )}
            </form.Field>

            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioNombre">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre *</label>
                    <Input
                      value={fprop.state.value ?? ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      placeholder="Nombre del propietario"
                      maxLength={50}
                      className={`${inputBase} bg-white`}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioApellido1">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Primer Apellido *</label>
                    <Input
                      value={fprop.state.value ?? ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      placeholder="Primer apellido"
                      maxLength={50}
                      className={`${inputBase} bg-white`}
                    />
                  </div>
                )}
              </form.Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioApellido2">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Segundo Apellido *</label>
                    <Input
                      value={fprop.state.value ?? ""}
                      onChange={(e) => fprop.handleChange(e.target.value)}
                      onBlur={fprop.handleBlur}
                      placeholder="Segundo apellido"
                      maxLength={50}
                      className={`${inputBase} bg-white`}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioTelefono">
                {(fprop: any) => {
                  const hasError =
                    (fprop.state.value && String(fprop.state.value).length > 0 && String(fprop.state.value).length < 8) ||
                    false;

                  return (
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                      <Input
                        value={fprop.state.value ?? ""}
                        onChange={(e) => fprop.handleChange(e.target.value.replace(/\D/g, ""))}
                        onBlur={fprop.handleBlur}
                        placeholder="Teléfono (mínimo 8 dígitos)"
                        maxLength={12}
                        className={`${hasError ? inputError : inputBase} bg-white`}
                      />
                      {hasError && (
                        <p className="text-sm text-[#9c1414] mt-1">El teléfono debe tener al menos 8 dígitos</p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <form.Field name="propietarioEmail">
                {(fprop: any) => (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                    <Input
                      type="email"
                      value={fprop.state.value ?? ""}
                      onChange={(e) => {
                        fprop.handleChange(e.target.value);
                        handleEmailChange(e.target.value);
                      }}
                      onBlur={fprop.handleBlur}
                      placeholder="correo@ejemplo.com"
                      className={`${emailError ? inputError : inputBase} bg-white`}
                    />
                    {emailError && <p className="text-sm text-[#9c1414] mt-1">{emailError}</p>}
                  </div>
                )}
              </form.Field>

              <form.Field name="propietarioFechaNacimiento">
                {(fprop: any) => {
                  const today = new Date();
                  const yyyy = today.getFullYear();
                  const mm = String(today.getMonth() + 1).padStart(2, "0");
                  const dd = String(today.getDate()).padStart(2, "0");
                  const maxDate = `${yyyy - 18}-${mm}-${dd}`;

                  const esMenor = !!fprop.state.value && new Date(fprop.state.value) > new Date(maxDate);

                  return (
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                        Fecha de Nacimiento *
                      </label>
                      <Input
                        type="date"
                        value={fprop.state.value ?? ""}
                        onChange={(e) => fprop.handleChange(e.target.value)}
                        onBlur={fprop.handleBlur}
                        max={maxDate}
                        className={`${esMenor ? inputError : inputBase} bg-white`}
                      />
                      {esMenor && (
                        <p className="text-sm text-[#9c1414] mt-1">El propietario debe ser mayor de 18 años</p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="propietarioDireccion">
              {(fprop: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección (opcional)</label>
                  <Input
                    value={fprop.state.value ?? ""}
                    onChange={(e) => fprop.handleChange(e.target.value)}
                    onBlur={fprop.handleBlur}
                    placeholder="Dirección completa"
                    className={`${inputBase} bg-white`}
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
