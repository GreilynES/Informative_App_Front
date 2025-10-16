import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { otroCercaSchema, otroEquipoSchema } from "../schemas/associateApply";




interface CaracteristicasFisicasSectionProps {
  form: FormLike;
}

export function CaracteristicasFisicasSection({ form }: CaracteristicasFisicasSectionProps) {
  const existentes = (form as any).state?.values?.caracteristicasFisicas || {};

  const [tiposCerca, setTiposCerca] = useState<string[]>(existentes.tiposCerca || []);
  const [otroCerca, setOtroCerca] = useState<string>("");
  const [otroCercaError, setOtroCercaError] = useState<string | null>(null);

  const [equipos, setEquipos] = useState<string[]>(existentes.equipos || []);
  const [otroEquipo, setOtroEquipo] = useState<string>("");
  const [otroEquipoError, setOtroEquipoError] = useState<string | null>(null);

  useEffect(() => {
    (form as any).setFieldValue("caracteristicasFisicas", {
      tiposCerca,
      equipos,
    });
  }, [tiposCerca, equipos, form]);

  const toggleCerca = (tipo: string) => {
    if (tiposCerca.includes(tipo)) {
      setTiposCerca(tiposCerca.filter((t) => t !== tipo));
    } else {
      setTiposCerca([...tiposCerca, tipo]);
    }
  };

  const agregarOtroCerca = () => {
    const trimmed = otroCerca.trim();

    if (!trimmed) {
      setOtroCercaError("El tipo de cerca es requerido");
      return;
    }
    const parsed = otroCercaSchema.safeParse(trimmed);
    if (!parsed.success) {
      setOtroCercaError(parsed.error.issues[0]?.message ?? "Valor inválido");
      return;
    }
    if (tiposCerca.includes(trimmed)) {
      setOtroCercaError("Este tipo de cerca ya fue agregado");
      return;
    }

    setTiposCerca([...tiposCerca, trimmed]);
    setOtroCerca("");
    setOtroCercaError(null);
  };

  const toggleEquipo = (equipo: string) => {
    if (equipos.includes(equipo)) {
      setEquipos(equipos.filter((e) => e !== equipo));
    } else {
      setEquipos([...equipos, equipo]);
    }
  };

  const agregarOtroEquipo = () => {
    const trimmed = otroEquipo.trim();

    if (!trimmed) {
      setOtroEquipoError("El nombre del equipo es requerido");
      return;
    }
    const parsed = otroEquipoSchema.safeParse(trimmed);
    if (!parsed.success) {
      setOtroEquipoError(parsed.error.issues[0]?.message ?? "Valor inválido");
      return;
    }
    if (equipos.includes(trimmed)) {
      setOtroEquipoError("Este equipo ya fue agregado");
      return;
    }

    setEquipos([...equipos, trimmed]);
    setOtroEquipo("");
    setOtroEquipoError(null);
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          8
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Características físicas y equipos de la finca
        </h3>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            ¿Qué tipo de cerca posee su finca? Seleccione el tipo:
          </label>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cerca-viva"
                checked={tiposCerca.includes("Viva")}
                onChange={() => toggleCerca("Viva")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="cerca-viva" className="text-sm text-[#4A4A4A]">
                Viva
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cerca-electrica"
                checked={tiposCerca.includes("Eléctrica")}
                onChange={() => toggleCerca("Eléctrica")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="cerca-electrica" className="text-sm text-[#4A4A4A]">
                Eléctrica
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="cerca-muerto"
                checked={tiposCerca.includes("P. muerto")}
                onChange={() => toggleCerca("P. muerto")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="cerca-muerto" className="text-sm text-[#4A4A4A]">
                P. muerto
              </label>
            </div>

            {/* OTRO TIPO DE CERCA */}
            <div className="flex gap-2 mt-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={otroCerca}
                  onChange={(e) => {
                    setOtroCerca(e.target.value);
                    if (otroCercaError) setOtroCercaError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarOtroCerca();
                    }
                  }}
                  placeholder="Otro tipo de cerca..."
                  maxLength={75}
                  aria-invalid={!!otroCercaError}
                  className={[
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
                    otroCercaError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]",
                  ].join(" ")}
                />
                {otroCercaError && (
                  <p className="mt-1 text-sm text-red-600">{otroCercaError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={agregarOtroCerca}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {tiposCerca.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-800 font-medium mb-2">
                  Tipos de cerca seleccionados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tiposCerca.map((tipo, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-green-300 rounded-full px-3 py-1 text-xs text-green-700"
                    >
                      {tipo}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Seleccione los equipos con que cuenta:
          </label>

          <div className="space-y-2">
            {[
              "Tractor de espalda",
              "Bomba de agua",
              "Camión ganadero",
              "Motosierra",
              "Picadora eléctrica",
              "Picadora de combustible",
              "Tanque de ordeño",
            ].map((equipo) => (
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

            {/* OTRO EQUIPO */}
            <div className="flex gap-2 mt-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={otroEquipo}
                  onChange={(e) => {
                    setOtroEquipo(e.target.value);
                    if (otroEquipoError) setOtroEquipoError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarOtroEquipo();
                    }
                  }}
                  placeholder="Otro equipo..."
                  maxLength={75}
                  aria-invalid={!!otroEquipoError}
                  className={[
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
                    otroEquipoError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]",
                  ].join(" ")}
                />
                {otroEquipoError && (
                  <p className="mt-1 text-sm text-red-600">{otroEquipoError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={agregarOtroEquipo}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {equipos.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800 font-medium mb-2">
                  Equipos seleccionados:
                </p>
                <div className="flex flex-wrap gap-2">
                  {equipos.map((eq, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
                    >
                      {eq}
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
