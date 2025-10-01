import { Link } from '@tanstack/react-router'
import NavbarDropdown from './NavbarDropdrown'

export default function NavbarLinks({ isMobile = false, onLinkClick }: any) {
 // Clases condicionales para el contenedor de la lista
  const ulClasses = isMobile
    ? "flex flex-col space-y-3" // Estilo para móvil: columna, espacio normal
    : "flex space-x-6 text-base font-medium ml-auto text-gray-800" // Estilo original del usuario para escritorio

  // Clases condicionales para los enlaces
  const linkClasses = isMobile
    ? "text-black hover:text-gray-700 font-medium text-lg" // Estilo para móvil: texto negro, negrita, más grande
    : "hover:text-[#6D8B37] transition-colors" // Estilo original del usuario para escritorio

  return (
    <ul className={ulClasses}>
      <li>
        <Link to="/" hash="AboutUsPage" className={linkClasses} onClick={onLinkClick}>
          Sobre Nosotros
        </Link>
      </li>
      <li>
        <Link to="/" hash="EventsPage" className={linkClasses} onClick={onLinkClick}>
          Eventos
        </Link>
      </li>
      <li>
        <Link to="/" hash="ServicesPage" className={linkClasses} onClick={onLinkClick}>
          Servicios
        </Link>
      </li>
      {/* NavbarDropdown se incluye aquí */}
      <NavbarDropdown isMobile={isMobile} onLinkClick={onLinkClick} />
    </ul>
  )
}
