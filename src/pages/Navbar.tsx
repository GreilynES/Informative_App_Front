import { ShieldUser, ChevronDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

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
    <nav className="sticky top-0 w-full z-50 bg-white text-black px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/">
          <img
            src="https://scontent.fsjo10-1.fna.fbcdn.net/v/t39.30808-6/344308804_248819884498419_3417268054519992459_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=DXCASBOuGL0Q7kNvwEIMeFk&_nc_oc=AdlO3psBNz83VN2OLUAnjOTGcLdRnRiyeiKBpXXqZBDlr8ziB1nVc3ExlzviMcbmM7U&_nc_zt=23&_nc_ht=scontent.fsjo10-1.fna&_nc_gid=j1fEJI4JgSKGA73_nFmAHQ&oh=00_AfQw-l5l-HUNN6s3nj6uZvyCiANbt8zXl1i59zRn7kbW1A&oe=687E45D2"
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover"
          />
        </a>

        <div className="flex items-center space-x-8 ml-auto">
          <ul className="flex space-x-6 text-lg font-medium ml-auto">
            <li>
              <a href="#AboutUsPage" className="hover:underline">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="#EventsPage" className="hover:underline">
                Eventos
              </a>
            </li>
            <li>
              <a href="#ServicesPage" className="hover:underline">
                Servicios
              </a>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="hover:underline focus:outline-none flex items-center gap-1"
              >
                Formularios
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-white text-black shadow-lg rounded z-10">
                  <li>
                    <a
                      href="/forms/volunteers"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Voluntarios
                    </a>
                  </li>
                  <li>
                    <a
                      href="/forms/asociados"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Asociados
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <button className="text-black px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
            <a href="/login" className="text-lg font-semibold">
              <ShieldUser />
            </a>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
