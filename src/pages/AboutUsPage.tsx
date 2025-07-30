import { Users, Target, Eye } from "lucide-react"
import { useAboutUs } from "../hooks/useAboutUs"
import { AboutUsCard } from "../components/AboutUs/AboutUsCard"
import AboutUsBackground from "../components/AboutUs/AboutUsBackground"

export default function AboutUsPage() {
  const { data: aboutUs = [], isLoading } = useAboutUs()

  if (isLoading) return <p className="text-center text-white">Cargando...</p>

  const historia = aboutUs.find((item) => item.title.includes("Historia"))
  const mision = aboutUs.find((item) => item.title.includes("Misión"))
  const vision = aboutUs.find((item) => item.title.includes("Visión"))

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <AboutUsBackground />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-2 py-20 space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#FAFDF4] mb-6 filter drop-shadow-[2px_3px_6px_rgba(20,20,20,1)]">
            Sobre Nosotros
          </h2>
          <p className="text-xl font-semibold text-[#FAFDF4] max-w-3xl mx-auto leading-relaxed filter drop-shadow-[1px_2px_4px_rgba(30,30,30,0.9)]">
            Asociación Cámara de Ganaderos de Hojancha: compromiso con el bienestar animal, el desarrollo rural y la
            innovación sostenible en el sector pecuario.
          </p>
        </div>

        {/* Historia */}
        {historia && (
          <AboutUsCard
            icon={<Users className="w-6 h-6 text-white" />}
            title={historia.title}
            description={historia.description}
          />
        )}

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8">
          {mision && (
            <AboutUsCard
              icon={<Target className="w-5 h-5 text-white" />}
              title={mision.title}
              description={mision.description}
            />
          )}
          {vision && (
            <AboutUsCard
              icon={<Eye className="w-5 h-5 text-white" />}
              title={vision.title}
              description={vision.description}
            />
          )}
        </div>
      </div>
    </section>
  )
}
