import React, { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface AccesoSectionProps {
  form: FormLike;
}

export function AccesoSection({ form }: AccesoSectionProps) {
  const existentes = (form as any).state?.values?.viasAcceso || {};

  const [accesos, setAccesos] = useState<string[]>(existentes.accesos || []);
  const [otroAcceso, setOtroAcceso] = useState<string>("");

  useEffect(() => {
    console.log('[AccesoSection] 🔄 Actualizando formulario:', { accesos });
    
    (form as any).setFieldValue("viasAcceso", {
      accesos,
    });
  }, [accesos, form]);

  const toggleAcceso = (acceso: string) => {
    if (accesos.includes(acceso)) {
      setAccesos(accesos.filter((a) => a !== acceso));
    } else {
      setAccesos([...accesos, acceso]);
    }
  };

  const agregarOtroAcceso = () => {
    const trimmed = otroAcceso.trim();
    if (!trimmed) return;
    if (accesos.includes(trimmed)) {
      alert("Este tipo de acceso ya fue agregado");
      return;
    }
    setAccesos([...accesos, trimmed]);
    setOtroAcceso("");
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Vías de Acceso
        </h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
          Vías de acceso:
        </label>

        <div className="space-y-2">
          {["Externas", "Internas"].map((acceso) => (
            <div key={acceso} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`acceso-${acceso}`}
                checked={accesos.includes(acceso)}
                onChange={() => toggleAcceso(acceso)}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor={`acceso-${acceso}`} className="text-sm text-[#4A4A4A]">
                {acceso}
              </label>
            </div>
          ))}

          {/* Campo "Otras" con input */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={otroAcceso}
              onChange={(e) => setOtroAcceso(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarOtroAcceso();
                }
              }}
              placeholder="Otras vías de acceso..."
              className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
            <button
              type="button"
              onClick={agregarOtroAcceso}
              className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
            >
              Agregar
            </button>
          </div>

          {accesos.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-800 font-medium mb-2">
                Vías de acceso seleccionadas:
              </p>
              <div className="flex flex-wrap gap-2">
                {accesos.map((acceso, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
                  >
                    {acceso}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}