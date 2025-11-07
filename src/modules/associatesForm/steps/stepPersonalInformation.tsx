import { useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { ZodError } from "zod";
import { associateApplySchema } from "../schemas/associateApply";
import { NavigationButtons } from "../components/NavigationButtons";
import { NucleoFamiliarSection } from "../components/FamilyNucleusSection";
import { existsCedula, existsEmail } from "../services/associatesFormService";

interface Step1Props {
  form: FormLike;
  lookup: (id: string) => Promise<any>;
  onNext: () => void;
  canProceed: boolean;
}

export function Step1({ form, lookup, onNext, canProceed }: Step1Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});
  const [verificandoCedula, setVerificandoCedula] = useState(false);
  const [verificandoEmail, setVerificandoEmail] = useState(false);

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema.shape as any)[name];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Error de validación";
      }
      return "Error de validación";
    }
  };

  // Validar si la cédula ya existe
  const validarCedulaUnica = async (cedula: string): Promise<string | undefined> => {
    if (!cedula || cedula.trim().length < 8) {
      console.log("[Step1] Cédula muy corta, no validando");
      return undefined;
    }
    
    console.log("[Step1] Iniciando validación de cédula:", cedula);
    setVerificandoCedula(true);
    try {
      const existe = await existsCedula(cedula);
      console.log("[Step1] Resultado validación cédula:", existe ? "EXISTE" : "DISPONIBLE");
      if (existe) {
        return "Esta cédula ya está registrada en el sistema";
      }
      return undefined;
    } catch (error) {
      console.error("[Step1] Error al verificar cédula:", error);
      return undefined; // No bloquear en caso de error de red
    } finally {
      setVerificandoCedula(false);
    }
  };

  // Validar si el email ya existe
  const validarEmailUnico = async (email: string): Promise<string | undefined> => {
    if (!email || email.trim().length === 0) {
      console.log("[Step1] Email vacío, no validando");
      return undefined;
    }
    
    // Validar formato básico primero
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("[Step1] Email con formato inválido, no validando duplicados");
      return undefined;
    }
    
    console.log("[Step1] Iniciando validación de email:", email);
    setVerificandoEmail(true);
    try {
      const existe = await existsEmail(email);
      console.log("[Step1] Resultado validación email:", existe ? "EXISTE" : "DISPONIBLE");
      if (existe) {
        return "Este email ya está registrado en el sistema";
      }
      return undefined;
    } catch (error) {
      console.error("[Step1] Error al verificar email:", error);
      return undefined; // No bloquear en caso de error de red
    } finally {
      setVerificandoEmail(false);
    }
  };

  const toISO = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayDate = new Date();
  const adultCutoff = new Date(todayDate);
  adultCutoff.setFullYear(adultCutoff.getFullYear() - 18);
  const adultMaxDate = toISO(adultCutoff);

  // Función para validar todo el paso y mostrar errores
  const handleNext = async () => {
    setIntentoAvanzar(true);
    const values = (form as any).state?.values || {};
    const errores: Record<string, string> = {};

    // Validar campos obligatorios
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
    ];

    // Validar cada campo obligatorio
    for (const { name, label, minLength } of camposObligatorios) {
      const valor = values[name];
      
      if (!valor || (typeof valor === 'string' && valor.trim().length === 0)) {
        errores[name] = `${label} es obligatorio`;
      } else if (minLength && valor.length < minLength) {
        errores[name] = `${label} debe tener al menos ${minLength} caracteres`;
      } else {
        // Validar con Zod
        const errorZod = validateField(name, valor);
        if (errorZod) {
          errores[name] = errorZod;
        }
      }
    }

    // Validar unicidad de cédula
    if (values.cedula && !errores.cedula) {
      const errorCedula = await validarCedulaUnica(values.cedula);
      if (errorCedula) {
        errores.cedula = errorCedula;
      }
    }

    // Validar unicidad de email
    if (values.email && !errores.email) {
      const errorEmail = await validarEmailUnico(values.email);
      if (errorEmail) {
        errores.email = errorEmail;
      }
    }

    // Validar distancia si no vive en la finca
    const viveEnFinca = values.viveEnFinca ?? true;
    if (!viveEnFinca) {
      const distancia = values.distanciaFinca;
      if (!distancia || distancia === "" || Number(distancia) <= 0) {
        errores["distanciaFinca"] = "La distancia debe ser mayor a 0";
      } else {
        const errorZod = validateField("distanciaFinca", distancia);
        if (errorZod) {
          errores["distanciaFinca"] = errorZod;
        }
      }
    }

    setErroresValidacion(errores);

    // Si hay errores, no avanzar y hacer scroll al primer error
    if (Object.keys(errores).length > 0) {
      // Scroll al primer campo con error
      const primerCampoError = Object.keys(errores)[0];
      const elemento = document.querySelector(`[name="${primerCampoError}"]`);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Si no hay errores, avanzar
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="cedula"
              validators={{ onChange: ({ value }: any) => validateField("cedula", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={async (e) => {
                        const v = e.target.value;
                        f.handleChange(v);
                        // Limpiar error de cédula cuando el usuario modifica el campo
                        setErroresValidacion(prev => {
                          const { cedula, ...rest } = prev;
                          return rest;
                        });
                        if (/^\d{9,12}$/.test(v)) {
                          const r = await lookup(v);
                          if (r) {
                            form.setFieldValue("nombre", r.firstname || "");
                            form.setFieldValue("apellido1", r.lastname1 || "");
                            form.setFieldValue("apellido2", r.lastname2 || "");
                          }
                        }
                      }}
                      onBlur={async (e) => {
                        f.handleBlur();
                        const cedula = e.target.value.trim();
                        if (cedula.length >= 8) {
                          const errorUnicidad = await validarCedulaUnica(cedula);
                          if (errorUnicidad) {
                            setErroresValidacion(prev => ({
                              ...prev,
                              cedula: errorUnicidad
                            }));
                          }
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                        erroresValidacion["cedula"]
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      }`}
                      placeholder="Número de cédula"
                      disabled={verificandoCedula}
                    />
                    {verificandoCedula && (
                      <div className="absolute right-3 top-2.5">
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["cedula"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["cedula"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="nombre"
              validators={{ onChange: ({ value }: any) => validateField("nombre", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { nombre, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 ${
                      erroresValidacion["nombre"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Tu nombre"
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["nombre"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["nombre"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="apellido1"
              validators={{ onChange: ({ value }: any) => validateField("apellido1", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { apellido1, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 ${
                      erroresValidacion["apellido1"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Tu primer apellido"
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["apellido1"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["apellido1"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="apellido2"
              validators={{ onChange: ({ value }: any) => validateField("apellido2", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { apellido2, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md bg-gray-100 shadow-sm focus:outline-none focus:ring-1 ${
                      erroresValidacion["apellido2"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Tu segundo apellido"
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["apellido2"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["apellido2"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field 
            name="fechaNacimiento"
            validators={{ onChange: ({ value }: any) => validateField("fechaNacimiento", value) }}
          >
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  required
                  value={f.state.value}
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    if (intentoAvanzar) {
                      setErroresValidacion(prev => {
                        const { fechaNacimiento, ...rest } = prev;
                        return rest;
                      });
                    }
                    if (!inputDate) {
                      f.handleChange("");
                    } else if (inputDate > adultMaxDate) {
                      f.handleChange(adultMaxDate);
                    } else {
                      f.handleChange(inputDate);
                    }
                  }}
                  onBlur={f.handleBlur}
                  max={adultMaxDate}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    erroresValidacion["fechaNacimiento"]
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                />
                {(f.state.meta.errors?.length > 0 || erroresValidacion["fechaNacimiento"]) && (
                  <p className="text-sm text-red-600 mt-1">
                    {erroresValidacion["fechaNacimiento"] || f.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="telefono"
              validators={{ onChange: ({ value }: any) => validateField("telefono", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      f.handleChange(value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { telefono, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                      erroresValidacion["telefono"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Número de teléfono"
                    maxLength={12}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["telefono"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["telefono"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="email"
              validators={{ onChange: ({ value }: any) => validateField("email", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={f.state.value}
                      onChange={(e) => {
                        f.handleChange(e.target.value);
                        // Limpiar error de email cuando el usuario modifica el campo
                        setErroresValidacion(prev => {
                          const { email, ...rest } = prev;
                          return rest;
                        });
                      }}
                      onBlur={async (e) => {
                        f.handleBlur();
                        const email = e.target.value.trim();
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (email && emailRegex.test(email)) {
                          const errorUnicidad = await validarEmailUnico(email);
                          if (errorUnicidad) {
                            setErroresValidacion(prev => ({
                              ...prev,
                              email: errorUnicidad
                            }));
                          }
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                        erroresValidacion["email"]
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                      }`}
                      placeholder="correo@ejemplo.com"
                      disabled={verificandoEmail}
                    />
                    {verificandoEmail && (
                      <div className="absolute right-3 top-2.5">
                        <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["email"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["email"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field 
            name="direccion"
            validators={{ onChange: ({ value }: any) => validateField("direccion", value) }}
          >
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Dirección Completa</label>
                <input
                  type="text"
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Tu dirección completa"
                />
                {f.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      {/* Información de la Finca y Ganado */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca y Ganado</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="viveEnFinca">
              {(f: any) => (
                <div className="flex items-center gap-3 mt-1">
                  <input
                    id="viveEnFinca"
                    type="checkbox"
                    checked={f.state.value ?? true}
                    onChange={(e) => {
                      f.handleChange(e.target.checked);
                      if (e.target.checked && f.form?.setFieldValue) {
                        f.form.setFieldValue("distanciaFinca", "");
                        setErroresValidacion(prev => {
                          const { distanciaFinca, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#708C3E" }}
                  />
                  <label htmlFor="viveEnFinca" className="text-sm text-[#4A4A4A]">
                    ¿Vive en la finca?
                  </label>
                </div>
              )}
            </form.Field>

            <form.Field name="viveEnFinca">
              {(v: any) => {
                const viveEnFinca = (v.state.value ?? true) as boolean;
                if (viveEnFinca) return null;

                return (
                  <form.Field
                    name="distanciaFinca"
                    validators={{
                      onChange: ({ value }: any) => validateField("distanciaFinca", value),
                    }}
                  >
                    {(f: any) => (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                          Distancia de su residencia a la finca (km) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={f.state.value}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^\d.]/g, "");
                            const parts = value.split(".");
                            const filtered =
                              parts.length > 2
                                ? parts[0] + "." + parts.slice(1).join("")
                                : value;

                            if (filtered === "" || filtered === "0" || parseFloat(filtered) === 0) {
                              f.handleChange("");
                              return;
                            }

                            f.handleChange(filtered);
                            if (intentoAvanzar) {
                              setErroresValidacion(prev => {
                                const { distanciaFinca, ...rest } = prev;
                                return rest;
                              });
                            }
                          }}
                          onBlur={f.handleBlur}
                          placeholder="Ej: 12.50"
                          className={`w-full px-3 py-2 border rounded-md ${
                            erroresValidacion["distanciaFinca"]
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                          }`}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e" || (e.key === "0" && !f.state.value)) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {(f.state.meta.errors?.length > 0 || erroresValidacion["distanciaFinca"]) && (
                          <p className="text-sm text-red-600 mt-1">
                            {erroresValidacion["distanciaFinca"] || f.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                );
              }}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <form.Field 
              name="marcaGanado"
              validators={{ onChange: ({ value }: any) => validateField("marcaGanado", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Marca de Ganado *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { marcaGanado, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    placeholder="Ej: MG-2025"
                    className={`w-full px-3 py-2 border rounded-md ${
                      erroresValidacion["marcaGanado"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["marcaGanado"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["marcaGanado"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field 
              name="CVO"
              validators={{ onChange: ({ value }: any) => validateField("CVO", value) }}
            >
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">CVO *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion(prev => {
                          const { CVO, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    placeholder="Ej: CVO-123456"
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md ${
                      erroresValidacion["CVO"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["CVO"]) && (
                    <p className="text-sm text-red-600 mt-1">
                      {erroresValidacion["CVO"] || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      <NucleoFamiliarSection form={form}/>

      <NavigationButtons 
        showPrev={false} 
        onNext={handleNext}
      />
    </div>
  );
}