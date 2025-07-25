import { Eye, Target, Users } from "lucide-react";
import { aboutUs } from "../models/AboutUsType";
import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-100 text-white">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/dqaseydi6/image/upload/v1753402786/WhatsApp_Image_2025-07-24_at_18.19.27_dd624d07_ve0ior.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-lime-900/80 via-green-800/70 to-emerald-900/60" />

      {/* Elementos animados decorativos */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-12 w-72 h-72 bg-lime-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Encabezado */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-lime-200 to-emerald-100 bg-clip-text text-transparent mb-6">
            Sobre Nosotros
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Asociación Cámara de Ganaderos de Hojancha: compromiso con el bienestar animal, el desarrollo rural y la innovación sostenible en el sector pecuario.
          </p>
        </div>

        {/* Secciones */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Historia */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="h-full bg-white/90 text-gray-800 backdrop-blur-lg rounded-2xl shadow-2xl hover:shadow-3xl transition hover:scale-[1.02] p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Nuestra Historia</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{aboutUs[0].description}</p>
            </div>
          </div>

          {/* Misión */}
          <div className="lg:col-span-2 space-y-8">
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="bg-gradient-to-r from-green-600 via-emerald-700 to-lime-700 rounded-2xl shadow-2xl hover:shadow-3xl transition hover:scale-[1.02] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{aboutUs[1].title}</h2>
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg">{aboutUs[1].description}</p>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="bg-gradient-to-r from-lime-600 via-green-700 to-emerald-700 rounded-2xl shadow-2xl hover:shadow-3xl transition hover:scale-[1.02] p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-28 h-28 bg-white/10 rounded-full -translate-y-14 -translate-x-14" />
                <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/5 rounded-full translate-y-20 translate-x-20" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{aboutUs[2].title}</h2>
                  </div>
                  <p className="text-white/90 leading-relaxed text-lg">{aboutUs[2].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
