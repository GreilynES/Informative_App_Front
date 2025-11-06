import{ useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface ActividadesInfraestructuraSectionProps {
  form: FormLike;
  showErrors?: boolean;
}

export function ActividadesInfraestructuraSection({ form}: ActividadesInfraestructuraSectionProps) {
  // Carga inicial si el usuario regresa a este paso
  const existentes = (form as any).state?.values?.actividadesInfraestructura || {};

  const [actividades, setActividades] = useState<string[]>(existentes.cultivos || []);
  const [cultivo, setCultivo] = useState<string>("");

  const [aparatos, setAparatos] = useState<number>(existentes.aparatos || 0);
  const [bebederos, setBebederos] = useState<number>(existentes.bebederos || 0);
  const [saleros, setSaleros] = useState<number>(existentes.saleros || 0);

  // Sincroniza con el form global
  useEffect(() => {
    (form as any).setFieldValue("actividadesInfraestructura", {
      cultivos: actividades,
      aparatos,
      bebederos,
      saleros,
    });
  }, [actividades, aparatos, bebederos, saleros, form]);

  const agregarActividad = () => {
    const trimmed = cultivo.trim();
    if (!trimmed) return;

    if (actividades.includes(trimmed)) {
      alert("Esta actividad ya fue agregada");
      return;
    }

    setActividades([...actividades, trimmed]);
    setCultivo("");
  };

  const eliminarActividad = (item: string) => {
    setActividades(actividades.filter((a) => a !== item));
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          8
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Otras Actividades e Infraestructura de Producción
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Cultivos/Actividades */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
            ¿Qué cultivos o actividades tiene en su finca?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cultivo}
              onChange={(e) => setCultivo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarActividad();
                }
              }}
              placeholder="Ej: Maíz, Huerta, Porcicultura..."
              className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
            <button
              type="button"
              onClick={agregarActividad}
              className="px-6 py-2 bg-[#708C3E] text-white rounded-md hover:bg-[#5d7334] transition-colors"
            >
              Agregar
            </button>
          </div>

          {/* Lista de actividades agregadas */}
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

        {/* Infraestructura */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipo de infraestructura y equipo para la producción posee? Escriba la cantidad
          </label>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Aparatos
              </label>
              <input
                type="number"
                min="0"
                value={aparatos}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setAparatos(isNaN(val) || val < 0 ? 0 : val);
                }}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Bebederos
              </label>
              <input
                type="number"
                min="0"
                value={bebederos}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBebederos(isNaN(val) || val < 0 ? 0 : val);
                }}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4A4A4A] mb-1">
                Saleros
              </label>
              <input
                type="number"
                min="0"
                value={saleros}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSaleros(isNaN(val) || val < 0 ? 0 : val);
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