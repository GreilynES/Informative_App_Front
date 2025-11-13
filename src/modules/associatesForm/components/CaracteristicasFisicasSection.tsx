
import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface CaracteristicasFisicasSectionProps {
  form: FormLike;
  showErrors?: boolean;
}

export function CaracteristicasFisicasSection({ form}: CaracteristicasFisicasSectionProps) {
  const existentes = (form as any).state?.values?.caracteristicasFisicas || {};

  const [tiposCerca, setTiposCerca] = useState<string[]>(existentes.tiposCerca || []);
  const [equipos, setEquipos] = useState<string[]>(existentes.equipos || []);
  const [otraCerca, setOtraCerca] = useState<string>("");
  const [otroEquipo, setOtroEquipo] = useState<string>("");

  useEffect(() => {
    (form as any).setFieldValue("caracteristicasFisicas", {
      tiposCerca,
      equipos,
    });
  }, [tiposCerca, equipos, form]);

  const toggleCerca = (cerca: string) => {
    setTiposCerca((prev) =>
      prev.includes(cerca) ? prev.filter((c) => c !== cerca) : [...prev, cerca]
    );
  };

  const toggleEquipo = (equipo: string) => {
    setEquipos((prev) =>
      prev.includes(equipo) ? prev.filter((e) => e !== equipo) : [...prev, equipo]
    );
  };

  const agregarOtraCerca = () => {
    const trimmed = otraCerca.trim();
    if (!trimmed) return;
    
    if (trimmed.length > 75) {
      alert("El texto es muy largo (máx. 75 caracteres).");
      return;
    }

    // Solo letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmed)) {
      alert("Solo se permiten letras y espacios");
      return;
    }
    
    const exists = tiposCerca.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Este tipo de cerca ya fue agregado");
      return;
    }
    
    setTiposCerca((prev) => [...prev, trimmed]);
    setOtraCerca("");
  };

  const agregarOtroEquipo = () => {
    const trimmed = otroEquipo.trim();
    if (!trimmed) return;
    
    if (trimmed.length > 75) {
      alert("El texto es muy largo (máx. 75 caracteres).");
      return;
    }

    // Solo letras y espacios
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmed)) {
      alert("Solo se permiten letras y espacios");
      return;
    }
    
    const exists = equipos.some((e) => e.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Este equipo ya fue agregado");
      return;
    }
    
    setEquipos((prev) => [...prev, trimmed]);
    setOtroEquipo("");
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          9
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Características Físicas</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Tipos de Cerca */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Tipos de cerca:
          </label>
         <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
            i
          </span>
          <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Marca los tipos de cerca que aplican. Para otro tipo, escríbelo y presiona{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span>.
          </p>
        </div>

          <div className="space-y-2">
            {["Alambre de púas", "Eléctrica", "Viva", "Muerta"].map((cerca) => (
              <div key={cerca} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`cerca-${cerca}`}
                  checked={tiposCerca.includes(cerca)}
                  onChange={() => toggleCerca(cerca)}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                  style={{ accentColor: "#708C3E" }}
                />
                <label htmlFor={`cerca-${cerca}`} className="text-sm text-[#4A4A4A]">
                  {cerca}
                </label>
              </div>
            ))}

            {/* Campo "Otra" */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={otraCerca}
                onChange={(e) => setOtraCerca(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarOtraCerca();
                  }
                }}
                placeholder="Otro tipo de cerca"
                className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                maxLength={75}
              />
              <button
                type="button"
                onClick={agregarOtraCerca}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {tiposCerca.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800 font-medium mb-2">Tipos de cerca seleccionados:</p>
                <div className="flex flex-wrap gap-2">
                  {tiposCerca.map((cerca, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
                    >
                      {cerca}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Equipos */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Equipos disponibles:
          </label>
          <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
            i
            </span>
          <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Selecciona los equipos que tiene la finca. Para otro equipo, escríbelo y presiona{" "}
            <span className="font-semibold text-[#708C3E]">Agregar</span>.
          </p>
          </div>

          <div className="space-y-2">
            {["Tractor", "Picadora", "Mezcladora", "Bomba de agua"].map((equipo) => (
              <div key={equipo} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`equipo-${equipo}`}
                  checked={equipos.includes(equipo)}
                  onChange={() => toggleEquipo(equipo)}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                  style={{ accentColor: "#708C3E" }}
                />
                <label htmlFor={`equipo-${equipo}`} className="text-sm text-[#4A4A4A]">
                  {equipo}
                </label>
              </div>
            ))}

            {/* Campo "Otro" */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={otroEquipo}
                onChange={(e) => setOtroEquipo(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarOtroEquipo();
                  }
                }}
                placeholder="Otro equipo"
                className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                maxLength={75}
              />
              <button
                type="button"
                onClick={agregarOtroEquipo}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {equipos.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800 font-medium mb-2">Equipos seleccionados:</p>
                <div className="flex flex-wrap gap-2">
                  {equipos.map((equipo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-green-300 rounded-full px-3 py-1 text-xs text-green-700"
                    >
                      {equipo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}