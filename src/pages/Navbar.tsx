import { useState } from "react"
import { Menu, X } from "lucide-react" 
import NavbarLinks from "../components/Navbar/NavbarLinks"
import NavbarLoginIcon from "../components/Navbar/NavbarIcon"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md text-black px-4 py-4 shadow-md md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {" "}
        {/* Añadimos relative aquí para posicionar el menú móvil */}
        {/* Logo - sigue usando <a> para recargar la página */}
        <a href="/">
          <img
            src="/logo-camara.png" 
            alt="Logo de la empresa" // Texto alt genérico
            className="h-12 w-auto" // Clases para el tamaño del logo
          />
        </a>
        {/* Menú de escritorio (visible en pantallas medianas y más grandes) */}
        <div className="hidden md:flex items-center space-x-8 ml-auto">
          <NavbarLinks /> {/* NavbarLinks para escritorio */}
          <NavbarLoginIcon />
        </div>
        {/* Botón de menú móvil (visible solo en pantallas pequeñas) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black focus:outline-none p-2">
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
        {/* Menú móvil desplegable (se muestra condicionalmente) */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-40">
            {/* Contenedor para los enlaces y el icono de login */}
            <div className="flex flex-col space-y-4">
              {/* NavbarLinks para móvil */}
              <NavbarLinks isMobile={true} onLinkClick={toggleMenu} />
              <NavbarLoginIcon isMobile={true} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
