import { Users, Target, Eye } from "lucide-react";

export default function AboutUsPage() {
  return (
    <section className="min-h-screen relative overflow-hidden text-white">
      {/* Fondo de imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-100"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dqaseydi6/image/upload/v1753402786/WhatsApp_Image_2025-07-24_at_18.19.27_dd624d07_ve0ior.jpg')",
        }}
      />
      {/* Overlay oscuro para contraste */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d2e00]/80 via-[#5a4500]/70 to-[#f5ecd9]/30" />

      {/* Elementos decorativos animados */}
      <div className="absolute inset-0">
        <div className="absolute top-24 left-12 w-72 h-72 bg-[#fcd34d]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#facc15]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#f5ecd9]/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-12 pt-20 px-4">
        {/* Título y descripción */}
        <div className="text-center">
          <h2 className="text-5xl font-bold text-[#fefae0]">Sobre Nosotros</h2>
          <p className="text-lg text-[#fefae0]/80 mt-4 max-w-3xl mx-auto">
            Asociación Cámara de Ganaderos de Hojancha: compromiso con el bienestar animal,
            el desarrollo rural y la innovación sostenible en el sector pecuario.
          </p>
        </div>

        {/* Nuestra Historia */}
        <div className="bg-gradient-to-br from-[#f9efdc] to-[#f5e8ce] p-10 rounded-2xl shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-400 rounded-xl mr-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Nuestra Historia</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            La Cámara de Ganaderos es una organización que representa los intereses del sector pecuario,
            promoviendo el desarrollo sostenible, la innovación y la colaboración entre productores,
            profesionales y comunidades rurales.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Misión */}
          <div className="bg-gradient-to-br from-[#fcf4de] to-[#fdf7e5] rounded-xl p-8 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-yellow-400 rounded-xl mr-4">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nuestra Misión</h3>
            </div>
            <p className="text-gray-800 leading-relaxed">
              Impulsar el bienestar animal, la productividad ganadera y el desarrollo rural mediante acciones
              técnicas, educativas y de representación gremial.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-gradient-to-br from-[#fcf4de] to-[#fdf7e5] rounded-xl p-8 shadow-md transition-transform transform hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-yellow-400 rounded-xl mr-4">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Nuestra Visión</h3>
            </div>
            <p className="text-gray-800 leading-relaxed">
              Ser la entidad líder en apoyo al sector ganadero nacional, reconocida por su compromiso,
              innovación y contribución al desarrollo sostenible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
