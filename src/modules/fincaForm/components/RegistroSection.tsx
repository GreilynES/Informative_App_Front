import React from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface RegistroSectionProps {
  form: FormLike;
}

export function RegistroSection({ form }: RegistroSectionProps) {
  // Lee lo que haya en el form (puede venir null la 1ra vez)
  const registrosExistentes = (form as any).state?.values?.registrosProductivos;

  // Estado local con valores seguros
  const [formValues, setFormValues] = React.useState({
    reproductivos: Boolean(registrosExistentes?.reproductivos) || false,
    costosProductivos: Boolean(registrosExistentes?.costosProductivos) || false,
  });

  // Al montar: asegura que el form tenga un objeto válido (no null)
  React.useEffect(() => {
    if (!registrosExistentes) {
      (form as any).setFieldValue("registrosProductivos", {
        reproductivos: false,
        costosProductivos: false,
      });
    } else {
      setFormValues({
        reproductivos: Boolean(registrosExistentes.reproductivos),
        costosProductivos: Boolean(registrosExistentes.costosProductivos),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza con el form global cada vez que cambia algo
  React.useEffect(() => {
    (form as any).setFieldValue("registrosProductivos", {
      reproductivos: Boolean(formValues.reproductivos),
      costosProductivos: Boolean(formValues.costosProductivos),
    });
  }, [formValues, form]);

  const handleCheckboxChange = (field: "reproductivos" | "costosProductivos") => {
    const newValues = { ...formValues, [field]: !formValues[field] };
    setFormValues(newValues);
    console.log("[RegistroSection] Registros actualizados:", newValues);
  };

  // “No, no hay” — desmarca ambos si alguno está activo
  const handleNoTiene = () => {
    if (formValues.reproductivos || formValues.costosProductivos) {
      const newValues = { reproductivos: false, costosProductivos: false };
      setFormValues(newValues);
      (form as any).setFieldValue("registrosProductivos", newValues);
      console.log("[RegistroSection] Registros desactivados:", newValues);
    }
  };

  const noTiene = !formValues.reproductivos && !formValues.costosProductivos;

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9] mb-6">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-[#708C3E] flex items-center justify-center">
          <span className="text-[#708C3E] font-medium">○</span>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Registro y gestión de recursos en la finca
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Lleva registros en su finca? Marque todas las que posee.
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                id="registrosReproductivos"
                type="checkbox"
                checked={formValues.reproductivos}
                onChange={() => handleCheckboxChange("reproductivos")}
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
                onChange={() => handleCheckboxChange("costosProductivos")}
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
                checked={noTiene}
                onChange={handleNoTiene}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="noTieneRegistros" className="text-sm text-[#4A4A4A]">
                No, no hay.
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Puedes seleccionar una o ambas opciones. “No, no hay” desmarca las anteriores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
