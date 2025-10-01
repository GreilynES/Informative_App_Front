interface StepperProps {
  step: number
}

export function Stepper({ step }: StepperProps) {
  return (
    <div className="flex justify-center items-center gap-4 mb-10">
      {[1, 2, 3, 4, 5].map((s, index) => (
        <div key={s} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full border-2 text-sm font-bold flex items-center justify-center transition duration-200 ${
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
              className={`text-xs mt-1 ${
                step === s
                  ? "text-[#708C3E] font-medium"
                  : step > s
                  ? "text-[#A3853D]"
                  : "text-gray-400"
              }`}
            >
              Paso {s}
            </span>
          </div>

          {/* Línea entre pasos */}
          {index < 4 && (
            <div className="w-8 h-px bg-[#DCD6C9]"></div>
          )}
        </div>
      ))}
    </div>
  )
}
