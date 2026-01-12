import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { useRouterState } from "@tanstack/react-router"
import NavbarMenuShadcn from "./NavbarMenuShadcn"
import NavbarLoginIcon from "./NavbarIcon"

type NavbarProps = {
  thresholdPx?: number
  heroOffsetPx?: number
}

export default function Navbar({ thresholdPx = 12, heroOffsetPx = 80 }: NavbarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeroTheme, setIsHeroTheme] = useState(false)

  const [visible, setVisible] = useState(true)
  const lastYRef = useRef(0)

  const tone = isHeroTheme ? "light" : "dark"
  const toggleMenu = () => setIsMenuOpen((v) => !v)

  // 1) Tema según sección (solo en "/")
  useEffect(() => {
    if (pathname !== "/") {
      setIsHeroTheme(false)
      setIsMenuOpen(false)
      return
    }

    const heroEl = document.getElementById("PrincipalPage")
    if (!heroEl) {
      setIsHeroTheme(false)
      return
    }

    const calcTheme = () => {
      const heroHeight = heroEl.offsetHeight || 0
      const active = window.scrollY < Math.max(0, heroHeight - heroOffsetPx)
      setIsHeroTheme(active)
      if (!active) setIsMenuOpen(false)
    }

    calcTheme()
    window.addEventListener("scroll", calcTheme, { passive: true })
    window.addEventListener("resize", calcTheme)

    return () => {
      window.removeEventListener("scroll", calcTheme)
      window.removeEventListener("resize", calcTheme)
    }
  }, [pathname, heroOffsetPx])

  // 2) Auto-hide SIEMPRE
  useEffect(() => {
    lastYRef.current = window.scrollY
    setVisible(true)

    const onScroll = () => {
      const y = window.scrollY
      const lastY = lastYRef.current
      const delta = y - lastY

      if (Math.abs(delta) < thresholdPx) return

      if (delta > 0) {
        setVisible(false)
        setIsMenuOpen(false)
      } else {
        setVisible(true)
      }

      lastYRef.current = y
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [thresholdPx])

  return (
    <nav
      className={[
        "fixed top-0 w-full z-50 transition-all duration-300 px-4 md:px-36",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-14 opacity-0 pointer-events-none",

        // ✅ SOLO PALETA
        isHeroTheme
          ? "bg-transparent text-[#FAFDF4] shadow-none"
          : "bg-[#FAFDF4]/90 backdrop-blur-md text-[#1F3D2B] shadow-md shadow-[#0B0B0B]/10",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <img src="/logo-camara.png" alt="Logo" className="h-11 md:h-12 w-auto" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <NavbarMenuShadcn tone={tone} />
          <NavbarLoginIcon tone={tone} />
        </div>

        {/* Mobile btn */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className={[
              "p-2 rounded-lg transition focus:outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",

              // ✅ SOLO PALETA
              isHeroTheme
                ? "text-[#FAFDF4] hover:bg-[#A7C4A0]/10"
                : "text-[#1F3D2B] hover:bg-[#D6E5C8]/55",
            ].join(" ")}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile dropdown panel */}
        {isMenuOpen && (
          <div
            className={[
              "md:hidden absolute top-full right-0 mt-2 w-80 rounded-xl p-4 z-40 border shadow-lg",

              // ✅ SOLO PALETA
              isHeroTheme
                ? "bg-[#2C3F18]/55 backdrop-blur-md border-[#A7C4A0]/20 text-[#FAFDF4] shadow-[#0B0B0B]/35"
                : "bg-[#FFFCE6] border-[#A7C4A0]/35 text-[#1F3D2B] shadow-[#0B0B0B]/10",
            ].join(" ")}
          >
            <div className="flex flex-col gap-4">
              <NavbarMenuShadcn tone={tone} isMobile onNavigate={() => setIsMenuOpen(false)} />
              <NavbarLoginIcon isMobile={true} tone={tone} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
