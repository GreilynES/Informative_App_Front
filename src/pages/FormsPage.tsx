import { ArrowRight, FileText, Heart } from "lucide-react"
import { useRouter } from '@tanstack/react-router'

export default function FormsPage() {
  const router = useRouter()

  return (
    <section className="min-h-screen bg-[#FAFDF4] py-20 px-16">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2E321B] mb-6">
          Forma parte de la Cámara de Ganaderos
        </h2>
        <p className="text-xl text-[#475C1D] max-w-2xl mx-auto">
          Elige el tipo de participación que mejor se adapte a tus objetivos y disponibilidad. Juntos construimos el
          futuro del sector ganadero.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
        {/* ASOCIADOS CARD */}
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#A9C86E]/20 to-[#475C1D]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className="p-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#7A944B] to-[#475C1D] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E321B] mb-4">ASOCIADOS</h3>
            <p className="text-[#475C1D] mb-6 leading-relaxed">
              Membresía oficial con derechos y beneficios exclusivos
            </p>
            <div className="bg-gradient-to-r from-[#F9F6EA] to-[#FAF4DA] rounded-xl p-6 mb-6 border border-[#D8B769]/50">
              <p className="text-[#2E321B] leading-relaxed">
                Como asociado tendrás acceso completo a todos nuestros servicios, derecho a voto en asambleas,
                participación en la toma de decisiones y acceso a beneficios exclusivos para miembros.
              </p>
            </div>
            <button
              onClick={() => router.navigate({ to: '/associates' })}
              className="w-full bg-gradient-to-r from-[#7A944B] to-[#475C1D] hover:from-[#6A853E] hover:to-[#3A4D17] text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              Formulario
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* VOLUNTARIOS CARD */}
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E7C56D]/20 to-[#C1A548]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          <div className="p-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#E7C56D] to-[#C1A548] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#2E321B] mb-4">VOLUNTARIOS</h3>
            <p className="text-[#475C1D] mb-6 leading-relaxed">
              Colaboración flexible en proyectos específicos
            </p>
            <div className="bg-gradient-to-br from-[#FDF7E6] to-[#FCF3D6] rounded-xl p-6 mb-6 border border-[#E7C56D]/50">
              <p className="text-[#2E321B] leading-relaxed">
                Como voluntario podrás colaborar en nuestros proyectos sociales, participar en actividades comunitarias y contribuir con tu tiempo y habilidades según tu disponibilidad.
              </p>
            </div>
            <button
              onClick={() => router.navigate({ to: '/volunteers' })}
              className="w-full bg-gradient-to-r from-[#E7C56D] to-[#C1A548] hover:from-[#DAB45B] hover:to-[#A9882A] text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              Formulario
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
