const stepLabels = [
  "Información                   ",
  "Finca                         ",
  "Forraje y\nRegistro           ",
  "Actividades e\nInfraestructura",
  "Acceso y\nComercialización    ",
  "Documentos                    ",
  "Confirmación                  "
];

export function Stepper({ step }: any) {
  return (
    <div className="w-full mb-8 px-2 sm:px-4">
      {/* Versión móvil: Scroll horizontal */}
      <div className="lg:hidden overflow-x-auto pb-4">
        <div className="flex items-center gap-2 min-w-max px-4">
          {[1, 2, 3, 4, 5, 6, 7].map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[70px]">
                <div
                  className={`w-8 h-8 rounded-full border-2 text-xs font-bold flex items-center justify-center transition duration-200 ${
                    step === s
                      ? "bg-[#708C3E] text-white border-[#708C3E]"
                      : step > s
                      ? "bg-[#A3853D] text-white border-[#A3853D]"
                      : "bg-white text-[#708C3E] border-[#DCD6C9]"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-[10px] mt-1 text-center whitespace-pre-line leading-tight ${
                    step === s
                      ? "text-[#708C3E] font-medium"
                      : step > s
                      ? "text-[#A3853D]"
                      : "text-gray-400"
                  }`}
                >
                  {stepLabels[index]}
                </span>
              </div>

              {/* Línea entre pasos - móvil */}
              {index < 6 && (
                <div className={`w-8 h-0.5 rounded transition-colors ${
                  step > s ? "bg-[#A3853D]" : "bg-[#DCD6C9]"
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Versión desktop: Centrado y compacto */}
      <div className="hidden lg:flex justify-center items-center gap-3 px-4">
        {[1, 2, 3, 4, 5, 6, 7].map((s, index) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center min-w-[90px]">
              <div
                className={`w-10 h-10 rounded-full border-2 text-sm font-bold flex items-center justify-center transition duration-200 ${
                  step === s
                    ? "bg-[#708C3E] text-white border-[#708C3E]"
                    : step > s
                    ? "bg-[#A3853D] text-white border-[#A3853D]"
                    : "bg-white text-[#708C3E] border-[#DCD6C9]"
                }`}
              >
                {s}
              </div>
              <span
                className={`text-xs mt-1 text-center whitespace-pre-line leading-tight ${
                  step === s
                    ? "text-[#708C3E] font-medium"
                    : step > s
                    ? "text-[#A3853D]"
                    : "text-gray-400"
                }`}
              >
                {stepLabels[index]}
              </span>
            </div>

            {/* Línea entre pasos - desktop */}
            {index < 6 && (
              <div className={`w-10 h-1 rounded transition-colors ${
                step > s ? "bg-[#A3853D]" : "bg-[#DCD6C9]"
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Indicador de scroll en móvil */}
      <div className="lg:hidden flex justify-center mt-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                step === s
                  ? "bg-[#708C3E] w-4"
                  : step > s
                  ? "bg-[#A3853D]"
                  : "bg-[#DCD6C9]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}