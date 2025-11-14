import { Users, Target, Eye } from "lucide-react";
import { AboutUsCard } from "./components/AboutUsCard";
import AboutUsBackground from "./components/AboutUsBackground";
import { useAboutUs } from "./hooks/useAboutUs";

function normalize(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default function AboutUsPage() {
  const { data: aboutUs = [], isLoading } = useAboutUs();

  // Muestra "Cargando..." solo si además no hay data todavía
  if (isLoading && aboutUs.length === 0) {
    return (
      <section className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <AboutUsBackground />
        <p className="relative z-10 text-center text-white text-2xl font-semibold">Cargando...</p>
      </section>
    );
  }

  // Match robusto por si vienen títulos con/sin tildes
  const getByTitle = (needle: string) =>
    aboutUs.find((item) => normalize(item.title).includes(normalize(needle)));

  const somos  = getByTitle("Quiénes Somos") || getByTitle("Quienes Somos") || getByTitle("Somos");
  const mision = getByTitle("Misión") || getByTitle("Mision");
  const vision = getByTitle("Visión") || getByTitle("Vision");

  return (
    <section id="AboutUsPage" className="min-h-screen relative overflow-hidden">
      {/* Background - Fixed para evitar parpadeos */}
      <div className="absolute inset-0 will-change-transform">
        <AboutUsBackground />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#FAFDF4] mb-6 drop-shadow-[2px_3px_6px_rgba(20,20,20,1)]">
            Sobre Nosotros
          </h2>
          <p className="text-xl font-semibold text-[#FAFDF4] max-w-3xl mx-auto leading-relaxed drop-shadow-[1px_2px_4px_rgba(30,30,30,0.9)]">
            Asociación Cámara de Ganaderos de Hojancha: compromiso con el bienestar animal, el desarrollo rural y la
            innovación sostenible en el sector pecuario.
          </p>
        </div>

        {/* Historia */}
        {somos && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AboutUsCard
              icon={<Users className="w-6 h-6 text-white" />}
              title={somos.title}
              description={somos.description}
            />
          </div>
        )}

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8">
          {mision && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
              <AboutUsCard
                icon={<Target className="w-5 h-5 text-white" />}
                title={mision.title}
                description={mision.description}
              />
            </div>
          )}
          {vision && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
              <AboutUsCard
                icon={<Eye className="w-5 h-5 text-white" />}
                title={vision.title}
                description={vision.description}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}