// src/modules/volunteersForm/components/Stepper.tsx

interface StepperProps {
  step: number;
  tipoSolicitante?: 'INDIVIDUAL' | 'ORGANIZACION';
}

export function Stepper({ step, tipoSolicitante = 'INDIVIDUAL' }: StepperProps) {
  const stepLabels = tipoSolicitante === 'INDIVIDUAL' 
    ? ["Información", "Disponibilidad", "Motivación", "Documentos", "Confirmación", "Enviado"] // 6 pasos
    : ["Organización", "Disponibilidad", "Documentos", "Confirmación"]; // 4 pasos

  const totalSteps = tipoSolicitante === 'INDIVIDUAL' ? 6 : 4; //  Ajustado a 6
  const stepsArray = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full mb-8 px-2 sm:px-4">
      {/* Versión móvil: Scroll horizontal */}
      <div className="lg:hidden overflow-x-auto pb-4">
        <div className="flex items-center gap-2 min-w-max px-4">
          {stepsArray.map((s, index) => (
            <div key={s} className="flex items-center gap-2">
              <div className="flex flex-col items-center min-w-[90px]">
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
                  className={`text-[10px] mt-1 text-center leading-tight ${
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

              {index < totalSteps - 1 && (
                <div className={`w-8 h-0.5 rounded transition-colors ${
                  step > s ? "bg-[#A3853D]" : "bg-[#DCD6C9]"
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Versión desktop */}
      <div className="hidden lg:flex justify-center items-center gap-3 px-4">
        {stepsArray.map((s, index) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex flex-col items-center min-w-[110px]">
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
                className={`text-xs mt-1 text-center leading-tight ${
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

            {index < totalSteps - 1 && (
              <div className={`w-12 h-1 rounded transition-colors ${
                step > s ? "bg-[#A3853D]" : "bg-[#DCD6C9]"
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Indicador móvil */}
      <div className="lg:hidden flex justify-center mt-2">
        <div className="flex gap-1">
          {stepsArray.map((s) => (
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