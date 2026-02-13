import { useEffect, useRef, useState, type ReactNode } from "react"

// Hook de Intersection Observer integrado
function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ok = entry.isIntersecting

        if (ok && !hasTriggered) {
          setIsIntersecting(true)
          if (triggerOnce) setHasTriggered(true)
        } else if (!triggerOnce) {
          setIsIntersecting(ok)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref, isIntersecting: triggerOnce ? hasTriggered || isIntersecting : isIntersecting }
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
}

// Componente ScrollReveal estilo Apple
interface ScrollRevealProps {
  children: ReactNode
  direction?: "up" | "left"
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 800,
  distance = 30,
  className = "",
}: ScrollRevealProps) {
  const reduced = prefersReducedMotion()
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
    triggerOnce: true,
  })

  const active = reduced ? true : isIntersecting

  // Easing suave estilo Apple
  const easing = "cubic-bezier(0.28, 0.11, 0.32, 1)"

  const initialTransform = direction === "left"
    ? `translate3d(-${distance}px, 0, 0)`
    : `translate3d(0, ${distance}px, 0)`

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: active ? 1 : 0,
        transform: active 
          ? "translate3d(0, 0, 0)" 
          : initialTransform,
        
        transitionProperty: reduced ? "none" : "opacity, transform",
        transitionDuration: reduced ? "0ms" : `${duration}ms`,
        transitionTimingFunction: easing,
        transitionDelay: reduced ? "0ms" : `${delay}ms`,

        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  )
}