import { useEffect, useState } from "react";
import { ZodError } from "zod";
import type { FormLike } from "../../../shared/types/form-lite";
import { fincaBasicSchema } from "../schema/fincaSchema";

interface FincaBasicInfoProps {
  form: FormLike;
  forceValidation?: boolean;
}

export function FincaBasicInfo({ form, forceValidation = false }: FincaBasicInfoProps) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  
  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (fincaBasicSchema.shape as any)[name];
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

  // Validar todos los campos cuando forceValidation cambia a true
  useEffect(() => {
    if (forceValidation) {
      const values = (form as any).state?.values || {};
      const errors: Record<string, string> = {};

      if (!values.nombreFinca || values.nombreFinca.trim().length === 0) {
        errors.nombreFinca = "El nombre de la finca es requerido";
      }

      if (!values.areaHa || String(values.areaHa).trim() === "" || Number(values.areaHa) <= 0) {
        errors.areaHa = "El área es requerida";
      }

      if (!values.numeroPlano || values.numeroPlano.trim().length === 0) {
        errors.numeroPlano = "El número de plano es requerido";
      }

      setLocalErrors(errors);
    }
  }, [forceValidation, form]);

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Información de la Finca</h3>
      </div>

      <div className="p-6 space-y-4">
        <form.Field 
          name="nombreFinca"
          validators={{ onChange: ({ value }: any) => validateField("nombreFinca", value) }}
        >
          {(f: any) => {
            const showError = (f.state.meta.errors?.length > 0 || localErrors.nombreFinca);
            return (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre de la Finca *</label>
                <input
                  type="text"
                  value={f.state.value}
                  onChange={(e) => {
                    f.handleChange(e.target.value);
                    if (localErrors.nombreFinca) {
                      setLocalErrors(prev => {
                        const { nombreFinca, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  onBlur={f.handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                    showError 
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  }`}
                  placeholder="Ej: Finca La Esperanza"
                  maxLength={100}
                />
                {showError && (
                  <p className="text-sm text-red-600 mt-1">
                    {localErrors.nombreFinca || f.state.meta.errors[0]}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field 
            name="areaHa"
            validators={{ onChange: ({ value }: any) => validateField("areaHa", value) }}
          >
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || localErrors.areaHa);
              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Área (Hectáreas) *</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    pattern="[1-9][0-9]*"
                    value={f.state.value}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '');
                      if (v !== "" && (v.startsWith("0") || parseInt(v) === 0)) v = "";
                      f.handleChange(v);
                      if (localErrors.areaHa) {
                        setLocalErrors(prev => {
                          const { areaHa, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                      showError 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Ej: 12345"
                    maxLength={50}
                    min={1}
                  />
                  {showError && (
                    <p className="text-sm text-red-600 mt-1">
                      {localErrors.areaHa || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field 
            name="numeroPlano"
            validators={{ onChange: ({ value }: any) => validateField("numeroPlano", value) }}
          >
            {(f: any) => {
              const showError = (f.state.meta.errors?.length > 0 || localErrors.numeroPlano);
              return (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Número de Plano *</label>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => {
                      f.handleChange(e.target.value);
                      if (localErrors.numeroPlano) {
                        setLocalErrors(prev => {
                          const { numeroPlano, ...rest } = prev;
                          return rest;
                        });
                      }
                    }}
                    onBlur={f.handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
                      showError 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                    }`}
                    placeholder="Ej: P-2025-001"
                    maxLength={50}
                  />
                  {showError && (
                    <p className="text-sm text-red-600 mt-1">
                      {localErrors.numeroPlano || f.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>
      </div>
    </div>
  );
}