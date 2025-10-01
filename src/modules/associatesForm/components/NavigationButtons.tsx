// src/components/Associates/NavigationButtons.tsx

interface NavigationButtonsProps {
  onPrev?: () => void
  onNext?: () => void
  showPrev?: boolean
  showNext?: boolean
  disableNext?: boolean
  className?: string
}

export function NavigationButtons({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  disableNext = false,
  className = "",
}: NavigationButtonsProps) {
  return (
    <div className={`flex justify-between items-center px-6 pb-6 ${className}`}>
      {showPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="bg-[#708C3E] text-white px-6 py-2 rounded-md"
        >
          Anterior
        </button>
      ) : (
        <div />
      )}

      {showNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          className={`px-6 py-2 rounded-md text-white ${
            disableNext
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#708C3E] hover:bg-[#5d7334]"
          }`}
        >
          Siguiente
        </button>
      )}
    </div>
  )
}
