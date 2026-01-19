import { useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface NucleoFamiliarSectionProps {
  form: FormLike;
}

export function NucleoFamiliarSection({ form }: NucleoFamiliarSectionProps) {
  const [hombres, setHombres] = useState(0);
  const [mujeres, setMujeres] = useState(0);
  const total = hombres + mujeres;

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Núcleo Familiar (Opcional)</h3>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          Si desea registrar información sobre su núcleo familiar, indique el número de personas.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <form.Field name="nucleoHombres">
            {(field: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                  Número de Hombres
                </label>
                <input
                  type="number"
                  min="0"
                  value={field.state.value || ""}
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0) value = 0;
                    field.handleChange(value);
                    setHombres(value);
                  }}
                  onBlur={field.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="0"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="nucleoMujeres">
            {(field: any) => (
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                  Número de Mujeres
                </label>
                <input
                  type="number"
                  min="0"
                  value={field.state.value || ""}
                  onChange={(e) => {
                    let value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value < 0) value = 0;
                    field.handleChange(value);
                    setMujeres(value);
                  }}
                  onBlur={field.handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                  placeholder="0"
                />

              </div>
            )}
          </form.Field>
        </div>

        {total > 0 && (
          <div className="mt-4 p-3 bg-[#FEF6E0] border border-[#F5E6C5] rounded-md">
            <p className="text-sm text-[#8B6C2E]">
              <span className="font-semibold">Total personas en el núcleo familiar: {total}</span>
              {hombres > 0 && ` (${hombres} ${hombres === 1 ? 'hombre' : 'hombres'}`}
              {hombres > 0 && mujeres > 0 && ', '}
              {mujeres > 0 && `${mujeres} ${mujeres === 1 ? 'mujer' : 'mujeres'}`}
              {(hombres > 0 || mujeres > 0) && ')'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}