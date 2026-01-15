import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";

interface InfraestructuraSectionProps {
  form: FormLike;
  showErrors?: boolean;
}

export function InfraestructuraSection({ form }: InfraestructuraSectionProps) {
  const existentes = (form as any).state?.values?.infraestructuraDisponible || {};

  const [infraestructuras, setInfraestructuras] = useState<string[]>(existentes.infraestructuras || []);
  const [corrienteElectrica, setCorrienteElectrica] = useState({
    publica: existentes.corrienteElectrica?.publica || false,
    privada: existentes.corrienteElectrica?.privada || false,
  });
  const [otraInfraestructura, setOtraInfraestructura] = useState<string>("");

  useEffect(() => {
    (form as any).setFieldValue("infraestructuraDisponible", {
      infraestructuras,
      corrienteElectrica,
    });
  }, [infraestructuras, corrienteElectrica, form]);

  const toggleInfraestructura = (infra: string) => {
    setInfraestructuras((prev) =>
      prev.includes(infra) ? prev.filter((i) => i !== infra) : [...prev, infra]
    );
  };

  const agregarOtraInfraestructura = () => {
    const trimmed = otraInfraestructura.trim();
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
    
    const exists = infraestructuras.some((i) => i.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert("Esta infraestructura ya fue agregada");
      return;
    }
    
    setInfraestructuras((prev) => [...prev, trimmed]);
    setOtraInfraestructura("");
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Infraestructura Disponible</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Infraestructuras */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Infraestructura disponible en la finca:
          </label>

          <div className="mb-2 flex items-center gap-2 p-2 text-semibold bg-[#eef7df] border border-[#efefef] rounded-md">
            <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#708C3E] text-white text-xs font-bold">
              i
            </span>
            <p className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Marca todas las infraestructuras que aplica. Para otra, escríbela y presiona{" "}
              <span className="font-semibold text-[#708C3E]">Agregar</span>.
            </p>
          </div>

          <div className="space-y-2">
            {[
              "Corral de manejo",
              "Bodega",
              "Sala de ordeño",
              "Reservorio de agua",
              "Biodigestor",
              "Sistema de tratamiento de aguas",
            ].map((infra) => (
              <div key={infra} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`infra-${infra}`}
                  checked={infraestructuras.includes(infra)}
                  onChange={() => toggleInfraestructura(infra)}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                  style={{ accentColor: "#708C3E" }}
                />
                <label htmlFor={`infra-${infra}`} className="text-sm text-[#4A4A4A]">
                  {infra}
                </label>
              </div>
            ))}

            {/* Campo "Otra" */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={otraInfraestructura}
                onChange={(e) => setOtraInfraestructura(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    agregarOtraInfraestructura();
                  }
                }}
                placeholder="Otra infraestructura"
                className="flex-1 px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                maxLength={75}
              />
              <button
                type="button"
                onClick={agregarOtraInfraestructura}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {infraestructuras.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-800 font-medium mb-2">Infraestructura seleccionada:</p>
                <div className="flex flex-wrap gap-2">
                  {infraestructuras.map((infra, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
                    >
                      {infra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Corriente Eléctrica */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Corriente eléctrica:
          </label>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="electrica-publica"
                checked={corrienteElectrica.publica}
                onChange={(e) =>
                  setCorrienteElectrica({ ...corrienteElectrica, publica: e.target.checked })
                }
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="electrica-publica" className="text-sm text-[#4A4A4A]">
                Pública (ICE)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="electrica-privada"
                checked={corrienteElectrica.privada}
                onChange={(e) =>
                  setCorrienteElectrica({ ...corrienteElectrica, privada: e.target.checked })
                }
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="electrica-privada" className="text-sm text-[#4A4A4A]">
                Privada (planta eléctrica/solar)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}