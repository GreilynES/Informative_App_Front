interface StepperProps {
  step: number
  tipoSolicitante?: "INDIVIDUAL" | "ORGANIZACION"
  onStepClick?: (step: number) => void
}

export function Stepper({
  step,
  tipoSolicitante = "INDIVIDUAL",
  onStepClick,
}: StepperProps) {
  const stepLabels =
    tipoSolicitante === "INDIVIDUAL"
      ? ["Información", "Disponibilidad", "Motivación", "Documentos", "Confirmación"] // 5
      : ["Organización", "Disponibilidad", "Documentos", "Confirmación"] // 4

  const totalSteps = stepLabels.length
  const clampedStep = Math.min(Math.max(step, 1), totalSteps)

  const progressPct =
    totalSteps <= 1 ? 0 : ((clampedStep - 1) / (totalSteps - 1)) * 100

  const pctText = Math.round((clampedStep / totalSteps) * 100)

  const canClick = (s: number) => !!onStepClick && s <= clampedStep

  return (
    <div className="w-full mb-8">
      {/* ===== Mobile ===== */}
      <div className="lg:hidden px-2 sm:px-4">
        <div className="rounded-2xl border border-[#DCD6C9] bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#708C3E]">
              Paso {clampedStep}{" "}
              <span className="text-gray-400 font-medium">de</span> {totalSteps}
            </p>
            <span className="text-xs font-semibold text-[#A3853D]">
              {pctText}%
            </span>
          </div>

          {/* barra progreso */}
          <div className="mt-3 h-2.5 w-full rounded-full bg-[#F3F1EA] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#708C3E] transition-all duration-500 ease-out"
              style={{ width: `${(clampedStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* nodos compactos */}
          <div className="mt-4 flex items-center justify-between">
            {stepLabels.map((_, i) => {
              const s = i + 1
              const isActive = s === clampedStep
              const isDone = s < clampedStep

              return (
                <button
                  key={s}
                  type="button"
                  disabled={!canClick(s)}
                  onClick={() => onStepClick?.(s)}
                  className={[
                    "relative grid place-items-center",
                    "h-9 w-9 rounded-full border text-xs font-bold",
                    "transition-all duration-200",
                    isActive
                      ? "bg-[#708C3E] text-white border-[#708C3E] shadow-sm scale-[1.06]"
                      : isDone
                      ? "bg-[#E6EDC8] text-[#4A4A4A] border-[#DCD6C9]"
                      : "bg-white text-gray-400 border-[#DCD6C9]",
                    canClick(s) ? "cursor-pointer" : "cursor-default",
                    "focus:outline-none focus:ring-2 focus:ring-[#708C3E]/30",
                  ].join(" ")}
                  aria-current={isActive ? "step" : undefined}
                  title={stepLabels[i]}
                >
                  {isDone ? "✓" : s}
                </button>
              )
            })}
          </div>

          <p className="mt-3 text-sm text-[#4A4A4A]">
            <span className="text-gray-500">Actual:</span>{" "}
            <span className="font-semibold text-[#708C3E]">
              {stepLabels[clampedStep - 1]}
            </span>
          </p>
        </div>
      </div>

      {/* ===== Desktop / Tablet ===== */}
      <div className="hidden lg:block">
        <div className="rounded-xl px-6 ">
          <div className="relative">
            {/* Línea base */}
            <div className="absolute left-0 right-0 top-[22px] h-1 rounded-full bg-[#F3F1EA]" />

            {/* Progreso */}
            <div
              className="absolute left-0 top-[22px] h-1 rounded-full bg-[#708C3E] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />

            <div className="relative grid gap-0"
              style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
            >
              {stepLabels.map((label, i) => {
                const s = i + 1
                const isActive = s === clampedStep
                const isDone = s < clampedStep

                return (
                  <div key={label} className="flex flex-col items-center">
                    {/* Nodo */}
                    <div className="relative">
                      {/* halo */}
                      <div
                        className={[
                          "absolute -inset-2 rounded-full transition-opacity duration-300",
                          isActive ? "bg-[#708C3E]/15 opacity-100" : "opacity-0",
                        ].join(" ")}
                      />

                      <button
                        type="button"
                        disabled={!canClick(s)}
                        onClick={() => onStepClick?.(s)}
                        className={[
                          "relative grid place-items-center",
                          "h-11 w-11 rounded-full border-2 text-sm font-bold",
                          "transition-all duration-200",
                          isActive
                            ? "bg-[#708C3E] text-white border-[#708C3E] shadow-sm scale-[1.06]"
                            : isDone
                            ? "bg-[#A3853D] text-white border-[#A3853D] shadow-sm"
                            : "bg-white text-[#708C3E] border-[#DCD6C9]",
                          canClick(s) ? "cursor-pointer hover:scale-[1.03]" : "cursor-default",
                          "focus:outline-none focus:ring-2 focus:ring-[#708C3E]/30",
                        ].join(" ")}
                        aria-current={isActive ? "step" : undefined}
                      >
                        {isDone ? "✓" : s}
                      </button>
                    </div>

                    {/* Label */}
                    <span
                      className={[
                        "mt-3 text-sm text-center leading-tight px-2",
                        "transition-colors duration-200",
                        isActive
                          ? "text-[#708C3E] font-semibold"
                          : isDone
                          ? "text-[#4A4A4A] font-medium"
                          : "text-gray-400",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
