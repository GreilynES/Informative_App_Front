import { useEffect, useRef, useState } from "react"
import { CalendarDays } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Progress } from "@/components/ui/progress"
import type { EventData } from "@/modules/events/models/EventType"
import { formatDateToWords } from "@/shared/utils/formatDate"

type FirstVisitNoticeProps = {
  event: EventData | null | undefined
  durationMs?: number
  closeDelayMs?: number
  storageKey?: string
  onViewMore?: () => void
  storage?: "session" | "local"
  debug?: boolean
  label?: string
}

export function FirstVisitNotice({
  event,
  durationMs = 7000,
  closeDelayMs = 300,
  storageKey = "first_visit_notice_seen",
  onViewMore,
  storage = "session",
  debug = false,
  label = "Próxima Subasta Ganadera",
}: FirstVisitNoticeProps) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  const rafRef = useRef<number | null>(null)
  const closeDelayRef = useRef<number | null>(null)

  const getStore = () =>
    storage === "local" ? window.localStorage : window.sessionStorage

  // 1) Decide si se muestra (solo una vez) PERO solo si existe event
  useEffect(() => {
    if (!event) return

    const store = getStore()
    const seen = store.getItem(storageKey)

    if (debug) console.log("[Notice] seen?", seen, "event?", !!event)

    if (!seen) {
      setOpen(true)
      setProgress(0)
      store.setItem(storageKey, "true")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  // 2) Progreso y cierre cuando se llena + delay
  useEffect(() => {
    if (!open) return

    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / durationMs) * 100)
      setProgress(pct)

      if (pct >= 100) {
        closeDelayRef.current = window.setTimeout(() => {
          setOpen(false)
        }, closeDelayMs)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (closeDelayRef.current) window.clearTimeout(closeDelayRef.current)
      rafRef.current = null
      closeDelayRef.current = null
    }
  }, [open, durationMs, closeDelayMs])

  if (!open || !event) return null

  const dateText = formatDateToWords(event.date, {
    locale: "es-CR",
    capitalize: true,
    commaBeforeYear: false,
  })

  return (
     <div className="fixed top-20 md:top-24 z-40 left-4 right-4 md:left-auto md:right-4 md:w-[560px]">
    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
      <Item className="rounded-2xl border border-[#A7C4A0]/35 bg-[#2C3F18]/55 backdrop-blur-md text-[#FAFDF4] shadow-xl shadow-[#0B0B0B]/45">
          {/* Icono con “chip” claro para que siempre se vea */}
          <ItemMedia
            variant="icon"
            className="
              flex items-center justify-center
              rounded-xl
              bg-[#FFFCE6]
              text-[#1F3D2B]
              shadow-sm
              ring-1 ring-[#A7C4A0]/50
            "
          >
            <CalendarDays className="h-5 w-5" />
          </ItemMedia>

          <ItemContent className="min-w-0">
          <ItemTitle className="text-[#FAFDF4] text-lg">{label}</ItemTitle>

          <ItemDescription className="text-[#FAFDF4]/90 min-w-0">
            <span className="inline-flex items-center gap-2 max-w-full min-w-0">
              <CalendarDays className="h-4 w-4 text-[#D6E5C8] shrink-0" />
              <span className="font-semibold text-lg text-[#FFFCE6] truncate">
                {dateText}
              </span>
            </span>

            <span className="mx-2 text-[#A7C4A0]">•</span>

            <span className="text-[#FAFDF4]/85 break-words">
              {event.title}
            </span>
          </ItemDescription>
        </ItemContent>

          <ItemActions className="flex items-center gap-2">
            <Button
              size="sm"
              className="
                rounded-full
                bg-[#1F3D2B]
                text-[#FAFDF4]
                border border-[#A7C4A0]/45
                hover:bg-[#162D20]
                transition
              "
              onClick={onViewMore}
            >
              Ver más
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="
                text-[#FAFDF4]/90
                hover:bg-[#1F3D2B]/35
                hover:text-[#FFFCE6]
              "
              onClick={() => setOpen(false)}
              aria-label="Cerrar aviso"
            >
              ✕
            </Button>
          </ItemActions>

          <ItemFooter>
            <Progress
              value={progress}
              className="
                h-1.5
                bg-[#1F3D2B]/55
                [&>div]:bg-[#6D8B37]
              "
            />
          </ItemFooter>
        </Item>
      </div>
    </div>
  )
}
