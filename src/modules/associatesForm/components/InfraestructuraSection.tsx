import { useEffect, useState } from "react";
import type { FormLike } from "../../../shared/types/form-lite";
import { otraInfraestructuraSchema } from "../schemas/associateApply";



interface InfraestructuraSectionProps {
  form: FormLike;
}

export function InfraestructuraSection({ form }: InfraestructuraSectionProps) {
  const existentes = (form as any).state?.values?.infraestructuraDisponible || {};

  const [infraestructuras, setInfraestructuras] = useState<string[]>(
    existentes.infraestructuras || []
  );
  const [otraInfraestructura, setOtraInfraestructura] = useState<string>("");

  
  const [otraInfraError, setOtraInfraError] = useState<string | null>(null);

  const [corrienteElectrica, setCorrienteElectrica] = useState<{
    publica: boolean;
    privada: boolean;
  }>({
    publica: existentes.corrienteElectrica?.publica || false,
    privada: existentes.corrienteElectrica?.privada || false,
  });

  useEffect(() => {
    (form as any).setFieldValue("infraestructuraDisponible", {
      infraestructuras,
      corrienteElectrica,
    });
  }, [infraestructuras, corrienteElectrica, form]);

  const toggleInfraestructura = (infra: string) => {
    if (infraestructuras.includes(infra)) {
      setInfraestructuras(infraestructuras.filter((i) => i !== infra));
    } else {
      setInfraestructuras([...infraestructuras, infra]);
    }
  };

  const agregarOtraInfraestructura = () => {
    const trimmed = otraInfraestructura.trim();

    // requerido
    if (!trimmed) {
      setOtraInfraError("La infraestructura es requerida");
      return;
    }

   
    const parsed = otraInfraestructuraSchema.safeParse(trimmed);
    if (!parsed.success) {
      setOtraInfraError(parsed.error.issues[0]?.message ?? "Valor inválido");
      return;
    }

    // duplicados
    if (infraestructuras.includes(trimmed)) {
      setOtraInfraError("Esta infraestructura ya fue agregada");
      return;
    }

    setInfraestructuras([...infraestructuras, trimmed]);
    setOtraInfraestructura("");
    setOtraInfraError(null);
  };

  const toggleCorriente = (tipo: "publica" | "privada") => {
    setCorrienteElectrica((prev) => ({
      ...prev,
      [tipo]: !prev[tipo],
    }));
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9]">
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center text-white font-bold text-sm">
          9
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Infraestructura disponible y corriente eléctrica
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Infraestructura disponible */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Infraestructura disponible:
          </label>

          <div className="space-y-2">
            {[
              "Corral",
              "Picadora",
              "Comederos",
              "Abrevadero",
              "Cargadero",
              "Bodega",
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

            {/* Campo "Otra infraestructura" con el mismo estilo de error */}
            <div className="flex gap-2 mt-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={otraInfraestructura}
                  onChange={(e) => {
                    setOtraInfraestructura(e.target.value);
                    if (otraInfraError) setOtraInfraError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      agregarOtraInfraestructura();
                    }
                  }}
                  placeholder="Otra infraestructura..."
                  maxLength={75}
                  aria-invalid={!!otraInfraError}
                  className={[
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1",
                    otraInfraError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-[#CFCFCF] focus:ring-[#6F8C1F] focus:border-[#6F8C1F]",
                  ].join(" ")}
                />
                {otraInfraError && (
                  <p className="mt-1 text-sm text-red-600">{otraInfraError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={agregarOtraInfraestructura}
                className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
              >
                Agregar
              </button>
            </div>

            {infraestructuras.length > 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-xs text-amber-800 font-medium mb-2">
                  Infraestructura seleccionada:
                </p>
                <div className="flex flex-wrap gap-2">
                  {infraestructuras.map((infra, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-amber-300 rounded-full px-3 py-1 text-xs text-amber-700"
                    >
                      {infra}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Corriente eléctrica */}
        <div className="pt-4 border-t border-[#DCD6C9]">
          <label className="block text-sm font-medium text-[#4A4A4A] mb-3">
            Corriente eléctrica en la finca:
          </label>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="corriente-publica"
                checked={corrienteElectrica.publica}
                onChange={() => toggleCorriente("publica")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="corriente-publica" className="text-sm text-[#4A4A4A]">
                Pública
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="corriente-privada"
                checked={corrienteElectrica.privada}
                onChange={() => toggleCorriente("privada")}
                className="w-4 h-4 rounded focus:ring-2 focus:ring-[#708C3E]"
                style={{ accentColor: "#708C3E" }}
              />
              <label htmlFor="corriente-privada" className="text-sm text-[#4A4A4A]">
                Privada
              </label>
            </div>

            {!corrienteElectrica.publica && !corrienteElectrica.privada && (
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-xs text-gray-600">
                  ℹ️ Si no marca ninguna opción, se asumirá que no hay corriente eléctrica
                </p>
              </div>
            )}

            {(corrienteElectrica.publica || corrienteElectrica.privada) && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-xs text-purple-800 font-medium mb-2">
                  Tipo de corriente:
                </p>
                <div className="flex flex-wrap gap-2">
                  {corrienteElectrica.publica && (
                    <span className="inline-flex items-center gap-1 bg-white border border-purple-300 rounded-full px-3 py-1 text-xs text-purple-700">
                      Pública
                    </span>
                  )}
                  {corrienteElectrica.privada && (
                    <span className="inline-flex items-center gap-1 bg-white border border-purple-300 rounded-full px-3 py-1 text-xs text-purple-700">
                      Privada
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
