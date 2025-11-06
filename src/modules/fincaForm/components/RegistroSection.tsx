import  { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface RegistroSectionProps {
  form: FormLike;
  onChange?: () => void;
  showErrors?: boolean;
}

export function RegistroSection({ form, onChange, showErrors = false }: RegistroSectionProps) {
  const registrosExistentes = (form as any).state?.values?.registrosProductivos;

  const [formValues, setFormValues] = useState({
    reproductivos: Boolean(registrosExistentes?.reproductivos) || false,
    costosProductivos: Boolean(registrosExistentes?.costosProductivos) || false,
    noTiene: Boolean(registrosExistentes?.noTiene) || false,
  });

  const [error, setError] = useState<string>("");

  // Inicializa el form global si no hay valores
  useEffect(() => {
    if (!registrosExistentes) {
      (form as any).setFieldValue("registrosProductivos", {
        reproductivos: false,
        costosProductivos: false,
        noTiene: false,
      });
    } else {
      setFormValues({
        reproductivos: Boolean(registrosExistentes.reproductivos),
        costosProductivos: Boolean(registrosExistentes.costosProductivos),
        noTiene: Boolean(registrosExistentes.noTiene),
      });
    }
  }, []);

  // Sincroniza con form y valida
  useEffect(() => {
    const hasValue =
      formValues.reproductivos || formValues.costosProductivos || formValues.noTiene;
    
    if (hasValue) {
      (form as any).setFieldValue("registrosProductivos", formValues);
      setError("");
    } else if (showErrors) {
      setError("Debe seleccionar al menos una opción de registro");
    }
    
    onChange?.();
  }, [formValues, form, onChange, showErrors]);

  // Manejadores de checkboxes
  const toggleRegistro = (field: "reproductivos" | "costosProductivos") => {
    const newValues = {
      ...formValues,
      [field]: !formValues[field],
      noTiene: false, // Nunca "No hay" junto a otros
    };
    setFormValues(newValues);
  };

  const handleNoTiene = () => {
    setFormValues({
      reproductivos: false,
      costosProductivos: false,
      noTiene: true,
    });
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a1 1 0 00-1 1v12a1 1 0 001.447.894L10 14.118l5.553 2.776A1 1 0 0017 16V4a1 1 0 00-1.553-.894L10 5.882 4.447 3.106A1 1 0 004 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Registro y gestión de recursos en la finca
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Lleva registros en su finca? Marque todas las que posee. *
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                id="registrosReproductivos"
                type="checkbox"
                checked={formValues.reproductivos}
                onChange={() => toggleRegistro("reproductivos")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="registrosReproductivos" className="text-sm text-[#4A4A4A]">
                Sí, de reproductivos en bovinos.
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="registrosCostos"
                type="checkbox"
                checked={formValues.costosProductivos}
                onChange={() => toggleRegistro("costosProductivos")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="registrosCostos" className="text-sm text-[#4A4A4A]">
                Sí, de costos de producción.
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="noTieneRegistros"
                type="checkbox"
                checked={formValues.noTiene}
                onChange={handleNoTiene}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="noTieneRegistros" className="text-sm text-[#4A4A4A]">
                No, no hay.
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              No puede seleccionar "No hay" junto con otros registros.
            </p>

            {/* Mensaje de error */}
            {error && (
              <p className="text-sm text-red-600 mt-2">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}