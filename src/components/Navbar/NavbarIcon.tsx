import { User } from 'lucide-react'

const NavbarLoginIcon = ({ isMobile = false }: any) => {
  // Clases condicionales para el icono
  const iconClasses = isMobile ? "h-8 w-8" : "h-6 w-6" // Icono más grande en móvil

  return (
    <a href="#" className="text-gray-800 hover:text-gray-700">
      <User className={iconClasses} />
    </a>
  )
}

export default NavbarLoginIcon
