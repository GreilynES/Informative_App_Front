import { Eye, Target } from "lucide-react"
import { aboutUs } from "../models/AboutUsType"

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen bg-neutral-100 py-20 px-6 text-gray-800 overflow-hidden">

      {/* Imagen de fondo con Tailwind */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dqaseydi6/image/upload/v1753402786/WhatsApp_Image_2025-07-24_at_18.19.27_dd624d07_ve0ior.jpg')] bg-cover bg-center opacity-50 blur-[2px]" />

      {/* Contenido */}
      <div className="relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-lime-800 mb-4">Sobre Nosotros</h1>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-stretch justify-center">
          {/* Historia */}
          <div className="bg-white/50 backdrop-blur-md backdrop-saturate-150 border border-white/20 rounded-2xl shadow-lg p-10 flex flex-col items-center justify-between text-center max-w-[600px] w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-lime-800 mb-4">
                {aboutUs[0].title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed max-w-md">
                {aboutUs[0].description}
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
                <h3 className="text-xl md:text-2xl font-bold">{aboutUs[1].title}</h3>
              </div>
              <p className="text-white text-lg leading-relaxed">{aboutUs[1].description}</p>
            </div>

            {/* Visión */}
            <div className="rounded-2xl shadow-lg p-8 bg-gradient-to-r from-green-500 to-lime-600 text-white flex flex-col justify-between h-full">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">{aboutUs[2].title}</h3>
              </div>
              <p className="text-white text-lg leading-relaxed">{aboutUs[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
