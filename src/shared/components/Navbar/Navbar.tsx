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

  // ✅ arranca transparente si estoy en "/"
  const [isHeroTheme, setIsHeroTheme] = useState(() => pathname === "/")

  const [visible, setVisible] = useState(true)
  const lastYRef = useRef(0)

  const tone = isHeroTheme ? "light" : "dark"
  const toggleMenu = () => setIsMenuOpen((v) => !v)

  useEffect(() => {
  if (pathname !== "/") {
    setIsHeroTheme(false)
    setIsMenuOpen(false)
    return
  }

  const calcTheme = () => {
    const heroEl = document.getElementById("PrincipalPage")

    // ✅ Si aún no existe el hero (por render/animación), asumimos modo hero
    // para que NO quede blanco al entrar a "/"
    if (!heroEl) {
      setIsHeroTheme(true)
      return
    }

    const heroHeight = heroEl.offsetHeight || 0
    const active = window.scrollY < Math.max(0, heroHeight - heroOffsetPx)

    setIsHeroTheme(active)
    if (!active) setIsMenuOpen(false)
  }

  const onScroll = () => calcTheme()

  // ✅ Listeners SIEMPRE, aunque el hero no esté todavía
  window.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", calcTheme)

  // ✅ Kick + retry corto para agarrar el hero cuando aparezca
  let raf = 0
  let tries = 0
  const retry = () => {
    calcTheme()
    tries++
    if (tries < 20 && !document.getElementById("PrincipalPage")) {
      raf = requestAnimationFrame(retry)
    }
  }
  raf = requestAnimationFrame(retry)

  return () => {
    if (raf) cancelAnimationFrame(raf)
    window.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", calcTheme)
  }
}, [pathname, heroOffsetPx])


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
    <>
      <nav
        className={[
          "fixed inset-x-0 top-0 z-50 overflow-x-hidden transition-all duration-300 px-4 md:px-36",
          visible
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-14 opacity-0 pointer-events-none",
          isHeroTheme
            ? "bg-transparent text-[#FAFDF4] shadow-none"
            : "bg-[#FAFDF4]/90 backdrop-blur-md text-[#1F3D2B] shadow-md shadow-[#0B0B0B]/10",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between relative py-4 min-w-0">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo-camara.png" alt="Logo" className="h-11 md:h-12 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            <NavbarMenuShadcn tone={tone} />
            <NavbarLoginIcon tone={tone} />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={[
                "p-2 rounded-lg transition focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-[#A7C4A0]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                isHeroTheme
                  ? "text-[#FAFDF4] hover:bg-[#A7C4A0]/10"
                  : "text-[#1F3D2B] hover:bg-[#D6E5C8]/55",
              ].join(" ")}
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu - completely outside nav element */}
      {isMenuOpen && (
        <div
          className={[
            "md:hidden fixed left-4 right-4 top-[72px] z-[60] rounded-xl p-4 border shadow-lg",
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
    </>
  )
}
