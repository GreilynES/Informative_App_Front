import  { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { ClipboardList } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
    <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
        <ClipboardList className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-[#708C3E]">Registro y gestión de recursos en la finca</h3>
    </div>

    <div className="p-6 space-y-4">
      <p className="text-sm font-medium text-[#4A4A4A]">
        ¿Lleva registros en su finca? Marque todas las que posee. *
      </p>

      {/* checkbox base como el tuyo */}
      {(() => {
        const checkboxBase =
          "border-[#DCD6C9] data-[state=checked]:bg-[#708C3E] data-[state=checked]:border-[#708C3E] " +
          "focus-visible:ring-[#708C3E]/30 focus-visible:ring-2 focus-visible:ring-offset-0"
        return (
          <div className="space-y-1">
            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30">
              <Checkbox
                checked={formValues.reproductivos}
                onCheckedChange={() => toggleRegistro("reproductivos")}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Sí, de reproductivos en bovinos.</span>
            </label>

            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30">
              <Checkbox
                checked={formValues.costosProductivos}
                onCheckedChange={() => toggleRegistro("costosProductivos")}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">Sí, de costos de producción.</span>
            </label>

            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-[#E6EDC8]/30">
              <Checkbox
                checked={formValues.noTiene}
                onCheckedChange={handleNoTiene}
                className={checkboxBase}
              />
              <span className="text-sm text-gray-700">No, no hay.</span>
            </label>
          </div>
        )
      })()}

      <p className="text-xs text-gray-500">
        No puede seleccionar &quot;No hay&quot; junto con otros registros.
      </p>

      {error && <p className="text-sm text-[#9c1414]">{error}</p>}
    </div>
  </div>
)

}