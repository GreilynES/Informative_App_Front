import { Link } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Tone = "light" | "dark"

type Props = {
  tone?: Tone
  isMobile?: boolean
  onNavigate?: () => void
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function NavbarMenuShadcn({ tone = "dark", isMobile = false, onNavigate }: Props) {
  const baseLink =
    tone === "light"
      ? "text-white/85 hover:text-white"
      : "text-gray-800 hover:text-[#2F5F0B]"

  // Look actual: uppercase + tracking + sin “pill” rara
  const linkDesktop = cx(
    "uppercase text-sm font-semibold tracking-wide transition-colors",
    "px-2 py-1 rounded-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/60",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    baseLink
  )

  // Trigger de dropdown que se vea EXACTO como link
  const triggerDesktop = cx(
    "group inline-flex items-center gap-1",
    "uppercase text-sm font-semibold tracking-wide transition-colors",
    "px-2 py-1 rounded-md",
    "bg-transparent hover:bg-transparent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/60",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    baseLink
  )

  // Dropdown content estilos hero/default (sin caja blanca)
  const contentClass =
    tone === "light"
      ? cx(
          "z-50 min-w-52 rounded-xl p-2",
          "border border-[#A7C4A0]/20",
          "bg-gradient-to-br from-[#1F3D2B]/55 via-black/45 to-black/40",
          "backdrop-blur-md shadow-xl shadow-black/40"
        )
      : cx(
          "z-50 min-w-52 rounded-xl p-2",
          "border border-black/10 bg-white shadow-xl"
        )

  const itemClass =
    tone === "light"
      ? "rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 transition cursor-pointer"
      : "rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-100 transition cursor-pointer"

  // ✅ MOBILE (igual que antes, simple y claro)
  if (isMobile) {
    const mobileLink = cx("text-lg font-semibold uppercase", baseLink)

    return (
      <div className="flex flex-col gap-3">
        <Link to="/" search={{ section: "AboutUsPage" }} className={mobileLink} onClick={onNavigate}>
          SOBRE NOSOTROS
        </Link>
        <Link to="/" search={{ section: "EventsPage" }} className={mobileLink} onClick={onNavigate}>
          EVENTOS
        </Link>
        <Link to="/" search={{ section: "ServicesPage" }} className={mobileLink} onClick={onNavigate}>
          SERVICIOS
        </Link>

        <div className="pt-2">
          <div className={cx("text-lg font-semibold uppercase mb-2", baseLink)}>FORMULARIOS</div>
          <div className="flex flex-col gap-2">
            <Link to="/volunteers" className={cx("text-lg", baseLink)} onClick={onNavigate}>
              Voluntarios
            </Link>
            <Link to="/associates" className={cx("text-lg", baseLink)} onClick={onNavigate}>
              Asociados
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ✅ DESKTOP
  return (
    <div className="flex items-center gap-7">
      <Link to="/" search={{ section: "AboutUsPage" }} className={linkDesktop} onClick={onNavigate}>
        SOBRE NOSOTROS
      </Link>

      <Link to="/" search={{ section: "EventsPage" }} className={linkDesktop} onClick={onNavigate}>
        EVENTOS
      </Link>

      <Link to="/" search={{ section: "ServicesPage" }} className={linkDesktop} onClick={onNavigate}>
        SERVICIOS
      </Link>

      <DropdownMenu modal={false}>
        {/* ✅ asChild para NO meter estilos raros */}
        <DropdownMenuTrigger asChild>
          <button type="button" className={triggerDesktop}>
            FORMULARIOS
            <ChevronDown className="h-4 w-4 opacity-80 transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </DropdownMenuTrigger>

        {/* ✅ align="start" para que NO se vaya a la derecha */}
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className={contentClass}
        >
          <DropdownMenuItem asChild>
            <Link
              to="/volunteers"
              className={itemClass}
              onClick={() => onNavigate?.()}
            >
              Voluntarios
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/associates"
              className={itemClass}
              onClick={() => onNavigate?.()}
            >
              Asociados
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
