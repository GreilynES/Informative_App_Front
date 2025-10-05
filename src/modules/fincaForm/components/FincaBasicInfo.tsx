import { ZodError } from "zod";
import type { FormLike } from "../../../shared/types/form-lite";
import { fincaBasicSchema } from "../schema/fincaSchema";

interface FincaBasicInfoProps {
  form: FormLike;
}

export function FincaBasicInfo({ form }: FincaBasicInfoProps) {
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
          {(f: any) => (
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nombre de la Finca *</label>
              <input
                type="text"
                value={f.state.value}
                onChange={(e) => f.handleChange(e.target.value)}
                onBlur={f.handleBlur}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Ej: Finca La Esperanza"
                maxLength={100}
              />
              {f.state.meta.errors?.length > 0 && (
                <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field 
            name="areaHa"
            validators={{ onChange: ({ value }: any) => validateField("areaHa", value) }}
          >
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Área (Hectáreas) *</label>
                <input
                  type="text"
                  value={f.state.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d.]/g, '');
                    const parts = value.split('.');
                    const filtered = parts.length > 2 
                      ? parts[0] + '.' + parts.slice(1).join('') 
                      : value;
                    f.handleChange(filtered);
                  }}
                  onBlur={f.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: 15.50"
                />
                {f.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field 
            name="numeroPlano"
            validators={{ onChange: ({ value }: any) => validateField("numeroPlano", value) }}
          >
            {(f: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Número de Plano *</label>
                <input
                  type="text"
                  value={f.state.value}
                  onChange={(e) => f.handleChange(e.target.value)}
                  onBlur={f.handleBlur}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="Ej: P-2025-001"
                  maxLength={50}
                />
                {f.state.meta.errors?.length > 0 && (
                  <p className="text-sm text-red-600 mt-1">{f.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </div>
  );
}