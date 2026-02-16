import { Phone, Mail, Facebook, Clock4 } from "lucide-react"
import { contact, quickLinks, schedule } from "./FooterCard"

export default function FooterPage() {
  return (
    <footer className="bg-gradient-to-br from-[#2D2D2D] via-[#1C1C1C] to-black text-white">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" />

      <div className="relative z-10">
        <div
          id="Footer"
          className="max-w-7xl mx-auto px-6 md:px-16 py-20 grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {/* LOGO */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <img src="/logo-camara.png" alt="Logo Cámara" className="w-16 mb-2" />
            <p className="text-sm font-semibold text-white text-center md:text-left leading-tight">
              Cámara de Ganaderos<br />Hojancha
            </p>
            <p className="text-xs text-gray-200 text-center md:text-left leading-relaxed max-w-xs">
              Promoviendo el desarrollo sostenible del sector ganadero con innovación y compromiso.
            </p>
          </div>

          {/* CONTACTO */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-white">
              Contacto
            </h3>
            <div className="h-px w-24 bg-white/30 mx-auto md:mx-0" />

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-200">
              <Phone className="w-4 h-4 text-[#6D8B37]" />
              <span>{contact.phone}</span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-200">
              <Mail className="w-4 h-4 text-[#6D8B37]" />
              <span>{contact.email}</span>
            </div>

            <a
              href={contact.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-200 hover:text-[#6D8B37] transition-colors"
            >
              <Facebook className="w-5 h-5 text-[#6D8B37]" />
              <span>{contact.facebook.name}</span>
            </a>
          </div>

          {/* ENLACES */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-white">
              Enlaces Rápidos
            </h3>
            <div className="h-px w-24 bg-white/30 mx-auto md:mx-0" />

            <ul className="text-sm space-y-2 text-gray-200">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-[#6D8B37] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* HORARIO */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-xs tracking-[0.25em] uppercase font-semibold text-white">
              Horario
            </h3>
            <div className="h-px w-24 bg-white/30 mx-auto md:mx-0" />

            <div className="flex flex-col gap-3 text-sm text-gray-200">
              <div className="flex items-start justify-center md:justify-start gap-2">
                <Clock4 className="w-4 h-4 mt-1 text-[#6D8B37]" />
                <div className="text-left">
                  <p className="font-semibold">{schedule.title}</p>
                  <p>{schedule.location}</p>
                </div>
              </div>

              <div className="flex items-start justify-center md:justify-start gap-2">
                <Clock4 className="w-4 h-4 mt-1 text-[#6D8B37]" />
                <div className="text-left">
                  <p>{schedule.days}</p>
                  <p>{schedule.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria elegante */}
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="h-px w-full bg-white/20" />
        </div>

        {/* COPYRIGHT */}
        <div className="text-center py-6 text-xs text-gray-300">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#D8B769] font-semibold">Sistema CGH</span>{" "}
          Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
