import { Building2, Heart } from 'lucide-react' // Asegúrate de tener instalada lucide-react

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-neutral-100 text-gray-800 py-16 px-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-lime-800 mb-4">Únete a Nuestra Comunidad</h1>
        <p className="text-xl text-gray-600">
          Elige el tipo de participación que mejor se adapte a tus objetivos y disponibilidad.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-10 max-w-6xl mx-auto">
        {/* ASOCIADOS */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-amber-200 text-lime-700 p-4 rounded-full">
              <Building2 size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-lime-800 uppercase mb-2">Asociados</h2>
          <p className="text-gray-600 mb-6 text-base">Membresía oficial con derechos y beneficios</p>
          <div className="bg-amber-100 text-lime-900 p-4 rounded-lg text-lg mb-6">
            Como asociado tendrás acceso completo a todos nuestros servicios, derecho a voto en asambleas,
            participación en la toma de decisiones y acceso a beneficios exclusivos para miembros.
          </div>
          <button className="bg-lime-800 hover:bg-lime-900 text-white px-6 py-2 rounded-md text-lg font-medium flex items-center justify-center gap-2 mx-auto">
            Formulario
            <span>→</span>
          </button>
        </div>

        {/* VOLUNTARIOS */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 text-green-600 p-4 rounded-full">
              <Heart size={40} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 uppercase mb-2">Voluntarios</h2>
          <p className="text-gray-600 mb-6 text-base">Colaboración flexible en proyectos específicos</p>
          <div className="bg-green-50 text-green-900 p-4 rounded-lg text-lg mb-6">
            Como voluntario podrás colaborar en nuestros proyectos sociales, participar en actividades comunitarias
            y contribuir con tu tiempo y habilidades según tu disponibilidad.
          </div>
          <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md text-lg font-medium flex items-center justify-center gap-2 mx-auto">
            Formulario
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
