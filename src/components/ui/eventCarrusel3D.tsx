import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, type PanInfo, useMotionValue, useTransform } from "motion/react"
import type { EventData } from "@/modules/events/models/EventType"
import { EventCard } from "@/modules/events/components/EventCard"


const DRAG_BUFFER = 0
const VELOCITY_THRESHOLD = 500
const GAP = 16
const SPRING_OPTIONS = { type: "spring" as const, stiffness: 300, damping: 30 }

export type EventCarousel3DHandle = {
  prev: () => void
  next: () => void
  goTo: (index: number) => void
}

type Props = {
  items: EventData[]
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  loop?: boolean
  /** te avisa cuál item REAL está activo (0..items.length-1) */
  onActiveIndexChange?: (index: number) => void
  /** altura del stage (lo controla tu EventsPage igual) */
  className?: string
}

function useResizeWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width ?? 0
      setWidth(w)
    })
    ro.observe(el)
    setWidth(el.getBoundingClientRect().width)

    return () => ro.disconnect()
  }, [])

  return { ref, width }
}

export const EventCarousel3D = forwardRef<EventCarousel3DHandle, Props>(function EventCarousel3D(
  {
    items,
    autoplay = false,
    autoplayDelay = 3000,
    pauseOnHover = true,
    loop = true,
    onActiveIndexChange,
    className = "",
  },
  ref
) {
  const { ref: containerRef, width: baseWidth } = useResizeWidth<HTMLDivElement>()

  // padding interno del “viewport” (igual que tu ejemplo)
  const containerPadding = 16

  // ✅ clave para que se vean 3 (centro + peeks):
  // hacemos el item un % del contenedor, no 100%.
  const itemWidth = useMemo(() => {
    const w = Math.max(baseWidth, 0)
    if (w === 0) return 300
    // mobile: casi full, desktop: 70-78% para ver laterales
    const responsive = w < 520 ? w - containerPadding * 2 : Math.round(w * 0.74)
    return Math.max(260, Math.min(responsive, w - containerPadding * 2))
  }, [baseWidth])

  const trackItemOffset = itemWidth + GAP

  const itemsForRender = useMemo(() => {
    if (!loop) return items
    if (items.length === 0) return []
    return [items[items.length - 1], ...items, items[0]]
  }, [items, loop])

  const [position, setPosition] = useState<number>(loop ? 1 : 0)
  const x = useMotionValue(0)

  const [isHovered, setIsHovered] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // hover
  useEffect(() => {
    if (!pauseOnHover || !containerRef.current) return
    const el = containerRef.current
    const onEnter = () => setIsHovered(true)
    const onLeave = () => setIsHovered(false)
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [pauseOnHover, containerRef])

  // reset when items/width changes
  useEffect(() => {
    const start = loop ? 1 : 0
    setPosition(start)
    x.set(-start * trackItemOffset)
  }, [items.length, loop, trackItemOffset, x])

  // autoplay
  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return
    if (pauseOnHover && isHovered) return

    const t = setInterval(() => {
      setPosition((p) => Math.min(p + 1, itemsForRender.length - 1))
    }, autoplayDelay)

    return () => clearInterval(t)
  }, [autoplay, autoplayDelay, itemsForRender.length, isHovered, pauseOnHover])

  // clamp if no loop
  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1))
    }
  }, [itemsForRender.length, loop, position])

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? (position - 1 + items.length) % items.length
        : Math.min(position, items.length - 1)

  useEffect(() => {
    onActiveIndexChange?.(activeIndex)
  }, [activeIndex, onActiveIndexChange])

  const handleAnimationStart = () => setIsAnimating(true)

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false)
      return
    }
    const lastCloneIndex = itemsForRender.length - 1

    // si caímos en el clone del final, saltamos al real 1
    if (position === lastCloneIndex) {
      setIsJumping(true)
      const target = 1
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    // si caímos en el clone del inicio, saltamos al real last
    if (position === 0) {
      setIsJumping(true)
      const target = items.length
      setPosition(target)
      x.set(-target * trackItemOffset)
      requestAnimationFrame(() => {
        setIsJumping(false)
        setIsAnimating(false)
      })
      return
    }

    setIsAnimating(false)
  }

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info

    const dir =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0

    if (dir === 0) return

    setPosition((p) => {
      const next = p + dir
      const max = itemsForRender.length - 1
      return Math.max(0, Math.min(next, max))
    })
  }

  useImperativeHandle(ref, () => ({
    prev: () =>
      setPosition((p) => {
        const next = p - 1
        return Math.max(0, next)
      }),
    next: () =>
      setPosition((p) => {
        const max = itemsForRender.length - 1
        const next = p + 1
        return Math.min(max, next)
      }),
    goTo: (index: number) => setPosition(loop ? index + 1 : index),
  }))

  // ✅ item con el rotateY tal cual tu ejemplo
  function Item({ item, index }: { item: EventData; index: number }) {
    const range = [
      -(index + 1) * trackItemOffset,
      -index * trackItemOffset,
      -(index - 1) * trackItemOffset,
    ]
    const rotateY = useTransform(x, range, [90, 0, -90], { clamp: false })

    return (
      <motion.div
        key={`${(item as any)?.id ?? item.title ?? index}-${index}`}
        className="relative shrink-0 h-full cursor-grab active:cursor-grabbing"
        style={{
          width: itemWidth,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        transition={effectiveTransition}
      >
        <EventCard event={item} />
      </motion.div>
    )
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Track */}
      <motion.div
        className="flex h-full"
        drag={isAnimating ? false : "x"}
        style={{
          gap: `${GAP}px`,
          // importante: el perspectiveOrigin hace el “efecto cámara”
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, idx) => (
          <Item key={`${(item as any)?.id ?? idx}-${idx}`} item={item} index={idx} />
        ))}
      </motion.div>
    </div>
  )
})
