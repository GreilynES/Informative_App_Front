
import { Phone, Mail, Facebook, Clock4 } from 'lucide-react'
import { contact, quickLinks, schedule } from '../components/Footer/FooterCard'


export default function FooterPage() {
  return (
    <footer className="bg-gradient-to-br from-[#2D2D2D] via-[#1C1C1C] to-black text-white">
      <div className="max-w-7xl mx-auto px-18 py-20 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* LOGO + NOMBRE */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <img src="/logo-camara.png" alt="Logo Cámara" className="w-16 mb-2" />
          <p className="text-sm font-semibold text-gray-200 text-center md:text-left leading-tight">
            Cámara de Ganaderos<br />Hojancha
          </p>
          <p className="text-xs text-gray-400 text-center md:text-left leading-relaxed">
            Promoviendo el desarrollo sostenible del sector ganadero con innovación y compromiso.
          </p>
        </div>

        {/* CONTACTO */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-200">Contacto</h3>
          <div className="h-px w-24 bg-[#333] mt-1"></div>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-[#6D8B37]" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-[#6D8B37]" />
            <span>{contact.email}</span>
          </div>
          <a
            href={contact.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#6D8B37] transition-colors"
          >
            <Facebook className="w-5 h-5 text-[#6D8B37]" />
            <span>{contact.facebook.name}</span>
          </a>
        </div>

        {/* ENLACES RÁPIDOS */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-200">Enlaces Rápidos</h3>
          <div className="h-px w-24 bg-[#333] mt-1"></div>
          <ul className="text-sm space-y-2 text-gray-300">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:underline hover:text-[#6D8B37] transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* HORARIO */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-200">Horario</h3>
          <div className="h-px w-24 bg-[#333] mt-1"></div>
          <div className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
            <Clock4 className="w-4 h-4 mt-1 text-[#6D8B37]" />
            <div>
              <p className="font-semibold">{schedule.title}</p>
              <p>{schedule.location}</p>
              <p>{schedule.days}</p>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-[#333] text-center py-5 text-xs text-gray-500">
        © {new Date().getFullYear()} <span className="text-[#D8B769] font-semibold">Sistema CGH</span>  Todos los derechos reservados.
      </div>
    </footer>
  )
}
