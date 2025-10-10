const stepLabels = [
  "Información",
  "Finca",
  "Forraje y\nRegistro",
  "Actividades e\nInfraestructura",
  "Documentos",
  "Confirmación"
];

export function Stepper({ step }: any) {
  return (
    <div className="flex justify-center items-center gap-3 mb-10 overflow-x-auto px-4">
      {[1, 2, 3, 4, 5, 6].map((s, index) => (
        <div key={s} className="flex items-center gap-3">
          <div className="flex flex-col items-center min-w-[80px]">
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
              className={`text-xs mt-1 text-center whitespace-pre-line ${
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

          {/* Línea entre pasos */}
          {index < 5 && (
            <div className={`w-12 h-1 rounded transition-colors ${
              step > s ? "bg-[#A3853D]" : "bg-[#DCD6C9]"
            }`}></div>
          )}
        </div>
      ))}
    </div>
  )
}