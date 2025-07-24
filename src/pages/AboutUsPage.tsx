import { Eye, Target } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-neutral-100 py-16 px-6 text-gray-800">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-lime-800">Sobre Nosotros</h1>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-center">
        {/* Historia */}
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center justify-between text-center max-w-[600px] w-full">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-lime-800 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-md">
              La Cámara de Ganaderos es una organización que representa los intereses del
              sector pecuario, promoviendo el desarrollo sostenible, la innovación y la
              colaboración entre productores, profesionales y comunidades rurales.
            </p>
          </div>
          <div className="mt-6 w-20 h-1 bg-lime-600 rounded-full" />
        </div>

        {/* Misión y Visión */}
        <div className="flex flex-col gap-8 flex-1 w-full justify-between">
          {/* Misión */}
          <div className="rounded-2xl shadow-lg p-8 bg-gradient-to-r from-lime-600 to-green-500 text-white flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Nuestra Misión</h3>
            </div>
            <p className="text-white text-lg leading-relaxed">
              Impulsar el bienestar animal, la productividad ganadera y el desarrollo rural
              mediante acciones técnicas, educativas y de representación gremial.
            </p>
          </div>

          {/* Visión */}
          <div className="rounded-2xl shadow-lg p-8 bg-gradient-to-r from-green-500 to-lime-600 text-white flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Nuestra Visión</h3>
            </div>
            <p className="text-white text-lg leading-relaxed">
              Ser la entidad líder en apoyo al sector ganadero nacional, reconocida por su
              compromiso, innovación y contribución al desarrollo sostenible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
