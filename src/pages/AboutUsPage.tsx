import { Users, Target, Eye } from "lucide-react"
import { aboutUs } from "../models/AboutUsType" // Asegúrate que este sea el path correcto

export default function AboutUsPage() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dqaseydi6/image/upload/v1753402786/WhatsApp_Image_2025-07-24_at_18.19.27_dd624d07_ve0ior.jpg')",
        }}
      />

      {/* Overlay con verdes institucionales */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3E4E1A]/90 via-[#4F6822]/70 to-[#6F8C1F]/60" />

      {/* Círculos decorativos */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-12 w-72 h-72 bg-[#BFD76F]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F2EAB8]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D8E8B5]/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 py-20 space-y-12">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Sobre Nosotros</h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Asociación Cámara de Ganaderos de Hojancha: compromiso con el bienestar animal, el desarrollo rural y la
            innovación sostenible en el sector pecuario.
          </p>
        </div>

        {/* Historia */}
        <div className="bg-[#FAFDF4]/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#DDE9BB] transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex items-center mb-6">
            <div className="p-4 bg-[#6F8C1F] rounded-xl mr-6 shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E321B]">{aboutUs[0].title}</h3>
          </div>
          <p className="text-[#475C1D] leading-relaxed text-lg">{aboutUs[0].description}</p>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Misión */}
          <div className="bg-[#FAFDF4]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#DDE9BB] transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#6F8C1F] rounded-xl mr-4 shadow-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2E321B]">{aboutUs[1].title}</h3>
            </div>
            <p className="text-[#475C1D] leading-relaxed">{aboutUs[1].description}</p>
          </div>

          {/* Visión */}
          <div className="bg-[#FAFDF4]/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-[#DDE9BB] transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-[#6F8C1F] rounded-xl mr-4 shadow-lg">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2E321B]">{aboutUs[2].title}</h3>
            </div>
            <p className="text-[#475C1D] leading-relaxed">{aboutUs[2].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
