import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { actividadCultivoSchema } from "../schemas/associateApply";

interface ActividadesInfraestructuraSectionProps {
  form: FormLike;
}

export function ActividadesInfraestructuraSection({ form }: ActividadesInfraestructuraSectionProps) {
  const existentes = (form as any).state?.values?.actividadesInfraestructura || {};

  const [actividades, setActividades] = useState<string[]>(existentes.cultivos || []);
  const [cultivo, setCultivo] = useState<string>("");
  const [cultivoError, setCultivoError] = useState<string | null>(null);

  const [aparatos, setAparatos] = useState<string>(existentes.aparatos?.toString() || "0");
  const [bebederos, setBebederos] = useState<string>(existentes.bebederos?.toString() || "0");
  const [saleros, setSaleros] = useState<string>(existentes.saleros?.toString() || "0");

  useEffect(() => {
    (form as any).setFieldValue("actividadesInfraestructura", {
      cultivos: actividades,
      aparatos: parseInt(aparatos, 10) || 0,
      bebederos: parseInt(bebederos, 10) || 0,
      saleros: parseInt(saleros, 10) || 0,
    });
  }, [actividades, aparatos, bebederos, saleros, form]);

  const agregarActividad = () => {
    const trimmed = cultivo.trim();

    if (!trimmed) {
      setCultivoError("La actividad es requerida");
      return;
    }

    const parsed = actividadCultivoSchema.safeParse(trimmed);
    if (!parsed.success) {
      setCultivoError(parsed.error.issues[0]?.message ?? "Actividad inválida");
      return;
    }

    if (actividades.includes(trimmed)) {
      setCultivoError("Esta actividad ya fue agregada");
      return;
    }

    setActividades([...actividades, trimmed]);
    setCultivo("");
    setCultivoError(null);
  };

  const eliminarActividad = (item: string) => {
    setActividades(actividades.filter((a) => a !== item));
  };

  // ✅ Función helper para manejar inputs numéricos
  const handleNumericInput = (value: string, setter: (val: string) => void) => {
    // Permitir solo números
    const cleaned = value.replace(/\D/g, "");
    
    // Si está vacío, poner "0"
    if (cleaned === "") {
      setter("0");
      return;
    }

    // Remover ceros a la izquierda
    const parsed = parseInt(cleaned, 10);
    setter(parsed.toString());
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          7
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Otras Actividades e Infraestructura de Producción
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            ¿Qué cultivos o actividades tiene en su finca?
          </label>

          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={cultivo}
                onChange={(e) => {
                  setCultivo(e.target.value);
                  if (cultivoError) setCultivoError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarActividad();
                  }
                }}
                placeholder="Ej: Maíz, Huerta, Porcicultura..."
                maxLength={75}
                aria-invalid={!!cultivoError}
                className={[
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
                  cultivoError
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]",
                ].join(" ")}
              />
              {cultivoError && (
                <p className="mt-1 text-sm text-red-600">{cultivoError}</p>
              )}
            </div>

            <button
              type="button"
              onClick={agregarActividad}
              className="px-6 py-2 bg-[#708C3E] text-white rounded-md hover:bg-[#5d7334] transition-colors"
            >
              Agregar
            </button>
          </div>

          {actividades.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {actividades.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white border border-[#CFCFCF] rounded-full px-3 py-1"
                >
                  <span className="text-sm text-[#4A4A4A]">{item}</span>
                  <button
                    type="button"
                    onClick={() => eliminarActividad(item)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipo de infraestructura y equipo para la producción posee? Escriba la cantidad
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            {/* ✅ Aparatos */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Aparatos
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={aparatos}
                onChange={(e) => handleNumericInput(e.target.value, setAparatos)}
                onFocus={(e) => {
                  // Seleccionar todo al hacer foco para fácil reemplazo
                  e.target.select();
                }}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            {/* ✅ Bebederos */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Bebederos
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={bebederos}
                onChange={(e) => handleNumericInput(e.target.value, setBebederos)}
                onFocus={(e) => {
                  e.target.select();
                }}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            {/* ✅ Saleros */}
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Saleros
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={saleros}
                onChange={(e) => handleNumericInput(e.target.value, setSaleros)}
                onFocus={(e) => {
                  e.target.select();
                }}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}