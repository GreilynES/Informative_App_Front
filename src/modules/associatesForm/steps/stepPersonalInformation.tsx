import { useRef, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { ZodError } from "zod";
import { associateApplySchema } from "../schemas/associateApply";
import { NavigationButtons } from "../components/NavigationButtons";
import { NucleoFamiliarSection } from "../components/FamilyNucleusSection";

// ✅ servicios
import {
  existsCedula, // (debe validar si ya existe ASOCIADO por cédula)
  lookupPersonaByCedulaForForms, // GET /personas/cedula/:cedula  (DB -> DTO)
  validateSolicitudAsociado, // POST /solicitudes/validate (pendiente / ya-es-asociado)
} from "../services/associatesFormService";

interface Step1Props {
  form: FormLike;
  lookup: (id: string) => Promise<any>; // TSE
  onNext: () => void;
  canProceed: boolean;
}

export function Step1({ form, lookup, onNext }: Step1Props) {
  const [intentoAvanzar, setIntentoAvanzar] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});
  const [verificandoCedula, setVerificandoCedula] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const lastLookupRef = useRef<string>("");

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema.shape as any)[name];
      if (fieldSchema) fieldSchema.parse(value);
      return undefined;
    } catch (error) {
      if (error instanceof ZodError) return error.issues[0]?.message || "Error de validación";
      return "Error de validación";
    }
  };

  const lookupCombined = async (id: string) => {
    const ced = (id ?? "").trim();
    if (!ced) return null;

    const db = await lookupPersonaByCedulaForForms(ced);

    // Caso 1: PersonaFormLookupDto
    if (db?.found) {
      console.log("[lookupCombined][ASSOC] usando DB (DTO)");
      return {
        source: "DB",
        ...(db.legacy ?? {}),
        volunteerIndividual: db.volunteerIndividual,
        persona: db.persona,
      };
    }

    // Caso 2: por si algún día devuelve entity directo
    if (db?.cedula && db?.nombre && db?.apellido1) {
      console.log("[lookupCombined][ASSOC] usando DB (ENTITY)");
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
      };
    }

    const tse = await lookup(ced);
    return tse ? { source: "TSE", ...tse } : null;
  };

  const validarCedulaUnica = async (cedula: string): Promise<string | undefined> => {
    const v = (cedula ?? "").trim();
    if (!v || v.length < 8) return undefined;

    setVerificandoCedula(true);
    try {
      const existe = await existsCedula(v);
      if (existe) return "Esta cédula ya está registrada en el sistema";
      return undefined;
    } catch {
      // no bloquear por error de red
      return undefined;
    } finally {
      setVerificandoCedula(false);
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

  const precheckAndAutofill = async (digits: string) => {
    if (!digits || digits.length < 9) return;

    if (lastLookupRef.current === digits) return;
    lastLookupRef.current = digits;

    setVerificandoCedula(true);
    try {
      await validateSolicitudAsociado(digits);

      // 2) lookup (DB -> TSE)
      const r = await lookupCombined(digits);
      if (!r) return;

      form.setFieldValue("nombre", r.firstname || "");
      form.setFieldValue("apellido1", r.lastname1 || "");
      form.setFieldValue("apellido2", r.lastname2 || "");

      if (r.source === "DB") {
        const vi = r.volunteerIndividual ?? {};
        if (vi.phone != null) form.setFieldValue("telefono", String(vi.phone));
        if (vi.email != null) form.setFieldValue("email", String(vi.email));
        if (vi.birthDate != null) form.setFieldValue("fechaNacimiento", String(vi.birthDate));
        if (vi.address != null) form.setFieldValue("direccion", String(vi.address));
      }

      // limpiar error cédula si todo ok
      setErroresValidacion((prev) => {
        const { cedula, ...rest } = prev;
        return rest;
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const payload = err?.response?.data;

      if (status === 409) {
        const msg =
          payload?.message ||
          "Ya enviaste una solicitud y está en revisión. No puedes enviar otra con esta cédula.";
        setErroresValidacion((prev) => ({ ...prev, cedula: msg }));
        return;
      }

      // error inesperado: no bloquear, pero avisar
      setErroresValidacion((prev) => ({
        ...prev,
        cedula: "No se pudo validar la cédula. Intenta de nuevo.",
      }));
    } finally {
      setVerificandoCedula(false);
    }
  };

  const handleNext = async () => {
    setIntentoAvanzar(true);
    const values = (form as any).state?.values || {};
    const errores: Record<string, string> = {};

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

    for (const { name, label, minLength } of camposObligatorios) {
      const valor = values[name];

      if (!valor || (typeof valor === "string" && valor.trim().length === 0)) {
        errores[name] = `${label} es obligatorio`;
      } else if (minLength && valor.length < minLength) {
        errores[name] = `${label} debe tener al menos ${minLength} caracteres`;
      } else {
        const errorZod = validateField(name, valor);
        if (errorZod) errores[name] = errorZod;
      }
    }

    if (values.cedula && !errores.cedula) {
      // 1) validar no-duplicado de ASOCIADO
      const errorCedula = await validarCedulaUnica(values.cedula);
      if (errorCedula) errores.cedula = errorCedula;

      //    Solo si no hay error por unicidad
      if (!errores.cedula) {
        const digits = String(values.cedula ?? "").replace(/\D/g, "");
        try {
          await validateSolicitudAsociado(digits);
        } catch (err: any) {
          const status = err?.response?.status;
          const payload = err?.response?.data;
          if (status === 409) {
            errores.cedula =
              payload?.message ||
              "Ya enviaste una solicitud y está en revisión. No puedes enviar otra con esta cédula.";
          }
        }
      }
    }

    const viveEnFinca = values.viveEnFinca ?? true;
    if (!viveEnFinca) {
      const distancia = values.distanciaFinca;
      if (!distancia || distancia === "" || Number(distancia) <= 0) {
        errores["distanciaFinca"] = "La distancia debe ser mayor a 0";
      } else {
        const errorZod = validateField("distanciaFinca", distancia);
        if (errorZod) errores["distanciaFinca"] = errorZod;
      }
    }

    setErroresValidacion(errores);

    if (Object.keys(errores).length > 0) {
      const primerCampoError = Object.keys(errores)[0];
      const elemento = document.querySelector(`[name="${primerCampoError}"]`);
      if (elemento) elemento.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información Personal</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="cedula" validators={{ onChange: ({ value }: any) => validateField("cedula", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cédula o Pasaporte*</label>

                  <div className="relative">
                    <input
                      type="text"
                      value={f.state.value}
                      onChange={(e) => {
                        const v = e.target.value;
                        f.handleChange(v);

                        // limpiar error cédula
                        setErroresValidacion((prev) => {
                          const { cedula, ...rest } = prev;
                          return rest;
                        });

                        const digits = v.replace(/\D/g, "");
                        if (digits.length >= 9) {
                          if (debounceRef.current) window.clearTimeout(debounceRef.current);

                          debounceRef.current = window.setTimeout(() => {
                            precheckAndAutofill(digits);
                          }, 350);
                        } else {
                          lastLookupRef.current = "";
                        }
                      }}
                      onBlur={async (e) => {
                        f.handleBlur();
                        const cedula = e.target.value.trim();
                        const digits = cedula.replace(/\D/g, "");

                        if (digits.length >= 9) {
                          if (debounceRef.current) window.clearTimeout(debounceRef.current);
                          await precheckAndAutofill(digits);
                        }

                        if (cedula.length >= 8) {
                          const errorUnicidad = await validarCedulaUnica(cedula);
                          if (errorUnicidad) {
                            setErroresValidacion((prev) => ({ ...prev, cedula: errorUnicidad }));
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
                        <svg
                          className="animate-spin h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {(f.state.meta.errors?.length > 0 || erroresValidacion["cedula"]) && (
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["cedula"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="nombre" validators={{ onChange: ({ value }: any) => validateField("nombre", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["nombre"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="apellido1" validators={{ onChange: ({ value }: any) => validateField("apellido1", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primer Apellido *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["apellido1"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="apellido2" validators={{ onChange: ({ value }: any) => validateField("apellido2", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segundo Apellido *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["apellido2"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="fechaNacimiento" validators={{ onChange: ({ value }: any) => validateField("fechaNacimiento", value) }}>
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  required
                  value={f.state.value}
                  onChange={(e) => {
                    const inputDate = e.target.value;
                    if (intentoAvanzar) {
                      setErroresValidacion((prev) => {
                        const { fechaNacimiento, ...rest } = prev;
                        return rest;
                      });
                    }
                    if (!inputDate) f.handleChange("");
                    else if (inputDate > adultMaxDate) f.handleChange(adultMaxDate);
                    else f.handleChange(inputDate);
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
                  <p className="text-sm text-red-600 mt-1">{erroresValidacion["fechaNacimiento"] || f.state.meta.errors[0]}</p>
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
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Información de Contacto</h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <form.Field name="telefono" validators={{ onChange: ({ value }: any) => validateField("telefono", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      f.handleChange(value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["telefono"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="email" validators={{ onChange: ({ value }: any) => validateField("email", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Email *</label>
                  <input
                    type="email"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      setErroresValidacion((prev) => {
                        const { email, ...rest } = prev;
                        return rest;
                      });
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                      erroresValidacion["email"]
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="correo@ejemplo.com"
                  />
                  {(f.state.meta.errors?.length > 0 || erroresValidacion["email"]) && (
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["email"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="direccion" validators={{ onChange: ({ value }: any) => validateField("direccion", value) }}>
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
                {f.state.meta.errors?.length > 0 && <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>}
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
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
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
                        setErroresValidacion((prev) => {
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
                            const filtered = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : value;

                            if (filtered === "" || filtered === "0" || parseFloat(filtered) === 0) {
                              f.handleChange("");
                              return;
                            }

                            f.handleChange(filtered);
                            if (intentoAvanzar) {
                              setErroresValidacion((prev) => {
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
            <form.Field name="marcaGanado" validators={{ onChange: ({ value }: any) => validateField("marcaGanado", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Marca de Ganado *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["marcaGanado"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="CVO" validators={{ onChange: ({ value }: any) => validateField("CVO", value) }}>
              {(f: any) => (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">CVO *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (intentoAvanzar) {
                        setErroresValidacion((prev) => {
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
                    <p className="text-sm text-red-600 mt-1">{erroresValidacion["CVO"] || f.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      <NucleoFamiliarSection form={form} />

      <NavigationButtons showPrev={false} onNext={handleNext} />
    </div>
  );
}
