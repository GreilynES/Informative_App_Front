import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface AccesoSectionProps {
  form: FormLike;
  showErrors?: boolean; // Para mostrar errores cuando se intenta avanzar
}

export function AccesoSection({ form, showErrors = false }: AccesoSectionProps) {
  const existentes = (form as any).state?.values?.viasAcceso || {};

  const [accesos, setAccesos] = useState<string[]>(existentes.accesos || []);
  const [otroAcceso, setOtroAcceso] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (form as any).setFieldValue("viasAcceso", { accesos });
    
    // Validar cuando cambian los accesos
    if (showErrors && accesos.length === 0) {
      setError("Debe seleccionar al menos una vía de acceso");
    } else {
      setError("");
    }
  }, [accesos, form, showErrors]);

  const toggleAcceso = (acceso: string) => {
    setAccesos((prev) =>
      prev.includes(acceso) ? prev.filter((a) => a !== acceso) : [...prev, acceso]
    );
  };

  const agregarOtroAcceso = () => {
    const trimmed = (otroAcceso ?? "").trim();
    if (!trimmed) return;
    
    if (trimmed.length > 75) {
      alert("El texto es muy largo (máx. 75 caracteres).");
      return;
    }
    
    const exists = accesos.some((a) => a.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Este tipo de acceso ya fue agregado");
      return;
    }
    
    setAccesos((prev) => [...prev, trimmed]);
    setOtroAcceso("");
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          10
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Vías de Acceso</h3>
      </div>

      <div className="p-6 space-y-4">
        <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
          Vías de acceso: *
        </label>
       <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
            <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E]  text-white text-xs font-bold">
              i
          </span>
          <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Selecciona una o varias vías. Para agregar otra, escríbela y presiona{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span>.
          </p>
        </div>

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

          {/* Campo "Otras" */}
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
              placeholder="Otras vías de acceso."
              className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              maxLength={75}
            />
            <button
              type="button"
              onClick={agregarOtroAcceso}
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