import React, { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface NecesidadesSectionProps {
  form: FormLike;
}

export function NecesidadesSection({ form }: NecesidadesSectionProps) {
  const existentes = (form as any).state?.values?.necesidadesObservaciones || {};

  const [necesidades, setNecesidades] = useState<string[]>(
    existentes.necesidades || ["", "", "", "", ""]
  );

  useEffect(() => {
    (form as any).setFieldValue("necesidadesObservaciones", {
      necesidades,
    });
  }, [necesidades, form]);

  const handleNecesidadChange = (index: number, value: string) => {
    const v = value.length > 255 ? value.slice(0, 255) : value;
    setNecesidades((prev) => {
      const next = prev.slice();
      next[index] = v;
      return next;
    });
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
      <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
        12
      </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Necesidades y Observaciones
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Necesidades/Mejoras */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
          Mencione las necesidades o mejoras que su finca requiere actualmente (hasta 5):
          </label>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num}>
                <label className="block text-xs text-gray-500 mb-1">
                  Necesidad/Mejora {num}:
                </label>
                <input
                  type="text"
                  value={necesidades[num - 1]}
                  onChange={(e) => handleNecesidadChange(num - 1, e.target.value)}
                  placeholder={`Ingrese la necesidad/mejora ${num}.`}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  maxLength={255}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
