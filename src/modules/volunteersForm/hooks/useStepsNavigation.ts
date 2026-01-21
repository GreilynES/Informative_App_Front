import { useRef } from "react"

export function useStepsNavigation(nextStep: () => void, prevStep: () => void) {
  const formTopRef = useRef<HTMLDivElement | null>(null)

  const scrollToFormTop = () => {
    formTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }

  const goNext = () => {
    nextStep()
    requestAnimationFrame(scrollToFormTop)
  }

  const goPrev = () => {
    prevStep()
    requestAnimationFrame(scrollToFormTop)
  }

  return { formTopRef, goNext, goPrev }
}
