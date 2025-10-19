import React, { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface ComercializacionSectionProps {
  form: FormLike;
  showErrors?: boolean;
}

export function ComercializacionSection({ form, showErrors = false }: ComercializacionSectionProps) {
  const existentes = (form as any).state?.values?.comercializacion || {};

  const [canales, setCanales] = useState<string[]>(existentes.canales || []);
  const [otroCanal, setOtroCanal] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (form as any).setFieldValue("comercializacion", { canales });
    
    // Validar cuando cambian los canales
    if (showErrors && canales.length === 0) {
      setError("Debe seleccionar al menos un canal de comercialización");
    } else {
      setError("");
    }
  }, [canales, form, showErrors]);

  const toggleCanal = (canal: string) => {
    setCanales((prev) =>
      prev.includes(canal) ? prev.filter((c) => c !== canal) : [...prev, canal]
    );
  };

  const agregarOtroCanal = () => {
    const trimmed = (otroCanal ?? "").trim();
    if (!trimmed) return;
    
    if (trimmed.length > 75) {
      alert("El texto es muy largo (máx. 75 caracteres).");
      return;
    }
    
    const exists = canales.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Este canal ya fue agregado");
      return;
    }
    
    setCanales((prev) => [...prev, trimmed]);
    setOtroCanal("");
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          11
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Comercialización</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
          Canales de comercialización: * 
        </label>

        <div className="space-y-2">
          {["Subastas", "Carnicerías", "Empacadoras", "Otras fincas"].map((canal) => (
            <div key={canal} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`canal-${canal}`}
                checked={canales.includes(canal)}
                onChange={() => toggleCanal(canal)}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor={`canal-${canal}`} className="text-sm text-[#4A4A4A]">
                {canal}
              </label>
            </div>
          ))}

          {/* Campo "Otras" */}
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={otroCanal}
              onChange={(e) => setOtroCanal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarOtroCanal();
                }
              }}
              placeholder="Otro canal de comercialización."
              className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              maxLength={75}
            />
            <button
              type="button"
              onClick={agregarOtroCanal}
              className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
            >
              Agregar
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-sm text-red-600 mt-2">
              {error}
            </p>
          )}

          {canales.length > 0 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-800 font-medium mb-2">Canales seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {canales.map((canal, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white border border-green-300 rounded-full px-3 py-1 text-xs text-green-700"
                  >
                    {canal}
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