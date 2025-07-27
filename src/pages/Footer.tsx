import React from 'react'
import { Phone, Mail, Facebook, Clock4 } from 'lucide-react'

export default function FooterPage() {
  return (
    <footer className="bg-gradient-to-br from-[#2D2D2D] via-[#1C1C1C] to-black text-white">
      <div className="max-w-7xl mx-auto px-18 py-20 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO + NOMBRE */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <img
            src="/logo-camara.png"
            alt="Logo Cámara"
            className="w-16 mb-2"
          />
          <p className="text-sm font-semibold text-gray-200 text-center md:text-left leading-tight">
            Cámara de Ganaderos<br />Hojancha
          </p>
          <p className="text-xs text-gray-400 text-center md:text-left leading-relaxed">
            Promoviendo el desarrollo sostenible del sector ganadero con innovación y compromiso.
          </p>
        </div>

        {/* CONTACTO */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#D8B769]">Contacto</h3>
            <div className="h-px w-24 bg-[#333] mt-1"></div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-[#6D8B37]" />
            <span>83770589</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-[#6D8B37]" />
            <span>camaradeganaderos@gmail.com</span>
          </div>
          <a
            href="https://www.facebook.com/Cámara Ganaderos Hojancha"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#D8B769] transition-colors"
          >
            <Facebook className="w-5 h-5 text-[#6D8B37]" />
            <span>Cámara de Ganaderos de Hojancha</span>
          </a>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#D8B769]">Enlaces Rápidos</h3>
            <div className="h-px w-24 bg-[#333] mt-1"></div>
          </div>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>
              <a href="#AboutUsPage" className="hover:underline hover:text-[#6D8B37] transition-colors">Sobre Nosotros</a>
            </li>
            <li>
              <a href="#EventsPage" className="hover:underline hover:text-[#6D8B37] transition-colors">Eventos</a>
            </li>
            <li>
              <a href="#ServicesPage" className="hover:underline hover:text-[#6D8B37] transition-colors">Servicios</a>
            </li>
            <li>
              <a href="#FormsPage" className="hover:underline hover:text-[#6D8B37] transition-colors">Formularios</a>
            </li>
          </ul>
        </div>

        {/* HORARIO */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#D8B769]">Horario</h3>
            <div className="h-px w-24 bg-[#333] mt-1"></div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
            <Clock4 className="w-4 h-4 mt-1 text-[#6D8B37]" />
            <div>
              <p className="font-semibold">Administrativo</p>
              <p>Hojancha: Lunes a Sábado</p>
              <p>7:00 am - 5:00 pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-[#333] text-center py-5 text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="text-[#D8B769] font-semibold">Sistema CGH</span> – Todos los derechos reservados.
      </div>
    </footer>
  )
}
