import React from 'react'
import { Phone, Mail, Facebook, Clock4 } from 'lucide-react'

export default function FooterPage() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO + NOMBRE */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/logo-camara.png"
            alt="Logo Cámara"
            className="w-16 mb-2"
          />
          <p className="text-sm font-medium text-center md:text-left text-gray-300">
            Cámara de Ganaderos<br />Hojancha
          </p>
          <p className="text-xs text-gray-500 mt-3 text-center md:text-left">
            Promoviendo el desarrollo sostenible del sector ganadero con innovación y compromiso.
          </p>
        </div>

        {/* CONTACTO */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-600">Contacto</h3>
            <div className="h-px w-24 bg-neutral-800 mt-1"></div>
          </div>
          <div className="flex items-center gap-2 text-sm mb-2 text-gray-300">
            <Phone className="w-4 h-4 text-green-600" />
            <span>83770589</span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-2 text-gray-300">
            <Mail className="w-4 h-4 text-green-600" />
            <span>camaradeganaderos@gmail.com</span>
          </div>
          <a
            href="https://www.facebook.com/Cámara Ganaderos Hojancha"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-3 text-sm text-gray-300 hover:text-green-500 transition-colors"
          >
            <Facebook className="w-5 h-5 text-green-600" />
            <span>Cámara de Ganaderos de Hojancha</span>
          </a>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-600">Enlaces Rápidos</h3>
            <div className="h-px w-24 bg-neutral-800 mt-1"></div>
          </div>
          <ul className="text-sm space-y-2 text-gray-300">
            <li><a href="#AboutUsPage" className="hover:underline hover:text-green-500 transition-colors">Sobre Nosotros</a></li>
            <li><a href="#EventsPage" className="hover:underline hover:text-green-500 transition-colors">Eventos</a></li>
            <li><a href="#ServicesPage" className="hover:underline hover:text-green-500 transition-colors">Servicios</a></li>
            <li><a href="#FormsPage" className="hover:underline hover:text-green-500 transition-colors">Formularios</a></li>
          </ul>
        </div>

        {/* HORARIO */}
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-600">Horario</h3>
            <div className="h-px w-24 bg-neutral-800 mt-1"></div>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <Clock4 className="w-4 h-4 mt-1 text-green-600" />
            <div>
              <p className="font-semibold">Administrativo</p>
              <p>Hojancha: Lunes a Sábado</p>
              <p>7:00 am - 5:00 pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-neutral-800 text-center py-4 text-xs text-gray-500">
        Copyright 2025 ©Sistema CGH, derechos reservados
      </div>
    </footer>
  )
}
