import React from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface RegistroSectionProps {
  form: FormLike;
}

export function RegistroSection({ form }: RegistroSectionProps) {
  const registrosExistentes = (form as any).state?.values?.registrosProductivos;
  
  const [formValues, setFormValues] = React.useState({
    reproductivos: registrosExistentes?.reproductivos || false,
    costosProductivos: registrosExistentes?.costosProductivos || false,
  });

  const handleCheckboxChange = (field: 'reproductivos' | 'costosProductivos') => {
    const newValues = {
      ...formValues,
      [field]: !formValues[field],
    };
    
    setFormValues(newValues);
    form.setFieldValue('registrosProductivos', newValues);
    
    console.log('[RegistroSection] Registros actualizados:', newValues);
  };

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
                onChange={() => handleCheckboxChange('reproductivos')}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: '#708C3E' }}
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
                onChange={() => handleCheckboxChange('costosProductivos')}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: '#708C3E' }}
              />
              <label htmlFor="registrosCostos" className="text-sm text-[#4A4A4A]">
                Sí, de costos de producción.
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="noTieneRegistros"
                type="checkbox"
                checked={!formValues.reproductivos && !formValues.costosProductivos}
                onChange={() => {
                  if (formValues.reproductivos || formValues.costosProductivos) {
                    const newValues = {
                      reproductivos: false,
                      costosProductivos: false,
                    };
                    setFormValues(newValues);
                    form.setFieldValue('registrosProductivos', newValues);
                  }
                }}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: '#708C3E' }}
              />
              <label htmlFor="noTieneRegistros" className="text-sm text-[#4A4A4A]">
                No, no hay.
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}