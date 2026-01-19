import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { btn } from "@/shared/ui/buttonStyles"

interface NavigationButtonsProps {
  onPrev?: () => void
  onNext?: () => void
  showPrev?: boolean
  showNext?: boolean
  disableNext?: boolean
  hidePrev?: boolean
  className?: string
}

export function NavigationButtons({
  onPrev,
  onNext,
  showPrev = true,
  showNext = true,
  disableNext = false,
  hidePrev = false,
  className = "",
}: NavigationButtonsProps) {
  return (
    <div className={`flex justify-between items-center px-6 pb-6 ${className}`}>
      {!hidePrev && showPrev ? (
        <Button type="button" variant="outline" size="sm" onClick={onPrev} className={btn.outlineGreen}>
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
      ) : (
        <div />
      )}

      {showNext && (
        <Button
          type="button"
          size="sm"
          onClick={onNext}
          disabled={disableNext}
          className={`${btn.primary} ${btn.disabledSoft}`}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  )
}
