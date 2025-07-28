import { ShieldIcon as ShieldUser, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md text-black px-16 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/">
          <img
            src="/logo-camara.png"
            alt="Logo Cámara"
            className="w-16 mb-2"
          />
        </Link>
        <div className="flex items-center space-x-8 ml-auto">
          <ul className="flex space-x-6 text-base font-medium ml-auto text-gray-800">
            <li>
              <Link to="/" hash="AboutUsPage" className="hover:text-[#6D8B37] transition-colors">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link to="/" hash="EventsPage" className="hover:text-[#6D8B37] transition-colors">
                Eventos
              </Link>
            </li>
            <li>
              <Link to="/" hash="ServicesPage" className="hover:text-[#6D8B37] transition-colors">
                Servicios
              </Link>
            </li>
            {/* Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="hover:text-[#6D8B37] transition-colors focus:outline-none flex items-center gap-1"
              >
                Formularios
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-md border border-neutral-200 z-50">
                  <li>
                    <Link
                      to="/volunteers"
                      className="block px-4 py-2 hover:bg-[#F3F4EC] text-sm text-gray-800"
                    >
                      Voluntarios
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/associates"
                      className="block px-4 py-2 hover:bg-[#F3F4EC] text-sm text-gray-800"
                    >
                      Asociados
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          {/* Icono login */}
          <a
            href="/login"
            className="text-gray-800 hover:text-[#D8B769] transition-colors p-2 rounded-full border border-transparent hover:border-[#D8B769]"
            title="Área Privada"
          >
            <ShieldUser className="w-6 h-6" />
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar