import { useEffect, useMemo, useRef, useState } from "react"
import { CalendarDays, X } from "lucide-react"

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

  const timerRef = useRef<number | null>(null)
  const closeDelayRef = useRef<number | null>(null)

  const store = useMemo(() => {
    if (typeof window === "undefined") return null
    return storage === "local" ? window.localStorage : window.sessionStorage
  }, [storage])

  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  const markSeen = () => {
    if (!store) return
    try {
      store.setItem(storageKey, "true")
    } catch {
      // ignore (modo incógnito / storage bloqueado)
    }
  }

  const close = () => {
    setOpen(false)
    markSeen()
  }

  // 1) Decide si se muestra (solo si existe event)
  useEffect(() => {
    if (!event || !store) return

    if (debug) {
      setOpen(true)
      setProgress(0)
      return
    }

    let seen: string | null = null
    try {
      seen = store.getItem(storageKey)
    } catch {
      seen = null
    }

    if (!seen) {
      setOpen(true)
      setProgress(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, debug, store])

  // 2) Timer/progreso (bajo costo). Si reduced motion, sin animación.
  useEffect(() => {
    if (!open) return
    if (debug) return

    // limpia timers previos
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (closeDelayRef.current) window.clearTimeout(closeDelayRef.current)
    timerRef.current = null
    closeDelayRef.current = null

    const start = Date.now()

    if (reducedMotion) {
      // no animamos barra, solo cerramos al final
      closeDelayRef.current = window.setTimeout(() => {
        close()
      }, durationMs + closeDelayMs)
      return () => {
        if (closeDelayRef.current) window.clearTimeout(closeDelayRef.current)
        closeDelayRef.current = null
      }
    }

    // actualiza cada 100ms (más que suficiente)
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start
      const pct = Math.min(100, (elapsed / durationMs) * 100)
      setProgress(pct)

      if (pct >= 100) {
        if (timerRef.current) window.clearInterval(timerRef.current)
        timerRef.current = null

        closeDelayRef.current = window.setTimeout(() => {
          close()
        }, closeDelayMs)
      }
    }, 100)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (closeDelayRef.current) window.clearTimeout(closeDelayRef.current)
      timerRef.current = null
      closeDelayRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, durationMs, closeDelayMs, debug, reducedMotion])

  if (!open || !event) return null

  const dateText = formatDateToWords(event.date, {
    locale: "es-CR",
    capitalize: true,
    commaBeforeYear: false,
  })

  return (
    <div className="fixed z-40 top-20 md:top-24 inset-x-3 sm:inset-x-4 md:left-auto md:right-4 md:w-[min(560px,calc(100vw-2rem))]">
      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
        <Item
          role="dialog"
          aria-label={label}
          className="
            rounded-xl
            border border-[#A7C4A0]/35
            bg-[#2C3F18]/60
            backdrop-blur-md
            text-[#FAFDF4]
            shadow-xl shadow-[#0B0B0B]/45
            px-3 py-3 sm:px-4 sm:py-4
          "
        >
          <ItemMedia
            variant="icon"
            className="
              flex items-center justify-center
              rounded-lg
              bg-[#1F3D2B]
              text-[#FAFDF6]
              shadow-sm
              h-9 w-9 sm:h-10 sm:w-10
              shrink-0
              self-start
            "
          >
            <CalendarDays className="h-6 w-6" />
          </ItemMedia>

          <ItemContent className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wide text-[#D6E5C8]">
              {label}
            </span>

            <ItemTitle className="mt-1 text-[#FFFCE6] text-base sm:text-lg font-semibold leading-tight">
              {dateText}
            </ItemTitle>

            <ItemDescription
              className="
                mt-0.5 text-[#FAFDF4]/85 min-w-0
                overflow-hidden
                [display:-webkit-box]
                [-webkit-line-clamp:2]
                [-webkit-box-orient:vertical]
              "
            >
              {event.description}
            </ItemDescription>
          </ItemContent>

          <ItemActions className="flex items-center gap-2 self-start sm:self-center">
            <Button
              size="sm"
              type="button"
              className="
                rounded-full
                bg-[#1F3D2B]
                text-[#FAFDF4]
                border border-[#A7C4A0]/45
                hover:bg-[#162D20]
                transition
                h-8 px-3
              "
              onClick={() => {
                onViewMore?.()
                close()
              }}
            >
              Ver más
            </Button>

            <Button
              size="sm"
              type="button"
              variant="ghost"
              className="
                text-[#FAFDF4]/90
                hover:bg-[#1F3D2B]/35
                hover:text-[#FFFCE6]
                h-8 w-8 p-0
              "
              onClick={close}
              aria-label="Cerrar aviso"
            >
              <X className="h-4 w-4" />
            </Button>
          </ItemActions>

          <ItemFooter className="mt-2">
            <Progress
              value={debug || reducedMotion ? 0 : progress}
              className="
                h-1.5
                bg-[#1F3D2B]/55
                [&>div]:bg-[#6D8B37]
                rounded-full
              "
            />
          </ItemFooter>
        </Item>
      </div>
    </div>
  )
}
