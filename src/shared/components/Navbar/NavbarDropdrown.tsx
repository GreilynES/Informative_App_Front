"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react" // Iconos para el dropdown
import { Link } from "@tanstack/react-router"

interface NavbarDropdownProps {
  isMobile?: boolean
  onLinkClick?: () => void
}

export default function NavbarDropdown({ isMobile = false, onLinkClick }: NavbarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

   // Clases para el enlace principal "Formularios"
  const mainLinkClasses = isMobile
    ? "flex flex-col space-y-3" // flex-grow para ocupar espacio en móvil
    : "hover:text-[#6D8B37] transition-colors"

  // Clases para el botón del dropdown
  const buttonClasses = isMobile
    ? "text-black hover:text-gray-700 font-medium text-lg flex items-center justify-between w-full"
    : "hover:text-[#6D8B37] transition-colors flex items-center"

  // Clases para los enlaces del dropdown
  const dropdownLinkClasses = isMobile
    ? "block px-4 py-2 text-black hover:bg-gray-100 text-lg"
    : "block px-4 py-2 text-gray-800 hover:bg-gray-100"

  return (
    <li className={isMobile ? "w-full" : "relative"}>
      <button onClick={toggleDropdown} className={buttonClasses}>
        <div
        className={
          isMobile
            ? " w-full" // Para móvil: texto y flecha separados
            : "flex items-center" // Para escritorio: texto y flecha juntos
        }
      >
        {/* Enlace principal "Formularios" */}
        <Link
          to="/"
          hash="FormsPage" // Ruta a la página de formularios
          className={mainLinkClasses}
          onClick={() => {
            onLinkClick?.() // Cierra el menú principal si es móvil
            setIsOpen(false) // Cierra el dropdown si está abierto
          }}
        >
          Formularios
        </Link>
        {isOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div
          className={
            isMobile
              ? "mt-2 space-y-2 border-t border-gray-200 pt-2" // Para móvil, debajo del botón
              : "absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" // Para escritorio, como un dropdown
          }
        >
          <div className="py-1">
            <Link
              to="/volunteers"
              hash="volunteers"
              className={dropdownLinkClasses}
              onClick={() => {
                onLinkClick?.()
                setIsOpen(false)
              }}
            >
              Voluntarios
            </Link>
            <Link
              to="/associates"
              hash="associates"
              className={dropdownLinkClasses}
              onClick={() => {
                onLinkClick?.()
                setIsOpen(false)
              }}
            >
                Asociados
            </Link>
          </div>
        </div>
      )}
    </li>
  )
}
