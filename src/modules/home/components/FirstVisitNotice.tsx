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

    // ✅ Modo edición: se queda abierto fijo
    if (debug) {
      setOpen(true)
      setProgress(0)
      return
    }

    const store = getStore()
    const seen = store.getItem(storageKey)

    if (!seen) {
      setOpen(true)
      setProgress(0)
      store.setItem(storageKey, "true")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, debug])

  // 2) Progreso y cierre cuando se llena + delay
  useEffect(() => {
    if (!open) return

    // ✅ En debug no corre el timer (se queda fijo)
    if (debug) return

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
  }, [open, durationMs, closeDelayMs, debug])

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
          {/* Icono */}
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

          {/* Contenido */}
          <ItemContent className="min-w-0">
            <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-wide text-[#D6E5C8]">
              {label}
            </span>

            <ItemTitle className="mt-1 text-[#FFFCE6] text-base sm:text-lg font-semibold leading-tight">
              {dateText}
            </ItemTitle>

            <ItemDescription className="mt-0.5 text-[#FAFDF4]/85 min-w-0">
              <span className="block text-sm sm:text-base leading-snug break-words">
                {event.description}<p>...</p>
              </span>
            </ItemDescription>
          </ItemContent>

          {/* Acciones */}
          <ItemActions className="flex items-center gap-2 self-start sm:self-center">
            <Button
              size="sm"
              className="
                rounded-full
                bg-[#1F3D2B]
                text-[#FAFDF4]
                border border-[#A7C4A0]/45
                hover:bg-[#162D20]
                transition
                h-8 px-3
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
                h-8 w-8 p-0
              "
              onClick={() => setOpen(false)}
              aria-label="Cerrar aviso"
            >
              ✕
            </Button>
          </ItemActions>

          {/* Progreso */}
          <ItemFooter className="mt-2">
            <Progress
              value={debug ? 0 : progress}
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
