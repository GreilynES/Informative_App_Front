import React from 'react'
import { Phone, Mail, Facebook, Clock4 } from 'lucide-react'

export default function FooterPage() {
  return (
    <footer className="bg-black border-t border-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* LOGO + NOMBRE */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/logo-camara.png"
            alt="Logo Cámara"
            className="w-16 mb-2"
          />
          <p className="text-sm font-medium text-center md:text-left">
            Cámara de Ganaderos Hojancha
          </p>
        </div>

        {/* CONTACTO + REDES */}
        <div>
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-600 pb-1">
            Contacto
          </h3>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Phone className="w-4 h-4 text-white" />
            <span>83770589</span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <Mail className="w-4 h-4 text-white" />
            <span>camaradeganaderos@gmail.com</span>
          </div>

          {/* Redes sociales con línea debajo */}
          <div className="pt-3 mt-3">
            <p className="text-sm font-semibold mb-4 border-b border-gray-600 pb-1">
              Redes sociales
            </p>
            <a
              href="https://www.facebook.com/Cámara Ganaderos Hojancha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-2 hover:underline"
            >
              <Facebook className="w-5 h-5 text-white" />
              <span className="text-sm">Cámara de Ganaderos de Hojancha</span>
              </a>
          </div>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-600 pb-1">
            Enlaces Rápidos
          </h3>
          <ul className="text-sm space-y-2">
            <li><a href="#AboutUsPage" className="hover:underline">Sobre Nosotros</a></li>
            <li><a href="#EventsPage" className="hover:underline">Eventos</a></li>
            <li><a href="#ServicesPage" className="hover:underline">Servicios</a></li>
            <li><a href="#FormsPage" className="hover:underline">Formularios</a></li>
          </ul>
        </div>

        {/* HORARIO */}
        <div>
          <h3 className="text-sm font-semibold mb-4 border-b border-gray-600 pb-1">
            Horario
          </h3>
          <div className="flex items-start gap-2 text-sm">
            <Clock4 className="w-4 h-4 mt-1 text-white" />
            <div>
              <p className="font-semibold">Administrativo</p>
              <p>Hojancha: Lunes a Sábado</p>
              <p>7:00 am - 5:00 pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-400">
        Copyright 2025 ©Sistema CGH, derechos reservados
      </div>
    </footer>
  )
}
